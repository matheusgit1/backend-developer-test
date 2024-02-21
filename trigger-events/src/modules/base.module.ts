import { PoolClient, QueryResult } from "pg";
import { BaseModuleRepository } from "./__dtos__/modules.dtos";

export class BaseModule implements BaseModuleRepository {
  connection: PoolClient;
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async executeQuery<T>(
    query: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    if (!this.connection) {
      throw new Error(
        `conexão com base de dados não foi instanciada. Considere usar ${this.name}.connection = PoolClient`
      );
    }
    return await this.connection.query(query, params);
  }
}
