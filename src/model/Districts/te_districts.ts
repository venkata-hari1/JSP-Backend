import mongoose from 'mongoose';

const te_districts = new mongoose.Schema({
  district: { type: String },
  constituency: { type: String },
  division: { type: String },
  village: { type: String},
  pincode: { type: String}
}, { timestamps: true });
;

export default mongoose.model('te_districts', te_districts)