import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormStatus } from './entities/form.entity';
import { FormService } from './form.service';

describe('FormService', () => {
  let service: FormService;
  let prismaService: PrismaService;

  // Mock data
  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'patient',
    ehrId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEHR = {
    id: 'ehr-id-1',
    name: 'Test EHR',
    baseUrl: 'https://test-ehr.com',
    authType: 'API_KEY',
    mappings: [
      {
        id: 'mapping-id-1',
        ehrId: 'ehr-id-1',
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient',
      },
    ],
  };

  const mockForm = {
    id: 'form-id-1',
    name: 'Test Form',
    status: FormStatus.pending,
    userId: 'user-id-1',
    ehrId: 'ehr-id-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'question-id-1',
        formId: 'form-id-1',
        mappingId: 'mapping-id-1',
        value: 'test value',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const mockForms = [
    mockForm,
    {
      id: 'form-id-2',
      name: 'Test Form 2',
      status: FormStatus.completed,
      userId: 'user-id-2',
      ehrId: 'ehr-id-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [],
    },
  ];

  const mockCreateFormDto: CreateFormDto = {
    name: 'New Form',
    userId: 'user-id-1',
    ehrId: 'ehr-id-1',
    status: 'pending',
    questions: [
      {
        mappingId: 'mapping-id-1',
        value: 'test value',
      },
    ],
  };

  const mockUpdateFormDto: UpdateFormDto = {
    name: 'Updated Form',
    status: 'completed',
    questions: [
      {
        mappingId: 'mapping-id-1',
        value: 'updated value',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            eHR: {
              findUnique: jest.fn(),
            },
            form: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            formQuestion: {
              deleteMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FormService>(FormService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new form with questions', async () => {
      // Mock dependencies
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(mockEHR);
      jest.spyOn(prismaService.form, 'create').mockResolvedValue(mockForm);

      const result = await service.create(mockCreateFormDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateFormDto.userId },
      });
      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { userId: mockCreateFormDto.userId },
      });
      expect(prismaService.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateFormDto.ehrId },
        include: { mappings: true },
      });
      expect(prismaService.form.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateFormDto.name,
          status: mockCreateFormDto.status,
          user: {
            connect: { id: mockCreateFormDto.userId },
          },
          ehr: {
            connect: { id: mockCreateFormDto.ehrId },
          },
          questions: {
            create: mockCreateFormDto.questions.map((question) => ({
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
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.create(mockCreateFormDto)).rejects.toThrow(
        new NotFoundException(
          `User with ID ${mockCreateFormDto.userId} not found`,
        ),
      );
    });

    it('should throw BadRequestException if user already has a form', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(mockForm);

      await expect(service.create(mockCreateFormDto)).rejects.toThrow(
        new BadRequestException(
          `User with ID ${mockCreateFormDto.userId} already has a form assigned`,
        ),
      );
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(null);

      await expect(service.create(mockCreateFormDto)).rejects.toThrow(
        new NotFoundException(
          `EHR with ID ${mockCreateFormDto.ehrId} not found`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of forms', async () => {
      jest.spyOn(prismaService.form, 'findMany').mockResolvedValue(mockForms);

      const result = await service.findAll();

      expect(prismaService.form.findMany).toHaveBeenCalledWith({
        include: {
          questions: true,
        },
      });
      expect(result).toEqual(mockForms);
    });
  });

  describe('findOne', () => {
    it('should return a single form by id', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(mockForm);

      const result = await service.findOne('form-id-1');

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'form-id-1' },
        include: {
          questions: true,
        },
      });
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if form not found', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        new NotFoundException('Form with ID non-existent-id not found'),
      );
    });
  });

  describe('findByUser', () => {
    it('should return a form by user id', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(mockForm);

      const result = await service.findByUser('user-id-1');

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-id-1' },
        include: {
          questions: true,
        },
      });
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if form not found for user', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);

      await expect(service.findByUser('non-existent-user-id')).rejects.toThrow(
        new NotFoundException(
          'Form for user with ID non-existent-user-id not found',
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a form', async () => {
      const updatedForm = {
        ...mockForm,
        name: 'Updated Form',
        status: FormStatus.completed,
      };

      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(mockForm);
      jest
        .spyOn(prismaService.formQuestion, 'deleteMany')
        .mockResolvedValue({ count: 1 });
      jest.spyOn(prismaService.formQuestion, 'create').mockResolvedValue({
        id: 'question-id-1',
        formId: 'form-id-1',
        mappingId: 'mapping-id-1',
        value: 'updated value',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(prismaService.form, 'update').mockResolvedValue(updatedForm);

      const result = await service.update('form-id-1', mockUpdateFormDto);

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'form-id-1' },
        include: { questions: true },
      });
      expect(prismaService.formQuestion.deleteMany).toHaveBeenCalledWith({
        where: { formId: 'form-id-1' },
      });
      expect(prismaService.formQuestion.create).toHaveBeenCalledTimes(1);
      expect(prismaService.form.update).toHaveBeenCalledWith({
        where: { id: 'form-id-1' },
        data: {
          name: 'Updated Form',
          status: FormStatus.completed,
        },
        include: {
          questions: true,
        },
      });
      expect(result).toEqual(updatedForm);
    });

    it('should throw NotFoundException if form not found', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', mockUpdateFormDto),
      ).rejects.toThrow(
        new NotFoundException('Form with ID non-existent-id not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a form', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(mockForm);
      jest.spyOn(prismaService.form, 'delete').mockResolvedValue(mockForm);

      const result = await service.remove('form-id-1');

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'form-id-1' },
      });
      expect(prismaService.form.delete).toHaveBeenCalledWith({
        where: { id: 'form-id-1' },
      });
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if form not found', async () => {
      jest.spyOn(prismaService.form, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        new NotFoundException('Form with ID non-existent-id not found'),
      );
    });
  });
});
