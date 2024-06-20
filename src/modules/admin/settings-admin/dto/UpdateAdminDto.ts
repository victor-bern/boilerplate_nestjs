import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminPermission, Status, AdminPermissions } from '@prisma/client';

export class UpdateAdminDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(191)
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(18)
  @IsOptional()
  document?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(191)
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(191)
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: Status, required: false })
  @IsEnum(Status)
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(8)
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ enum: AdminPermissions, type: [AdminPermissions] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEnum(AdminPermissions, { each: true })
  @IsOptional()
  adminPermissions?: AdminPermission[];

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1500)
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1500)
  @IsOptional()
  fileKey?: string;
}
