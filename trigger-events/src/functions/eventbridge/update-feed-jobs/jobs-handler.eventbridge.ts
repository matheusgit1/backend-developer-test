import { Logger } from "../../../infrastructure/logger/logger";
import { configs } from "../../../configs/envs.config";
import { FeedJobs } from "../../../events/__dtos__/events.dtos";
import { AWSPortDto } from "../../../ports/__dtos__/ports.dtos";

export class TriggerFeedJobsByEventbridge {
  constructor(
    private readonly awsPort: AWSPortDto,
    private readonly logger: Logger = new Logger(
      TriggerFeedJobsByEventbridge.name
    )
  ) {}
  async handler(): Promise<void> {
    try {
      this.logger.log(`[handler] - processo iniciado`);
      const bucketName = configs.BUCKET_FEED_NAME;
      const serviceBucketKey = configs.BUCKET_FEED_FILE_KEY;

      const clientBucketKey = configs.BUCKET_FEED_CLIENT_FILE_KEY;

      const downloadParams = {
        Bucket: bucketName,
        Key: serviceBucketKey,
      };

      const jsonInBucket = await this.awsPort.getObjectFroms3(downloadParams);
      const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

      const uploadParams = {
        Bucket: bucketName,
        Key: clientBucketKey,
        Body: JSON.stringify(jsonContent),
      };

      await this.awsPort.uploadObjectToS3(uploadParams);
      this.logger.log(`[handler] - metodo processado com exito`);
    } catch (e) {
      this.logger.error(
        `[handler] - metodo processado com erro`,
        JSON.stringify(e)
      );
    }
  }
}
