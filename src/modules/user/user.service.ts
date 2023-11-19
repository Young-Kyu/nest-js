import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/db/user/user.repository";
import { CreateUserDto, UpdateUserDto, UserProfileResponseDTO } from "./dto/user.dto";
import { USER_AUTH_LEVEL } from "./model/user.model";
import { UserEntity } from "./user.entity";
import { AuthRepository } from "src/db/auth/auth.repository";
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.getAllUser();
  };

  async getUserList(page: number = 1, take: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take
    });
    return {
      data: users,
      paging: {
        total,
        page,
        lastPage: Math.ceil(total / take)
      }
    }
  }

  getUserCount() {
    return this.userRepository.count();
  }

  getUserByEmail(emailAddress: string): Promise<UserEntity> {
    return this.userRepository.getUserByEmail(emailAddress);
  };

  async createUser(user: CreateUserDto): Promise<UserEntity> {

    const hasUser = await this.getUserByEmail(user.emailAddress);
    if (hasUser) {
      throw new BadRequestException('이미 존재하는 유저입니다.');
    }

    return this.userRepository.createUser(user);
  }

}
