import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import fetch from 'node-fetch';

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

  async assignEhrToUser(userId: string, ehrId: string): Promise<User | null> {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if the EHR exists
    const ehr = await this.prisma.eHR.findUnique({
      where: { id: ehrId },
    });

    if (!ehr) {
      throw new NotFoundException(`EHR with ID ${ehrId} not found`);
    }

    // Check if the user already has an EHR assigned
    if (user.ehrId) {
      throw new ConflictException(
        `User with ID ${userId} already has an EHR assigned`,
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { ehrId },
    });
  }

  async deleteUserRole(id: string, currentRoleId: string) {
    const deleteResponse = await fetch(
      `${process.env.KINDE_API_URL}/organizations/${process.env.KINDE_ORGANIZATION}/users/${id}/roles/${currentRoleId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.KINDE_AUTHORIZATION}`,
          Connection: 'keep-alive',
        },
      },
    );
    return await deleteResponse.json();
  }

  async addUserRole(id: string, roleId: string) {
    const addResponse = await fetch(
      `${process.env.KINDE_API_URL}/organizations/${process.env.KINDE_ORGANIZATION}/users/${id}/roles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.KINDE_AUTHORIZATION}`,
          Connection: 'keep-alive',
        },
        body: JSON.stringify({ role_id: roleId }),
      },
    );
    return await addResponse.json();
  }

  async updateUserRole(
    id: string,
    roleId: string,
    currentRoleId: string,
  ): Promise<User | null> {
    if (!(await this.checkUserExists(id))) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      await this.deleteUserRole(id, currentRoleId);

      await this.addUserRole(id, roleId);
    } catch (error) {
      console.error('Error updating role in Kinde:', error);
      throw new Error(`Failed to update role in Kinde: ${error.message}`);
    }

    // Then update the role in our database
    return this.prisma.user.update({
      where: { id },
      data: { role: roleId },
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

  async deleteUserFromKinde(id: string) {
    const deleteResponse = await fetch(
      `${process.env.KINDE_API_URL}/user?id=${id}&is_deleted_profile=true`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.KINDE_AUTHORIZATION}`,
          Connection: 'keep-alive',
        },
      },
    );

    return await deleteResponse.json();
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const deletedUser = await this.deleteUserFromKinde(id);
    } catch (error) {
      console.error('Error deleting user from Kinde:', error);
      throw new Error(`Failed to delete user from Kinde: ${error.message}`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
