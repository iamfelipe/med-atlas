import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateEhrDto {
  @IsString()
  @Length(2, 30, {
    message: 'Name must be between 2 and 30 characters',
  })
  public readonly name: string;

  @IsUrl(
    {},
    {
      message: 'Base URL must be a valid URL',
    },
  )
  public readonly baseUrl: string;

  @IsString()
  @IsIn(['OAuth2', 'API_KEY'], {
    message: 'Auth type must be either OAuth2 or API_KEY',
  })
  public readonly authType: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEhrMappingDto)
  public readonly mappings?: CreateEhrMappingDto[];
}

export class CreateEhrMappingDto {
  @IsString()
  public readonly entityType: string;

  @IsString()
  public readonly fieldName: string;

  @IsString()
  public readonly mappingPath: string;

  @IsIn(['string', 'number', 'boolean', 'date'], {
    message: 'Data type must be either string, number, boolean, or date',
  })
  public readonly dataType: string;

  @IsOptional()
  @IsBoolean()
  public readonly required?: boolean;

  @IsOptional()
  @IsString()
  public readonly apiEndpoint?: string;
}
