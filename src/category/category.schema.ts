import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({
    type: String,
  })
  image: string;
}

export const CatgeorySchema = SchemaFactory.createForClass(Category);

CatgeorySchema.virtual('subCategories', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'category',
});

CatgeorySchema.set('toJSON', { virtuals: true });
CatgeorySchema.set('toObject', { virtuals: true });
