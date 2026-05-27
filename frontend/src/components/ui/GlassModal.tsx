import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  glowColor?: 'green' | 'red' | 'blue' | 'default';
}

export const GlassModal: React.FC<GlassModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  glowColor = 'default' 
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const glowStyles = {
    green: 'shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] border-green-500/30',
    red: 'shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] border-red-500/30',
    blue: 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] border-blue-500/30',
    default: 'shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] border-white/10'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Panel */}
      <div 
        className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border ${glowStyles[glowColor]} p-6 text-left align-middle shadow-xl transition-all animate-in zoom-in-95 duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-white tracking-wide">
              {title}
            </h3>
          )}
          <button
            type="button"
            className="ml-auto inline-flex justify-center rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-2 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
