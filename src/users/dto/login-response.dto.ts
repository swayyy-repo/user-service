import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  authToken: string;
}
