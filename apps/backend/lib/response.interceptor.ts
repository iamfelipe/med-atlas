import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from './response-message.decorator';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      'Success';

    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        data,
        message,
        statusCode,
      })),
    );
  }
}
