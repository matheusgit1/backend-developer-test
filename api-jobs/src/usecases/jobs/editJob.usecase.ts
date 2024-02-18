import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient } from "pg";
import { CustomEventEmitterDto } from "src/infrastructure/events/__dtos__/emiter-events.dtos";

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
      if (!jobId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"job_id" is required',
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

      const { title, description, location, notes } = req.body;
      if (title) {
        param.push(title);
      }
      if (description) {
        param.push(description);
      }
      if (location) {
        param.push(location);
      }
      if (notes) {
        param.push(notes);
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

      const [_, { rows, rowCount }] = await Promise.all([
        this.module.updateJob({ description, title, notes, location }, jobId),
        this.module.getJobById(jobId),
      ]);

      if (rowCount < 1) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: `${jobId} - job_id dos not exist`,
          },
        };
      }

      if (rows[0].status === "published") {
        this.eventEmitter.publishJob("event_edit_job", 1, {
          job_id: rows[0].id,
          origin: "api-jobs",
        });
      }

      await this.pgClient.commitTransaction(conn);

      return {
        statusCode: StatusCodes.OK,
        body: { ...rows[0] },
      };
    } catch (err) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (conn) {
        await this.pgClient.releaseTransaction(conn);
      }
    }
  }
}
