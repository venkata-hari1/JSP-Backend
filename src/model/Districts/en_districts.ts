import mongoose from 'mongoose';

const en_districts = new mongoose.Schema({
  district: { type: String },
  districtkey: { type: String },
  constituency: { type: String },
  constituencykey: { type: String },
  division: { type: String },
  divisionkey: { type: String },
  village: { type: String, },
  pincode: { type: String, }
}, { timestamps: true });

en_districts.index(
  { district: 1, constituency: 1, division: 1, village: 1, pincode: 1 },
  { unique: true }
);
export default mongoose.model('en_districts', en_districts)


