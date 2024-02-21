import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient } from "pg";
import { CustomEventEmitterDto } from "../../infrastructure/events/__dtos__/emiter-events.dtos";

export class EditJobUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: JobModuleRepository,
    private readonly eventEmitter: CustomEventEmitterDto
  ) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
    try {
      const param = [];
      const jobId = req.params["job_id"];

      if (!validateUUID(jobId)) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: 'job "UUID" is invalid',
          },
        };
      }

      const { title, description, location } = req.body;
      if (title) {
        param.push(title);
      }
      if (description) {
        param.push(description);
      }
      if (location) {
        param.push(location);
      }

      if (param.length === 0) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error:
              "at least one parameter must be informed (title, description, location, notes)",
          },
        };
      }

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.module.connection = conn;

      const [_, entity] = await Promise.all([
        this.module.updateJob({ description, title, location }, jobId),
        this.module.getJobById(jobId),
      ]);

      if (!entity.isValidEntity()) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: `${jobId} - job_id does not exist`,
          },
        };
      }

      if (entity.status === "published") {
        this.eventEmitter.publishJob("event_edit_job", 1, {
          job_id: jobId,
          origin: "api-jobs",
        });
      }

      await this.pgClient.commitTransaction(conn);

      return {
        statusCode: StatusCodes.OK,
        body: {
          data: { ...entity.getProps() },
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
