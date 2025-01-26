import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { errorCodesPostgres } from '../utils/error-codes-postgres';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

type mappedError = {
  title: string;
  situation: string;
  connectionError: boolean;
};

@Catch(QueryFailedError, TypeORMError)
export class DatabaseErrorHandlerFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Falha em uma query do tipo `findOrFail`.
    if(exception instanceof EntityNotFoundError){
      // Log do erro.
      console.log(`ERRO 'findOrFail' =>`, JSON.stringify(exception))

      // Mandar a resposta
      return response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Registro não encontrado. Tente novamente.',
        data: null,
        errors: []
      });
    }

    // Falha em algo relacionado ao DB

    // Log do erro.
    console.log(`ERRO do DB ${errorCodesPostgres.db} =>`, JSON.stringify(exception))

    // Extração do error code
    const errorCode: undefined | string = exception['code'];

    // Busca do erro específico dentre os erros catalogados
    const error: undefined | mappedError = errorCodesPostgres.errors[errorCode];

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Erro interno do servidor. Tente mais tarde.';

    // o error existe. Logo, o errorCode mapeia a um erro catalogado
    if (error) {
      if (error.connectionError) {
        // Erro que não tem a ver com o usuário
        console.log('[ATENÇÃO] Erro de conexão com o DB! Erro =>', JSON.stringify(error))

        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Estamos passando por instabilidades no servidor, tente mais tarde ou acione um operador.'
      } else {
        // Erro que pode ou não ter a ver com o usuário
        console.log('[ATENÇÃO] Possivelmente erro de constraint do DB. Erro =>', JSON.stringify(error))

        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Ocorreu um erro. Por favor, verifique os dados fornecidos e tente novamente. ' + 
        'Se o erro persistir entre em contato com um operador.'
      }

    } else {
      // o error nao existe, basta descobrir o porquê.

      if (!errorCode) {
        // errorCode não veio na resposta da exceção
        console.log(
          '[ATENÇÃO] Não foi possível recuperar o código do erro da exceção e nem ver detalhes deste erro.'
        )

        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Erro interno do servidor. Tente mais tarde.'
      } else {
        // errorCode veio, mas o erro que deu não está catalogado
        console.log(
          '[ATENÇÃO] Erro não catalogado! Adicione este erro à lista.'
        )

        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Erro interno do servidor. Tente mais tarde.'
      }
    }

    // Mandar a resposta
    response.status(status).json({
      success: false,
      message: errorMessage,
      data: null,
      errors: []
    });
  }
}
