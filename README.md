# Logger multifuncional para NestJs

Variables disponibles para el logger

```bash
LOGSTASH_HOST=localhost
LOGSTASH_PORT=5044
LOG_LEVEL=debug
DATEZONE=America/Guayaquil
LOG_DATE_PATTERN=YYYY-MM-DD
```

## Uso

```ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@uncompa17/nestjs-logger';
@Module({
  imports: [
    LoggerModule.forRoot({
      logLevel: 'info',
      enableLogstash: true,
      logstashHost: 'localhost',
      logstashPort: 5044,
      enableKafka: true,
      kafkaHost: 'localhost:9092',
      kafkaTopic: 'logs',
      colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red',
      },
    }),
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
```
