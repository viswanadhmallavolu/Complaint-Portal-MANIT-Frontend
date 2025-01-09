/// <reference types="vite/client" />
import React from 'react';
import { ExternalLink } from 'lucide-react';


const student_api_base_url = import.meta.env.VITE_STUDENT_API as string;
const admin_api_base_url =  import.meta.env.VITE_ADMIN_API as string;

interface Attachment {
  url: string;
}

interface AttachmentGalleryProps {
  attachments: Attachment[];
  adminAttachments?: (string | null | undefined)[];  // Updated type to handle potential non-string values
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ attachments, adminAttachments }) => {
  // Check if both arrays are empty or undefined/null
  if (!attachments?.length && !adminAttachments?.filter(Boolean)?.length) return null;

  const openImage = (url: string) => {
    if (typeof url !== 'string') {
      console.error('Invalid URL:', url);
      return;
    }
    const correctedFilename = url.replace(/\\/g, '/').split('/').pop();
    if (!correctedFilename) {
      console.error('Filename not found in URL:', url);
      return;
    }
    window.open(`${student_api_base_url}uploads/${correctedFilename}`, '_blank', 'noopener,noreferrer');
  };

  const getImageUrl = (url: string, isAdmin: boolean) => {
    const baseUrl = isAdmin ? admin_api_base_url : student_api_base_url;
    const correctedFilename = url.replace(/\\/g, '/').split('/').pop();
    if (!correctedFilename) {
      console.error('Filename not found in URL:', url);
      return null;
    }
    return `${baseUrl}uploads/${correctedFilename}`;
  };

  return (
    <div className="mt-6">
      {attachments?.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Student Attachments</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((attachment, index) => {
              if (typeof attachment.url !== 'string') {
                console.error('Invalid attachment URL:', attachment);
                return null;
              }

              const imageUrl = getImageUrl(attachment.url, false);
              if (!imageUrl) return null;

              return (
                <div 
                  key={index} 
                  className="relative group cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => openImage(attachment.url)}
                >
                  <div className="aspect-video">
                    <img
                      src={imageUrl}
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
        </>
      )}
      {(adminAttachments ?? []).length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Admin Attachments</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {adminAttachments?.map((url, index) => {
              if (typeof url !== 'string') {
                console.error('Invalid admin attachment URL:', url);
                return null;
              }

              const imageUrl = getImageUrl(url, true);
              if (!imageUrl) return null;

              return (
                <div 
                  key={index} 
                  className="relative group cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => openImage(url)}
                >
                  <div className="aspect-video">
                    <img
                      src={imageUrl}
                      alt={`Admin Attachment ${index + 1}`}
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
        </>
      )}
    </div>
  );
};