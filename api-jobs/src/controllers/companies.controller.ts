import { Router } from "express";
import { CompaniesUseCase } from "../usecases/companies";
import { PgCliente } from "../infrastructure/database/client/database.repository";

const routes = Router();

const usecase = new CompaniesUseCase(new PgCliente());

routes.get(
  "/",
  async (_req, _res, _next) => await usecase.getCompanies(_req, _res, _next)
);

routes.get(
  "/:company_id",
  async (_req, _res, _next) => await usecase.getCompanyById(_req, _res, _next)
);

export { routes };
