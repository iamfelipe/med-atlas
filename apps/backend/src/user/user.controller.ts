import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { ResponseMessage } from 'lib/response-message.decorator';
import { TransformInterceptor } from 'lib/response.interceptor';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: User) {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.userService.getAllUsers();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('patient')
  async findAllPatients() {
    try {
      return this.userService.getAllPatients();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.userService.getUserById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message as string);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message as string);
    }
  }

  @Put(':id/role')
  @ResponseMessage('User role updated successfully')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: { role: string },
  ) {
    try {
      return this.userService.updateUserRole(id, updateRoleDto.role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message as string);
    }
  }

  @Patch(':id/ehr')
  @ResponseMessage('EHR assigned to user successfully')
  async assignEhrToUser(
    @Param('id') id: string,
    @Body() assignEhrDto: { ehrId: string },
  ) {
    try {
      return this.userService.assignEhrToUser(id, assignEhrDto.ehrId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message as string);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: User) {
    try {
      return this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message as string);
    }
  }
}
