import { JobModuleMock } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { ArchiveJobUseCase } from "./archiveJob.usecase";

const jobModuleMock = new JobModuleMock();
const usecase = new ArchiveJobUseCase(jobModuleMock);
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
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledWith("COMMIT");
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledWith(jobId);
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      jobModuleMock.init.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");
      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledWith("ROLLBACK");
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base de dados falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      jobModuleMock.beggin.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");
      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledWith("ROLLBACK");
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de arquivar job falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      jobModuleMock.archiveJob.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");
      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledWith("ROLLBACK");
      expect(spy_jobModuleMock_archiveJob).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });
  });
});
