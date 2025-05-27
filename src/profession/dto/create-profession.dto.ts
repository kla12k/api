import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ProfessionType } from '../entities/profession.entity';

export class CreateProfessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProfessionType)
  @IsNotEmpty()
  professionType: ProfessionType;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsString()
  @IsOptional()
  image?: string;
}
