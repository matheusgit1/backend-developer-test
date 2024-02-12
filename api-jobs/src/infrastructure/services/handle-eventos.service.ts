import axios from "axios";
import type { AxiosInstance } from "axios";
import { HandlerEventClass } from "./dto/handler-event.dtos";
import { configs } from "../../configs/envs/environments.config";

export class HandlerEvents implements HandlerEventClass {
  public readonly client: AxiosInstance;
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
      const { data, status } = await this.client.post("/publish-event", {
        topico: topic,
        versao: version,
        payload: payload,
      });
    } catch (e) {
      //TODO - tratar erro
    }
  }
}
