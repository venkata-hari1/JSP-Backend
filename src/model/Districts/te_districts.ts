import mongoose from 'mongoose';

const te_districts = new mongoose.Schema({
  district: { type: String },
  districtkey: { type: String },
  constituency: { type: String },
  constituencykey: { type: String },
  division: { type: String },
  divisionkey: { type: String },
  village: { type: String, },
  pincode: { type: String, }
}, { timestamps: true });

te_districts.index(
  { district: 1,districtkey:1, constituency: 1, division: 1, village: 1, pincode: 1 },
  { unique: true }
);

export default mongoose.model('te_districts', te_districts)