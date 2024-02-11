import { mockRequest, mockResponse } from "../../tests/mocks";
import { HealthUseCase } from ".";

const healthUseCase = new HealthUseCase();

describe(`cenarios de testes para ${HealthUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucesso", () => {
    test(`deve executar metodo getHealth com sucesso`, async () => {
      const res = await healthUseCase.getHealth(mockRequest, mockResponse);
      expect(res).toBeDefined();
      expect(res).toHaveProperty("status");
      expect(res).toHaveProperty("moment");
    });
  });
});
