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
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  // @docs    ===>  Create SubCategory
  // @Routes  ===>  GET   api/v1/sub-category
  // @access  ===>  ['admin']
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  // @docs    ===>  get all Sub-Categories
  // @Routes  ===>  GET   api/v1/sub-category
  // @access  ===>  ['admin', 'user']
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryDto) {
    return this.subCategoryService.findAll(query);
  }

  // @docs    ===>  get one Sub-Categories
  // @Routes  ===>  GET   api/v1/sub-category/:id
  // @access  ===>  ['admin', 'user']
  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  // @docs    ===>  Update Sub Category
  // @Routes  ===>  PATCH   api/v1/sub-category/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  // @docs    ===>  Delete Sub Category
  // @Routes  ===>  DELETE   api/v1/sub-category/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
