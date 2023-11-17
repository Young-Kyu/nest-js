import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRepository } from "src/db/auth/auth.repository";
import { UserRepository } from "src/db/user/user.repository";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { USER_AUTH_LEVEL } from "./model/user.model";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) { }

  getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.getAllUser();
  };

  getUserByEmail(emailAddress: string): Promise<UserEntity> {
    return this.userRepository.getUserByEmail(emailAddress);
  };

  async createUser(user: CreateUserDto) {

    const hasUser = await this.getUserByEmail(user.emailAddress);
    if (hasUser) {
      throw new BadRequestException('이미 존재하는 유저입니다.');
    }

    const level = await this.authRepository.getLevelInfo(user.userLevel);
    console.log(level);
    return null;
    // return this.userRepository.createUser(user);
  }

  async updateUser(request: UpdateUserDto) {
    const {emailAddress,level} = request;
    let user = await this.getUserByEmail(emailAddress);
    if(!user){
      throw new NotFoundException(`${emailAddress} was not founded`);
    }
    user.userLevel = levelUtil(level);
    await this.userRepository.save(user);
    return user;
  }

}

function levelUtil(level: USER_AUTH_LEVEL): number {
  switch (level) {
    case USER_AUTH_LEVEL.MASTER:
      return 1;
    case USER_AUTH_LEVEL.ADMIN:
      return 2;
    case USER_AUTH_LEVEL.MEMBER:
      return 3;
  }
}