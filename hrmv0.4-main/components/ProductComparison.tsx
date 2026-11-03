import React, { useState } from 'react';
import { X, Check, ChevronDown, ChevronUp, Star, Plus, ArrowLeft } from 'lucide-react';
import { MOCK_SUPPLIERS } from '../constants';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  location: string;
  position: string;
  compatible: string;
  material: string;
  warning: string;
  supplierId: number;
  category: string;
  image: string;
}

interface ProductComparisonProps {
  products: Product[];
  onBack: () => void;
  onRemove: (id: number) => void;
  onAddProduct: () => void;
}

const SECTIONS = [
  {
    id: 'quick_compare',
    title: 'SO SÁNH NHANH',
    icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />,
    fields: [
      { key: 'summary', label: 'Tóm tắt' },
    ]
  },
  {
    id: 'specs',
    title: 'THÔNG SỐ KỸ THUẬT',
    fields: [
      { key: 'sku', label: 'Mã SKU' },
      { key: 'material', label: 'Chất liệu' },
      { key: 'position', label: 'Vị trí lắp đặt' },
      { key: 'compatible', label: 'Tương thích xe' },
    ]
  },
  {
    id: 'commercial',
    title: 'THÔNG TIN THƯƠNG MẠI',
    fields: [
      { key: 'supplier', label: 'Nhà cung cấp' },
      { key: 'origin', label: 'Xuất xứ' }, // Mocked
      { key: 'warranty', label: 'Bảo hành' }, // Mocked
      { key: 'location', label: 'Kho hàng' },
    ]
  },
  {
    id: 'installation',
    title: 'THÔNG TIN LẮP ĐẶT',
    fields: [
      { key: 'warning', label: 'Lưu ý lắp đặt' },
      { key: 'dimensions', label: 'Kích thước' }, // Mocked
      { key: 'weight', label: 'Khối lượng' }, // Mocked
    ]
  }
];

export const ProductComparison: React.FC<ProductComparisonProps> = ({ products, onBack, onRemove, onAddProduct }) => {
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(SECTIONS.map(s => s.id));

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getSupplierName = (id: number) => {
    return MOCK_SUPPLIERS.find(s => s.id === id)?.name || 'N/A';
  };

  // Mock data generator for missing fields
  const getProductData = (product: Product, key: string) => {
    switch (key) {
      case 'summary':
        return `Sản phẩm ${product.category} chất lượng cao, phù hợp cho ${product.compatible}. ${product.material}.`;
      case 'supplier':
        return getSupplierName(product.supplierId);
      case 'origin':
        return product.id % 2 === 0 ? 'Thái Lan' : 'Nhật Bản';
      case 'warranty':
        return product.id % 2 === 0 ? '12 tháng' : '6 tháng';
      case 'dimensions':
        return product.category === 'Lốp' ? '60x60x20 cm' : '20x15x10 cm';
      case 'weight':
        return product.category === 'Lốp' ? '10 kg' : '1.5 kg';
      default:
        return (product as any)[key];
    }
  };

  const slots = [0, 1, 2];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header / Breadcrumb */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-[#14A64A] text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-gray-800 font-bold uppercase text-sm">So sánh sản phẩm</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Top Section: Product Cards */}
        <div className="flex">
          {/* Left Control Column */}
          <div className="w-64 flex-shrink-0 pr-8 pt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
              {products.map((p, i) => (
                <span key={p.id}>
                  {p.name}
                  {i < products.length - 1 && <span className="text-gray-400 font-normal"> & </span>}
                </span>
              ))}
            </h2>
            
            <div className="mt-6 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="diffOnly" 
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#14A64A] focus:ring-[#14A64A]"
              />
              <label htmlFor="diffOnly" className="text-sm text-gray-600 cursor-pointer select-none">
                Chỉ xem điểm khác biệt
              </label>
            </div>
          </div>

          {/* Product Columns */}
          <div className="flex-1 grid grid-cols-3 gap-4 border-l border-gray-100 pl-4">
            {slots.map((slotIndex) => {
              const product = products[slotIndex];
              return (
                <div key={slotIndex} className="relative">
                  {product ? (
                    <div className="flex flex-col h-full">
                      <button 
                        onClick={() => onRemove(product.id)}
                        className="absolute top-0 right-0 text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <div className="aspect-square mb-4 p-4 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" />
                      </div>
                      
                      <h3 className="font-bold text-gray-800 text-sm mb-2 min-h-[40px] line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="mb-1">
                        <span className="text-[#EE4D2D] font-bold text-lg">{product.price.toLocaleString()}đ</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                        <span>(12 đánh giá)</span>
                        <span className="mx-1">•</span>
                        <span>Đã bán {Math.floor(Math.random() * 100) + 10}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center pt-20">
                      <button 
                        onClick={onAddProduct}
                        className="w-full aspect-square border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#14A64A] hover:text-[#14A64A] hover:bg-green-50 transition-all group"
                      >
                        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center bg-white group-hover:border-[#14A64A]">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">Thêm sản phẩm</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Sections */}
        <div className="mt-12 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <button 
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-2 w-full text-left mb-4 group"
              >
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                )}
                <h3 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2">
                  {section.title}
                  {section.icon}
                </h3>
              </button>

              {expandedSections.includes(section.id) && (
                <div className="border-t border-gray-200">
                  {section.fields.map((field) => {
                    // Check if values are different
                    const values = products.map(p => getProductData(p, field.key));
                    const isDifferent = new Set(values).size > 1;

                    if (showDiffOnly && !isDifferent) return null;

                    return (
                      <div key={field.key} className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="w-64 flex-shrink-0 py-3 pr-4 text-sm text-gray-500 bg-gray-50/50 pl-2">
                          {field.label}
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4 pl-4">
                          {slots.map((slotIndex) => {
                            const product = products[slotIndex];
                            if (!product) return <div key={slotIndex} className="py-3"></div>;
                            
                            const value = getProductData(product, field.key);
                            
                            return (
                              <div key={slotIndex} className={`py-3 text-sm text-gray-800 ${isDifferent && showDiffOnly ? 'bg-yellow-50' : ''}`}>
                                {value}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
