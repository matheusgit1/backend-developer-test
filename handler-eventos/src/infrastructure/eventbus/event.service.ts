import { DynamoServiceEvents } from "../proxy/dynamo/repository/dynamo.repository";
import { SNSProxyRepository } from "../proxy/sns/repository/sns.proxy-repository";
import { EventBusService } from "./repository/sns.repository";
import * as dtos from "./dtos/sns.dtos";
import { validarSchema } from "../../shared/utils/validar-schema.util";
import { RecursoNaoEncontrado } from "../../shared/erros/recurso-nao-encontrado.error";

export class EventBus implements EventBusService {
  constructor(
    private readonly snsProxy: SNSProxyRepository,
    private readonly dynamoService: DynamoServiceEvents
  ) {}

  public async publicar(evento: dtos.EventBodyFormat): Promise<string> {
    validarSchema(evento, {
      topico: { type: "string" },
      versao: { type: "int32" },
    });

    const topico = await this.dynamoService.consultarTopico(
      evento.topico,
      evento.versao
    );
    if (!topico) {
      throw new RecursoNaoEncontrado("Tipo de evento não encontrado");
    }

    if (topico.schema) {
      validarSchema(evento.payload, topico.schema);
    }

    const results = await this.snsProxy.publicar(
      JSON.stringify(evento),
      topico.arn
    );
    console.log(`[${EventBus.name}].publicar - evento publicado`, evento);
    return results;
  }
}
