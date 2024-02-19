import { SQSEvent } from "aws-lambda";
import { EventHandlerBase } from "../../../../events/base.event-handler";

export type AvailableEvents =
  | "event_publish_job"
  | "event_edit_job"
  | "event_delete_job";

export type EventHandlerDictionary = {
  [key in AvailableEvents]: EventHandlerBase<any>;
};

export interface EventReceived<T> {
  topico: AvailableEvents;
  versao: number;
  payload: T;
}

export interface PublishJobDto {
  job_id: string;
  origin: string;
}

export interface EditJobDto {
  job_id: string;
  origin: string;
}

export interface DeleteJobDto {
  job_id: string;
  origin: string;
}

export declare class ListennerFromSQSDto {
  constructor(...args: any[]);
  handler(events: SQSEvent): Promise<void>;
}
