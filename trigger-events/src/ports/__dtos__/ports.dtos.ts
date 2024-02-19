import { GetObjectOutput } from "@aws-sdk/client-s3";
import * as AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

export declare class AWSPortDto {
  constructor(...args: any[]);
  getObjectFroms3(
    downloadParams: AWS.S3.GetObjectRequest
  ): Promise<PromiseResult<GetObjectOutput, AWS.AWSError>>;

  uploadObjectToS3(
    uploadParams: AWS.S3.PutObjectRequest
  ): Promise<AWS.S3.ManagedUpload.SendData>;
}
