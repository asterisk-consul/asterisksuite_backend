import { PartialType } from '@nestjs/mapped-types';

import { CreateVariantCostDto } from './create-variant-cost.dto';

export class UpdateVariantCostDto extends PartialType(CreateVariantCostDto) {}
