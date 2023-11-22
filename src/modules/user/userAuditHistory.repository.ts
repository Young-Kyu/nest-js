import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { UserAuditHistoryRequestDTO } from "./dto/user.dto";
import { UserAuditHistoryEntity } from "../../entities/user/userAuditHistory.entity";
import { InsertLogDTO } from "./model/user.model";


@Injectable()
export class UserAuditHistoryRepository extends Repository<UserAuditHistoryEntity> {

  constructor(dataSource: DataSource) {
    super(UserAuditHistoryEntity, dataSource.createEntityManager());
  };

  async insertLog(request: InsertLogDTO) {
    const log = this.create({
      userId: request.userId,
      comment: request.comment
    })

    await this.save(log);
    return log
  }

  async getAuditLogs(request: UserAuditHistoryRequestDTO & { id: number }) {

    const { id, page = 1, size: take = 10 } = request;

    const [history, total] = await this.findAndCount({
      take,
      skip: (page - 1) * take,
      where: {
        userId: id
      }
    })

    return {
      data: history,
      paging: {
        total,
        page,
        lastPage: Math.ceil(total / take)
      }
    }
  }

}
