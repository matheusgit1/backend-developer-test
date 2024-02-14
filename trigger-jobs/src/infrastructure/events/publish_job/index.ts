import { EventHandlerBase, EventHandlerBaseDto } from "../base.event-handler";
import { Logger } from "../../logger/logger";
import { PublishJobDto } from "../../../functions/sqs/dtos/handlers.dto";

export class PublishEventHandler implements EventHandlerBase<PublishJobDto> {
  public name: string;

  constructor(private readonly logger = new Logger(PublishEventHandler.name)) {}

  public async handler(
    event: EventHandlerBaseDto<PublishJobDto>
  ): Promise<void> {
    try {
      this.logger.info(
        `[handler] Método sendo processado: `,
        JSON.stringify(event)
      );
      //TODO - implemntar lógica de validar emprego e setar como publicado

      this.logger.log(`[handler] Método processado com exito`);
    } catch (error: any) {
      this.logger.error(
        `[${PublishEventHandler.name}.handler] - método processado com error: `,
        error
      );
    }
  }
}
