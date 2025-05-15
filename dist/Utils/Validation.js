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
exports.isHindiText = exports.isTeluguText = exports.Validate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthSchema_1 = __importDefault(require("../model/AuthSchema"));
const Validate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('token');
        if (!token) {
            return res.status(401).json({ message: 'invalid token' });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decode.user;
        const exist = yield AuthSchema_1.default.findById(req.user.id);
        if (!exist) {
            return res.status(401).json({ message: 'Access denied' });
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.Validate = Validate;
const isTeluguText = (text) => {
    // This regex ensures all characters are Telugu (with optional whitespace and punctuation)
    return /^[\u0C00-\u0C7F\s.,!?()'"-]+$/.test(text);
};
exports.isTeluguText = isTeluguText;
const isHindiText = (text) => {
    return /^[\u0900-\u097F\s.,!?()'"-]+$/.test(text);
};
exports.isHindiText = isHindiText;
//# sourceMappingURL=Validation.js.map