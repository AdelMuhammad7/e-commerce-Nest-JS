import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @docs    ===>  Create Product
  // @Routes  ===>  POST   api/v1/product
  // @access  ===>  ['admin']
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // @docs    ===>  GEt ALl Product
  // @Routes  ===>  GET   api/v1/product
  // @access  ===>  ['admin', 'user']
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryDto) {
    return this.productService.findAll(query);
  }

  // @docs    ===>  GEt One Product
  // @Routes  ===>  GET   api/v1/product/:id
  // @access  ===>  ['admin', 'user']
  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // @docs    ===>  Update Product
  // @Routes  ===>  Patch   api/v1/product/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  // @docs    ===>  DELETE Product
  // @Routes  ===>  DELETE   api/v1/product/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
