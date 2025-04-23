import mongoose from 'mongoose'
export type IProps={
    admin:string;
    email:string,
    password:string
}
const AuthSchema=new mongoose.Schema({
    admin:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true}
},{timestamps:true})
export default mongoose.model<IProps>('Auth',AuthSchema)