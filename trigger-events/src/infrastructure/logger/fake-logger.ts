import { LoggingService } from "./__dtos__/logger.dto";

export class FakeLogger implements LoggingService {
  context: string;
  constructor(context: string) {
    this.context = context;
  }

  info(..._message: any[]) {}
  log(..._message: any[]) {}
  warn(..._message: any[]) {}
  error(...message: any[]) {
    console.error(`[${this.context}]`.concat(message.map((i) => i).join("\n")));
  }
}
