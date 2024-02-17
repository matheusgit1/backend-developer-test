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
    it(`deve retornar status code ${StatusCodes.NOT_IMPLEMENTED}`, async () => {
      const res = await usecase.handler({
        req: {},
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(StatusCodes.NOT_IMPLEMENTED);
    });
  });
});
