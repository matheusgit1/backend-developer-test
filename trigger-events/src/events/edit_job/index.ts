import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../infrastructure/logger/logger";
import { EditJobDto } from "../../functions/sqs/events/__dtos__/handlers.dto";
import * as pg from "pg";
import { PgClienteRepository } from "../../infrastructure/database/pg.reposiory";
import { ServiceOpenAI } from "../../infrastructure/services/__dtos__/services.dtos";
import * as AWS from "aws-sdk";
import { PgClient } from "../../infrastructure/database/cliente/pg.cliente";
import { FeedJobs } from "../__dtos__/events.dtos";
import { AWSPortDto } from "../../ports/__dtos__/ports.dtos";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { configs } from "../../configs/envs.config";

export class EditJobEventHandler implements EventHandlerBase<EditJobDto> {
  constructor(
    private readonly pgClient: PgClienteRepository,
    private readonly jobModule: JobModuleRepository,
    private readonly openAiService: ServiceOpenAI,
    private readonly awsPort: AWSPortDto,
    private readonly logger = new Logger(EditJobEventHandler.name)
  ) {}

  public async handler(event: EventHandlerBaseDto<EditJobDto>): Promise<void> {
    let conn: pg.PoolClient | undefined = undefined;
    try {
      this.logger.info(
        `[handler] Método sendo processado: `,
        JSON.stringify(event)
      );

      const bucketName = configs.BUCKET_FEED_NAME;
      const key = configs.BUCKET_FEED_FILE_KEY;

      const downloadParams = {
        Bucket: bucketName,
        Key: key,
      };

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.jobModule.connection = conn;

      const { rows } = await this.jobModule.getJob(event.payload.job_id);
      this.logger.info(`[handler] jobs encontrado: `, JSON.stringify(rows));

      const moderations = await Promise.all([
        this.openAiService.validateModeration(rows[0].title),
        this.openAiService.validateModeration(rows[0].description),
      ]);

      this.logger.info(
        `[handler] moderações: `,
        JSON.stringify({
          moderations: moderations,
        })
      );

      for (const { isModerated, reason } of moderations) {
        if (!isModerated) {
          await this.jobModule.updateJobStatus(rows[0].id, "rejected");
          await this.jobModule.updateJoNotes(rows[0].id, reason);
          const jsonInBucket = await this.awsPort.getObjectFroms3(
            downloadParams
          );
          const jsonContent: FeedJobs = JSON.parse(
            jsonInBucket.Body.toString()
          );

          const feeds = jsonContent.feeds.filter(
            (_item) => _item.id !== rows[0].id
          );
          const newJsonContent = {
            feeds: feeds,
          };

          const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(newJsonContent),
          };

          await this.awsPort.uploadObjectToS3(uploadParams);

          await this.pgClient.commitTransaction(conn);

          this.logger.info("[handler] status job atualizado (rejected)");
        }
      }

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }
      this.logger.error("error handler", error);
    } finally {
      if (conn) {
        await this.pgClient.end(conn);
      }
    }
  }
}
