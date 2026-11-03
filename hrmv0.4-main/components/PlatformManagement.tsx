import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PlatformManagementProps {
  onBack: () => void;
}

export const PlatformManagement: React.FC<PlatformManagementProps> = ({ onBack }) => {
  return (
    <div className="min-h-full bg-[#F2FBF5] font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý sàn</h1>
            <p className="text-sm text-gray-500">Quản lý các sàn thương mại điện tử</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Tính năng đang phát triển</h2>
          <p className="text-gray-500">Module Quản lý sàn sẽ sớm được cập nhật.</p>
        </div>
      </main>
    </div>
  );
};
