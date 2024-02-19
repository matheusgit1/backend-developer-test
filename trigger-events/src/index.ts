import { EventHandlerDictionary } from "@functions/sqs/__dtos__/handlers.dto";
import { ListennerFromSQS } from "./functions/sqs/handler.sqs";
import { PublishJobEventHandler } from "./events/publish_job";
import { EditJobEventHandler } from "./events/edit_job";
import { JobModule } from "./modules/jobs/jobs.modules";
import { OpenAiService } from "./infrastructure/services/open-ia.service";
import { DeleteJobEventHandler } from "./events/delete_job";
import { AWSPort } from "./ports/aws/aws.port";
import { PgClient } from "./infrastructure/database/cliente/pg.cliente";

const pgClient = new PgClient();
const jobModule = new JobModule();
const openAIService = new OpenAiService();
const portAWS = new AWSPort();

const evenstDictionary: EventHandlerDictionary = {
  event_publish_job: new PublishJobEventHandler(
    jobModule,
    openAIService,
    portAWS
  ),
  event_edit_job: new EditJobEventHandler(jobModule, openAIService, portAWS),
  event_delete_job: new DeleteJobEventHandler(jobModule, portAWS),
};

const eventListenner = new ListennerFromSQS(evenstDictionary);

const _eventListenner = eventListenner.handler.bind(eventListenner);

export { _eventListenner };
