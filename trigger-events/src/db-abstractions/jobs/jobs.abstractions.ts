import { Logger } from "../../infrastructure/logger/logger";
import { AbstractDatabaseConnection } from "../../infrastructure/database/__base__/abstract-database.base";

export class JobsDBAbstractions extends AbstractDatabaseConnection {
  constructor(
    private readonly logger: Logger = new Logger(JobsDBAbstractions.name)
  ) {
    super();
  }

  public async getJobById(jobId: string): Promise<any> {
    try {
      await this.initialize();

      const sql = `select * from job where id = $1`;
      const { rows, rowCount } = await this.pgCliente.executeQuery(sql, [
        jobId,
      ]);
      if (rowCount === 0) {
        throw new Error(`Job ${jobId} not found`);
      }
      return rows[0];
    } catch (err) {
      this.logger.error(`[getJobById] método processado com erro`, err);
      if (this.initialized) {
        await this.finalize("ROLLBACK");
      }
    } finally {
      if (this.initialized) {
        await this.pgCliente.end();
      }
    }
  }
}
