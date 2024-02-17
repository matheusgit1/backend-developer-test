import * as dotenv from "dotenv";
dotenv.config();
dotenv.configDotenv({
  processEnv: {
    NODE_ENV: "TEST",
  },
});

import { ListennerFromSQS } from "./handler.sqs";
import { mockEvenstDictionary } from "../../testes/class.mock";
import { genEventPublishJob, genSqsEvents } from "../../testes/testes.util";
import { EventReceived } from "./__dtos__/handlers.dto";

import { FakeLogger } from "../../infrastructure/logger/fake-logger";

const fakelogger = new FakeLogger(ListennerFromSQS.name);
const listennerFromSQS = new ListennerFromSQS(mockEvenstDictionary, fakelogger);

jest.useRealTimers();

describe("executando testes do ouvinte sqs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("executando casos de sucesso", () => {
    const spy_listennerFromSQS_validateStrategy = jest.spyOn(
      listennerFromSQS,
      "validateStrategy"
    );
    it("deve executar evento de publicação de job corretamente para 1 unico evento", async () => {
      const publishJobevent = genEventPublishJob(1);
      const res = await listennerFromSQS.handler(genSqsEvents(publishJobevent));
      const spy_mockEvenstDictionary = jest.spyOn(
        mockEvenstDictionary[publishJobevent[0].topico],
        "handler"
      );
      expect(res).toBeUndefined();
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenCalledTimes(1);
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenLastCalledWith(
        publishJobevent[0].topico
      );
      expect(spy_mockEvenstDictionary).toHaveBeenCalledTimes(1);
    });

    it("deve executar evento de publicação de job corretamente para varios eventos", async () => {
      const numEvents = 100;
      const publishJobevent = genEventPublishJob(numEvents);
      const res = await listennerFromSQS.handler(genSqsEvents(publishJobevent));
      const spy_mockEvenstDictionary = jest.spyOn(
        mockEvenstDictionary[publishJobevent[0].topico],
        "handler"
      );
      expect(res).toBeUndefined();
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenCalledTimes(
        numEvents
      );
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenLastCalledWith(
        publishJobevent[0].topico
      );
      expect(spy_mockEvenstDictionary).toHaveBeenCalledTimes(
        publishJobevent.length
      );
    });
  });
  describe("executando casos de erros", () => {
    const spy_listennerFromSQS_validateStrategy = jest.spyOn(
      listennerFromSQS,
      "validateStrategy"
    );
    it("deve ignorar evento caso tópico não esteja elencado nas estratégias", async () => {
      const event: Array<EventReceived<any>> = [
        {
          topico: "topico-invalido" as any,
          versao: 1,
          payload: {
            key: "wrongkey",
          },
        },
      ];
      const res = await listennerFromSQS.handler(genSqsEvents(event));
      expect(res).toBeUndefined();
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenCalledTimes(1);
      expect(spy_listennerFromSQS_validateStrategy).toHaveBeenLastCalledWith(
        event[0].topico
      );
      expect(spy_listennerFromSQS_validateStrategy).toHaveReturnedWith(false);
    });
  });
});
