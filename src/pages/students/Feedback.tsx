import React from 'react';
import FeedbackForm from '../../components/Feedback/FeedbackForm';

function Feedback() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Feedback System</h1>
          <p className="mt-2 text-gray-600">Share your thoughts and suggestions with us</p>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}

export default Feedback;