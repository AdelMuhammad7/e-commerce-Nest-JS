import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './supplier.schema';
import { Model } from 'mongoose';
import { APIFeatures } from 'src/common/utils/api-features';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}

  // create supplier
  async create(createSupplierDto: CreateSupplierDto) {
    const supplierExist = await this.supplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (supplierExist) {
      throw new HttpException('supplier is exist', 400);
    }

    const supplier = await this.supplierModel.create(createSupplierDto);
    return {
      status: 201,
      message: 'supplier created successfully',
      data: supplier,
    };
  }

  // get all suppliers
  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.supplierModel.find(), query)
      .filter()
      .search(['name'])
      .select()
      .sort()
      .pagination();

    const suppliers = await features.getQuery().lean();
    const total = await this.supplierModel.countDocuments();

    return {
      status: 200,
      results: suppliers.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: suppliers,
    };
  }

  // get one supplier
  async findOne(id: string) {
    const supplier = await this.supplierModel.findById(id);
    if (!supplier) {
      throw new HttpException('supplier not found', 404);
    }
    return {
      status: 200,
      message: 'supplier retrieved successfully',
      data: supplier,
    };
  }

  // update supplier
  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      {
        new: true,
      },
    );
    if (!supplier) {
      throw new HttpException('supplier not found', 404);
    }
    return {
      status: 200,
      message: 'supplier updated successfully',
      data: supplier,
    };
  }

  // remove supplier
  async remove(id: string) {
    const supplier = await this.supplierModel.findByIdAndDelete(id);
    if (!supplier) {
      throw new HttpException('supplier not found', 404);
    }
    return {
      status: 200,
      message: 'supplier removed successfully',
    };
  }
}
