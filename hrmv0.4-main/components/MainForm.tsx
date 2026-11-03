import React, { useState } from 'react';
import { ProductType, SparePartClass } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_ORIGINS, MOCK_UNITS, MOCK_VAT, MOCK_WARRANTY } from '../constants';
import { Scan, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  productType: ProductType;
}

export const MainForm: React.FC<Props> = ({ productType }) => {
  const [useBarcodeOE, setUseBarcodeOE] = useState(false);
  const [useBarcodePartNumber, setUseBarcodePartNumber] = useState(false);
  const [useBarcodeUPC, setUseBarcodeUPC] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SparePartClass>(SparePartClass.GENUINE);
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  // Tire Specific States
  const [tirePosition, setTirePosition] = useState<'front' | 'rear' | null>(null);
  const [dot1, setDot1] = useState('');
  const [dot2, setDot2] = useState('');
  const [dot3, setDot3] = useState('');

  const formatPrice = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(formatPrice(e.target.value));
  };

  const renderInternalInfoColumn = () => (
      <div className="bg-white rounded-lg p-6 border border-[#BCE3CD] shadow-sm relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 bg-[#BCE3CD] text-[#052E15] text-xs font-bold px-3 py-1 rounded-br-lg">
          THÔNG TIN NỘI BỘ
        </div>

        <div className="space-y-6 mt-8">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Mã sản phẩm" placeholder="Mã nội bộ" className="font-mono" required />
                <Input label="Mã quốc tế (HS Code)" placeholder="Mã SKU quốc tế" className="font-mono" />
            </div>

            <Input 
                label="Tên sản phẩm" 
                placeholder="Tên hiển thị trên hệ thống" 
                required 
                className="font-semibold text-gray-900"
            />

            <div className="grid grid-cols-2 gap-4">
                 <Select label="Đơn vị tính" options={MOCK_UNITS} required />
                 <Select label="Loại vật tư" options={['Hàng hóa', 'Dịch vụ', 'Combo']} />
            </div>

            <Select label="Nhóm sản phẩm" options={MOCK_CATEGORIES} />

            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Giá bán gốc" 
                    placeholder="0" 
                    value={price}
                    onChange={(e) => handlePriceChange(e, setPrice)}
                    rightElement={<span className="text-gray-400 text-xs font-bold">VND</span>}
                    className="text-right font-mono font-medium"
                />
                <Input 
                    label="Giá vốn tạm" 
                    placeholder="0" 
                    value={costPrice}
                    onChange={(e) => handlePriceChange(e, setCostPrice)}
                    rightElement={<span className="text-gray-400 text-xs font-bold">VND</span>}
                    className="text-right font-mono font-medium"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <Select label="Thuế suất tạm" options={MOCK_VAT} />
                 <Select label="Bảo hành nội bộ" options={MOCK_WARRANTY} />
            </div>
        </div>
      </div>
  );

  const renderSparePartLeftColumn = () => (
      <div className="bg-white rounded-lg p-6 border-2 border-[#14A64A] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-[#14A64A] text-white text-xs font-bold px-3 py-1 rounded-br-lg">
          THÔNG TIN PHỤ TÙNG
        </div>
        
        <div className="space-y-6 mt-8">
          {/* OE Number Section */}
          <div className="space-y-3">
             <div className="flex items-end gap-4">
                <Input 
                    label="OE Number" 
                    placeholder="Nhập mã OE" 
                    className="font-mono"
                    containerClassName="flex-1"
                />
                <div className="flex items-center gap-2 mb-2 min-w-[140px]">
                    <input 
                        type="checkbox" 
                        id="barcodeOE"
                        checked={useBarcodeOE}
                        onChange={(e) => setUseBarcodeOE(e.target.checked)}
                        className="w-4 h-4 text-[#14A64A] focus:ring-[#14A64A] rounded cursor-pointer accent-[#14A64A]"
                    />
                    <label htmlFor="barcodeOE" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Dùng mã Barcode
                    </label>
                </div>
             </div>
             
             {useBarcodeOE && (
                 <div className="animate-fadeIn bg-green-50 p-3 rounded-md border border-dashed border-[#14A64A]">
                    <Input 
                        placeholder="Quét hoặc nhập mã vạch chính xác tại đây..." 
                        rightElement={<Scan className="text-[#14A64A] w-5 h-5"/>}
                        autoFocus
                        className="bg-white"
                    />
                 </div>
             )}
          </div>

          {/* Part Number Section */}
          <div className="space-y-3">
             <div className="flex items-end gap-4">
                <Input 
                    label="Part Number" 
                    placeholder="Nhập Part Number" 
                    className="font-mono"
                    containerClassName="flex-1"
                />
                <div className="flex items-center gap-2 mb-2 min-w-[140px]">
                    <input 
                        type="checkbox" 
                        id="barcodePartNumber"
                        checked={useBarcodePartNumber}
                        onChange={(e) => setUseBarcodePartNumber(e.target.checked)}
                        className="w-4 h-4 text-[#14A64A] focus:ring-[#14A64A] rounded cursor-pointer accent-[#14A64A]"
                    />
                    <label htmlFor="barcodePartNumber" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Dùng mã Barcode
                    </label>
                </div>
             </div>
             
             {useBarcodePartNumber && (
                 <div className="animate-fadeIn bg-green-50 p-3 rounded-md border border-dashed border-[#14A64A]">
                    <Input 
                        placeholder="Quét hoặc nhập mã vạch chính xác tại đây..." 
                        rightElement={<Scan className="text-[#14A64A] w-5 h-5"/>}
                        autoFocus
                        className="bg-white"
                    />
                 </div>
             )}
          </div>

          <Input label="Tên Part Number" placeholder="Nhập tên phụ tùng đầy đủ" />

          {/* Classification */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phân loại phụ tùng <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
                {Object.values(SparePartClass).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedClass(item)}
                        className={`
                            relative px-3 py-2 text-sm rounded-md border transition-all text-left flex items-center justify-between
                            ${selectedClass === item 
                                ? 'bg-[#F2FBF5] border-[#14A64A] text-[#14A64A] font-semibold' 
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#BCE3CD]'}
                        `}
                    >
                        <span>{item}</span>
                        {selectedClass === item && <CheckCircle2 className="w-4 h-4 text-[#14A64A]" />}
                    </button>
                ))}
            </div>
          </div>

          <Select label="Thương hiệu" options={MOCK_BRANDS} />

          {/* UPC/EAN Section */}
          <div className="flex items-end gap-4">
                <Input 
                    label="UPC / EAN" 
                    placeholder="Mã vạch quốc tế" 
                    className="font-mono"
                    containerClassName="flex-1"
                />
                <div className="flex items-center gap-2 mb-2 min-w-[140px]">
                    <input 
                        type="checkbox" 
                        id="barcodeUPC"
                        checked={useBarcodeUPC}
                        onChange={(e) => setUseBarcodeUPC(e.target.checked)}
                        className="w-4 h-4 text-[#14A64A] focus:ring-[#14A64A] rounded cursor-pointer accent-[#14A64A]"
                    />
                    <label htmlFor="barcodeUPC" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Dùng mã Barcode
                    </label>
                </div>
          </div>
           {useBarcodeUPC && (
                 <div className="animate-fadeIn bg-green-50 p-3 rounded-md border border-dashed border-[#14A64A] -mt-4">
                    <Input 
                        placeholder="Quét hoặc nhập mã vạch chính xác tại đây..." 
                        rightElement={<Scan className="text-[#14A64A] w-5 h-5"/>}
                        autoFocus
                        className="bg-white"
                    />
                 </div>
             )}

          <div className="grid grid-cols-2 gap-4">
             <Select label="Xuất xứ" options={MOCK_ORIGINS} />
             <Select label="Bảo hành" options={MOCK_WARRANTY} />
          </div>

        </div>
      </div>
  );

  const renderTireLeftColumn = () => (
      <div className="bg-white rounded-lg p-6 border-2 border-[#14A64A] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-[#14A64A] text-white text-xs font-bold px-3 py-1 rounded-br-lg">
          NHÓM THÔNG TIN LỐP
        </div>
        
        <div className="space-y-6 mt-8">
            {/* DOT CODE */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Mã TIN (Chuẩn DOT)</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="barcodeTire"
                            checked={useBarcodeOE}
                            onChange={(e) => setUseBarcodeOE(e.target.checked)}
                            className="w-4 h-4 text-[#14A64A] focus:ring-[#14A64A] rounded cursor-pointer accent-[#14A64A]"
                        />
                        <label htmlFor="barcodeTire" className="text-sm text-gray-500 cursor-pointer select-none">Dùng mã BarCode</label>
                    </div>
                </div>
                
                <div className="flex gap-2 items-center">
                    <input 
                        value={dot1}
                        onChange={e => e.target.value.length <= 4 && setDot1(e.target.value)}
                        placeholder="XXXX"
                        className={`w-20 px-3 py-2 text-center uppercase font-mono border rounded-md outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] ${dot1.length > 0 && dot1.length < 4 ? 'border-red-300 bg-red-50' : 'border-[#BCE3CD]'}`}
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input 
                        value={dot2}
                        onChange={e => e.target.value.length <= 3 && setDot2(e.target.value)}
                        placeholder="XXX"
                        className={`w-16 px-3 py-2 text-center uppercase font-mono border rounded-md outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] ${dot2.length > 0 && dot2.length < 3 ? 'border-red-300 bg-red-50' : 'border-[#BCE3CD]'}`}
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input 
                        value={dot3}
                        onChange={e => e.target.value.length <= 4 && setDot3(e.target.value)}
                        placeholder="XXXX"
                        className={`w-20 px-3 py-2 text-center uppercase font-mono border rounded-md outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] ${dot3.length > 0 && dot3.length < 4 ? 'border-red-300 bg-red-50' : 'border-[#BCE3CD]'}`}
                    />
                </div>
                {(dot1.length < 4 || dot2.length < 3 || dot3.length < 4) ? (
                    <p className="text-xs text-red-500 mt-1">Ô này cần chính xác số lượng ký tự.</p>
                ) : (
                    <p className="text-xs text-green-600 mt-1">Đủ ký tự chuẩn DOT.</p>
                )}
            </div>

            {useBarcodeOE && (
                 <div className="animate-fadeIn bg-green-50 p-3 rounded-md border border-dashed border-[#14A64A]">
                    <Input 
                        placeholder="Quét hoặc nhập mã Barcode..." 
                        rightElement={<Scan className="text-[#14A64A] w-5 h-5"/>}
                        autoFocus
                        className="bg-white"
                    />
                 </div>
            )}

            <Input label="Mã RFID" placeholder="Nhập mã RFID..." />
            
            <Select label="Thương hiệu" options={MOCK_BRANDS} />
            <Select label="Dòng sản phẩm" options={['Turanza', 'Potenza', 'Ecopia', 'Dueler']} />
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Vị trí lắp lốp</label>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setTirePosition('front')}
                        className={`flex-1 py-2 px-4 rounded-md border flex items-center justify-center gap-2 transition-all ${tirePosition === 'front' ? 'bg-[#14A64A] text-white border-[#14A64A]' : 'bg-white border-[#BCE3CD] text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tirePosition === 'front' ? <CheckCircle2 size={16}/> : <Circle size={16} />}
                        Lốp trước
                    </button>
                    <button 
                        onClick={() => setTirePosition('rear')}
                        className={`flex-1 py-2 px-4 rounded-md border flex items-center justify-center gap-2 transition-all ${tirePosition === 'rear' ? 'bg-[#14A64A] text-white border-[#14A64A]' : 'bg-white border-[#BCE3CD] text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tirePosition === 'rear' ? <CheckCircle2 size={16}/> : <Circle size={16} />}
                        Lốp sau
                    </button>
                </div>
            </div>

            <Select label="Nhãn hiệu" options={['Bridgestone', 'Michelin', 'Continental']} />
            <Select label="Xuất xứ" options={MOCK_ORIGINS} />
            <Select 
                label="Loại" 
                options={['P (Passenger)', 'LT (Light Truck)', 'ST (Special Trailer)', 'T (Temporary)']} 
            />
            <Select label="Bảo hành" options={MOCK_WARRANTY} />
        </div>
      </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* LEFT COLUMN: Based on Product Type */}
      {productType === ProductType.SPARE_PART ? renderSparePartLeftColumn() : renderTireLeftColumn()}

      {/* RIGHT COLUMN: Always Internal Info */}
      {renderInternalInfoColumn()}
    </div>
  );
};
