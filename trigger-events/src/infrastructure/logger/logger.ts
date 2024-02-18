import { LoggingService } from "./__dtos__/logger.dto";

export class Logger implements LoggingService {
  context: string;
  constructor(context: string) {
    this.context = context;
  }

  info(...message: any[]) {
    console.info(`[${this.context}]`.concat(message.map((i) => i).join(" ")));
  }
  log(...message: any[]) {
    console.log(`[${this.context}]`.concat(message.map((i) => i).join(" ")));
  }
  warn(...message: any[]) {
    console.warn(`[${this.context}]`.concat(message.map((i) => i).join(" ")));
  }
  error(...message: any[]) {
    console.error(`[${this.context}]`.concat(message.map((i) => i).join(" ")));
  }
}
