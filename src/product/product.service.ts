import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';
import { Brand } from 'src/brand/brand.schema';
import { QueryDto } from 'src/common/dto/query.dto';
import { APIFeatures } from 'src/common/utils/api-features';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  // create product
  async create(createProductDto: CreateProductDto) {
    // 1- check if product is exist
    const product = await this.productModel.findOne({
      name: createProductDto.name,
    });
    if (product) {
      throw new HttpException('product is exist', 400);
    }

    // 2- check if category is exist
    const categoryExist = await this.categoryModel.findById(
      createProductDto.category,
    );
    if (!categoryExist) {
      throw new HttpException('category is not exist', 400);
    }

    // 3- check if sub-category is exist
    if (createProductDto?.subCategory) {
      const subCategoryExist = await this.subCategoryModel.findById(
        createProductDto.subCategory,
      );
      if (!subCategoryExist) {
        throw new HttpException('sub-category is not exist', 400);
      }
    }
    // 4- check if brand is exist
    if (createProductDto?.brand) {
      const brandExist = await this.brandModel.findById(createProductDto.brand);
      if (!brandExist) {
        throw new HttpException('brand is not exist', 400);
      }
    }

    // 5- create product
    const newProduct = await this.productModel.create(createProductDto);
    return {
      status: 201,
      message: 'product created successfully',
      data: newProduct,
    };
  }

  // get all products
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.productModel.find(), query)
      .filter()
      .search(['name', 'description'])
      .select()
      .sort()
      .pagination();

    const products = await features
      .getQuery()
      .populate('category subCategory brand')
      .lean();
    const total = await this.productModel.countDocuments();

    return {
      status: 200,
      results: products.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: products,
    };
  }

  // get one product
  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();

    if (!product) {
      throw new NotFoundException('product not found');
    }
    return {
      status: 200,
      message: 'product found successfully',
      data: product,
    };
  }

  // update product
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return {
      status: 200,
      message: 'product updated successfully',
      data: product,
    };
  }

  // delete product
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return {
      status: 200,
      message: 'product removed successfully',
    };
  }
}
