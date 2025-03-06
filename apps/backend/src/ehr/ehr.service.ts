import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EHR, PrismaClient } from '@prisma/client';
// import { CreateEhrDto } from './dto/create-ehr.dto';
import { CreateEhrDto } from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDtoWithMappings } from '@repo/api/links/dto/update.ehr.dto';
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
    updateEhrDto: UpdateEhrDtoWithMappings,
  ): Promise<EHRWithMappings> {
    const { mappings, ...ehrData } = updateEhrDto;

    // First update the EHR data
    await this.prisma.eHR.update({
      where: { id },
      data: ehrData,
    });

    // Then handle mappings separately
    if (mappings && mappings.length > 0) {
      // Delete existing mappings
      await this.prisma.eHRMapping.deleteMany({
        where: { ehrId: id },
      });

      // Filter out mappings with missing required fields and create new ones
      const validMappings = mappings
        .filter(
          (mapping) =>
            mapping.entityType &&
            mapping.fieldName &&
            mapping.mappingPath &&
            mapping.dataType &&
            mapping.required &&
            mapping.apiEndpoint,
        )
        .map((mapping) => ({
          ehrId: id,
          entityType: mapping.entityType!,
          fieldName: mapping.fieldName!,
          mappingPath: mapping.mappingPath!,
          dataType: mapping.dataType!,
          required: mapping.required ?? true,
          apiEndpoint: mapping.apiEndpoint || null,
        }));

      if (validMappings.length > 0) {
        await this.prisma.eHRMapping.createMany({
          data: validMappings,
        });
      }
    }

    // Return the updated EHR with mappings
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} ehr`;
  }
}
