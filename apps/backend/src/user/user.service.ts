import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async createUser(user: User): Promise<User> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: user,
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getAllPatients(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role: 'patient' },
      include: {
        ehr: true,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | null> {
    if (!(await this.checkUserExists(id))) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  private async checkUserExists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return !!user;
  }

  async updateUser(
    id: string,
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

  async deleteUser(id: string): Promise<User | null> {
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
