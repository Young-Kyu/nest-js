import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { AuthController } from './auth.controller';
import { AuthEntity } from '../../entities/auth/auth.entity';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../../entities/user/user.entity';
import { UserRepository } from '../../modules/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { UserAuditHistoryRepository } from '../../modules/user/userAuditHistory.repository';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.get('jwt').secret,
      signOptions: { expiresIn: config.get('jwt').expiresIn },
    }),
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    AuthRepository,
    UserRepository,
    UserAuditHistoryRepository,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule { }