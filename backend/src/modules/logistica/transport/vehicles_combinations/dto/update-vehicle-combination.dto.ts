import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleCombinationDto } from './create-vehicle-combination.dto';

export class UpdateVehicleCombinationDto extends PartialType(
  CreateVehicleCombinationDto,
) {}
