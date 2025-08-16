import { useAuth } from "../context/AuthContext"
import axiosInstance from "../axiosConfig"

const MedicalRecordList = ({ medicalRecords, setMedicalRecords, setEditingRecord }) => {
  const { user } = useAuth()

  const handleDelete = async (recordId) => {
    try {
      await axiosInstance.delete(`/api/medical-records/${recordId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setMedicalRecords(medicalRecords.filter((r) => r._id !== recordId))
    } catch (error) {
      alert("Failed to delete medical record.")
    }
  }

  if (!medicalRecords.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No medical records yet</h3>
        <p className="text-gray-500">Patient medical records will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Medical Records</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          {medicalRecords.length} record{medicalRecords.length !== 1 ? "s" : ""}
        </span>
      </div>

      {medicalRecords.map((record) => (
        <div
          key={record._id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Patient: {record.patientName}</h3>
              <p className="text-sm text-gray-500">
                Created:{" "}
                {new Date(record.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-semibold">Doctor:</span>
                <span className="text-gray-600 ml-2">{record.doctor}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-semibold">Date of Birth:</span>
                <span className="text-gray-600 ml-2">
                  {record.dateOfBirth ? new Date(record.dateOfBirth).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm">
                <span className="font-medium text-blue-700">Diagnosis:</span>
                <span className="text-gray-700 ml-2">{record.diagnose}</span>
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm">
                <span className="font-medium text-green-700">Treatment:</span>
                <span className="text-gray-700 ml-2">{record.treatment}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setEditingRecord(record)}
              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-amber-200 hover:border-amber-300"
            >
              Edit Record
            </button>

            <button
              onClick={() => handleDelete(record._id)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MedicalRecordList
