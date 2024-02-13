import * as dtos from "../dtos/dynamo.dto";

export interface DynamoCredentialConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface DynamoOptions {
  tableName: string;
  region: string;
}

export declare class DynamoServiceEvents {
  constructor(options: DynamoCredentialConfig, dynamoOptions: DynamoOptions);
  consultarTopico(
    topico: string,
    versao: number
  ): Promise<dtos.TopicoConfig | null>;
  consultarTopicos(): Promise<dtos.TopicoConfig[]>;
  inserirTopico(
    topico: string,
    versao: number,
    schema: any,
    arn: string
  ): Promise<boolean>;
}
