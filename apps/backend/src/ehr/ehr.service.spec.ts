import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEhrDto } from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDto } from '@repo/api/links/dto/update.ehr.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EhrService } from './ehr.service';

describe('EhrService', () => {
  let service: EhrService;
  let prismaService: PrismaService;

  // Mock data
  const mockEHR = {
    id: 'ehr-id-1',
    name: 'Test EHR',
    baseUrl: 'https://test-ehr.com',
    authType: 'API_KEY',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEHRWithMappings = {
    ...mockEHR,
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
      authType: 'OAuth2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockEHRsWithMappings = [
    mockEHRWithMappings,
    {
      id: 'ehr-id-2',
      name: 'Test EHR 2',
      baseUrl: 'https://test-ehr-2.com',
      authType: 'OAUTH',
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
      },
    ],
  };

  const mockUpdateEhrDto: UpdateEhrDto = {
    name: 'Updated EHR',
    baseUrl: 'https://updated-ehr.com',
    authType: 'OAuth2',
    mappings: [
      {
        id: 'mapping-id-1',
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.updated.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient/updated',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EhrService,
        {
          provide: PrismaService,
          useValue: {
            eHR: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            eHRMapping: {
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EhrService>(EhrService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mock the private prisma property in EhrService
    Object.defineProperty(service, 'prisma', {
      value: prismaService,
      writable: true,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new EHR with mappings', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prismaService.eHR, 'create')
        .mockResolvedValue(mockEHRWithMappings);

      const result = await service.create(mockCreateEhrDto);

      expect(prismaService.eHR.findUnique).toHaveBeenCalledWith({
        where: { name: mockCreateEhrDto.name },
      });
      expect(prismaService.eHR.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateEhrDto.name,
          baseUrl: mockCreateEhrDto.baseUrl,
          authType: mockCreateEhrDto.authType,
          mappings: {
            create: mockCreateEhrDto.mappings,
          },
        },
        include: {
          mappings: true,
        },
      });
      expect(result).toEqual(mockEHRWithMappings);
    });

    it('should throw ConflictException if EHR with the same name already exists', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(mockEHR);

      await expect(service.create(mockCreateEhrDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.eHR.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of EHRs', async () => {
      jest.spyOn(prismaService.eHR, 'findMany').mockResolvedValue(mockEHRs);

      const result = await service.findAll();

      expect(prismaService.eHR.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockEHRs);
    });
  });

  describe('findAllWithMappings', () => {
    it('should return an array of EHRs with mappings when isWithMappings is true', async () => {
      jest
        .spyOn(prismaService.eHR, 'findMany')
        .mockResolvedValue(mockEHRsWithMappings);

      const result = await service.findAllWithMappings(true);

      expect(prismaService.eHR.findMany).toHaveBeenCalledWith({
        include: {
          mappings: true,
        },
      });
      expect(result).toEqual(mockEHRsWithMappings);
    });

    it('should return an array of EHRs with mappings when isWithMappings is false', async () => {
      jest.spyOn(prismaService.eHR, 'findMany').mockResolvedValue(mockEHRs);

      const result = await service.findAllWithMappings(false);

      expect(prismaService.eHR.findMany).toHaveBeenCalledWith({
        include: {
          mappings: false,
        },
      });
      expect(result).toEqual(mockEHRs);
    });
  });

  describe('findOne', () => {
    it('should return a single EHR by id with mappings', async () => {
      jest
        .spyOn(prismaService.eHR, 'findUnique')
        .mockResolvedValue(mockEHRWithMappings);

      const result = await service.findOne('ehr-id-1');

      expect(prismaService.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
        include: {
          mappings: true,
        },
      });
      expect(result).toEqual(mockEHRWithMappings);
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an EHR and its mappings', async () => {
      jest
        .spyOn(prismaService.eHR, 'findUnique')
        .mockResolvedValue(mockEHRWithMappings);
      jest
        .spyOn(prismaService.eHRMapping, 'findMany')
        .mockResolvedValue(mockEHRWithMappings.mappings);
      jest
        .spyOn(prismaService.eHRMapping, 'deleteMany')
        .mockResolvedValue({ count: 0 });
      jest
        .spyOn(prismaService.eHRMapping, 'update')
        .mockResolvedValue(mockUpdateEhrDto.mappings[0]);
      jest.spyOn(prismaService.eHR, 'update').mockResolvedValue({
        ...mockEHRWithMappings,
        name: mockUpdateEhrDto.name,
        baseUrl: mockUpdateEhrDto.baseUrl,
        authType: mockUpdateEhrDto.authType,
      });

      const result = await service.update('ehr-id-1', mockUpdateEhrDto);

      expect(prismaService.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
        include: {
          mappings: true,
        },
      });
      expect(prismaService.eHRMapping.findMany).toHaveBeenCalledWith({
        where: { ehrId: 'ehr-id-1' },
      });
      expect(prismaService.eHR.update).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
        data: {
          name: mockUpdateEhrDto.name,
          baseUrl: mockUpdateEhrDto.baseUrl,
          authType: mockUpdateEhrDto.authType,
        },
        include: {
          mappings: true,
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', mockUpdateEhrDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if update has no mappings', async () => {
      jest
        .spyOn(prismaService.eHR, 'findUnique')
        .mockResolvedValue(mockEHRWithMappings);

      const updateWithNoMappings = { ...mockUpdateEhrDto, mappings: [] };

      await expect(
        service.update('ehr-id-1', updateWithNoMappings),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete an EHR', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(mockEHR);
      jest
        .spyOn(prismaService.eHR, 'delete')
        .mockResolvedValue(mockEHRWithMappings);

      const result = await service.remove('ehr-id-1');

      expect(prismaService.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
      });
      expect(prismaService.eHR.delete).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
        include: {
          mappings: true,
        },
      });
      expect(result).toEqual(mockEHRWithMappings);
    });

    it('should throw NotFoundException if EHR not found', async () => {
      jest.spyOn(prismaService.eHR, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.eHR.delete).not.toHaveBeenCalled();
    });
  });
});
