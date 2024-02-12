import { NextFunction, Request, Response, Router } from "express";
import { PgCliente } from "../../infrastructure/database/client/database.repository";
import { adaptRoute } from "../adapters";
import { GetCompaniesUseCase } from "../../usecases/companies/getCompanies.usecase";
import { GetCompanyByIdUseCase } from "../../usecases/companies/getCompanyById.usecase";
import { Usecases } from "../shareds";

export class CompaniesRoutesAdapted {
  public routes: Router = Router();
  constructor(private readonly usecases: Usecases) {
    for (const { method, path, usecase } of this.usecases) {
      this.routes[method](
        path,
        async (req: Request, res: Response, next: NextFunction) =>
          await adaptRoute(() => usecase.handler({ req, next }), res)
      );
    }
  }
}

const routesAdapteds = new CompaniesRoutesAdapted([
  {
    path: "/",
    method: "get",
    usecase: new GetCompaniesUseCase(new PgCliente()),
  },
  {
    path: "/:company_id",
    method: "get",
    usecase: new GetCompanyByIdUseCase(new PgCliente()),
  },
]);

export const { routes } = routesAdapteds;
