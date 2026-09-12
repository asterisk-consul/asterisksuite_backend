import { PartialType } from '@nestjs/mapped-types';

import { CreateEngineeringComponentDto } from './create-engineering-component.dto';

export class UpdateEngineeringComponentDto extends PartialType(
  CreateEngineeringComponentDto,
) {}
