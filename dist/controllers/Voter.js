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
exports.deleteScheme = exports.Update_Schema = exports.GetSchemesVisionMission = exports.Government_Schemes = exports.Janasena_Vision = exports.Janasena_Mission = exports.VoterInfo = exports.Voters = exports.create = void 0;
const Voter_1 = __importDefault(require("../model/Voter"));
const JanasenaMission_1 = __importDefault(require("../model/JanasenaMission"));
const JanasenaVision_1 = __importDefault(require("../model/JanasenaVision"));
const GovtSchema_1 = __importDefault(require("../model/GovtSchema"));
const GovtSchema_2 = __importDefault(require("../model/GovtSchema"));
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
        const search = req.query.search || "";
        const sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const filter = {};
        if (search) {
            filter.district = { $regex: new RegExp(search, 'i') };
        }
        const [data, total] = yield Promise.all([
            Voter_1.default.find(filter)
                .select('district membersInFamily adultsArray adults name mobile')
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }),
            Voter_1.default.countDocuments(filter)
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
        const { scheme, key } = req.body;
        if (!type || typeof type !== "string") {
            return res.status(422).json({ status: false, message: 'Type is required' });
        }
        const lang = type.toLowerCase();
        const validTypes = ['en', 'hi', 'te'];
        if (!validTypes.includes(lang)) {
            return res.status(422).json({ status: false, message: 'Invalid language type' });
        }
        if (!scheme || !key) {
            return res.status(422).json({ status: false, message: 'Scheme  and key both are required' });
        }
        const containsNonTelugu = (text) => /[^\u0C00-\u0C7F\s.,!?()'"-]/.test(text);
        const containsNonHindi = (text) => /[^\u0900-\u097F\s.,!?()'"-]/.test(text);
        if (lang === 'te' && containsNonTelugu(scheme)) {
            return res.status(400).json({
                status: false,
                message: 'Scheme contains non-Telugu characters',
                invalidText: scheme
            });
        }
        if (lang === 'hi' && containsNonHindi(scheme)) {
            return res.status(400).json({
                status: false,
                message: 'Scheme contains non-Hindi characters',
                invalidText: scheme
            });
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
            updateField['english'] = { scheme: scheme, key: scheme };
        if (lang === 'hi')
            updateField['hindi'] = { scheme: scheme, key: scheme };
        if (lang === 'te')
            updateField['telugu'] = { scheme: scheme, key: scheme };
        const updated = yield GovtSchema_1.default.findOneAndUpdate({}, { $push: updateField }, { upsert: true, new: true });
        return res.status(200).json({ status: true, data: updateField });
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
        const visionKey = `${type}_vision`;
        const missionKey = `${type}_mission`;
        const schemeKey = type === 'en' ? 'english' : type === 'hi' ? 'hindi' : 'telugu';
        const [vision, mission, schemes] = yield Promise.all([
            JanasenaVision_1.default.findOne().select({ [visionKey]: 1, _id: 0 }).lean(),
            JanasenaMission_1.default.findOne().select({ [missionKey]: 1, _id: 0 }).lean(),
            GovtSchema_1.default.findOne().select({ [schemeKey]: 1, _id: 1 }).lean(),
        ]);
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
const Update_Schema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id } = req.params;
        const { scheme } = req.body;
        if (!scheme || scheme.trim() === "") {
            return res.status(422).json({ status: false, message: "scheme can't be empty" });
        }
        const doc = yield GovtSchema_2.default.findOne({
            $or: [
                { 'english._id': id },
                { 'hindi._id': id },
                { 'telugu._id': id }
            ]
        });
        if (!doc) {
            return res.status(404).json({ status: false, message: 'Not found' });
        }
        let result = null;
        const [englishMatch, hindiMatch, teluguMatch] = yield Promise.all([
            (_a = doc === null || doc === void 0 ? void 0 : doc.english) === null || _a === void 0 ? void 0 : _a.find((x) => x._id.toString() === id.toString()),
            (_b = doc === null || doc === void 0 ? void 0 : doc.hindi) === null || _b === void 0 ? void 0 : _b.find((x) => x._id.toString() === id.toString()),
            (_c = doc === null || doc === void 0 ? void 0 : doc.telugu) === null || _c === void 0 ? void 0 : _c.find((x) => x._id.toString() === id.toString())
        ]);
        switch (true) {
            case !!englishMatch: {
                englishMatch.scheme = scheme;
                result = englishMatch;
                break;
            }
            case !!hindiMatch: {
                hindiMatch.scheme = scheme;
                result = hindiMatch;
                break;
            }
            case !!teluguMatch: {
                teluguMatch.scheme = scheme;
                result = teluguMatch;
                break;
            }
            default: {
                break;
            }
        }
        yield doc.save();
        return res.status(200).json({ status: true, data: result });
    }
    catch (err) {
        next(err);
    }
});
exports.Update_Schema = Update_Schema;
const deleteScheme = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { pid, cid } = req.params;
        if (!type || !pid || !cid) {
            return res.status(422).json({ status: false, message: 'Missing required parameters.' });
        }
        const schemeKey = type === 'en' ? 'english' : type === 'hi' ? 'hindi' : 'telugu';
        const result = yield GovtSchema_1.default.findByIdAndUpdate(pid, { $pull: { [schemeKey]: { _id: cid } } }, { new: true });
        if (!result) {
            return res.status(404).json({ status: false, message: 'Scheme not found or already deleted.' });
        }
        res.status(200).json({ status: true, message: 'Scheme deleted successfully.', updatedData: result });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteScheme = deleteScheme;
//# sourceMappingURL=Voter.js.map