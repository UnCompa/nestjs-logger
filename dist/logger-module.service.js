"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const common_1 = require("@nestjs/common");
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
let CustomLoggerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CustomLoggerService = _classThis = class {
        constructor(config) {
            const logLevel = process.env.LOG_LEVEL || config.logLevel || 'debug';
            this.levelLogger = logLevel;
            this.logger = this.createLogger(config.colors, config.datePattern);
        }
        log(message, ...optionalParams) {
            if (this.isLevelEnabled('info')) {
                this.logger.info({ message });
            }
        }
        fatal(message, ...optionalParams) {
            if (this.isLevelEnabled('fatal')) {
                this.logger.info({ message });
            }
        }
        setLogLevels(levels) {
            console.warn('Method not implemented.');
        }
        createLogger(colors, datePattern) {
            var _a, _b, _c, _d, _e, _f;
            // Usamos la variable de entorno si existe para el patrón de fecha
            const syslogColors = {
                verbose: (_a = colors === null || colors === void 0 ? void 0 : colors.verbose) !== null && _a !== void 0 ? _a : 'white',
                debug: (_b = colors === null || colors === void 0 ? void 0 : colors.debug) !== null && _b !== void 0 ? _b : 'cyan',
                info: (_c = colors === null || colors === void 0 ? void 0 : colors.info) !== null && _c !== void 0 ? _c : 'green',
                warning: (_d = colors === null || colors === void 0 ? void 0 : colors.warn) !== null && _d !== void 0 ? _d : 'yellow',
                error: (_e = colors === null || colors === void 0 ? void 0 : colors.error) !== null && _e !== void 0 ? _e : 'red',
                fatal: (_f = colors === null || colors === void 0 ? void 0 : colors.fatal) !== null && _f !== void 0 ? _f : 'magenta'
            };
            const localTimezone = process.env.DATEZONE || 'America/Guayaquil';
            dayjs_1.default.extend(utc_1.default);
            dayjs_1.default.extend(timezone_1.default);
            const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf((info) => {
                const timestamp = typeof info.timestamp === 'string' ||
                    typeof info.timestamp === 'number'
                    ? info.timestamp
                    : new Date();
                const localTimestamp = (0, dayjs_1.default)(timestamp)
                    .tz(localTimezone)
                    .format('YYYY-MM-DD HH:mm:ss');
                const message = typeof info.message === 'object'
                    ? JSON.stringify(info.message, null, 2) // Formateo bonito para objetos
                    : info.message;
                if (info.stack) {
                    return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.stack}`;
                }
                else {
                    return `${localTimestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${message}`;
                }
            }));
            const logDatePattern = process.env.LOG_DATE_PATTERN || datePattern || 'YYYY-MM-DD';
            return (0, winston_1.createLogger)({
                level: this.levelLogger,
                format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json(), winston_1.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context', 'trance', 'stack'] }), logFormat // Usa el formato definido arriba
                ),
                transports: [
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/verbose/verbose-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'verbose',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/fatal/fatal-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'fatal',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/warn/warn-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'warn',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/info/info-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'info',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/error/error-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'error',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/debug/debug-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        level: 'debug',
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/all/all-%DATE%.log`,
                        datePattern: logDatePattern, // Usa el patrón de fecha
                        maxSize: '20m',
                        maxFiles: '7d',
                    }),
                    new winston_1.transports.Console({
                        format: winston_1.format.combine(logFormat, winston_1.format.colorize({ all: true, colors: syslogColors })),
                    }),
                ],
            });
        }
        isLevelEnabled(level) {
            const levels = ['verbose', 'debug', 'info', 'warn', 'error', 'fatal'];
            const currentIndex = levels.indexOf(this.levelLogger);
            const targetIndex = levels.indexOf(level);
            return targetIndex >= currentIndex;
        }
        info(message, context) {
            if (this.isLevelEnabled('info')) {
                this.logger.info({ message, context });
            }
        }
        error(message, context) {
            if (this.isLevelEnabled('error')) {
                this.logger.error({ message, context });
            }
        }
        warn(message, context) {
            if (this.isLevelEnabled('warn')) {
                this.logger.warn({ message, context });
            }
        }
        verbose(message, context) {
            if (this.isLevelEnabled('verbose')) {
                this.logger.verbose({ message, context });
            }
        }
        trance(message, context) {
            if (this.isLevelEnabled('verbose')) {
                this.logger.verbose({ message, context });
            }
        }
        debug(message, context) {
            if (this.isLevelEnabled('debug')) {
                this.logger.debug({ message, context });
            }
        }
    };
    __setFunctionName(_classThis, "CustomLoggerService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomLoggerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomLoggerService = _classThis;
})();
exports.CustomLoggerService = CustomLoggerService;
