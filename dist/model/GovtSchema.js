"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Scheme = new mongoose_1.default.Schema({
    scheme: { type: String, required: true },
    option: { type: String, required: true },
    key: { type: String, required: true },
});
const GovernmentSchemes = new mongoose_1.default.Schema({
    english: [Scheme],
    hindi: [Scheme],
    telugu: [Scheme]
}, { timestamps: true });
exports.default = mongoose_1.default.model('GovernmentSchemes', GovernmentSchemes);
//# sourceMappingURL=GovtSchema.js.map