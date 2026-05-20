import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import type { RequestWithUser } from 'src/common/interface/request.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // ==========================
  // create cart / add product
  // ==========================
  async create(productId: string, req: RequestWithUser) {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    let cart = await this.cartModel.findOne({ user: req.user._id });

    if (!cart) {
      cart = await this.cartModel.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            quantity: 1,
          },
        ],
        totalPrice: product.price,
      });

      return {
        status: 201,
        message: 'Product added to cart successfully',
        data: cart,
      };
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      cart.cartItems.push({
        product: productId,
        quantity: 1,
      });
    } else {
      if (cartItem.quantity >= product.stock) {
        throw new BadRequestException('Cannot add more than available stock');
      }

      cartItem.quantity += 1;
    }

    cart.totalPrice += product.price;

    await cart.save();

    return {
      status: 200,
      message: 'Product added to cart successfully',
      data: cart,
    };
  }

  // ==========================
  // get logged user cart
  // ==========================
  async findAll(req: RequestWithUser) {
    const cart = await this.cartModel
      .findOne({ user: req.user._id })
      .populate('cartItems.product');

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return {
      status: 200,
      results: cart.cartItems.length,
      data: cart,
    };
  }

  // ==========================
  // update quantity
  // ==========================
  async update(
    productId: string,
    updateCartDto: UpdateCartDto,
    req: RequestWithUser,
  ) {
    const { quantity } = updateCartDto;

    if (quantity === undefined) {
      throw new BadRequestException('Quantity is required');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cart = await this.cartModel.findOne({
      user: req.user._id,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    // update total price
    cart.totalPrice =
      cart.totalPrice -
      cartItem.quantity * product.price +
      quantity * product.price;

    // update quantity
    cartItem.quantity = quantity;

    await cart.save();

    return {
      status: 200,
      message: 'Cart updated successfully',
      data: cart,
    };
  }

  // ==========================
  // remove product from cart
  // ==========================
  async remove(productId: string, req: RequestWithUser) {
    const cart = await this.cartModel.findOne({
      user: req.user._id,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // update total price
    cart.totalPrice -= cartItem.quantity * product.price;

    // remove product
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId,
    );

    // if cart empty => delete cart
    if (cart.cartItems.length === 0) {
      await this.cartModel.findByIdAndDelete(cart._id);

      return {
        status: 200,
        message: 'Cart deleted because it became empty',
      };
    }

    await cart.save();

    return {
      status: 200,
      message: 'Product removed successfully',
      data: cart,
    };
  }

  // ==========================
  // clear logged user cart
  // ==========================
  async clearCart(req: RequestWithUser) {
    const cart = await this.cartModel.findOne({
      user: req.user._id,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartModel.findByIdAndDelete(cart._id);

    return {
      status: 200,
      message: 'Cart cleared successfully',
    };
  }
}
