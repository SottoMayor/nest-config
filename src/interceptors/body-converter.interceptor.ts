import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { snakeCase, camelCase } from 'lodash'

@Injectable()
export class BodyConverterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Trocando de Snake(payload) para Camel(app)
    req.body = this.transformToCamelCase(req.body)

    return next.handle().pipe(
      map(
        async (data) => {
          const response = await data
          const parsedReponse = this.transformToSnakeCase(response)
          return parsedReponse
        }
      )
    );
  }

  private transformToSnakeCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformToSnakeCase(item));
    } else if (typeof data === 'object' && data !== null) {
      const transformedData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const snakeCasedKey = snakeCase(key);
          const value = data[key];
          transformedData[snakeCasedKey] = this.transformToSnakeCase(value);
        }
      }
      return transformedData;
    }
    return data;
  }

  private transformToCamelCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformToCamelCase(item));
    } else if (typeof data === 'object' && data !== null) {
      const transformedData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const snakeCasedKey = camelCase(key);
          const value = data[key];
          transformedData[snakeCasedKey] = this.transformToCamelCase(value);
        }
      }
      return transformedData;
    }
    return data;
  }
}
