import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('user')
@Roles([UserRole.ADMIN])
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @docs    ===>  Create User
  // @Routes  ===>  POST   api/v1/user
  // @access  ===>  ['admin']
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @docs    ===>  Get All Users
  // @Routes  ===>  GET   api/v1/user
  // @access  ===>  ['admin']
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @docs    ===>  Get One User
  // @Routes  ===>  GET   api/v1/user/:id
  // @access  ===>  ['admin']
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // @docs    ===>  Update One User
  // @Routes  ===>  GET   api/v1/user/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
