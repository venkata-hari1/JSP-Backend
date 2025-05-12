"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WistonConfig_1 = __importDefault(require("../Utils/WistonConfig"));
const ConnectDb = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof url !== 'string' || !url) {
            throw new Error('Invalid MongoDB URL');
        }
        yield mongoose_1.default.connect(url);
        WistonConfig_1.default.info('Connected to MongoDB');
    }
    catch (error) {
        WistonConfig_1.default.error('MongoDB connection error:', error);
        throw error;
    }
});
exports.ConnectDb = ConnectDb;
mongoose_1.default.connection.on('reconnected', () => {
    WistonConfig_1.default.info('MongoDB reconnected');
});
mongoose_1.default.connection.on('error', (error) => {
    WistonConfig_1.default.error('MongoDB connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    WistonConfig_1.default.warn('MongoDB disconnected');
});
//# sourceMappingURL=db.js.map