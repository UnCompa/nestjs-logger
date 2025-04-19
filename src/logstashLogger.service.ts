
import { Injectable, Scope } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createLogger, format, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { LogstashTransport } from 'winston-logstash';
import { ILogger, LoggerConfig } from './interfaces/logger.interfaces';
// Implementación del logger por defecto (consola y archivos)
@Injectable({ scope: Scope.TRANSIENT })
export class LogstashLogger implements ILogger {
  private readonly logger: Logger;
  private readonly levelLogger: string;

  constructor(config: LoggerConfig) {
    const logLevel = process.env.LOG_LEVEL || config.logLevel || 'debug';
    this.levelLogger = logLevel;
    this.logger = this.createLogger(config);
  }

  private createLogger(config: LoggerConfig): Logger {
    const syslogColors = {
      verbose: config.colors?.verbose ?? 'white',
      debug: config.colors?.debug ?? 'cyan',
      info: config.colors?.info ?? 'green',
      warning: config.colors?.warn ?? 'yellow',
      error: config.colors?.error ?? 'red',
      fatal: config.colors?.fatal ?? 'magenta',
    };

    const localTimezone = process.env.DATEZONE || 'America/Guayaquil';
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => {
        const timestamp =
          typeof info.timestamp === 'string' || typeof info.timestamp === 'number'
            ? info.timestamp
            : new Date();
        const localTimestamp = dayjs(timestamp)
          .tz(localTimezone)
          .format('YYYY-MM-DD HH:mm:ss');
        const message =
          typeof info.message === 'object'
            ? JSON.stringify(info.message, null, 2)
            : info.message;
        if (info.stack) {
          return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.stack}`;
        } else {
          return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${message}`;
        }
      })
    );

    const logstashFormat = format.combine(
      format.timestamp(),
      format.json(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] })
    );
    return createLogger({
      level: this.levelLogger,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] })
      ),
      transports: [
        new LogstashTransport({
          host: config.logstashHost || 'localhost',
          port: config.logstashPort || 5044,
          json: true,
          format: logstashFormat,
        })
      ],
    });
  }

  private isLevelEnabled(level: string): boolean {
    const levels = ['verbose', 'debug', 'info', 'warn', 'error', 'fatal'];
    const currentIndex = levels.indexOf(this.levelLogger);
    const targetIndex = levels.indexOf(level);
    return targetIndex >= currentIndex;
  }

  log(message: string | object, context?: string): void {
    if (this.isLevelEnabled('info')) {
      this.logger.info({ message, context });
    }
  }

  error(message: string | object, context?: string): void {
    if (this.isLevelEnabled('error')) {
      this.logger.error({ message, context });
    }
  }

  warn(message: string | object, context?: string): void {
    if (this.isLevelEnabled('warn')) {
      this.logger.warn({ message, context });
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      this.logger.debug({ message, context });
    }
  }

  verbose(message: string | object, context?: string): void {
    if (this.isLevelEnabled('verbose')) {
      this.logger.verbose({ message, context });
    }
  }
}
