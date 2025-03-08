import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';

import { TransformInterceptor } from 'lib/response.interceptor';
import { FormService } from './form.service';

@ApiTags('forms')
@Controller('forms')
@UseInterceptors(TransformInterceptor)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({
    status: 201,
    description: 'The form has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({ status: 200, description: 'Return all forms.' })
  findAll() {
    return this.formService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by id' })
  @ApiResponse({ status: 200, description: 'Return the form.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  findOne(@Param('id') id: string) {
    return this.formService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a form by user id' })
  @ApiResponse({ status: 200, description: 'Return the form for the user.' })
  @ApiResponse({ status: 404, description: 'Form not found for this user.' })
  findByUser(@Param('userId') userId: string) {
    return this.formService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form' })
  @ApiResponse({
    status: 200,
    description: 'The form has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(id, updateFormDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form' })
  @ApiResponse({
    status: 200,
    description: 'The form has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  remove(@Param('id') id: string) {
    return this.formService.remove(id);
  }
}
