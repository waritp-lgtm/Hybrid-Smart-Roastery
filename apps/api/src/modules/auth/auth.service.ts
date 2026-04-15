import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LineAuthDto } from './dto/line-auth.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // ─── JWT ────────────────────────────────────────────────────────────────────

  generateToken(userId: string, role: string) {
    return this.jwtService.sign({ sub: userId, role });
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ─── LINE Login ──────────────────────────────────────────────────────────────

  async loginWithLine(dto: LineAuthDto) {
    // Verify LINE access token with LINE API
    const lineProfile = await this.verifyLineToken(dto.accessToken);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { lineUserId: lineProfile.userId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          lineUserId: lineProfile.userId,
          name: lineProfile.displayName,
          lineProfile: {
            pictureUrl: lineProfile.pictureUrl,
            statusMessage: lineProfile.statusMessage,
          },
        },
      });
    } else {
      // Update profile on each login
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: lineProfile.displayName,
          lineProfile: {
            pictureUrl: lineProfile.pictureUrl,
            statusMessage: lineProfile.statusMessage,
          },
        },
      });
    }

    const token = this.generateToken(user.id, user.role);
    return { token, user };
  }

  private async verifyLineToken(accessToken: string) {
    try {
      const { data } = await axios.get('https://api.line.me/v2/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch {
      throw new UnauthorizedException('Invalid LINE access token');
    }
  }

  // ─── Staff Login (Email + Password) ─────────────────────────────────────────

  async loginWithPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user['passwordHash']) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user['passwordHash']);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);
    return { token, user };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tier: true,
        lineProfile: true,
        createdAt: true,
      },
    });
  }
}
