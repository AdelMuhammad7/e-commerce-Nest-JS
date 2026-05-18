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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @docs    ===>  Create Category
  // @Routes  ===>  GET   api/v1/category
  // @access  ===>  ['admin']
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  // @docs    ===>  get all Categories
  // @Routes  ===>  GET   api/v1/category
  // @access  ===>  ['admin', 'user']
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryDto) {
    return this.categoryService.findAll(query);
  }

  // @docs    ===>  get one Category
  // @Routes  ===>  GET   api/v1/category/:id
  // @access  ===>  ['admin', 'user']
  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  // @docs    ===>  Update Category
  // @Routes  ===>  PATCH   api/v1/category/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  // @docs    ===>  Delete Category
  // @Routes  ===>  DELETE   api/v1/category/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
