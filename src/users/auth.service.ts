import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 사용가능한 이메일인지 확인
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // 사용자 비밀번호 암호화(hash)

    // 사용자 객체를 생성하고 등록하자.
    // 유저 정보 반환
  }

  signin() {}
}
