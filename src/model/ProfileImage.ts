import mongoose from 'mongoose'
const ProfileImage = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId},
  url: String,
  public_id: String,
},{timestamps:true});

export default mongoose.model('ProfileImage', ProfileImage);
