import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/studentForm/InputField";
import SelectField from "../../components/studentForm/SelectField";
import TextareaField from "../../components/studentForm/TextareaField";
import FilePreview from "../../components/studentForm/FilePreview";
import student_api from "../../api/student-api";
import { useToast } from "../../context/ToastContext";
import ComplaintForm from '../../components/ComplaintForm'

const Complaint = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    category: "",
    room: "",
    hostel: "",
    block: "",
    problem: "",
    anonymous: false,
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // Use our toast context instead of direct imports
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Create form data for submission
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("category", formData.category);
    data.append("room", formData.room || "");
    data.append("hostel", formData.hostel || "");
    data.append("block", formData.block || "");
    data.append("problem", formData.problem);
    data.append("anonymous", formData.anonymous);

    // Add files to form data
    files.forEach((file) => {
      data.append("files", file);
    });

    try {
      const response = await student_api.post("/complaints", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success toast with unique ID to prevent duplicates
      toast.success("Complaint submitted successfully!", {
        toastId: "complaint-submit-success"
      });

      navigate("/student/home");
    } catch (error) {
      console.error("Error submitting complaint:", error);

      // Show error toast with unique ID
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to submit: ${error.response.data.message}`, {
          toastId: "complaint-submit-error"
        });
      } else {
        toast.error("Failed to submit complaint. Please try again.", {
          toastId: "complaint-submit-error-generic"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='py-0'>
      <ComplaintForm />
    </div>
  )
}

export default Complaint