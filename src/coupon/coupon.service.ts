import { HttpException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';
import { QueryDto } from 'src/common/dto/query.dto';
import { APIFeatures } from 'src/common/utils/api-features';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  // create coupon
  async create(createCouponDto: CreateCouponDto) {
    const couponExist = await this.couponModel.findOne({
      name: createCouponDto.name,
    });
    if (couponExist) {
      throw new HttpException('coupon is exist', 400);
    }

    const coupon = await this.couponModel.create(createCouponDto);
    return {
      status: 201,
      message: 'coupon created successfully',
      data: coupon,
    };
  }

  // get all coupons
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.couponModel.find(), query)
      .filter()
      .search(['name'])
      .select()
      .sort()
      .pagination();

    const coupons = await features.getQuery().lean();
    const total = await this.couponModel.countDocuments();

    return {
      status: 200,
      results: coupons.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: coupons,
    };
  }

  // get one coupon
  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) {
      throw new HttpException('coupon not found', 404);
    }
    return {
      status: 200,
      message: 'coupon retrieved successfully',
      data: coupon,
    };
  }

  // update coupon
  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      {
        new: true,
      },
    );
    if (!coupon) {
      throw new HttpException('coupon not found', 404);
    }
    return {
      status: 200,
      message: 'coupon updated successfully',
      data: coupon,
    };
  }

  // delete coupon
  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) {
      throw new HttpException('coupon not found', 404);
    }
    return {
      status: 200,
      message: 'coupon removed successfully',
    };
  }
}
