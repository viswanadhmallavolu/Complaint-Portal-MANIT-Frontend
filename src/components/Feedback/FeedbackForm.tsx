import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import FileUpload from './FileUpload';
import { SendFeedBack } from '../../services/feedbackService';
import { toast, ToastContainer } from 'react-toastify';

interface FeedbackData {
  scholarNumber: string;
  name: string;
  description: string;
  stream: string;
  year: string;
  department: string;
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackData>({
    scholarNumber: '',
    name: '',
    description: '',
    stream: '',
    year: '',
    department: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { scholarNumber, name, stream, year, department, description } = formData;
      const success = await SendFeedBack({
        scholarNumber,
        name,
        stream,
        year,
        department,
        description,
        files
      });
      if (success) {
        toast.success('Feedback submitted successfully!');
        setFormData({
          scholarNumber: '',
          name: '',
          description: '',
          stream: '',
          year: '',
          department: '',
        });
        setFiles([]);
      } else {
        toast.error('Failed to submit feedback.');
      }
    } catch (error) {
      toast.error('Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getYearOptions = (stream: string) => {
    switch (stream) {
      case 'B.tech':
      case 'B.Plan':
        return ['1st', '2nd', '3rd', '4th'];
      case 'B.Arch':
      case 'Dual Degree':
        return ['1st', '2nd', '3rd', '4th', '5th'];
      case 'M.tech':
      case 'MBA':
      case 'MCA':
        return ['1st', '2nd'];
      default:
        return [];
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Feedback</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="scholarNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Scholar Number
            </label>
            <input
              type="text"
              id="scholarNumber"
              name="scholarNumber"
              value={formData.scholarNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Stream
            </label>
            <select
              name="stream"
              value={formData.stream}
              onChange={(e) => {
                setFormData({ ...formData, stream: e.target.value, year: '' });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Stream</option>
              {['B.tech', 'M.tech', 'Phd', 'MCA', 'MBA', 'B.Arch', 'B.Plan', 'Dual Degree'].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>
          </div>

          {formData.stream !== 'Phd' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                {getYearOptions(formData.stream).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {['CSE', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Architecture', 'Planning', 'Management', 'Mathematics', 'Others'].map(
                (dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                )
              )}
            </select>
          </div>

          <FileUpload files={files} onChange={setFiles} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}