import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../infrastructure/logger/logger";
import { PublishJobDto } from "../../functions/sqs/events/__dtos__/handlers.dto";
import * as pg from "pg";
import { PgClienteRepository } from "../../infrastructure/database/pg.reposiory";
import { ServiceOpenAI } from "../../infrastructure/services/__dtos__/services.dtos";
import * as AWS from "aws-sdk";
import { FeedJobs } from "../__dtos__/events.dtos";
import { AWSPortDto } from "../../ports/__dtos__/ports.dtos";
import { JobModuleRepository } from "src/modules/__dtos__/modules.dtos";
import { configs } from "../../configs/envs.config";

export class PublishJobEventHandler implements EventHandlerBase<PublishJobDto> {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly jobModule: JobModuleRepository,
    private readonly openAiService: ServiceOpenAI,
    private readonly awsPort: AWSPortDto,
    private readonly logger = new Logger(PublishJobEventHandler.name)
  ) {}

  public async handler(
    event: EventHandlerBaseDto<PublishJobDto>
  ): Promise<void> {
    let conn: pg.PoolClient | undefined = undefined;
    try {
      this.logger.info(
        `[handler] Método sendo processado: `,
        JSON.stringify(event)
      );

      const bucketName = configs.BUCKET_FEED_NAME;
      const key = configs.BUCKET_FEED_FILE_KEY;

      const downloadJsonBucket = {
        Bucket: bucketName,
        Key: key,
      };

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.jobModule.connection = conn;

      const { rowCount, rows } = await this.jobModule.getJob(
        event.payload.job_id
      );
      this.logger.info(`[handler] jobs encontrado: `, JSON.stringify(rows));

      if (rowCount === 0) {
        return;
      }

      const moderations = await Promise.all([
        this.openAiService.validateModeration(rows[0].title),
        this.openAiService.validateModeration(rows[0].description),
      ]);

      for (const { isModerated, reason } of moderations) {
        if (!isModerated) {
          await this.jobModule.updateJobStatus(rows[0].id, "rejected");
          await this.jobModule.updateJoNotes(rows[0].id, reason);
          await this.pgClient.commitTransaction(conn);
          await this.pgClient.end(conn);
          return;
        }
      }

      const jsonInBucket = await this.awsPort.getObjectFroms3(
        downloadJsonBucket
      );

      const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

      rows[0].status = "published";
      rows[0].updated_at = new Date().toString();

      const newJobPublished = {
        ...rows[0],
      };
      jsonContent.feeds.unshift(newJobPublished);

      const newJsonContent = JSON.stringify(jsonContent);

      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: newJsonContent,
      };

      await this.awsPort.uploadObjectToS3(uploadParams);
      await this.jobModule.updateJobStatus(rows[0].id, "published");
      await this.pgClient.commitTransaction(conn);

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      try {
        if (conn) {
          await this.pgClient.rolbackTransaction(conn);
        }
      } catch (error) {
        this.logger.log(`[handler] Erro ao executar rollback`, error);
      }
      this.logger.error("error handler", error);
      this.logger.error(`[handler] - método processado com error: `, error);
    } finally {
      if (conn) {
        await this.pgClient.end(conn);
      }
    }
  }
}
