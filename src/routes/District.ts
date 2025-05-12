import express from 'express'
import {Validate} from '../Utils/Validation'
import {  allConstituationData, allDistrictsdata,  allDistrictsMasterdData,  allDivisonsData, confirm_districts, create_constituencies, create_districts, create_divisons, create_Village_Pincode, district, districts, getAllVillagesPincode } from '../controllers/districts'
const router=express.Router()
router.post('/create_districts',Validate,create_districts)
router.patch('/create_constituencies/:districtkey',Validate,create_constituencies)
router.patch('/create_divison/:did/:cid',Validate,create_divisons)
router.patch('/create_village_pincode/:did/:cid/:dvid',Validate,create_Village_Pincode)
router.get('/district/:id',Validate,district)
router.get('/districts',Validate,districts)
router.get('/alldistrictsdata',Validate,allDistrictsdata)
router.get('/allConstituationData/:districtkey',Validate,allConstituationData)
router.get('/allDivionsData/:did/:cid',Validate,allDivisonsData)
router.get('/allVillagesData/:did/:cid/:dvid',Validate,getAllVillagesPincode)
router.get('/alldistricts_master_data',allDistrictsMasterdData)
router.patch('/confirm_district_mode/:did',confirm_districts)
export default router