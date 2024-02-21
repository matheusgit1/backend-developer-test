import { Company } from "../__dtos__/entities.dtos";
import { CompanyEntity } from "./company.entity";

describe(`cenários para ${CompanyEntity.name}`, () => {
  describe("casos de sucessos", () => {
    it("propriadas criadas devem ser retornadas", () => {
      const dados: Company = {
        name: "name",
        id: "id",
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
      };
      const entity = new CompanyEntity({ ...dados });
      expect(entity.name).toEqual(dados.name);
      expect(entity.id).toEqual(dados.id);
      expect(entity.created_at).toEqual(dados.created_at);
      expect(entity.updated_at).toEqual(dados.updated_at);
      expect(entity.getProps()).toEqual(dados);
      expect(entity.isValidEntity()).toBeTruthy();
    });

    it("se dados de entrada não for passado, entity deve ser invalida", () => {
      const entity = new CompanyEntity();
      expect(entity.isValidEntity()).toBeFalsy();
    });
  });
});
