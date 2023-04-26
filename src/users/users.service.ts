import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    // 유효성 감사를 하기 위해 entity 인스턴스를 생성해서 저장한다.

    /* 
      entity 인스턴스를 만들지 않고 아래 처럼 객체로 보내도 문제는 없지만 
      user.entity.ts파일에서 insert, update, remove 시 작동하는 Hook에서 감지를 하지 못한다.
      entity 개체로 만들면 모든 Hook을 거쳐서 진행된다.
      return this.repo.save({ email, password }); 
    */

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    /** typeorm에서 데이터를 삭제하는 함수는 2개가 있다.
     * remove: Entity를 인수로 받고 remove Hook에 감지가 된다.
     * delete: id를 인수로 받고 hook에서 감지가 안된다.
     */
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('user not found');
    }
    return this.repo.remove(user);
  }
}
