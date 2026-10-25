import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Role } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { SessionId } from './decorators/session-id.decorator';
import { RolesGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    const { sessionId, user } = await this.authService.register(createUserDto);
    this.setSessionCookie(response, sessionId);
    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register-admin')
  async registerAdmin(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    const { sessionId, user } = await this.authService.register(
      createUserDto,
      Role.ADMIN,
    );
    this.setSessionCookie(response, sessionId);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    const { sessionId, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    this.setSessionCookie(response, sessionId);
    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @CurrentUser('uuid') uuid: string,
    @SessionId() sessionId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(sessionId, uuid);
    this.clearSessionCookie(response);

    return { message: 'Successfully logged out' };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  async logoutFromAllDevices(
    @CurrentUser('uuid') uuid: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logoutFromAllDevices(uuid);
    this.clearSessionCookie(response);

    return { message: 'Successfully logged out from all devices' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@CurrentUser('uuid') uuid: string): Promise<UserEntity> {
    return this.authService.getMe(uuid);
  }

  private setSessionCookie(response: Response, sessionId: string): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  private clearSessionCookie(response: Response): void {
    response.clearCookie('sessionId', {
      httpOnly: true,
      sameSite: 'lax',
    });
  }
}
