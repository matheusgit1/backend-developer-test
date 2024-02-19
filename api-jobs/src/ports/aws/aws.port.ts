import * as AWS from "aws-sdk";
import { AWSPortDto } from "../__dtos__/ports.dtos";

export class AWSPort implements AWSPortDto {
  constructor(private readonly s3: AWS.S3) {}
  async getObjectFroms3(downloadParams: AWS.S3.GetObjectRequest): Promise<any> {
    return await this.s3.getObject(downloadParams).promise();
  }

  async uploadObjectToS3(
    uploadParams: AWS.S3.PutObjectRequest
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    return await this.s3.upload(uploadParams).promise();
  }
}
