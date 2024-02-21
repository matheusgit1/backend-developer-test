export declare class LoggingService {
  public context: string;
  constructor(context: string);
  info(...message: any[]): void;
  log(...message: any[]): void;
  error(...message: any[]): void;
}
