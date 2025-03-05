import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEhrDto } from './dto/create-ehr.dto';
import { UpdateEhrDto } from './dto/update-ehr.dto';
import { EhrService } from './ehr.service';

@Controller('ehr')
export class EhrController {
  constructor(private readonly ehrService: EhrService) {}

  @Post()
  create(@Body() createEhrDto: CreateEhrDto) {
    return this.ehrService.create(createEhrDto);
  }

  @Get()
  findAll() {
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
