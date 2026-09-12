import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { LinkUserDto } from './dto/link-user.dto';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('erp/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @RequirePermissions('employees.create')
  @Post()
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: AuthUser) {
    return this.employeesService.create(dto, user.id);
  }

  @RequirePermissions('employees.read')
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  // Sin @RequirePermissions: endpoint self-scoped (solo retorna el empleado del usuario logueado).
  // Necesario para que cualquier vendedor vea "Mis ventas" sin requerir employees.read.
  @Get('me')
  findMe(@CurrentUser() user: AuthUser) {
    return this.employeesService.findByUserId(user.id);
  }

  @RequirePermissions('employees.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @RequirePermissions('employees.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto, @CurrentUser() user: AuthUser) {
    return this.employeesService.update(id, dto, user.id);
  }

  @RequirePermissions('employees.update')
  @Patch(':id/link-user')
  linkUser(@Param('id') id: string, @Body() dto: LinkUserDto) {
    return this.employeesService.linkUser(id, dto.user_id);
  }

  @RequirePermissions('employees.update')
  @Patch(':id/unlink-user')
  unlinkUser(@Param('id') id: string) {
    return this.employeesService.unlinkUser(id);
  }

  @RequirePermissions('employees.delete')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.employeesService.remove(id, user.id);
  }
}
