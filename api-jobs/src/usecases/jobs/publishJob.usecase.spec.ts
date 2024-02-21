import { queryresults } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import {
  CustomEventEmitterMock,
  JobModuleMock,
  PgClienteMock,
} from "../../tests/mocks";
import { PublishJobUseCase } from "./publishJob.usecase";

const pgClientMock = new PgClienteMock();
const customEventEmmiter = new CustomEventEmitterMock();
const jobModuleMock = new JobModuleMock();
const usecase = new PublishJobUseCase(
  pgClientMock,
  jobModuleMock,
  customEventEmmiter
);
const companyId = crypto.randomUUID().toString();

describe(`executando testes para ${PublishJobUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code ${StatusCodes.ACCEPTED}`, async () => {
      jobModuleMock.getJobById.mockResolvedValue({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            status: "draft",
            id: "id",
          },
        ],
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: crypto.randomUUID().toString(),
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.ACCEPTED);
    });

    it(`deve retornar status code ${StatusCodes.ACCEPTED}`, async () => {
      jobModuleMock.getJobById.mockResolvedValue({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            status: "draft",
            id: "id",
          },
        ],
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: crypto.randomUUID().toString(),
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.ACCEPTED);
    });
  });

  describe(`casos de erros`, () => {
    it(`deve retornar status code ${StatusCodes.OK} se job_ já possuir status 'published'`, async () => {
      jobModuleMock.getJobById.mockResolvedValue({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            status: "published",
            id: "id",
          },
        ],
      });

      const res = await usecase.handler({
        req: {
          params: {
            job_id: crypto.randomUUID(), //uuid inválido
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it(`deve retornar status code ${StatusCodes.UNPROCESSABLE_ENTITY} se job_id não for encontrado na base`, async () => {
      jobModuleMock.getJobById.mockResolvedValue({
        ...queryresults,
        rowCount: 0,
      });
      const res = await usecase.handler({
        req: {
          params: {
            job_id: crypto.randomUUID().toString(), //uuid inválido
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it(`se alguma ação na base falhar, deve retornar statuCode ${StatusCodes.INTERNAL_SERVER_ERROR} e executar roolback e release`, async () => {
      jobModuleMock.getJobById.mockRejectedValueOnce(new Error());
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

      const res = await usecase.handler({
        req: {
          params: {
            job_id: crypto.randomUUID(),
          },
        },
      } as any);
      console.log(res);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);

      expect(spy_jobModuleMock_getJobById).toHaveBeenCalledTimes(1);
    });

    it(`deve retornar status code ${StatusCodes.UNPROCESSABLE_ENTITY} se job_id for inválido`, async () => {
      const res = await usecase.handler({
        req: {
          params: {
            job_id: "job_id",
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });
});
