import { IsDate, IsNumber, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_audit_history')
export class UserAuditHistoryEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @IsString()
  @Column({ name: 'comment', nullable: false })
  comment: string;

  @IsDate()
  @CreateDateColumn({ type: 'timestamp' })
  @Column({ name: 'create_date' })
  createDate: Date;

  @ManyToOne(() => UserEntity, user => user.history)
  user: UserEntity;

}