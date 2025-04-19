import 'winston-daily-rotate-file';
import { ILogger, LoggerConfig } from './interfaces/logger.interfaces';
export declare class LogstashLogger implements ILogger {
    private readonly logger;
    private readonly levelLogger;
    constructor(config: LoggerConfig);
    private createLogger;
    private isLevelEnabled;
    log(message: string | object, context?: string): void;
    error(message: string | object, context?: string): void;
    warn(message: string | object, context?: string): void;
    debug(message: string | object, context?: string): void;
    verbose(message: string | object, context?: string): void;
}
//# sourceMappingURL=logstashLogger.service.d.ts.map