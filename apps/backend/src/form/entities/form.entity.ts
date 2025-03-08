import { ApiProperty } from '@nestjs/swagger';
import { FormQuestion } from './form-question.entity';

export enum FormStatus {
  pending = 'pending',
  completed = 'completed',
}

export class Form {
  @ApiProperty({ description: 'Unique identifier for the form' })
  id: string;

  @ApiProperty({ description: 'Name of the form' })
  name: string;

  @ApiProperty({ description: 'Status of the form', enum: FormStatus })
  status: FormStatus;

  @ApiProperty({ description: 'ID of the user this form is assigned to' })
  userId: string;

  @ApiProperty({ description: 'ID of the EHR this form is associated with' })
  ehrId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Questions in this form', type: [FormQuestion] })
  questions?: FormQuestion[];
}
