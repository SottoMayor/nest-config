import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { CryptographyService } from 'src/cryptography/cryptography.service';

@Injectable()
export class CryptographyInterceptor implements NestInterceptor {
  constructor(private readonly cryptoService: CryptographyService, private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    const decryptHeader = this.configService.get<string>('DECRYPT_HEADER')
    const decryptHeaderValue = this.configService.get<string>('DECRYPT_HEADER_VALUE')
    const headerValue = request.header(decryptHeader)

    const referer = request.headers.referer;
    const host = request.headers.host;
    const refererWithoutProtocol = referer?.replace(/^https?:\/\//, '');
    const path = refererWithoutProtocol?.replace(host, '');
    const isSwaggerPath = path === '/api';

    // Paths de white list - desabilite a criptografia para determinados paths
    // 1. URL completa
    const originalUrl = request.originalUrl
    // 2. Verifique se nesta URL tem o path em que a criptografia deve ser desativada:
    const isCallbackUrl = originalUrl.includes('callback')

    // Condições para descriptografar o body...
    // -> Se o Header de criptografia for passado na request e não bater
    const withoutOrInvalidDecryptHeaderValue = (
      !headerValue 
        ||
      (
        headerValue && 
        headerValue !== decryptHeaderValue 
      )
    )
    // -> Se o método é qualquer outro que não seja GET e tenha o body não-vazio
    const nonGetWithBody = (
      request.method != 'GET' &&
      Object.keys(request.body).length !== 0
    )
    // -> Se a request não for do swagger
    const isNotSwaggerRequest = !isSwaggerPath
    // -> Se a request não for de uma URL que está na white list
    const isNotCallbackUrl = !isCallbackUrl

    if (
      withoutOrInvalidDecryptHeaderValue
        && // E
      nonGetWithBody
        && // E
      isNotSwaggerRequest
        && // E
      isNotCallbackUrl
    ) {
      const decryptString = JSON.parse(this.cryptoService.decrypt(request.body.data));
      const decryptObject = JSON.parse(decryptString)
      request.body = decryptObject;
    }

    return next.handle().pipe(
      map(async (data) => {
        const response = await data;

        // Critérios para devolver a resposta sem criptografia.
        if(headerValue === decryptHeaderValue || isSwaggerPath || isCallbackUrl){
          return response;
        }
        const digested = this.cryptoService.encrypt(response);
        return { data: digested }
      }),
    );
  }
}