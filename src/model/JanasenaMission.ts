import mongoose from 'mongoose'

export type IMissionProps={
    en_mission:string,
    hi_mission:string,
    te_mission:string,
}
const JanasenaMission=new mongoose.Schema({
en_mission:{type:String},
hi_mission:{type:String},
te_mission:{type:String},

},{timestamps:true})
export default mongoose.model<IMissionProps>("janasenamission",JanasenaMission)