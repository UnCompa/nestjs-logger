import { LoggerService, LogLevel } from '@nestjs/common';
import 'winston-daily-rotate-file';
interface LoggerConfig {
    logLevel?: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    colors?: ColorsLogs;
    datePattern?: string;
}
interface ColorsLogs {
    debug?: string;
    fatal?: string;
    error?: string;
    info?: string;
    warn?: string;
    verbose?: string;
    trance?: string;
}
export declare class CustomLoggerService implements LoggerService {
    private readonly logger;
    private readonly levelLogger;
    constructor(config: LoggerConfig);
    log(message: any, ...optionalParams: any[]): void;
    fatal?(message: any, ...optionalParams: any[]): void;
    setLogLevels?(levels: LogLevel[]): void;
    private createLogger;
    private isLevelEnabled;
    info(message: string | object, context?: string): void;
    error(message: string | object, context?: string): void;
    warn(message: string | object, context?: string): void;
    verbose(message: string | object, context?: string): void;
    trance(message: string | object, context?: string): void;
    debug(message: string | object, context?: string): void;
}
export {};
//# sourceMappingURL=logger-module.service.d.ts.map