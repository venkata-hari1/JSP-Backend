import mongoose from 'mongoose'
const Images = new mongoose.Schema({
  url: String,
  public_id: String,
},{timestamps:true});

export default mongoose.model('Images', Images);
