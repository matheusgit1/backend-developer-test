import { PgClient } from "./infrastructure/database/cliente/pg.cliente";
import { EventHandlerDictionary } from "@functions/sqs/__dtos__/handlers.dto";
import { ListennerFromSQS } from "./functions/sqs/handler.sqs";
import { PublishJobEventHandler } from "./events/publish_job";
import { EditJobEventHandler } from "./events/edit_job";
import { JobModule } from "./modules/jobs/jobs.modules";
import { OpenAiService } from "./infrastructure/services/open-ia.service";
import * as AWS from "aws-sdk";

const pgClient = new PgClient();
const jobModule = new JobModule();
const openAIService = new OpenAiService();
const s3 = new AWS.S3();

const evenstDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishJobEventHandler(
    // pgClient,
    jobModule,
    openAIService,
    s3
  ),
  event_edit_job: new EditJobEventHandler(
    // pgClient,
    jobModule,
    openAIService,
    s3
  ),
};

const eventListenner = new ListennerFromSQS(evenstDictionary);

const _eventListenner = eventListenner.handler.bind(eventListenner);

export { _eventListenner };
