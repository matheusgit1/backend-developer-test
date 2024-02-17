import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../infrastructure/logger/logger";
import { PublishJobDto } from "../../functions/sqs/__dtos__/handlers.dto";
import * as pg from "pg";
import {
  JobModuleRepository,
  JobProperties,
} from "../../modules/jobs/jobs.repository";
import { PgClienteRepository } from "../../infrastructure/database/pg.reposiory";
import { ServiceOpenAI } from "../../infrastructure/services/__dtos__/services.dtos";
import * as AWS from "aws-sdk";
import { PgClient } from "../../infrastructure/database/cliente/pg.cliente";
import { FeedJobs } from "../__dtos__/events.dtos";

export class PublishJobEventHandler implements EventHandlerBase<PublishJobDto> {
  pgClient: PgClienteRepository;
  constructor(
    // private readonly pgClient: PgClienteRepository,
    private readonly jobModule: JobModuleRepository,
    private readonly openAiService: ServiceOpenAI,
    private readonly s3: AWS.S3,
    private readonly logger = new Logger(PublishJobEventHandler.name)
  ) {
    this.pgClient = new PgClient();
  }

  public async handler(
    event: EventHandlerBaseDto<PublishJobDto>
  ): Promise<void> {
    let conn: pg.PoolClient | undefined = undefined;
    try {
      this.logger.info(
        `[handler] Método sendo processado: `,
        JSON.stringify(event)
      );

      const bucketName = "global-feeds";
      const key = "jobs/feed.json";

      const downloadJsonBucket = {
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
        await this.pgClient.commitTransaction(conn);
        await this.pgClient.end(conn);
        this.logger.info("[handler] status job atualizado (rejected)");
        return;
      }

      const jsonInBucket = await this.s3
        .getObject(downloadJsonBucket)
        .promise();

      const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

      job.status = "published";
      job.updated_at = new Date();

      const newJobPublished = {
        ...job,
      };
      jsonContent.feeds.unshift(newJobPublished);

      const newJsonContent = JSON.stringify(jsonContent);

      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: newJsonContent,
      };

      await this.s3.upload(uploadParams).promise();
      await this.jobModule.updateJobStatus(conn, job.id, "published");
      await this.pgClient.commitTransaction(conn);
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
