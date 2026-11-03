import React, { useState } from 'react';
import { ChevronLeft, Save, Trash2, Link as LinkIcon, History, Plus, FileText, X } from 'lucide-react';

const PLATFORMS = [
  { name: 'Shopee', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { name: 'Lazada', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'Tiki', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { name: 'Tiktok Shop', color: 'text-black', bg: 'bg-gray-100', border: 'border-gray-300' },
  { name: 'Sàn Du Mục', color: 'text-[#14A64A]', bg: 'bg-[#F2FBF5]', border: 'border-[#BCE3CD]' },
];

const MOCK_PRODUCTS = [
  { code: 'P-12345', name: 'Bố thắng trước Vios' },
  { code: 'P-67890', name: 'Lọc dầu Camry' },
];

const MOCK_UNITS = ['Bộ', 'Cái', 'Chiếc', 'Hộp'];

interface ProductRow {
  id: number;
  businessStatus: string;
  productType: string;
  productCode: string;
  internalName: string;
  platform: string;
  salesCode: string;
  platformName: string;
  description: string;
  unit: string;
  quantity: string;
  warrantyTime: string;
  warrantyKm: string;
  originalPrice: string;
  price: string;
  link: string;
}

export const MarketplaceManagement: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState('Tất cả');
  const [businessStatusFilter, setBusinessStatusFilter] = useState('Tất cả');
  const [productTypeFilter, setProductTypeFilter] = useState('Tất cả');
  const [showDescModal, setShowDescModal] = useState<number | null>(null);
  const [newlyAddedRowId, setNewlyAddedRowId] = useState<number | null>(null);

  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: 1,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-12345',
      internalName: 'Bố thắng trước Vios',
      platform: 'Shopee',
      salesCode: 'SP-12345',
      platformName: 'Bố thắng trước Toyota Vios chính hãng',
      description: 'Bố thắng trước chính hãng cho xe Toyota Vios',
      unit: 'Bộ',
      quantity: '1,000',
      warrantyTime: '12',
      warrantyKm: '20000',
      originalPrice: '450,000',
      price: '500,000',
      link: 'https://shopee.vn/product/123',
    },
    {
      id: 2,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-67890',
      internalName: 'Lọc dầu Camry',
      platform: 'Lazada',
      salesCode: 'LZ-67890',
      platformName: 'Lọc dầu nhớt động cơ Toyota Camry',
      description: 'Lọc dầu nhớt động cơ chính hãng cho Toyota Camry',
      unit: 'Cái',
      quantity: '500',
      warrantyTime: '6',
      warrantyKm: '10000',
      originalPrice: '120,000',
      price: '150,000',
      link: 'https://lazada.vn/product/456',
    },
    {
      id: 3,
      businessStatus: 'Ngưng bán',
      productType: 'Phụ tùng',
      productCode: 'P-11223',
      internalName: 'Bugi Iridium Innova',
      platform: 'Tiki',
      salesCode: 'TK-11223',
      platformName: 'Bugi đánh lửa Iridium Toyota Innova',
      description: 'Bugi cao cấp Iridium cho xe Innova',
      unit: 'Chiếc',
      quantity: '0',
      warrantyTime: '24',
      warrantyKm: '40000',
      originalPrice: '200,000',
      price: '250,000',
      link: 'https://tiki.vn/product/789',
    },
    {
      id: 4,
      businessStatus: 'Đang bán',
      productType: 'Vật tư',
      productCode: 'V-33445',
      internalName: 'Nhớt động cơ 5W-30',
      platform: 'Sàn Du Mục',
      salesCode: 'DM-33445',
      platformName: 'Dầu nhớt tổng hợp toàn phần 5W-30 4L',
      description: 'Dầu nhớt động cơ cao cấp 5W-30 can 4 lít',
      unit: 'Hộp',
      quantity: '200',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '800,000',
      price: '950,000',
      link: 'https://dumuc.vn/product/101',
    },
    {
      id: 5,
      businessStatus: 'Hết hàng',
      productType: 'Hóa chất',
      productCode: 'H-55667',
      internalName: 'Nước làm mát màu đỏ',
      platform: 'Tiktok Shop',
      salesCode: 'TT-55667',
      platformName: 'Nước làm mát động cơ pha sẵn màu đỏ 4L',
      description: 'Nước làm mát động cơ ô tô màu đỏ',
      unit: 'Hộp',
      quantity: '0',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '150,000',
      price: '180,000',
      link: 'https://tiktok.com/product/202',
    },
    {
      id: 6,
      businessStatus: 'Đang bán',
      productType: 'Thiết bị',
      productCode: 'T-77889',
      internalName: 'Máy chẩn đoán OBD2',
      platform: 'Shopee',
      salesCode: 'SP-77889',
      platformName: 'Máy đọc lỗi ô tô đa năng OBD2',
      description: 'Thiết bị chẩn đoán lỗi ô tô chuyên nghiệp',
      unit: 'Bộ',
      quantity: '50',
      warrantyTime: '12',
      warrantyKm: '',
      originalPrice: '1,200,000',
      price: '1,500,000',
      link: 'https://shopee.vn/product/303',
    },
    {
      id: 7,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-99001',
      internalName: 'Gạt mưa Bosch 24 inch',
      platform: 'Lazada',
      salesCode: 'LZ-99001',
      platformName: 'Chổi gạt mưa ô tô Bosch Aerotwin 24"',
      description: 'Chổi gạt mưa không xương Bosch chính hãng',
      unit: 'Chiếc',
      quantity: '300',
      warrantyTime: '6',
      warrantyKm: '',
      originalPrice: '250,000',
      price: '320,000',
      link: 'https://lazada.vn/product/404',
    },
    {
      id: 8,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-22334',
      internalName: 'Lọc gió động cơ Mazda 3',
      platform: 'Sàn Du Mục',
      salesCode: 'DM-22334',
      platformName: 'Lọc gió động cơ Mazda 3 2015-2019',
      description: 'Lọc gió động cơ thay thế cho Mazda 3',
      unit: 'Cái',
      quantity: '150',
      warrantyTime: '6',
      warrantyKm: '10000',
      originalPrice: '180,000',
      price: '220,000',
      link: 'https://dumuc.vn/product/505',
    },
    {
      id: 9,
      businessStatus: 'Ngưng bán',
      productType: 'Vật tư',
      productCode: 'V-44556',
      internalName: 'Băng keo điện 3M',
      platform: 'Tiki',
      salesCode: 'TK-44556',
      platformName: 'Băng keo cách điện 3M Super 33+',
      description: 'Băng keo cách điện cao cấp 3M',
      unit: 'Hộp',
      quantity: '0',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '45,000',
      price: '60,000',
      link: 'https://tiki.vn/product/606',
    },
    {
      id: 10,
      businessStatus: 'Đang bán',
      productType: 'Hóa chất',
      productCode: 'H-66778',
      internalName: 'Dung dịch vệ sinh kim phun',
      platform: 'Shopee',
      salesCode: 'SP-66778',
      platformName: 'Phụ gia vệ sinh kim phun buồng đốt 3M',
      description: 'Dung dịch làm sạch hệ thống nhiên liệu',
      unit: 'Hộp',
      quantity: '400',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '110,000',
      price: '145,000',
      link: 'https://shopee.vn/product/707',
    },
    {
      id: 11,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-88990',
      internalName: 'Má phanh sau CRV',
      platform: 'Lazada',
      salesCode: 'LZ-88990',
      platformName: 'Bố thắng sau Honda CRV 2018-2022',
      description: 'Má phanh đĩa sau cho xe Honda CRV',
      unit: 'Bộ',
      quantity: '80',
      warrantyTime: '12',
      warrantyKm: '20000',
      originalPrice: '600,000',
      price: '750,000',
      link: 'https://lazada.vn/product/808',
    },
    {
      id: 12,
      businessStatus: 'Hết hàng',
      productType: 'Thiết bị',
      productCode: 'T-11002',
      internalName: 'Kích thủy lực 2 tấn',
      platform: 'Sàn Du Mục',
      salesCode: 'DM-11002',
      platformName: 'Kích cá sấu thủy lực 2 tấn nâng gầm',
      description: 'Con đội thủy lực dạng cá sấu tải trọng 2 tấn',
      unit: 'Cái',
      quantity: '0',
      warrantyTime: '6',
      warrantyKm: '',
      originalPrice: '850,000',
      price: '1,050,000',
      link: 'https://dumuc.vn/product/909',
    },
    {
      id: 13,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-33221',
      internalName: 'Bơm nước làm mát Morning',
      platform: 'Tiktok Shop',
      salesCode: 'TT-33221',
      platformName: 'Bơm nước động cơ Kia Morning',
      description: 'Bơm nước làm mát chính hãng Kia Morning',
      unit: 'Cái',
      quantity: '45',
      warrantyTime: '12',
      warrantyKm: '30000',
      originalPrice: '420,000',
      price: '550,000',
      link: 'https://tiktok.com/product/111',
    },
    {
      id: 14,
      businessStatus: 'Đang bán',
      productType: 'Vật tư',
      productCode: 'V-55443',
      internalName: 'Bóng đèn pha H4 Philips',
      platform: 'Shopee',
      salesCode: 'SP-55443',
      platformName: 'Bóng đèn pha ô tô Halogen H4 Philips',
      description: 'Bóng đèn pha tăng sáng Philips H4',
      unit: 'Hộp',
      quantity: '120',
      warrantyTime: '6',
      warrantyKm: '',
      originalPrice: '180,000',
      price: '230,000',
      link: 'https://shopee.vn/product/222',
    },
    {
      id: 15,
      businessStatus: 'Ngưng bán',
      productType: 'Hóa chất',
      productCode: 'H-77665',
      internalName: 'Nước rửa kính đậm đặc',
      platform: 'Lazada',
      salesCode: 'LZ-77665',
      platformName: 'Viên sủi nước rửa kính ô tô',
      description: 'Viên sủi pha nước rửa kính chắn gió',
      unit: 'Hộp',
      quantity: '0',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '15,000',
      price: '25,000',
      link: 'https://lazada.vn/product/333',
    },
    {
      id: 16,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-99887',
      internalName: 'Dây curoa tổng City',
      platform: 'Tiki',
      salesCode: 'TK-99887',
      platformName: 'Dây curoa máy phát Honda City',
      description: 'Dây đai truyền động tổng cho Honda City',
      unit: 'Sợi',
      quantity: '60',
      warrantyTime: '12',
      warrantyKm: '40000',
      originalPrice: '280,000',
      price: '350,000',
      link: 'https://tiki.vn/product/444',
    },
    {
      id: 17,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: 'P-11335',
      internalName: 'Rotuyn lái ngoài Ranger',
      platform: 'Sàn Du Mục',
      salesCode: 'DM-11335',
      platformName: 'Rotuyn lái ngoài Ford Ranger',
      description: 'Khớp nối hệ thống lái ngoài xe bán tải Ranger',
      unit: 'Cái',
      quantity: '30',
      warrantyTime: '12',
      warrantyKm: '20000',
      originalPrice: '350,000',
      price: '450,000',
      link: 'https://dumuc.vn/product/555',
    },
    {
      id: 18,
      businessStatus: 'Hết hàng',
      productType: 'Thiết bị',
      productCode: 'T-22446',
      internalName: 'Súng xiết bu lông pin',
      platform: 'Shopee',
      salesCode: 'SP-22446',
      platformName: 'Súng bắn ốc dùng pin Makita',
      description: 'Máy vặn ốc vít động lực dùng pin',
      unit: 'Bộ',
      quantity: '0',
      warrantyTime: '6',
      warrantyKm: '',
      originalPrice: '2,500,000',
      price: '3,100,000',
      link: 'https://shopee.vn/product/666',
    },
    {
      id: 19,
      businessStatus: 'Đang bán',
      productType: 'Vật tư',
      productCode: 'V-33557',
      internalName: 'Cầu chì ô tô các loại',
      platform: 'Lazada',
      salesCode: 'LZ-33557',
      platformName: 'Hộp cầu chì ô tô chân cắm đa năng',
      description: 'Bộ cầu chì thay thế nhiều ampe cho ô tô',
      unit: 'Hộp',
      quantity: '500',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '50,000',
      price: '80,000',
      link: 'https://lazada.vn/product/777',
    },
    {
      id: 20,
      businessStatus: 'Đang bán',
      productType: 'Hóa chất',
      productCode: 'H-44668',
      internalName: 'Chai xịt RP7',
      platform: 'Tiktok Shop',
      salesCode: 'TT-44668',
      platformName: 'Dầu chống rỉ sét và bôi trơn RP7 300g',
      description: 'Bình xịt bôi trơn, chống rỉ sét đa dụng',
      unit: 'Chai',
      quantity: '250',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '65,000',
      price: '85,000',
      link: 'https://tiktok.com/product/888',
    }
  ]);

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAddProduct = () => {
    setBusinessStatusFilter('Tất cả');
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([{
      id: newId,
      businessStatus: 'Đang bán',
      productType: 'Phụ tùng',
      productCode: '',
      internalName: '',
      platform: '',
      salesCode: '',
      platformName: '',
      description: '',
      unit: 'Bộ',
      quantity: '',
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '',
      price: '',
      link: '',
    }, ...products]);
    setNewlyAddedRowId(newId);
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setNewlyAddedRowId(null);
    }, 3000);
  };

  const updateProduct = (id: number, field: keyof ProductRow, value: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'productCode') {
          const matchedProduct = MOCK_PRODUCTS.find(mp => mp.code === value);
          if (matchedProduct) {
            updated.internalName = matchedProduct.name;
          }
        }
        if (field === 'quantity' || field === 'price' || field === 'originalPrice') {
          updated[field] = formatNumber(value);
        }
        return updated;
      }
      return p;
    }));
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchPlatform = platformFilter === 'Tất cả' || p.platform === platformFilter;
    const matchBusinessStatus = businessStatusFilter === 'Tất cả' || p.businessStatus === businessStatusFilter;
    const matchProductType = productTypeFilter === 'Tất cả' || p.productType === productTypeFilter;
    return matchPlatform && matchBusinessStatus && matchProductType;
  });

  return (
    <div className="h-[calc(100vh-64px)] font-sans bg-white text-gray-800 flex flex-col w-full">
      {/* Description Modal */}
      {showDescModal !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Mô tả sản phẩm</h3>
              <button onClick={() => setShowDescModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex-1">
              <textarea 
                className="w-full h-48 border border-gray-300 rounded-md p-3 outline-none focus:border-[#14A64A] resize-none"
                value={products.find(p => p.id === showDescModal)?.description || ''}
                onChange={(e) => updateProduct(showDescModal, 'description', e.target.value)}
                placeholder="Nhập mô tả chi tiết cho sản phẩm..."
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setShowDescModal(null)} className="px-6 py-2 bg-[#14A64A] hover:bg-green-700 text-white rounded-md font-medium transition-colors">
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0 flex flex-col gap-4 z-20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-1">
              Quản lý sàn
            </h1>
            <p className="text-sm text-[#666666]">
              Quản lý danh sách sản phẩm trên các sàn thương mại điện tử
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 mr-1">Trạng thái:</span>
              <div className="flex items-center gap-2">
                {['Tất cả', 'Đang bán', 'Ngưng bán', 'Hết hàng'].map(status => (
                  <button
                    key={status}
                    onClick={() => setBusinessStatusFilter(status)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md border transition-all ${
                      businessStatusFilter === status
                        ? 'bg-[#14A64A] text-white border-[#14A64A] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm font-medium text-gray-600">Tính chất:</span>
              <select 
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#14A64A] bg-gray-50"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Phụ tùng">Phụ tùng</option>
                <option value="Vật tư">Vật tư</option>
                <option value="Hóa chất">Hóa chất</option>
                <option value="Thiết bị">Thiết bị</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Sàn:</span>
              <select 
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#14A64A] bg-gray-50"
              >
                <option value="Tất cả">Tất cả</option>
                {PLATFORMS.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[#14A64A] text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col min-h-0 animate-fadeIn">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left min-w-[1600px]">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">STT</th>
                  <th className="px-4 py-3 w-40">Trạng thái kinh doanh</th>
                  <th className="px-4 py-3 w-32">Mã sản phẩm</th>
                  <th className="px-4 py-3 w-48">Tên sản phẩm (Nội bộ)</th>
                  <th className="px-4 py-3 w-32">Sàn bán</th>
                  <th className="px-4 py-3 w-32">Mã Bán Hàng</th>
                  <th className="px-4 py-3 w-48">Tên sản phẩm (Trên sàn)</th>
                  <th className="px-4 py-3 w-24">ĐVT</th>
                  <th className="px-4 py-3 w-24 text-right">Số lượng tồn</th>
                  <th className="px-4 py-3 w-24 text-center">Bảo hành (tháng)</th>
                  <th className="px-4 py-3 w-24 text-center">Bảo hành (KM)</th>
                  <th className="px-4 py-3 w-32 text-right">Giá gốc</th>
                  <th className="px-4 py-3 w-32 text-right">Giá bán</th>
                  <th className="px-4 py-3 w-40">Link</th>
                  <th className="px-4 py-3 w-24 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((row, index) => {
                  const selectedPlatform = PLATFORMS.find(p => p.name === row.platform);
                  return (
                    <tr key={row.id} className={`group align-top transition-colors duration-500 border-l-4 ${
                      row.id === newlyAddedRowId 
                        ? 'bg-green-50 border-l-[#14A64A]' 
                        : 'hover:bg-gray-50 border-l-transparent'
                    }`}>
                      <td className="px-4 py-3 text-center text-gray-500 pt-4">{index + 1}</td>
                      <td className="px-4 py-2">
                        <select 
                          autoFocus={newlyAddedRowId === row.id}
                          value={row.businessStatus}
                          onChange={(e) => updateProduct(row.id, 'businessStatus', e.target.value)}
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 transition-colors text-sm"
                        >
                          <option value="Đang bán">Đang bán</option>
                          <option value="Ngưng bán">Ngưng bán</option>
                          <option value="Hết hàng">Hết hàng</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select 
                          value={row.productCode}
                          onChange={(e) => updateProduct(row.id, 'productCode', e.target.value)}
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 transition-colors font-mono text-sm"
                        >
                          <option value="">-- Chọn --</option>
                          {MOCK_PRODUCTS.map(p => (
                            <option key={p.code} value={p.code}>{p.code}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.internalName}
                          readOnly
                          className="w-full bg-gray-50 outline-none border border-transparent rounded px-2 py-2 text-gray-500 text-sm"
                          placeholder="Tự động điền..."
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${selectedPlatform ? selectedPlatform.bg + ' ' + selectedPlatform.color + ' ' + selectedPlatform.border : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {row.platform || 'Chưa chọn'}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.salesCode}
                          onChange={(e) => updateProduct(row.id, 'salesCode', e.target.value)}
                          placeholder="SKU sàn..."
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 transition-colors font-mono text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={row.platformName}
                          onChange={(e) => updateProduct(row.id, 'platformName', e.target.value)}
                          placeholder="Tên trên sàn..."
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 transition-colors text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select 
                          value={row.unit}
                          onChange={(e) => updateProduct(row.id, 'unit', e.target.value)}
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-sm"
                        >
                          {MOCK_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.quantity}
                          onChange={(e) => updateProduct(row.id, 'quantity', e.target.value)}
                          placeholder="Vô hạn"
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-right font-mono text-blue-600 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.warrantyTime}
                          onChange={(e) => updateProduct(row.id, 'warrantyTime', e.target.value.replace(/\D/g, ''))}
                          placeholder="Tháng"
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-center text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.warrantyKm}
                          onChange={(e) => updateProduct(row.id, 'warrantyKm', e.target.value.replace(/\D/g, ''))}
                          placeholder="KM"
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-center text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.originalPrice}
                          onChange={(e) => updateProduct(row.id, 'originalPrice', e.target.value)}
                          placeholder="0"
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-right font-mono text-gray-500 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={row.price}
                          onChange={(e) => updateProduct(row.id, 'price', e.target.value)}
                          placeholder="0"
                          className="w-full bg-transparent outline-none border border-gray-200 focus:border-[#14A64A] rounded px-2 py-2 text-right font-mono text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2 border border-gray-200 focus-within:border-[#14A64A] rounded px-2 bg-white transition-colors">
                          <LinkIcon className={`w-4 h-4 flex-shrink-0 ${row.link ? 'text-[#14A64A]' : 'text-gray-400'}`} />
                          <input 
                            value={row.link}
                            onChange={(e) => updateProduct(row.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-transparent outline-none py-2 text-blue-600 text-xs truncate"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center pt-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => setShowDescModal(row.id)} className="text-gray-400 hover:text-[#14A64A] transition-colors" title="Mô tả">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Lịch sử biến động">
                            <History className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeProduct(row.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Xóa liên kết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </main>

      <div className="bg-white border-t border-gray-200 px-8 py-4 flex justify-end items-center flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button className="px-8 py-2.5 rounded-lg bg-[#14A64A] text-white font-medium hover:bg-green-700 transition-colors">
            Lưu
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
