import { ApiProperty } from '@nestjs/swagger';

export class ResponseResetDto {
  @ApiProperty()
  message: string;
}
