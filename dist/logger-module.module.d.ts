import { DynamicModule } from '@nestjs/common';
interface LoggerModuleOptions {
    logLevel?: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    colors?: ColorsLogs;
}
interface ColorsLogs {
    debug?: string;
    error?: string;
    info?: string;
    warn?: string;
}
export declare class LoggerModule {
    static forRoot(options?: LoggerModuleOptions): DynamicModule;
}
export {};
//# sourceMappingURL=logger-module.module.d.ts.map