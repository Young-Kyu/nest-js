import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto, UserProfileResponseDTO } from "src/modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";
import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../modules/user/user.entity";


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

  async getUserByEmail(emailAddress: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: { emailAddress },
      relations: ['auth']
    })
    return user;
  }

  /* 
  async getUserByEmail(emailAddress: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: { emailAddress },
      relations: ['auth','history']
    })
    console.log('=========================================================');
    console.log(user);
    console.log('=========================================================');
    return user;
  }
  */

  async createUser(user: CreateUserDto) {
    const addUser = this.create({
      userLevel: user.level,
      emailAddress: user.emailAddress,
    });
    await this.save(addUser)

    return addUser;
  }

  async updateUser(id : number,updateAuth: number){
    await this.update(
      {id},
      {userLevel : updateAuth}
    )
  }

}