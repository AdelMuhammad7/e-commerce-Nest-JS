import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SigninDto,
  VerifyDataDto,
} from './dto/signon.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @docs    ===>  sign up User
  // @Routes  ===>  POST   api/v1/auth/signup
  // @access  ===>  public
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // @docs    ===>  sign in
  // @Routes  ===>  POST   api/v1/auth/signin
  // @access  ===>  public
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  // @docs    ===>  forget password
  // @Routes  ===>  POST   api/v1/auth/reset-password
  // @access  ===>  public
  @Post('reset-password')
  resetPassword(@Body() email: ResetPasswordDto) {
    return this.authService.resetPassword(email);
  }

  // @docs    ===>  verify code
  // @Routes  ===>  POST   api/v1/auth/verify-code
  // @access  ===>  public
  @Post('verify-code')
  verifyCode(@Body() verifyData: VerifyDataDto) {
    return this.authService.verifyCode(verifyData);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
