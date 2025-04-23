import express from 'express'
import Voter from './Voter'
import Auth from './Auth'
import { Validate } from '../Utils/Validation'
const router=express.Router()
router.use('/api',Voter)
router.use('/auth',Auth)
export default router