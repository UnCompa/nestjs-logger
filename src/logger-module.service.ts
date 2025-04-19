import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { Logger } from "winston";

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(@Inject('LOGGER') private readonly winstonLogger: Logger) { }

  log(message: any, context?: string): void {
    this.winstonLogger.info({ message, context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.winstonLogger.error({ message, context });
    if (trace) {
      this.winstonLogger.error({ stack: trace });
    }
  }

  warn(message: any, context?: string): void {
    this.winstonLogger.warn({ message, context });
  }

  debug(message: any, context?: string): void {
    this.winstonLogger.debug({ message, context });
  }

  verbose(message: any, context?: string): void {
    this.winstonLogger.verbose({ message, context });
  }
}