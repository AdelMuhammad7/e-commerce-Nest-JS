import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './brand.schema';
import { APIFeatures } from 'src/common/utils/api-features';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  // create brand
  async create(createBrandDto: CreateBrandDto) {
    const brandExist = await this.brandModel.findOne({
      name: createBrandDto.name,
    });
    if (brandExist) {
      throw new HttpException('brand is exist', 400);
    }
    const brand = await this.brandModel.create(createBrandDto);

    return {
      status: 201,
      message: 'brand created successfully',
      data: brand,
    };
  }

  // get all brands
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.brandModel.find(), query)
      .filter()
      .search(['name'])
      .select()
      .sort()
      .pagination();

    const brands = await features.getQuery().lean();
    const total = await this.brandModel.countDocuments();

    return {
      status: 200,
      results: brands.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: brands,
    };
  }

  // get one brand
  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).lean();

    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 200,
      message: 'brand found successfully',
      data: brand,
    };
  }

  // update brand
  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    });
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 200,
      message: 'brand updated successfully',
      data: brand,
    };
  }

  // delete brand
  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 200,
      message: 'brand removed successfully',
    };
  }
}
