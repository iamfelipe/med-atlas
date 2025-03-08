const { Test } = require('@nestjs/testing');
const { PrismaService } = require('../prisma/prisma.service');
const { UserController } = require('./user.controller');
const { UserModule } = require('./user.module');
const { UserService } = require('./user.service');

describe('UserModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide UserService', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    const service = module.get(UserService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(UserService);
  });

  it('should provide UserController', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    const controller = module.get(UserController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(UserController);
  });

  it('should provide PrismaService', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    const prismaService = module.get(PrismaService);
    expect(prismaService).toBeDefined();
  });
});
