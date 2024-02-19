import { SQSEvent } from "aws-lambda/trigger/sqs";
import {
  EventHandlerDictionary,
  EventReceived,
  ListennerFromSQSDto,
} from "./__dtos__/handlers.dto";
import { Logger } from "../../../infrastructure/logger/logger";

export class ListennerFromSQS implements ListennerFromSQSDto {
  constructor(
    private readonly eventHandlerDictionary: EventHandlerDictionary,
    private readonly logger = new Logger(ListennerFromSQS.name)
  ) {}
  public async handler(events: SQSEvent): Promise<void> {
    this.logger.info(`Eventos sendo processado: `, JSON.stringify(events));
    for (const record of events.Records) {
      const snsMessage = JSON.parse(record.body);
      const event: EventReceived<any> = JSON.parse(snsMessage.Message);

      this.logger.info(`[handler] Evento sns: `, JSON.stringify(event));
      try {
        if (!this.validateStrategy(event.topico)) {
          throw new Error("[handler] evento nao suportado pelo servico");
        }
        await this.eventHandlerDictionary[event.topico].handler(event);
      } catch (e) {
        this.logger.error(
          `[handler]Método processado com erro`,
          JSON.stringify(e)
        );
      }
    }

    if (process.env.NODE_ENV !== "test") {
      process.exit(0);
    }
  }

  public validateStrategy(strategy: string): boolean {
    if (!(strategy in this.eventHandlerDictionary)) {
      return false;
    }
    return true;
  }
}
