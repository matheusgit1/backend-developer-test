import { EventEmitter } from "node:events";
import { HandlerEventService } from "../services/__dtos__/handler-event.dtos";
import { CustomEventEmitterDto } from "./__dtos__/emiter-events.dtos";

export class CustomEventEmitter implements CustomEventEmitterDto {
  constructor(
    private readonly emiter: EventEmitter,
    private readonly handlerEvents: HandlerEventService
  ) {
    this.emiter.on("publish_job", async (topic, version, payload) => {
      await this.handlerEvents.publishEvent(topic, version, payload);
    });
  }
  public publishJob(topic: string, version: number, payload: any): void {
    this.emiter.emit("publish_job", topic, version, payload);
  }
}
