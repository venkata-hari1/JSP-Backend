import mongoose from 'mongoose';

const Scheme = new mongoose.Schema({
  scheme: { type: String, required: true },
  option: { type: String, required: true },
  key:{ type: String, required: true },
});

const GovernmentSchemes = new mongoose.Schema({
  english: [Scheme],
  hindi: [Scheme],
  telugu: [Scheme]
}, { timestamps: true });

export default mongoose.model('GovernmentSchemes', GovernmentSchemes);
