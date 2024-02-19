import { PgClient } from "./infrastructure/database/cliente/pg.cliente";
import { EventHandlerDictionary } from "@functions/sqs/events/__dtos__/handlers.dto";
import { ListennerFromSQS } from "./functions/sqs/events/event-handler.sqs";
import { PublishJobEventHandler } from "./events/publish_job";
import { EditJobEventHandler } from "./events/edit_job";
import { JobModule } from "./modules/jobs/jobs.modules";
import { OpenAiService } from "./infrastructure/services/open-ia.service";
import { DeleteJobEventHandler } from "./events/delete_job";
import { AWSPort } from "./ports/aws/aws.port";
import { TriggerFeedJobsByEventbridge } from "@functions/eventbridge/jobs/jobs-handler.eventbridge";
import * as AWS from "aws-sdk";

const pgCLiente = new PgClient();
const jobModule = new JobModule();
const openAIService = new OpenAiService();
const portAWS = new AWSPort(new AWS.S3());

const evenstDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishJobEventHandler(
    pgCLiente,
    jobModule,
    openAIService,
    portAWS
  ),
  event_edit_job: new EditJobEventHandler(
    pgCLiente,
    jobModule,
    openAIService,
    portAWS
  ),
  event_delete_job: new DeleteJobEventHandler(pgCLiente, jobModule, portAWS),
};

const eventListenner = new ListennerFromSQS(evenstDictionary);

const _eventListenner = eventListenner.handler.bind(eventListenner);

const triggerUpdateFeedJobseventBridge = new TriggerFeedJobsByEventbridge(
  portAWS
);

const _triggerUpdateFeedJobseventBridge =
  triggerUpdateFeedJobseventBridge.handler.bind(
    triggerUpdateFeedJobseventBridge
  );

export { _eventListenner, _triggerUpdateFeedJobseventBridge };
