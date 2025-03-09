import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Form } from '@prisma/client';
import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  async create(createFormDto: CreateFormDto): Promise<Form | null> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createFormDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createFormDto.userId} not found`,
      );
    }

    // Check if user already has a form
    const existingForm = await this.prisma.form.findUnique({
      where: { userId: createFormDto.userId },
    });

    if (existingForm) {
      throw new BadRequestException(
        `User with ID ${createFormDto.userId} already has a form assigned`,
      );
    }

    // Check if EHR exists
    const ehr = await this.prisma.eHR.findUnique({
      where: { id: createFormDto.ehrId },
      include: { mappings: true },
    });

    if (!ehr) {
      throw new NotFoundException(
        `EHR with ID ${createFormDto.ehrId} not found`,
      );
    }

    // Create form with questions
    return this.prisma.form.create({
      data: {
        name: createFormDto.name,
        status: createFormDto.status,
        user: {
          connect: { id: createFormDto.userId },
        },
        ehr: {
          connect: { id: createFormDto.ehrId },
        },
        questions: {
          create: createFormDto.questions.map((question) => ({
            mapping: {
              connect: { id: question.mappingId },
            },
            value: question.value,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
  }

  async findAll(): Promise<Form[]> {
    return this.prisma.form.findMany({
      include: {
        questions: true,
      },
    });
  }

  async findOne(id: string): Promise<Form | null> {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    return form;
  }

  async findByUser(userId: string): Promise<Form | null> {
    const form = await this.prisma.form.findUnique({
      where: { userId },
      include: {
        questions: true,
      },
    });

    if (!form) {
      throw new NotFoundException(`Form for user with ID ${userId} not found`);
    }

    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form | null> {
    // Check if form exists
    const existingForm = await this.prisma.form.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!existingForm) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    // Update form
    const updateData: any = {};

    if (updateFormDto.name) updateData.name = updateFormDto.name;
    if (updateFormDto.status) updateData.status = updateFormDto.status;

    // Handle questions update if provided
    if (updateFormDto.questions && updateFormDto.questions.length > 0) {
      // Delete existing questions and create new ones
      await this.prisma.formQuestion.deleteMany({
        where: { formId: id },
      });

      // Create new questions
      await Promise.all(
        updateFormDto.questions.map((question) =>
          this.prisma.formQuestion.create({
            data: {
              form: {
                connect: { id },
              },
              mapping: {
                connect: { id: question.mappingId },
              },
              value: question.value,
            },
          }),
        ),
      );
    }

    // Update form
    return this.prisma.form.update({
      where: { id },
      data: updateData,
      include: {
        questions: true,
      },
    });
  }

  async remove(id: string) {
    // Check if form exists
    const existingForm = await this.prisma.form.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    // Delete form (questions will be deleted automatically due to cascade)
    return this.prisma.form.delete({
      where: { id },
    });
  }
}
