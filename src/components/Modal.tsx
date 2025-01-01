// Modal.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='modalOverlay font-poppins'>
      <div className='backdrop' />
      <div className='modalContent'>
        <button onClick={onClose} className="modalCloseButton">X</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;