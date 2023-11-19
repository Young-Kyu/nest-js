import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthEntity } from "../auth/auth.entity";


@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_level' })
  userLevel: number;

  @Column({ name: 'email_address' })
  emailAddress: string;

  @OneToOne(() => AuthEntity, auth => auth.level, { eager: true })
  @JoinColumn({ name: 'user_level' })
  auth: AuthEntity;
}