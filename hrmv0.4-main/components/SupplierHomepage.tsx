import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, ArrowLeft, Search, ShoppingCart, User, Check } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { useOrderContext } from '../context/OrderContext';

interface SupplierHomepageProps {
  supplierId: number;
  onBack: () => void;
}

const CATEGORIES = [
  {
    id: 1,
    name: 'PHỤ TÙNG ĐỘNG CƠ',
    image: 'https://picsum.photos/seed/engine_parts/300/200',
    type: 'Phụ tùng'
  },
  {
    id: 2,
    name: 'HÓA CHẤT & DẦU NHỚT',
    image: 'https://picsum.photos/seed/oil_chemical/300/200',
    type: 'Hóa chất'
  },
  {
    id: 3,
    name: 'LỐP XE DU LỊCH',
    image: 'https://picsum.photos/seed/car_tires/300/200',
    type: 'Lốp'
  },
  {
    id: 4,
    name: 'THIẾT BỊ CHẨN ĐOÁN',
    image: 'https://picsum.photos/seed/diagnostic_tool/300/200',
    type: 'Thiết bị'
  },
  {
    id: 5,
    name: 'HỆ THỐNG PHANH',
    image: 'https://picsum.photos/seed/brakes/300/200',
    type: 'Phụ tùng'
  },
  {
    id: 6,
    name: 'ACQUY & ĐIỆN',
    image: 'https://picsum.photos/seed/battery/300/200',
    type: 'Phụ tùng'
  },
  {
    id: 7,
    name: 'CHĂM SÓC XE',
    image: 'https://picsum.photos/seed/car_care/300/200',
    type: 'Hóa chất'
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Anh Duy Hà',
    avatar: 'https://picsum.photos/seed/mechanic1/100/100',
    text: 'Phụ tùng chính hãng, độ bền cao. Tôi rất yên tâm khi nhập hàng từ nhà cung cấp này cho gara của mình.'
  },
  {
    id: 2,
    name: 'Anh Tuấn Anh',
    avatar: 'https://picsum.photos/seed/mechanic2/100/100',
    text: 'Giá cả lốp xe và dầu nhớt rất cạnh tranh, chiết khấu tốt cho đại lý. Giao hàng nhanh chóng.'
  },
  {
    id: 3,
    name: 'Chị Hoàng Ngân',
    avatar: 'https://picsum.photos/seed/mechanic3/100/100',
    text: 'Danh mục sản phẩm đa dạng từ ốc vít đến máy chẩn đoán. Hỗ trợ kỹ thuật rất nhiệt tình.'
  }
];

const SUPPLIERS_DATA: Record<number, { name: string; logo: string; productCount: number; description: string }> = {
  1: { 
    name: 'Vinaparts', 
    logo: 'Vina.', 
    productCount: 120,
    description: 'Vinaparts là nhà phân phối phụ tùng ô tô hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm chính hãng cho các dòng xe Toyota, Honda, Mazda, Ford... Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, nguồn gốc rõ ràng và giá cả hợp lý nhất cho các gara và đại lý trên toàn quốc.'
  },
  2: { 
    name: 'Michelin VN', 
    logo: 'Mich.', 
    productCount: 85,
    description: 'Michelin Việt Nam tự hào mang đến những dòng lốp xe chất lượng vượt trội, đảm bảo an toàn và hiệu suất tối ưu trên mọi cung đường. Với công nghệ tiên tiến và độ bền bỉ, lốp Michelin là sự lựa chọn tin cậy của hàng triệu tài xế Việt.'
  },
};

export const SupplierHomepage: React.FC<SupplierHomepageProps> = ({ supplierId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'products'>('home');
  const { addToCart } = useOrderContext();
  const [toast, setToast] = useState<string | null>(null);

  const supplier = SUPPLIERS_DATA[supplierId] || {
    name: 'Phụ Tùng Chính Hãng',
    productCount: 57,
    logo: 'Auto.',
    description: 'Chuyên cung cấp phụ tùng, hóa chất, lốp và thiết bị sửa chữa ô tô chất lượng cao. Đối tác tin cậy của hơn 500 gara trên toàn quốc. Cam kết hàng chính hãng 100%, bảo hành dài hạn và hỗ trợ kỹ thuật 24/7.'
  };

  // Filter products by supplierId. If no match (mock data limitation), show all or a subset.
  // For now, let's filter by supplierId if it matches, otherwise show all for demo purposes if the list is empty.
  let supplierProducts = MOCK_PRODUCTS.filter(p => p.supplierId === supplierId);
  if (supplierProducts.length === 0) {
    supplierProducts = MOCK_PRODUCTS; // Fallback to show something if ID doesn't match mock data
  }

  const handleAddToCart = (product: any) => {
    addToCart(product.id, 1);
    setToast(`Đã thêm ${product.name} vào giỏ hàng`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-white border border-[#14A64A] shadow-lg rounded-md p-4 flex items-center gap-3 z-[60] animate-fadeIn">
          <div className="w-6 h-6 bg-[#14A64A] rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">{toast}</span>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm -my-2 relative z-10">
                {supplier.logo}
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">{supplier.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Sản phẩm: {supplier.productCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section - Always Visible */}
      <div className="bg-[#FDF8F3] py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
              <span className="text-[#14A64A]">buymed</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="font-bold text-2xl text-gray-900">{supplier.name} <span className="text-sm font-normal text-gray-500">Đối tác tin cậy.</span></div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="font-bold text-2xl text-[#052E15] uppercase">PHÂN PHỐI CHÍNH HÃNG</div>
          </div>

          {/* Carousel */}
          <div className="relative group px-12">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 transition-all z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="grid grid-cols-4 gap-6">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <div key={cat.id} className="flex flex-col gap-4 group/item cursor-pointer">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md border-2 border-transparent group-hover/item:border-[#14A64A] transition-all bg-white">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500" />
                  </div>
                  <button className="w-full py-3 px-4 bg-[#F5F5F0] border border-[#E0E0E0] rounded text-sm font-bold text-gray-700 uppercase hover:bg-[#14A64A] hover:text-white hover:border-[#14A64A] transition-all">
                    {cat.name}
                  </button>
                </div>
              ))}
            </div>

            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 transition-all z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-[#14A64A]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Below Banner */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-12">
            <button 
              onClick={() => setActiveTab('home')}
              className={`py-4 text-base font-bold border-b-4 transition-all px-6 ${activeTab === 'home' ? 'text-[#14A64A] border-[#14A64A]' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`py-4 text-base font-bold border-b-4 transition-all px-6 ${activeTab === 'products' ? 'text-[#14A64A] border-[#14A64A]' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
            >
              Danh sách sản phẩm
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'home' ? (
        <div className="pb-20">
          {/* About Section */}
          <div className="max-w-[1200px] mx-auto px-4 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu chung</h2>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold">{supplier.name}</span> - {supplier.description}
              </p>
            </div>
          </div>

          {/* Video Section */}
          <div className="max-w-[1200px] mx-auto px-4 mt-8">
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/car_workshop/1200/675" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full p-1">
                  <img src="https://picsum.photos/seed/logo_auto/40/40" alt="Logo" className="w-full h-full rounded-full" />
                </div>
                <div className="text-white font-medium text-lg drop-shadow-md">GIỚI THIỆU QUY TRÌNH SẢN XUẤT VÀ KIỂM ĐỊNH CHẤT LƯỢNG</div>
              </div>
              <div className="absolute bottom-6 left-6 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <span>Xem trên</span>
                <span className="font-bold">YouTube</span>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="max-w-[1200px] mx-auto px-4 mt-12">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Khách hàng nói gì về chúng tôi</h2>
            <div className="grid grid-cols-3 gap-8">
              {TESTIMONIALS.map((item) => (
                <div key={item.id} className="bg-[#F8F9FA] rounded-2xl p-8 pt-12 relative flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="absolute -top-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-4 mt-4">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-6">
            {supplierProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-[#14A64A] text-white text-xs font-bold px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 h-10" title={product.name}>{product.name}</h3>
                  <div className="text-xs text-gray-500 mb-2">SKU: {product.sku}</div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[#14A64A] text-lg">{product.price.toLocaleString()}đ</div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 bg-white border border-[#14A64A] text-[#14A64A] hover:bg-[#14A64A] hover:text-white py-2 rounded-md text-sm font-bold transition-all"
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
      )}
    </div>
  );
};
