import { JobModuleMock, PgClienteMock } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { ArchiveJobUseCase } from "./archiveJob.usecase";

const pgClientMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const usecase = new ArchiveJobUseCase(pgClientMock, jobModuleMock);
const jobId = crypto.randomUUID().toString();

describe(`executando testes para ${ArchiveJobUseCase.name}`, () => {
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_archiveJob = jest.spyOn(
        jobModuleMock,
        "archiveJob"
      );

      await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledWith(jobId);
    });

    it(`se job_Id for inválido, ação deve retornar statusCode ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_archiveJob = jest.spyOn(
        jobModuleMock,
        "archiveJob"
      );

      const { statusCode } = await usecase.handler({
        req: {
          params: {
            job_id: "jobId",
          },
        },
      } as any);
      expect(statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(0);
    });
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_archiveJob = jest.spyOn(
        jobModuleMock,
        "archiveJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base de dados falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      pgClientMock.beginTransaction.mockRejectedValueOnce(new Error(message));
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_archiveJob = jest.spyOn(
        jobModuleMock,
        "archiveJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de arquivar job falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      jobModuleMock.archiveJob.mockRejectedValueOnce(new Error(message));
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_archiveJob = jest.spyOn(
        jobModuleMock,
        "archiveJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });
  });
});
