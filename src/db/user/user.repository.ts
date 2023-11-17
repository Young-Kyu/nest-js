import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "src/modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";
import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../modules/user/user.entity";

@Injectable()
export class UserRepository extends Repository<UserEntity> {

  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  };

  async getAllUser(): Promise<UserEntity[]> {
    const user = await this.find();
    return user;
  }

  async getUserByEmail(emailAddress: string): Promise<UserEntity> {
    const user = await this.findOne({ where: { emailAddress } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async createUser(user: CreateUserDto) {
    const addUser = this.create({
      userLevel: user.userLevel === USER_AUTH_LEVEL.ADMIN ? 2 : user.userLevel === USER_AUTH_LEVEL.MASTER ? 1 : 3, // 이건 나중에 level table 데이터 불러와서 사용할 것
      emailAddress: user.emailAddress,
    });
    await this.save(addUser)

    return addUser;
  }

}