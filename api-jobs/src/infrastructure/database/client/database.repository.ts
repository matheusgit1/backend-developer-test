import * as pg from "pg";
import { PgClienteRepository } from "../pg.repository";
import { configs } from "../../../configs/envs/environments.config";

export class PgCliente implements PgClienteRepository {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      connectionTimeoutMillis: 10 * 1000, //10 segundos
      max: 50,
      connectionString: `postgres://${configs.DB_USER}:${configs.DB_PASSWORD}@${configs.DB_HOST}:${configs.DB_PORT}/${configs.DB_NAME}`,
    });
  }

  public async getConnection(): Promise<pg.PoolClient> {
    return await this.pool.connect();
  }

  public async beginTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("BEGIN");
  }

  public async commitTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("COMMIT");
  }

  public async rolbackTransaction(Connection: pg.PoolClient): Promise<void> {
    await Connection.query("ROLLBACK");
  }

  public async releaseTransaction(Connection: pg.PoolClient): Promise<void> {
    return Connection.release();
  }
}
