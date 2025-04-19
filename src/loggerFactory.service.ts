import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { KafkaTransport, KafkaTransportConfig } from "winston-logger-kafka";
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';

export interface LoggerConfig {
  logLevel?: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  colors?: ColorsLogs;
  datePattern?: string;
  enableLogstash?: boolean;
  logstashHost?: string;
  logstashPort?: number;
  enableKafka?: boolean;
  kafkaHost?: string;
  kafkaTopic?: string;
}

export interface ColorsLogs {
  debug?: string;
  fatal?: string;
  error?: string;
  info?: string;
  warn?: string;
  verbose?: string;
  trance?: string;
}

@Injectable()
export class LoggerFactory {
  createLogger(config: LoggerConfig) {
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

    const logDatePattern = process.env.LOG_DATE_PATTERN || config.datePattern || 'YYYY-MM-DD';

    const transportsArray: any[] = [
      new transports.Console({
        format: format.combine(logFormat, format.colorize({ all: true, colors: syslogColors })),
      }),
      new transports.DailyRotateFile({
        filename: `logs/all/all-%DATE%.log`,
        datePattern: logDatePattern,
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/verbose/verbose-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'verbose',
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/fatal/fatal-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'fatal',
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/warn/warn-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'warn',
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/info/info-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'info',
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/error/error-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'error',
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/debug/debug-%DATE%.log`,
        datePattern: logDatePattern,
        level: 'debug',
        maxSize: '20m',
        maxFiles: '7d',
      }),
    ];

    if (config.enableLogstash) {
      transportsArray.push(
        new LogstashTransport({
          host: config.logstashHost || 'localhost',
          port: config.logstashPort || 5044,
          json: true,
          format: logstashFormat,
        })
      );
    }

    if (config.enableKafka) {

      const kafka_transport_conf: KafkaTransportConfig = {
        clientConfig: { brokers: [config.kafkaHost || 'localhost:9092'] },
        producerConfig: { allowAutoTopicCreation: false },
        sinkTopic: config.kafkaTopic || 'logs',
      }
      transportsArray.push(
        new KafkaTransport(kafka_transport_conf)
      );
    }

    return createLogger({
      level: config.logLevel || 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] })
      ),
      transports: transportsArray,
    });
  }
}