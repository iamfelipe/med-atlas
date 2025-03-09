import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('EhrController (e2e)', () => {
  let app: INestApplication;
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
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const createEhrDto = {
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
        options: null,
      },
    ],
  };

  const updateEhrDto = {
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
        options: null,
      },
    ],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Mock PrismaService methods
    jest.spyOn(prismaService.eHR, 'findUnique').mockImplementation((params) => {
      if (params.where.id === 'ehr-id-1' || params.where.name === 'Test EHR') {
        return Promise.resolve(mockEHR);
      }
      return Promise.resolve(null);
    });

    jest
      .spyOn(prismaService.eHR, 'findMany')
      .mockResolvedValue([mockEHRWithMappings]);

    jest.spyOn(prismaService.eHR, 'create').mockImplementation(() => {
      return Promise.resolve({
        ...createEhrDto,
        id: 'new-ehr-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        mappings: [
          {
            ...createEhrDto.mappings[0],
            id: 'new-mapping-id',
            ehrId: 'new-ehr-id',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });
    });

    jest.spyOn(prismaService.eHR, 'update').mockImplementation(() => {
      return Promise.resolve({
        ...mockEHR,
        ...updateEhrDto,
        mappings: [
          {
            ...updateEhrDto.mappings[0],
            ehrId: 'ehr-id-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });
    });

    jest
      .spyOn(prismaService.eHR, 'delete')
      .mockResolvedValue(mockEHRWithMappings);

    jest
      .spyOn(prismaService.eHRMapping, 'findMany')
      .mockResolvedValue(mockEHRWithMappings.mappings);
    jest
      .spyOn(prismaService.eHRMapping, 'deleteMany')
      .mockResolvedValue({ count: 0 });
    jest
      .spyOn(prismaService.eHRMapping, 'update')
      .mockImplementation((params) => {
        return Promise.resolve({
          ...params.data,
          id: params.where.id,
          ehrId: 'ehr-id-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/ehr (POST)', () => {
    it('should create a new EHR', () => {
      return request(app.getHttpServer())
        .post('/ehr')
        .send(createEhrDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toBeDefined();
          expect(res.body.data.name).toEqual(createEhrDto.name);
          expect(res.body.data.baseUrl).toEqual(createEhrDto.baseUrl);
          expect(res.body.data.authType).toEqual(createEhrDto.authType);
          expect(res.body.data.mappings).toHaveLength(1);
          expect(res.body.message).toEqual('EHR Created Successfully');
        });
    });
  });

  describe('/ehr (GET)', () => {
    it('should return all EHRs with mappings', () => {
      return request(app.getHttpServer())
        .get('/ehr?isWithMappings=true')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].mappings).toBeDefined();
          expect(res.body.message).toEqual('EHRs fetched successfully');
        });
    });
  });

  describe('/ehr/:id (GET)', () => {
    it('should return a single EHR by id', () => {
      return request(app.getHttpServer())
        .get('/ehr/ehr-id-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual('ehr-id-1');
          expect(res.body.data.name).toEqual(mockEHR.name);
          expect(res.body.message).toEqual('EHR fetched successfully');
        });
    });

    it('should return 404 if EHR not found', () => {
      return request(app.getHttpServer())
        .get('/ehr/non-existent-id')
        .expect(404);
    });
  });

  describe('/ehr/:id (PUT)', () => {
    it('should update an EHR', () => {
      return request(app.getHttpServer())
        .put('/ehr/ehr-id-1')
        .send(updateEhrDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual('ehr-id-1');
          expect(res.body.data.name).toEqual(updateEhrDto.name);
          expect(res.body.data.baseUrl).toEqual(updateEhrDto.baseUrl);
          expect(res.body.message).toEqual('EHR updated successfully');
        });
    });

    it('should return 404 if EHR not found', () => {
      return request(app.getHttpServer())
        .put('/ehr/non-existent-id')
        .send(updateEhrDto)
        .expect(404);
    });
  });

  describe('/ehr/:id (DELETE)', () => {
    it('should delete an EHR', () => {
      return request(app.getHttpServer())
        .delete('/ehr/ehr-id-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual('ehr-id-1');
          expect(res.body.message).toEqual('EHR deleted successfully');
        });
    });

    it('should return 404 if EHR not found', () => {
      return request(app.getHttpServer())
        .delete('/ehr/non-existent-id')
        .expect(404);
    });
  });
});
