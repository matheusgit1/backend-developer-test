import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { BaseUseCase } from "..";
import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { PoolClient } from "pg";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";

export class GetCompaniesUseCase implements BaseUseCase {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly module: CompanyModuleRepository
  ) {}

  public async handler(): Promise<HttpResponse> {
    let conn: PoolClient | undefined = undefined;
    try {
      conn = await this.pgClient.getConnection();
      this.module.connection = conn;

      const companies = await this.module.getCompanies();

      return {
        statusCode: StatusCodes.OK,
        body: companies.rows.map((company) => ({
          id: company.id,
          name: company.name,
        })),
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
