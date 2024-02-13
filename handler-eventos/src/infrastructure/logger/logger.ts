import { LoggingService } from "./logger.dto";

interface LoggerOptions {
  loggerTimestamp?: boolean;
}
export class Logger implements LoggingService {
  constext: string;
  constructor(context: string, _options?: LoggerOptions) {
    this.constext = context;
  }

  private toLogger() {
    if (
      process.env.NODE_ENV === "TEST " ||
      process.env.NODE_ENV === "DEVELOPMENT"
    ) {
      return false;
    }
    return true;
  }

  private getCurrentTimestamp() {
    return new Date().toISOString();
  }

  info(...message: any[]) {
    if (!this.toLogger()) {
      return;
    }
    console.info(`[${this.getCurrentTimestamp()}][${this.constext}]` + message);
  }
  log(...message: any[]) {
    console.log(`[${this.getCurrentTimestamp()}][${this.constext}]` + message);
  }
  warn(...message: any[]) {
    console.warn(`[${this.getCurrentTimestamp()}][${this.constext}]` + message);
  }
  error(...message: any[]) {
    console.error(
      `[${this.getCurrentTimestamp()}][${this.constext}]` + message
    );
  }
}
