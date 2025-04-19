"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const common_1 = require("@nestjs/common");
let CustomLoggerService = class CustomLoggerService {
    constructor(winstonLogger) {
        this.winstonLogger = winstonLogger;
    }
    log(message, context) {
        this.winstonLogger.info({ message, context });
    }
    error(message, trace, context) {
        this.winstonLogger.error({ message, context });
        if (trace) {
            this.winstonLogger.error({ stack: trace });
        }
    }
    warn(message, context) {
        this.winstonLogger.warn({ message, context });
    }
    debug(message, context) {
        this.winstonLogger.debug({ message, context });
    }
    verbose(message, context) {
        this.winstonLogger.verbose({ message, context });
    }
};
CustomLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LOGGER'))
], CustomLoggerService);
exports.CustomLoggerService = CustomLoggerService;
