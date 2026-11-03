import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, ChevronDown, Car, MessageCircle, ShoppingCart, Check, AlertCircle, Trash2, Minus, Plus, Camera, Image as ImageIcon, CheckSquare, Mic, Send, Heart, Reply, Pin, CheckCheck, History, Filter, Printer, RotateCcw, Calendar, Home, Star, Upload, ArrowLeftRight } from 'lucide-react';
import { useOrderContext } from '../context/OrderContext';
import { MOCK_PRODUCTS as PRODUCTS, MOCK_SUPPLIERS as SUPPLIERS } from '../constants';
import { ProductReviews } from './ProductReviews';
import { ProductComparison } from './ProductComparison';

const SEARCH_HISTORY = [
  "Lốp Toyota Cross",
  "Dầu nhớt Castrol 5W-30",
  "Lọc gió VinFast VF8"
];

const WAREHOUSES = [
  { id: 'KHO01', name: 'Kho Chính', address: '123 Lê Lợi, Q1, HCM' },
  { id: 'KHO02', name: 'Kho Phụ', address: '456 Nguyễn Huệ, Q1, HCM' },
];

const VehicleSelectorPopup: React.FC<{ onClose: () => void, onSelect: (vehicle: any) => void }> = ({ onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Hiệu xe / Loại xe / Năm SX', 'VIN', 'Biển số xe', 'RO', 'Lịch sử'];

  // Tab 1
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  // Tab 2
  const [vin, setVin] = useState('');
  const [vinResult, setVinResult] = useState<{ status: 'not_found' | 'found_with_plate' | 'found_only_vin', data?: any } | null>(null);

  // Tab 3
  const [plate, setPlate] = useState('');
  const [plateResult, setPlateResult] = useState<{ make: string, model: string, year: string } | null>(null);

  // Tab 4
  const [ro, setRo] = useState('');
  const [roResult, setRoResult] = useState<{ make: string, model: string, year: string } | null>(null);

  // Tab 5
  const history = [
    { id: 'RO-12345', make: 'Toyota', model: 'Camry', year: '2020' },
    { id: '51G-123.45', make: 'Honda', model: 'Civic', year: '2019' },
  ];

  const handleSearchVin = () => {
    if (vin.length !== 17) {
      alert('Số VIN phải đủ 17 ký tự');
      return;
    }
    if (vin.startsWith('1')) setVinResult({ status: 'not_found' });
    else if (vin.startsWith('2')) setVinResult({ status: 'found_with_plate', data: { make: 'Toyota', model: 'Vios', year: '2021', plate: '51H-123.45' } });
    else setVinResult({ status: 'found_only_vin', data: { make: 'Honda', model: 'City', year: '2022' } });
  };

  const handleSearchPlate = () => {
    if (!plate) return;
    setPlateResult({ make: 'Mazda', model: 'CX-5', year: '2020' });
  };

  const handleSearchRo = () => {
    if (!ro) return;
    setRoResult({ make: 'Ford', model: 'Ranger', year: '2019' });
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-[550px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden cursor-default" onClick={e => e.stopPropagation()}>
      <div className="bg-[#E8F0FE] p-3 border-b border-blue-100">
        <p className="text-sm font-semibold text-[#1A73E8] text-center">Xác định phương tiện để hiển thị phụ tùng chính xác 100% cho xe.</p>
      </div>
      
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${activeTab === idx ? 'font-bold text-black border-b-2 border-[#000080]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5 min-h-[250px] bg-white">
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm appearance-none outline-none focus:border-[#14A64A]" value={make} onChange={e => setMake(e.target.value)}>
                  <option value="">Hiệu xe</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Ford">Ford</option>
                </select>
                {make && <button onClick={() => setMake('')} className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>}
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm appearance-none outline-none focus:border-[#14A64A]" value={model} onChange={e => setModel(e.target.value)}>
                  <option value="">Loại xe</option>
                  <option value="Camry">Camry</option>
                  <option value="Civic">Civic</option>
                  <option value="CX-5">CX-5</option>
                  <option value="Ranger">Ranger</option>
                </select>
                {model && <button onClick={() => setModel('')} className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>}
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm appearance-none outline-none focus:border-[#14A64A]" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">Năm sản xuất</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                {year && <button onClick={() => setYear('')} className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>}
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => onSelect({ make, model, year })}
                disabled={!make || !model || !year} 
                className="px-6 py-2.5 bg-[#14A64A] text-white rounded-md font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={vin} 
                onChange={e => setVin(e.target.value.toUpperCase())} 
                maxLength={17}
                placeholder="Nhập 17 ký tự số VIN (Thử bắt đầu bằng 1, 2, 3)" 
                className="flex-1 border border-gray-300 rounded-md p-2.5 text-sm uppercase outline-none focus:border-[#14A64A]"
              />
              <button onClick={handleSearchVin} className="px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-bold transition-colors">Tìm kiếm</button>
            </div>
            {vinResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {vinResult.status === 'not_found' && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Không tìm thấy số VIN</p>}
                {vinResult.status === 'found_with_plate' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Thông tin xe</p>
                        <p className="text-sm font-bold text-gray-800">{vinResult.data.make} {vinResult.data.model} {vinResult.data.year}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Biển số</p>
                        <p className="text-sm font-bold text-[#1A73E8]">{vinResult.data.plate}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-gray-200">
                      <button onClick={() => onSelect(vinResult.data)} className="px-6 py-2 bg-[#14A64A] hover:bg-green-700 text-white rounded-md text-sm font-bold transition-colors">Xác nhận</button>
                      <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors">Truy vấn RO từ VIN này</button>
                    </div>
                  </div>
                )}
                {vinResult.status === 'found_only_vin' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Thông tin xe</p>
                      <p className="text-sm font-bold text-gray-800">{vinResult.data.make} {vinResult.data.model} {vinResult.data.year}</p>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-gray-200">
                      <button onClick={() => onSelect(vinResult.data)} className="px-6 py-2 bg-[#14A64A] hover:bg-green-700 text-white rounded-md text-sm font-bold transition-colors">Xác nhận</button>
                      <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors">Truy vấn RO từ VIN này</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={plate} 
                onChange={e => setPlate(e.target.value.toUpperCase())} 
                placeholder="Nhập biển số xe" 
                className="flex-1 border border-gray-300 rounded-md p-2.5 text-sm uppercase outline-none focus:border-[#14A64A]"
              />
              <button onClick={handleSearchPlate} className="px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-bold transition-colors">Tìm kiếm</button>
            </div>
            {plateResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Kết quả tìm kiếm</p>
                  <p className="text-sm font-bold text-gray-800">
                    {plateResult.make} - {plateResult.model} - {plateResult.year}
                  </p>
                </div>
                <div className="flex justify-end pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => onSelect(plateResult)}
                    disabled={!plateResult.make || !plateResult.model || !plateResult.year} 
                    className="px-6 py-2 bg-[#14A64A] hover:bg-green-700 text-white rounded-md text-sm font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Xác nhận/Lưu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={ro} 
                onChange={e => setRo(e.target.value.toUpperCase())} 
                placeholder="Nhập mã RO" 
                className="flex-1 border border-gray-300 rounded-md p-2.5 text-sm uppercase outline-none focus:border-[#14A64A]"
              />
              <button onClick={handleSearchRo} className="px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-bold transition-colors">Tìm kiếm</button>
            </div>
            {roResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Kết quả tìm kiếm</p>
                  <p className="text-sm font-bold text-gray-800">
                    {roResult.make} - {roResult.model} - {roResult.year}
                  </p>
                </div>
                <div className="flex justify-end pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => onSelect(roResult)}
                    disabled={!roResult.make || !roResult.model || !roResult.year} 
                    className="px-6 py-2 bg-[#14A64A] hover:bg-green-700 text-white rounded-md text-sm font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div key={idx} onClick={() => onSelect(item)} className="p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-[#F2FBF5] hover:border-[#14A64A] cursor-pointer flex justify-between items-center group transition-colors">
                <span className="text-sm font-medium text-gray-800">
                  <span className="text-gray-500">[{item.id}]</span> - {item.make} - {item.model} - {item.year}
                </span>
                <button className="text-[#14A64A] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Chọn</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MOCK_ORDER_HISTORY = [
  {
    id: '1',
    poCode: 'PO-2024-708',
    status: 'Mới',
    warehouseCode: 'KHO01',
    warehouseName: 'Kho Chính',
    createdAt: '26/02/2024',
    total: 2100000,
    receiverName: 'Nguyễn Văn A',
    receiverPhone: '0901234567',
    receiverAddress: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    receiveNote: 'Giao giờ hành chính',
    supplierName: 'Công ty Phụ tùng A',
    supplierPhone: '02838123456',
    importedQty: 0,
    unimportedQty: 10,
    description: 'Nhập phụ tùng bảo dưỡng',
    products: [
      {
        id: 101,
        name: 'Cảm biến chuyển động BẬT TẮT Đèn ngủ Đèn cầu thang Đèn cảm ứng LED từ tính màu trắng ấm áp',
        image: 'https://picsum.photos/seed/sensor/100/100',
        classification: 'Đen * 1 gói',
        quantity: 2
      }
    ]
  },
  {
    id: '2',
    poCode: 'PO-2024-709',
    status: 'Đã nhập hàng',
    warehouseCode: 'KHO02',
    warehouseName: 'Kho Phụ',
    createdAt: '25/02/2024',
    total: 15500000,
    receiverName: 'Trần Thị B',
    receiverPhone: '0987654321',
    receiverAddress: '456 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    receiveNote: 'Gọi trước khi giao 30 phút',
    supplierName: 'Đại lý Michelin',
    supplierPhone: '0909999888',
    importedQty: 20,
    unimportedQty: 0,
    description: 'Nhập lốp xe',
    products: [
      {
        id: 102,
        name: 'Lốp Michelin Primacy 4 205/55R16',
        image: 'https://picsum.photos/seed/tire/100/100',
        classification: '205/55R16',
        quantity: 4
      }
    ]
  },
  {
    id: '3',
    poCode: 'PO-2024-710',
    status: 'Lập đơn hàng',
    warehouseCode: 'KHO01',
    warehouseName: 'Kho Chính',
    createdAt: '24/02/2024',
    total: 8400000,
    receiverName: 'Lê Văn C',
    receiverPhone: '0912345678',
    receiverAddress: '789 Trần Hưng Đạo, Phường 1, Quận 5, TP. Hồ Chí Minh',
    receiveNote: '',
    supplierName: 'Phụ tùng Bosch',
    supplierPhone: '02839991111',
    importedQty: 5,
    unimportedQty: 15,
    description: 'Nhập bình ắc quy và bugi',
    products: [
      {
        id: 103,
        name: 'Bình ắc quy Bosch 12V 60Ah',
        image: 'https://picsum.photos/seed/battery/100/100',
        classification: '12V 60Ah',
        quantity: 2
      },
      {
        id: 104,
        name: 'Bugi Iridium Bosch',
        image: 'https://picsum.photos/seed/sparkplug/100/100',
        classification: 'Bộ 4 cái',
        quantity: 5
      }
    ]
  }
];

const ReviewPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  order: any;
  isReadOnly?: boolean;
}> = ({ isOpen, onClose, onSubmit, order, isReadOnly = false }) => {
  const [productReviews, setProductReviews] = useState<Record<number, { rating: number; comment: string; images: File[] }>>({});
  const [sellerRating, setSellerRating] = useState(0);
  const [shippingRating, setShippingRating] = useState(0);
  const [showUsername, setShowUsername] = useState(true);

  useEffect(() => {
    if (isOpen && order) {
      // Initialize state based on existing review data or defaults
      if (order.reviewData) {
        setProductReviews(order.reviewData.productReviews);
        setSellerRating(order.reviewData.sellerRating);
        setShippingRating(order.reviewData.shippingRating);
        setShowUsername(order.reviewData.showUsername);
      } else {
        const initialReviews: Record<number, any> = {};
        order.products?.forEach((p: any) => {
          initialReviews[p.id] = { rating: 5, comment: '', images: [] };
        });
        setProductReviews(initialReviews);
        setSellerRating(5);
        setShippingRating(5);
        setShowUsername(true);
      }
    }
  }, [isOpen, order]);

  const handleProductRatingChange = (productId: number, rating: number) => {
    if (isReadOnly) return;
    setProductReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };

  const handleProductCommentChange = (productId: number, comment: string) => {
    if (isReadOnly) return;
    setProductReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment }
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      productReviews,
      sellerRating,
      shippingRating,
      showUsername
    });
  };

  if (!isOpen || !order) return null;

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Tuyệt vời';
      case 4: return 'Hài lòng';
      case 3: return 'Bình thường';
      case 2: return 'Không hài lòng';
      case 1: return 'Tệ';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-[800px] max-h-[90vh] flex flex-col animate-fadeIn">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-medium text-gray-800">Đánh Giá Sản Phẩm</h3>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {order.products?.map((product: any) => (
            <div key={product.id} className="space-y-4">
              <div className="flex gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover border border-gray-200" />
                <div>
                  <p className="text-sm text-gray-800 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Phân loại hàng: {product.classification}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Chất lượng sản phẩm</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleProductRatingChange(product.id, star)}
                      disabled={isReadOnly}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= (productReviews[product.id]?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-yellow-500 font-medium ml-2">
                  {getRatingText(productReviews[product.id]?.rating || 0)}
                </span>
              </div>

              <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Chất lượng sản phẩm: </span>
                  <span className="text-sm text-gray-400 italic">để lại đánh giá.</span>
                </div>
                <textarea
                  value={productReviews[product.id]?.comment || ''}
                  onChange={(e) => handleProductCommentChange(product.id, e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                  className="w-full bg-transparent border-none outline-none text-sm text-gray-700 resize-none min-h-[80px] placeholder:text-gray-400"
                />
                <div className="border-t border-gray-200 pt-4 mt-2">
                   {/* Placeholder for images/video buttons - purely visual for now as requested */}
                   <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 border border-[#14A64A] text-[#14A64A] text-sm rounded-sm hover:bg-green-50 transition-colors">
                        <Camera className="w-4 h-4" />
                        Thêm Hình ảnh
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-[#14A64A] text-[#14A64A] text-sm rounded-sm hover:bg-green-50 transition-colors">
                        <ImageIcon className="w-4 h-4" />
                        Thêm Video
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-4">
            <input 
              type="checkbox" 
              id="showUsername"
              checked={showUsername}
              onChange={(e) => !isReadOnly && setShowUsername(e.target.checked)}
              disabled={isReadOnly}
              className="w-4 h-4 text-[#14A64A] border-gray-300 rounded focus:ring-[#14A64A]"
            />
            <div className="text-sm">
              <label htmlFor="showUsername" className="font-medium text-gray-700 block">Hiển thị tên đăng nhập trên đánh giá này</label>
              <span className="text-gray-500 text-xs">Tên tài khoản sẽ được hiển thị như jvjxhpugwi</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="text-base font-medium text-gray-800">Về Dịch vụ</h4>
            
            <div className="flex items-center gap-8">
              <span className="text-sm text-gray-600 w-40">Dịch vụ của người bán</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => !isReadOnly && setSellerRating(star)}
                      disabled={isReadOnly}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= sellerRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-yellow-500 font-medium ml-2">{getRatingText(sellerRating)}</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-sm text-gray-600 w-40">Dịch vụ vận chuyển</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => !isReadOnly && setShippingRating(star)}
                      disabled={isReadOnly}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= shippingRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-yellow-500 font-medium ml-2">{getRatingText(shippingRating)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-sm transition-colors uppercase"
          >
            Trở lại
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-[#EE4D2D] hover:bg-[#d73211] rounded-sm transition-colors uppercase shadow-sm"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderHistoryView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [orders, setOrders] = useState(MOCK_ORDER_HISTORY.map(order => ({
    ...order,
    isReviewed: false,
    reviewData: null as any
  })));
  
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleOpenReview = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReviewPopupOpen(true);
  };

  const handleSubmitReview = (data: any) => {
    if (selectedOrderId) {
      setOrders(prev => prev.map(order => 
        order.id === selectedOrderId 
          ? { ...order, isReviewed: true, reviewData: data } 
          : order
      ));
      setReviewPopupOpen(false);
      setSelectedOrderId(null);
    }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="fixed inset-0 z-[100] bg-[#F9FAFB] flex flex-col font-sans">
      <ReviewPopup
        isOpen={reviewPopupOpen}
        onClose={() => setReviewPopupOpen(false)}
        onSubmit={handleSubmitReview}
        order={selectedOrder}
        isReadOnly={selectedOrder?.isReviewed}
      />
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Lịch sử đặt hàng</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Nhà cung cấp..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#14A64A] text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Từ ngày - Đến ngày" 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#14A64A] text-sm"
            />
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors">
            Xóa lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Lọc
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[2000px]">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#14A64A] focus:ring-[#14A64A]" />
                  </th>
                  <th className="px-4 py-3 w-32">Mã đơn hàng</th>
                  <th className="px-4 py-3 w-32">Trạng thái PO</th>
                  <th className="px-4 py-3 w-24">Mã kho</th>
                  <th className="px-4 py-3 w-32">Tên kho nhập</th>
                  <th className="px-4 py-3 w-32">Ngày tạo</th>
                  <th className="px-4 py-3 w-32 text-right">Tổng tiền</th>
                  <th className="px-4 py-3 w-40">Tên người nhận</th>
                  <th className="px-4 py-3 w-32">SĐT người nhận</th>
                  <th className="px-4 py-3 w-64">Địa chỉ nhận</th>
                  <th className="px-4 py-3 w-48">Ghi chú nhận hàng</th>
                  <th className="px-4 py-3 w-48">Tên nhà cung cấp</th>
                  <th className="px-4 py-3 w-32">SĐT NCC</th>
                  <th className="px-4 py-3 w-24 text-center">SL đã nhập</th>
                  <th className="px-4 py-3 w-24 text-center">SL chưa nhập</th>
                  <th className="px-4 py-3 w-48">Diễn giải</th>
                  <th className="px-4 py-3 w-48 text-center sticky right-0 bg-gray-50 border-l border-gray-200 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 group align-top">
                    <td className="px-4 py-3 text-center pt-4">
                      <input type="checkbox" className="rounded border-gray-300 text-[#14A64A] focus:ring-[#14A64A]" />
                    </td>
                    <td className="px-4 py-3 pt-4">
                      <a href="#" className="text-[#1A73E8] hover:underline font-medium">{row.poCode}</a>
                    </td>
                    <td className="px-4 py-3 pt-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
                        ${row.status === 'Mới' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        ${row.status === 'Đã nhập hàng' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                        ${row.status === 'Lập đơn hàng' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}
                      `}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.warehouseCode}</td>
                    <td className="px-4 py-3 pt-4 text-gray-800 font-medium">{row.warehouseName}</td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.createdAt}</td>
                    <td className="px-4 py-3 pt-4 text-right font-bold text-[#052E15]">
                      {row.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td className="px-4 py-3 pt-4 text-gray-800">{row.receiverName}</td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.receiverPhone}</td>
                    <td className="px-4 py-3 pt-4 text-gray-600 truncate max-w-[200px]" title={row.receiverAddress}>
                      {row.receiverAddress}
                    </td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.receiveNote}</td>
                    <td className="px-4 py-3 pt-4 text-gray-800 font-medium">{row.supplierName}</td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.supplierPhone}</td>
                    <td className="px-4 py-3 pt-4 text-center font-medium text-green-600">{row.importedQty}</td>
                    <td className="px-4 py-3 pt-4 text-center font-medium text-orange-600">{row.unimportedQty}</td>
                    <td className="px-4 py-3 pt-4 text-gray-600">{row.description}</td>
                    <td className="px-4 py-3 text-center pt-4 sticky right-0 bg-white group-hover:bg-gray-50 border-l border-gray-200 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleOpenReview(row.id)}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                            row.isReviewed 
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                              : 'bg-[#14A64A] text-white hover:bg-green-700'
                          }`}
                          title={row.isReviewed ? "Xem đánh giá" : "Đánh giá đơn hàng"}
                        >
                          Đánh giá
                        </button>
                        <button className="text-gray-400 hover:text-[#14A64A] transition-colors" title="Mua lại">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="In đơn hàng">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-[#1A73E8] transition-colors" title="Chat">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};


const ComparePopup: React.FC<{
  products: typeof PRODUCTS;
  onRemove: (id: number) => void;
  onClear: () => void;
  onCompare: () => void;
}> = ({ products, onRemove, onClear, onCompare }) => {
  const slots = [0, 1, 2]; // 3 slots for comparison

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[100] animate-slideUp">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {slots.map((slotIndex) => {
            const product = products[slotIndex];
            return (
              <div key={slotIndex} className="w-64 h-24 relative">
                {product ? (
                  <div className="w-full h-full flex items-center gap-3 bg-white border border-gray-200 rounded-md p-2 relative group">
                    <div className="w-20 h-20 flex-shrink-0 border border-gray-100 rounded overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1" title={product.name}>
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold text-[#14A64A]">
                        {product.price.toLocaleString()}đ
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(product.id)}
                      className="absolute top-1 right-1 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50">
                    <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center bg-white">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs">Thêm sản phẩm</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-end gap-2 ml-8">
          <button 
            onClick={onCompare}
            disabled={products.length < 2}
            className="px-6 py-2.5 bg-[#BDBDBD] hover:bg-[#14A64A] disabled:bg-[#BDBDBD] disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors uppercase text-sm w-40"
          >
            So sánh ngay
          </button>
          <button 
            onClick={onClear}
            className="text-sm text-[#1A73E8] hover:underline"
          >
            Xóa tất cả sản phẩm
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export const OnlineOrdering: React.FC<{ onNavigateToSupplier?: (id: number) => void }> = ({ onNavigateToSupplier }) => {
  type Message = { id: string; sender: 'user' | 'supplier'; text: string; time: string; };
  type ChatSession = {
    supplierId: number;
    isMinimized: boolean;
    messages: Message[];
    inputValue: string;
  };

  const [searchCategory, setSearchCategory] = useState('Phụ tùng');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedCartSupplier, setSelectedCartSupplier] = useState<number | 'all'>('all');
  const [activeChats, setActiveChats] = useState<ChatSession[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, string>>({ 1: '1', 2: '1' });
  const [showError, setShowError] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Checkout states
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSupplier, setCheckoutSupplier] = useState<number | null>(null);
  const [showNewSupplierDialog, setShowNewSupplierDialog] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  // Checkout form states
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    mst: '',
    address: '',
    email: '',
    phone: ''
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    locationName: '',
    address: '',
    receiver: '',
    phone: '',
    note: ''
  });

  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [viewingProductReviews, setViewingProductReviews] = useState<number | null>(null);
  const [compareList, setCompareList] = useState<typeof PRODUCTS>([]);
  const [isComparing, setIsComparing] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const vehicleSelectorRef = useRef<HTMLDivElement>(null);

  const { addCommercialSale, addPurchaseOrder, cart, addToCart, updateCartQuantity, removeFromCart, clearCart } = useOrderContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        setIsFocused(false);
      }
      if (vehicleSelectorRef.current && !vehicleSelectorRef.current.contains(event.target as Node)) {
        setShowVehicleSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
  };

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleQuantityChange = (id: number, value: string) => {
    setQuantities({ ...quantities, [id]: formatNumber(value) });
  };

  const handleAddToCompare = (product: typeof PRODUCTS[0]) => {
    if (compareList.find(p => p.id === product.id)) {
      setToast('Sản phẩm đã có trong danh sách so sánh');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (compareList.length >= 3) {
      setToast('Chỉ có thể so sánh tối đa 3 sản phẩm');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setCompareList([...compareList, product]);
    setToast('Đã thêm vào danh sách so sánh');
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    const qtyStr = quantities[product.id] || '1';
    const qty = parseInt(qtyStr.replace(/,/g, ''), 10);
    
    if (isNaN(qty) || qty <= 0) return;
    
    if (qty > product.stock) {
      alert(`Số lượng vượt quá tồn kho (${product.stock})`);
      return;
    }

    addToCart(product.id, qty);

    setToast(`Đã thêm ${product.name} vào giỏ hàng thành công`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.stock) {
      alert(`Số lượng vượt quá tồn kho (${product.stock})`);
      return;
    }

    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  const handleOpenChat = (supplierId: number) => {
    setActiveChats(prev => {
      if (prev.find(c => c.supplierId === supplierId)) {
        return prev.map(c => c.supplierId === supplierId ? { ...c, isMinimized: false } : c);
      }
      return [...prev, {
        supplierId,
        isMinimized: false,
        inputValue: '',
        messages: [
          { id: '1', sender: 'user', text: 'Chào anh, em cần báo giá lốp xe Michelin 195/65R15', time: '14:10' },
          { id: '2', sender: 'supplier', text: 'Báo giá lốp xe đã gửi', time: '14:20' },
          { id: '3', sender: 'supplier', text: 'Chào bạn, tôi có thể hỗ trợ gì về đơn hàng này?', time: '14:21' }
        ]
      }];
    });
  };

  const handleSendMessage = (supplierId: number) => {
    setActiveChats(prev => prev.map(chat => {
      if (chat.supplierId === supplierId && chat.inputValue.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: chat.inputValue.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setTimeout(() => {
          setActiveChats(currentChats => currentChats.map(c => {
            if (c.supplierId === supplierId) {
              return {
                ...c,
                messages: [...c.messages, {
                  id: (Date.now() + 1).toString(),
                  sender: 'supplier',
                  text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ kiểm tra và phản hồi sớm nhất.',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]
              };
            }
            return c;
          }));
        }, 1000);

        return {
          ...chat,
          inputValue: '',
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setShowError(true);
    } else {
      setShowError(false);
      // Implement actual search logic here
    }
    setShowHistory(false);
  };

  const cartSupplierIds = Array.from(new Set(cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return product ? product.supplierId : null;
  }).filter((id): id is number => id !== null)));

  useEffect(() => {
    if (selectedCartSupplier !== 'all' && !cartSupplierIds.includes(selectedCartSupplier)) {
      setSelectedCartSupplier('all');
    }
  }, [cartSupplierIds, selectedCartSupplier]);

  const filteredCart = cart.filter(item => {
    if (selectedCartSupplier === 'all') return true;
    const product = PRODUCTS.find(p => p.id === item.productId);
    return product && product.supplierId === selectedCartSupplier;
  });

  const cartTotal = filteredCart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const cartItemsCount = filteredCart.reduce((count, item) => count + item.quantity, 0);

  const handleFinalizeOrder = () => {
    const orderId = `PO-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    setGeneratedOrderId(orderId);

    const supplier = SUPPLIERS.find(s => s.id === checkoutSupplier);
    const warehouse = WAREHOUSES.find(w => w.name === shippingInfo.locationName);
    
    // Add to Purchase Orders (Đơn đặt hàng)
    addPurchaseOrder({
      id: Date.now().toString(),
      poCode: orderId,
      prCode: `PR-${Date.now().toString().slice(-4)}`,
      status: 'Mới',
      viaWarehouse: true,
      warehouseCode: warehouse?.id || 'KHO01',
      warehouseName: shippingInfo.locationName || 'Kho Chính',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      proposalType: 'Mua mới',
      ro: selectedVehicle ? `RO-${selectedVehicle.plate || '123'}` : '',
      plate: selectedVehicle?.plate || '',
      total: formatCurrency(cartTotal).replace('đ', ''),
      receiverName: shippingInfo.receiver || 'Người dùng',
      receiverPhone: shippingInfo.phone || '0901234567',
      receiverAddress: shippingInfo.address || 'Địa chỉ giao hàng',
      receiveNote: shippingInfo.note || '',
      supplierCode: `NCC0${supplier?.id}`,
      supplierName: supplier?.name || '',
      importedQty: '0',
      unimportedQty: cartItemsCount.toString(),
      description: 'Đơn hàng Online',
      isOnline: true,
    });

    // Add to Commercial Sales (Bán hàng thương mại)
    addCommercialSale({
      id: Date.now().toString(),
      ro: orderId,
      date: new Date().toLocaleDateString('vi-VN'),
      type: 'Online',
      status: 'Đang xử lý',
      paymentStatus: 'Chưa thanh toán',
      customerId: 'KH_ONLINE',
      customerName: 'Khách hàng Online',
      isCompany: 'Không',
      phone: '0901234567',
      total: formatCurrency(cartTotal).replace('đ', ''),
      paid: '0',
      remaining: formatCurrency(cartTotal).replace('đ', ''),
      note: 'Đơn từ hệ thống Đặt hàng Online'
    });

    // Cart clean-up
    clearCart();
    
    // Show success screen
    setOrderSuccess(true);
  };

  const handleAutoFillCompany = () => {
    setBillingInfo({
      name: 'Công ty TNHH ABC',
      mst: '0123456789',
      address: '789 Trần Hưng Đạo, Q5, HCM',
      email: 'contact@abc.com',
      phone: '0909123456'
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationName = e.target.value;
    const warehouse = WAREHOUSES.find(w => w.name === locationName);
    setShippingInfo(prev => ({
      ...prev,
      locationName,
      address: warehouse ? warehouse.address : ''
    }));
  };

  if (isComparing) {
    return (
      <ProductComparison 
        products={compareList}
        onBack={() => setIsComparing(false)}
        onRemove={(id) => {
          const newList = compareList.filter(p => p.id !== id);
          setCompareList(newList);
          if (newList.length === 0) setIsComparing(false);
        }}
        onAddProduct={() => setIsComparing(false)}
      />
    );
  }

  if (viewingProductReviews) {
    const product = PRODUCTS.find(p => p.id === viewingProductReviews);
    if (product) {
      return (
        <ProductReviews 
          productId={product.id} 
          productName={product.name} 
          onBack={() => setViewingProductReviews(null)} 
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F2FBF5] font-sans relative">
      {/* Overlay for Focus Mode */}
      {isFocused && (
        <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none transition-opacity duration-300"></div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 right-4 bg-white border border-[#14A64A] shadow-lg rounded-md p-4 flex items-center gap-3 z-50 animate-fadeIn">
          <div className="w-6 h-6 bg-[#14A64A] rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20 sticky top-0">
        <div className="w-1/4">
          <h1 className="text-lg font-bold text-[#052E15] uppercase tracking-tight">
            Tra cứu và đặt hàng online
          </h1>
        </div>

        <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
          <div className={`flex items-center border rounded-md overflow-hidden transition-colors duration-200 bg-white ${isFocused ? 'border-[#14A64A] ring-1 ring-[#14A64A]' : 'border-gray-300'}`}>
            <div className="relative border-r border-gray-300">
              <select 
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="appearance-none bg-transparent py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option value="Phụ tùng">Phụ tùng</option>
                <option value="Lốp">Lốp</option>
                <option value="Hóa chất">Hóa chất</option>
                <option value="Linh kiện">Linh kiện</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            
            <div className="flex-1 relative flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { setIsFocused(true); setShowHistory(true); }}
                placeholder="Nhập hãng sản xuất hoặc tên sản phẩm..."
                className="w-full py-2.5 px-4 text-sm outline-none bg-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600 mr-1">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setShowHistory(!showHistory)} className="p-1 text-gray-400 hover:text-gray-600 mr-2">
                <Clock className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleSearch}
              className="bg-[#14A64A] hover:bg-green-700 text-white px-6 py-2.5 text-sm font-bold transition-colors"
            >
              TÌM KIẾM
            </button>
          </div>

          {/* Search History Dropdown */}
          {showHistory && isFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-30">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Lịch sử tìm kiếm</div>
              {SEARCH_HISTORY.map((item, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  onClick={() => { setSearchQuery(item); setShowHistory(false); setIsFocused(false); }}
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-1/4 flex justify-end items-center gap-6 relative" ref={vehicleSelectorRef}>
          <button 
            onClick={() => setShowOrderHistory(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#14A64A] hover:bg-[#F2FBF5] text-gray-700 hover:text-[#14A64A] rounded-md text-sm font-medium transition-colors shadow-sm"
            title="Xem lịch sử đặt hàng"
          >
            <History className="w-4 h-4" />
            <span>Lịch sử đặt hàng</span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowVehicleSelector(!showVehicleSelector)}>
            <span className="text-sm font-medium text-[#052E15]">
              {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}` : 'Chọn phương tiện'}
            </span>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Car className="w-4 h-4 text-gray-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          
          {showVehicleSelector && (
            <VehicleSelectorPopup onClose={() => setShowVehicleSelector(false)} onSelect={(v) => { setSelectedVehicle(v); setShowVehicleSelector(false); }} />
          )}
        </div>
      </header>

      {/* Error Message */}
      {showError && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-start gap-3 z-10">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            Không tìm thấy sản phẩm. Bạn có muốn thử tìm theo <span className="font-bold">Tên hãng</span> hoặc <span className="font-bold">Mã phụ tùng</span> không?
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Column 1: Filters (20%) */}
        <div className="w-1/5 bg-white border-r border-gray-200 overflow-y-auto p-5 space-y-6">
          {searchCategory === 'Phụ tùng' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Nguồn hàng phụ tùng</h3>
              <div className="space-y-2">
                {['Chính hãng', 'OEM', 'Tái chế / Tháo xe'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {searchCategory === 'Lốp' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Vị trí lốp</h3>
              <div className="space-y-2">
                {['Trước', 'Sau'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Tình trạng</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                <span className="text-sm font-medium text-gray-800">Còn hàng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                <span className="text-sm text-[#3B6E4B]">Hết hàng</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Thương hiệu</h3>
            <div className="space-y-2">
              {[
                { name: 'Michelin', count: 120 },
                { name: 'Brembo', count: 45 },
                { name: 'Bosch', count: 89 },
                { name: 'Denso', count: 56 },
              ].map(item => (
                <label key={item.name} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">({item.count})</span>
                </label>
              ))}
              <button className="text-sm text-[#3B6E4B] hover:text-[#14A64A] underline mt-2">
                + Xem tất cả
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Hình thức bảo hành</h3>
            <div className="space-y-2">
              {['Theo KM', 'Theo thời gian'].map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Product List (55%) */}
        <div className="w-[55%] overflow-y-auto p-6 space-y-6">
          {/* Suppliers Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
            {SUPPLIERS.map(supplier => (
              <div 
                key={supplier.id}
                onClick={() => setSelectedSupplier(supplier.id === selectedSupplier ? null : supplier.id)}
                className={`flex-shrink-0 w-72 bg-white rounded-lg p-4 cursor-pointer transition-all snap-start relative
                  ${selectedSupplier === supplier.id ? 'border-2 border-[#14A64A] shadow-md' : 'border border-[#BCE3CD] hover:border-[#14A64A]/50'}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                      {supplier.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{supplier.name}</h4>
                      <p className="text-xs text-gray-500">MST: {supplier.mst}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 truncate" title={supplier.address}>{supplier.address}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-800">{supplier.rating || 0}/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= Math.round(supplier.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-medium text-gray-500">Đã đặt: <span className="text-gray-800">{supplier.orders} đơn</span></span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToSupplier?.(supplier.id);
                      }}
                      title="Xem thông tin chi tiết nhà cung cấp"
                      className="p-1.5 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChat(supplier.id);
                      }}
                      title="Chat"
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {selectedSupplier === supplier.id && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#14A64A] rounded-full flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {PRODUCTS.filter(p => selectedSupplier === null || p.supplierId === selectedSupplier).map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-[#052E15]">{product.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-500">SKU: <span className="font-mono text-gray-800">{product.sku}</span></span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="px-2 py-0.5 border border-[#BCE3CD] rounded text-xs font-medium text-[#3B6E4B] bg-[#F2FBF5]">
                        Vị trí: {product.position}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-500">Tương thích: {product.compatible}</span>
                    </div>
                    
                    {/* Inventory Poka-yoke */}
                    <div className="inline-flex items-center gap-2 bg-[#14A64A] text-white px-3 py-1 rounded text-xs font-bold mt-2">
                      <span>Kho {product.location}</span>
                      <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                      <span>Số lượng: {product.stock}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-[#052E15]">{formatCurrency(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-400 line-through mt-0.5">{formatCurrency(product.originalPrice)}</div>
                    )}
                  </div>
                </div>

                {/* Embedded Help */}
                <div className="bg-[#F2FBF5] rounded-md p-3 text-sm text-[#3B6E4B] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Chất liệu:</span> {product.material}. <span className="font-semibold text-orange-600">Cảnh báo:</span> {product.warning}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setViewingProductReviews(product.id)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#14A64A] transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Xem đánh giá
                    </button>
                    <button 
                      onClick={() => handleAddToCompare(product)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#14A64A] transition-colors"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      So sánh
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:border-[#14A64A] focus-within:ring-1 focus-within:ring-[#14A64A] transition-all">
                      <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">SL</span>
                      <input 
                        type="text" 
                        value={quantities[product.id] || '1'}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-16 py-1.5 px-2 text-center text-sm font-mono outline-none"
                        title="Vui lòng chỉ nhập số"
                      />
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={parseInt((quantities[product.id] || '1').replace(/,/g, ''), 10) > product.stock}
                      className="flex items-center gap-2 bg-[#14A64A] hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Cart (25%) */}
        <div className="w-1/4 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Giỏ hàng của bạn
            </h2>
            
            {cartSupplierIds.length > 0 && (
              <div className="mt-3">
                <select 
                  value={selectedCartSupplier} 
                  onChange={(e) => setSelectedCartSupplier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A] bg-white"
                >
                  <option value="all">Tất cả nhà cung cấp</option>
                  {cartSupplierIds.map(id => {
                    const supplier = SUPPLIERS.find(s => s.id === id);
                    return supplier ? <option key={id} value={id}>{supplier.name}</option> : null;
                  })}
                </select>

                {selectedCartSupplier !== 'all' && (
                  <div className="mt-3 p-3 bg-white border border-[#BCE3CD] rounded-md text-xs space-y-1.5 shadow-sm">
                    {(() => {
                      const supplier = SUPPLIERS.find(s => s.id === selectedCartSupplier);
                      if (!supplier) return null;
                      return (
                        <>
                          <div className="font-bold text-[#052E15] text-sm mb-2 border-b border-gray-100 pb-1">{supplier.name}</div>
                          <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5">
                            <div className="text-gray-500">Mã số thuế:</div>
                            <div className="font-medium text-gray-800">{supplier.mst}</div>
                            
                            <div className="text-gray-500">Địa chỉ:</div>
                            <div className="font-medium text-gray-800 line-clamp-2" title={supplier.address}>{supplier.address}</div>
                            
                            <div className="text-gray-500">Điện thoại:</div>
                            <div className="font-medium text-gray-800">{supplier.phone}</div>
                            
                            <div className="text-gray-500">Liên hệ:</div>
                            <div className="font-medium text-gray-800">{supplier.contactPerson}</div>
                            
                            <div className="text-gray-500">Tổng đơn:</div>
                            <div className="font-medium text-[#14A64A]">{supplier.orders}</div>
                            
                            <div className="text-gray-500">Ngày ĐK:</div>
                            <div className="font-medium text-gray-800">{supplier.registrationDate}</div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
                <div>
                  <div className="font-bold text-gray-600">Giỏ hàng của bạn đang trống</div>
                  <div className="text-sm text-gray-400 mt-1">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</div>
                </div>
              </div>
            ) : filteredCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                <div className="font-bold text-gray-600">Không có sản phẩm</div>
                <div className="text-sm text-gray-400 mt-1">Nhà cung cấp này không có sản phẩm trong giỏ hàng</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCart.map((item, idx) => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 relative group">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 pr-6">{product.name}</div>
                        <div className="text-xs text-gray-500 mb-2">SKU: {product.sku}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-[#14A64A]">{formatCurrency(product.price)}</div>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button 
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input 
                              type="text" 
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                if (!isNaN(val)) {
                                  handleUpdateCartQuantity(item.productId, val);
                                } else if (e.target.value === '') {
                                  // Allow empty string temporarily while typing
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === '' || parseInt(e.target.value, 10) <= 0) {
                                  handleUpdateCartQuantity(item.productId, 1);
                                }
                              }}
                              className="w-10 py-1 text-center text-xs font-mono outline-none border-x border-gray-300"
                            />
                            <button 
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Tổng thanh toán ({cartItemsCount} sản phẩm):</span>
              <span className="text-lg font-bold text-[#052E15]">{formatCurrency(cartTotal)}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={() => {
                if (selectedCartSupplier === 'all') {
                  setCheckoutError('Không thể tiến hành đặt hàng. Để đảm bảo tính chính xác và tuân thủ pháp lý, đơn hàng phải được xử lý riêng biệt theo từng Nhà cung cấp. Vui lòng chọn một Nhà cung cấp cụ thể từ danh sách trước khi tiếp tục.');
                } else {
                  setCheckoutError(null);
                  setCheckoutSupplier(selectedCartSupplier);
                  setShowCheckoutModal(true);
                }
              }}
              className="w-full bg-[#14A64A] hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
            >
              TIẾN HÀNH ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
      
      {/* Order History View */}
      {showOrderHistory && (
        <OrderHistoryView onClose={() => setShowOrderHistory(false)} />
      )}

      {/* Checkout Error Modal */}
      {checkoutError && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-red-800">Không thể tiến hành đặt hàng</h3>
            </div>
            <div className="p-4 space-y-3 text-sm text-gray-700">
              <p>Để đảm bảo tính chính xác và tuân thủ pháp lý, đơn hàng phải được xử lý riêng biệt theo từng Nhà cung cấp.</p>
              <p className="font-medium">Vui lòng chọn một Nhà cung cấp cụ thể từ danh sách trước khi tiếp tục.</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setCheckoutError(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && checkoutSupplier && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Đối soát đơn hàng</h2>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Supplier Info */}
              {(() => {
                const supplier = SUPPLIERS.find(s => s.id === checkoutSupplier);
                if (!supplier) return null;
                return (
                  <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Thông tin Nhà cung cấp</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Pháp lý</div>
                          <div className="font-medium text-gray-800">{supplier.name}</div>
                          <div className="text-sm text-gray-600">MST: {supplier.mst}</div>
                          <div className="text-sm text-gray-600">{supplier.address}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Uy tín</div>
                          <div className="text-sm text-gray-600">Ngày đăng ký: {supplier.registrationDate}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Liên lạc</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-800">{supplier.contactPerson}</span>
                          <span className="text-gray-300">|</span>
                          <a href={`tel:${supplier.phone}`} className="text-[#1A73E8] hover:underline font-medium">{supplier.phone}</a>
                        </div>
                        <button 
                          onClick={() => handleOpenChat(supplier.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" /> Chat với nhà cung cấp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Billing Info */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-lg text-gray-800">Thông tin xuất hóa đơn</h3>
                  <button 
                    onClick={handleAutoFillCompany}
                    className="px-3 py-1.5 bg-[#E8F0FE] text-[#1A73E8] hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                  >
                    Tự động nhập thông tin công ty
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Tên công ty / cá nhân</label>
                    <input 
                      type="text" 
                      value={billingInfo.name}
                      onChange={e => setBillingInfo({...billingInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">MST</label>
                    <input 
                      type="text" 
                      value={billingInfo.mst}
                      onChange={e => setBillingInfo({...billingInfo, mst: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input 
                      type="text" 
                      value={billingInfo.address}
                      onChange={e => setBillingInfo({...billingInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      value={billingInfo.email}
                      onChange={e => setBillingInfo({...billingInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={billingInfo.phone}
                      onChange={e => setBillingInfo({...billingInfo, phone: e.target.value.replace(/\D/g, '')})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
                <h3 className="font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Thông tin nhận hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Tên địa điểm nhận hàng</label>
                    <div className="relative">
                      <select 
                        value={shippingInfo.locationName}
                        onChange={handleLocationChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A] appearance-none bg-white"
                      >
                        <option value="">Chọn địa điểm</option>
                        {WAREHOUSES.map(w => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input 
                      type="text" 
                      value={shippingInfo.address}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-gray-50 text-gray-500" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Người nhận</label>
                    <input 
                      type="text" 
                      value={shippingInfo.receiver}
                      onChange={e => setShippingInfo({...shippingInfo, receiver: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value.replace(/\D/g, '')})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A]" 
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                    <textarea 
                      value={shippingInfo.note}
                      onChange={e => setShippingInfo({...shippingInfo, note: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#14A64A] h-20 resize-none" 
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Chi tiết Đơn hàng</h3>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">Sản phẩm</th>
                      <th className="px-5 py-3 font-medium text-right">Đơn giá</th>
                      <th className="px-5 py-3 font-medium text-center">Số lượng</th>
                      <th className="px-5 py-3 font-medium text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCart.map((item, idx) => {
                      const product = PRODUCTS.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <tr key={idx}>
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-800">{product.name}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                          </td>
                          <td className="px-5 py-4 text-right">{formatCurrency(product.price)}</td>
                          <td className="px-5 py-4 text-center">{item.quantity}</td>
                          <td className="px-5 py-4 text-right font-medium text-[#14A64A]">{formatCurrency(product.price * item.quantity)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-800">Tổng giá trị:</td>
                      <td className="px-5 py-4 text-right font-bold text-[#052E15] text-lg">{formatCurrency(cartTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCheckoutModal(false)} className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors">Hủy</button>
              <button 
                onClick={() => {
                  // Simulate checking MST. Let's say supplier 2 (Michelin) is new.
                  if (checkoutSupplier === 2) {
                    setShowNewSupplierDialog(true);
                  } else {
                    handleFinalizeOrder();
                  }
                }} 
                className="px-6 py-2.5 bg-[#14A64A] hover:bg-green-700 text-white rounded-md font-bold transition-colors"
              >
                Xác nhận Đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Supplier Dialog */}
      {showNewSupplierDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-[450px] overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Nhà cung cấp mới</h3>
              <p className="text-sm text-gray-600">Hệ thống nhận thấy Mã số thuế này chưa tồn tại trong danh mục. Bạn có đồng ý khởi tạo thông tin này vào danh mục hệ thống không?</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowNewSupplierDialog(false)} className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors">Hủy</button>
              <button 
                onClick={() => {
                  setShowNewSupplierDialog(false);
                  setToast('Khởi tạo dữ liệu Nhà cung cấp thành công');
                  setTimeout(() => setToast(null), 3000);
                  handleFinalizeOrder();
                }} 
                className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md font-bold transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white">
          <div className="max-w-md w-full text-center space-y-6 p-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-12 h-12 text-[#14A64A]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h2>
              <p className="text-gray-600">Đơn hàng của bạn đã được lưu vào hệ thống.</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-bold text-[#1A73E8] cursor-pointer hover:underline">{generatedOrderId || 'PO-2024-001'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="font-medium text-gray-800">Đã lưu</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phân loại:</span>
                <span className="font-medium text-gray-800">Online</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setOrderSuccess(false);
                setShowCheckoutModal(false);
                setCheckoutSupplier(null);
              }} 
              className="w-full py-3 bg-[#14A64A] hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}

      {/* Chat Popups */}
      <div className="fixed right-6 bottom-6 flex items-end gap-4 z-50 pointer-events-none">
        {activeChats.map((chat) => {
          const chatSupplier = SUPPLIERS.find(s => s.id === chat.supplierId);
          if (!chatSupplier) return null;
          
          return (
            <div key={chat.supplierId} className={`w-[350px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 pointer-events-auto ${chat.isMinimized ? 'h-16' : 'h-[500px]'}`}>
              {/* Header */}
              <div 
                className="flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer bg-white rounded-t-xl" 
                onClick={() => setActiveChats(prev => prev.map(c => c.supplierId === chat.supplierId ? { ...c, isMinimized: !c.isMinimized } : c))}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#E8F0FE] text-[#1A73E8] rounded-full flex items-center justify-center font-bold text-sm">
                      {chatSupplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#14A64A] border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{chatSupplier.name}</h3>
                    <p className="text-xs text-gray-500">Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setActiveChats(prev => prev.map(c => c.supplierId === chat.supplierId ? { ...c, isMinimized: !c.isMinimized } : c)); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveChats(prev => prev.filter(c => c.supplierId !== chat.supplierId)); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {!chat.isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                    {chat.messages.map(msg => (
                      msg.sender === 'user' ? (
                        <div key={msg.id} className="flex flex-col items-end">
                          <div className="bg-[#dcf8c6] text-gray-800 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-sm">
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                            <span>{msg.time}</span>
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        </div>
                      ) : (
                        <div key={msg.id} className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                            <img src="https://picsum.photos/seed/avatar/100/100" alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="bg-white border border-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm text-sm">
                              {msg.text}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              {msg.id === '2' && (
                                <div className="flex items-center gap-1">
                                  <button className="p-1.5 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-gray-50 shadow-sm transition-colors">
                                    <Heart className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 bg-white border border-gray-200 rounded-full text-blue-500 hover:bg-gray-50 shadow-sm transition-colors">
                                    <Reply className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 bg-white border border-gray-200 rounded-full text-yellow-500 hover:bg-gray-50 shadow-sm transition-colors">
                                    <Pin className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              <span className="text-[11px] text-gray-400 ml-1">{msg.time}</span>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-3 rounded-b-xl">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors">
                        <Camera className="w-3.5 h-3.5" /> Camera
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" /> Gallery
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors">
                        <CheckSquare className="w-3.5 h-3.5" /> Checklist
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors">
                        <Mic className="w-3.5 h-3.5" /> Voice
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors">
                        <AlertCircle className="w-3.5 h-3.5" /> Ưu tiên
                      </button>
                    </div>
                    
                    {/* Input row */}
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
                        <Plus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={chat.inputValue}
                          onChange={(e) => setActiveChats(prev => prev.map(c => c.supplierId === chat.supplierId ? { ...c, inputValue: e.target.value } : c))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(chat.supplierId);
                          }}
                          placeholder="Nhập tin nhắn..." 
                          className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => handleSendMessage(chat.supplierId)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${chat.inputValue.trim() ? 'bg-[#1A73E8] hover:bg-blue-700 text-white shadow-sm' : 'bg-gray-200 text-white cursor-not-allowed'}`}
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {compareList.length > 0 && (
        <ComparePopup 
          products={compareList} 
          onRemove={(id) => setCompareList(compareList.filter(p => p.id !== id))}
          onClear={() => setCompareList([])}
          onCompare={() => setIsComparing(true)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
