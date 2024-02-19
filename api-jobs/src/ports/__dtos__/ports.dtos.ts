import {
  GetObjectCommandInput,
  GetObjectCommandOutput,
  UploadPartCommandInput,
  UploadPartCommandOutput,
} from "@aws-sdk/client-s3";

export declare class AWSPortDto {
  constructor(...args: any[]);
  getObjectFroms3(
    downloadParams: GetObjectCommandInput
  ): Promise<GetObjectCommandOutput>;

  uploadObjectToS3(
    uploadParams: UploadPartCommandInput
  ): Promise<UploadPartCommandOutput>;
}
