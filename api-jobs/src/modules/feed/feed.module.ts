import { configs } from "../../configs/envs/environments.config";
import { PgCliente } from "../../infrastructure/database/client/database.repository";
import { FeedJobs, FeedModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";
import * as AWS from "aws-sdk";

export class FeedModule extends BaseModule implements FeedModuleRepository {
  s3: AWS.S3;
  constructor() {
    super(new PgCliente());

    this.s3 = new AWS.S3({
      region: configs.AWS_DEFAULT_REGION,
      credentials: {
        secretAccessKey: configs.AWS_SECRET_ACCESS_KEY,
        accessKeyId: configs.AWS_ACCESS_KEY_ID,
      },
    });
  }
  async getFeed(): Promise<any> {
    const bucketName = "global-feeds";
    const key = "jobs/feed.json";

    const downloadJsonBucket = {
      Bucket: bucketName,
      Key: key,
    };

    const jsonInBucket = await this.s3.getObject(downloadJsonBucket).promise();

    const jsonContent: FeedJobs = JSON.parse(jsonInBucket.Body.toString());

    return jsonContent;
  }
}
