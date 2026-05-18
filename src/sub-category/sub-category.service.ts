import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { APIFeatures } from 'src/common/utils/api-features';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  // create sub-category
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    // 1- check if category exist or not
    const categoryExist = await this.CategoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!categoryExist) {
      throw new NotFoundException('category not found');
    }

    // 2- check if sub-category exist or not
    const subCategoryExist = await this.subCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });
    if (subCategoryExist) {
      throw new BadRequestException('sub-category is exists');
    }

    // 3- create sub category
    const subCategory = await (
      await this.subCategoryModel.create(createSubCategoryDto)
    ).populate('category');

    return {
      status: 201,
      message: 'sub-category created successfully',
      data: subCategory,
    };
  }

  // get all sub-category
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.subCategoryModel.find(), query)
      .filter()
      .search(['name'])
      .select()
      .sort()
      .pagination();

    const subCategories = await features.getQuery().lean();
    const total = await this.subCategoryModel.countDocuments();

    return {
      status: 200,
      results: subCategories.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: subCategories,
    };
  }

  // get one sub-category
  async findOne(id: string) {
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate('category');
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }
    return {
      status: 200,
      message: 'get your category successfully',
      data: subCategory,
    };
  }

  // update sub-category
  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const categoryExist = await this.CategoryModel.findById(
      updateSubCategoryDto.category,
    );
    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }
    const subCategory = await this.subCategoryModel.findByIdAndUpdate(
      id,
      updateSubCategoryDto,
      { new: true },
    );
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }

    return {
      status: 201,
      message: 'sub-category updated successfully',
      data: subCategory,
    };
  }

  // delete sub-category
  async remove(id: string) {
    const subCategory = await this.subCategoryModel.findByIdAndDelete(id);
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }
    return {
      status: 204,
      message: 'sub-category deleted successfully',
    };
  }
}
