import axios, { AxiosInstance } from "axios";

export declare class HandlerEventService {
  client: AxiosInstance;
  constructor(...args: any[]);
  publishEvent(topic: string, version: 1, payload: any): Promise<void>;
}
