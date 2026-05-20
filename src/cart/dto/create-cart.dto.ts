import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}
