import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthEntity } from "../auth/auth.entity";
import { UserAuditHistoryEntity } from "./userAuditHistory.entity";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";


@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_level' })
  @IsNumber()
  userLevel: number;

  @Column({ name: 'email_address' })
  @IsEmail()
  emailAddress: string;

  @Column({ name: 'user_id' })
  @IsString()
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDate()
  @Column({ name: 'create_date' })
  createDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDate()
  @Column({ name: 'update_date' })
  updateDate: Date;

  @OneToOne(() => AuthEntity, auth => auth.level)
  @JoinColumn({ name: 'user_level' })
  auth: AuthEntity;

  @OneToMany(() => UserAuditHistoryEntity, history => history.user)
  @JoinColumn({ name: 'id' })
  history: UserAuditHistoryEntity[];
}