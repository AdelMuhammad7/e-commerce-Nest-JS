import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {}

  async createOrUpdate(createTaxDto: CreateTaxDto) {
    const tax = await this.taxModel.findOne();
    if (!tax) {
      const newTax = await this.taxModel.create(createTaxDto);
      return {
        status: 201,
        message: 'tax created successfully',
        data: newTax,
      };
    }
    const updatedTax = await this.taxModel.findOneAndUpdate({}, createTaxDto, {
      new: true,
    });
    return {
      status: 200,
      message: 'tax updated successfully',
      data: updatedTax,
    };
  }

  async find() {
    const taxes = await this.taxModel.find();
    return {
      status: 200,
      message: 'taxes retrieved successfully',
      data: taxes,
    };
  }

  async reSet() {
    await this.taxModel.findOneAndUpdate({}, { taxPrice: 0, shippingPrice: 0 });
    return {
      status: 200,
      message: 'tax reset successfully',
    };
  }
}
