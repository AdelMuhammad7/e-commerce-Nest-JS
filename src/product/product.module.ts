import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { Category, CatgeorySchema } from 'src/category/category.schema';
import {
  SubCategory,
  SubCatgeorySchema,
} from 'src/sub-category/sub-category.schema';
import { Brand, BrandSchema } from 'src/brand/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CatgeorySchema },
    ]),
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCatgeorySchema },
    ]),
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
