import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LineAuthDto {
  @ApiProperty({ description: 'LINE Access Token จาก LIFF หรือ LINE Login' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
