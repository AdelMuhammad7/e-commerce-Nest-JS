import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SigninDto } from './dto/signon.dto';

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
}
