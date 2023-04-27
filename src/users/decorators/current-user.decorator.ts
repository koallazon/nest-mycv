import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('request.session.userId', request.session.userId);
    // context객체에 접근해서 데이터는 얻을 수 있겠지만
    // ParamDecorator에서는 다른 서비스에 접근할 수 없다.
    // 하지만 인터셉터를 이용하면 해결이 가능하다.
    return request.CurrentUser;
  },
);
