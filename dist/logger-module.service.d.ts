import { LoggerService } from "@nestjs/common";
import { Logger } from "winston";
export declare class CustomLoggerService implements LoggerService {
    private readonly winstonLogger;
    constructor(winstonLogger: Logger);
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
    debug(message: any, context?: string): void;
    verbose(message: any, context?: string): void;
}
//# sourceMappingURL=logger-module.service.d.ts.map