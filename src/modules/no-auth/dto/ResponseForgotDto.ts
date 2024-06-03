import { ApiProperty } from '@nestjs/swagger';

export class ResponseForgotDto {
  @ApiProperty()
  message: string;
}
