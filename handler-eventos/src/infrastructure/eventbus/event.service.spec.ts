import { DynamoServiceMock, SnsProxyMock } from "../../tests/tests.mock";
import { EventBus } from "./event.service";
import * as crypto from "crypto";

const snsProxyMock = new SnsProxyMock();
const dynamoService = new DynamoServiceMock();
const eventBus = new EventBus(snsProxyMock, dynamoService);

describe(`testes para ${EventBus.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucesso", () => {
    it('metodo "publicar" deve ser executado corretamente', async () => {
      const dados = {
        topico: "topico",
        versao: 1,
        payload: {
          atribute: "string",
        },
      };
      dynamoService.consultarTopico.mockResolvedValueOnce({
        topico: "topico",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          atribute: {
            type: "string",
          },
        },
      });

      const res = await eventBus.publicar(dados);

      expect(res).toBeTruthy();
      expect(res).toEqual("messageID");
    });
  });

  describe("casos de erros", () => {
    it('metodo "publicar" deve falhar se evento for inválido', async () => {
      const dados = {
        payload: {
          atribute: "string",
        },
      };

      try {
        await eventBus.publicar(dados as any);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual("Schema invalido");
      }
    });

    it('metodo "publicar" deve falhar se consulta de tópico falhe', async () => {
      dynamoService.consultarTopico.mockRejectedValueOnce(new Error());
      const dados = {
        topico: "topico",
        versao: 1,
        payload: {
          atribute: "string",
        },
      };

      try {
        await eventBus.publicar(dados);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it('metodo "publicar" deve falhar se topico consultado não for encontrado', async () => {
      dynamoService.consultarTopico.mockResolvedValueOnce(undefined);
      const dados = {
        topico: "topico",
        versao: 1,
        payload: {
          atribute: "string",
        },
      };

      try {
        await eventBus.publicar(dados);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual("Tipo de evento não encontrado");
      }
    });

    it('metodo "publicar" deve falhar se schemas não baterem', async () => {
      const dados = {
        topico: "topico",
        versao: 1,
        payload: {
          atribute: "string",
        },
      };
      dynamoService.consultarTopico.mockResolvedValueOnce({
        topico: "topico",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          atributeChanged: {
            type: "string",
          },
        },
      });

      try {
        await eventBus.publicar(dados);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual("Schema invalido");
      }
    });

    it('metodo "publicar" deve falhar se publicação no tópico sns falhar', async () => {
      snsProxyMock.publicar.mockRejectedValueOnce(new Error());
      const dados = {
        topico: "topico",
        versao: 1,
        payload: {
          atribute: "string",
        },
      };
      dynamoService.consultarTopico.mockResolvedValueOnce({
        topico: "topico",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          atributeChanged: {
            type: "string",
          },
        },
      });

      try {
        await eventBus.publicar(dados);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
