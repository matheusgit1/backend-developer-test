import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient } from "pg";

export class ArchiveJobUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: JobModuleRepository
  ) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
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
      if (!validateUUID(jobId)) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: 'job "UUID" is invalid',
          },
        };
      }

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.module.connection = conn;

      await this.module.archiveJob(jobId);
      await this.pgClient.commitTransaction(conn);
      return {
        statusCode: StatusCodes.ACCEPTED,
        body: {
          message: "resource was successfully archived",
        },
      };
    } catch (err) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (conn) {
        await this.pgClient.releaseTransaction(conn);
      }
    }
  }
}
