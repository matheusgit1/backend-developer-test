import * as AWS from "aws-sdk";
import { DynamoServiceEvents as DynamoProxyService } from "./repository/dynamo.repository";
import * as dtos from "./dtos/dynamo.dto";

export class DynamoProxy implements DynamoProxyService {
  // private cliente: AWS.DynamoDB.DocumentClient;

  constructor(private readonly cliente: AWS.DynamoDB.DocumentClient) {}

  async consultarTopicos(): Promise<dtos.TopicoConfig[]> {
    console.log(
      `[${DynamoProxy.name}.consultarTopicos] - metodo de consulta dos topicos sns`
    );
    const parametros: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.EVENTO_CONFIG_DYNAMODB_NOME_TABELA,
    };

    const resultado = await this.cliente.scan(parametros).promise();
    console.log(
      `[${DynamoProxy.name}.consultarTopicos] - resultado: `,
      resultado
    );

    return resultado.Items.map((i) => this.mapearItem(i));
  }

  async consultarTopico(
    topico: string,
    versao: number
  ): Promise<dtos.TopicoConfig | null> {
    try {
      // const inicio = new Date().getTime();
      console.log(
        `[${DynamoProxy.name}.consultarTopico] - metodo de consulta do topico sns: `,
        topico,
        versao
      );
      const parametros: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.EVENTO_CONFIG_DYNAMODB_NOME_TABELA,
        Key: {
          topico,
          versao,
        },
      };
      console.log(
        `[${DynamoProxy.name}.consultarTopico] - parametros de busca: `,
        parametros
      );
      const resultado = await this.cliente.get(parametros).promise();
      console.log(
        `[${DynamoProxy.name}.consultarTopico] - resultado: `,
        parametros
      );
      if (!resultado.Item) {
        return null;
      }

      return this.mapearItem(resultado.Item);
    } catch (error) {
      console.error(
        `[${DynamoProxy.name}.consultarTopico] - metodo processado com erro: `,
        error
      );
      throw error;
    }
  }

  async inserirTopico(
    topico: string,
    versao: number,
    schema: any,
    arn: string
  ): Promise<boolean> {
    const parametros: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.EVENTO_CONFIG_DYNAMODB_NOME_TABELA,
      Item: {
        topico,
        versao,
        schema,
        arn,
      },
    };

    const resultado = await this.cliente.put(parametros).promise();
    if (resultado.$response.error) {
      return false;
    }

    return true;
  }

  private mapearItem(item: any): dtos.TopicoConfig {
    return {
      topico: item.topico,
      versao: item.versao,
      arn: item.arn,
      schema: item.schema,
    };
  }
}
