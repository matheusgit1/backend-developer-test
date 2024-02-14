import * as pg from "pg";

export declare class PGClientRepository {
  public cliente: pg.Client;

  public constructor();

  getConnection(): Promise<void>;

  /**
   * inicia transação com banco de dados
   */
  beginTransaction(): Promise<void>;

  /**
   * inicia finaliza transação com banco de dados
   */
  commitTransaction(): Promise<void>;

  /**
   * em caso de falha a transação não é mantida no banco de dados
   */
  rolbackTransaction(): Promise<void>;

  /**
   * fecha conexão com banco de dados
   */
  end(): Promise<void>;

  /**
   * executa query sql dentro da mesma transação com banco de dados
   * @param {string} query query sql
   * @param {any[]} params array de parametros
   * @return {Promise<pg.QueryResult<any>>}
   */
  executeQuery(query: string, params?: any[]): Promise<pg.QueryResult<any>>;
}

export type FinallyStrategy = "COMMIT" | "ROLLBACK";

export declare class AbstrataDatabaseRepository {
  public initialized: boolean;
  public pgCliente: PGClientRepository;
  constructor(...args: any[]);

  initialize(): Promise<void>;
  finalize(strategia: FinallyStrategy): Promise<void>;
}
