import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from 'src/modules/admin/settings-admin/dto/PermissionResponseDto';

export class ResponseLoginDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[];
}
