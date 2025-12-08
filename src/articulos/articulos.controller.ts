import {
  Controller,
  Get,
  // Post,
  // Body,
  // Param,
  // Put,
  // Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ArticulosService } from './articulos.service.js';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard.js';
// import { RolesGuard } from '../auth/guards/roles.guard.js';
// import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('articulos')
@UseGuards(JwtAuthGuard) // Protege todas las rutas del controlador
export class ArticulosController {
  constructor(private articulosService: ArticulosService) {}

  @Get('index')
  async index() {
    return this.articulosService.findAll();
  }

  @Get('arbol-costos/:id')
  async arbolCostos(@Param('id') id: string) {
    return this.articulosService.obtenerArbolCostos(+id);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.articulosService.findOne(+id);
  // }

  // @Post()
  // @UseGuards(RolesGuard) // Opcional: si solo ciertos roles pueden crear
  // @Roles('ROLE_ADMIN') // Opcional: solo administradores
  // async create(@Body() data: any) {
  //   return this.articulosService.create(data);
  // }

  // @Put(':id')
  // @UseGuards(RolesGuard)
  // @Roles('ROLE_ADMIN')
  // async update(@Param('id') id: string, @Body() data: any) {
  //   return this.articulosService.update(+id, data);
  // }

  // @Delete(':id')
  // @UseGuards(RolesGuard)
  // @Roles('ROLE_ADMIN')
  // async delete(@Param('id') id: string) {
  //   return this.articulosService.delete(+id);
  // }
}
