"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Janasena = new mongoose_1.default.Schema({
    en_vision: { type: String },
    hi_vision: { type: String },
    te_vision: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("janasena", Janasena);
//# sourceMappingURL=JanasenaVision.js.map