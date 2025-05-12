import mongoose from 'mongoose'
export type IProps={
    admin:string;
    email:string;
    mobile:string;
    password:string;
}
const AuthSchema=new mongoose.Schema({
    admin:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    mobile:{type:String},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
    private:{type:Boolean,default:false}
},{timestamps:true})
export default mongoose.model<IProps>('Auth',AuthSchema)