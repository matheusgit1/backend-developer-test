import * as pg from "pg";

export declare class PgClienteRepository {
  public client: pg.Pool;
  constructor(...args: any[]);

  /**
   * adiquire conexão de polol
   * @returns {Promise<pg.PoolClient>}
   */
  getConnection(): Promise<pg.PoolClient>;

  /**
   * inicia transação com banco de dados
   * @param {pg.PoolClient} connection conexão do pool
   * @returns {Promise<void>}
   */
  beginTransaction(connection: pg.PoolClient): Promise<void>;

  /**
   * inicia finaliza transação com banco de dados
   * @param {pg.PoolClient} connection conexão do pool
   * @returns {Promise<void>}
   */
  commitTransaction(connection: pg.PoolClient): Promise<void>;

  /**
   * em caso de falha a transação não é mantida no banco de dados
   * @param {pg.PoolClient} connection conexão do pool
   * @returns {Promise<void>}
   */
  rolbackTransaction(connection: pg.PoolClient): Promise<void>;

  /**
   *  fecha conexão com banco de dados
   * @param {pg.PoolClient} connection conexão do pool
   * @returns {Promise<void>}
   */
  end(connection: pg.PoolClient): Promise<void>;
}
