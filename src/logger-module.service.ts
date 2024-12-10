import { Injectable, Scope } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
interface LoggerConfig {
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'verbose';
  colors?: ColorsLogs;
}

interface ColorsLogs {
  debug?: string
  error?: string
  info?: string
  warn?: string
}
@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService {
  private readonly logger: Logger;
  private readonly levelLogger: string;

  constructor(config: LoggerConfig) {
    this.levelLogger = config.logLevel ?? 'debug';
    this.logger = this.createLogger(config.colors);
  }

  private createLogger(colors: ColorsLogs): Logger {
    const syslogColors = {
      debug: colors?.debug ?? 'blue',
      info: colors?.info ?? 'green',
      warning: colors?.warn ?? 'yellow',
      error: colors?.error ?? 'red',
    };

    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => {

        const message =
          typeof info.message === 'object'
            ? JSON.stringify(info.message, null, 2) // Formateo bonito para objetos
            : info.message;
        if (info.stack) {
          return `${info.timestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.stack}`;
        } else {
          return `${info.timestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${message}`;
        }
      })
    );

    return createLogger({
      level: this.levelLogger,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] }), // Agrega `context` y otros
        logFormat // Usa el formato definido arriba
      ),
      transports: [
        // Transporte para logs de nivel "info"
        new transports.DailyRotateFile({
          filename: 'logs/info/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info', // Solo captura logs de nivel "info"
          maxSize: '20m',
          maxFiles: '7d',
        }),
        // Transporte para logs de nivel "error"
        new transports.DailyRotateFile({
          filename: 'logs/error/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error', // Solo captura logs de nivel "error"
          maxSize: '20m',
          maxFiles: '7d',
        }),
        // Transporte para logs de nivel "debug"
        new transports.DailyRotateFile({
          filename: 'logs/debug/debug-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'debug', // Solo captura logs de nivel "debug"
          maxSize: '20m',
          maxFiles: '7d',
        }),
        // Transporte para todos los logs en una carpeta "all"
        new transports.DailyRotateFile({
          filename: 'logs/all/all-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '7d',
        }),
        // Transporte para imprimir en consola
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
    const levels = ['verbose', 'debug', 'info', 'warn', 'error'];
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
  debug(message: string | object, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      this.logger.debug({ message, context });
    }
  }
}