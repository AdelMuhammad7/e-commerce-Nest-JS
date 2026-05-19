import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [50, 'Name must be at most 50 characters'],
  })
  name: string;

  @Prop({
    type: Date,
    required: true,
  })
  expireDate: Date;

  @Prop({
    type: Number,
    required: true,
  })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
