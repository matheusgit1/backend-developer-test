import { PoolClient, QueryResult } from "pg";
export type FinallyStrategy = "COMMIT" | "ROLLBACK" | "END";

export declare class BaseModuleRepository {
  public connection: PoolClient;
  constructor(...args: any[])

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
   * @param strategy {}
   */
  end(strategy: FinallyStrategy): Promise<void>;
}
