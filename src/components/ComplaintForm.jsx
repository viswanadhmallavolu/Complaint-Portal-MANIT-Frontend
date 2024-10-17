import React, { useState } from "react";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    roomNumber: "",
    hostelNumber: "",
    complaintType: "",
    description: "",
    dateReported: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student ID is required";
    if (!formData.studentName)
      newErrors.studentName = "Student Name is required";
    if (!formData.roomNumber) newErrors.roomNumber = "Room Number is required";
    if (!formData.hostelNumber)
      newErrors.hostelNumber = "Hostel Number is required";
    if (!formData.complaintType)
      newErrors.complaintType = "Complaint Type is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.dateReported)
      newErrors.dateReported = "Date Reported is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Data Submitted: ", formData);
      // Handle the form submission here (e.g., API call)
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="p-8 bg-transparent shadow-md rounded-lg max-w-[1200px] mx-auto">
      <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        <div className="mb-4">
          <label htmlFor="studentId" className="block text-white">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.studentId && (
            <p className="text-red-500">{errors.studentId}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="studentName" className="block text-white">
            Student Name
          </label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.studentName && (
            <p className="text-red-500">{errors.studentName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="studentName" className="block text-white">
            Hostel Number
          </label>
          <input
            type="text"
            id="hostelNumber"
            name="hostelNumber"
            value={formData.hostelNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.hostelNumber && (
            <p className="text-red-500">{errors.hostelNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="roomNumber" className="block text-white">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.roomNumber && (
            <p className="text-red-500">{errors.roomNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="complaintType" className="block text-white">
            Complaint Type
          </label>
          <select
            id="complaintType"
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a type</option>
            {[
              "Maintenance",
              "Hygiene",
              "Security",
              "Mess",
              "Bathroom",
              "Room",
              "Noise",
              "Other",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.complaintType && (
            <p className="text-red-500">{errors.complaintType}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            rows={1}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="dateReported" className="block text-white">
            Date Reported
          </label>
          <input
            type="date"
            id="dateReported"
            name="dateReported"
            value={formData.dateReported}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateReported && (
            <p className="text-red-500">{errors.dateReported}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="attachments" className="block text-white">
            Attachments
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            multiple
            onChange={(e) =>
              setFormData({ ...formData, attachments: e.target.files })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <button
          onClick={handleSubmit}
          className="max-w-md w-full bg-blue-500 text-white py-2 mt-2 px-4 rounded-sm border-dotted border-white border-2 hover:bg-blue-600 transition"
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );
};

export default ComplaintForm;
