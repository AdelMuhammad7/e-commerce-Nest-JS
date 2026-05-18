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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // @docs    ===>  Create Brand
  // @Routes  ===>  POST   api/v1/brand
  // @access  ===>  ['admin']
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  // @docs    ===>  Get All Brands
  // @Routes  ===>  GET   api/v1/brand
  // @access  ===>  ['admin', 'user']
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryDto) {
    return this.brandService.findAll(query);
  }

  // @docs    ===>  get One Brand
  // @Routes  ===>  GET   api/v1/brand/:id
  // @access  ===>  ['admin', 'user']
  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  // @docs    ===>  Update Brand
  // @Routes  ===>  Update   api/v1/brand/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  // @docs    ===>  Delete Brand
  // @Routes  ===>  Delete   api/v1/brand/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
