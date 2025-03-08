import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormController } from './form.controller';
import { FormService } from './form.service';

describe('FormController', () => {
  let controller: FormController;
  let service: FormService;

  // Mock data
  const mockForm = {
    id: 'form-id-1',
    name: 'Test Form',
    status: 'pending',
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
      status: 'completed',
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
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockForm),
            findAll: jest.fn().mockResolvedValue(mockForms),
            findOne: jest.fn().mockResolvedValue(mockForm),
            findByUser: jest.fn().mockResolvedValue(mockForm),
            update: jest.fn().mockResolvedValue({
              ...mockForm,
              name: 'Updated Form',
              status: 'completed',
            }),
            remove: jest.fn().mockResolvedValue({ id: 'form-id-1' }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FormController>(FormController);
    service = module.get<FormService>(FormService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new form', async () => {
      const result = await controller.create(mockCreateFormDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateFormDto);
      expect(result).toEqual(mockForm);
    });

    it('should throw BadRequestException if user already has a form', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new BadRequestException('User already has a form assigned'),
        );

      await expect(controller.create(mockCreateFormDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new NotFoundException('User not found'));

      await expect(controller.create(mockCreateFormDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new NotFoundException('EHR not found'));

      await expect(controller.create(mockCreateFormDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of forms', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockForms);
    });
  });

  describe('findOne', () => {
    it('should return a single form by id', async () => {
      const result = await controller.findOne('form-id-1');

      expect(service.findOne).toHaveBeenCalledWith('form-id-1');
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if form not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Form not found'));

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return a form by user id', async () => {
      const result = await controller.findByUser('user-id-1');

      expect(service.findByUser).toHaveBeenCalledWith('user-id-1');
      expect(result).toEqual(mockForm);
    });

    it('should throw NotFoundException if form not found for user', async () => {
      jest
        .spyOn(service, 'findByUser')
        .mockRejectedValueOnce(
          new NotFoundException('Form not found for this user'),
        );

      await expect(
        controller.findByUser('non-existent-user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a form', async () => {
      const result = await controller.update('form-id-1', mockUpdateFormDto);

      expect(service.update).toHaveBeenCalledWith(
        'form-id-1',
        mockUpdateFormDto,
      );
      expect(result).toEqual({
        ...mockForm,
        name: 'Updated Form',
        status: 'completed',
      });
    });

    it('should throw NotFoundException if form not found', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException('Form not found'));

      await expect(
        controller.update('non-existent-id', mockUpdateFormDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a form', async () => {
      const result = await controller.remove('form-id-1');

      expect(service.remove).toHaveBeenCalledWith('form-id-1');
      expect(result).toEqual({ id: 'form-id-1' });
    });

    it('should throw NotFoundException if form not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException('Form not found'));

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
