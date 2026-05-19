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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  // @docs    ===>  Create Supplier
  // @Routes  ===>  POST   api/v1/supplier
  // @access  ===>  ['admin']
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  // @docs    ===>  Get all Supplier
  // @Routes  ===>  GET   api/v1/supplier
  // @access  ===>  ['admin', 'user']
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryDto) {
    return this.supplierService.findAll(query);
  }

  // @docs    ===>  Get one Supplier
  // @Routes  ===>  GET   api/v1/supplier/:id
  // @access  ===>  ['admin', 'user']
  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  // @docs    ===>  Update Supplier
  // @Routes  ===>  Patch   api/v1/supplier/:id
  // @access  ===>  ['admin']
  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  // @docs    ===>  DElete Supplier
  // @Routes  ===>  DELETE   api/v1/supplier/:id
  // @access  ===>  ['admin']
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
