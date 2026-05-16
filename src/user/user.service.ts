import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { APIFeatures } from 'src/common/utils/api-features';
import { QueryDto } from 'src/common/dto/query.dto';

const saltOrRounds = 10;
@Injectable()
export class UserService {
  // this for inject database with service
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    // 1 ===> find if user exist
    const ifUserExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (ifUserExist) {
      throw new BadRequestException('User already exists');
    }

    // 2 ===> Hash Password by ['bcrypt']
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

    // 3 ===> make a new object {'user'} and create user
    const res = await this.userModel.create({
      ...createUserDto,
      password,
      role: createUserDto.role ?? 'user',
    });

    return {
      status: 201,
      message: 'User Created successfully',
      data: res,
    };
  }

  // findAll() {
  //   return this.userModel.find().select('-__v');
  // }

  async findAll(query: QueryDto) {
    const features = new APIFeatures(this.userModel.find(), query)
      .filter()
      .search(['name', 'email', 'role'])
      .select()
      .sort()
      .pagination();

    const users = await features.getQuery().select('-password').lean();

    const total = await this.userModel.countDocuments();

    return {
      status: 200,
      results: users.length,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      },

      data: users,
    };
  }

  async findOne(
    id: string,
  ): Promise<{ status: number; message: string; data: User }> {
    const user = await this.userModel.findById(id).select('-__v');
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return {
      status: 200,
      message: 'Get User successfully',
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    // ===> Hash password if exists
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }
    // ===> Update user
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 201,
      message: 'user updated successfully',
      data: user,
    };
  }

  async remove(id: string): Promise<{ status: number; message: string }> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('Not found User');
    }
    return {
      status: 200,
      message: 'user deleted successfully',
    };
  }
}
