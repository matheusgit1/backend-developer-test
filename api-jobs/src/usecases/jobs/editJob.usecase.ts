import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";

export class EditJobUseCase implements BaseUseCase {
  constructor(private readonly module: JobModuleRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
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

      await this.module.init();
      await this.module.beggin();

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

      await this.module.end("COMMIT");

      return {
        statusCode: StatusCodes.OK,
        body: { ...rows[0] },
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
