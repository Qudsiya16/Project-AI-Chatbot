import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#402735]/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#F1DCE4] space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDestructive ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#FFE8F1] text-[#C76D8A]'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#402735]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF0F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#8A687B] leading-relaxed">{description}</p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#402735] bg-[#FFF0F5] hover:bg-[#FFE8F1] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              isDestructive
                ? 'bg-[#BA1A1A] hover:bg-[#93000A] text-white shadow-sm'
                : 'bg-[#C76D8A] hover:bg-[#81515B] text-white shadow-sm'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
