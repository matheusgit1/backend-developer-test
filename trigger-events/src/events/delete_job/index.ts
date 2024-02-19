import { PgClient } from "./../../infrastructure/database/cliente/pg.cliente";
import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../infrastructure/logger/logger";
import { DeleteJobDto } from "../../functions/sqs/__dtos__/handlers.dto";
import * as pg from "pg";
import * as AWS from "aws-sdk";
import { FeedJobs } from "../__dtos__/events.dtos";
import { PgClienteRepository } from "../../infrastructure/database/pg.reposiory";
import { AWSPortDto } from "../../ports/__dtos__/ports.dtos";
import { JobModuleRepository } from "../../modules/__dtos__/modules.dtos";

export class DeleteJobEventHandler implements EventHandlerBase<DeleteJobDto> {
  pgClient: PgClienteRepository;
  constructor(
    private readonly jobModule: JobModuleRepository,
    private readonly awsPort: AWSPortDto,
    private readonly logger = new Logger(DeleteJobEventHandler.name)
  ) {
    this.pgClient = new PgClient();
  }

  public async handler(
    event: EventHandlerBaseDto<DeleteJobDto>
  ): Promise<void> {
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

      const jsonInBucket = await this.awsPort.getObjectFroms3(downloadParams);
      const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

      const feeds = jsonContent.feeds.filter(
        (_item) => _item.id !== event.payload.job_id
      );
      const newJsonContent = {
        feeds: feeds,
      };

      conn = await this.pgClient.getConnection();
      await this.pgClient.beginTransaction(conn);
      this.jobModule.connection = conn;

      await this.jobModule.deleteJob(event.payload.job_id);

      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(newJsonContent),
      };

      await this.awsPort.uploadObjectToS3(uploadParams);

      this.logger.info(
        `[handler] feed atualizado ${event.payload.job_id} removido do feed`
      );

      await this.pgClient.commitTransaction(conn);

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      if (conn) {
        await this.pgClient.rolbackTransaction(conn);
      }
      console.error(error);
      this.logger.error(`[handler] - método processado com error: `, error);
    } finally {
      if (conn) {
        await this.pgClient.end(conn);
      }
    }
  }
}
