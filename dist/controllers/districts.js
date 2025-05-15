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
exports.confirm_districts = exports.allDistrictsMasterdData = exports.getAllVillagesPincode = exports.allDivisonsData = exports.allConstituationData = exports.allDistrictsdata = exports.create_Village_Pincode = exports.create_divisons = exports.create_constituencies = exports.districts = exports.district = exports.create_districts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const en_districmap_1 = __importDefault(require("../model/MapDistricts/en_districmap"));
const te_districmap_1 = __importDefault(require("../model/MapDistricts/te_districmap"));
const hi_districmap_1 = __importDefault(require("../model/MapDistricts/hi_districmap"));
const districtModels = {
    en: en_districmap_1.default,
    te: te_districmap_1.default,
    hi: hi_districmap_1.default,
};
const containsNonTelugu = (text) => /[^\u0C00-\u0C7F\s.,!?()'"-]/.test(text);
const containsNonHindi = (text) => /[^\u0900-\u097F\s.,!?()'"-]/.test(text);
const create_districts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { district, districtkey } = req.body;
        const { type } = req.query;
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                error: 'Invalid or missing language type (en, te, hi).',
            });
        }
        if (!district || !districtkey) {
            return res.status(422).json({
                status: false,
                error: 'Both district and districtkey are required.',
            });
        }
        if (type === 'te' && containsNonTelugu(district)) {
            return res.status(422).json({
                status: false,
                message: 'contains non-Telugu characters'
            });
        }
        if (type === 'hi' && containsNonHindi(district)) {
            return res.status(22).json({
                status: false,
                message: 'contains non-Hindi characters',
            });
        }
        const Model = districtModels[type];
        const existingDistrict = yield Model.findOne({
            $or: [
                { districtkey: districtkey },
                { districtname: district }
            ]
        });
        if (existingDistrict) {
            return res.status(409).json({
                status: false,
                error: `District with key ${districtkey} or name ${district} already exists`,
            });
        }
        const newDistrict = new Model({
            districtname: district,
            districtkey: districtkey,
        });
        yield newDistrict.save();
        return res.status(201).json({
            status: true,
            message: 'District created successfully.',
            data: newDistrict,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create_districts = create_districts;
const district = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { id } = req.params;
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                error: 'Invalid or missing language type (en, te, hi).',
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(422).json({
                status: false,
                message: 'Invalid district ID.',
            });
        }
        const Model = districtModels[type];
        const existingDistrict = yield Model.findById({ _id: id });
        return res.status(200).json({ status: true, existingDistrict });
    }
    catch (err) {
        next(err);
    }
});
exports.district = district;
const districts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                error: 'Invalid or missing language type (en, te, hi).',
            });
        }
        const Model = districtModels[type];
        const Districts = yield Model.find({});
        return res.status(200).json({ status: true, Districts });
    }
    catch (err) {
        next(err);
    }
});
exports.districts = districts;
const create_constituencies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { districtkey } = req.params;
        const { constituencename, constituencykey } = req.body;
        const { type } = req.query;
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing language type (en, te, hi).',
            });
        }
        if (!constituencename || !constituencykey) {
            return res.status(422).json({
                status: false,
                message: 'Both constituencename and constituencykey are required.',
            });
        }
        if (type === 'te' && containsNonTelugu(constituencename)) {
            return res.status(422).json({
                status: false,
                message: 'contains non-Telugu characters'
            });
        }
        if (type === 'hi' && containsNonHindi(constituencename)) {
            return res.status(22).json({
                status: false,
                message: 'contains non-Hindi characters',
            });
        }
        const Model = districtModels[type];
        // Find the district by its ID
        const district = yield Model.findOne({ districtkey: districtkey });
        if (!district) {
            return res.status(404).json({
                status: false,
                message: 'District not found.',
            });
        }
        const existingConstituency = yield Model.findOne({
            districtkey: districtkey,
            $or: [
                { 'constituencies.constituencykey': constituencykey },
                { 'constituencies.constituencename': constituencename }
            ]
        });
        if (existingConstituency) {
            const match = existingConstituency.constituencies.find((c) => c.constituencykey === constituencykey || c.constituencename === constituencename);
            if ((match === null || match === void 0 ? void 0 : match.constituencykey) === constituencykey) {
                return res.status(409).json({
                    status: false,
                    message: `Constituency with key ${constituencykey} already exists in this district.`,
                });
            }
            if ((match === null || match === void 0 ? void 0 : match.constituencename) === constituencename) {
                return res.status(409).json({
                    status: false,
                    message: `Constituency with name ${constituencename} already exists in this district.`,
                });
            }
        }
        const newConstituency = {
            constituencename,
            constituencykey,
        };
        district.constituencies.push(newConstituency);
        yield district.save();
        return res.status(200).json({
            status: true,
            message: 'Constituency created successfully.',
            data: newConstituency,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create_constituencies = create_constituencies;
const create_divisons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { did, cid } = req.params;
        const { divisionname, divisionkey } = req.body;
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing language type (en, te, hi).',
            });
        }
        if (!divisionname || !divisionkey) {
            return res.status(422).json({
                status: false,
                message: 'Both divisionname and divisionkey are required.',
            });
        }
        if (type === 'te' && containsNonTelugu(divisionname)) {
            return res.status(422).json({
                status: false,
                message: 'contains non-Telugu characters'
            });
        }
        if (type === 'hi' && containsNonHindi(divisionname)) {
            return res.status(22).json({
                status: false,
                message: 'contains non-Hindi characters',
            });
        }
        const Model = districtModels[type];
        const district = yield Model.findOne({ districtkey: did });
        if (!district) {
            return res.status(404).json({
                status: false,
                message: 'District not found.',
            });
        }
        const constituency = district.constituencies.find((c) => c.constituencykey === cid);
        if (!constituency) {
            return res.status(404).json({
                status: false,
                message: 'Constituency not found.',
            });
        }
        const existingDivision = yield Model.findOne({
            districtkey: did,
            'constituencies.constituencykey': cid,
            $or: [
                { 'constituencies.divisions.divisionkey': divisionkey },
                { 'constituencies.divisions.divisionname': divisionname }
            ]
        });
        if (existingDivision) {
            return res.status(409).json({
                status: false,
                message: `Division with key "${divisionkey}" or name "${divisionname}" already exists in this constituency.`,
            });
        }
        const newDivision = {
            divisionname,
            divisionkey,
        };
        constituency.divisions.push(newDivision);
        yield district.save();
        return res.status(201).json({
            status: true,
            message: 'Division created successfully.',
            data: newDivision,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create_divisons = create_divisons;
const create_Village_Pincode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { did, cid, dvid } = req.params;
        const { village, villagekey, pincode } = req.body;
        // Validate type
        if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing language type (en, te, hi).',
            });
        }
        if (type === 'te' && containsNonTelugu(village)) {
            return res.status(422).json({
                status: false,
                message: 'contains non-Telugu characters'
            });
        }
        if (type === 'hi' && containsNonHindi(village)) {
            return res.status(22).json({
                status: false,
                message: 'contains non-Hindi characters',
            });
        }
        const Model = districtModels[type];
        const district = yield Model.findOne({ districtkey: did });
        if (!district) {
            return res.status(404).json({ status: false, message: 'District not found.' });
        }
        const constituency = district.constituencies.find((c) => c.constituencykey === cid);
        if (!constituency) {
            return res.status(404).json({ status: false, message: 'Constituency not found.' });
        }
        const division = constituency.divisions.find((d) => d.divisionkey === dvid);
        if (!division) {
            return res.status(404).json({ status: false, message: 'Division not found.' });
        }
        // Validate required fields
        if (!village || !villagekey || !pincode) {
            return res.status(422).json({
                status: false,
                message: 'Village name, villagekey, and pincode are required.',
            });
        }
        // Validate pincode
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(422).json({
                status: false,
                message: 'Pincode must be exactly 6 digits.',
            });
        }
        // Validate ObjectIds
        // Check for duplicate villagekey
        const existingVillage = division.villages.find((v) => v.villagekey === villagekey);
        if (existingVillage) {
            return res.status(409).json({
                status: false,
                message: `Village with key "${villagekey}" already exists.`,
            });
        }
        // Add the new village
        const newVillage = { name: village, villagekey, pincode };
        division.villages.push(newVillage);
        // Save district
        yield district.save();
        if (type === 'en') {
            // await VillageKeys.create({ key: villagekey });
        }
        return res.status(201).json({
            status: true,
            message: 'Village created successfully.',
            data: newVillage,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create_Village_Pincode = create_Village_Pincode;
const allDistrictsdata = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, did } = req.query;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        const Model = districtModels[type];
        if (!Model) {
            return res.status(400).json({
                status: false,
                message: `No model found for type "${type}".`,
            });
        }
        switch (type) {
            case 'en': {
                const alldistricts = yield en_districmap_1.default.find({}).select('districtname districtkey');
                res.status(200).json({ status: true, alldistricts });
                break;
            }
            case 'te': {
                const [alldistricts, te_districts] = yield Promise.all([
                    en_districmap_1.default.find({}).select('districtname districtkey'),
                    te_districmap_1.default.find({}).select('districtname districtkey')
                ]);
                res.status(200).json({ status: true, alldistricts, te_districts });
                break;
            }
            case 'hi': {
                const [alldistricts, hi_districts] = yield Promise.all([
                    en_districmap_1.default.find({}).select('districtname districtkey'),
                    hi_districmap_1.default.find({}).select('districtname districtkey')
                ]);
                res.status(200).json({ status: true, alldistricts, hi_districts });
                break;
            }
            default: {
                res.status(422).json({ status: false, message: 'no data was not found' });
                break;
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.allDistrictsdata = allDistrictsdata;
const allConstituationData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { districtkey } = req.params;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        const en_constituencies = yield en_districmap_1.default.aggregate([
            { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
            { $unwind: "$constituencies" },
            {
                $project: {
                    _id: "$constituencies._id",
                    constituencename: "$constituencies.constituencename",
                    constituencekey: "$constituencies.constituencykey",
                }
            }
        ]);
        switch (type) {
            case 'en': {
                return res.status(200).json({
                    status: true,
                    constituencies: en_constituencies,
                });
            }
            case 'te': {
                const te_constituencies = yield te_districmap_1.default.aggregate([
                    { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
                    { $unwind: "$constituencies" },
                    {
                        $project: {
                            _id: "$constituencies._id",
                            constituencename: "$constituencies.constituencename",
                            constituencekey: "$constituencies.constituencykey",
                        }
                    }
                ]);
                return res.status(200).json({
                    status: true,
                    constituencies: en_constituencies,
                    te_constituencies: te_constituencies,
                });
            }
            case 'hi': {
                const hi_constituencies = yield hi_districmap_1.default.aggregate([
                    { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
                    { $unwind: "$constituencies" },
                    {
                        $project: {
                            _id: "$constituencies._id",
                            constituencename: "$constituencies.constituencename",
                            constituencekey: "$constituencies.constituencykey",
                        }
                    }
                ]);
                return res.status(200).json({
                    status: true,
                    constituencies: en_constituencies,
                    hi_constituencies: hi_constituencies,
                });
            }
            default: {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid type value.',
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.allConstituationData = allConstituationData;
const allDivisonsData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { did, cid } = req.params;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        const Model = districtModels[type];
        if (!Model) {
            return res.status(400).json({
                status: false,
                message: `No model found for type "${type}".`,
            });
        }
        switch (type) {
            case 'en': {
                const divisionsResult = yield en_districmap_1.default.aggregate([
                    { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
                    { $unwind: "$constituencies" },
                    { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
                    {
                        $project: {
                            _id: 0,
                            divisions: "$constituencies.divisions",
                        }
                    },
                    { $unwind: "$divisions" },
                    {
                        $project: {
                            _id: "$divisions._id",
                            divisionname: "$divisions.divisionname",
                            divisionkey: "$divisions.divisionkey"
                        }
                    }
                ]);
                res.status(200).json({
                    status: true,
                    divisions: divisionsResult,
                });
                break;
            }
            case 'te': {
                const [divisionsResult, te_divisionsResult] = yield Promise.all([
                    en_districmap_1.default.aggregate([
                        { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
                        {
                            $project: {
                                _id: 0,
                                divisions: "$constituencies.divisions",
                            }
                        },
                        { $unwind: "$divisions" },
                        {
                            $project: {
                                _id: "$divisions._id",
                                divisionname: "$divisions.divisionname",
                                divisionkey: "$divisions.divisionkey"
                            }
                        }
                    ]),
                    te_districmap_1.default.aggregate([
                        { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
                        {
                            $project: {
                                _id: 0,
                                divisions: "$constituencies.divisions",
                            }
                        },
                        { $unwind: "$divisions" },
                        {
                            $project: {
                                _id: "$divisions._id",
                                divisionname: "$divisions.divisionname",
                                divisionkey: "$divisions.divisionkey"
                            }
                        }
                    ])
                ]);
                res.status(200).json({
                    status: true,
                    divisions: divisionsResult,
                    te_divisionsResult: te_divisionsResult
                });
                break;
            }
            case 'hi': {
                const [divisionsResult, hi_divisionsResult] = yield Promise.all([
                    en_districmap_1.default.aggregate([
                        { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
                        {
                            $project: {
                                _id: 0,
                                divisions: "$constituencies.divisions",
                            }
                        },
                        { $unwind: "$divisions" },
                        {
                            $project: {
                                _id: "$divisions._id",
                                divisionname: "$divisions.divisionname",
                                divisionkey: "$divisions.divisionkey"
                            }
                        }
                    ]),
                    hi_districmap_1.default.aggregate([
                        { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
                        {
                            $project: {
                                _id: 0,
                                divisions: "$constituencies.divisions",
                            }
                        },
                        { $unwind: "$divisions" },
                        {
                            $project: {
                                _id: "$divisions._id",
                                divisionname: "$divisions.divisionname",
                                divisionkey: "$divisions.divisionkey"
                            }
                        }
                    ])
                ]);
                res.status(200).json({
                    status: true,
                    divisions: divisionsResult,
                    hi_divisionsResult: hi_divisionsResult
                });
                break;
            }
            default: {
                res.status(404).json({ status: false, message: 'No Data found' });
                break;
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.allDivisonsData = allDivisonsData;
const getAllVillagesPincode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { did, cid, dvid } = req.params;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        const Model = districtModels[type];
        if (!Model) {
            return res.status(400).json({
                status: false,
                message: `No model found for type "${type}".`,
            });
        }
        switch (type) {
            case 'en': {
                const villagesResult = yield en_districmap_1.default.aggregate([
                    { $match: { districtkey: did } },
                    { $unwind: "$constituencies" },
                    { $match: { "constituencies.constituencykey": cid } },
                    { $unwind: "$constituencies.divisions" },
                    { $match: { "constituencies.divisions.divisionkey": dvid } },
                    { $unwind: "$constituencies.divisions.villages" },
                    {
                        $project: {
                            _id: "$constituencies.divisions.villages._id",
                            name: "$constituencies.divisions.villages.name",
                            pincode: "$constituencies.divisions.villages.pincode",
                            villagekey: "$constituencies.divisions.villages.villagekey"
                        }
                    }
                ]);
                res.status(200).json({
                    status: true,
                    villages: villagesResult,
                });
                break;
            }
            case 'te': {
                const [villagesResult, te_villagesResult] = yield Promise.all([
                    en_districmap_1.default.aggregate([
                        { $match: { districtkey: did } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": cid } },
                        { $unwind: "$constituencies.divisions" },
                        { $match: { "constituencies.divisions.divisionkey": dvid } },
                        { $unwind: "$constituencies.divisions.villages" },
                        {
                            $project: {
                                _id: "$constituencies.divisions.villages._id",
                                name: "$constituencies.divisions.villages.name",
                                pincode: "$constituencies.divisions.villages.pincode",
                                villagekey: "$constituencies.divisions.villages.villagekey"
                            }
                        }
                    ]),
                    te_districmap_1.default.aggregate([
                        { $match: { districtkey: did } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": cid } },
                        { $unwind: "$constituencies.divisions" },
                        { $match: { "constituencies.divisions.divisionkey": dvid } },
                        { $unwind: "$constituencies.divisions.villages" },
                        {
                            $project: {
                                _id: "$constituencies.divisions.villages._id",
                                name: "$constituencies.divisions.villages.name",
                                pincode: "$constituencies.divisions.villages.pincode",
                                villagekey: "$constituencies.divisions.villages.villagekey"
                            }
                        }
                    ]),
                ]);
                res.status(200).json({
                    status: true,
                    villages: villagesResult,
                    te_villagesResult: te_villagesResult
                });
                break;
            }
            case 'hi': {
                const [villagesResult, hi_villagesResult] = yield Promise.all([
                    en_districmap_1.default.aggregate([
                        { $match: { districtkey: did } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": cid } },
                        { $unwind: "$constituencies.divisions" },
                        { $match: { "constituencies.divisions.divisionkey": dvid } },
                        { $unwind: "$constituencies.divisions.villages" },
                        {
                            $project: {
                                _id: "$constituencies.divisions.villages._id",
                                name: "$constituencies.divisions.villages.name",
                                pincode: "$constituencies.divisions.villages.pincode",
                                villagekey: "$constituencies.divisions.villages.villagekey"
                            }
                        }
                    ]),
                    hi_districmap_1.default.aggregate([
                        { $match: { districtkey: did } },
                        { $unwind: "$constituencies" },
                        { $match: { "constituencies.constituencykey": cid } },
                        { $unwind: "$constituencies.divisions" },
                        { $match: { "constituencies.divisions.divisionkey": dvid } },
                        { $unwind: "$constituencies.divisions.villages" },
                        {
                            $project: {
                                _id: "$constituencies.divisions.villages._id",
                                name: "$constituencies.divisions.villages.name",
                                pincode: "$constituencies.divisions.villages.pincode",
                                villagekey: "$constituencies.divisions.villages.villagekey"
                            }
                        }
                    ]),
                ]);
                res.status(200).json({
                    status: true,
                    villages: villagesResult,
                    hi_villagesResult: hi_villagesResult
                });
                break;
            }
            default: {
                break;
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getAllVillagesPincode = getAllVillagesPincode;
const allDistrictsMasterdData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { did } = req.params;
        const { type } = req.query;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        const Model = districtModels[type];
        if (!Model) {
            return res.status(400).json({
                status: false,
                message: `No model found for type "${type}".`,
            });
        }
        let query = {};
        if (did && typeof did === 'string') {
            query = { districtkey: did };
        }
        const alldistricts = yield Model.find(query);
        return res.status(200).json({ status: true, alldistricts });
    }
    catch (err) {
        next(err);
    }
});
exports.allDistrictsMasterdData = allDistrictsMasterdData;
const confirm_districts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isPrivate } = req.body;
        const { did } = req.params;
        const { type } = req.query;
        if (!type || typeof type !== 'string') {
            return res.status(422).json({
                status: false,
                message: 'Invalid or missing type parameter.',
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(did)) {
            return res.status(400).json({ status: false, message: 'Invalid district ID.' });
        }
        if (!isPrivate) {
            return res.status(422).json({
                status: false,
                message: 'Private Mode is required.',
            });
        }
        const Model = districtModels[type];
        if (!Model) {
            return res.status(400).json({
                status: false,
                message: `No model found for type "${type}".`,
            });
        }
        yield Model.findByIdAndUpdate({ _id: did }, { $set: { private: isPrivate } }, { new: true });
        return res.status(200).json({ status: true, message: 'updated' });
    }
    catch (err) {
        next(err);
    }
});
exports.confirm_districts = confirm_districts;
//# sourceMappingURL=districts.js.map