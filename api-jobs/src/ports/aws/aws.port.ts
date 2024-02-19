// import * as AWS from "aws-sdk";
import {
  GetObjectCommandInput,
  GetObjectCommandOutput,
  S3,
  UploadPartCommandInput,
  UploadPartCommandOutput,
} from "@aws-sdk/client-s3";
import { AWSPortDto } from "../__dtos__/ports.dtos";

/**
 * @description serviço responsãvel por fazer o bypass com os serviços da aws.
 * É de suma importância que a lógica de comunicação com os serviços sejam feitas pelos ports,
 * tanto para que seja possível desacoplar os módulos para que sejam possíveis os testes unitários, de integração
 * e de carga, também disponível neste repositório
 */
export class AWSPort implements AWSPortDto {
  constructor(private readonly s3: S3) {}
  async getObjectFroms3(
    downloadParams: GetObjectCommandInput
  ): Promise<GetObjectCommandOutput> {
    return await this.s3.getObject(downloadParams);
  }

  async uploadObjectToS3(
    uploadParams: UploadPartCommandInput
  ): Promise<UploadPartCommandOutput> {
    return await this.s3.uploadPart(uploadParams);
  }
}
