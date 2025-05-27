import { Repository } from 'typeorm';
import { Business } from './entities/business.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

export class BusinessRepository extends Repository<Business> {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {
    super(
      businessRepository.target,
      businessRepository.manager,
      businessRepository.queryRunner,
    );
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    return this.find({
      where: { owner: { id: ownerId } },
      relations: ['category', 'reviews'],
    });
  }

  async findByCategory(categoryId: string): Promise<Business[]> {
    return this.find({
      where: { category: { id: categoryId } },
      relations: ['owner', 'category', 'reviews'],
    });
  }
}
