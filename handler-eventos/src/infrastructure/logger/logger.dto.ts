export declare class LoggingService {
  public constext: string;
  constructor(context: string)
  info(...message: any[]): void;
  log(...message: any[]): void;
  warn(...message: any[]): void;
  error(...message: any[]): void;
}
