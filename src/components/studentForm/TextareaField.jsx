import React from "react";
import { AlertCircle } from "lucide-react";

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  error,
  rows = 4,
  required = false,
}) => (
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
      required={required}
      maxLength={500}
      pattern="^[^<>]*$"
      title="Angle brackets are not allowed"
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

export default TextareaField;