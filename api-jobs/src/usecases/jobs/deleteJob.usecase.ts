import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";

export class DeleteJobUseCase implements BaseUseCase {
  constructor(private readonly module: JobModuleRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = req.params["job_id"];

      if (!jobId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: "'job_id' is required",
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

      await this.module.init();
      await this.module.beggin();

      const { rowCount } = await this.module.deleteJob(jobId);

      await this.module.end("COMMIT");
      if (rowCount <= 0) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: `${jobId} - resource not found`,
          },
        };
      }

      return {
        statusCode: StatusCodes.ACCEPTED,
        body: {
          message: "resource was successfully excluded",
        },
      };
    } catch (err) {
      await this.module.end("ROLLBACK");
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      await this.module.end("END");
    }
  }
}
