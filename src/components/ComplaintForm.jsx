import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AlertCircle, Upload, Trash2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  student_api   from "../api/student-api";
import { useNavigate } from "react-router-dom";

const InputField = ({ label, name, value, onChange, error, type = "text", icon: Icon, readOnly = false }) => (
  <div className="mb-4 relative">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-4 py-3 pl-${Icon ? '10' : '4'} border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition duration-300 ease-in-out 
          bg-white
          border-gray-300
          text-gray-900 placeholder-gray-500 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={label}
      />
    </div>
    {error && (
      <>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
          <AlertCircle size={20} />
        </div>
        <p className="text-red-500 mt-1 text-sm">{error}</p>
      </>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition duration-300 ease-in-out 
        bg-white 
        border-gray-300 
        text-gray-900"
    >
      <option value="" className="text-gray-500">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option} className="text-gray-900">
          {option}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 mt-1 text-sm flex items-center">
        <AlertCircle size={16} className="mr-2" /> {error}
      </p>
    )}
  </div>
);

const TextareaField = ({ label, name, value, onChange, error, rows = 4 }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      rows={rows}
      onChange={onChange}
      className="w-full px-4 py-3 border rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition duration-300 ease-in-out 
        bg-white 
        border-gray-300 
        text-gray-900 placeholder-gray-500"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && (
      <p className="text-red-500 mt-1 text-sm flex items-center">
        <AlertCircle size={16} className="mr-2" /> {error}
      </p>
    )}
  </div>
);

const ComplaintForm = () => {
  const api = student_api;
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const user = auth.userData;
  const initialFormData = useMemo(() => ({
    scholarNumber: user?.uid || "",
    studentName: user?.name || "",
    department: user?.department || "",
    hostelNumber: user?.hostel || "",
    room: "",
    complainType: "",
    complainDescription: "",
    landmark: "",
    stream: user?.stream,
    attachments: [],
  }), [user]);

  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    api.get('/csrf-token')
      .then(response => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        console.error('Failed to fetch CSRF token', error);
      });
  }, []);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
    setFormData(initialFormData);
    setErrors({});
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  }, [initialFormData, uploadedFiles]);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      const newFiles = Array.from(files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
      setFormData(prevData => ({
        ...prevData,
        [name]: [...prevData.attachments, ...files],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const removeFile = useCallback((index) => {
    const fileToRemove = uploadedFiles[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setFormData(prevData => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index),
    }));
  }, [uploadedFiles]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!category) newErrors.category = "Please select a complaint category";

    if (category !== "Anonymous") {
      if (!formData.scholarNumber) newErrors.scholarNumber = "Scholar number is required";
      if (!formData.studentName) newErrors.studentName = "Student name is required";
    }

    if (!formData.complainDescription) newErrors.complainDescription = "Description is required";

    if (category === "Hostel") {
      if (!formData.hostelNumber) newErrors.hostelNumber = "Hostel number is required";
      if (!formData.room) newErrors.room = "Room number is required";
      if (!formData.complainType) newErrors.complainType = "Complaint type is required";
    } else if (["Medical", "Academic"].includes(category)) {
      if (!formData.department) newErrors.department = "Department is required";
    } else if (category === "Infrastructure") {
      if (!formData.landmark) newErrors.landmark = "Landmark is required";
    } else if (category === "Administration") {
      if (!formData.complainType) newErrors.complainType = "Complaint type is required";
    }

    return newErrors;
  }, [category, formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        toast.info("Submitting complaint...");
  
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === "attachments" && formData.attachments.length > 0) {
            formData.attachments.forEach(file => {
              formDataToSend.append("attachments", file);
            });
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
        formDataToSend.append("category", category);
  
        const response = await api.post(`/complain/register/${category}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "csrf-Token": csrfToken  
          },
          withCredentials: true,
        });
  
        if (response.data) {
          toast.success("Complaint submitted successfully!");
          uploadedFiles.forEach(file => {
            if (file.preview) {
              URL.revokeObjectURL(file.preview);
            }
          });
          setFormData(initialFormData);
          setCategory("");
          setUploadedFiles([]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem('auth');
          navigate('/');
        } else {
          toast.error(error.response?.data?.message || "Error submitting complaint");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  }, [category, csrfToken, formData, initialFormData, uploadedFiles, validateForm, setAuth, navigate]);

  const renderCategorySpecificFields = useCallback(() => {
    const fields = {
      Hostel: (
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
      ),
      Medical: (
        <>
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={[
              "Doctor",
              "Medicine",
              "Ambulance",
              "Other",
            ]}
            error={errors.complainType}
          />
        </>
      ),
      Academic: (
        <>
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            readOnly={true}
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={[
              "Timetable",
              "Course",
              "Faculty",
              "Other",
            ]}
            error={errors.complainType}
          />
        </>
      ),
      Infrastructure: (
        <>
          <InputField
            label="Landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            error={errors.landmark}
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={[
              "Electricity",
              "Water",
              "Internet",
              "Bus",
              "Classroom",
              "Library",
              "Sports",
              "Lab",
              "Other",
            ]}
            error={errors.complainType}
          />
        </>
      ),
      Administration: (
        <>
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            readOnly={true}
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={[
              "Documents",
              "Accounts",
              "Scholarship",
              "Details",
              "Other",
            ]}
            error={errors.complainType}
          />
        </>
      ),
    };

    return fields[category] || null;
  }, [category, formData, handleChange, errors]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Student Complaint Form
        </h2>
        <form onSubmit={handleSubmit}>
          <SelectField
            label="Complaint Category"
            name="category"
            value={category}
            onChange={handleCategoryChange}
            options={[
              "Hostel",
              "Academic",
              "Administration",
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
                readOnly={true}
              />
              <InputField
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                error={errors.studentName}
                readOnly={true}
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

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Attachments
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col border-4 border-dashed border-gray-300 rounded-lg p-6 group text-center cursor-pointer hover:border-blue-500 transition-colors duration-300">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="text-gray-400 w-16 h-16 mb-4 group-hover:text-blue-500 transition-colors duration-300" />
                  <p className="text-gray-500 text-sm tracking-wider group-hover:text-blue-500 transition-colors duration-300">
                    Select files to upload
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  name="attachments"
                  onChange={handleChange}
                />
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-semibold mb-2">Uploaded Files:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {uploadedFiles.map((fileObj, index) => (
                    <li key={index} className="mb-4">
                      <div className="flex items-center justify-between">
                        <span>{fileObj.file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {fileObj.preview && (
                        <div className="mt-2">
                          <img
                            src={fileObj.preview}
                            alt={fileObj.file.name}
                            className="max-w-xs h-auto rounded"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {category && (
            <div className="w-full flex justify-center items-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full max-w-sm 
                  bg-blue-500 
                  text-white 
                  py-4 
                  rounded-full 
                  hover:bg-blue-600 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  transform 
                  hover:scale-105 
                  shadow-lg
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ComplaintForm;
