import { JobModuleMock, queryresults } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { EditJobUseCase } from "./editJob.usecase";

const jobModuleMock = new JobModuleMock();
const usecase = new EditJobUseCase(jobModuleMock);
const jobId = crypto.randomUUID().toString();

describe(`executando testes para ${EditJobUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code ${StatusCodes.OK}`, async () => {
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
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it(`deve retornar status code ${StatusCodes.OK} mesmo se apenas um parametro for informado`, async () => {
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
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it(`deve executar ações na base corretamente`, async () => {
      const body = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...body,
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledWith();

      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenNthCalledWith(1, "COMMIT");
      expect(spy_jobModuleMock_end).toHaveBeenLastCalledWith("END");

      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledWith(jobId);

      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledWith(body, jobId);
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      jobModuleMock.init.mockRejectedValueOnce(new Error(message));
      const body = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };

      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...body,
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_init).toHaveBeenCalledWith();
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(2);
      expect(spy_jobModuleMock_end).toHaveBeenNthCalledWith(1, "ROLLBACK");
      expect(spy_jobModuleMock_end).toHaveBeenLastCalledWith("END");
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      jobModuleMock.beggin.mockRejectedValueOnce(new Error(message));
      const body = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };

      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...body,
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
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de edição falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      const body = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };
      jobModuleMock.updateJob.mockRejectedValueOnce(new Error(message));
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...body,
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

      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledWith(jobId);

      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledWith(
        { ...body },
        jobId
      );

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it(`se job_id for inválido método deve retornar erro`, async () => {
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: "jobId",
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });

    it(`se parametros "body" não forem inválidos, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      const spy_jobModuleMock_init = jest.spyOn(jobModuleMock, "init");
      const spy_jobModuleMock_beggin = jest.spyOn(jobModuleMock, "beggin");

      const spy_jobModuleMock_end = jest.spyOn(jobModuleMock, "end");

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            // title: "title",
            // description: "description",
            // location: "location",
            // notes: "notes",
          },
        },
      } as any);

      expect(spy_jobModuleMock_init).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_beggin).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_end).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });
  });
});
