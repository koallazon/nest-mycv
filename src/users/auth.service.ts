import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

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
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Has the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // 사용자 객체를 생성하고 등록하자
    const user = await this.usersService.create(email, result);

    // 유저 정보 반환
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('아이디가 존재하지 않습니다.');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
