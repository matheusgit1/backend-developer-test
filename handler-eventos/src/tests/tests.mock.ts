import { TopicoConfig } from "../infrastructure/proxy/dynamo/dtos/dynamo.dto";
import { DynamoServiceEvents } from "../infrastructure/proxy/dynamo/repository/dynamo.repository";
import { SNSProxyRepository } from "../infrastructure/proxy/sns/repository/sns.proxy-repository";
import * as crypto from "crypto";

export class SnsProxyMock implements SNSProxyRepository {
  publicar = jest.fn(
    async (_mensagem: string, _arn: string): Promise<string> => {
      return "messageID";
    }
  );
}

export class DynamoServiceMock implements DynamoServiceEvents {
  consultarTopico = jest.fn(
    async (_topico: string, _versao: number): Promise<TopicoConfig> => {
      return {
        topico: _topico,
        versao: _versao,
        arn: crypto.randomUUID().toString(),
        schema: {
          ATRIBUTE: "VALUE",
        },
      };
    }
  );
  consultarTopicos = jest.fn(async (): Promise<TopicoConfig[]> => {
    return [
      {
        topico: "topico 1",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          ATRIBUTE: "VALUE",
        },
      },
      {
        topico: "topico 2",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          ATRIBUTE: "VALUE",
        },
      },
      {
        topico: "topico 3",
        versao: 1,
        arn: crypto.randomUUID().toString(),
        schema: {
          ATRIBUTE: "VALUE",
        },
      },
    ];
  });
  inserirTopico = jest.fn(
    async (
      _topico: string,
      _versao: number,
      _schema: any,
      _arn: string
    ): Promise<boolean> => {
      return true;
    }
  );
}
