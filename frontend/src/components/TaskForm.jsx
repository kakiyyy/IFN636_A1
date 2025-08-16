"use client"
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const DOCTORS = ["Dr. Smith", "Dr. Johnson", "Dr. Lee", "Dr. Patel"];
const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Procedure", "Telehealth"];
const generateTimeSlots = (start, end) => {
  const slots = [];
  const startTime = new Date(start);
  const endTime = new Date(end);

  while (startTime < endTime) {
    const timeString = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    slots.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + 15); // Increment by 15 minutes
  }

  return slots;
};

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();

  const empty = useMemo(
    () => ({
      fullName: "",
      doctor: "",
      appointmentType: "",
      date: "",
      time: "",
      notes: "",
      smoke: "",
      smokingYears: "",
      alcoholConsumption: "",
      allergies: "",
      allergiesDetails: "",
      medication: "",
      medicationDetails: "",
      height: "",
      weight: "",
    }),
    []
  );

  const [formData, setFormData] = useState(empty);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        fullName: editingTask.fullName || "",
        doctor: editingTask.doctor || "",
        appointmentType: editingTask.appointmentType || "",
        date: editingTask.date ? editingTask.date.substring(0, 10) : "",
        time: editingTask.time || "",
        notes: editingTask.notes || "",
        smoke: editingTask.smoke || "",
        smokingYears: editingTask.smokingYears || "",
        alcoholConsumption: editingTask.alcoholConsumption || "",
        allergies: editingTask.allergies || "",
        allergiesDetails: editingTask.allergiesDetails || "",
        medication: editingTask.medication || "",
        medicationDetails: editingTask.medicationDetails || "",
        height: editingTask.height || "",
        weight: editingTask.weight || "",
      });
    } else {
      setFormData(empty);
    }
  }, [editingTask, empty]);

    useEffect(() => {
    if (formData.date && formData.doctor) {
      // Generate available time slots when doctor and date are selected
      const slots = generateTimeSlots("2025-08-16T09:00:00", "2025-08-16T17:00:00");
      setAvailableTimeSlots(slots);
    }
  }, [formData.date, formData.doctor]);

  const handleSmokeChange = (value) => {
    setFormData({
      ...formData,
      smoke: value,
      smokingYears: value === "no" ? "" : formData.smokingYears,
    });
  };

  const handleAlcoholChange = (value) => {
    setFormData({ ...formData, alcoholConsumption: value });
  };

  const handleAllergiesChange = (value) => {
    setFormData({ ...formData, allergies: value, allergiesDetails: "" });
  };

  const handleMedicationChange = (value) => {
    setFormData({ ...formData, medication: value, medicationDetails: "" });
  };

  const field = (id, label, inputEl, required = false) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {inputEl}
    </div>
  );

  const handleSubmitStep1 = () => {
    setCurrentStep(2);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Ensure time is not empty
  if (!formData.time) {
    alert("Please select a time.");
    return;
  }

  // Extract hour and minute from time string (HH:MM format)
  const [, minute] = formData.time.split(":");  // Only extract minute

  console.log("Selected time:", formData.time);  // Log the time value
  console.log("Minute:", minute);  // Log the minute value

  // Convert minute to number
  const minuteNumber = parseInt(minute, 10);

  // Validate minute: Check if it's a multiple of 15
  if (isNaN(minuteNumber) || minuteNumber % 15 !== 0) {
    alert("Please select a time that is a multiple of 15 minutes.");
    return;
  }

  try {
    const payload = { ...formData };
    if (payload.date) payload.date = new Date(payload.date).toISOString();

    if (editingTask) {
      const { data } = await axiosInstance.put(`/api/tasks/${editingTask._id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
    } else {
      const { data } = await axiosInstance.post("/api/tasks", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks([...tasks, data]);
    }
    setEditingTask(null);
    setFormData(empty);
    setCurrentStep(1);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to save appointment.");
  }
};



  const renderStep1 = () => (
    <div className="space-y-6">
      {field("fullName", "Full name", <input
        id="fullName"
        type="text"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Enter your full name"
      />, true)}


      {field("doctor", "Doctor", <select
        id="doctor"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
        value={formData.doctor}
        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
      >
        <option value="" disabled>Select a doctor</option>
        {DOCTORS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>, true)}

      {field("appointmentType", "Appointment type", <select
        id="appointmentType"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
        value={formData.appointmentType}
        onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
      >
        <option value="" disabled>Select a type</option>
        {APPOINTMENT_TYPES.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>, true)}

      {field("date", "Date", <input
        id="date"
        type="date"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />)}

      {field("time", "Time", 
  <select
    id="time"
    value={formData.time}
    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  >
    <option value="" disabled>Select a time</option>
    {availableTimeSlots.map((time, idx) => (
      <option key={idx} value={time}>{time}</option>
    ))}
  </select>
)}



      {field("notes", "Notes", <textarea
        id="notes"
        rows="3"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Any remarks for the doctor"
      />)}

      <button
        type="button"
        onClick={handleSubmitStep1}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
      >
        Continue to Medical History →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {field(
        "smoke",
        "Do you smoke?",
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="smoke"
              value="yes"
              onChange={() => handleSmokeChange("yes")}
              checked={formData.smoke === "yes"}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Yes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="smoke"
              value="no"
              onChange={() => handleSmokeChange("no")}
              checked={formData.smoke === "no"}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">No</span>
          </label>
        </div>,
      )}

      {formData.smoke === "yes" &&
        field(
          "smokingYears",
          "Please select the number of years you have been smoking.",
          <input
            id="smokingYears"
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={formData.smokingYears}
            onChange={(e) => setFormData({ ...formData, smokingYears: e.target.value })}
            placeholder="Number of years"
          />,
        )}

      {field(
        "alcoholConsumption",
        "How often do you drink alcohol?",
        <select
          id="alcoholConsumption"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
          value={formData.alcoholConsumption}
          onChange={(e) => handleAlcoholChange(e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="not at all">Not at all</option>
          <option value="rarely">Rarely</option>
          <option value="less than 2">Less than 2 standard drinks per day</option>
          <option value="more than 2">More than 2 standard drinks per day</option>
          <option value="more than 4">More than 4 standard drinks per day</option>
        </select>,
        true,
      )}

      
{field(
  "allergies",
  "Do you suffer from any allergies?",
  <div className="flex gap-6">
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="allergies"
        value="yes"
        onChange={() => handleAllergiesChange("yes")}
        checked={formData.allergies === "yes"}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700">Yes</span>
    </label>
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="allergies"
        value="no"
        onChange={() => handleAllergiesChange("no")}
        checked={formData.allergies === "no"}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700">No</span>
    </label>
  </div>
)}

{formData.allergies === "yes" && // Only show this if 'Yes' is selected
  field(
    "allergiesDetails",
    "Please provide details about your allergies.",
    <textarea
      id="allergiesDetails"
      rows="4"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      value={formData.allergiesDetails} // Corrected variable name here
      onChange={(e) => setFormData({ ...formData, allergiesDetails: e.target.value })}
      placeholder="Details about allergies"
    />
  )
}
      {field(
        "medication",
        "Are you currently taking any medication?",
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="medication"
              value="yes"
              onChange={(e) => handleMedicationChange("yes")}
              checked={formData.medication === "yes"}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Yes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="medication"
              value="no"
              onChange={(e) => handleMedicationChange("no")}
              checked={formData.medication === "no"}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">No</span>
          </label>
        </div>,
      )}

      {formData.medication === "yes" && // Only show this if 'Yes' is selected
  field(
    "medicationDetails",
    "Please provide details about your medication Details.",
    <textarea
      id="medicationDetails"
      rows="4"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      value={formData.medicationDetails} // Corrected variable name here
      onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
      placeholder="Details about medication"
    />
  )
}


      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-300"
        >
          ← Back to Appointment Details
        </button>

        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-200"
        >
          Submit Appointment
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white">{editingTask ? "Edit Appointment" : "Book New Appointment"}</h1>
        <div className="flex items-center mt-3">
          <div className={`flex items-center ${currentStep >= 1 ? "text-white" : "text-blue-200"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? "bg-white text-blue-600" : "bg-blue-500"}`}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium">Appointment Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-blue-400 mx-4"></div>
          <div className={`flex items-center ${currentStep >= 2 ? "text-white" : "text-blue-200"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? "bg-white text-blue-600" : "bg-blue-500"}`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium">Medical History</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </form>
    </div>
  )
}

export default TaskForm
