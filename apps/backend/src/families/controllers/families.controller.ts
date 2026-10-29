import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FamiliesService } from '../services/families.service.js';
import { CreateFamilyDto } from '../dto/create-family.dto.js';
import { UpdateFamilyDto } from '../dto/update-family.dto.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import { FamilyOwnerGuard } from '../guards/family-owner.guard.js';
import { AuthGuard } from '@/auth/guards/auth.guard.js';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body() createFamilyDto: CreateFamilyDto,
  ) {
    return this.familiesService.create(userId, createFamilyDto);
  }

  @Get()
  findAllMine(@CurrentUser('id') userId: number) {
    return this.familiesService.findAllByUserId(userId);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.familiesService.findOneByUuid(uuid, userId);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser('id') userId: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(uuid, userId, updateFamilyDto);
  }

  @UseGuards(AuthGuard, FamilyOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.familiesService.remove(uuid);
  }
}
