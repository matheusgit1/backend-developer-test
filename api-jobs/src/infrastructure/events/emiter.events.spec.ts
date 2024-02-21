import { EventEmitter } from "stream";
import { CustomEventEmitter } from "./emiter.events";
import { HandlerEventMock } from "../../tests/mocks";

const emmiter = new EventEmitter();
const handlerEventos = new HandlerEventMock();
const eventEmmiter = new CustomEventEmitter(emmiter, handlerEventos);
describe(`cenários de testes para ${CustomEventEmitter.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucesso", () => {
    it('se evento "job_actions" for disparado, eventhandler deve ser disparado com dados do evento', async () => {
      const spy_handlerEventos_publishEvent = jest.spyOn(
        handlerEventos,
        "publishEvent"
      );

      const dadosEvento = {
        topic: "topico",
        version: 1,
        payload: {},
      };

      eventEmmiter.publishJob(
        dadosEvento.topic,
        dadosEvento.version,
        dadosEvento.payload
      );

      expect(spy_handlerEventos_publishEvent).toHaveBeenCalledTimes(1);
      expect(spy_handlerEventos_publishEvent).toHaveBeenCalledWith(
        dadosEvento.topic,
        dadosEvento.version,
        dadosEvento.payload
      );
    });
  });

  describe("casos de erros", () => {
    it("se o evento não for configurado pelo emissor, ação nenhuma deve ser disparada", () => {
      const spy_handlerEventos_publishEvent = jest.spyOn(
        handlerEventos,
        "publishEvent"
      );

      const dadosEvento = {
        topic: "topico ",
        version: 1,
        payload: {},
      };

      emmiter.emit(
        "evento_invalido",
        dadosEvento.topic,
        dadosEvento.version,
        dadosEvento.payload
      );

      expect(spy_handlerEventos_publishEvent).toHaveBeenCalledTimes(0);
      // expect(spy_handlerEventos_publishEvent).toHaveBeenCalledWith(
      //   dadosEvento.topic,
      //   dadosEvento.version,
      //   dadosEvento.payload
      // );
    });
  });
});
