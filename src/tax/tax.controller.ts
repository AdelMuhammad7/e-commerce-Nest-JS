import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Roles, UserRole } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdate(createTaxDto);
  }

  @Get()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  find() {
    return this.taxService.find();
  }

  @Delete()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  remove() {
    return this.taxService.reSet();
  }
}
