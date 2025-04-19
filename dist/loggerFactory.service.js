"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
const common_1 = require("@nestjs/common");
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const winston_logger_kafka_1 = require("winston-logger-kafka");
const winston_logstash_latest_1 = __importDefault(require("winston-logstash/lib/winston-logstash-latest"));
let LoggerFactory = class LoggerFactory {
    createLogger(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const syslogColors = {
            verbose: (_b = (_a = config.colors) === null || _a === void 0 ? void 0 : _a.verbose) !== null && _b !== void 0 ? _b : 'white',
            debug: (_d = (_c = config.colors) === null || _c === void 0 ? void 0 : _c.debug) !== null && _d !== void 0 ? _d : 'cyan',
            info: (_f = (_e = config.colors) === null || _e === void 0 ? void 0 : _e.info) !== null && _f !== void 0 ? _f : 'green',
            warning: (_h = (_g = config.colors) === null || _g === void 0 ? void 0 : _g.warn) !== null && _h !== void 0 ? _h : 'yellow',
            error: (_k = (_j = config.colors) === null || _j === void 0 ? void 0 : _j.error) !== null && _k !== void 0 ? _k : 'red',
            fatal: (_m = (_l = config.colors) === null || _l === void 0 ? void 0 : _l.fatal) !== null && _m !== void 0 ? _m : 'magenta',
        };
        const localTimezone = process.env.DATEZONE || 'America/Guayaquil';
        dayjs_1.default.extend(utc_1.default);
        dayjs_1.default.extend(timezone_1.default);
        const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf((info) => {
            const timestamp = typeof info.timestamp === 'string' || typeof info.timestamp === 'number'
                ? info.timestamp
                : new Date();
            const localTimestamp = (0, dayjs_1.default)(timestamp)
                .tz(localTimezone)
                .format('YYYY-MM-DD HH:mm:ss');
            const message = typeof info.message === 'object'
                ? JSON.stringify(info.message, null, 2)
                : info.message;
            if (info.stack) {
                return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.stack}`;
            }
            else {
                return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${message}`;
            }
        }));
        const logstashFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json(), winston_1.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] }));
        const logDatePattern = process.env.LOG_DATE_PATTERN || config.datePattern || 'YYYY-MM-DD';
        const transportsArray = [
            new winston_1.transports.Console({
                format: winston_1.format.combine(logFormat, winston_1.format.colorize({ all: true, colors: syslogColors })),
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/all/all-%DATE%.log`,
                datePattern: logDatePattern,
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/verbose/verbose-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'verbose',
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/fatal/fatal-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'fatal',
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/warn/warn-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'warn',
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/info/info-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'info',
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/error/error-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'error',
                maxSize: '20m',
                maxFiles: '7d',
            }),
            new winston_1.transports.DailyRotateFile({
                filename: `logs/debug/debug-%DATE%.log`,
                datePattern: logDatePattern,
                level: 'debug',
                maxSize: '20m',
                maxFiles: '7d',
            }),
        ];
        if (config.enableLogstash) {
            transportsArray.push(new winston_logstash_latest_1.default({
                host: config.logstashHost || 'localhost',
                port: config.logstashPort || 5044,
                json: true,
                format: logstashFormat,
            }));
        }
        if (config.enableKafka) {
            const kafka_transport_conf = {
                clientConfig: { brokers: [config.kafkaHost || 'localhost:9092'] },
                producerConfig: { allowAutoTopicCreation: false },
                sinkTopic: config.kafkaTopic || 'logs',
            };
            transportsArray.push(new winston_logger_kafka_1.KafkaTransport(kafka_transport_conf));
        }
        return (0, winston_1.createLogger)({
            level: config.logLevel || 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json(), winston_1.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] })),
            transports: transportsArray,
        });
    }
};
LoggerFactory = __decorate([
    (0, common_1.Injectable)()
], LoggerFactory);
exports.LoggerFactory = LoggerFactory;
