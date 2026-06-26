import { PartialType } from '@nestjs/mapped-types';

import { CreateProductComponentDto } from './create-product-component.dto';

export class UpdateProductComponentDto extends PartialType(
  CreateProductComponentDto,
) {}
