import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { USER_AUTH_LEVEL } from "../user/model/user.model";
import { UserEntity } from "../user/user.entity";


@Entity('auth')
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auth_name' })
  authName: USER_AUTH_LEVEL;

  @Column({ name: 'level' })
  level: number;

  @OneToOne(() => UserEntity, auth => auth.auth)
  @JoinColumn({ name: 'id'})
  authInfo : UserEntity;
}