import { Test, TestingModule, } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserAuditHistoryRepository } from '../../modules/user/userAuditHistory.repository';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user/user.entity';
import { AuthRepository } from '../auth/auth.repository';
import { UserRepository } from './user.repository';
import { AuthEntity } from 'src/entities/auth/auth.entity';
import { UserAuditHistoryEntity } from 'src/entities/user/userAuditHistory.entity';
import { USER_AUTH_LEVEL } from './model/user.model';


const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockUser = {
  id: 1,
  userLevel: 1,
  emailAddress: 'test@test.com',
  userId: 'testUserId',
  createDate: new Date(),
  updateDate: new Date(),
  lastLoginDate: null,
} as UserEntity;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: {
            getUserList: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserByUserId: jest.fn(),
            getUserCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthRepository),
          useValue: mockUserRepository(),
        },
        {
          provide: getRepositoryToken(UserAuditHistoryRepository),
          useValue: mockUserRepository(),
        },
        {
          provide: DataSource,
          useValue: mockUserRepository(),
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('유저 email에 대해 userEntity를 반환 - Success', async () => {
      const mockSpy = () => jest.spyOn(service['userRepository'], 'getUserByEmail');
      mockSpy().mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@test.com');

      expect(mockSpy()).toHaveBeenCalledTimes(1);
      expect(mockSpy()).toHaveBeenCalledWith('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByUserId', () => {
    it('요청받은 유저 ID로 userEntity를 반환', async () => {
      const mockSpy = () => jest.spyOn(service['userRepository'], 'getUserByUserId');
      mockSpy().mockResolvedValue(mockUser);

      const result = await service.getUserByUserId('testUserId');

      expect(mockSpy()).toHaveBeenCalledTimes(1);
      expect(mockSpy()).toHaveBeenCalledWith('testUserId');
      expect(result).toEqual(mockUser);
    });
  });

});