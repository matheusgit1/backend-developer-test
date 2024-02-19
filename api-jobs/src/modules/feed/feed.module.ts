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
      Key: configs.BUCKET_FEED_CLIENT_FILE_KEY,
    });

    const feed = await jsonInBucket.Body.transformToString();

    const jsonContent: FeedJobs = await JSON.parse(feed);
    return jsonContent;
  }
}
