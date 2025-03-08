const {
  BadRequestException,
  ConflictException,
  NotFoundException,
} = require('@nestjs/common');
const { Test } = require('@nestjs/testing');
const { PrismaService } = require('../prisma/prisma.service');
const { UserController } = require('./user.controller');
const { UserService } = require('./user.service');

describe('UserController', () => {
  let controller;
  let service;

  // Mock data
  const mockUser = {
    id: 'user-id-1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    role: 'patient',
    ehrId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers = [
    mockUser,
    {
      id: 'user-id-2',
      firstName: 'Test',
      lastName: 'User 2',
      email: 'test2@example.com',
      password: 'password123',
      role: 'doctor',
      ehrId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPatients = [
    {
      id: 'user-id-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'patient',
      ehrId: 'ehr-id-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      ehr: {
        id: 'ehr-id-1',
        name: 'Test EHR',
        baseUrl: 'https://test-ehr.com',
        authType: 'API_KEY',
      },
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            getAllUsers: jest.fn().mockResolvedValue(mockUsers),
            getAllPatients: jest.fn().mockResolvedValue(mockPatients),
            getUserById: jest.fn().mockResolvedValue(mockUser),
            deleteUser: jest.fn().mockResolvedValue({ id: 'user-id-1' }),
            assignEhrToUser: jest.fn().mockResolvedValue({
              ...mockUser,
              ehrId: 'ehr-id-1',
            }),
            updateUser: jest.fn().mockResolvedValue({
              ...mockUser,
              firstName: 'Updated',
              lastName: 'User',
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await controller.create(mockUser);

      expect(service.createUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValueOnce(new ConflictException('User already exists'));

      await expect(controller.create(mockUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.create(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();

      expect(service.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(service, 'getAllUsers')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllPatients', () => {
    it('should return an array of patients', async () => {
      const result = await controller.findAllPatients();

      expect(service.getAllPatients).toHaveBeenCalled();
      expect(result).toEqual(mockPatients);
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(service, 'getAllPatients')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.findAllPatients()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOne('user-id-1');

      expect(service.getUserById).toHaveBeenCalledWith('user-id-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValueOnce(
          new NotFoundException('User with ID user-id-1 not found'),
        );

      await expect(controller.findOne('user-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.findOne('user-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const result = await controller.delete('user-id-1');

      expect(service.deleteUser).toHaveBeenCalledWith('user-id-1');
      expect(result).toEqual({ id: 'user-id-1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'deleteUser')
        .mockRejectedValueOnce(
          new NotFoundException('User with ID user-id-1 not found'),
        );

      await expect(controller.delete('user-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.findOne('user-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('assignEhrToUser', () => {
    it('should assign an EHR to a user', async () => {
      const result = await controller.assignEhrToUser('user-id-1', {
        ehrId: 'ehr-id-1',
      });

      expect(service.assignEhrToUser).toHaveBeenCalledWith(
        'user-id-1',
        'ehr-id-1',
      );
      expect(result).toEqual({ ...mockUser, ehrId: 'ehr-id-1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'assignEhrToUser')
        .mockRejectedValueOnce(
          new NotFoundException('User with ID user-id-1 not found'),
        );

      await expect(
        controller.assignEhrToUser('user-id-1', { ehrId: 'ehr-id-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(service, 'assignEhrToUser')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(
        controller.assignEhrToUser('user-id-1', { ehrId: 'ehr-id-1' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        ...mockUser,
        firstName: 'Updated',
        lastName: 'User',
      };

      const result = await controller.update('user-id-1', updateUserDto);

      expect(service.updateUser).toHaveBeenCalledWith(
        'user-id-1',
        updateUserDto,
      );
      expect(result).toEqual({
        ...mockUser,
        firstName: 'Updated',
        lastName: 'User',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValueOnce(
          new NotFoundException('User with ID user-id-1 not found'),
        );

      await expect(controller.update('user-id-1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValueOnce(new BadRequestException('Some error'));

      await expect(controller.update('user-id-1', mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
