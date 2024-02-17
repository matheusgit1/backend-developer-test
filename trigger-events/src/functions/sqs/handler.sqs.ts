import { SQSEvent } from "aws-lambda/trigger/sqs";
import {
  EventHandlerDictionary,
  EventReceived,
  ListennerFromSQSDeclarations,
} from "./__dtos__/handlers.dto";
import { Logger } from "../../infrastructure/logger/logger";

export class ListennerFromSQS implements ListennerFromSQSDeclarations {
  constructor(
    private readonly eventHandlerDictionary: EventHandlerDictionary,
    private readonly logger = new Logger(ListennerFromSQS.name)
  ) {}
  public async handler(events: SQSEvent): Promise<void> {
    try {
      this.logger.info(`Eventos sendo processado: `, JSON.stringify(events));
      for (const record of events.Records) {
        const snsMessage = JSON.parse(record.body);
        const event: EventReceived<any> = JSON.parse(snsMessage.Message);
        if (!this.validateStrategy(event.topico)) {
          throw new Error("[handler] evento nao suportado pelo servico");
        }
        this.logger.info(`[handler] Evento sns: `, JSON.stringify(event));

        await this.eventHandlerDictionary[event.topico].handler(event);
      }
    } catch (e) {
      this.logger.error(`[handler]Método processado com erro`, e);
    }
  }

  public validateStrategy(strategy: string): boolean {
    if (!(strategy in this.eventHandlerDictionary)) {
      return false;
    }
    return true;
  }
}
