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

      const entitie = await this.jobModule.getJob(event.payload.job_id);
      this.logger.info(
        `[handler] jobs encontrado: `,
        JSON.stringify(entitie.getProps())
      );

      if (!entitie.isValidEntity()) {
        return;
      }

      const moderations = await Promise.all([
        this.openAiService.validateModeration(entitie.title),
        this.openAiService.validateModeration(entitie.description),
      ]);

      for (const { isModerated, reason } of moderations) {
        if (!isModerated) {
          await this.jobModule.updateJobStatus(entitie.id, "rejected");
          await this.jobModule.updateJoNotes(entitie.id, reason);
          await this.pgClient.commitTransaction(conn);
          return;
        }
      }

      const jsonInBucket = await this.awsPort.getObjectFroms3(
        downloadJsonBucket
      );

      const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

      entitie.status = "published";
      entitie.updated_at = new Date().toString();

      const newJobPublished = {
        ...entitie.getProps(),
      };
      jsonContent.feeds.unshift(newJobPublished);

      const newJsonContent = JSON.stringify(jsonContent);

      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: newJsonContent,
      };

      await this.awsPort.uploadObjectToS3(uploadParams);
      await this.jobModule.updateJobStatus(entitie.id, "published");
      await this.pgClient.commitTransaction(conn);

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }
      this.logger.error(
        `[handler] - método processado com error: `,
        JSON.stringify(error)
      );
    } finally {
      if (conn) {
        await this.pgClient.end(conn);
      }
    }
  }
}
