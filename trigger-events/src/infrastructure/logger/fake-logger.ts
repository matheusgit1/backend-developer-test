import { LoggingService } from "./__dtos__/logger.dto";

export class FakeLogger implements LoggingService {
  constext: string;
  constructor(context: string) {
    this.constext = context;
  }

  info(..._message: any[]) {}
  log(..._message: any[]) {}
  warn(..._message: any[]) {}
  error(...message: any[]) {
    console.error(
      `[${this.constext}]`.concat(message.map((i) => i).join("\n"))
    );
  }
}
