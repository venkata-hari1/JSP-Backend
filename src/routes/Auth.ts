import express from 'express'
import *  as controller from '../controllers/Auth'
import { Validate } from '../Utils/Validation'
const router=express.Router()
router.post('/register',controller.register)
router.post('/login',controller.login)
router.patch('/edituser',Validate,controller.EditUser)
export default router