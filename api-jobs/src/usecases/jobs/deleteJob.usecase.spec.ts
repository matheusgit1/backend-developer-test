import { JobModuleMock } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { DeleteJobUseCase } from "./deleteJob.usecase";

const jobModuleMock = new JobModuleMock();
const usecase = new DeleteJobUseCase(jobModuleMock);
const jobId = crypto.randomUUID().toString();
const companyId = crypto.randomUUID().toString();

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
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
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

      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenCalledWith("COMMIT");

      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledWith(jobId);
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      jobModuleMock.init.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenNthCalledWith(1, "ROLLBACK");
      expect(spy_jobModuleMock_end).toHaveBeenLastCalledWith("END");
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base de dados falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      jobModuleMock.beggin.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenNthCalledWith(1, "ROLLBACK");
      expect(spy_jobModuleMock_end).toHaveBeenLastCalledWith("END");
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de deleção falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      jobModuleMock.deleteJob.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
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

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenNthCalledWith(1, "ROLLBACK");
      expect(spy_jobModuleMock_end).toHaveBeenLastCalledWith("END");
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it(`se job_id "não for informado nos params, deve retornar ${StatusCodes.BAD_REQUEST}`, async () => {
      const message = "erro mockado";
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
      );
      const res = await usecase.handler({
        req: {
          params: {},
          headers: {
            // company_id: companyId,
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toHaveProperty("error");
    });

    it(`se job_id informado nos params for inválido, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      const message = "erro mockado";
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_deleteJob = jest.spyOn(
        jobModuleMock,
        "deleteJob"
      );
      const res = await usecase.handler({
        req: {
          params: {
            job_id: "job_id",
          },
          headers: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_deleteJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });
  });
});
