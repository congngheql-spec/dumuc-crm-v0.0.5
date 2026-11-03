import React from 'react';
import { ChevronLeft, Save, X } from 'lucide-react';

interface ActionFooterProps {
  onBack?: () => void;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ onBack }) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#BCE3CD] px-8 py-4 flex justify-between items-center shadow-2xl z-40">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#3B6E4B] font-semibold hover:text-[#052E15] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Quay lại danh sách
      </button>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-transparent text-[#3B6E4B] font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
          <X className="w-5 h-5" />
          Hủy bỏ
        </button>
        <button className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#14A64A] text-white font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-colors">
          <Save className="w-5 h-5" />
          Xác nhận và Lưu
        </button>
      </div>
    </div>
  );
};