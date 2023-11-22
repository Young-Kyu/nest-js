import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as config from 'config';

const dbConfig = config.get('db');

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
  /* 
  entity를 통해 오버라이드 되며 테이블이 생성됨
  개발 버전에서는 스키마의 용이한 수정을 위해 true로 사용하지만
  배포 버전에서는 꼭! false여야 한다.

  entity를 누군가 수정하면 테이블이 바뀌기 때문
 */
  logging: config.get('db').logging,
  namingStrategy: new SnakeNamingStrategy(),
}
