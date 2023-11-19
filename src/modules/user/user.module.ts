import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/db/user/user.repository';
import { UserController } from "./user.controller";
import { UserEntity } from './user.entity';
import { UserService } from "./user.service";
import { AuthRepository } from 'src/db/auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
  ],
})
export class UserModule { }
