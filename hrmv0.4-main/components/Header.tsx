import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#BCE3CD] px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <h1 className="text-2xl font-bold text-[#052E15] tracking-tight">
        THÊM MỚI DỮ LIỆU SẢN PHẨM PHỤ TÙNG
      </h1>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
        <span className="text-sm font-medium text-gray-600 italic">
          Đang chỉnh sửa bản nháp
        </span>
      </div>
    </header>
  );
};
