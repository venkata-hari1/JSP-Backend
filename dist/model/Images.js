"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Images = new mongoose_1.default.Schema({
    url: String,
    public_id: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model('Images', Images);
//# sourceMappingURL=Images.js.map