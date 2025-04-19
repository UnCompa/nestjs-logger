"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaLoggerAdapter = void 0;
class KafkaLoggerAdapter {
    constructor(config) {
        var _a, _b;
        this.kafkaLogger = new KafkaLogger({
            brokers: ((_a = config.kafkaConfig) === null || _a === void 0 ? void 0 : _a.brokers) || ['localhost:9092'],
            topic: ((_b = config.kafkaConfig) === null || _b === void 0 ? void 0 : _b.topic) || 'logs',
        });
    }
    log(message, context) {
        this.kafkaLogger.log({ message, context });
    }
    error(message, context) {
        this.kafkaLogger.error({ message, context });
    }
    warn(message, context) {
        this.kafkaLogger.warn({ message, context });
    }
    debug(message, context) {
        this.kafkaLogger.debug({ message, context });
    }
    verbose(message, context) {
        this.kafkaLogger.verbose({ message, context });
    }
}
exports.KafkaLoggerAdapter = KafkaLoggerAdapter;
