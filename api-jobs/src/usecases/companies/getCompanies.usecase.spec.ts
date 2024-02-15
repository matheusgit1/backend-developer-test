import { StatusCodes } from "http-status-codes";
import { CompanyModuleMock } from "../../tests/mocks";
import { GetCompaniesUseCase } from "./getCompanies.usecase";

const companyModuleMock = new CompanyModuleMock();
const usecase = new GetCompaniesUseCase(companyModuleMock);

describe(`executando testes para ${GetCompaniesUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code 200 e lista de empresas cadastradas`, async () => {
      const res = await usecase.handler();
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    describe(`casos de erros`, () => {
      it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
        const message = "erro mockado";
        companyModuleMock.init.mockRejectedValueOnce(new Error(message));
        const spy_companyModuleMock_init = jest.spyOn(
          companyModuleMock,
          "init"
        );
        const spy_companyModuleMock_end = jest.spyOn(companyModuleMock, "end");

        const spy_companyModuleMock_getCompanies = jest.spyOn(
          companyModuleMock,
          "getCompanies"
        );

        const res = await usecase.handler();

        expect(spy_companyModuleMock_init).toHaveBeenCalledTimes(1);
        expect(spy_companyModuleMock_end).toHaveBeenCalledTimes(2);
        expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(0);
        expect(spy_companyModuleMock_end).toHaveBeenCalledWith("END");

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty("error");
      });
      it("deve executar rollback e desconexão de base se getCompanies falhaer", async () => {
        const message = "erro mockado";
        companyModuleMock.getCompanies.mockRejectedValueOnce(
          new Error(message)
        );
        const spy_companyModuleMock_init = jest.spyOn(
          companyModuleMock,
          "init"
        );
        const spy_companyModuleMock_end = jest.spyOn(companyModuleMock, "end");

        const spy_companyModuleMock_getCompanies = jest.spyOn(
          companyModuleMock,
          "getCompanies"
        );

        const res = await usecase.handler();

        expect(spy_companyModuleMock_init).toHaveBeenCalledTimes(1);
        expect(spy_companyModuleMock_end).toHaveBeenCalledTimes(2);
        expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(1);
        expect(spy_companyModuleMock_end).toHaveBeenCalledWith("END");

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty("error");
      });
    });
  });
});
