import { ApiProperty } from '@nestjs/swagger';

export class ResponseVerifyCodeDto {
  @ApiProperty()
  message: string;
}
