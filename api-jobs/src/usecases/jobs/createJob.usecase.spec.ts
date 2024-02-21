import { StatusCodes } from "http-status-codes";
import { JobModuleMock, PgClienteMock } from "../../tests/mocks";
import { CreateJobUseCase } from "./createJob.usecase";

const pgClientMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const usecase = new CreateJobUseCase(pgClientMock, jobModuleMock);
const companyId = crypto.randomUUID().toString();

describe(`executando testes para ${CreateJobUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code 201`, async () => {
      const res = await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
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
      expect(res.statusCode).toBe(201);
    });

    it(`deve executar ações na base corretamente`, async () => {
      const bodyJob = {
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

      const spy_jobModuleMock_createJob = jest.spyOn(
        jobModuleMock,
        "createJob"
      );

      await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
          },
          body: { ...bodyJob },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledWith({
        ...bodyJob,
        companyId: companyId,
      });
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

      const spy_jobModuleMock_createJob = jest.spyOn(
        jobModuleMock,
        "createJob"
      );

      const res = await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(0);

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

      const spy_jobModuleMock_createJob = jest.spyOn(
        jobModuleMock,
        "createJob"
      );

      const res = await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(0);

      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it("se metodo criar job falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const bodyJob = {
        title: "title",
        description: "description",
        location: "location",
      };
      const message = "erro mockado";
      jobModuleMock.createJob.mockRejectedValueOnce(new Error(message));
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

      const spy_jobModuleMock_createJob = jest.spyOn(
        jobModuleMock,
        "createJob"
      );

      const res = await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
          },
          body: {
            title: "title",
            description: "description",
            location: "location",
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(1);

      expect(spy_jobModuleMock_createJob).toHaveBeenCalledWith({
        ...bodyJob,
        companyId: companyId,
      });

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it(`se parametros "body" forem inválidos, deve retornar ${StatusCodes.BAD_REQUEST}`, async () => {
      const message = "erro mockado";
      const bodyJob = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };

      jobModuleMock.createJob.mockRejectedValueOnce(new Error(message));
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

      const spy_jobModuleMock_createJob = jest.spyOn(
        jobModuleMock,
        "createJob"
      );

      const res = await usecase.handler({
        req: {
          headers: {
            company_id: companyId,
          },
          body: {
            // ...bodyJob
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_jobModuleMock_createJob).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toHaveProperty("error");
    });

    it(`se company_id " for inválido, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      const bodyJob = {
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
      };

      const res = await usecase.handler({
        req: {
          headers: {
            company_id: "companyId", //uuid inválido
          },
          body: {
            ...bodyJob,
          },
        },
      } as any);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });
  });
});
