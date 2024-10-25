import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ErrorHandlerFilter implements ExceptionFilter {
  constructor(){}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus()
    const errorResponse = exception['response']?.message;

    // Log do erro.
    console.log('ERRO =>', JSON.stringify(exception))

    let errorMessage = errorResponse || exception.message || 'Erro interno do servidor.'
    const errors = [];
    if(typeof errorResponse != 'string'){
      // Se for um erro de validação, errorResponse é um array
      errorMessage = 'Erro de validação.'
      errorResponse.map((err: any) => errors.push(err))
    }

    response.status(status).json({
      success: false,
      message: errorMessage,
      data: null,
      errors
    });
  }
}
