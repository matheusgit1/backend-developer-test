import { NextFunction, Request } from "express";
export interface UsecaseArguments {
  req: Request;
  next: NextFunction;
}

/**
 * @description usecase base. Todos os usecases, sem execeção, devem extender essa referência, tanto para controle e padronização
 * quanto para que a aplicação dos testes unitário, de integração e de carga sejam possíveis.
 */
export declare class BaseUseCase {
  constructor(...args: any[]);

  /**
   * @description
   * todos os usecases implementa a função handler, e por padrão,
   * todos terão acesso aos dados de requisição e função next (para middlewares)
   * @param  {{req: Request; next: NextFunction;}} args argumentos da função handler
   * @returns {Promise<HttpResponse>}
   */
  handler: (...args: any[]) => any;
}
