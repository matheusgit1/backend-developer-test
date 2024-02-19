import { PoolClient, QueryResult } from "pg";
export type FinallyStrategy = "COMMIT" | "ROLLBACK" | "END";

/**
 * @description Modulo base para demais modulos
 * * IMPORTANTE: sempre que um novo modulo for criado, instacie seu contrutor, isso irá facilitar a depuração de erros
 */
export declare class BaseModuleRepository {
  /**
   * @property {PoolClient} connection conexão de base instanciada
   */
  public connection: PoolClient;

  constructor(...args: any[]);

  /**
   * abstração para execução de queries na base
   * @param {string} query query sql
   * @param {any[]} params parametros da query sql
   */
  executeQuery(query: string, params?: any[]): Promise<QueryResult<any>>;
}
