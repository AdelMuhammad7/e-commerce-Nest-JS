import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinDate,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(), {
    message: 'expireDate must be a future date',
  })
  expireDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  discount: number;
}
