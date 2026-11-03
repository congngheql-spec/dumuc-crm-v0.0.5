import React from 'react';
import { ProductType } from '../types';
import { Package, Disc } from 'lucide-react';

interface Props {
  selected: ProductType;
  onChange: (type: ProductType) => void;
}

export const ProductTypeSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex gap-6">
        <button
          onClick={() => onChange(ProductType.SPARE_PART)}
          className={`
            flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 w-64
            ${
              selected === ProductType.SPARE_PART
                ? 'bg-[#14A64A] border-[#14A64A] text-white shadow-lg shadow-green-100'
                : 'bg-white border-transparent text-gray-500 hover:border-[#BCE3CD]'
            }
          `}
        >
          <div className={`p-2 rounded-full ${selected === ProductType.SPARE_PART ? 'bg-white/20' : 'bg-gray-100'}`}>
            <Package className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-lg">Phụ tùng</span>
            {selected === ProductType.SPARE_PART && <span className="text-xs opacity-90">Đang chọn</span>}
          </div>
        </button>

        <button
          onClick={() => onChange(ProductType.TIRE)}
          className={`
            flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 w-64
            ${
              selected === ProductType.TIRE
                ? 'bg-[#14A64A] border-[#14A64A] text-white'
                : 'bg-white border-[#14A64A] text-[#14A64A] hover:bg-[#F2FBF5]'
            }
          `}
        >
          <div className={`p-2 rounded-full ${selected === ProductType.TIRE ? 'bg-white/20' : 'bg-[#14A64A]/10'}`}>
            <Disc className={`w-6 h-6 ${selected === ProductType.TIRE ? 'text-white' : 'text-[#14A64A]'}`} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-lg">Lốp</span>
            {selected !== ProductType.TIRE && <span className="text-xs opacity-80 font-medium">Trạng thái chờ</span>}
          </div>
        </button>
      </div>
      <p className="text-sm text-gray-500 italic ml-1">
        * Chọn loại sản phẩm để hiển thị các trường thông tin tương ứng
      </p>
    </div>
  );
};
