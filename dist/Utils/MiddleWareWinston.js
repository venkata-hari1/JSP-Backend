"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WistonConfig_1 = __importDefault(require("./WistonConfig"));
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const protocol = req.protocol;
        const host = req.hostname || req.headers.host || 'Unknown Host';
        const logMessage = `Protocol:${protocol},Host:${host},Method:${req.method},EndPoint:${req.originalUrl},StausCode:${res.statusCode},Time:${duration}ms`;
        if (res.statusCode >= 400) {
            WistonConfig_1.default.warn(logMessage);
        }
        else {
            WistonConfig_1.default.info(logMessage);
        }
    });
    next();
};
exports.default = requestLogger;
//# sourceMappingURL=MiddleWareWinston.js.map