import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "src/entities/auth/auth.entity";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {

  constructor(dataSource: DataSource) {
    super(AuthEntity, dataSource.createEntityManager());
  };

  async getLevelInfo(authName: USER_AUTH_LEVEL) {
    return await this.findOne({ where: { authName } });
  }


}