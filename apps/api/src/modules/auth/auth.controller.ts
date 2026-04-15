import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LineAuthDto } from './dto/line-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('line')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with LINE (LIFF / LINE OA)' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user profile' })
  async lineLogin(@Body() dto: LineAuthDto) {
    return this.authService.loginWithLine(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Staff login with email + password' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user profile' })
  async login(@Body() dto: LoginDto) {
    return this.authService.loginWithPassword(dto.email, dto.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
