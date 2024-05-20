import { ApiProperty } from '@nestjs/swagger';
import { CreateAdminAloneDto } from './CreateAdminAloneDto';

export class ResponseFindAllAdminDto {
  @ApiProperty({ type: [CreateAdminAloneDto] })
  admins: CreateAdminAloneDto[];

  @ApiProperty()
  pages: number;

  @ApiProperty()
  count: number;
}
