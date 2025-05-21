import express from 'express'
import multer from 'multer';
import * as controller from '../controllers/Images'
import { Validate } from '../Utils/Validation';
const router=express.Router()
const upload = multer({ storage: multer.memoryStorage() });
router.post('/uploadimage',Validate ,upload.single('file'),controller.uploadImage)
router.get('/fetchimages',controller.getImages)
router.delete('/deleteimage/:id',Validate ,controller.deleteImage)


router.post('/uploadprofle',Validate ,upload.single('file'),controller.UploadPrfoile)
router.get('/getProfile',Validate,controller.ProfileImage)
router.delete('/deleteProfile/:id',Validate ,controller.deleteProfile)
export default router