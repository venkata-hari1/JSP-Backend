import express from 'express'
import Voter from './Voter'
const router=express.Router()
router.use('/',Voter)
export default router