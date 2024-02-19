import axios from "axios";
import type { AxiosInstance } from "axios";
import { HandlerEventService } from "./__dtos__/handler-event.dtos";
import { configs } from "../../configs/envs/environments.config";

export class HandlerEvents implements HandlerEventService {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: configs.URL_HANDLER_EVENTS,
      timeout: 30 * 1000, // 30 seconds,
      headers: {
        "x-api-key": configs.HANDLER_EVENTS_X_API_KEY,
      },
    });
  }

  public async publishEvent(
    topic: string,
    version: 1,
    payload: any
  ): Promise<void> {
    try {
      await this.client.post("/sns/publicar", {
        topico: topic,
        versao: version,
        payload: payload,
      });
      console.log("evento publicado", topic, version, payload);
    } catch (e) {
      console.error(
        `[HandlerEvents.publishEvent] - erro ao publicar evento`,
        topic,
        version,
        payload
      );
    }
  }
}
