import express, { Request,Response,NextFunction } from 'express'
import Voter from '../model/Voter'
export const create=async(req:Request,res:Response,next:NextFunction)=>{
try{
    const data=await Voter.create({...req.body})
    res.status(200).json({status:true,data})
}
catch(err){
    next(err)
}
}

export const get=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data=await Voter.find({})
        res.status(200).json({status:true,data})
    }
    catch(err){
        next(err)
    }
    }