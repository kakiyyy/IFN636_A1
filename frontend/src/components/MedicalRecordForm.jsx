import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import axiosInstance from "../axiosConfig"

const DOCTORS = ["Dr. Smith", "Dr. Johnson", "Dr. Lee", "Dr. Patel"]

const MedicalRecordForm = ({ medicalRecords, setMedicalRecords, editingRecord, setEditingRecord }) => {
  const { user } = useAuth()

  const empty = useMemo(
    () => ({
      patientName: "",
      doctor: "",
      dateOfBirth: "",
      diagnose: "",
      treatment: "",
    }),
    [],
  )

  const [formData, setFormData] = useState(empty)

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        patientName: editingRecord.patientName || "",
        doctor: editingRecord.doctor || "",
        dateOfBirth: editingRecord.dateOfBirth ? editingRecord.dateOfBirth.substring(0, 10) : "",
        diagnose: editingRecord.diagnose || "",
        treatment: editingRecord.treatment || "",
      })
    } else {
      setFormData(empty)
    }
  }, [editingRecord, empty])

  const field = (id, label, inputEl, required = false) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {inputEl}
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = { ...formData }
      if (payload.dateOfBirth) payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString()

      if (editingRecord) {
        const { data } = await axiosInstance.put(`/api/medical-records/${editingRecord._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setMedicalRecords(medicalRecords.map((r) => (r._id === data._id ? data : r)))
      } else {
        const { data } = await axiosInstance.post("/api/medical-records", payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setMedicalRecords([...medicalRecords, data])
      }
      setEditingRecord(null)
      setFormData(empty)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save medical record.")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white">
          {editingRecord ? "Edit Medical Record" : "Add New Medical Record"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {field(
            "patientName",
            "Patient Name",
            <input
              id="patientName"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="Enter patient's full name"
            />,
            true,
          )}

          {field(
            "doctor",
            "Doctor",
            <select
              id="doctor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
            >
              <option value="" disabled>
                Select a doctor
              </option>
              {DOCTORS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>,
            true,
          )}

          {field(
            "dateOfBirth",
            "Date of Birth",
            <input
              id="dateOfBirth"
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />,
            true,
          )}

          {field(
            "diagnose",
            "Diagnosis",
            <textarea
              id="diagnose"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              value={formData.diagnose}
              onChange={(e) => setFormData({ ...formData, diagnose: e.target.value })}
              placeholder="Enter diagnosis details"
            />,
            true,
          )}

          {field(
            "treatment",
            "Treatment",
            <textarea
              id="treatment"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              placeholder="Enter treatment plan and medications"
            />,
            true,
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-200"
          >
            {editingRecord ? "Update Medical Record" : "Save Medical Record"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MedicalRecordForm
