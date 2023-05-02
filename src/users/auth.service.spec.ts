import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthServiec', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // user service를 가짜로 복사해서 생성하자.
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('인증 서비스 인스턴스를 만들자', async () => {
    expect(service).toBeDefined();
  });

  it('암호화된 비밀번호되 새로운 사용자를 등록하자', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(
      service.signup('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('사용할 수 없는 이메일로 로그인을 했을 때 에러를 처리해야한다.', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('유효한 비밀번호가 아니라면 에러가 나야한다.', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
    await expect(
      service.signin('lkjklsdfj@nasdf.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('비밀번호가 정확하면 사용자 정보를 반환해야한다.', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined;
  });
});
