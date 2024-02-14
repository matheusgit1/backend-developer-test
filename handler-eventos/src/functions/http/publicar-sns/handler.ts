import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SNSProxy } from "../../../infrastructure/proxy/sns/sns.proxy";
import { DynamoProxy } from "../../../infrastructure/proxy/dynamo/dynamo.proxy";
import { validarSchema } from "../../../shared/utils/validar-schema.util";
import { EventBus } from "../../../infrastructure/eventbus/event.service";
import * as AWS from "aws-sdk";

const setup = () => {
  const dynamoDbService = new DynamoProxy(new AWS.DynamoDB.DocumentClient());
  const snsProxy = new SNSProxy();
  return new EventBus(snsProxy, dynamoDbService);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info(
    "handler.publicarEventoSNS sendo processado: body - ",
    event.body
  );
  try {
    const body = JSON.parse(event.body);
    const service = setup();
    validarSchema(body, {
      topico: { type: "string" },
      versao: { type: "int32" },
    });

    const resposta = await service.publicar(body);

    console.info(
      `[${handler.name}].publicarEventoSNS - executado com sucesso`,
      resposta
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        sucesso: 1,
        dados: {
          MessageId: resposta,
        },
      }),
    };
  } catch (err: any) {
    console.info(
      "handler.publicarEventoSNS sendo processado: body - ",
      event.body
    );
    console.info(
      `[${handler.name}].publicarEventoSNS - executado com erro: `,
      err
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        sucesso: 0,
        error: err,
      }),
    };
  } finally {
    console.log(`[${handler.name}].publicarEventoSNS - método finalizado`);
  }
};
