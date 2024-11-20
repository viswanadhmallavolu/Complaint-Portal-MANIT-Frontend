import React, { useState } from "react";
import axios from "axios";

const InputField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 dark:text-white font-semibold">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
    {error && <p className="text-red-500 mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 dark:text-white font-semibold">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, value, onChange, error, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 dark:text-white font-semibold">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      rows={rows}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
    {error && <p className="text-red-500 mt-1">{error}</p>}
  </div>
);

const ComplaintForm = () => {
  const initialFormData = {
    scholarNumber: "",
    studentName: "",
    department: "",
    hostelNumber: "",
    room: "",
    complainType: "",
    complainDescription: "",
    landmark: "",
    attachments: [],
  };

  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleChange = (e) => {
    if (e.target.name === "attachments") {
      setFormData({ ...formData, attachments: e.target.files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!category) {
      newErrors.category = "Please select a complaint category";
    }

    if (category !== "Anonymous") {
      if (!formData.scholarNumber) {
        newErrors.scholarNumber = "Scholar number is required";
      }
      if (!formData.studentName) {
        newErrors.studentName = "Student name is required";
      }
    }

    if (!formData.complainDescription) {
      newErrors.complainDescription = "Description is required";
    }

    switch (category) {
      case "Hostel":
        if (!formData.hostelNumber) {
          newErrors.hostelNumber = "Hostel number is required";
        }
        if (!formData.room) {
          newErrors.room = "Room number is required";
        }
        if (!formData.complainType) {
          newErrors.complainType = "Complaint type is required";
        }
        break;
      case "Medical":
      case "Academic":
        if (!formData.department) {
          newErrors.department = "Department is required";
        }
        break;
      case "Infrastructure":
        if (!formData.landmark) {
          newErrors.landmark = "Landmark is required";
        }
        break;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        setMessage("Submitting complaint...");

        // Create FormData object for file uploads
        const formDataToSend = new FormData();

        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key === 'attachments') {
            if (formData.attachments.length > 0) {
              Array.from(formData.attachments).forEach(file => {
                formDataToSend.append('attachments', file);
              });
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Add category to form data
        formDataToSend.append('category', category);

        const response = await axios.post(
          `http://localhost:5000/complain/register/${category}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
             
            },
            withCredentials:true
          }
        );

        if (response.data) {
          setMessage("Complaint submitted successfully!");
          setFormData(initialFormData);
          setCategory("");
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Error submitting complaint");
        console.error("Error submitting form:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case "Hostel":
        return (
          <>
            <InputField
              label="Hostel Number"
              name="hostelNumber"
              value={formData.hostelNumber}
              onChange={handleChange}
              error={errors.hostelNumber}
            />
            <InputField
              label="Room Number"
              name="room"
              value={formData.room}
              onChange={handleChange}
              error={errors.room}
            />
            <SelectField
              label="Complaint Type"
              name="complainType"
              value={formData.complainType}
              onChange={handleChange}
              options={[
                "Maintenance",
                "Hygiene",
                "Security",
                "Mess",
                "Bathroom",
                "Room",
                "Noise",
                "Other",
              ]}
              error={errors.complainType}
            />
          </>
        );
      case "Medical":
      case "Academic":
        return (
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
          />
        );
      case "Infrastructure":
        return (
          <InputField
            label="Landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            error={errors.landmark}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 max-w-4xl mx-auto rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <SelectField
          label="Complaint Category"
          name="category"
          value={category}
          onChange={handleCategoryChange}
          options={[
            "Hostel",
            "Academic",
            "Medical",
            "Infrastructure",
            "Ragging",
            "Anonymous",
          ]}
          error={errors.category}
        />

        {category !== "Anonymous" && (
          <>
            <InputField
              label="Scholar Number"
              name="scholarNumber"
              value={formData.scholarNumber}
              onChange={handleChange}
              error={errors.scholarNumber}
            />
            <InputField
              label="Student Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              error={errors.studentName}
            />
          </>
        )}

        {renderCategorySpecificFields()}

        <TextareaField
          label="Description"
          name="complainDescription"
          value={formData.complainDescription}
          onChange={handleChange}
          error={errors.complainDescription}
        />

        <InputField
          label="Attachments"
          name="attachments"
          type="file"
          onChange={handleChange}
        />

        {category && (
          <div className="w-full flex justify-center items-center mt-6">
            <button
              type="submit"
              className="w-full max-w-sm bg-indigo-500 text-white py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-700 shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out"
            >
              Submit Complaint
            </button>
          </div>
        )}
      </form>

      {message && <p className="text-white text-center mt-4">{message}</p>}
    </div>
  );
};

export default ComplaintForm;