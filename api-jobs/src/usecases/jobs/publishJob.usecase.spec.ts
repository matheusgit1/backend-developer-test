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
  });

  describe(`casos de erros`, () => {
    it(`deve retornar status code ${StatusCodes.UNPROCESSABLE_ENTITY} se job_id for invalido`, async () => {
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
            job_id: "job_id", //uuid inválido
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
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
  });
});
