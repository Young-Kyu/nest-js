import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  userPk : number;

  @Column({name : 'user_level'})
  userLevel : number;

  @Column({name : 'email_address'})
  emailAddress : string;
}