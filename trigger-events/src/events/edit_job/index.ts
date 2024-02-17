import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../infrastructure/logger/logger";
import { EditJobDto } from "../../functions/sqs/__dtos__/handlers.dto";
import * as pg from "pg";
import { JobModuleRepository } from "../../modules/jobs/jobs.repository";
import { PgClienteRepository } from "../../infrastructure/database/pg.reposiory";
import { ServiceOpenAI } from "../../infrastructure/services/__dtos__/services.dtos";
import * as AWS from "aws-sdk";
import { PgClient } from "../../infrastructure/database/cliente/pg.cliente";
import { FeedJobs } from "../__dtos__/events.dtos";

export class EditJobEventHandler implements EventHandlerBase<EditJobDto> {
  pgClient: PgClienteRepository;
  constructor(
    // private readonly pgClient: PgClienteRepository,
    private readonly jobModule: JobModuleRepository,
    private readonly openAiService: ServiceOpenAI,
    private readonly s3: AWS.S3,
    private readonly logger = new Logger(EditJobEventHandler.name)
  ) {
    this.pgClient = new PgClient();
  }

  public async handler(event: EventHandlerBaseDto<EditJobDto>): Promise<void> {
    let conn: pg.PoolClient | undefined = undefined;
    try {
      this.logger.info(
        `[handler] Método sendo processado: `,
        JSON.stringify(event)
      );

      const bucketName = "global-feeds";
      const key = "jobs/feed.json";

      const downloadParams = {
        Bucket: bucketName,
        Key: key,
      };

      const conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);

      const job = await this.jobModule.getJob(conn, event.payload.job_id);
      this.logger.info(`[handler] jobs encontrado: `, JSON.stringify(job));

      const [
        isModeratedTitle,
        isModeratedDescription,
        isModeratedNotes,
        isModeratedlocation,
      ] = await Promise.all([
        this.openAiService.validateModeration(job.title),
        this.openAiService.validateModeration(job.description),
        this.openAiService.validateModeration(job.notes),
        this.openAiService.validateModeration(job.location),
      ]);

      this.logger.info(
        isModeratedTitle,
        isModeratedDescription,
        isModeratedNotes,
        isModeratedlocation
      );

      if (
        !isModeratedTitle ||
        !isModeratedDescription ||
        !isModeratedNotes ||
        !isModeratedlocation
      ) {
        await this.jobModule.updateJobStatus(conn, job.id, "rejected");
        const jsonInBucket = await this.s3.getObject(downloadParams).promise();
        const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());
        console.log("json content: ", jsonContent, typeof jsonContent);
        const feeds = jsonContent.feeds.filter((_item) => _item.id !== job.id);
        const newJsonContent = {
          feeds: feeds,
        };

        console.log("new json content: ", newJsonContent);

        // const updatedJsonContent = JSON.stringify(newJsonContent);

        // console.log(updatedJsonContent);

        const uploadParams = {
          Bucket: bucketName,
          Key: key,
          Body: JSON.stringify(newJsonContent),
        };

        await this.s3.upload(uploadParams).promise();

        await this.pgClient.commitTransaction(conn);

        this.logger.info("[handler] status job atualizado (rejected)");
      }

      await this.pgClient.end(conn);

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      try {
        if (conn) {
          await this.pgClient.rolbackTransaction(conn);
          await this.pgClient.end(conn);
        }
      } catch (error) {
        this.logger.log(`[handler] Erro ao executar rollback`, error);
      }
      this.logger.error(`[handler] - método processado com error: `, error);
      throw error;
    }
  }
}
