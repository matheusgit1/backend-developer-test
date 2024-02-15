import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { BaseUseCase } from "..";
import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";

export class GetCompaniesUseCase implements BaseUseCase {
  constructor(private readonly module: CompanyModuleRepository) {}

  public async handler(): Promise<HttpResponse> {
    try {
      await this.module.init();

      const companies = await this.module.getCompanies();

      return {
        statusCode: StatusCodes.OK,
        body: companies.map((company) => ({
          id: company.id,
          name: company.name,
        })),
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
