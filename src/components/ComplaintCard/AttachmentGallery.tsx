import React from 'react';
import { ExternalLink } from 'lucide-react';
import student_api from '../../api/student-api';

interface Attachment {
  url: string;
}

interface AttachmentGalleryProps {
  attachments: Attachment[];
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ attachments }) => {
  if (!attachments?.length) return null;

  const openImage = (attachment: Attachment) => {
    const { url } = attachment;
    if (typeof url !== 'string') {
      console.error('Invalid URL:', url);
      return;
    }
    const correctedFilename = url.replace(/\\/g, '/').split('/').pop();
    if (!correctedFilename) {
      console.error('Filename not found in URL:', url);
      return;
    }
    window.open(`http://localhost:5000/uploads/${correctedFilename}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Attachments</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {attachments.map((attachment, index) => {
          const correctedFilename = attachment.url.replace(/\\/g, '/').split('/').pop();
          return (
            <div 
              key={index} 
              className="relative group cursor-pointer rounded-xl overflow-hidden"
              onClick={() => openImage(attachment)}
            >
              <div className="aspect-video">
                <img
                  src={`http://localhost:5000/uploads/${correctedFilename}`}
                  alt={`Attachment ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-center justify-center gap-2">
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">View Full</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};