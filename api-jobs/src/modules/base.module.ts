import { PoolClient, QueryResult } from "pg";
import { PgClienteRepository } from "src/infrastructure/database/pg.repository";
import { BaseModuleRepository, FinallyStrategy } from "./base.repository";

export class BaseModule implements BaseModuleRepository {
  public connection: PoolClient;
  constructor(private readonly pgCliente: PgClienteRepository) {}

  /**
   * abstração para execuççao de queries na base
   */
  public async executeQuery(
    query: string,
    params?: any[]
  ): Promise<QueryResult<any>> {
    return await this.pgCliente.executeQuery(this.connection, query, params);
  }

  /**
   * deve ser chamado antes de qualquer ação ser executada
   */
  async init(): Promise<void> {
    this.connection = await this.pgCliente.getConnection();
  }

  async beggin(): Promise<void> {
    await this.pgCliente.beginTransaction(this.connection);
  }

  /**
   * deve ser usado para encerrar as ações na base
   * @param strategy {}
   */
  async end(strategy: FinallyStrategy): Promise<void> {
    switch (strategy) {
      case "COMMIT":
        await this.pgCliente.commitTransaction(this.connection);
        await this.pgCliente.releaseTransaction(this.connection);

        break;
      case "ROLLBACK":
        await this.pgCliente.rolbackTransaction(this.connection);
        await this.pgCliente.releaseTransaction(this.connection);

        break;
      case "END":
        try {
          await this.pgCliente.releaseTransaction(this.connection);
        } catch (e) {}

        break;
      default:
        await this.pgCliente.rolbackTransaction(this.connection);
        throw new Error("metodo de finalização invalido");
    }
  }
}
