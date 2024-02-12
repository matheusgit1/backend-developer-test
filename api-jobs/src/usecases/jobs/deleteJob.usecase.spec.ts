import { queryresults } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { PgClienteMock } from "../../tests/mocks";
import { DeleteJobUseCase } from "./deleteJob.usecase";

const pgClienteMock = new PgClienteMock();
const usecase = new DeleteJobUseCase(pgClienteMock);
const jobId = crypto.randomUUID().toString();

describe(`executando testes para ${DeleteJobUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code ${StatusCodes.ACCEPTED}`, async () => {
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.ACCEPTED);
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

      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledWith();
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
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

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

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

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

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

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

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

    it(`se job_id "não for informado nos params, deve retornar ${StatusCodes.BAD_REQUEST}`, async () => {
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

      const res = await usecase.handler({
        req: {
          params: {},
          headers: {
            // company_id: companyId,
          },
        },
      } as any);

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(0);

      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toHaveProperty("error");
    });
  });
});
