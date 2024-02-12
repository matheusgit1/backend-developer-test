import { GetHealthUseCase } from "./gethealth.usecase";

const usecase = new GetHealthUseCase();

describe(`executando testes para ${GetHealthUseCase.name}`, () => {
  describe(`casos de sucesso`, () => {
    it(`deve retornar staus e momento da chamado`, async () => {
      const res = await usecase.handler();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("moment");
    });
  });
});
