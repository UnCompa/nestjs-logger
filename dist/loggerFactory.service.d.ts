import 'winston-daily-rotate-file';
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
export declare class LoggerFactory {
    createLogger(config: LoggerConfig): import("winston").Logger;
}
//# sourceMappingURL=loggerFactory.service.d.ts.map