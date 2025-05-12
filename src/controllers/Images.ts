import {Request,Response,NextFunction} from 'express'
const cloudinary = require('cloudinary').v2;
import { NodeType, PromiseType } from '../Utils/Type';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadImage = async (req: NodeType, res: Response, next: NextFunction):PromiseType => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(422).json({status:false, message: 'Image file is required' });
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(422).json({status:false, message: 'Only JPG, PNG, JPEG, and WEBP images are allowed' });
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(22).json({ status:false,message: 'Image must not exceed 2MB' });
        }
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'my_uploads' },
            async (error: string, result: { secure_url: string; public_id: string }) => {
                if (error) return res.status(500).json({ error });
                res.status(200).json({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        stream.end(req.file.buffer);
    } catch (err) {
        next(err);
    }
};
export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const public_id = `my_uploads/${req.params.public_id}`;
      const cloudinaryResult = await cloudinary.uploader.destroy(public_id);
  
      if (cloudinaryResult.result !== 'ok') {
        res.status(500).json({ status:false,message: 'Cloudinary deletion failed' });
      }
  
     res.status(200).json({ status: true, message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'my_uploads/',
        max_results: 100, 
      });
      res.status(200).json({status:true,result:result.resources});
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
    }
  };
  