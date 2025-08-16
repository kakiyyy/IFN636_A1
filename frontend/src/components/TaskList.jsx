"use client"

import { useAuth } from "../context/AuthContext"
import axiosInstance from "../axiosConfig"

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth()

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setTasks(tasks.filter((t) => t._id !== taskId))
    } catch (error) {
      alert("Failed to delete appointment.")
    }
  }

  if (!tasks.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
        <p className="text-gray-500">Your scheduled appointments will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Your Appointments</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {tasks.length} appointment{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {tasks.map((t) => (
        <div
          key={t._id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Full Name: {t.fullName}</h3>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
  <div className="flex-1 space-y-2">
    <div className="flex items-center text-sm">
      <span className="font-semibold">Doctor:</span>
      <span className="text-gray-600 ml-2">{t.doctor}</span>
    </div>
  </div>

  <div className="flex-1 space-y-2">
    <div className="flex items-center text-sm">
      <span className="font-semibold">Appointment Type:</span>
      <span className="text-gray-600 ml-2">{t.appointmentType}</span>
    </div>
    <div className="flex items-center text-sm">
  <span className="font-semibold">DateTime:</span>
  <span className="text-gray-600 ml-2">
    {t.date ? new Date(t.date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }) : "-"}
    {t.time && ` at ${t.time}`}
  </span>
</div>
  </div>
</div>


          

          {t.notes && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Notes:</span> {t.notes}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
            onClick={() => setEditingTask(t)} // This sets the task to edit
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-amber-200 hover:border-amber-300"
            >
              Edit Appointment
            </button>

            <button
              onClick={() => handleDelete(t._id)}
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

export default TaskList
