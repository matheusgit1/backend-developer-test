import { StatusCodes } from "http-status-codes";
import { CompanyModuleMock, PgClienteMock } from "../../tests/mocks";
import { GetCompaniesUseCase } from "./getCompanies.usecase";

const pgClientMock = new PgClienteMock();
const companyModuleMock = new CompanyModuleMock();
const usecase = new GetCompaniesUseCase(pgClientMock, companyModuleMock);

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
        pgClientMock.getConnection.mockRejectedValueOnce(new Error(message));
        const spy_pgClientMock_getConnection = jest.spyOn(
          pgClientMock,
          "getConnection"
        );
        const spy_pgClientMock_beginTransaction = jest.spyOn(
          pgClientMock,
          "beginTransaction"
        );
        const spy_pgClientMock_commitTransaction = jest.spyOn(
          pgClientMock,
          "commitTransaction"
        );
        const spy_pgClientMock_executeQuery = jest.spyOn(
          pgClientMock,
          "executeQuery"
        );
        const spy_pgClientMock_releaseTransaction = jest.spyOn(
          pgClientMock,
          "releaseTransaction"
        );
        const spy_pgClientMock_rolbackTransaction = jest.spyOn(
          pgClientMock,
          "rolbackTransaction"
        );

        const spy_companyModuleMock_getCompanies = jest.spyOn(
          companyModuleMock,
          "getCompanies"
        );

        const res = await usecase.handler();

        expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
        expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_executeQuery).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
        expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(0);

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty("error");
      });

      it("deve executar rollback e desconexão de base se getCompanies falhar", async () => {
        const message = "erro mockado";
        companyModuleMock.getCompanies.mockRejectedValueOnce(
          new Error(message)
        );
        const spy_pgClientMock_getConnection = jest.spyOn(
          pgClientMock,
          "getConnection"
        );
        const spy_pgClientMock_beginTransaction = jest.spyOn(
          pgClientMock,
          "beginTransaction"
        );
        const spy_pgClientMock_commitTransaction = jest.spyOn(
          pgClientMock,
          "commitTransaction"
        );
        const spy_pgClientMock_executeQuery = jest.spyOn(
          pgClientMock,
          "executeQuery"
        );
        const spy_pgClientMock_releaseTransaction = jest.spyOn(
          pgClientMock,
          "releaseTransaction"
        );
        const spy_pgClientMock_rolbackTransaction = jest.spyOn(
          pgClientMock,
          "rolbackTransaction"
        );

        const spy_companyModuleMock_getCompanies = jest.spyOn(
          companyModuleMock,
          "getCompanies"
        );

        const res = await usecase.handler();

        expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
        expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_executeQuery).toHaveBeenCalledTimes(0);
        expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
        expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
        expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(1);

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty("error");
      });
    });
  });
});