import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEhrDto } from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDto } from '@repo/api/links/dto/update.ehr.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EhrController } from './ehr.controller';
import { EhrService } from './ehr.service';

// Import the EHRDataType enum from Prisma
import { EHRDataType } from '@prisma/client';

describe('EhrController', () => {
  let controller: EhrController;
  let service: EhrService;

  // Mock data
  const mockEHR = {
    id: 'ehr-id-1',
    name: 'Test EHR',
    baseUrl: 'https://test-ehr.com',
    authType: 'API_KEY',
    createdAt: new Date(),
    updatedAt: new Date(),
    mappings: [
      {
        id: 'mapping-id-1',
        ehrId: 'ehr-id-1',
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.name',
        dataType: EHRDataType.string,
        required: true,
        apiEndpoint: '/api/patient',
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const mockEHRs = [
    mockEHR,
    {
      id: 'ehr-id-2',
      name: 'Test EHR 2',
      baseUrl: 'https://test-ehr-2.com',
      authType: 'API_KEY',
      createdAt: new Date(),
      updatedAt: new Date(),
      mappings: [],
    },
  ];

  const mockCreateEhrDto: CreateEhrDto = {
    name: 'New EHR',
    baseUrl: 'https://new-ehr.com',
    authType: 'API_KEY',
    mappings: [
      {
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient',
        options: undefined,
      },
    ],
  };

  const mockUpdateEhrDto: UpdateEhrDto = {
    id: 'ehr-id-1',
    name: 'Updated EHR',
    baseUrl: 'https://updated-ehr.com',
    authType: 'API_KEY',
    mappings: [
      {
        id: 'mapping-id-1',
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.updated.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient/updated',
        options: undefined,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EhrController],
      providers: [
        {
          provide: EhrService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockEHR),
            findAll: jest.fn().mockResolvedValue(mockEHRs),
            findAllWithMappings: jest.fn().mockResolvedValue(mockEHRs),
            findOne: jest.fn().mockResolvedValue(mockEHR),
            update: jest.fn().mockResolvedValue({
              ...mockEHR,
              name: 'Updated EHR',
              baseUrl: 'https://updated-ehr.com',
            }),
            remove: jest.fn().mockResolvedValue({ id: 'ehr-id-1' }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EhrController>(EhrController);
    service = module.get<EhrService>(EhrService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new EHR', async () => {
      const result = await controller.create(mockCreateEhrDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateEhrDto);
      expect(result).toEqual(mockEHR);
    });

    it('should throw ConflictException if EHR already exists', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new ConflictException('EHR already exists'));

      await expect(controller.create(mockCreateEhrDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getAllEhr', () => {
    it('should return an array of EHRs with mappings when isWithMappings is true', async () => {
      const result = await controller.getAllEhr('true');

      expect(service.findAllWithMappings).toHaveBeenCalledWith(true);
      expect(result).toEqual(mockEHRs);
    });

    it('should return an array of EHRs without mappings when isWithMappings is false', async () => {
      const result = await controller.getAllEhr('false');

      expect(service.findAllWithMappings).toHaveBeenCalledWith(false);
      expect(result).toEqual(mockEHRs);
    });
  });

  describe('findOne', () => {
    it('should return a single EHR by id', async () => {
      const result = await controller.findOne('ehr-id-1');

      expect(service.findOne).toHaveBeenCalledWith('ehr-id-1');
      expect(result).toEqual(mockEHR);
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('EHR not found'));

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an EHR', async () => {
      const result = await controller.update('ehr-id-1', mockUpdateEhrDto);

      expect(service.update).toHaveBeenCalledWith('ehr-id-1', mockUpdateEhrDto);
      expect(result).toEqual({
        ...mockEHR,
        name: 'Updated EHR',
        baseUrl: 'https://updated-ehr.com',
      });
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException('EHR not found'));

      await expect(
        controller.update('non-existent-id', mockUpdateEhrDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if update has no mappings', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new ConflictException('EHR should have at least one mapping'),
        );

      await expect(
        controller.update('ehr-id-1', { ...mockUpdateEhrDto, mappings: [] }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete an EHR', async () => {
      const result = await controller.remove('ehr-id-1');

      expect(service.remove).toHaveBeenCalledWith('ehr-id-1');
      expect(result).toEqual({ id: 'ehr-id-1' });
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException('EHR not found'));

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
