import { StatusCodes } from "http-status-codes";
import { CompanyModuleMock } from "../../tests/mocks";
import { GetCompanyByIdUseCase } from "./getCompanyById.usecase";
import * as crypto from "crypto";

const companyModuleMock = new CompanyModuleMock();
const usecase = new GetCompanyByIdUseCase(companyModuleMock);
const companyId = crypto.randomUUID().toString();
describe(`executando testes para ${GetCompanyByIdUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code 200 e dados de empresas cadastradas`, async () => {
      const res = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });

    it(`deve executar ações na base corretamente`, async () => {
      const spy_companyModuleMock_init = jest.spyOn(companyModuleMock, "init");
      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_companyModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_companyModuleMock_init).toHaveBeenCalledWith();
      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(1);
      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledWith(
        companyId
      );
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      companyModuleMock.init.mockRejectedValueOnce(new Error(message));
      const spy_companyModuleMock_init = jest.spyOn(companyModuleMock, "init");
      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      const spy_pgClienteMock_end = jest.spyOn(companyModuleMock, "end");

      const res = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_companyModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_companyModuleMock_init).toHaveBeenCalledWith();
      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(2);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo getCompanyById falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      companyModuleMock.getCompanyById.mockRejectedValueOnce(
        new Error(message)
      );
      const spy_companyModuleMock_init = jest.spyOn(companyModuleMock, "init");
      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      const spy_pgClienteMock_end = jest.spyOn(companyModuleMock, "end");
      const res = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_companyModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_companyModuleMock_init).toHaveBeenCalledWith();
      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(1);
      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledWith(
        companyId
      );
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(2);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });
  });
});
