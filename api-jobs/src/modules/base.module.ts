import { PoolClient, QueryResult } from "pg";
import { PgClienteRepository } from "src/infrastructure/database/pg.repository";
import { BaseModuleRepository, FinallyStrategy } from "./base.repository";

export class BaseModule implements BaseModuleRepository {
  public connection: PoolClient = undefined;
  public moduleName: string;
  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  /**
   * abstração para execuççao de queries na base
   */
  public async executeQuery(
    query: string,
    params?: any[]
  ): Promise<QueryResult<any>> {
    if (!this.connection) {
      throw new Error(
        `conexão com base de dados não foi instaciada. Considere usar ${this.moduleName}.connection = PoolClient`
      );
    }
    return await this.connection.query(query, params);
  }
}
