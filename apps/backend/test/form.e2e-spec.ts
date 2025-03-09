import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FormController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Test data
  let userId: string;
  let ehrId: string;
  let mappingId: string;
  let formId: string;

  // Mock data
  const mockCreateFormDto: CreateFormDto = {
    name: 'E2E Test Form',
    userId: '', // Will be set in beforeAll
    ehrId: '', // Will be set in beforeAll
    status: 'pending',
    questions: [
      {
        mappingId: '', // Will be set in beforeAll
        value: 'test value',
      },
    ],
  };

  const mockUpdateFormDto: UpdateFormDto = {
    name: 'Updated E2E Test Form',
    status: 'completed',
    questions: [
      {
        mappingId: '', // Will be set in beforeAll
        value: 'updated value',
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Create test user
    const user = await prismaService.user.create({
      data: {
        id: 'e2e-test-user-id',
        email: 'e2e-test@example.com',
        firstName: 'E2E',
        lastName: 'Test',
        role: 'patient',
      },
    });
    userId = user.id;

    // Create test EHR
    const ehr = await prismaService.eHR.create({
      data: {
        name: 'E2E Test EHR',
        baseUrl: 'https://e2e-test-ehr.com',
        authType: 'API_KEY',
        mappings: {
          create: [
            {
              entityType: 'Patient',
              fieldName: 'Name',
              mappingPath: 'patient.name',
              dataType: 'string',
              required: true,
              apiEndpoint: '/api/patient',
            },
          ],
        },
      },
      include: {
        mappings: true,
      },
    });
    ehrId = ehr.id;
    mappingId = ehr.mappings[0].id;

    // Update mock DTOs with real IDs
    mockCreateFormDto.userId = userId;
    mockCreateFormDto.ehrId = ehrId;
    mockCreateFormDto.questions[0].mappingId = mappingId;

    // Ensure questions array is defined in mockUpdateFormDto
    if (mockUpdateFormDto.questions && mockUpdateFormDto.questions.length > 0) {
      mockUpdateFormDto.questions[0].mappingId = mappingId;
    }
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.form.deleteMany({
      where: {
        userId,
      },
    });
    await prismaService.eHRMapping.deleteMany({
      where: {
        ehrId,
      },
    });
    await prismaService.eHR.delete({
      where: {
        id: ehrId,
      },
    });
    await prismaService.user.delete({
      where: {
        id: userId,
      },
    });

    await app.close();
  });

  describe('/forms (POST)', () => {
    it('should create a new form', async () => {
      const response = await request(app.getHttpServer())
        .post('/forms')
        .send(mockCreateFormDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(mockCreateFormDto.name);
      expect(response.body.status).toBe(mockCreateFormDto.status);
      expect(response.body.userId).toBe(mockCreateFormDto.userId);
      expect(response.body.ehrId).toBe(mockCreateFormDto.ehrId);
      expect(response.body.questions).toHaveLength(1);
      expect(response.body.questions[0].mappingId).toBe(
        mockCreateFormDto.questions[0].mappingId,
      );
      expect(response.body.questions[0].value).toBe(
        mockCreateFormDto.questions[0].value,
      );

      formId = response.body.id;
    });

    it('should return 400 if user already has a form', async () => {
      await request(app.getHttpServer())
        .post('/forms')
        .send(mockCreateFormDto)
        .expect(400);
    });

    it('should return 404 if user not found', async () => {
      const invalidDto = { ...mockCreateFormDto, userId: 'non-existent-id' };
      await request(app.getHttpServer())
        .post('/forms')
        .send(invalidDto)
        .expect(404);
    });

    it('should return 404 if EHR not found', async () => {
      const invalidDto = { ...mockCreateFormDto, ehrId: 'non-existent-id' };
      await request(app.getHttpServer())
        .post('/forms')
        .send(invalidDto)
        .expect(404);
    });
  });

  describe('/forms (GET)', () => {
    it('should return all forms', async () => {
      const response = await request(app.getHttpServer())
        .get('/forms')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some((form) => form.id === formId)).toBe(true);
    });
  });

  describe('/forms/:id (GET)', () => {
    it('should return a form by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/forms/${formId}`)
        .expect(200);

      expect(response.body.id).toBe(formId);
      expect(response.body.name).toBe(mockCreateFormDto.name);
      expect(response.body.status).toBe(mockCreateFormDto.status);
      expect(response.body.userId).toBe(mockCreateFormDto.userId);
      expect(response.body.ehrId).toBe(mockCreateFormDto.ehrId);
    });

    it('should return 404 if form not found', async () => {
      await request(app.getHttpServer())
        .get('/forms/non-existent-id')
        .expect(404);
    });
  });

  describe('/forms/user/:userId (GET)', () => {
    it('should return a form by user id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/forms/user/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(formId);
      expect(response.body.userId).toBe(userId);
    });

    it('should return 404 if form not found for user', async () => {
      await request(app.getHttpServer())
        .get('/forms/user/non-existent-id')
        .expect(404);
    });
  });

  describe('/forms/:id (PATCH)', () => {
    it('should update a form', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/forms/${formId}`)
        .send(mockUpdateFormDto)
        .expect(200);

      expect(response.body.id).toBe(formId);
      expect(response.body.name).toBe(mockUpdateFormDto.name);
      expect(response.body.status).toBe(mockUpdateFormDto.status);

      // Check if questions were updated
      const updatedForm = await prismaService.form.findUnique({
        where: { id: formId },
        include: { questions: true },
      });

      if (
        updatedForm &&
        updatedForm.questions.length > 0 &&
        mockUpdateFormDto.questions &&
        mockUpdateFormDto.questions.length > 0
      ) {
        expect(updatedForm.questions[0].value).toBe(
          mockUpdateFormDto.questions[0].value,
        );
      }
    });

    it('should return 404 if form not found', async () => {
      await request(app.getHttpServer())
        .patch('/forms/non-existent-id')
        .send(mockUpdateFormDto)
        .expect(404);
    });
  });

  describe('/forms/:id (DELETE)', () => {
    it('should delete a form', async () => {
      await request(app.getHttpServer()).delete(`/forms/${formId}`).expect(200);

      // Verify form was deleted
      const deletedForm = await prismaService.form.findUnique({
        where: { id: formId },
      });
      expect(deletedForm).toBeNull();

      // Verify questions were deleted (cascade)
      const questions = await prismaService.formQuestion.findMany({
        where: { formId },
      });
      expect(questions.length).toBe(0);
    });

    it('should return 404 if form not found', async () => {
      await request(app.getHttpServer())
        .delete('/forms/non-existent-id')
        .expect(404);
    });
  });
});
