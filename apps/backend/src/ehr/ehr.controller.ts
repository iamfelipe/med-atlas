import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';

import { UpdateEhrDto } from './dto/update-ehr.dto';

import { EHRWithMappings } from '@repo/types';

import {
  CreateEhrDto,
  createEhrDtoSchema,
} from '@repo/api/links/dto/create-ehr.dto';
import { ZodValidationPipe } from 'lib/zod-validation-pipe';
import { EhrService } from './ehr.service';

@Controller('ehr')
export class EhrController {
  constructor(private readonly ehrService: EhrService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createEhrDtoSchema))
  create(@Body() createEhrDto: CreateEhrDto) {
    return this.ehrService.create(createEhrDto);
  }

  @Get()
  async getAllEhr(): Promise<EHRWithMappings[]> {
    return this.ehrService.findAllWithMappings();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ehrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEhrDto: UpdateEhrDto) {
    return this.ehrService.update(+id, updateEhrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ehrService.remove(+id);
  }
}
