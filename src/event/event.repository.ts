import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class EventRepository extends Repository<Event> {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {
    super(
      eventRepository.target,
      eventRepository.manager,
      eventRepository.queryRunner,
    );
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    return this.find({
      where: { organizer: { id: organizerId } },
      relations: ['category', 'organizer'],
    });
  }

  async findByCategory(categoryId: string): Promise<Event[]> {
    return this.find({
      where: { category: { id: categoryId } },
      relations: ['organizer', 'category'],
    });
  }
}
