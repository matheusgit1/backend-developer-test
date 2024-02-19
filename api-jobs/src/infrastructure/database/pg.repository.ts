import * as pg from "pg";

export declare class PgClienteRepository {
  constructor(...args: any[]);

  /**
   * pega conexão com banco de dados
   */
  getConnection(): Promise<pg.PoolClient>;

  /**
   * inicia transação com banco de dados
   */
  beginTransaction(Connection: pg.PoolClient): Promise<void>;

  /**
   * inicia finaliza transação com banco de dados
   */
  commitTransaction(Connection: pg.PoolClient): Promise<void>;

  /**
   * em caso de falha a transação não é mantida no banco de dados
   */
  rolbackTransaction(Connection: pg.PoolClient): Promise<void>;

  /**
   *  fecha conexão com banco de dados
   */
  releaseTransaction(Connection: pg.PoolClient): Promise<void>;
}
