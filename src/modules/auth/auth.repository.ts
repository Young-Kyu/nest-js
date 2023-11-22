import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "../../entities/auth/auth.entity";
import { Repository, DataSource } from "typeorm";
import { USER_AUTH_LEVEL } from "../user/model/user.model";

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {

  constructor(dataSource: DataSource) {
    super(AuthEntity, dataSource.createEntityManager());
  };

  async getLevelInfo(authName: USER_AUTH_LEVEL) {
    return await this.findOne({ where: { authName } });
  }


}