// Interfaz común para todos los loggers
export interface ILogger {
  log(message: string | object, context?: string): void;
  error(message: string | object, context?: string): void;
  warn(message: string | object, context?: string): void;
  debug(message: string | object, context?: string): void;
  verbose(message: string | object, context?: string): void;
}

// Configuración del logger
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