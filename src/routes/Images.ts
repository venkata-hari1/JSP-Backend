import express from 'express'
import multer from 'multer';
import * as controller from '../controllers/Images'
import { Validate } from '../Utils/Validation';
const router=express.Router()
const upload = multer({ storage: multer.memoryStorage() });
router.post('/uploadimage',Validate ,upload.single('file'),controller.uploadImage)
router.get('/fetchimages',controller.getImages)
router.delete('/deleteimage/:public_id',Validate ,controller.deleteImage)
export default router