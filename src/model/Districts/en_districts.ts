import mongoose from 'mongoose';

const en_districts = new mongoose.Schema({
  district: { type: String },
  constituency: { type: String },
  division: { type: String },
  village: { type: String,  },
  pincode: { type: String,}
}, { timestamps: true });


export default mongoose.model('en_districts', en_districts)


