import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => this.serializeBigInt(data)));
  }

  private serializeBigInt(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'bigint') {
      return data.toString();
    }

    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.serializeBigInt(item));
    }

    if (typeof data === 'object') {
      const serialized: Record<string, unknown> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          serialized[key] = this.serializeBigInt(
            (data as Record<string, unknown>)[key],
          );
        }
      }
      return serialized;
    }

    return data;
  }
}
