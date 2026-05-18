import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Request } from 'express';
import { Model } from 'mongoose';
import { RequestWithUser } from 'src/common/interface/request.interface';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class UserMeService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  // get me
  async getMe(req: RequestWithUser) {
    const user = await this.userModel.findById(req.user._id);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      status: 200,
      message: 'get your data',
      data: user,
    };
  }

  // update me
  async updateMe(req: RequestWithUser, updateMeDto: UpdateUserDto) {
    const newUser = await this.userModel.findByIdAndUpdate(
      req.user._id,
      updateMeDto,
      { new: true },
    );
    if (!newUser) {
      throw new NotFoundException();
    }

    return {
      status: 200,
      message: 'updated successfully',
      data: newUser,
    };
  }

  // delete me
  async deleteMe(req: RequestWithUser) {
    const deletedUser = await this.userModel.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      success: 200,
      message: 'User deleted successfully',
    };
  }
}
