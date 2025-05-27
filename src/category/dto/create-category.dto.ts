import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'type must be business, event, or both' })
  type?: CategoryType;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
