import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signon.dto';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // sign up service
  async signup(createUserDto: CreateUserDto) {
    // 1 ==> check if user exists
    const ifUserExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (ifUserExist) {
      throw new BadRequestException('User already exists');
    }

    // 2 ==> hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('password is not match');
    }

    // 3 ==> create user
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
    });

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 201,
      message: 'User Created successfully',
      data: user,
      token,
    };
  }

  // sign in service
  async signin(signinDto: SigninDto) {
    // 1 ==> check if user exists
    const user = await this.userModel
      .findOne({
        email: signinDto.email,
      })
      .select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(user);

    const isMatch = await bcrypt.compare(signinDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 200,
      message: 'User Logged in successfully',
      data: user,
      token,
    };
  }
}
