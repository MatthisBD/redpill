import { Controller, Get, Post, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CoordinatesService, CreateCoordinateDto } from './coordinates.service';

@Controller('coordinates')
export class CoordinatesController {
  constructor(private readonly coordinatesService: CoordinatesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.coordinatesService.findByCategory(category);
    }
    return this.coordinatesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCoordinateDto) {
    if (!dto.name || dto.x === undefined || dto.y === undefined || dto.z === undefined) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }
    return this.coordinatesService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const success = this.coordinatesService.delete(id);
    if (!success) {
      throw new HttpException('Coordinate not found', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }
}
