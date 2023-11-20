import { Injectable, NotFoundException } from "@nestjs/common";
import { UserAuditHistoryEntity } from "src/modules/user/userAuditHistory.entity";
import { Repository, DataSource } from "typeorm";


@Injectable()
export class UserAuditHistoryRepository extends Repository<UserAuditHistoryEntity> {

  constructor(dataSource: DataSource) {
    super(UserAuditHistoryEntity, dataSource.createEntityManager());
  };

  async insertLog(request : InsertLogDTO){
    const aa = this.create({
      userId : request.userId,
      comment : request.comment
    })

    await this.save(aa);
    return aa
  }

}


export class InsertLogDTO { 
  userId : number;
  comment : string;
}