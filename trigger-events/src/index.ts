import {
  EventHandlerDictionary,
  ListennerFromSQSDeclarations,
} from "@functions/sqs/dtos/handlers.dto";
import { ListennerFromSQS } from "./functions/sqs/handler.sqs";
import { PublishEventHandler } from "./infrastructure/events/publish_job";

const evenstDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishEventHandler(),
};

const setup = (): ListennerFromSQSDeclarations => {
  const praparations = new ListennerFromSQS(evenstDictionary);
  return praparations.handler.bind(eventListenner);
};

const eventListenner = setup();
const _eventListenner = eventListenner.handler.bind(eventListenner);

export { _eventListenner };
