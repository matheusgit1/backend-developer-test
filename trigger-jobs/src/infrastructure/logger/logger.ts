import { LoggingService } from "./dtos/logger.dto";

export class Logger implements LoggingService {
  constext: string;
  constructor(context: string) {
    this.constext = context;
  }

  info(...message: any[]) {
    console.info(`[${this.constext}]`.concat(message.map((i) => i).join("\n")));
  }
  log(...message: any[]) {
    console.log(`[${this.constext}]`.concat(message.map((i) => i).join("\n")));
  }
  warn(...message: any[]) {
    console.warn(`[${this.constext}]`.concat(message.map((i) => i).join("\n")));
  }
  error(...message: any[]) {
    console.error(
      `[${this.constext}]`.concat(message.map((i) => i).join("\n"))
    );
  }
}
