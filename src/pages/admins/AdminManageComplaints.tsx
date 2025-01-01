import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Building,
  Stethoscope,
  Shield,
  UserCheck,
} from 'lucide-react';

const cards = [
  {
    title: 'Hostel',
    description: 'Resolve hostel-related issues',
    icon: Building2,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Academic',
    description: 'Resolve academic-related concerns',
    icon: GraduationCap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Infrastructure',
    description: 'Resolve facility maintenance issues',
    icon: Building,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Medical',
    description: 'Resolve health-related concerns',
    icon: Stethoscope,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Ragging',
    description: 'Resolve ragging incidents',
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: 'Administration',
    description: 'Resolve administration-related concerns',
    icon: UserCheck,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

const AdminManageComplaints = () => {
  const navigate = useNavigate();

  const handleCardClick = (title: string) => {
    navigate(`/admin/complaints/${title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Complaint Categories
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={index}
              onClick={() => handleCardClick(card.title.toLowerCase())}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 p-6 text-left border border-gray-200 hover:border-gray-300 relative overflow-hidden"
            >
              <div
                className={`${card.bg} absolute right-0 top-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`}
              />
              <div className="relative">
                <div className={`${card.color} mb-4`}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                <Icon size={16} className={card.color} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminManageComplaints;