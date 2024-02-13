import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoProxy } from "../../../infrastructure/proxy/dynamo/dynamo.proxy";

const setup = () => {
  return new DynamoProxy();
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("handler.publicarEvento sendo processado: body - ", event.body);
  try {
    const service = setup();
    const { topico, versao } = event.pathParameters;
    const resultado = await service.consultarTopico(topico, +versao);

    console.info(`[${handler.name}].lerTopico - executado com sucesso`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        sucesso: 1,
        dados: { ...resultado },
      }),
    };
  } catch (err: any) {
    console.info("handler.lerTopico sendo processado: body - ", event.body);
    console.info(`[${handler.name}].lerTopico - executado com erro: `, err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        sucesso: 0,
        error: err,
      }),
    };
  } finally {
    console.log(`[${handler.name}].lerTopico - método finalizado`);
  }
};
