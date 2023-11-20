import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/modules/user/user.repository";
import { CreateUserDto, UserAuthUpdateRequestDTO, UserListRequestDTO, UserProfileResponseDTO } from "./dto/user.dto";
import { UserEntity } from "../../entities/user/user.entity";
import { AuthRepository } from "src/modules/auth/auth.repository";
import { Like, Connection, DataSource } from "typeorm";
import { InsertLogDTO, UserAuditHistoryRepository } from "src/modules/user/userAuditHistory.repository";
import { UserAuditHistoryEntity } from "../../entities/user/userAuditHistory.entity";
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

    try {
      const userAuditLogDTO = new UserAuditHistoryEntity();
      userAuditLogDTO.comment = 'test';
      userAuditLogDTO.userId = updateTargetUser.id;
      await queryRunner.manager.save(userAuditLogDTO);

      const updateUser = new UserEntity();
      updateUser.emailAddress = updateTargetUser.emailAddress;
      updateUser.userLevel = updateAuth.level

      await queryRunner.manager.update(UserEntity, { emailAddress: updateUser.emailAddress }, updateUser);
      await queryRunner.commitTransaction();

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('test');
    } finally {
      await queryRunner.release();
    }

    return true;
  }

}
