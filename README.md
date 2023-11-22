
## 환경 구성
  1. 프레임워크: Nest.js
  2. 언어: TypeScript
  3. DB: mariaDB - TypeORM
  4. 테스트: jest

## 실행 순서

  1. npm install
  2. npm run start(:dev / :prod) # 각 실행 환경별로 cli 별도

## 프로젝트 구성

/src
  + config: Guard, ORMconfig 관련 폴더
  + constants: Error Message등 enum 관련 폴더
  + entities: Entity 관련 폴더
  + filters: 최종 Error formatting을 위한 filter 관련 폴더
  + interceptors: interceptor 관련 폴더
  + modules: 각 서비스별 controller, service, repository파일 폴더
  + pipes: pipe 관련 폴더
  + strategies: JWT 인증 / 인가 관련 폴더

## 주요 기능 개발

  1. 서버사이드 구글 로그인 연동

  2. JWT Token 생성 및 Token 기반 private / public API 분리

  3. success / error response format 통일화
    + ex. {SuccessOrNot : Y | N, data: {}, statusCode: ''}
  
  4. TypeORM 기반 DB 핸들링
    + 기본 CRUD 기능 및 transaction 처리

  5. 테스트 코드 작성

  6. 권한 관련 CRUD 기능 개발 및 에러케이스 처리
    + Audit Log 포함
    + 권한 수정 시 request User가 update 대상 User보다 권한이 높지 않으면 에러 처리
  
  7. 실행 환경 별 환경변수 분기처리

## 중점적으로 개발 진행한 사항
  - useGuard, Public API, ValidationPipe, 각 interceptor 등 비지니스 로직이 실행되기 전
    거쳐야 할 인증정보등을 중점으로 개발했습니다.
  
  - TypeORM에서 queryBuilder를 사용하지 않고 순수 제공 기능으로 구현을 진행했습니다.
