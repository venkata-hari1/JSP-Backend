"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const te_districts = new mongoose_1.default.Schema({
    district: { type: String },
    districtkey: { type: String },
    constituency: { type: String },
    constituencykey: { type: String },
    division: { type: String },
    divisionkey: { type: String },
    village: { type: String, },
    pincode: { type: String, }
}, { timestamps: true });
te_districts.index({ district: 1, districtkey: 1, constituency: 1, division: 1, village: 1, pincode: 1 }, { unique: true });
exports.default = mongoose_1.default.model('te_districts', te_districts);
//# sourceMappingURL=te_districts.js.map