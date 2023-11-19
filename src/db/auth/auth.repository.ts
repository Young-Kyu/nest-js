import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "src/modules/auth/auth.entity";
import { CreateUserDto } from "src/modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";
import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../modules/user/user.entity";

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {

  constructor(dataSource: DataSource) {
    super(AuthEntity, dataSource.createEntityManager());
  };

  async getLevelInfo(authName: USER_AUTH_LEVEL) {
    return await this.findOne({ where: { authName } });
  }


}