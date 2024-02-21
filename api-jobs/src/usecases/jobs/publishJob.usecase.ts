import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomEventEmitterDto } from "../../infrastructure/events/__dtos__/emiter-events.dtos";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";

export class PublishJobUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: JobModuleRepository,
    private readonly eventEmitter: CustomEventEmitterDto
  ) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
    try {
      const jobId = req.params["job_id"];

      if (!validateUUID(jobId)) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: 'job "UUID" is invalid',
          },
        };
      }
      conn = await this.pgClient.getConnection();
      this.module.connection = conn;

      const { rows, rowCount } = await this.module.getJobById(jobId);
      if (rowCount === 0) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: `${jobId} - resource not found`,
          },
        };
      }
      if (rows[0].status === "published") {
        return {
          statusCode: StatusCodes.OK,
        };
      }

      this.eventEmitter.publishJob("event_publish_job", 1, {
        job_id: rows[0].id,
        origin: "api-jobs",
      });
      return {
        statusCode: StatusCodes.ACCEPTED,
        body: {
          message:
            "job will be analyzed before being definitively published. Please wait...",
        },
      };
    } catch (err) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (conn) {
        await this.pgClient.releaseTransaction(conn);
      }
    }
  }
}
