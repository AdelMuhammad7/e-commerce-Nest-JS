import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery: string[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sold: number;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsMongoId()
  @IsOptional()
  subCategory: string;

  @IsMongoId()
  @IsOptional()
  brand: string;
}
