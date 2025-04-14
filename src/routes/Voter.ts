import express from 'express'
import * as controller from '../controllers/Voter'
const router=express.Router()
router.post('/voterinfo',controller.create)
export default router