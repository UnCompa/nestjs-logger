"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_module_service_1 = require("./logger-module.service");
const loggerFactory_service_1 = require("./loggerFactory.service");
let LoggerModule = LoggerModule_1 = class LoggerModule {
    static forRoot(options = {}) {
        return {
            module: LoggerModule_1,
            providers: [
                loggerFactory_service_1.LoggerFactory,
                {
                    provide: 'LOGGER',
                    useFactory: (loggerFactory) => {
                        return loggerFactory.createLogger(options);
                    },
                    inject: [loggerFactory_service_1.LoggerFactory],
                },
                {
                    provide: logger_module_service_1.CustomLoggerService,
                    useFactory: (logger) => new logger_module_service_1.CustomLoggerService(logger),
                    inject: ['LOGGER'],
                },
            ],
            exports: [logger_module_service_1.CustomLoggerService],
        };
    }
};
LoggerModule = LoggerModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [loggerFactory_service_1.LoggerFactory],
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
