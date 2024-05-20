import { Module } from '@nestjs/common';
import { SettingsAdminService } from './settings-admin.service';
import { SettingsAdminController } from './settings-admin.controller';
import { PrismaService } from '@database/PrismaService';

@Module({
  controllers: [SettingsAdminController],
  providers: [SettingsAdminService, PrismaService],
})
export class SettingsAdminModule {}
