import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './logger-module.service';
import { LoggerConfig, LoggerFactory } from './loggerFactory.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerFactory],
})
export class LoggerModule {
  static forRoot(options: LoggerConfig = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        LoggerFactory,
        {
          provide: 'LOGGER',
          useFactory: (loggerFactory: LoggerFactory) => {
            return loggerFactory.createLogger(options);
          },
          inject: [LoggerFactory],
        },
        {
          provide: CustomLoggerService,
          useFactory: (logger) => new CustomLoggerService(logger),
          inject: ['LOGGER'],
        },
      ],
      exports: [CustomLoggerService],
    };
  }
}