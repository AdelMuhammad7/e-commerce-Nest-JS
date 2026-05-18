import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  category: string;
}
