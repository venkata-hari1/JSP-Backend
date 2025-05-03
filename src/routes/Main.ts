import express from 'express'
import Voter from './Voter'
import Auth from './Auth'
import Images from './Images'
import { Validate } from '../Utils/Validation'
const router=express.Router()
router.use('/voter', Voter); 
router.use('/auth', Auth);
router.use('/images', Images);
export default router