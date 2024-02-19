import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { BaseUseCase } from "..";

import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { PoolClient } from "pg";

export class GetCompanyByIdUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: CompanyModuleRepository
  ) {}

  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
    try {
      const companyId = req.params["company_id"];
      if (!companyId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"company_id" is required',
          },
        };
      }
      conn = await this.pgClient.getConnection();
      this.module.connection = conn;
      const { rows } = await this.module.getCompanyById(companyId);

      return {
        statusCode: 200,
        body: {
          data: {
            ...rows[0],
          },
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
