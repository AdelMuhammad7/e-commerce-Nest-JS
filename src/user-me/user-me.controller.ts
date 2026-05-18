import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMeService } from './user-me.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import type { RequestWithUser } from 'src/common/interface/request.interface';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('users')
export class UserMeController {
  constructor(private readonly userMeService: UserMeService) {}

  // @docs    ===>  GEt ME
  // @Routes  ===>  GET   api/v1/user/getMe
  // @access  ===>  ['admin', 'user']
  @Get('getMe')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  getMe(@Req() req: RequestWithUser) {
    return this.userMeService.getMe(req);
  }

  // @docs    ===>  Update ME
  // @Routes  ===>  PATCH   api/v1/user/updateMe
  // @access  ===>  ['admin', 'user']
  @Patch('updateMe')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  updateMe(@Req() req: RequestWithUser, @Body() updateMeDto: UpdateUserDto) {
    return this.userMeService.updateMe(req, updateMeDto);
  }

  // @docs    ===>  Delete ME
  // @Routes  ===>  Delete   api/v1/user/deleteMe
  // @access  ===>  ['admin', 'user']
  @Delete('deleteMe')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  deleteMe(@Req() req: RequestWithUser) {
    return this.userMeService.deleteMe(req);
  }
}
