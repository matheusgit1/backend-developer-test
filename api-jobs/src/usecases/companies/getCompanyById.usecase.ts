import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { BaseUseCase } from "..";

import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";

export class GetCompanyByIdUseCase implements BaseUseCase {
  constructor(private readonly module: CompanyModuleRepository) {}

  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
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
      await this.module.init();
      const company = await this.module.getCompanyById(companyId);

      return {
        statusCode: 200,
        body: {
          ...company[0],
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
