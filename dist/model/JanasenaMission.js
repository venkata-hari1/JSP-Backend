"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JanasenaMission = new mongoose_1.default.Schema({
    en_mission: { type: String },
    hi_mission: { type: String },
    te_mission: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("janasenamission", JanasenaMission);
//# sourceMappingURL=JanasenaMission.js.map