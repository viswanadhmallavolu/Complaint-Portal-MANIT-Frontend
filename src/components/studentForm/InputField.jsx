import React from "react";
import { AlertCircle } from "lucide-react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  icon: Icon,
  readOnly = false,
  required = false,
}) => (
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
        required={required}
        maxLength={500}
        pattern="^[^<>]*$"
        title="Angle brackets are not allowed"
        className={`w-full px-4 py-3 pl-${Icon ? "10" : "4"} border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition duration-300 ease-in-out 
          bg-white
          border-gray-300
          text-gray-900 placeholder-gray-500 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
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

export default InputField;