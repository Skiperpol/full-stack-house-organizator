import { Module } from '@nestjs/common';
import { FamiliesService } from './services/families.service.js';
import { FamiliesController } from './controllers/families.controller.js';
import { FamilyInvitesService } from './services/family-invites.service.js';
import { FamilyInvitesController } from './controllers/family-invite.controller.js';

@Module({
  controllers: [FamiliesController, FamilyInvitesController],
  providers: [FamiliesService, FamilyInvitesService],
})
export class FamiliesModule {}
