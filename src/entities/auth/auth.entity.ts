import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { USER_AUTH_LEVEL } from "src/constants/auth";


@Entity('auth')
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auth_name' })
  authName: USER_AUTH_LEVEL;

  @Column({ name: 'level' })
  level: number;

  @OneToOne(() => UserEntity, auth => auth.auth)
  @JoinColumn({ name: 'id' })
  authInfo: UserEntity;
}