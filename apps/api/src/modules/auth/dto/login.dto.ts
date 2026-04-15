import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@eightcoffee.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secure_password' })
  @IsString()
  @MinLength(8)
  password: string;
}
