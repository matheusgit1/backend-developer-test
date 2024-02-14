import * as pg from "pg";
import { configs } from "../../../configs/envs.config";
import { PGClientRepository } from "../pg.reposiory";

export class PgCliente implements PGClientRepository {
  public cliente: pg.Client;

  constructor() {
    this.cliente = new pg.Client({
      connectionTimeoutMillis: 10 * 1000, //10 segundos,
      connectionString: `postgres://${configs.DB_USER}:${configs.DB_PASSWORD}@${configs.DB_HOST}:${configs.DB_PORT}/${configs.DB_NAME}`,
    });
  }
  public async getConnection(): Promise<void> {
    return await this.cliente.connect();
  }

  /**
   * inicia transação com banco de dados
   */
  public async beginTransaction(): Promise<void> {
    await this.cliente.query("BEGIN");
  }

  /**
   * inicia finaliza transação com banco de dados
   */
  public async commitTransaction(): Promise<void> {
    await this.cliente.query("COMMIT");
  }

  /**
   * em caso de falha a transação não é mantida no banco de dados
   */
  public async rolbackTransaction(): Promise<void> {
    await this.cliente.query("ROLLBACK");
  }

  /**
   *  fecha conexão com banco de dados
   */
  public async end(): Promise<void> {
    await this.cliente.end();
  }

  /**
   * executa query sql dentro da mesma transação com banco de dados
   * @param {string} query query sql
   * @param {any[]} params array de parametros
   * @return {Promise<pg.QueryResult<any>>}
   */
  public async executeQuery(
    query: string,
    params?: any[]
  ): Promise<pg.QueryResult<any>> {
    return await this.cliente.query(query, params);
  }
}
