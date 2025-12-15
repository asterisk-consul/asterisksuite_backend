import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categorias.dto.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
