import { Controller, Get, Param, Inject } from '@nestjs/common'
import type { ITaxCategoryRepository } from '../repositories/tax-category.repository.interface'

@Controller('tax-categories')
export class TaxCategoriesController {
  constructor(
    @Inject('ITaxCategoryRepository') private readonly categoryRepo: ITaxCategoryRepository,
  ) {}

  @Get()
  findAll() {
    return this.categoryRepo.findMany({ active: true })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryRepo.findById(id)
  }
}
