const mongoose = require("mongoose")

const medicalRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    doctor: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    diagnose: { type: String, required: true },
    treatment: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema)
