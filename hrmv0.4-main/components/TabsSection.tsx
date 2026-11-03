import React, { useState, useRef, useEffect } from 'react';
import { ProductType, TabType } from '../types';
import { Plus, ExternalLink, Trash2, Search, PlusCircle, ShoppingBag, Link as LinkIcon } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { MOCK_BRANDS, MOCK_UNITS } from '../constants';

interface Props {
  productType: ProductType;
}

// Mock Database for Search
const PART_DATABASE = [
  { oe: '12345-ABCDE', name: 'Bố thắng trước Vios', brand: 'Toyota', price: '1,200,000', unit: 'Bộ' },
  { oe: '23456-XYZ00', name: 'Lọc dầu Camry', brand: 'Denso', price: '150,000', unit: 'Cái' },
  { oe: '99999-TES01', name: 'Bugi Iridium', brand: 'NGK', price: '220,000', unit: 'Cái' },
  { oe: '88888-HON02', name: 'Gương chiếu hậu Civic', brand: 'Honda', price: '3,500,000', unit: 'Cái' },
  { oe: '77777-MIT03', name: 'Đèn pha Xpander', brand: 'Mitsubishi', price: '4,100,000', unit: 'Cái' },
];

const MOCK_CODES = ['P-12345', 'P-67890', 'PN-11223', 'PN-44556', '12345-ABCDE', '23456-XYZ00'];
const MOCK_HS_CODES = ['4011.10.00', '4011.20.00', '4012.90.10', '8708.30.00'];
const MOCK_NAMES = ['Bố thắng trước', 'Lọc dầu', 'Gương chiếu hậu', 'Đèn pha', 'Bugi', 'Má phanh', 'Rotuyn', 'Lốp Turanza', 'Lốp Ecopia'];

const PLATFORMS = [
    { name: 'Shopee', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { name: 'Lazada', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'Tiki', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { name: 'TikTok Shop', color: 'text-black', bg: 'bg-gray-100', border: 'border-gray-300' },
    { name: 'Sàn Du Mục', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
];

interface PartRowState {
  id: number;
  productCode: string;
  productName: string;
  oeNumber: string;
  partNumber: string;
  partNumberName: string;
  oeName: string;
  brand: string;
  originalPrice: string;
  unit: string;
  createdAt?: string;
  hsCode?: string;
}

interface EcommerceRowState {
    id: number;
    platform: string;
    salesCode: string;
    productName: string;
    description: string;
    unit: string;
    quantity: string;
    price: string;
    link: string;
}

const SimpleSearchCell: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  suggestions: string[];
  fontMono?: boolean;
  withExternalLink?: boolean;
}> = ({ value, onChange, placeholder, suggestions, fontMono, withExternalLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('#', '_blank');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative group/cell">
         <input
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none border-b py-1 transition-colors pr-6
                ${isOpen ? 'border-[#14A64A]' : 'border-transparent focus:border-[#14A64A]'}
                ${fontMono ? 'font-mono' : ''}
                ${withExternalLink && value ? 'text-blue-600 font-semibold' : ''}
            `}
         />
         {withExternalLink ? (
             <ExternalLink 
                onClick={handleLinkClick}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 cursor-pointer hover:text-blue-600 z-10
                    ${!value ? 'hidden' : ''} 
                `} 
             />
         ) : (
             value && !isOpen && <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
         )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-[250px] bg-white rounded-md shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto mt-1 min-w-full">
           {filtered.length > 0 && (
               <ul className="py-1">
                   {filtered.map((item, idx) => (
                       <li
                          key={idx}
                          onClick={() => {
                              onChange(item);
                              setIsOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-[#F2FBF5] cursor-pointer text-sm text-gray-700"
                       >
                           {item}
                       </li>
                   ))}
               </ul>
           )}

           <div
              onClick={() => {
                  setIsOpen(false);
              }}
              className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 py-2 text-[#14A64A] font-bold text-sm cursor-pointer hover:bg-[#14A64A] hover:text-white transition-colors flex items-center gap-2"
           >
               <PlusCircle className="w-4 h-4" />
               Thêm mới: "{value}"
           </div>
        </div>
      )}
    </div>
  );
};

const OESearchCell: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onSelect: (part: typeof PART_DATABASE[0]) => void;
  onAddNew: (code: string) => void;
  placeholder?: string;
  withExternalLink?: boolean;
}> = ({ value, onChange, onSelect, onAddNew, placeholder = "Tìm kiếm hoặc nhập OE...", withExternalLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredParts = PART_DATABASE.filter(p => 
    p.oe.toLowerCase().includes(value.toLowerCase()) || 
    p.name.toLowerCase().includes(value.toLowerCase())
  );

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('#', '_blank');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative group/cell">
         <input 
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none border-b py-1 transition-colors font-mono font-medium pr-6
                ${isOpen ? 'border-[#14A64A]' : 'border-transparent focus:border-[#14A64A]'}
                ${withExternalLink && value ? 'text-blue-600 font-bold' : ''}
            `}
         />
         {withExternalLink ? (
             <ExternalLink 
                onClick={handleLinkClick}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 cursor-pointer hover:text-blue-600 z-10
                    ${!value ? 'hidden' : ''} 
                `} 
             />
         ) : (
            value && !isOpen && <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
         )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-[300px] bg-white rounded-md shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto mt-1">
           {filteredParts.length > 0 ? (
               <ul className="py-1">
                   {filteredParts.map((part) => (
                       <li 
                          key={part.oe}
                          onClick={() => {
                              onSelect(part);
                              setIsOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-[#F2FBF5] cursor-pointer border-b border-gray-50 last:border-0"
                       >
                           <div className="flex justify-between items-baseline">
                               <span className="font-mono text-[#14A64A] font-bold text-sm">{part.oe}</span>
                               <span className="text-xs text-gray-500">{part.brand}</span>
                           </div>
                           <div className="text-xs text-gray-700 truncate">{part.name}</div>
                       </li>
                   ))}
               </ul>
           ) : (
               <div className="px-3 py-2 text-xs text-gray-500 italic">Không tìm thấy kết quả phù hợp</div>
           )}
           
           <div 
              onClick={() => {
                  onAddNew(value);
                  setIsOpen(false);
              }}
              className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 py-2 text-[#14A64A] font-bold text-sm cursor-pointer hover:bg-[#14A64A] hover:text-white transition-colors flex items-center gap-2"
           >
               <PlusCircle className="w-4 h-4" />
               Thêm mới mã: "{value}"
           </div>
        </div>
      )}
    </div>
  );
};

export const TabsSection: React.FC<Props> = ({ productType }) => {
  const [activeTab, setActiveTab] = useState<TabType>('specs');

  // State for Equivalent Parts
  const [eqRows, setEqRows] = useState<PartRowState[]>([
    { 
        id: 1, 
        productCode: '', 
        productName: '', 
        oeNumber: '12345-ABCDE', 
        partNumber: '', 
        partNumberName: '', 
        oeName: 'Bố thắng trước Vios', 
        brand: 'Toyota', 
        originalPrice: '1,200,000', 
        unit: 'Bộ',
        hsCode: '',
    }
  ]);

  // State for Ecommerce
  const [ecoRows, setEcoRows] = useState<EcommerceRowState[]>([]);

  // Dynamically generate tabs based on Product Type
  const getTabs = (): { id: TabType; label: string }[] => {
      if (productType === ProductType.TIRE) {
          return [
              { id: 'specs', label: 'Thông số kỹ thuật' },
              { id: 'cars', label: 'Dòng xe tương thích' },
              { id: 'equivalent', label: 'Lốp thay thế' },
              { id: 'ecommerce', label: 'Sàn TMĐT' },
          ];
      }
      return [
          { id: 'specs', label: 'Thông số kỹ thuật' },
          { id: 'cars', label: 'Dòng xe tương thích' },
          { id: 'equivalent', label: 'Phụ tùng thay thế' },
          { id: 'ecommerce', label: 'Sàn TMĐT' },
      ];
  };

  const tabs = getTabs();

  // Reset or adjust active tab if it doesn't exist in the current product type
  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab)) {
        setActiveTab('specs');
    }
  }, [productType]);

  const handleAddRow = (type: 'eq' | 'rep') => {
      // Logic simplified as we only support 'eq' now in the UI for Spare Parts, 
      // but keeping partial logic if we ever re-introduce replacement parts or for 'equivalent' flow
      if (type === 'eq') {
        const rows = eqRows;
        const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
        
        const newRow: PartRowState = {
            id: newId,
            productCode: '',
            productName: '',
            oeNumber: '',
            partNumber: '',
            partNumberName: '',
            oeName: '',
            brand: '',
            originalPrice: '',
            unit: '',
            hsCode: '',
        };
        setEqRows([...rows, newRow]);
      }
  };

  const handleRemoveRow = (type: 'eq' | 'rep', id: number) => {
      if (type === 'eq') {
          setEqRows(eqRows.filter(r => r.id !== id));
      }
  };

  const updateRow = (type: 'eq' | 'rep', id: number, updates: Partial<PartRowState>) => {
      if (type === 'eq') {
          setEqRows(eqRows.map(r => r.id === id ? { ...r, ...updates } : r));
      }
  };

  const handleAddEcoRow = () => {
      const newId = ecoRows.length > 0 ? Math.max(...ecoRows.map(r => r.id)) + 1 : 1;
      setEcoRows([...ecoRows, {
          id: newId,
          platform: '',
          salesCode: '',
          productName: '',
          description: '',
          unit: '',
          quantity: '',
          price: '',
          link: ''
      }]);
  };

  const updateEcoRow = (id: number, field: keyof EcommerceRowState, value: string) => {
      setEcoRows(ecoRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeEcoRow = (id: number) => {
      setEcoRows(ecoRows.filter(r => r.id !== id));
  };

  // RENDERERS
  const renderSpecs = () => (
    <div className="space-y-4 animate-fadeIn">
       <div className="bg-[#F2FBF5] p-3 rounded-md border border-[#BCE3CD] flex items-center gap-2 text-sm text-[#052E15]">
          <span className="font-bold">💡 Gợi ý:</span>
          Vui lòng nhập giá trị cụ thể cho từng thông số để khách hàng dễ dàng tra cứu.
       </div>
       <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
              <tr>
                  <th className="px-4 py-3 w-16 text-center">STT</th>
                  <th className="px-4 py-3 w-1/3">Tên thông số</th>
                  <th className="px-4 py-3">Giá trị</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {[1, 2, 3, 4, 5].map((i) => (
                 <tr key={i} className="hover:bg-gray-50">
                     <td className="px-4 py-2 text-center font-mono text-gray-400">{i}</td>
                     <td className="px-4 py-2">
                         <input placeholder="VD: Đường kính" className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1 transition-colors" />
                     </td>
                     <td className="px-4 py-2">
                         <input placeholder="Nhập giá trị..." className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1 transition-colors" />
                     </td>
                 </tr>
             ))}
          </tbody>
       </table>
       <button className="flex items-center gap-2 text-[#14A64A] font-medium text-sm hover:underline px-4">
           <Plus className="w-4 h-4" /> Thêm dòng thông số
       </button>
    </div>
  );

  const renderCars = () => {
      const isTire = productType === ProductType.TIRE;
      return (
      <div className="space-y-4 animate-fadeIn">
        <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                <tr>
                    <th className="px-4 py-3">Hãng xe</th>
                    <th className="px-4 py-3">Loại xe</th>
                    <th className="px-4 py-3 w-24">Năm SX</th>
                    {!isTire && <th className="px-4 py-3">Động cơ (Cấp 1)</th>}
                    {!isTire && <th className="px-4 py-3">Động cơ (Cấp 2)</th>}
                    <th className="px-4 py-3 w-12"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                    <td className="px-2 py-2">
                        <Select options={MOCK_BRANDS} className="border-0 bg-gray-50 text-sm py-1" />
                    </td>
                    <td className="px-2 py-2">
                         <Select options={['Vios', 'Camry', 'Innova']} className="border-0 bg-gray-50 text-sm py-1" />
                    </td>
                    <td className="px-2 py-2">
                         <Select options={['2022', '2023', '2024']} className="border-0 bg-gray-50 text-sm py-1" />
                    </td>
                    {!isTire && (
                        <td className="px-2 py-2">
                             <Select options={['1.5G', '1.5E', 'Hybrid']} className="border-0 bg-gray-50 text-sm py-1" />
                        </td>
                    )}
                    {!isTire && (
                        <td className="px-2 py-2">
                             <Select options={['CVT', 'MT']} className="border-0 bg-gray-50 text-sm py-1" />
                        </td>
                    )}
                    <td className="px-2 py-2 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div className="flex justify-center mt-4">
            <button className="flex items-center gap-2 border border-[#14A64A] text-[#14A64A] font-bold text-sm px-6 py-2 rounded hover:bg-[#F2FBF5] transition-colors">
                <Plus className="w-4 h-4" /> Thêm dòng xe
            </button>
        </div>
      </div>
    );
  };

  const renderPartsList = (type: 'eq' | 'rep') => {
    // Only support 'eq' rendering effectively as 'rep' tab is removed
    const rows = eqRows;
    const isTire = productType === ProductType.TIRE;
    
    // Labels based on product type
    const codeLabel = isTire ? "Mã TIN" : "OE Number";

    return (
      <div className="space-y-4 animate-fadeIn pb-12 overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[1200px]">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                  <tr>
                      <th className="px-4 py-3 w-12 text-center">STT</th>
                      
                      {/* Spare Parts: Product Code */}
                      {!isTire && <th className="px-4 py-3 w-32">Mã sản phẩm</th>}

                      {/* NEW: Spare Parts: HS Code */}
                      {!isTire && <th className="px-4 py-3 w-32">Mã quốc tế (HS Code)</th>}
                      
                      {/* Spare Parts: Product Name */}
                      {!isTire && <th className="px-4 py-3 w-48">Tên sản phẩm</th>}

                      {/* TIRE: New columns before TIN */}
                      {isTire && <th className="px-4 py-3 w-32">Mã sản phẩm</th>}
                      {isTire && <th className="px-4 py-3 w-32">Mã quốc tế (HS Code)</th>}
                      {isTire && <th className="px-4 py-3 w-48">Tên sản phẩm</th>}

                      <th className="px-4 py-3 w-48">{codeLabel}</th>

                       {/* Spare Parts: Part Number */}
                      {!isTire && <th className="px-4 py-3 w-32">Part Number</th>}
                      {!isTire && <th className="px-4 py-3 w-48">Tên Part Number</th>}

                      <th className="px-4 py-3 w-32">Thương hiệu</th>
                      
                      <th className="px-4 py-3 w-32 text-right">Giá gốc</th>
                      <th className="px-4 py-3 w-24">ĐVT</th>
                      <th className="px-4 py-3 w-12"></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {rows.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50 group">
                          <td className="px-4 py-3 text-center text-gray-400">{index + 1}</td>
                          
                           {/* Spare Parts: Product Code */}
                          {!isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.productCode}
                                    onChange={(val) => updateRow(type, row.id, { productCode: val })}
                                    suggestions={MOCK_CODES}
                                    fontMono
                                    placeholder="Mã SP..."
                                    withExternalLink
                                />
                            </td>
                          )}

                          {/* NEW: Spare Parts: HS Code */}
                          {!isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.hsCode || ''}
                                    onChange={(val) => updateRow(type, row.id, { hsCode: val })}
                                    suggestions={MOCK_HS_CODES}
                                    fontMono
                                    placeholder="HS Code..."
                                    withExternalLink
                                />
                            </td>
                          )}

                           {/* Spare Parts: Product Name */}
                          {!isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.productName}
                                    onChange={(val) => updateRow(type, row.id, { productName: val })}
                                    suggestions={MOCK_NAMES}
                                    placeholder="Tên SP..."
                                    withExternalLink
                                />
                            </td>
                          )}

                          {/* TIRE: Product Code */}
                          {isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.productCode}
                                    onChange={(val) => updateRow(type, row.id, { productCode: val })}
                                    suggestions={MOCK_CODES}
                                    fontMono
                                    placeholder="Mã SP..."
                                    withExternalLink
                                />
                            </td>
                          )}
                          {/* TIRE: HS Code */}
                          {isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.hsCode || ''}
                                    onChange={(val) => updateRow(type, row.id, { hsCode: val })}
                                    suggestions={MOCK_HS_CODES}
                                    fontMono
                                    placeholder="HS Code..."
                                    withExternalLink
                                />
                            </td>
                          )}
                          {/* TIRE: Product Name */}
                          {isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.productName}
                                    onChange={(val) => updateRow(type, row.id, { productName: val })}
                                    suggestions={MOCK_NAMES}
                                    placeholder="Tên SP..."
                                    withExternalLink
                                />
                            </td>
                          )}

                          <td className="px-4 py-3 relative">
                              {isTire ? (
                                  <div className="relative">
                                    <input 
                                      value={row.oeNumber}
                                      onChange={(e) => updateRow(type, row.id, { oeNumber: e.target.value })}
                                      className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1 text-blue-600 font-bold underline cursor-pointer"
                                      placeholder="Mã TIN..."
                                    />
                                    <ExternalLink className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-400" />
                                  </div>
                              ) : (
                                  <OESearchCell 
                                      value={row.oeNumber} 
                                      onChange={(val) => updateRow(type, row.id, { oeNumber: val })}
                                      onSelect={(part) => updateRow(type, row.id, {
                                          oeNumber: part.oe,
                                          oeName: part.name,
                                          brand: part.brand,
                                          originalPrice: part.price,
                                          unit: part.unit
                                      })}
                                      onAddNew={(code) => {
                                          updateRow(type, row.id, { oeNumber: code, oeName: '', brand: '', originalPrice: '', unit: '' });
                                      }}
                                      withExternalLink
                                  />
                              )}
                          </td>

                           {/* Spare Parts: Part Number Inputs */}
                           {!isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.partNumber}
                                    onChange={(val) => updateRow(type, row.id, { partNumber: val })}
                                    suggestions={MOCK_CODES}
                                    fontMono
                                    placeholder="Part No..."
                                    withExternalLink
                                />
                            </td>
                          )}
                          {!isTire && (
                            <td className="px-4 py-3">
                                <SimpleSearchCell
                                    value={row.partNumberName}
                                    onChange={(val) => updateRow(type, row.id, { partNumberName: val })}
                                    suggestions={MOCK_NAMES}
                                    placeholder="Tên Part No..."
                                    withExternalLink
                                />
                            </td>
                          )}

                           <td className="px-4 py-3">
                              <input 
                                  value={row.brand}
                                  onChange={(e) => updateRow(type, row.id, { brand: e.target.value })}
                                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1" 
                              />
                          </td>

                          <td className="px-4 py-3 text-right font-mono">
                              <input 
                                  value={row.originalPrice}
                                  onChange={(e) => updateRow(type, row.id, { originalPrice: e.target.value })}
                                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1 text-right" 
                              />
                          </td>
                          <td className="px-4 py-3">
                              <input 
                                  value={row.unit}
                                  onChange={(e) => updateRow(type, row.id, { unit: e.target.value })}
                                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-1" 
                              />
                          </td>
                          <td className="px-4 py-3 text-center">
                              <button 
                                  onClick={() => handleRemoveRow(type, row.id)}
                                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <div className="flex justify-start mt-2">
              <button 
                  onClick={() => handleAddRow(type)}
                  className="flex items-center gap-2 text-[#14A64A] font-bold text-sm px-4 py-2 rounded hover:bg-[#F2FBF5] transition-colors"
              >
                  <Plus className="w-4 h-4" /> Thêm dòng
              </button>
          </div>
      </div>
    );
  };

  const renderEcommerce = () => (
      <div className="space-y-4 animate-fadeIn pb-12">
          {ecoRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#BCE3CD] rounded-lg bg-gray-50/50">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                      <ShoppingBag className="w-8 h-8 text-[#14A64A]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#052E15]">Chưa có liên kết sàn</h3>
                  <p className="text-gray-500 mb-6">Thêm liên kết để quản lý sản phẩm trên các sàn TMĐT</p>
                  <button 
                      onClick={handleAddEcoRow}
                      className="flex items-center gap-2 bg-[#14A64A] text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                  >
                      <Plus className="w-5 h-5" /> Thêm liên kết sàn
                  </button>
              </div>
          ) : (
            <>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-4 py-3 w-12 text-center">STT</th>
                            <th className="px-4 py-3 w-48">Tên sàn</th>
                            <th className="px-4 py-3 w-32">Mã bán hàng</th>
                            <th className="px-4 py-3">Tên sản phẩm</th>
                            <th className="px-4 py-3 w-48">Mô tả</th>
                            <th className="px-4 py-3 w-24">ĐVT</th>
                            <th className="px-4 py-3 w-24 text-right text-blue-500 normal-case text-sm">Số lượng</th>
                            <th className="px-4 py-3 w-32 text-right">Giá bán</th>
                            <th className="px-4 py-3 w-48">Link</th>
                            <th className="px-4 py-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ecoRows.map((row, index) => {
                            const selectedPlatform = PLATFORMS.find(p => p.name === row.platform);
                            return (
                                <tr key={row.id} className="hover:bg-gray-50 group align-top">
                                    <td className="px-4 py-3 text-center text-gray-400 pt-4">{index + 1}</td>
                                    <td className="px-4 py-2">
                                        <div className="relative">
                                            <select
                                                value={row.platform}
                                                onChange={(e) => updateEcoRow(row.id, 'platform', e.target.value)}
                                                className={`
                                                    w-full appearance-none outline-none border rounded-md py-2 px-3 text-sm font-bold cursor-pointer transition-all
                                                    ${row.platform ? selectedPlatform?.bg + ' ' + selectedPlatform?.color + ' ' + selectedPlatform?.border : 'bg-white border-gray-200 text-gray-500'}
                                                `}
                                            >
                                                <option value="" disabled>-- Chọn sàn --</option>
                                                {PLATFORMS.map(p => (
                                                    <option key={p.name} value={p.name}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input 
                                            value={row.salesCode}
                                            onChange={(e) => updateEcoRow(row.id, 'salesCode', e.target.value)}
                                            placeholder="SKU sàn..."
                                            className="w-full bg-transparent outline-none border border-transparent focus:border-[#14A64A] rounded px-2 py-2 transition-colors font-mono text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <textarea
                                            rows={2}
                                            value={row.productName}
                                            onChange={(e) => updateEcoRow(row.id, 'productName', e.target.value)}
                                            placeholder="Tên hiển thị trên sàn..."
                                            className="w-full bg-transparent outline-none border border-transparent focus:border-[#14A64A] rounded px-2 py-2 transition-colors resize-none"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <textarea
                                            rows={2}
                                            value={row.description}
                                            onChange={(e) => updateEcoRow(row.id, 'description', e.target.value)}
                                            placeholder="Mô tả ngắn..."
                                            className="w-full bg-transparent outline-none border border-transparent focus:border-[#14A64A] rounded px-2 py-2 transition-colors resize-none text-xs text-gray-600"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select 
                                            value={row.unit}
                                            onChange={(e) => updateEcoRow(row.id, 'unit', e.target.value)}
                                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-2"
                                        >
                                            <option value="">--</option>
                                            {MOCK_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input 
                                            value={row.quantity}
                                            onChange={(e) => updateEcoRow(row.id, 'quantity', e.target.value)}
                                            placeholder=""
                                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-2 text-right font-mono text-blue-500"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input 
                                            value={row.price}
                                            onChange={(e) => updateEcoRow(row.id, 'price', e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-2 text-right font-mono"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className={`w-4 h-4 ${row.link ? 'text-[#14A64A]' : 'text-gray-300'}`} />
                                            <input 
                                                value={row.link}
                                                onChange={(e) => updateEcoRow(row.id, 'link', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-transparent outline-none border-b border-transparent focus:border-[#14A64A] py-2 text-blue-600 text-xs truncate"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center pt-4">
                                        <button 
                                            onClick={() => removeEcoRow(row.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex justify-start mt-4">
                    <button 
                        onClick={handleAddEcoRow}
                        className="flex items-center gap-2 text-[#14A64A] font-bold text-sm px-4 py-2 rounded hover:bg-[#F2FBF5] transition-colors border border-transparent hover:border-[#14A64A]"
                    >
                        <Plus className="w-4 h-4" /> Thêm liên kết sàn
                    </button>
                </div>
            </>
          )}
      </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#BCE3CD] min-h-[400px]">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2
              ${
                activeTab === tab.id
                  ? 'border-[#14A64A] text-[#14A64A] bg-[#F2FBF5]'
                  : 'border-transparent text-gray-500 hover:text-[#052E15] hover:bg-gray-50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'specs' && renderSpecs()}
        {activeTab === 'cars' && renderCars()}
        {activeTab === 'equivalent' && renderPartsList('eq')}
        {activeTab === 'ecommerce' && renderEcommerce()}
      </div>
    </div>
  );
};
