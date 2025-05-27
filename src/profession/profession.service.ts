import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profession, ProfessionType } from './entities/profession.entity';
import { User } from '../auth/entities/user.entity';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ProfessionResponseDto } from './dto/profession-response.dto';
import { UserRoles } from '../auth/enums/user-roles.enum';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectRepository(Profession)
    private professionRepository: Repository<Profession>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createProfessionDto: CreateProfessionDto,
    userId: string,
  ): Promise<ProfessionResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has the appropriate role
    if (user.role !== UserRoles.PROFESSIONAL && user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException(
        'Only professionals or admins can create profession profiles',
      );
    }

    // Create the profession entity
    const profession = this.professionRepository.create({
      ...createProfessionDto,
      user,
      userId,
    });

    const savedProfession = await this.professionRepository.save(profession);
    return this.mapToResponseDto(savedProfession);
  }

  async findAll(type?: ProfessionType): Promise<ProfessionResponseDto[]> {
    const query = this.professionRepository
      .createQueryBuilder('profession')
      .leftJoinAndSelect('profession.user', 'user')
      .where('profession.isActive = :isActive', { isActive: true });

    if (type) {
      query.andWhere('profession.professionType = :type', { type });
    }

    const professions = await query.getMany();

    return professions.map((profession) => this.mapToResponseDto(profession));
  }

  async findOne(id: string): Promise<ProfessionResponseDto> {
    const profession = await this.professionRepository.findOne({
      where: { id, isActive: true },
      relations: ['user'],
    });

    if (!profession) {
      throw new NotFoundException('Profession not found');
    }

    return this.mapToResponseDto(profession);
  }

  async update(
    id: string,
    updateProfessionDto: UpdateProfessionDto,
    userId: string,
  ): Promise<ProfessionResponseDto> {
    const profession = await this.professionRepository.findOne({
      where: { id, isActive: true },
      relations: ['user'],
    });

    if (!profession) {
      throw new NotFoundException('Profession not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (profession.userId !== userId && user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException(
        'You can only update your own profession profile',
      );
    }

    Object.assign(profession, updateProfessionDto);
    const updatedProfession = await this.professionRepository.save(profession);

    return this.mapToResponseDto(updatedProfession);
  }

  async remove(id: string, userId: string): Promise<void> {
    const profession = await this.professionRepository.findOne({
      where: { id, isActive: true },
      relations: ['user'],
    });

    if (!profession) {
      throw new NotFoundException('Profession not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (profession.userId !== userId && user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException(
        'You can only delete your own profession profile',
      );
    }

    // Soft delete
    profession.isActive = false;
    await this.professionRepository.save(profession);
  }

  async findByUserId(userId: string): Promise<ProfessionResponseDto[]> {
    const professions = await this.professionRepository.find({
      where: { userId, isActive: true },
      relations: ['user'],
    });

    const user = professions.length > 0 ? professions[0].user : null;
    return professions.map((profession) => this.mapToResponseDto(profession));
  }

  async findByLocation(location: string): Promise<ProfessionResponseDto[]> {
    const professions = await this.professionRepository.find({
      where: {
        location: location,
        isActive: true,
      },
      relations: ['user'],
    });

    return professions.map((profession) => this.mapToResponseDto(profession));
  }

  async findBySpecialty(specialty: string): Promise<ProfessionResponseDto[]> {
    const professions = await this.professionRepository
      .createQueryBuilder('profession')
      .leftJoinAndSelect('profession.user', 'user')
      .where('profession.isActive = :isActive', { isActive: true })
      .andWhere('profession.specialties LIKE :specialty', {
        specialty: `%${specialty}%`,
      })
      .getMany();

    return professions.map((profession) => this.mapToResponseDto(profession));
  }

  private mapToResponseDto(profession: Profession): ProfessionResponseDto {
    return {
      id: profession.id,
      name: profession.name,
      professionType: profession.professionType,
      biography: profession.biography,
      location: profession.location,
      contact: profession.contact,
      specialties: profession.specialties,
      image: profession.image,
      userId: profession.userId,
      user: profession.user,
      createdAt: profession.createdAt,
      updatedAt: profession.updatedAt,
    };
  }
}
