import { IsNumber, IsOptional } from 'class-validator';

export class CreateTaxDto {
  @IsNumber()
  @IsOptional()
  taxPrice: number;

  @IsNumber()
  @IsOptional()
  shippingPrice: number;
}
