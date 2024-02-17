import { PoolClient, QueryResult } from "pg";
export type FinallyStrategy = "COMMIT" | "ROLLBACK" | "END";

export declare class BaseModuleRepository {
  public connection: PoolClient;
  constructor(...args: any[]);

  /**
   * abstração para execuççao de queries na base
   */
  executeQuery(query: string, params?: any[]): Promise<QueryResult<any>>;
}
