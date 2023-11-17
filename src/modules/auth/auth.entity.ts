import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('auth')
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  levelId : number;

  @Column({name : 'level_name'})
  levelName : string;

}