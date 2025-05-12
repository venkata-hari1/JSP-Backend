"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Validation_1 = require("../Utils/Validation");
const districts_1 = require("../controllers/districts");
const router = express_1.default.Router();
router.post('/create_districts', Validation_1.Validate, districts_1.create_districts);
router.patch('/create_constituencies/:districtkey', Validation_1.Validate, districts_1.create_constituencies);
router.patch('/create_divison/:did/:cid', Validation_1.Validate, districts_1.create_divisons);
router.patch('/create_village_pincode/:did/:cid/:dvid', Validation_1.Validate, districts_1.create_Village_Pincode);
router.get('/district/:id', Validation_1.Validate, districts_1.district);
router.get('/districts', Validation_1.Validate, districts_1.districts);
router.get('/alldistrictsdata', Validation_1.Validate, districts_1.allDistrictsdata);
router.get('/allConstituationData/:districtkey', Validation_1.Validate, districts_1.allConstituationData);
router.get('/allDivionsData/:did/:cid', Validation_1.Validate, districts_1.allDivisonsData);
router.get('/allVillagesData/:did/:cid/:dvid', Validation_1.Validate, districts_1.getAllVillagesPincode);
router.get('/alldistricts_master_data', districts_1.allDistrictsMasterdData);
router.patch('/confirm_district_mode/:did', districts_1.confirm_districts);
exports.default = router;
//# sourceMappingURL=District.js.map