import { StatusCodes } from "http-status-codes";
import { PgClienteMock } from "../../tests/mocks";
import { GetCompaniesUseCase } from "./getCompanies.usecase";

const pgClienteMock = new PgClienteMock();
const usecase = new GetCompaniesUseCase(pgClienteMock);

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

    it(`deve executar ações na base corretamente`, async () => {
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

      await usecase.handler();

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      pgClienteMock.getConnection.mockRejectedValueOnce(new Error(message));
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

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const res = await usecase.handler();

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base de dados falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      pgClienteMock.beginTransaction.mockRejectedValueOnce(new Error(message));
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

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const res = await usecase.handler();

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de execução de query falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      pgClienteMock.executeQuery.mockRejectedValueOnce(new Error(message));
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

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const res = await usecase.handler();

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });
  });
});
