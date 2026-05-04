import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProtectedImageProps {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  disableModal?: boolean;
}

export const ProtectedImage = ({ 
  src, 
  alt, 
  wrapperClassName = '', 
  imageClassName = '', 
  disableModal = false 
}: ProtectedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!disableModal) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`relative select-none overflow-hidden ${!disableModal ? 'cursor-pointer' : ''} ${wrapperClassName}`}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onClick={handleClick}
        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
      >
        <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover pointer-events-none ${imageClassName}`} 
          draggable="false"
          referrerPolicy="no-referrer"
        />
      </div>

      {!disableModal && isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white z-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl" 
              draggable="false"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
};
