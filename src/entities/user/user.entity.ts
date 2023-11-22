import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @CreateDateColumn({ name: 'create_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  @Column({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @IsDate()
  @Column({ name: 'update_date' })
  updateDate: Date;

  @OneToOne(() => AuthEntity, auth => auth.level)
  @JoinColumn({ name: 'user_level' })
  auth: AuthEntity;

  @OneToMany(() => UserAuditHistoryEntity, history => history.user)
  @JoinColumn({ name: 'id' })
  history: UserAuditHistoryEntity[];

  @Column({ name: 'last_login_date', type: 'timestamp', default: null, nullable: true })
  @IsDate()
  lastLoginDate: Date | null;

  async updateLastLoginDate() {
    this.lastLoginDate = new Date();
    await this.save();
  }

}