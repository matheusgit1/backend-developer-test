import { DynamoServiceEvents } from "../../proxy/dynamo/repository/dynamo.repository";
import { SNSProxyRepository } from "../../proxy/sns/repository/sns.proxy-repository";
import * as dtos from "../dtos/sns.dtos";

export declare class EventBusService {
  constructor(snsProxy: SNSProxyRepository, dynamoService: DynamoServiceEvents);
  publicar(event: dtos.EventBodyFormat): Promise<string>;
}
