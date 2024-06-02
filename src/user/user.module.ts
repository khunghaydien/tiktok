import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService,
    UserResolver,
    JwtService,
    ConfigService,
    PrismaService,
    AuthService]
})
export class UserModule { }
