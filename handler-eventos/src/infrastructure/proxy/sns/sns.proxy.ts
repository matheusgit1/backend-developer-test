import * as AWS from "aws-sdk";
import { SNSProxyRepository } from "./repository/sns.proxy-repository";

export class SNSProxy implements SNSProxyRepository {
  private sns: AWS.SNS;
  constructor() {
    this.sns = new AWS.SNS();
  }

  async publicar(mensagem: string, arn: string): Promise<string> {
    const inicio = new Date().getTime();
    try {
      console.log(`[${SNSProxy.name}.publicar] publicando no topico ${arn}`);
      const params: AWS.SNS.Types.PublishInput = {
        Message: mensagem,
        TopicArn: arn,
      };

      const retorno = await this.sns.publish(params).promise();
      console.log(`[${SNSProxy.name}.publicar] retorno: `, retorno);
      return retorno.MessageId;
    } catch (err) {
      console.error(
        `[${SNSProxy.name}.publicar] método processado com erro: `,
        err
      );
      throw err;
    } finally {
      console.log(
        `Publicação de mensagem ao SNS finalizada em: ${
          new Date().getTime() - inicio
        } ms`
      );
    }
  }
}
