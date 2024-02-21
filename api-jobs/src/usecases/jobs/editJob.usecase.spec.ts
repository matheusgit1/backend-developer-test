import {
  CustomEventEmitterMock,
  JobModuleMock,
  PgClienteMock,
  queryresults,
} from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { EditJobUseCase } from "./editJob.usecase";

const pgClientMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const customEventEmmiter = new CustomEventEmitterMock();

const usecase = new EditJobUseCase(
  pgClientMock,
  jobModuleMock,
  customEventEmmiter
);
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
      jobModuleMock.getJobById.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            id: "id",
            status: "draft",
          },
        ],
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it(`deve retornar status code ${StatusCodes.OK} mesmo se apenas um parametro for informado`, async () => {
      jobModuleMock.getJobById.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            id: "id",
            status: "draft",
          },
        ],
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it(`deve executar ações na base corretamente`, async () => {
      jobModuleMock.getJobById.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            id: "id",
            status: "draft",
          },
        ],
      });
      const bodyRequest = {
        title: "title",
        description: "description",
        location: "location",
      };

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

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...bodyRequest,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledWith(jobId);

      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledWith(
        bodyRequest,
        jobId
      );

      expect(statusCode).toBe(StatusCodes.OK);
      expect(body).toBeDefined();
    });

    it(`deve job tiver status 'published', evento de edição deve ser disparado`, async () => {
      jobModuleMock.getJobById.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            id: jobId,
            status: "published",
          },
        ],
      });
      const bodyRequest = {
        title: "title",
        description: "description",
        location: "location",
      };
      const spy_customEventEmmiter_publishJob = jest.spyOn(
        customEventEmmiter,
        "publishJob"
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

      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_jobModuleMock_getJobById = jest.spyOn(
        jobModuleMock,
        "getJobById"
      );

      const spy_jobModuleMock_updateJob = jest.spyOn(
        jobModuleMock,
        "updateJob"
      );

      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            ...bodyRequest,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_customEventEmmiter_publishJob).toHaveBeenCalledTimes(1);
      expect(spy_customEventEmmiter_publishJob).toHaveBeenCalledWith(
        "event_edit_job",
        1,
        {
          job_id: jobId,
          origin: "api-jobs",
        }
      );
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledWith(jobId);

      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledWith(
        bodyRequest,
        jobId
      );

      expect(statusCode).toBe(StatusCodes.OK);
      expect(body).toBeDefined();
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      pgClientMock.getConnection.mockRejectedValueOnce(new Error(message));
      const body = {
        title: "title",
        description: "description",
        location: "location",
      };

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

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_updateJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo de iniciar transação na base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      pgClientMock.beginTransaction.mockRejectedValueOnce(new Error(message));
      const body = {
        title: "title",
        description: "description",
        location: "location",
      };

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

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
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
      };
      jobModuleMock.updateJob.mockRejectedValueOnce(new Error(message));
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

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
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
      const res = await usecase.handler({
        req: {
          params: {
            job_id: "jobId",
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
          },
        },
      } as any);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });

    it(`se parametros "body" não forem inválidos, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            // title: "title",
            // description: "description",
            // location: "location",
          },
        },
      } as any);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });

    it(`se jobId não for localizado na base, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      jobModuleMock.getJobById.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 0,
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
          },
        },
      } as any);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });
  });
});
