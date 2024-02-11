import * as pg from "pg";
import { PgClienteRepository } from "../pg.repository";

export class PgCliente implements PgClienteRepository {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    });
  }

  /**
   * pega conexão com banco de dados
   */
  public async getConnection(): Promise<pg.PoolClient> {
    return await this.pool.connect();
  }

  /**
   * inicia transação com banco de dados
   */
  public async beginTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("BEGIN");
  }

  /**
   * inicia finaliza transação com banco de dados
   */
  public async commitTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("COMMIT");
  }

  /**
   * em caso de falha a transação não é mantida no banco de dados
   */
  public async rolbackTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("ROLLBACK");
  }

  /**
   *  fecha conexão com banco de dados
   */
  public async releaseTransaction(Connection: pg.PoolClient): Promise<void> {
    return Connection.release();
  }

  /**
   * executa query sql dentro da mesma transação com banco de dados
   * @param {Connection} Connection instancia de conexão
   * @param {string} query query sql
   * @param {any[]} params array de parametros
   * @return {Promise<pg.QueryResul<any>>}
   */
  public async executeQuery(
    Connection: pg.PoolClient,
    query: string,
    params?: any[]
  ): Promise<pg.QueryResult<any>> {
    return Connection.query(query, params);
  }
}
