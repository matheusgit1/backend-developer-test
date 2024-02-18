import { PoolClient, QueryResult } from "pg";
import { BaseModuleRepository } from "./jobs/jobs.repository";

export class BaseModule implements BaseModuleRepository {
  connection: PoolClient;
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async executeQuery(query: string, params?: any[]): Promise<QueryResult<any>> {
    if (!this.connection) {
      throw new Error(
        `connexão com base de dados não foi instanciada. Considere usar ${this.name}.connection = PoolClient`
      );
    }
    return await this.connection.query(query, params);
  }
}
