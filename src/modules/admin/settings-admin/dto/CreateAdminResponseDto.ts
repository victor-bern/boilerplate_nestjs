import { ApiProperty } from '@nestjs/swagger';
import { CreateAdminAloneDto } from './CreateAdminAloneDto';

export class CreateAdminResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  admin: CreateAdminAloneDto;
}
