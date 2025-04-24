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
// Define the Mongoose schema
const FormSchema = new mongoose_1.Schema({ name: { type: String, trim: true },
    gender: { type: String },
    dateofbirth: { type: Date },
    mobile: { type: Number },
    voterId: { type: String, },
    janasenaMember: { type: String },
    houseNo: { type: String, trim: true },
    housetype: { type: String },
    district: { type: String, trim: true },
    constituency: { type: String, trim: true },
    division: { type: String, trim: true },
    village: { type: String, trim: true },
    pincode: { type: String },
    adults: { male: { type: Number, min: 0, default: 0 },
        female: { type: Number, min: 0, default: 0 }, },
    adultsArray: {
        males: [{
                name: {
                    type: String,
                    trim: true,
                },
                option: {
                    type: String,
                },
            },
        ],
        females: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                option: {
                    type: String,
                },
            },
        ],
    },
    futureVoters: {
        boy: {
            type: Number,
            min: 0,
            default: 0,
        },
        girl: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    membersInFamily: { type: Number, min: 0, default: 0 },
    employmentStatus: { type: String, trim: true },
    education: { type: String, trim: true },
    govtSchemes: {
        educationBenefits: {
            type: String,
            default: 'No',
        },
        pension: {
            type: String,
            default: 'No',
        },
        pensionForDisabled: {
            type: String,
            default: 'No',
        },
        medicalBenefits: {
            type: String,
            default: 'No',
        },
        rythuBandhu: {
            type: String,
            default: 'No',
        },
        ration: {
            type: String,
            default: 'No',
        },
        tidcoHouses: {
            type: String,
            default: 'No',
        },
        nogovtSchemes: {
            type: String,
        },
    },
    issues: {
        type: String,
        trim: true,
        default: '',
    },
}, {
    timestamps: true,
});
FormSchema.index({ mobile: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Form', FormSchema);
//# sourceMappingURL=Voter.js.map