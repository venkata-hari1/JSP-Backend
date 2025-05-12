import express from 'express'
import Voter from './Voter'
import Auth from './Auth'
import Images from './Images'
import Districts from './District'
const router=express.Router()
router.use('/voter', Voter); 
router.use('/auth', Auth);
router.use('/images', Images);
router.use('/admin', Districts);
export default router