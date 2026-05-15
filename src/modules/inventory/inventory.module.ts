import { Module } from '@nestjs/common';
import { AttributesModule } from './attributes/attributes.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [AttributesModule, CategoriesModule, TagsModule, UnitsModule],
  exports: [AttributesModule, CategoriesModule, TagsModule, UnitsModule],
})
export class InventoryModule {}
