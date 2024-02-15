import { EventEmitter } from "node:events";
import { HandlerEventClass } from "../services/__dtos__/handler-event.dtos";
import { CustomEventEmitterClass } from "./__dtos__/emiter-events.dtos";

export class CustomEventEmitter implements CustomEventEmitterClass {
  constructor(
    private readonly emiter: EventEmitter,
    //TODO - integrar com handler eventos
    private readonly handlerEvents: HandlerEventClass
  ) {
    this.emiter.on("publish_job", async (topic, version, payload) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("published job", topic, version, payload);
        }, 5000 /***5 segundos */);
      });
    });
  }
  public publishJob(topic: string, version: number, payload: any): void {
    this.emiter.emit("publish_job", topic, version, payload);
  }
}
