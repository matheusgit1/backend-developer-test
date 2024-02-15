import { PoolClient, QueryResult } from "pg";
export type FinallyStrategy = "COMMIT" | "ROLLBACK" | "END";

export declare class BaseModuleRepository {
  public connection: PoolClient;
  constructor(...args: any[]);

  /**
   * abstração para execuççao de queries na base
   */
  executeQuery(query: string, params?: any[]): Promise<QueryResult<any>>;

  /**
   * deve ser chamado antes de qualquer ação ser executada
   */
  init(): Promise<void>;

  /**
   * deve ser chamado qunado ações de inserções e updates forem executadas
   */
  beggin(): Promise<void>;

  /**
   * deve ser usado para encerrar as ações na base
   * @param {FinallyStrategy} strategy metodo de finalização de uma transação
   * pode ser
   * - COMMIT: conclui a transação que envolva alterações na base
   * - ROLLBACK: desfaz as alteraçãos na base
   * - END: apenas encerra a conexão
   */
  end(strategy: FinallyStrategy): Promise<void>;
}
