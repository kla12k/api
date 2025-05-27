import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsOptional()
  isActive?: boolean;
}
