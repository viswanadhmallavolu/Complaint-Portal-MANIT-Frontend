export const calculateItemHeight = (
  isExpanded: boolean,
  windowWidth: number,
  hasAttachments: boolean
): number => {
  const isMobile = windowWidth < 768;
  
  // Base heights with increased values
  const baseHeight = isMobile ? 250 : 220;
  
  // Additional height for attachments
  const attachmentHeight = hasAttachments ? (isMobile ? 300 : 250) : 0;
  
  // Calculate expanded height with more space
  const expandedHeight = isMobile ? 
    700 + attachmentHeight : 
    550 + attachmentHeight;
  
  // Add more spacing between cards
  const spacing = 48; // Increased spacing

  return (isExpanded ? expandedHeight : baseHeight) + spacing;
};