import { ILogger, LoggerConfig } from '../logger-module.service';
export declare class KafkaLoggerAdapter implements ILogger {
    private readonly kafkaLogger;
    constructor(config: LoggerConfig);
    log(message: string | object, context?: string): void;
    error(message: string | object, context?: string): void;
    warn(message: string | object, context?: string): void;
    debug(message: string | object, context?: string): void;
    verbose(message: string | object, context?: string): void;
}
//# sourceMappingURL=kafkaLoggerAdapter.d.ts.map