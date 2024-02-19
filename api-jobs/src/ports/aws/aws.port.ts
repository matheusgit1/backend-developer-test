import * as AWS from "aws-sdk";
import { AWSPortDto } from "../__dtos__/ports.dtos";

/**
 * @description serviço responsãvel por fazer o bypass com os serviços da aws.
 * É de suma importância que a lógica de comunicação com os serviços sejam feitas pelos ports,
 * tanto para que seja possível desacoplar os módulos para que sejam possíveis os testes unitários, de integração
 * e de carga, também disponível neste repositório
 */
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
