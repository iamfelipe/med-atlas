import { ApiProperty } from '@nestjs/swagger';

export class FormQuestion {
  @ApiProperty({ description: 'Unique identifier for the form question' })
  id: string;

  @ApiProperty({ description: 'ID of the form this question belongs to' })
  formId: string;

  @ApiProperty({
    description: 'ID of the EHR mapping this question is associated with',
  })
  mappingId: string;

  @ApiProperty({
    description: "Value of the question's answer",
    required: false,
  })
  value?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
