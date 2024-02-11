import { queryresults } from "./../../tests/mocks";
import {
  PgClienteMock,
  mockNextFunction,
  mockRequest,
  mockResponse,
} from "../../tests/mocks";
import { CompaniesUseCase } from ".";

const pgClienteMock = new PgClienteMock();
const companyUseCase = new CompaniesUseCase(pgClienteMock);

describe(`cenarios de testes para ${CompaniesUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucesso", () => {
    test(`deve executar metodo getCompanies com sucesso`, async () => {
      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );

      const spy_pgClienteMock_executeQuery = jest.spyOn(
        pgClienteMock,
        "executeQuery"
      );

      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );

      const spy_pgClienteMock_releaseTransaction = jest.spyOn(
        pgClienteMock,
        "releaseTransaction"
      );
      const res = await companyUseCase.getCompanies(
        mockRequest,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(res).toBeDefined();
    });

    test(`deve executar metodo getCompanyById com sucesso`, async () => {
      pgClienteMock.executeQuery.mockResolvedValueOnce({
        ...queryresults,
        rows: [{ mock: "1" }],
      });
      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const spy_pgClienteMock_executeQuery = jest.spyOn(
        pgClienteMock,
        "executeQuery"
      );

      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );

      const spy_pgClienteMock_releaseTransaction = jest.spyOn(
        pgClienteMock,
        "releaseTransaction"
      );
      const res = await companyUseCase.getCompanyById(
        { ...mockRequest, params: { company_id: "company_id" } } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res).toBeDefined();
    });
  });
  describe("casos de erros", () => {
    test("metodo getCompanies deve falhar se a conexão com banco de dados falhar", async () => {
      const message = "erro ao se conectar na base de dados";
      pgClienteMock.getConnection.mockRejectedValueOnce(new Error(message));

      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const spy_pgClienteMock_executeQuery = jest.spyOn(
        pgClienteMock,
        "executeQuery"
      );

      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );

      const spy_pgClienteMock_releaseTransaction = jest.spyOn(
        pgClienteMock,
        "releaseTransaction"
      );

      const res = await companyUseCase.getCompanies(
        mockRequest,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toEqual(message);
    });

    test("metodo getCompanies deve falhar se a incialização de transação com banco de dados falhar", async () => {
      const message = "erro ao iniciar transaçao na base de dados";
      pgClienteMock.beginTransaction.mockRejectedValueOnce(new Error(message));

      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const spy_pgClienteMock_executeQuery = jest.spyOn(
        pgClienteMock,
        "executeQuery"
      );

      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );

      const spy_pgClienteMock_releaseTransaction = jest.spyOn(
        pgClienteMock,
        "releaseTransaction"
      );

      const res = await companyUseCase.getCompanies(
        mockRequest,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toEqual(message);
    });

    test("metodo getCompanies deve falhar se a execução de querie falhar", async () => {
      const message = "erro ao executar querie";
      pgClienteMock.executeQuery.mockRejectedValueOnce(new Error(message));

      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const spy_pgClienteMock_executeQuery = jest.spyOn(
        pgClienteMock,
        "executeQuery"
      );

      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );

      const spy_pgClienteMock_releaseTransaction = jest.spyOn(
        pgClienteMock,
        "releaseTransaction"
      );

      const res = await companyUseCase.getCompanies(
        mockRequest,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toEqual(message);
    });
  });
});

//
