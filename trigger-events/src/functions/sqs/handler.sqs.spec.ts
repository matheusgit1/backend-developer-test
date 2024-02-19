import * as dotenv from "dotenv";
dotenv.config({
  processEnv: {
    NODE_ENV: "TEST",
  },
});

import { FakeLogger } from "./../../infrastructure/logger/fake-logger";
import { AWSPortMock } from "../../testes/class.mock";
import { OpenAiServiceMock } from "../../testes/class.mock";
import { JobModuleMock } from "../../testes/class.mock";
import { PgClienteMock } from "./../../testes/class.mock";
import { PublishJobEventHandler } from "./../../events/publish_job/index";
import { EventHandlerDictionary } from "./__dtos__/handlers.dto";
import { ListennerFromSQS } from "./handler.sqs";
import { EditJobEventHandler } from "../../events/edit_job";
import { DeleteJobEventHandler } from "../../events/delete_job";
import { genEventPublishJob, genSqsEvents } from "../../testes/testes.util";

const pgClienteMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const openAiServiceMock = new OpenAiServiceMock();
const awsPortMOck = new AWSPortMock();

const eventHandlerDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishJobEventHandler(
    //@ts-ignore,
    pgClienteMock,
    jobModuleMock,
    openAiServiceMock,
    awsPortMOck,
    new FakeLogger(PublishJobEventHandler.name)
  ),
  event_edit_job: new EditJobEventHandler(
    //@ts-ignore,
    pgClienteMock,
    jobModuleMock,
    openAiServiceMock,
    awsPortMOck,
    new FakeLogger(EditJobEventHandler.name)
  ),
  event_delete_job: new DeleteJobEventHandler(
    //@ts-ignore,
    pgClienteMock,
    jobModuleMock,
    awsPortMOck,
    new FakeLogger(DeleteJobEventHandler.name)
  ),
};

const listener = new ListennerFromSQS(eventHandlerDictionary);

describe(`testes para ${ListennerFromSQS.name}`, () => {
  describe("casos de sucessos", () => {
    it("deve executar handler corretamente para os tópicos corretos", async () => {
      const spy_listener_validateStrategy = jest.spyOn(
        listener,
        "validateStrategy"
      );

      const spy_handler_dict = jest.spyOn(
        eventHandlerDictionary["event_publish_job"],
        "handler"
      );

      const events = genEventPublishJob(3);
      const sqsEvent = genSqsEvents(events);
      await listener.handler(sqsEvent);

      expect(spy_handler_dict).toHaveBeenCalledTimes(3);
      expect(spy_listener_validateStrategy).toHaveBeenCalledTimes(
        sqsEvent.Records.length
      );
      expect(spy_listener_validateStrategy).toHaveBeenNthCalledWith(
        1,
        events[0].topico
      );
      expect(spy_listener_validateStrategy).toHaveBeenNthCalledWith(
        2,
        events[1].topico
      );
      expect(spy_listener_validateStrategy).toHaveBeenNthCalledWith(
        3,
        events[2].topico
      );
    });

    it("deve executar handler corretamente, porém topico errado não deve ser processado", async () => {
      const spy_listener_validateStrategy = jest.spyOn(
        listener,
        "validateStrategy"
      );

      const events = [
        {
          topico: "evento_invalido",
          versao: 1,
          payload: {
            jobId: crypto.randomUUID().toString(),
          },
        },
      ];

      const sqsEvent = genSqsEvents(events);

      await listener.handler(sqsEvent);

      expect(spy_listener_validateStrategy).toHaveBeenCalledTimes(
        sqsEvent.Records.length
      );
    });
  });
});
