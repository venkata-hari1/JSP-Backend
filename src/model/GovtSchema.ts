import mongoose from 'mongoose';

const Scheme = new mongoose.Schema({
  scheme: { type: String, required: true },
  key:{type:String}
});

const GovernmentSchemes = new mongoose.Schema({
  english: [Scheme],
  hindi: [Scheme],
  telugu: [Scheme]
}, { timestamps: true });

export default mongoose.model('GovernmentSchemes', GovernmentSchemes);


