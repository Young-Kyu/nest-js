import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto, UserProfileResponseDTO } from "../../modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "../../modules/user/model/user.model";
import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../entities/user/user.entity";


@Injectable()
export class UserRepository extends Repository<UserEntity> {

  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  };

  async getAllUser(): Promise<UserEntity[]> {
    return await this.find();
  }

  async getUserCount() {
    return await this.count();
  }

  async getUserByUserId(userId: string): Promise<UserEntity> {
    return await this.findOne({ where: { userId } })
  }

  async getUserByEmail(emailAddress: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: { emailAddress },
      relations: ['auth']
    })
    return user;
  }

  updateLastLoginDate(user: UserEntity): void {
    user.updateLastLoginDate();
  }

  async getUserWithAuth(userId: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: { userId: userId },
      relations: ['auth'],
    })
    return user;
  }

  async createUser(user: CreateUserDto) {
    const { level, emailAddress, userId } = user;
    const addUser = this.create({
      userLevel: level,
      emailAddress: emailAddress,
      userId: userId
    });
    await this.save(addUser)

    return addUser;
  }

  async updateUser(id: number, updateAuth: number) {
    await this.update(
      { id },
      { userLevel: updateAuth }
    )
  }
}