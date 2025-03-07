import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EHR, PrismaClient } from '@prisma/client';
// import { CreateEhrDto } from './dto/create-ehr.dto';
import { CreateEhrDto } from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDto } from '@repo/api/links/dto/update.ehr.dto';
import { EHRWithMappings } from './entities/ehr.entity';
@Injectable()
export class EhrService {
  private prisma = new PrismaClient();

  async create(createEhrDto: CreateEhrDto): Promise<EHR> {
    const existingEhr = await this.prisma.eHR.findUnique({
      where: {
        name: createEhrDto.name,
      },
    });

    if (existingEhr) {
      throw new ConflictException('EHR already exists');
    }

    const { mappings, ...ehrData } = createEhrDto;

    const ehr = await this.prisma.eHR.create({
      data: {
        ...ehrData,
        mappings: {
          create: mappings,
        },
      },
      include: {
        mappings: true,
      },
    });

    return ehr;
  }

  async findAll(): Promise<EHR[]> {
    return this.prisma.eHR.findMany();
  }

  async findAllWithMappings(): Promise<EHRWithMappings[]> {
    return this.prisma.eHR.findMany({
      include: {
        mappings: true,
      },
    });
  }

  async findOne(id: string): Promise<EHRWithMappings> {
    const ehr = await this.prisma.eHR.findUnique({
      where: {
        id,
      },
      include: {
        mappings: true,
      },
    });

    if (!ehr) {
      throw new NotFoundException('EHR not found');
    }

    return ehr;
  }

  async update(
    id: string,
    updateEhrDto: UpdateEhrDto,
  ): Promise<EHRWithMappings> {
    const { mappings: payloadMappings, ...ehrData } = updateEhrDto;

    // Get the existing EHR
    const existingEhr = await this.prisma.eHR.findUnique({
      where: { id },
      include: {
        mappings: true,
      },
    });

    if (!existingEhr) {
      throw new NotFoundException('EHR not found');
    }

    // If the EHR has no mappings, throw an error should have at least one mapping
    if (updateEhrDto.mappings.length === 0) {
      throw new ConflictException('EHR should have at least one mapping');
    }

    // Get the existing mappings from database
    const existingMappings = await this.prisma.eHRMapping.findMany({
      where: { ehrId: id },
    });

    // Get the mappings that are not in the updateEhrDto
    const mappingsToDelete = existingMappings.filter(
      ({ id }) =>
        !payloadMappings.some(({ id: mappingId }) => mappingId === id),
    );

    // Delete the mappings that are not in the updateEhrDto
    await this.prisma.eHRMapping.deleteMany({
      where: { id: { in: mappingsToDelete.map((mapping) => mapping.id) } },
    });

    // Update the mappings that are in the updateEhrDto
    const updatedMappings = await Promise.all(
      payloadMappings.map((mapping) => {
        const { id: mappingId, ...rest } = mapping;
        if (mappingId) {
          return this.prisma.eHRMapping.update({
            where: { id: mappingId },
            data: { ...rest },
          });
        } else {
          return this.prisma.eHRMapping.create({
            data: { ...rest, ehrId: id },
          });
        }
      }),
    );

    const updatedEhr = await this.prisma.eHR.update({
      where: { id },
      data: ehrData,
      include: {
        mappings: true,
      },
    });

    return updatedEhr;
  }

  async remove(id: string) {
    // Check if the EHR exists
    const ehr = await this.prisma.eHR.findUnique({
      where: { id },
    });

    if (!ehr) {
      throw new NotFoundException('EHR not found');
    }

    return await this.prisma.eHR.delete({
      where: { id },
      include: {
        mappings: true,
      },
    });
  }
}
