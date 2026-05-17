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
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SigninDto,
  VerifyDataDto,
} from './dto/signon.dto';
import { MailerService } from '@nestjs-modules/mailer';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
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

  // forgetPassword service
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const generateVerifactionCode = Math.floor(100000 + Math.random() * 900000);

    await this.userModel.findOneAndUpdate(
      {
        email: resetPasswordDto.email,
      },
      { verificationCode: generateVerifactionCode },
    );

    // use nodemailer
    const htmlMessage = `
            <div>
              <h1>
                Forgot your password? If you didn't forget your password,
                please ignore this email!
              </h1>

              <p>
                use the following code to verify your account
              </p>

              <h3 style="color: red; font-weight: bold;">
                ${generateVerifactionCode}
              </h3>

              <b>Nest JS E-commerce</b>
            </div>
            `;

    await this.mailService.sendMail({
      from: `NestJS_E-commerce <${process.env.EMAIL_USERNAME}>`,
      to: resetPasswordDto.email,
      subject: `Nest JS E-commerce - reset password`,
      html: htmlMessage,
    });
    return {
      status: 200,
      message: `Code sent successfully to your email >>> ${resetPasswordDto.email}`,
    };
  }

  // verify code
  async verifyCode(verifyData: VerifyDataDto) {
    const user = await this.userModel
      .findOne({ email: verifyData.email })
      .select('verificationCode');

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (user.verificationCode !== verifyData.code) {
      throw new BadRequestException('Verificaton code is incorrect');
    }

    await this.userModel.findOneAndUpdate(
      { email: verifyData.email },
      { verificationCode: null, verificationStatus: true },
    );

    return {
      status: 200,
      message: 'code verified successfully',
    };
  }

  // change password
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findOne({
      email: changePasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!user.verificationStatus) {
      throw new NotFoundException('Email is in correct');
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.passwordConfirmation
    ) {
      throw new BadRequestException('password confirm is in correct');
    }

    // 2 ==> hash password
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltOrRounds,
    );

    await this.userModel.findOneAndUpdate(
      { email: changePasswordDto.email },
      { password: hashedPassword, verificationStatus: false },
    );

    return {
      status: 200,
      message: 'password changed successfully, go to login',
    };
  }
}
