import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { requestContext } from '../context/request-context';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const currentStore = requestContext.getStore() || {};

    return requestContext.run(
      {
        ...currentStore,
        userId: req.user?.id,
        ip: req.ip,
      },
      () => next.handle(),
    );
  }
}
