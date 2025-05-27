import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    userId?: string,
  ): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
    });

    // Only set the owner if userId is provided
    if (userId) {
      const owner = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!owner) {
        throw new NotFoundException(`Owner with ID ${userId} not found`);
      }
      property.owner = owner; // Set the actual User object, not just the ID
      property.ownerId = userId; // Also set the ownerId field
    }

    return this.propertyRepository.save(property);
  }

  // async findAll(): Promise<Property[]> {
  //   return this.propertyRepository.find({
  //     relations: ['owner', 'units', 'units.rentals'],
  //   });
  // }

  // async findOne(id: string): Promise<Property> {
  //   const property = await this.propertyRepository.findOne({
  //     where: { id },
  //     relations: ['owner', 'units', 'units.rentals'],
  //   });
  //   if (!property) {
  //     throw new NotFoundException(`Property with ID ${id} not found`);
  //   }
  //   return property;
  // }

  // async findByOwner(ownerId: string): Promise<Property[]> {
  //   if (!ownerId) {
  //     throw new NotFoundException('Owner ID must be provided');
  //   }
  //   return this.propertyRepository.find({
  //     where: { owner: { id: ownerId } },
  //     relations: ['units'],
  //   });
  // }

  // async update(
  //   id: string,
  //   updatePropertyDto: UpdatePropertyDto,
  // ): Promise<Property> {
  //   const property = await this.findOne(id);
  //   Object.assign(property, updatePropertyDto);
  //   return this.propertyRepository.save(property);
  // }

  // async remove(id: string): Promise<void> {
  //   const property = await this.findOne(id);
  //   await this.propertyRepository.remove(property);
  // }
}
