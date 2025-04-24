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
exports.GetSchemesVisionMission = exports.Government_Schemes = exports.Janasena_Vision = exports.Janasena_Mission = exports.VoterInfo = exports.Voters = exports.create = void 0;
const Voter_1 = __importDefault(require("../model/Voter"));
const JanasenaMission_1 = __importDefault(require("../model/JanasenaMission"));
const JanasenaVision_1 = __importDefault(require("../model/JanasenaVision"));
const GovtSchema_1 = __importDefault(require("../model/GovtSchema"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exist = yield Voter_1.default.findOne({ mobile: req.body.mobile });
        if (exist) {
            return res.status(400).json({ status: false, message: 'Mobile already exists' });
        }
        const data = yield Voter_1.default.create(Object.assign({}, req.body));
        return res.status(200).json({ status: true, data });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const Voters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const [data, total] = yield Promise.all([
            Voter_1.default.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Voter_1.default.countDocuments()
        ]);
        return res.status(200).json({
            status: true,
            pagination: {
                page,
                limit
            },
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.Voters = Voters;
const VoterInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const voter = yield Voter_1.default.findById(id);
        return res.status(200).json({ status: true, voter });
    }
    catch (err) {
        next(err);
    }
});
exports.VoterInfo = VoterInfo;
const Janasena_Mission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { en_mission, hi_mission, te_mission } = req.body;
    try {
        const exist = yield JanasenaMission_1.default.findOne();
        if (exist) {
            const updated = yield JanasenaMission_1.default.findByIdAndUpdate(exist._id, { $set: { en_mission: en_mission, hi_mission: hi_mission, te_mission: te_mission } }, { new: true });
            return res.status(200).json({ status: true, mission: updated });
        }
        const mission = new JanasenaMission_1.default({
            en_mission: en_mission,
            hi_mission: hi_mission,
            te_mission: te_mission
        });
        yield mission.save();
        return res.status(200).json({ statu: true, mission: mission });
    }
    catch (err) {
        next(err);
    }
});
exports.Janasena_Mission = Janasena_Mission;
const Janasena_Vision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { en_vision, hi_vision, te_vision } = req.body;
    try {
        const exist = yield JanasenaVision_1.default.findOne();
        if (exist) {
            const updated = yield JanasenaVision_1.default.findByIdAndUpdate(exist._id, { $set: {
                    en_vision: en_vision, hi_vision: hi_vision, te_vision: te_vision
                } }, { new: true });
            return res.status(200).json({ status: true, mission: updated });
        }
        const mission = new JanasenaVision_1.default({
            en_vision: en_vision,
            hi_vision: hi_vision,
            te_vision: te_vision
        });
        yield mission.save();
        return res.status(200).json({ statu: true, mission: mission });
    }
    catch (err) {
        next(err);
    }
});
exports.Janasena_Vision = Janasena_Vision;
const Government_Schemes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { scheme } = req.body;
        if (!type || typeof type !== "string") {
            return res.status(422).json({ status: false, message: 'Type is required' });
        }
        const lang = type.toLowerCase();
        const validTypes = ['en', 'hi', 'te'];
        if (!validTypes.includes(lang)) {
            return res.status(422).json({ status: false, message: 'Invalid language type' });
        }
        if (!scheme) {
            return res.status(422).json({ status: false, message: 'Scheme is required' });
        }
        // Check for duplicates in any language array
        const duplicate = yield GovtSchema_1.default.findOne({
            $or: [
                { 'english.scheme': scheme },
                { 'hindi.scheme': scheme },
                { 'telugu.scheme': scheme },
            ]
        });
        if (duplicate) {
            return res.status(409).json({ status: false, message: 'Scheme already exists in one of the languages' });
        }
        const updateField = {};
        if (lang === 'en')
            updateField['english'] = { scheme };
        if (lang === 'hi')
            updateField['hindi'] = { scheme };
        if (lang === 'te')
            updateField['telugu'] = { scheme };
        const updated = yield GovtSchema_1.default.findOneAndUpdate({}, { $push: updateField }, { upsert: true, new: true });
        return res.status(200).json({ status: true, data: updated });
    }
    catch (err) {
        next(err);
    }
});
exports.Government_Schemes = Government_Schemes;
const GetSchemesVisionMission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        if (!type || !['en', 'hi', 'te'].includes(String(type))) {
            return res.status(400).json({ status: false, message: 'Invalid or missing type. Use en, hi, or te.' });
        }
        let schemeProjection = {};
        let visionProjection = {};
        let missionProjection = {};
        if (type === 'en') {
            schemeProjection = { english: 1 };
            visionProjection = { en_vision: 1 };
            missionProjection = { en_mission: 1 };
        }
        else if (type === 'hi') {
            schemeProjection = { hindi: 1 };
            visionProjection = { hi_vision: 1 };
            missionProjection = { hi_mission: 1 };
        }
        else if (type === 'te') {
            schemeProjection = { telugu: 1 };
            visionProjection = { te_vision: 1 };
            missionProjection = { te_mission: 1 };
        }
        const schemes = yield GovtSchema_1.default.find({}, schemeProjection).lean();
        const vision = yield JanasenaVision_1.default.find({}, visionProjection).lean();
        const mission = yield JanasenaMission_1.default.find({}, missionProjection).lean();
        return res.status(200).json({
            status: true,
            data: {
                schemes,
                vision,
                mission,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.GetSchemesVisionMission = GetSchemesVisionMission;
//# sourceMappingURL=Voter.js.map