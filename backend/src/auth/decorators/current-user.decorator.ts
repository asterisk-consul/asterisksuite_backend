import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@/auth/types/auth-user.interface';
import { RequestWithUser } from '@/auth/types/request-with-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
