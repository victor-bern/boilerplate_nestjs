import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from 'src/modules/admin/settings-admin/dto/permission-response.dto';

export class ResponseLoginDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;

  @ApiProperty({ type: [PermissionResponseDto] })
  adminPermissions: PermissionResponseDto[];
}
