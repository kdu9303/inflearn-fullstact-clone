import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

type AuthenticatedRequest = Request & {
  sub: string;
  email?: string;
  name?: string;
  picture?: null;
  iat?: number;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // AccessTokenGuard test
  @Get('user-test')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  testUser(@Req() req: AuthenticatedRequest) {
    console.log(req.user);
    return `유저 이메일: ${req.user?.email}`;
  }
}
