import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, UserAuditHistoryRequestDTO, UserAuthUpdateRequestDTO, UserListRequestDTO, UserProfileResponseDTO } from "./dto/user.dto";
import { UserEntity } from "../../entities/user/user.entity";
import { Like, DataSource } from "typeorm";
import { AuthRepository } from "../auth/auth.repository";
import { UserRepository } from "./user.repository";
import { UserAuditHistoryRepository } from "./userAuditHistory.repository";
import { UserAuditHistoryEntity } from "src/entities/user/userAuditHistory.entity";
import { ERROR_MESSAGE } from "src/constants/error";
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
      },
      relations: ['auth']
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

  async getUserAuditHistory(request: UserAuditHistoryRequestDTO) {
    const user = await this.userRepository.getUserByUserId(request.userId);
    return this.userAuditHistoryRepository.getAuditLogs({ ...request, id: user.id })
  }

  getUserCount(): Promise<number> {
    return this.userRepository.count();
  }

  getUserByEmail(emailAddress: string): Promise<UserEntity> {
    return this.userRepository.getUserByEmail(emailAddress);
  };

  getUserByUserId(userId: string): Promise<UserEntity> {
    return this.userRepository.getUserByUserId(userId);
  }

  getUserByUserIdWithAuth(userId: string): Promise<UserEntity> {
    return this.userRepository.getUserWithAuth(userId);
  }

  updateUserLoginDate(user: UserEntity): void {
    this.userRepository.updateLastLoginDate(user);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {

    const hasUser = await this.getUserByUserId(user.userId);
    if (hasUser) {
      throw new BadRequestException(ERROR_MESSAGE.IS_EXIST_USER);
    }
    return this.userRepository.createUser(user);
  }

  async updateUserAuth(requestUser: UserEntity, targetUser: UserAuthUpdateRequestDTO) {

    const updateTargetUser = await this.getUserByEmail(targetUser.emailAddress);
    if (requestUser.id === updateTargetUser.id) {
      throw new BadRequestException(ERROR_MESSAGE.NO_AUTHRIZED_ERROR)
    }
    if (requestUser.auth.level > updateTargetUser.auth.level) {
      throw new BadRequestException(ERROR_MESSAGE.NO_AUTHRIZED_ERROR)
    }
    const updateAuth = await this.authRepository.getLevelInfo(targetUser.updateAuth);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userAuditLogDTO = new UserAuditHistoryEntity();
      userAuditLogDTO.comment = targetUser.comment;
      userAuditLogDTO.userId = updateTargetUser.id;
      await queryRunner.manager.save(userAuditLogDTO);

      const updateUser = new UserEntity();
      updateUser.emailAddress = updateTargetUser.emailAddress;
      updateUser.userLevel = updateAuth.level

      await queryRunner.manager.update(UserEntity, { emailAddress: updateUser.emailAddress }, updateUser);
      await queryRunner.commitTransaction();

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(ERROR_MESSAGE.TRANSACTION_FAILURE);
    } finally {
      await queryRunner.release();
    }

    return true;
  }

}
