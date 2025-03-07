import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { EHRWithMappings } from '@repo/types';

import {
  CreateEhrDto,
  createEhrDtoSchema,
} from '@repo/api/links/dto/create-ehr.dto';
import { UpdateEhrDto } from '@repo/api/links/dto/update.ehr.dto';
import { ResponseMessage } from 'lib/response-message.decorator';
import { TransformInterceptor } from 'lib/response.interceptor';
import { ZodValidationPipe } from 'lib/zod-validation-pipe';
import { EhrService } from './ehr.service';

@Controller('ehr')
@UseInterceptors(TransformInterceptor)
export class EhrController {
  constructor(private readonly ehrService: EhrService) {}

  @Post()
  @ResponseMessage('EHR Created Successfully')
  @UsePipes(new ZodValidationPipe(createEhrDtoSchema))
  create(@Body() createEhrDto: CreateEhrDto) {
    return this.ehrService.create(createEhrDto);
  }

  @Get()
  @ResponseMessage('EHRs fetched successfully')
  async getAllEhr(): Promise<EHRWithMappings[]> {
    return this.ehrService.findAllWithMappings();
  }

  @Get(':id')
  @ResponseMessage('EHR fetched successfully')
  findOne(@Param('id') id: string) {
    return this.ehrService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('EHR updated successfully')
  update(@Param('id') id: string, @Body() updateEhrDto: UpdateEhrDto) {
    return this.ehrService.update(id, updateEhrDto);
  }

  @Delete(':id')
  @ResponseMessage('EHR deleted successfully')
  remove(@Param('id') id: string) {
    return this.ehrService.remove(+id);
  }
}
