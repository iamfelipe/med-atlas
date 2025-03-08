const { ConflictException, NotFoundException } = require('@nestjs/common');
const { Test } = require('@nestjs/testing');
const { PrismaService } = require('../prisma/prisma.service');
const { UserService } = require('./user.service');

describe('UserService', () => {
  let service;
  let prismaService;

  // Mock data
  const mockUser = {
    id: 'user-id-1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
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

  const mockEHR = {
    id: 'ehr-id-1',
    name: 'Test EHR',
    baseUrl: 'https://test-ehr.com',
    authType: 'API_KEY',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eHR: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            ...mockPrisma,
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    prismaService = module.get(PrismaService);

    // Mock the private prisma property in UserService
    Object.defineProperty(service, 'prisma', {
      value: mockPrisma,
      writable: true,
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(mockUser);

      const result = await service.createUser(mockUser);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(service.createUser(mockUser)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce(mockUsers);

      const result = await service.getAllUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getAllPatients', () => {
    it('should return an array of patients', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce(mockPatients);

      const result = await service.getAllPatients();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'patient' },
        include: {
          ehr: true,
        },
      });
      expect(result).toEqual(mockPatients);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.getUserById('user-id-1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getUserById('user-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignEhrToUser', () => {
    it('should assign an EHR to a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        ehrId: null,
      });
      mockPrisma.eHR.findUnique.mockResolvedValueOnce(mockEHR);
      mockPrisma.user.update.mockResolvedValueOnce({
        ...mockUser,
        ehrId: 'ehr-id-1',
      });

      const result = await service.assignEhrToUser('user-id-1', 'ehr-id-1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });
      expect(mockPrisma.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        data: { ehrId: 'ehr-id-1' },
      });
      expect(result).toEqual({ ...mockUser, ehrId: 'ehr-id-1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.assignEhrToUser('user-id-1', 'ehr-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if EHR not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrisma.eHR.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.assignEhrToUser('user-id-1', 'ehr-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user already has an EHR assigned', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        ehrId: 'existing-ehr-id',
      });

      mockPrisma.eHR.findUnique.mockResolvedValueOnce(mockEHR);

      await expect(
        service.assignEhrToUser('user-id-1', 'ehr-id-1'),
      ).rejects.toThrow(/User with ID user-id-1 already has an EHR assigned/);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });

      expect(mockPrisma.eHR.findUnique).toHaveBeenCalledWith({
        where: { id: 'ehr-id-1' },
      });

      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      const updatedUser = {
        ...mockUser,
        name: 'Updated User',
        email: 'updated@example.com',
      };
      mockPrisma.user.update.mockResolvedValueOnce(updatedUser);

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const result = await service.updateUser('user-id-1', updateData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.updateUser('user-id-1', { name: 'Updated User' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrisma.user.delete.mockResolvedValueOnce(mockUser);

      const result = await service.deleteUser('user-id-1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteUser('user-id-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
