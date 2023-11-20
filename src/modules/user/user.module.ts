import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/user.repository';
import { UserController } from "./user.controller";
import { UserEntity } from '../../entities/user/user.entity';
import { UserService } from "./user.service";
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { AuthService } from '../auth/auth.service';
import { AuthEntity } from '../../entities/auth/auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as config from 'config';
import { UserAuditHistoryEntity } from '../../entities/user/userAuditHistory.entity';
import { UserAuditHistoryRepository } from 'src/modules/user/userAuditHistory.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserAuditHistoryEntity]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    AuthRepository,
    UserAuditHistoryRepository,
    JwtService
  ],
})
export class UserModule { }
// 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
