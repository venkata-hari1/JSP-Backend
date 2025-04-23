import mongoose from 'mongoose'
const Janasena=new mongoose.Schema({
    en_vision:{type:String},
    hi_vision:{type:String},
    te_vision:{type:String},

},{timestamps:true})
export default mongoose.model("janasena",Janasena)