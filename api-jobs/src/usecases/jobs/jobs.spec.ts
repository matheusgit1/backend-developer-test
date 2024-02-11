import { HandlerEventsMock, queryresults } from "./../../tests/mocks";
import {
  mockRequest,
  mockResponse,
  mockNextFunction,
  PgClienteMock,
} from "../../tests/mocks";
import { JobsUseCase } from ".";
import { StatusCodes } from "http-status-codes";

const pgClienteMock = new PgClienteMock();
const handlerEvents = new HandlerEventsMock();
const jobsUseCase = new JobsUseCase(pgClienteMock, handlerEvents);

describe(`cenarios de testes para ${JobsUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucesso", () => {
    test(`deve executar metodo createJob com sucesso`, async () => {
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res).toBeUndefined();
    });

    test(`deve executar metodo archiveJob com sucesso`, async () => {
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

      const res = await jobsUseCase.archiveJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.message).toEqual("resource was successfully archived");
    });

    test(`deve executar metodo deleteJob com sucesso`, async () => {
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

      const res = await jobsUseCase.deleteJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.message).toEqual("resource was successfully excluded");
    });

    test(`deve executar metodo editJob com sucesso`, async () => {
      const rows = [{ id: 1 }];
      pgClienteMock.executeQuery.mockResolvedValueOnce({
        ...queryresults,
        rows: { ...rows },
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

      await jobsUseCase.editJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(2);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
    });

    test(`deve executar metodo publishJob com sucesso`, async () => {
      const res = await jobsUseCase.publishJob(
        mockRequest,
        mockResponse,
        mockNextFunction
      );
      expect(res.statusCode).toBe(StatusCodes.NOT_IMPLEMENTED);
    });
  });

  describe("casos de erros", () => {
    /** testes de erro para archiveJob */
    test(`se metodo de conexão de base em archiveJob falhar, usecase deve retornar erro`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.archiveJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de iniciar transação em archiveJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.archiveJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de execução de query em archiveJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.archiveJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de commit em archiveJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
      pgClienteMock.commitTransaction.mockRejectedValueOnce(new Error(message));
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

      const res = await jobsUseCase.archiveJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.error).toBe(message);
    });

    /** testes de erro para createJob */
    test(`se createJob não receber body esperado, operação deve falhar`, async () => {
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe("invalid parameters");
    });

    test(`se metodo de conexão de base em createJob falhar, usecase deve retornar erro`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de conexão de base em createJob falhar, usecase deve retornar erro`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de iniciar transação em createJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de execução de query em createJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de commit em createJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
      pgClienteMock.commitTransaction.mockRejectedValueOnce(new Error(message));
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

      const res = await jobsUseCase.createJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.error).toBe(message);
    });

    /** testes de erro para deleteJob */
    test(`se metodo de conexão de base em deleteJob falhar, usecase deve retornar erro`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.deleteJob(
        {
          ...mockRequest,
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mock",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de iniciar transação em deleteJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.deleteJob(
        {
          ...mockRequest,
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mock",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de execução de query em deleteJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.deleteJob(
        {
          ...mockRequest,
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mock",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de commit em deleteJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
      pgClienteMock.commitTransaction.mockRejectedValueOnce(new Error(message));
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

      const res = await jobsUseCase.deleteJob(
        {
          ...mockRequest,
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mock",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.error).toBe(message);
    });

    /** testes de erro para editJob */
    test(`metodo editJob deve falhar se nehum parametro for informado`, async () => {
      // const message = "erro mock";
      // pgClienteMock.getConnection.mockRejectedValueOnce(new Error(message));
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

      const res = await jobsUseCase.editJob(
        {
          ...mockRequest,
          // body: {
          //   title: "mocked",
          //   description: "mocked",
          //   location: "mocked",
          //   notes: "mocked",
          // },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      console.log(res);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.message).toBe("Unprocessable Entity");
    });

    test(`se metodo de conexão de base em editJob falhar, usecase deve retornar erro`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.editJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de iniciar transação em editJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.editJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de execução de query em editJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
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

      const res = await jobsUseCase.editJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(2);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(res.error).toBe(message);
    });

    test(`se metodo de commit em editJob falhar, usecase deve executar rollback e encerrar conexão`, async () => {
      const message = "erro mock";
      pgClienteMock.commitTransaction.mockRejectedValueOnce(new Error(message));
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

      const res = await jobsUseCase.editJob(
        {
          ...mockRequest,
          body: {
            title: "mocked",
            description: "mocked",
            location: "mocked",
            notes: "mocked",
          },
          headers: {
            company_id: "company_id_mocked",
          },
          params: {
            job_id: "mocked",
          },
        } as any,
        mockResponse,
        mockNextFunction
      );

      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_executeQuery).toHaveBeenCalledTimes(2);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(res.error).toBe(message);
    });

    /** testes de erro para publishJob */
    //TODO: implement
  });
});
