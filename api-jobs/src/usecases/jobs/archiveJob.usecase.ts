import { PgClienteRepository } from "src/infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class ArchiveJobUseCase implements BaseUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = req.params["job_id"];
      if (!jobId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            message: '"job_id" is required',
          },
        };
      }
      const sql = `
        update jobs set status = 'archived'::job_status, updated_at = NOW() where id = $1;
      `;
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      await this.pgCliente.executeQuery(connection, sql, [jobId]);

      await this.pgCliente.commitTransaction(connection);

      return {
        statusCode: StatusCodes.ACCEPTED,
        body: {
          message: "resource was successfully archived",
        },
      };
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }
}
