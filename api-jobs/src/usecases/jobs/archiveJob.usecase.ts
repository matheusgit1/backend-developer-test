import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";

export class ArchiveJobUseCase implements BaseUseCase {
  constructor(private readonly module: JobModuleRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
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

      await this.module.init();

      await this.module.beggin();

      await this.module.archiveJob(jobId);

      this.module.end("COMMIT");
      return {
        statusCode: StatusCodes.ACCEPTED,
        body: {
          message: "resource was successfully archived",
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
    }
  }
}
