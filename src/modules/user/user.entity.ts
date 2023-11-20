import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthEntity } from "../auth/auth.entity";
import { UserAuditHistoryEntity } from "./userAuditHistory.entity";


@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({name : 'id'})
  id: number;

  @Column({ name: 'user_level' })
  userLevel: number;

  @Column({ name: 'email_address' })
  emailAddress: string;

  @OneToOne(() => AuthEntity, auth => auth.level)
  @JoinColumn({ name: 'user_level'})
  auth: AuthEntity;


  @OneToMany(() => UserAuditHistoryEntity, history => history.user)
  @JoinColumn({ name: 'id'})
  history : UserAuditHistoryEntity[];
}