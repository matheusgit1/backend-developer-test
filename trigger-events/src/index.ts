import { EventHandlerDictionary } from "@functions/sqs/__dtos__/handlers.dto";
import { ListennerFromSQS } from "./functions/sqs/handler.sqs";
import { PublishJobEventHandler } from "./events/publish_job";
import { EditJobEventHandler } from "./events/edit_job";
import { JobModule } from "./modules/jobs/jobs.modules";
import { OpenAiService } from "./infrastructure/services/open-ia.service";
import * as AWS from "aws-sdk";
import { DeleteJobEventHandler } from "./events/delete_job";

const jobModule = new JobModule();
const openAIService = new OpenAiService();
const s3 = new AWS.S3();

const evenstDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishJobEventHandler(jobModule, openAIService, s3),
  event_edit_job: new EditJobEventHandler(jobModule, openAIService, s3),
  event_delete_job: new DeleteJobEventHandler(jobModule, s3),
};

const eventListenner = new ListennerFromSQS(evenstDictionary);

const _eventListenner = eventListenner.handler.bind(eventListenner);

export { _eventListenner };
