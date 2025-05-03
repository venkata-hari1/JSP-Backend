import express from 'express'
import * as controller from '../controllers/Voter'
const router=express.Router()
router.post('/voterinfo',controller.create)
router.get('/voters',controller.Voters)
router.get('/voter/:id',controller.VoterInfo)
router.patch('/janasena/mission',controller.Janasena_Mission)
router.patch('/janasena/vision',controller.Janasena_Vision)
router.post('/janasena/schemes',controller.Government_Schemes)
router.get('/janasena',controller.GetSchemesVisionMission)
router.get('/admin/janasena',controller.GetSchemesVisionMission)
router.patch('/admin/scheme/:id',controller.Update_Schema)
router.patch('/admin/deletescheme/:pid/:cid',controller.deleteScheme)
router.post('/admin/mapdistricts',controller.mapDistricts1)
router.get('/admin/mapdistricts',controller.mapDistricts)
export default router