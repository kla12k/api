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
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('properties')
export class PropertyController {
  private readonly logger = new Logger(PropertyController.name);
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  // Since you commented out the @UseGuards, we need to handle the case when req.user might be undefined
  async create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    // Check if req.user exists before accessing its id
    const userId = req.user?.id;
    return this.propertyService.create(createPropertyDto, userId);
  }

  // @Get()
  // findAll() {
  //   return this.propertyService.findAll();
  // }

  // @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.propertyService.findOne(id);
  //   }

  // @Get('owner/:ownerId')
  // @UseGuards(AuthGuard('jwt'))
  // findByOwner(@Param('ownerId') ownerId: string) {
  //   return this.propertyService.findByOwner(ownerId);
  // }

  // @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePropertyDto: UpdatePropertyDto,
  // ) {
  //   return this.propertyService.update(id, updatePropertyDto);
  // }

  // @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  // delete(@Param('id') id: string) {
  //   return this.propertyService.remove(id);
  // }
}
