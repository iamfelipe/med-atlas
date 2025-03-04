import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    if (!data.name || !data.email || !data.password) {
      throw new ConflictException('Name, email, and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data,
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(
    id: number,
    data: { name?: string; email?: string; password?: string },
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
