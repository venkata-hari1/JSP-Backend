import {Request,Response,NextFunction} from 'express'
const cloudinary = require('cloudinary').v2;
import { NodeType, PromiseType } from '../Utils/Type';
import dotenv from 'dotenv';
import ProfileImageSchema from '../model/ProfileImage'
import Images from '../model/Images';
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
            return res.status(422).json({ status:false,message: 'Image must not exceed 2MB' });
        }
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'my_uploads' },
            async (error: string, result: { secure_url: string; public_id: string }) => {
                if (error) return res.status(500).json({ error });
                await Images.create({user:req.user.id,url:result.secure_url,public_id:result.public_id})
                res.status(200).json({
                  status:true,
                  message:'Image uploaded successfully',
                    url: result.secure_url,
                    public_id: result.public_id,
                });
                return
            }
        );

        stream.end(req.file.buffer);
    } catch (err) {
        next(err);
    }
};
export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const image = await Images.findById(id);
    if (!image) {
      res.status(404).json({ status:false,message: 'Image not found' })
      return 
    }
    // Delete from Cloudinary
    await Promise.all([
      image.deleteOne(),
      cloudinary.uploader.destroy(image.public_id)
    ])
    
    res.status(200).json({status:true, message: 'Image deleted successfully' });
    return
  } catch (err) {
    next(err)
  }
  };

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Images.find()
      res.status(200).json({status:true,result:result});
      return
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
      return
    }
  };


  export const UploadPrfoile = async (req:NodeType, res: Response,next:NextFunction):PromiseType => {
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
          return res.status(422).json({ status:false,message: 'Image must not exceed 2MB' });
      }
      const stream = cloudinary.uploader.upload_stream(
          { folder: 'my_uploads' },
          async (error: string, result: { secure_url: string; public_id: string }) => {
              if (error) return res.status(500).json({ error });
              await ProfileImageSchema.create({user:req.user.id,url:result.secure_url,public_id:result.public_id})
              res.status(200).json({
                 status:true,
                 message:'Image uploaded successfully',
                  url: result.secure_url,
                  public_id: result.public_id,
              });
              return
          }
      );

      stream.end(req.file.buffer);
  } catch (err) {
      next(err);
  }
  };
  
  // Get single Image
  export const ProfileImage = async (_req: Request, res: Response,next:NextFunction) => {
    try {
      const images = await ProfileImageSchema.find().sort({ createdAt: -1 });
      res.status(200).json(images);
      return
    } catch (err) {
      next(err)
    }
  };
  
  // Delete Image
  export const deleteProfile = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { id } = req.params;
  
      const image = await ProfileImageSchema.findById(id);
      if (!image) {
        res.status(404).json({status:false, message: 'Image not found' })
        return 
      }
      // Delete from Cloudinary
      await Promise.all([
        image.deleteOne(),
        cloudinary.uploader.destroy(image.public_id)
      ])
      
      res.status(200).json({statua:true, message: 'Image deleted successfully' });
      return
    } catch (err) {
      next(err)
    }
  };
  