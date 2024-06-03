import { ApiProperty } from '@nestjs/swagger';

export class ResponseContactUsDto {
  @ApiProperty()
  message: string;
}
