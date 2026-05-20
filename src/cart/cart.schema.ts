import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ])
  cartItems: {
    product: string;
    quantity: number;
  }[];

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;

  @Prop({
    type: Number,
  })
  totalpriceAfterDiscount: number;

  @Prop({
    type: [
      {
        name: { type: String },
        couponId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Coupon',
          required: true,
        },
      },
    ],
  })
  coupon: {
    name: string;
    couponId: string;
  }[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
