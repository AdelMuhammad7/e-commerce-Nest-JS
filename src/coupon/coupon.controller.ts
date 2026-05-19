import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('coupon')
@Roles([UserRole.ADMIN])
@UseGuards(AuthGuard, RolesGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // @docs    ===>  Create Coupon
  // @Routes  ===>  POST   api/v1/coupon
  // @access  ===>  ['admin']
  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  // @docs    ===>  GEt All Coupon
  // @Routes  ===>  GET   api/v1/coupon
  // @access  ===>  ['admin']
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.couponService.findAll(query);
  }

  // @docs    ===>  GEt one Coupon
  // @Routes  ===>  GET   api/v1/coupon/:id
  // @access  ===>  ['admin']
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  // @docs    ===>  update one Coupon
  // @Routes  ===>  Patch   api/v1/coupon/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  // @docs    ===>  Delete one Coupon
  // @Routes  ===>  DELETE   api/v1/coupon/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
