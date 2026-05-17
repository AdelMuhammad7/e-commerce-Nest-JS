/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Length,
  IsEnum,
  IsUrl,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/common/decorator/role.decorator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
export class CreateUserDto {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  password: string;

  @IsString()
  @Length(5, 30)
  passwordConfirm: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('EG', { message: 'Phone Number must be from EGYPT' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsString()
  @IsOptional()
  verificationCode: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
