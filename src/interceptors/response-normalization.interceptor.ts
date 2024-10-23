import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseNormalizationInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(
      map(
        async (data) => {
          // Ele pode ser vazio `{}`. Nesse caso eu quero que ele tome um valor nulo.
          const responsePayload = await data || null;

          const success = responsePayload?.success ?? true;
          const message = responsePayload?.message || 'Operação realizada com sucesso.'

          delete responsePayload?.success
          delete responsePayload?.message

          return {
            success,
            message,
            data: responsePayload,
            errors: []
          }
        }
      )
    );
  }
}
