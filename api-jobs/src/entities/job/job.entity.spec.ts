import { Job } from "../__dtos__/entities.dtos";
import { JobEntity } from "./job.entity";

describe(`cenários para ${JobEntity.name}`, () => {
  describe("casos de sucessos", () => {
    it("propriadas criadas devem ser retornadas", () => {
      const dados: Job = {
        id: "id",
        company_id: "company_id",
        title: "title",
        description: "description",
        location: "location",
        notes: "notes",
        status: "draft",
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
      };
      const entity = new JobEntity({ ...dados });
      expect(entity.id).toEqual(dados.id);
      expect(entity.company_id).toEqual(dados.company_id);
      expect(entity.title).toEqual(dados.title);
      expect(entity.description).toEqual(dados.description);
      expect(entity.location).toEqual(dados.location);
      expect(entity.notes).toEqual(dados.notes);
      expect(entity.status).toEqual(dados.status);
      expect(entity.created_at).toEqual(dados.created_at);
      expect(entity.updated_at).toEqual(dados.updated_at);
      expect(entity.getProps()).toEqual(dados);
      expect(entity.isValidEntity()).toBeTruthy();
    });

    it("se dados de entrada não for passado, entity deve ser invalida", () => {
      const entity = new JobEntity();
      expect(entity.isValidEntity()).toBeFalsy();
    });
  });
});
