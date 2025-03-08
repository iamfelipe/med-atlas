import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FormController } from './form.controller';
import { FormModule } from './form.module';
import { FormService } from './form.service';

describe('FormModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [FormModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide FormService', async () => {
    const module = await Test.createTestingModule({
      imports: [FormModule],
    }).compile();

    const service = module.get<FormService>(FormService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(FormService);
  });

  it('should provide FormController', async () => {
    const module = await Test.createTestingModule({
      imports: [FormModule],
    }).compile();

    const controller = module.get<FormController>(FormController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(FormController);
  });

  it('should provide PrismaService', async () => {
    const module = await Test.createTestingModule({
      imports: [FormModule],
    }).compile();

    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    // Don't check instance type for PrismaService as it might be a proxy
  });
});
