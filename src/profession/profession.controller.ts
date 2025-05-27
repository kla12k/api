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
  Query,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/enums/user-roles.enum';
import { ProfessionType } from './entities/profession.entity';

@Controller('professions')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.PROFESSIONAL, UserRoles.ADMIN)
  async create(
    @Body() createProfessionDto: CreateProfessionDto,
    @Request() req,
  ) {
    try {
      console.log('Creating profession with data:', createProfessionDto);
      console.log('User ID:', req.user.id);
      return await this.professionService.create(
        createProfessionDto,
        req.user.id,
      );
    } catch (error) {
      console.error('Error creating profession:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Query('type') type?: ProfessionType) {
    return this.professionService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.PROFESSIONAL, UserRoles.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProfessionDto: UpdateProfessionDto,
    @Request() req,
  ) {
    return this.professionService.update(id, updateProfessionDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.PROFESSIONAL, UserRoles.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.professionService.remove(id, req.user.id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.professionService.findByUserId(userId);
  }

  @Get('location/:location')
  findByLocation(@Param('location') location: string) {
    return this.professionService.findByLocation(location);
  }

  @Get('specialty/:specialty')
  findBySpecialty(@Param('specialty') specialty: string) {
    return this.professionService.findBySpecialty(specialty);
  }
}
