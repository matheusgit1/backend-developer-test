import { queryresults } from "./../../@autocannon/server/routes";
import {
  CustomEventEmitterMock,
  JobModuleMock,
  PgClienteMock,
} from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { DeleteJobUseCase } from "./deleteJob.usecase";
import { JobEntity } from "../../entities/job/job.entity";

const pgClientMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const customEventEmmiter = new CustomEventEmitterMock();

const usecase = new DeleteJobUseCase(
  pgClientMock,
  jobModuleMock,
  customEventEmmiter
);
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
    it(`deve retornar status code ${StatusCodes.ACCEPTED} se executado com sucesso`, async () => {
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

      await usecase.handler({
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
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);
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

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

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

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });

    it(`se job_id informado nos params for inválido, deve retornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
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

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });

    it(`se entidade não dor retornada pelo modulo job, usecase deve reotornar ${StatusCodes.UNPROCESSABLE_ENTITY}`, async () => {
      jobModuleMock.getJobById.mockResolvedValueOnce(new JobEntity());
      const res = await usecase.handler({
        req: {
          params: {
            job_id: jobId,
          },
          headers: {
            company_id: companyId,
          },
        },
      } as any);

      expect(res.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty("error");
    });
  });
});
