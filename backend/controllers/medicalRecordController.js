const MedicalRecord = require("../models/MedicalRecord")

const getMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(medicalRecords)
  } catch (error) {
    console.error("Error fetching medical records:", error)
    res.status(500).json({ message: "Failed to fetch medical records." })
  }
}

const addMedicalRecord = async (req, res) => {
  const { patientName, doctor, dateOfBirth, diagnose, treatment } = req.body

  try {
    const medicalRecord = await MedicalRecord.create({
      userId: req.user.id,
      patientName,
      doctor,
      dateOfBirth,
      diagnose,
      treatment,
    })

    res.status(201).json(medicalRecord)
  } catch (error) {
    console.error("Error creating medical record:", error)
    res.status(500).json({ message: "Failed to create medical record." })
  }
}

const updateMedicalRecord = async (req, res) => {
  const { patientName, doctor, dateOfBirth, diagnose, treatment } = req.body

  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
    if (!medicalRecord) return res.status(404).json({ message: "Medical record not found" })

    // Ensure the logged-in user is the one who created the medical record
    if (String(medicalRecord.userId) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" })

    // Update the medical record with the new data if provided
    if (patientName !== undefined) medicalRecord.patientName = patientName
    if (doctor !== undefined) medicalRecord.doctor = doctor
    if (dateOfBirth !== undefined) medicalRecord.dateOfBirth = dateOfBirth
    if (diagnose !== undefined) medicalRecord.diagnose = diagnose
    if (treatment !== undefined) medicalRecord.treatment = treatment

    // Save the updated medical record
    const updatedMedicalRecord = await medicalRecord.save()
    res.json(updatedMedicalRecord)
  } catch (error) {
    console.error("Error updating medical record:", error)
    res.status(500).json({ message: "Failed to update medical record." })
  }
}

const deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
    if (!medicalRecord) return res.status(404).json({ message: "Medical record not found" })

    // Make sure the medical record belongs to the logged-in user
    if (String(medicalRecord.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await MedicalRecord.deleteOne({ _id: req.params.id })
    res.json({ message: "Medical record deleted" })
  } catch (error) {
    console.error("Error deleting medical record:", error)
    res.status(500).json({ message: "Failed to delete medical record." })
  }
}

module.exports = { getMedicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord }
