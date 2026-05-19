import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [50, 'Name must be at most 50 characters'],
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    min: [3, 'description must be at least 3 characters'],
    max: [500, 'description must be at most 50 characters'],
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Price must be a positive number'],
  })
  price: number;

  @Prop({
    type: String,
  })
  image: string;

  @Prop({
    type: [String],
  })
  gallery: string[];

  @Prop({
    type: Number,
    required: true,
    min: [0, 'stock must be a positive number'],
  })
  stock: number;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'sold must be a positive number'],
  })
  sold: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
