import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AlertCircle, Upload, Trash2, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Replace direct toast import with our useToast hook
import { useToast } from "../context/ToastContext";
import student_api from "../api/student-api";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import InputField from "./studentForm/InputField";
import SelectField from "./studentForm/SelectField";
import TextareaField from "./studentForm/TextareaField";
import FilePreview from "./studentForm/FilePreview";

const ComplaintForm = () => {
  const api = student_api;
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  // Use our toast context
  const toast = useToast();
  const user = auth.userData;
  const initialFormData = useMemo(
    () => ({
      scholarNumber: user?.uid || "",
      studentName: user?.name || "",
      department: user?.department || "",
      hostelNumber: user?.hostel || "",
      room: "",
      complainType: "",
      complainDescription: "",
      landmark: "",
      stream: user?.stream || "",
      year: "",
      attachments: [],
      location: "",
      involvedParties: "",
    }),
    [user]
  );

  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    api
      .get("/csrf-token")
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Failed to fetch CSRF token", error);
      });
  }, [api]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  const handleCategoryChange = useCallback(
    (e) => {
      setCategory(e.target.value);
      setFormData(initialFormData);
      setErrors({});
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setUploadedFiles([]);
    },
    [initialFormData, uploadedFiles]
  );

  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
  const MAX_FILE_COUNT = 10;

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (!csrfToken) {
      toast.error("Missing CSRF token. Please refresh the page.", {
        toastId: "csrf-token-missing"
      });
      return;
    }
    if (name === "attachments") {
      if (uploadedFiles.length + e.target.files.length > MAX_FILE_COUNT) {
        toast.error(`You can only upload up to ${MAX_FILE_COUNT} files.`, {
          toastId: "max-file-count-exceeded"
        });
        return;
      }
      const validFiles = Array.from(files).filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB`, {
            toastId: `file-too-large-${file.name}`
          });
          return false;
        }
        return true;
      });

      const newFiles = validFiles.map((file) => {
        // Create a compressed preview for images
        if (file.type.startsWith("image/")) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                const MAX_DIMENSION = 800;
                if (width > height && width > MAX_DIMENSION) {
                  height = (height * MAX_DIMENSION) / width;
                  width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                  width = (width * MAX_DIMENSION) / height;
                  height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with reduced quality
                canvas.toBlob(
                  (blob) => {
                    const compressedFile = new File([blob], file.name, {
                      type: file.type,
                      lastModified: file.lastModified,
                    });
                    resolve({
                      file: compressedFile,
                      preview: URL.createObjectURL(blob)
                    });
                  },
                  file.type,
                  0.6 // Reduced quality
                );
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          });
        } else {
          return Promise.resolve({
            file,
            preview: null
          });
        }
      });

      Promise.all(newFiles).then(processedFiles => {
        setUploadedFiles(prevFiles => [...prevFiles, ...processedFiles]);
        setFormData(prevData => ({
          ...prevData,
          attachments: [...prevData.attachments, ...processedFiles.map(pf => pf.file)]
        }));
      });
    } else {
      const rawValue = e.target.value;
      if (rawValue.length > 500) {
        toast.error("Input is too long.", {
          toastId: "input-too-long"
        });
        return;
      }
      const sanitizedValue = sanitizeInput(rawValue);
      setFormData(prevData => ({
        ...prevData,
        [name]: sanitizedValue
      }));
    }
  }, [uploadedFiles, csrfToken]);

  const removeFile = useCallback(
    (index) => {
      const fileToRemove = uploadedFiles[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setFormData((prevData) => ({
        ...prevData,
        attachments: prevData.attachments.filter((_, i) => i !== index),
      }));
    },
    [uploadedFiles]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!category) newErrors.category = "Please select a complaint category";
    if (category !== "Anonymous") {
      if (!formData.scholarNumber)
        newErrors.scholarNumber = "Scholar number is required";
      if (!formData.studentName)
        newErrors.studentName = "Student name is required";
    }
    if (!formData.complainDescription)
      newErrors.complainDescription = "Description is required";

    if (category === "Hostel") {
      if (!formData.hostelNumber)
        newErrors.hostelNumber = "Hostel number is required";
      if (!formData.room) newErrors.room = "Room number is required";
      if (!formData.complainType)
        newErrors.complainType = "Complaint type is required";
    } else if (["Medical", "Academic"].includes(category)) {
      if (!formData.department)
        newErrors.department = "Department is required";
    } else if (category === "Infrastructure") {
      if (!formData.landmark) newErrors.landmark = "Landmark is required";
    } else if (category === "Administration") {
      if (!formData.complainType)
        newErrors.complainType = "Complaint type is required";
    }
    if (["Academic", "Administration", "Medical", "Ragging"].includes(category)) {
      if (!formData.stream) newErrors.stream = "Stream is required";
      if (!formData.year && formData.stream !== "Phd")
        newErrors.year = "Year is required";
    }
    if (category === "Ragging") {
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.involvedParties)
        newErrors.involvedParties = "Involved Parties are required";
    }
    return newErrors;
  }, [category, formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          toast.info("Submitting complaint...", {
            toastId: "submitting-complaint"
          });
          const formDataToSend = new FormData();
          Object.keys(formData).forEach((key) => {
            if (key === "attachments" && formData.attachments.length > 0) {
              formData.attachments.forEach((file) => {
                formDataToSend.append("attachments", file);
              });
            } else {
              formDataToSend.append(key, formData[key]);
            }
          });
          formDataToSend.append("category", category);
          const response = await api.post(
            `/complain/register/${category}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "csrf-Token": csrfToken,
              },
              withCredentials: true,
            }
          );

          if (response.data) {
            toast.success("Complaint submitted successfully!", {
              toastId: "complaint-submitted"
            });
            uploadedFiles.forEach((file) => {
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
            localStorage.removeItem("auth");
            navigate("/");
          } else {
            toast.error(
              error.response?.data?.message || "Error submitting complaint",
              { toastId: "complaint-submit-error" }
            );
          }
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setErrors(validationErrors);
        Object.entries(validationErrors).forEach(([field, msg]) =>
          toast.error(msg, { toastId: `validation-error-${field}` })
        );
      }
    },
    [
      category,
      csrfToken,
      formData,
      initialFormData,
      uploadedFiles,
      validateForm,
      setAuth,
      navigate,
      api,
    ]
  );

  const getYearOptions = useCallback((stream) => {
    switch (stream) {
      case "B.tech":
      case "B.Plan":
        return ["1st", "2nd", "3rd", "4th"];
      case "B.Arch":
      case "Dual Degree":
        return ["1st", "2nd", "3rd", "4th", "5th"];
      case "M.tech":
      case "MBA":
      case "MCA":
        return ["1st", "2nd"];
      case "Phd":
        return [];
      default:
        return [];
    }
  }, []);

  const renderCategorySpecificFields = useCallback(() => {
    const commonEducationFields = (
      <>
        <SelectField
          label="Stream"
          name="stream"
          value={formData.stream}
          onChange={(e) => {
            handleChange(e);
            setFormData((prev) => ({ ...prev, year: "" }));
          }}
          options={[
            "B.tech",
            "M.tech",
            "Phd",
            "MCA",
            "MBA",
            "B.Arch",
            "B.Plan",
            "Dual Degree",
          ]}
          error={errors.stream}
          required
        />
        {formData.stream !== "Phd" && (
          <SelectField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            options={getYearOptions(formData.stream)}
            error={errors.year}
            required
          />
        )}
      </>
    );
    const fields = {
      Academic: (
        <>
          {commonEducationFields}
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            readOnly
            required
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={["Timetable", "Course", "Faculty", "Other"]}
            error={errors.complainType}
            required
          />
        </>
      ),
      Medical: (
        <>
          {commonEducationFields}
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            required
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={["Doctor", "Medicine", "Ambulance", "Other"]}
            error={errors.complainType}
            required
          />
        </>
      ),
      Administration: (
        <>
          {commonEducationFields}
          <InputField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            readOnly
            required
          />
          <SelectField
            label="Complaint Type"
            name="complainType"
            value={formData.complainType}
            onChange={handleChange}
            options={["Documents", "Accounts", "Scholarship", "Details", "Other"]}
            error={errors.complainType}
            required
          />
        </>
      ),
      Ragging: (
        <>
          {commonEducationFields}
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />
          <InputField
            label="Involved Parties"
            name="involvedParties"
            value={formData.involvedParties}
            onChange={handleChange}
            error={errors.involvedParties}
            required
          />
        </>
      ),
      Hostel: (
        <>
          <SelectField
            label="Hostel Number"
            name="hostelNumber"
            value={formData.hostelNumber}
            onChange={handleChange}
            options={[
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "H7",
              "H8",
              "H9",
              "H10",
              "H11",
              "H12",
            ]}
            error={errors.hostelNumber}
            required
          />
          <InputField
            label="Room Number"
            name="room"
            value={formData.room}
            onChange={handleChange}
            error={errors.room}
            required
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
              "Internet",
              "Other",
            ]}
            error={errors.complainType}
            required
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
            required
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
              "Internet",
              "Other",
            ]}
            error={errors.complainType}
            required
          />
        </>
      ),
    };
    return fields[category] || null;
  }, [category, formData, handleChange, errors, getYearOptions]);

  // Modify the file upload section in the return statement
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
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
            required
          />

          {category !== "Anonymous" && (
            <>
              <InputField
                label="Scholar Number"
                name="scholarNumber"
                value={formData.scholarNumber}
                onChange={handleChange}
                error={errors.scholarNumber}
                readOnly
                required
              />
              <InputField
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                error={errors.studentName}
                readOnly
                required
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
            required
          />

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Attachments (Optional)
            </label>
            <div className="flex items-center justify-center w-full mb-4">
              <label className="flex flex-col border-4 border-dashed border-gray-300 rounded-lg p-6 group text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 w-full">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="text-gray-400 w-12 h-12 mb-3 group-hover:text-blue-500 transition-colors duration-300" />
                  <p className="text-gray-500 text-sm tracking-wider group-hover:text-blue-500 transition-colors duration-300">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Max file size: 5MB | Supported formats: Images, PDFs, Documents
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  name="attachments"
                  onChange={handleChange}
                  accept="image/*,.pdf"
                />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-semibold mb-3">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploadedFiles.map((fileObj, index) => (
                    <FilePreview
                      key={index}
                      file={fileObj.file}
                      onRemove={removeFile}
                      index={index}
                    />
                  ))}
                </div>
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
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
