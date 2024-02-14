import { SQSEvent } from "aws-lambda";
import { EventHandlerBase } from "../../../infrastructure/events/base.event-handler";

export type AvailableEvents = "event_publish_job";

export type EventHandlerDictionary = {
  [key in AvailableEvents]: EventHandlerBase<any>;
};

export interface EventReceived<T> {
  topico: AvailableEvents;
  versao: number;
  payload: T;
}

export interface PublishJobDto {
  jobId: string;
}

export declare class ListennerFromSQSDeclarations {
  constructor(...args: any[]);
  handler(events: SQSEvent): Promise<void>;
}
