import mongoose from 'mongoose';

const hi_districts = new mongoose.Schema({
  district: { type: String },
  constituency: { type: String },
  division: { type: String },
  village: { type: String},
  pincode: { type: String}
}, { timestamps: true });


export default mongoose.model('hi_districts', hi_districts)