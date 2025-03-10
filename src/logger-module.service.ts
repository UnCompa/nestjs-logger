import { Injectable, LoggerService, LogLevel, Scope } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';
interface LoggerConfig {
  logLevel?: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  colors?: ColorsLogs;
  datePattern?: string; // Variable para fecha
}

interface ColorsLogs {
  debug?: string;
  fatal?: string
  error?: string;
  info?: string;
  warn?: string;
  verbose?: string
  trance?: string
}

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private readonly logger: Logger;
  private readonly levelLogger: string;

  constructor(config: LoggerConfig) {
    const logLevel = process.env.LOG_LEVEL || config.logLevel || 'debug';
    this.levelLogger = logLevel;
    this.logger = this.createLogger(config.colors, config.datePattern);
  }
  log(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('info')) {
      this.logger.info({ message });
    }
  }
  fatal?(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('fatal')) {
      this.logger.error({ message });
    }
  }
  setLogLevels?(levels: LogLevel[]) {
    console.warn('Method not implemented.');
  }

  private createLogger(colors?: ColorsLogs, datePattern?: string): Logger {
    // Usamos la variable de entorno si existe para el patrón de fecha
    const syslogColors = {
      verbose: colors?.verbose ?? 'white',
      debug: colors?.debug ?? 'cyan',
      info: colors?.info ?? 'green',
      warning: colors?.warn ?? 'yellow',
      error: colors?.error ?? 'red',
      fatal: colors?.fatal ?? 'magenta'
    };
    const localTimezone = process.env.DATEZONE || 'America/Guayaquil';
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => {
        const timestamp =
          typeof info.timestamp === 'string' ||
            typeof info.timestamp === 'number'
            ? info.timestamp
            : new Date();
        const localTimestamp = dayjs(timestamp)
          .tz(localTimezone)
          .format('YYYY-MM-DD HH:mm:ss');
        const message =
          typeof info.message === 'object'
            ? JSON.stringify(info.message, null, 2) // Formateo bonito para objetos
            : info.message;
        if (info.stack) {
          return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.stack}`;
        } else {
          return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${message}`;
        }
      })
    );

    const logDatePattern = process.env.LOG_DATE_PATTERN || datePattern || 'YYYY-MM-DD';

    return createLogger({
      level: this.levelLogger,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] }),
        logFormat // Usa el formato definido arriba
      ),
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/verbose/verbose-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'verbose',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/fatal/fatal-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'fatal',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/warn/warn-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'warn',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/info/info-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'info',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/error/error-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'error',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/debug/debug-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          level: 'debug',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/all/all-%DATE%.log`,
          datePattern: logDatePattern, // Usa el patrón de fecha
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new transports.Console({
          format: format.combine(
            logFormat,
            format.colorize({ all: true, colors: syslogColors }),
          ),
        }),
      ],
    });
  }

  private isLevelEnabled(level: string): boolean {
    const levels = ['verbose' , 'debug' , 'info' , 'warn' , 'error', 'fatal'];
    const currentIndex = levels.indexOf(this.levelLogger);
    const targetIndex = levels.indexOf(level);
    return targetIndex >= currentIndex;
  }

  info(message: string | object, context?: string): void {
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

  verbose(message: string | object, context?: string): void {
    if (this.isLevelEnabled('verbose')) {
      this.logger.verbose({ message, context });
    }
  }

  trance(message: string | object, context?: string): void {
    if (this.isLevelEnabled('verbose')) {
      this.logger.verbose({ message, context });
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      this.logger.debug({ message, context });
    }
  }
}
