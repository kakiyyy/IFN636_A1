import { useState, useEffect } from "react"
import axiosInstance from "../axiosConfig"
import MedicalRecordForm from "../components/MedicalRecordForm"
import MedicalRecordList from "../components/MedicalRecordList"
import { useAuth } from "../context/AuthContext"

const MedicalRecords = () => {
  const { user } = useAuth()
  const [medicalRecords, setMedicalRecords] = useState([])
  const [editingRecord, setEditingRecord] = useState(null)

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axiosInstance.get("/api/medical-records", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setMedicalRecords(response.data)
      } catch (error) {
        alert("Failed to fetch medical records.")
      }
    }

    fetchMedicalRecords()
  }, [user])

  return (
    <div className="container mx-auto p-6">
      <MedicalRecordForm
        medicalRecords={medicalRecords}
        setMedicalRecords={setMedicalRecords}
        editingRecord={editingRecord}
        setEditingRecord={setEditingRecord}
      />
      <MedicalRecordList
        medicalRecords={medicalRecords}
        setMedicalRecords={setMedicalRecords}
        setEditingRecord={setEditingRecord}
      />
    </div>
  )
}

export default MedicalRecords
