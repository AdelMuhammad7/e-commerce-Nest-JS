import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://app:adel1234@cluster0.jbzpd1f.mongodb.net/ecommerce',
    ),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
