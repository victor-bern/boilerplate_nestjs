import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class ForgotDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
