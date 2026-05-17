import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  password: string;
}
