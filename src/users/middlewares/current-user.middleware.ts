import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddelware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    console.log(
      '🚀 ~ file: current-user.middleware.ts:11 ~ CurrentUserMiddelware ~ use ~ userId:',
      userId,
    );
    if (userId) {
      const user = await this.usersService.findOne(userId);
      console.log(
        '🚀 ~ file: current-user.middleware.ts:17 ~ CurrentUserMiddelware ~ use ~ user:',
        user,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.CurrentUser = user;
    }
    next();
  }
}
