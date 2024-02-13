import * as dtos from "../dtos/sns.proxy-dtos";

export declare class SNSProxyRepository {
  public constructor(options: dtos.SNSProxyOptions);
  publicar(mensagem: string, arn: string): Promise<string>;
}
