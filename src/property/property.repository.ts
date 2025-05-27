import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PropertyRepository extends Repository<Property> {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {
    super(
      propertyRepository.target,
      propertyRepository.manager,
      propertyRepository.queryRunner,
    );
  }

  async findByOwnerId(ownerId: string): Promise<Property[]> {
    return this.find({
      where: { owner: { id: ownerId } },
      relations: ['units'],
    });
  }
}
