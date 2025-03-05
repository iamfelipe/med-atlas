import { PartialType } from '@nestjs/mapped-types';
import { CreateEhrDto } from './create-ehr.dto';

export class UpdateEhrDto extends PartialType(CreateEhrDto) {}
