import { configs } from "../../configs/envs/environments.config";
import { FeedJobs, FeedModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";
import { AWSPortDto } from "../../ports/__dtos__/ports.dtos";

export class FeedModule extends BaseModule implements FeedModuleRepository {
  constructor(private readonly awsPort: AWSPortDto) {
    super(FeedModule.name);
  }
  async getFeed(): Promise<FeedJobs> {
    const jsonInBucket = await this.awsPort.getObjectFroms3({
      Bucket: configs.BUCKET_FEED_NAME,
      Key: configs.BUCKET_FEED_FILE_KEY,
    });

    const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());
    return jsonContent;
  }
}
