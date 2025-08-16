const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  doctor: { type: String, required: true },
  appointmentType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String },

  // Medical history fields
  smoke: { type: String },
  smokingYears: { type: Number },
  alcoholConsumption: { type: String },
  allergies: { type: String },
  allergiesDetails: { type: String },
  medication: { type: String },
  medicationDetails: { type: String },
  height: { type: Number },
  weight: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
