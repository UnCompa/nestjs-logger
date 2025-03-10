import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './logger-module.service';

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

@Global()
@Module({
  imports: [ConfigModule], // Hacemos que funcione bien con la configuración de NestJS
})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    const { logLevel, colors } = options;

    const loggerProvider = {
      provide: CustomLoggerService,
      useFactory: () => {
        return new CustomLoggerService({
          logLevel: logLevel || 'debug',
          colors: colors || {
            debug: 'blue',
            info: 'green',
            warn: 'yellow',
            error: 'red',
          },
        });
      },
    };

    return {
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [CustomLoggerService], // Asegura que el servicio esté accesible en toda la aplicación
    };
  }
}
