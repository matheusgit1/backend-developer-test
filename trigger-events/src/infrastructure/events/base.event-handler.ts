export interface EventHandlerBaseDto<T> {
  topico: string;
  versao: number;
  payload: T;
}

export declare class EventHandlerBase<T> {
  constructor(...args: any[]);
  handler(event: EventHandlerBaseDto<T>): Promise<any>;
}
