import { QueryResult } from "pg";
import { PgCliente } from "../cliente/pg.cliente";
import { AbstrataDatabaseRepository, FinallyStrategy } from "../pg.reposiory";

export abstract class AbstractDatabaseConnection
  implements AbstrataDatabaseRepository
{
  constructor(private pgCliente: PgCliente) {}
  public initialized: boolean;

  public async executeQuery(
    query: string,
    params?: any[]
  ): Promise<QueryResult<any>> {
    try {
      console.log(
        `[${AbstractDatabaseConnection.name}.executeQuery] - adiquirindo coneexão com o banco de dados`
      );
      return await this.pgCliente.executeQuery(query, params);
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.executeQuery] - método processado com erro`,
        e
      );
      throw e;
    }
  }
  public async initialize(): Promise<void> {
    try {
      console.log(
        `[${AbstractDatabaseConnection.name}.initialize] - adiquirindo coneexão com o banco de dados`
      );
      this.pgCliente = new PgCliente();
      await this.pgCliente.getConnection();
      this.initialized = true;
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.initialize] - método processado com erro`,
        e
      );
      throw e;
    }
  }

  public async finalize(strategy: FinallyStrategy): Promise<void> {
    try {
      switch (strategy) {
        case "COMMIT":
          await this.fecharConexaoCommitandoTransacao();
          break;
        case "ROLLBACK":
          await this.fecharConexaoCommitandoTransacao();
          break;
        case "END":
          await this.fecharConexao();
          break;
        default:
          await this.fecharConexaoExecutandoRollback();
          throw new Error(
            `método de finalização inválido. Métodos permitidos - ["COMMIT","ROLLBACK"]`
          );
      }
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.finalize] - método processado com erro`,
        e
      );
      throw e;
    }
  }

  private async fecharConexao(): Promise<void> {
    try {
      if (!this.initialized) {
        return;
      }
      await this.pgCliente.end();

      this.initialized = false;
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.fecharConexao] - método processado com erro`,
        e
      );
    }
  }

  private async fecharConexaoCommitandoTransacao(): Promise<void> {
    try {
      if (!this.initialized) {
        return;
      }
      await this.pgCliente.commitTransaction();
      await this.pgCliente.end();

      this.initialized = false;
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.fecharConexaoCommitandoTransacao] - método processado com erro`,
        e
      );
    }
  }

  private async fecharConexaoExecutandoRollback(): Promise<void> {
    try {
      if (!this.initialized) {
        return;
      }
      await this.pgCliente.rolbackTransaction();
      await this.pgCliente.end();

      this.initialized = false;
    } catch (e) {
      console.error(
        `[${AbstractDatabaseConnection.name}.fecharConexaoExecutandoRollback] - método processado com erro`,
        e
      );
    }
  }
}
