import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';

import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import type { RequestWithUser } from 'src/common/interface/request.interface';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRole.USER])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ====================================
  // Add product to cart
  // POST api/v1/cart/:productId
  // ====================================
  @Post(':productId')
  create(@Param('productId') productId: string, @Req() req: RequestWithUser) {
    return this.cartService.create(productId, req);
  }

  // ====================================
  // Get logged user cart
  // GET api/v1/cart
  // ====================================
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.cartService.findAll(req);
  }

  // ====================================
  // Update product quantity
  // PATCH api/v1/cart/:productId
  // ====================================
  @Patch(':productId')
  update(
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: RequestWithUser,
  ) {
    return this.cartService.update(productId, updateCartDto, req);
  }

  // ====================================
  // Remove product from cart
  // DELETE api/v1/cart/:productId
  // ====================================
  @Delete(':productId')
  remove(@Param('productId') productId: string, @Req() req: RequestWithUser) {
    return this.cartService.remove(productId, req);
  }

  // ====================================
  // Clear cart
  // DELETE api/v1/cart
  // ====================================
  @Delete()
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req);
  }
}
