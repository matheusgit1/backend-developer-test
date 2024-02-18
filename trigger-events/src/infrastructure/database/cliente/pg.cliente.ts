import * as pg from "pg";
import { configs } from "../../../configs/envs.config";
import { PgClienteRepository } from "../pg.reposiory";

export class PgClient implements PgClienteRepository {
  public client: pg.Pool;
  constructor() {
    this.client = new pg.Pool({
      user: configs.DB_USER,
      host: configs.DB_HOST,
      password: configs.DB_PASSWORD,
      port: +configs.DB_PORT,
      database: configs.DB_NAME,
      idle_in_transaction_session_timeout: 500,
      // connectionString: `postgres://${configs.DB_USER}:${configs.DB_PASSWORD}@${configs.DB_HOST}:${configs.DB_PORT}/${configs.DB_NAME}`,
    });
  }

  public async getConnection(): Promise<pg.PoolClient> {
    return await this.client.connect();
  }

  /**
   * inicia transação com banco de dados
   */
  public async beginTransaction(connection: pg.PoolClient): Promise<void> {
    await connection.query("BEGIN");
  }

  /**
   * inicia finaliza transação com banco de dados
   */
  public async commitTransaction(connection: pg.PoolClient): Promise<void> {
    await connection.query("COMMIT");
  }

  /**
   * em caso de falha a transação não é mantida no banco de dados
   */
  public async rolbackTransaction(connection: pg.PoolClient): Promise<void> {
    await connection.query("ROLLBACK");
  }

  /**
   *  fecha conexão com banco de dados
   */
  public async end(connection: pg.PoolClient): Promise<void> {
    await connection.release();
  }
}
