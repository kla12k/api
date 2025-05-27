import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if a category with the same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `A category with the name "${createCategoryDto.name}" already exists`,
      );
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      // Use the provided type or default to BOTH
      type: createCategoryDto.type || CategoryType.BOTH,
    });

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      // Handle duplicate entry errors from the database
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `A category with the name "${createCategoryDto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async findAll(includeInactive: boolean = false): Promise<Category[]> {
    // Only return active categories by default
    if (includeInactive) {
      return this.categoryRepository.find();
    }
    return this.categoryRepository.find({ where: { isActive: true } });
  }

  //It finds all categories that are active and either meant for businesses or for both business and events.
  async findBusinessCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: [
        { type: CategoryType.BUSINESS, isActive: true },
        { type: CategoryType.BOTH, isActive: true },
      ],
    });
  }

  //It finds all categories that are active and either meant for events or for both business and events.
  async findEventCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: [
        { type: CategoryType.EVENT, isActive: true },
        { type: CategoryType.BOTH, isActive: true },
      ],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['businesses', 'events'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Find the category with its related businesses and events
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['businesses', 'events'],
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Check if category has associated businesses or events
      const hasAssociations =
        (category.businesses && category.businesses.length > 0) ||
        (category.events && category.events.length > 0);

      if (hasAssociations) {
        // Implement soft delete instead of hard delete
        category.isActive = false;
        await this.categoryRepository.save(category);
        console.log(
          `Category ${id} was soft-deleted because it has associations`,
        );
        return {
          message: `Category "${category.name}" was deactivated because it has associated items`,
        };
      } else {
        // If no associations, we can safely hard delete
        await this.categoryRepository.remove(category);
        return {
          message: `Category "${category.name}" was permanently deleted`,
        };
      }
    } catch (error) {
      // Handle specific database errors
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException(
          'Cannot delete this category because it is being used. The category has been deactivated instead.',
        );
      }
      // Re-throw other errors
      throw error;
    }
  }
}
