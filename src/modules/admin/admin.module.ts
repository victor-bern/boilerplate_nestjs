import { Module } from '@nestjs/common';

import { SettingsAdminController } from './settings-admin/settings-admin.controller';
import { SettingsAdminService } from './settings-admin/settings-admin.service';
import { PrismaService } from '@database/PrismaService';

@Module({
  controllers: [SettingsAdminController],
  providers: [SettingsAdminService, PrismaService],
})
export class AdminModule {}
