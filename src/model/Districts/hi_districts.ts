import mongoose from 'mongoose';

const hi_districts = new mongoose.Schema({
  district: { type: String },
  districtkey: { type: String },
  constituency: { type: String },
  constituencykey: { type: String },
  division: { type: String },
  divisionkey: { type: String },
  village: { type: String, },
  pincode: { type: String, }
}, { timestamps: true });


hi_districts.index(
  { district: 1, constituency: 1, division: 1, village: 1, pincode: 1 },
  { unique: true }
);
export default mongoose.model('hi_districts', hi_districts)