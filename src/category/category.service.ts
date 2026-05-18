import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto } from 'src/common/dto/query.dto';
import { APIFeatures } from 'src/common/utils/api-features';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // create category
  async create(createCategoryDto: CreateCategoryDto) {
    const existCategory = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (existCategory) {
      throw new HttpException('category is exist', 400);
    }
    const category = await this.categoryModel.create(createCategoryDto);

    return {
      status: 201,
      message: 'category created successfully',
      data: category,
    };
  }

  // get all categories
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.categoryModel.find(), query)
      .filter()
      .search(['name'])
      .select()
      .sort()
      .pagination();

    const categories = await features
      .getQuery()
      .populate('subCategories')
      .lean({ virtuals: true });
    const total = await this.categoryModel.countDocuments();

    return {
      status: 200,
      results: categories.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: categories,
    };
  }

  // get one category
  async findOne(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('subCategories');
    if (!category) {
      throw new NotFoundException('category not foumd');
    }
    return {
      status: 200,
      message: 'get your category successfully',
      data: category,
    };
  }

  // upadte category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    if (!category) {
      throw new NotFoundException();
    }
    return {
      status: 201,
      message: 'category updated successfully',
      data: category,
    };
  }

  // delete category
  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException();
    }
    return {
      status: 204,
      message: 'category deleted successfully',
    };
  }
}
