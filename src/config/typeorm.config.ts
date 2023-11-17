import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
/* 
  nest config로 process env 변경할 것
*/
export const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rkddudrb301',
  database: 'NEST',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
  /* 
  entity를 통해 오버라이드 되며 테이블이 생성됨
  개발 버전에서는 스키마의 용이한 수정을 위해 true로 사용하지만
  배포 버전에서는 꼭! false여야 한다.

  entity를 누군가 수정하면 테이블이 바뀌기 때문
 */
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
}