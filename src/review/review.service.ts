// Review service implementation
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity.js';
import { User } from '../auth/entities/user.entity';
import { Business } from '../business/entities/business.entity.js';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserRoles } from '../auth/enums/user-roles.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is a reviewer or regular user
    if (
      user.role !== UserRoles.REVIEWER &&
      user.role !== UserRoles.USER &&
      user.role !== UserRoles.ADMIN
    ) {
      throw new ForbiddenException(
        'Only reviewers and regular users can create reviews',
      );
    }

    const business = await this.businessRepository.findOne({
      where: { id: createReviewDto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Check if user has already reviewed this business
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        business: { id: createReviewDto.businessId },
      },
    });

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this business');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      business,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'business'],
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'business'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (review.userId !== userId && user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // If business ID is changing, verify the new business exists
    if (
      updateReviewDto.businessId &&
      updateReviewDto.businessId !== review.businessId
    ) {
      const business = await this.businessRepository.findOne({
        where: { id: updateReviewDto.businessId },
      });

      if (!business) {
        throw new NotFoundException('Business not found');
      }

      review.business = business;
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (review.userId !== userId && user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['business'],
    });
  }

  async findByBusinessId(businessId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { business: { id: businessId } },
      relations: ['user'],
    });
  }
}
