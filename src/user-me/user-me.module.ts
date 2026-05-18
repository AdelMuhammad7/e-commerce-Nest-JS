import { Module } from '@nestjs/common';
import { UserMeService } from './user-me.service';
import { UserMeController } from './user-me.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserMeController],
  providers: [UserMeService],
})
export class UserMeModule {}
