import express, { NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import AuthSchema from '../model/AuthSchema';
import { NodeType, PromiseType } from './Type';
interface CustomRequest extends express.Request {
    user?: any;
}

export const Validate=async(req: CustomRequest, res: express.Response, next: NextFunction):PromiseType=>{
    try{
        const token=req.header('token')
        if(!token){
            return res.status(401).json({message:'invalid token'})
        }
        const decode:NodeType=jwt.verify(token,process.env.JWT_SECRET as string)
        req.user = decode.user;
        const exist=await AuthSchema.findById(req.user.id)
        if(!exist){
            return res.status(401).json({message:'Access denied'})
        }
        next()
    }
    catch(err){
        next(err)
    }
}



