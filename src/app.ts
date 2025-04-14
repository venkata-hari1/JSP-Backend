import express, {Request,Response, NextFunction } from 'express'
import logger from './Utils/WistonConfig'
import dotenv from 'dotenv'
import MainRoute from './routes/Main'
import { ConnectDb } from './connect/db'
dotenv.config()
const app=express()
const PORT=process.env.PORT || '80'
const MONGO_URL=process.env.MONGOURL || ''
//middlewares
app.use(express.json())
app.use('/api',MainRoute)
app.use((req:Request,res:Response)=>{
    res.status(404).json({message:'Page Not Found'})
})
app.use((err:{status:number ,message:string,stack:string},req:Request,res:Response,next:NextFunction)=>{
    const errStatus=err.status || 500
    const errMessage=err.message || 'Internal Server Error'
    res.status(errStatus).json({
        success:false,
        status:errStatus,
        message:errMessage,
        stack:err.stack
    })
})

const startServer=async()=>{
    try{
        if(!MONGO_URL){
            logger.error('MONGOURL Not Found')
        }
        await ConnectDb(MONGO_URL)
        app.listen(PORT,()=>{
            logger.info(`Server running on port ${PORT}`);
        })
    }
    catch(error){
        logger.error('Failed to start server:',error)
    }
}
startServer()