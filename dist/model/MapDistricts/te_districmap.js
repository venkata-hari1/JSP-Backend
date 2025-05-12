"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const VillageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    villagekey: { type: String, required: true },
    pincode: { type: String, required: true },
});
const DivisionSchema = new mongoose_1.Schema({
    divisionname: { type: String, required: true },
    divisionkey: { type: String, required: true, index: true },
    villages: { type: [VillageSchema], default: [] },
});
const ConstituencySchema = new mongoose_1.Schema({
    constituencename: { type: String, required: true },
    constituencykey: { type: String, required: true, index: true },
    divisions: { type: [DivisionSchema], default: [] },
});
const te_districmap = new mongoose_1.Schema({
    districtname: { type: String, required: true },
    districtkey: { type: String, required: true, index: true },
    constituencies: { type: [ConstituencySchema], default: [] },
    private: { type: Boolean, default: false }
});
const DistrictModel = mongoose_1.default.model('te_districmap', te_districmap);
exports.default = DistrictModel;
//# sourceMappingURL=te_districmap.js.map