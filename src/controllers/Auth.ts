import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AuthSchema, { IProps } from '../model/AuthSchema'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { NodeType, PromiseType } from '../Utils/Type'
import ProfileImage from '../model/ProfileImage'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const indianPhoneRegex = /^[6-9]\d{9}$/;
export const register = async (
  req: Request<IProps>,
  res: Response,
  next: NextFunction
): PromiseType => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { admin,email, password } = req.body;
   // Check required fields
    if (!admin || !email || !password) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ status: false, message: 'All fields are required' });
    }
    const exist = await AuthSchema.findOne().session(session);
    if (exist) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ status: false, message: 'Admin already exists' });
    }
    // Validate email
    if (!emailRegex.test(email)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ status: false, message: 'Invalid email format' });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({status: false,message:'Password must be at least 8 characters long and include at least one letter and one number',});
    }

  

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new AuthSchema({admin, email, password: hash });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ status: true, message: 'Admin registered successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const login = async (req: Request<IProps>, res: Response, next: NextFunction):PromiseType => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ status: false, message: 'All fields are required' });
          }
        const exist = await AuthSchema.findOne({ email })
        if (!exist) {
            return res.status(404).json({ status: false, message: 'User not found' })
        }
        const isMatch = await bcrypt.compare(password, exist.password);
        if (!isMatch) {
            return res.status(422).json({ status: false, message: 'Invalid password' });
        }
        let payload = {
            user: {
                id: exist._id
            }
        }
        await AuthSchema.findByIdAndUpdate({_id:exist._id},{$set:{isAdmin:true}},{new:true})
        jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '10d' }, (err, token) => {
            if (err) {
                return res.status(401).json({ status: false, message: 'Token generation falied' })
            }
            return res.status(200).json({ status: true, message: 'Login successfully', token })
        })

    }
    catch (err) {
        next(err)
    }
}
export const EditUser = async (req:Request<IProps > | NodeType, res: Response, next: NextFunction): PromiseType => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { email, password,admin,mobile,name } = req.body;
      if(name){
        if(name.length<3){
          await session.abortTransaction();
          session.endSession();
          return res.status(422).json({status:false,message:'Name must be at least 3 characters'})
        }
      }
      if (email && !emailRegex.test(email)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(422).json({ status: false, message: 'Invalid email format' });
      }
  
      if (password && !passwordRegex.test(password)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(422).json({
          status: false,
          message: 'Password must be at least 8 characters long and include at least one letter and one number',
        });
      }
  
      if (mobile && !indianPhoneRegex.test(mobile)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(422).json({
          status: false,
          message: 'Invalid Indian mobile number. It must be 10 digits starting with 6-9.',
        });
      }
  
      const user = await AuthSchema.findById(req.user.id).select('name admin email').session(session);
  
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ status: false, message: 'User not found' });
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if(admin) user.admin=admin;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      if(mobile) user.mobile=mobile
  
      await user.save({ session });
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({ status: true, message: 'User updated successfully', user });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  };
export const getUser=async(req:NodeType,res:Response,next:NextFunction)=>{
try{
  const data=await AuthSchema.findById(req.user.id).select('name admin email password mobile')
  res.status(200).json({status:true,data})
  return

}
catch(err){
  next(err)
}
}