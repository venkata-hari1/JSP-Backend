import express from 'express'
import multer from 'multer';
import * as controller from '../controllers/Images'
const router=express.Router()
const upload = multer({ storage: multer.memoryStorage() });
router.post('/uploadimage',upload.single('file'),controller.uploadImage)
router.get('/fetchimages',controller.getImages)
router.delete('/deleteimage/:public_id',controller.deleteImage)
export default router