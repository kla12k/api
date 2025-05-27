// Business module configuration
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './business.controller.js';
import { BusinessService } from './business.service.js';
import { Business } from './entities/business.entity.js';
import { User } from '../auth/entities/user.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Business, User, Category]), AuthModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
