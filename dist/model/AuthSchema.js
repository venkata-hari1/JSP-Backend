"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AuthSchema = new mongoose_1.default.Schema({
    admin: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Auth', AuthSchema);
//# sourceMappingURL=AuthSchema.js.map