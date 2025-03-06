import { ConflictException, Injectable } from '@nestjs/common';
import { EHR, PrismaClient } from '@prisma/client';
// import { CreateEhrDto } from './dto/create-ehr.dto';
import { CreateEhrDto } from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDto } from './dto/update-ehr.dto';
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

  findOne(id: number) {
    return `This action returns a #${id} ehr`;
  }

  update(id: number, updateEhrDto: UpdateEhrDto) {
    return `This action updates a #${id} ehr`;
  }

  remove(id: number) {
    return `This action removes a #${id} ehr`;
  }
}
