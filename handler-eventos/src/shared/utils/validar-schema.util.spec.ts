// import { Schema } from "jtd";
import { validarSchema } from "./validar-schema.util";
import * as crypto from "crypto";

describe("teste de utilidades", () => {
  describe("casos de sucesso", () => {
    it("validação de schema deve ser executada corretamente sem propriedades adicionais", () => {
      const dados = {
        job_id: crypto.randomUUID().toString(),
        // versao: 1,
      };
      const schema = {
        job_id: {
          type: "string",
        },
      };

      const res = validarSchema(dados, schema);
      expect(res).toBeUndefined();
    });

    it("validação de schema deve ser executada corretamente com propriedades adicionais", () => {
      const dados = {
        job_id: crypto.randomUUID().toString(),
        versao: 1,
      };
      const schema = {
        job_id: {
          type: "string",
        },
      };

      const res = validarSchema(dados, schema);
      expect(res).toBeUndefined();
    });
  });

  describe("casos de erros", () => {
    it("deve falhar quando não for permitido propriedades adicionais", () => {
      const dados = {
        job_id: crypto.randomUUID().toString(),
        versao: 1,
      };
      const schema = {
        job_id: {
          type: "string",
        },
      };

      try {
        validarSchema(dados, schema, false);
      } catch (err) {
        expect(err.message).toBe("Schema invalido");
      }
    });
  });
});
