import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './logger-module.service';

interface LoggerModuleOptions {
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'verbose';
  colors?: ColorsLogs; 
}

interface ColorsLogs {
  debug?: string
  error?: string
  info?: string
  warn?: string
}

@Global()
@Module({
  imports: [ConfigModule],
})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    const { logLevel, colors } = options;
    const loggerProvider = {
      provide: CustomLoggerService,
      useFactory: () => {
        return new CustomLoggerService({
          logLevel: logLevel || 'debug',
          colors: colors,
        });
      },
    };

    return {
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [CustomLoggerService],
    };
  }
}
