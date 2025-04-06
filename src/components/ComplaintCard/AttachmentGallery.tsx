/// <reference types="vite/client" />
import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';

interface Attachment {
  url: string;
}

interface AttachmentGalleryProps {
  attachments: Attachment[];
  adminAttachments?: (Attachment | string | null | undefined)[];
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ attachments, adminAttachments }) => {
  // Filter out invalid attachments early
  const validStudentAttachments = useMemo(() =>
    attachments?.filter(attachment => typeof attachment.url === 'string') || [],
    [attachments]);

  const validAdminAttachments = useMemo(() => {
    if (!adminAttachments?.length) return [];
    
    return adminAttachments.filter(attachment => {
      if (typeof attachment === 'string') return true;
      if (attachment && typeof attachment === 'object' && typeof (attachment as Attachment).url === 'string') return true;
      return false;
    }) as (Attachment | string)[];
  }, [adminAttachments]);

  // Check if both arrays are empty
  if (!validStudentAttachments.length && !validAdminAttachments.length) return null;

  const getImageUrl = (item: Attachment | string): string | null => {
    // Handle both string and object with url property
    const url = typeof item === 'string' ? item : item.url;
    
    // If not a valid URL string, return null
    if (typeof url !== 'string' || url.trim() === '') return null;
    
    // Return the URL directly
    return url;
  };

  const openImage = (item: Attachment | string) => {
    const imageUrl = getImageUrl(item);
    if (imageUrl) window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const AttachmentGrid = ({
    items,
    title
  }: {
    items: (Attachment | string)[],
    title: string
  }) => {
    if (!items.length) return null;

    return (
      <>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const imageUrl = getImageUrl(item);
            if (!imageUrl) return null;

            return (
              <div
                key={index}
                className="relative group cursor-pointer rounded-xl overflow-hidden"
                onClick={() => openImage(item)}
              >
                <div className="aspect-video">
                  <img
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    crossOrigin="use-credentials"
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
    );
  };

  return (
    <div className="mt-6">
      {validStudentAttachments.length > 0 && (
        <AttachmentGrid
          items={validStudentAttachments}
          title="Student Attachments"
        />
      )}

      {validAdminAttachments.length > 0 && (
        <AttachmentGrid
          items={validAdminAttachments}
          title="Admin Attachments"
        />
      )}
    </div>
  );
};