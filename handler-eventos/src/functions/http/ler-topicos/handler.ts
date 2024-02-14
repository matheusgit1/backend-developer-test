import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoProxy } from "../../../infrastructure/proxy/dynamo/dynamo.proxy";
import * as AWS from "aws-sdk";

const setup = () => {
  return new DynamoProxy(new AWS.DynamoDB.DocumentClient());
};

// const logger = new Logger("handler.publicarEvento");

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const service = setup();
    const resultado = await service.consultarTopicos();

    console.info(`[${handler.name}].lerTopicos - executado com sucesso`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        sucesso: 1,
        dados: { ...resultado },
      }),
    };
  } catch (err: any) {
    console.info("handler.lerTopicos sendo processado: body - ", event.body);
    console.info(`[${handler.name}].lerTopicos - executado com erro: `, err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        sucesso: 0,
        error: err,
      }),
    };
  } finally {
    console.log(`[${handler.name}].lerTopicos - método finalizado`);
  }
};
