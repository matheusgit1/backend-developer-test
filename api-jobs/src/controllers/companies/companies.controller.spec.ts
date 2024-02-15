import { StatusCodes } from "http-status-codes";
import { Usecases } from "../shareds";
import express from "express";
import request from "supertest";
import { CompaniesRoutesAdapted } from "./companies.controller";
import { GetCompaniesUseCase } from "../../usecases/companies/getCompanies.usecase";
import { GetCompanyByIdUseCase } from "../../usecases/companies/getCompanyById.usecase";
import { CompanyModuleMock } from "../../tests/mocks";

const companyModuleMock = new CompanyModuleMock();

const usecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetCompaniesUseCase(companyModuleMock),
  },
  {
    path: "/:company_id",
    method: "get",
    usecase: new GetCompanyByIdUseCase(companyModuleMock),
  },
];

const app = express();
const { routes } = new CompaniesRoutesAdapted(usecases);

app.use("/", routes);

describe(`testes para ${CompaniesRoutesAdapted.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();

  describe(`casos de sucessos`, () => {
    it("deve executar '/' com sucesso", async () => {
      const { body, status } = await request(app).get("/");

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.OK);
    });

    it("deve executar '/:company_id' com sucesso", async () => {
      const { body, status } = await request(app).get("/:company_id");

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.OK);
    });
  });

  describe(`casos de erros`, () => {
    it(`deve executar '/' com ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (conexão)`, async () => {
      companyModuleMock.init.mockRejectedValue(new Error("erro mockado"));
      const { body, status } = await request(app).get("/");

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it(`deve executar '/' com ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (recuperar empresa)`, async () => {
      companyModuleMock.getCompanies.mockRejectedValue(
        new Error("erro mockado")
      );
      const { body, status } = await request(app).get("/");

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it(`deve executar '/:company_id' com ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (recuperar empresas)`, async () => {
      const companyId = crypto.randomUUID().toString();
      companyModuleMock.getCompanyById.mockRejectedValue(
        new Error("erro mockado")
      );
      const { body, status } = await request(app).get(`/${companyId}`);

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
