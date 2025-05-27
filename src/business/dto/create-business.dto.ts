import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  // Allow image to be passed in the DTO (for mobile clients)
  @IsOptional()
  image?: any;
}
