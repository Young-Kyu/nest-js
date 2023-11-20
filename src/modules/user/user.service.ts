import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/db/user/user.repository";
import { CreateUserDto, UserAuthUpdateRequestDTO, UserListRequestDTO, UserProfileResponseDTO } from "./dto/user.dto";
import { UserEntity } from "./user.entity";
import { AuthRepository } from "src/db/auth/auth.repository";
import { Like, Connection, DataSource } from "typeorm";
import { InsertLogDTO, UserAuditHistoryRepository } from "src/db/user/userAuditHistory.repository";
import { UserAuditHistoryEntity } from "./userAuditHistory.entity";
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    @InjectRepository(UserAuditHistoryRepository)
    private userAuditHistoryRepository: UserAuditHistoryRepository,
    private dataSource: DataSource,
  ) { }

  getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.getAllUser();
  };

  async getUserList(request: UserListRequestDTO) {
    const { page = 1, search = '', size: take = 10 } = request;
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      where: {
        emailAddress: Like(`%${search}%`)
      }
    })
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

  async updateUserAuth(requestUser: UserEntity, targetUser: UserAuthUpdateRequestDTO) {

    const updateTargetUser = await this.getUserByEmail(targetUser.emailAddress);
    if (requestUser.id === updateTargetUser.id) {
      throw new BadRequestException('나 자신 불가능')
    }
    if (requestUser.auth.level > updateTargetUser.auth.level) {
      throw new BadRequestException('update 불가능')
    }
    const updateAuth = await this.authRepository.getLevelInfo(targetUser.updateAuth);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const aa = new UserAuditHistoryEntity();
      aa.comment = 'test';
      aa.userId = updateTargetUser.id;
      await queryRunner.manager.save(aa);

      const bb = new UserEntity();
      bb.emailAddress = updateTargetUser.emailAddress;
      bb.userLevel = updateAuth.level

      await queryRunner.manager.save(bb);
      // throw Error('afew')
      await queryRunner.commitTransaction();

    }catch(err){
      await queryRunner.rollbackTransaction()
    }finally{
      await queryRunner.release();
    }

    // await this.dataSource.transaction(async tm => {
      

      // const bb = tm.withRepository(this.userRepository);

      // const insertLog = new InsertLogDTO();
      // insertLog.userId = updateTargetUser.id;
      // insertLog.comment = 'test';

      // await aa.insertLog(insertLog)

      // await bb.updateUser(updateTargetUser.id, updateAuth.level);
    // })



    // const queryRunner = this.dataSource.createQueryRunner();

    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   const insertLog = new InsertLogDTO();
    //   insertLog.userId = updateTargetUser.id;
    //   insertLog.comment = 'test';

    //   await queryRunner.manager.getRepository(UserAuditHistoryRepository).save(insertLog);
    //   throw Error('error')
    //   await this.userRepository.updateUser(updateTargetUser.id, updateAuth.level)

    // } catch (err) {
    //   console.log('롤백');
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }


    // return this.userRepository.updateUser(updateTargetUser.id, updateAuth.level)
  }

}
