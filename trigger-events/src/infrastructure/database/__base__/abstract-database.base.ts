import { PgCliente } from "../cliente/pg.cliente";
import { AbstrataDatabaseRepository, FinallyStrategy } from "../pg.reposiory";

export abstract class ClasseAbstrataDatabase
  implements AbstrataDatabaseRepository
{
  public initialized: boolean;
  public pgCliente: PgCliente;

  public async initialize(): Promise<void> {
    try {
      console.log(
        `[${ClasseAbstrataDatabase.name}.inicar] - adiquirindo coneexão com o banco de dados`
      );
      this.pgCliente = new PgCliente();
      await this.pgCliente.getConnection();
      this.initialized = true;
    } catch (e) {
      console.error(
        `[${ClasseAbstrataDatabase.name}.inicar] - método processado com erro`,
        e
      );
      throw e;
    } finally {
      console.info(
        `[${ClasseAbstrataDatabase.name}.inicar] - método finalizado`
      );
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
        default:
          await this.fecharConexaoExecutandoRollback();
          throw new Error(
            `método de finalização inválido. Métodos permitidos - ["COMMIT","ROLLBACK"]`
          );
      }
    } catch (e) {
      console.error(
        `[${ClasseAbstrataDatabase.name}.finalizar] - método processado com erro`,
        e
      );
      throw e;
    } finally {
      console.info(
        `[${ClasseAbstrataDatabase.name}.finalizar] - método finalizado`
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
        `[${ClasseAbstrataDatabase.name}.fecharConexaoCommitandoTransacao] - método processado com erro`,
        e
      );
    } finally {
      console.info(
        `[${ClasseAbstrataDatabase.name}.fecharConexaoCommitandoTransacao] - método finalizado`
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
        `[${ClasseAbstrataDatabase.name}.fecharConexaoExecutandoRollback] - método processado com erro`,
        e
      );
    } finally {
      console.info(
        `[${ClasseAbstrataDatabase.name}.fecharConexaoExecutandoRollback] - método finalizado`
      );
    }
  }

  private validateConnection(): void {
    if (!this.initialized) {
      throw new Error(
        'metodo "initilize" deve ser chamado antes da operação ser executada'
      );
    }
  }
}
