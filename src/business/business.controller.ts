// src/business/business.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/enums/user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Logger } from '@nestjs/common';

@Controller('businesses')
export class BusinessController {
  private readonly logger = new Logger(BusinessController.name);

  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/business_images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Accept all files for now
        callback(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBusinessDto: CreateBusinessDto,
    @Request() req,
  ) {
    this.logger.log(`Creating business for user ${req.user.id}`);
    this.logger.log(`Received DTO: ${JSON.stringify(createBusinessDto)}`);

    if (file) {
      this.logger.log(
        `Received file: ${file.originalname}, size: ${file.size}`,
      );
    } else {
      this.logger.log('No file received');
    }

    return this.businessService.create(createBusinessDto, req.user.id, file);
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all active businesses');
    return this.businessService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching business ${id}`);
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.BUSINESS_OWNER, UserRoles.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @Request() req,
  ) {
    this.logger.log(`Updating business ${id} by user ${req.user.id}`);
    return this.businessService.update(id, updateBusinessDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.BUSINESS_OWNER, UserRoles.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    this.logger.log(`Deleting business ${id} by user ${req.user.id}`);
    return this.businessService.remove(id, req.user.id);
  }

  @Get('owner/:ownerId')
  @UseGuards(JwtAuthGuard)
  async findByOwnerId(@Param('ownerId') ownerId: string, @Request() req) {
    this.logger.log(
      `Fetching businesses for owner ${ownerId} by user ${req.user.id}`,
    );
    if (req.user.id !== ownerId && req.user.role !== UserRoles.ADMIN) {
      this.logger.warn(`Unauthorized access attempt by user ${req.user.id}`);
      return [];
    }
    return this.businessService.findByOwnerId(ownerId);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    this.logger.log(`Fetching businesses for category ${categoryId}`);
    return this.businessService.findByCategory(categoryId);
  }
}
