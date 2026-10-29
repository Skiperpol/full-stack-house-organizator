import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FamilyInvitesService } from '../services/family-invites.service.js';
import { CreateFamilyInviteDto } from '../dto/create-family-invite.dto.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';

@Controller('family-invites')
export class FamilyInvitesController {
  constructor(private readonly familyInvitesService: FamilyInvitesService) {}

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body() createFamilyInviteDto: CreateFamilyInviteDto,
  ) {
    return this.familyInvitesService.create(userId, createFamilyInviteDto);
  }

  @Get()
  findAllByFamily(
    @Query('familyId', ParseIntPipe) familyId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.familyInvitesService.findAllByFamilyIdAndInvitedById(userId, {
      familyId,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':token')
  remove(
    @Param('token', ParseUUIDPipe) token: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.familyInvitesService.remove(token, userId);
  }
}
