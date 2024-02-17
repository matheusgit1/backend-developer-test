import { BaseUseCase } from "..";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { validateUUID } from "../../utils/utilities";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient } from "pg";

export class CreateJobUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: JobModuleRepository
  ) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
    try {
      const companyId = req.headers["company_id"] as string;
      const { title, description, location, notes } = req.body;
      if (!title || !description! || !location || !notes) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"invalid" parameters',
          },
        };
      }
      if (!companyId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"company_id" is required',
          },
        };
      }
      if (!validateUUID(companyId)) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: 'company "UUID" is invalid',
          },
        };
      }

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.module.connection = conn;

      await this.module.createJob({
        companyId: companyId,
        title,
        description,
        location,
        notes,
      });

      await this.pgClient.commitTransaction(conn);
      return {
        statusCode: StatusCodes.CREATED,
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
