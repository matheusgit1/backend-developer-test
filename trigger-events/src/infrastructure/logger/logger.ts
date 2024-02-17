import { LoggingService } from "./__dtos__/logger.dto";

export class Logger implements LoggingService {
  constext: string;
  constructor(context: string) {
    this.constext = context;
  }

  info(...message: any[]) {
    console.info(`[${this.constext}]`.concat(message.map((i) => i).join(" ")));
  }
  log(...message: any[]) {
    console.log(`[${this.constext}]`.concat(message.map((i) => i).join(" ")));
  }
  warn(...message: any[]) {
    console.warn(`[${this.constext}]`.concat(message.map((i) => i).join(" ")));
  }
  error(...message: any[]) {
    console.error(`[${this.constext}]`.concat(message.map((i) => i).join(" ")));
  }
}
