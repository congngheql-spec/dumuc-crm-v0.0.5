import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Trash2, Link as LinkIcon, History, Plus, UploadCloud, FileText, X, CheckCircle } from 'lucide-react';

interface OmnichannelConfigProps {
  onBack: () => void;
}

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

export const OmnichannelConfig: React.FC<OmnichannelConfigProps> = ({ onBack }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMasterEnabled, setIsMasterEnabled] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState({
    dumuc: true,
    shopee: false,
    tiktok: false,
  });
  const [platformFilter, setPlatformFilter] = useState('Tất cả');
  const [businessStatusFilter, setBusinessStatusFilter] = useState('Tất cả');
  const [productTypeFilter, setProductTypeFilter] = useState('Tất cả');
  const [showDescModal, setShowDescModal] = useState<number | null>(null);

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
      warrantyTime: '',
      warrantyKm: '',
      originalPrice: '',
      price: '500,000',
      link: 'https://shopee.vn/product/123',
    }
  ]);

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, {
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
    }]);
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

  const handleRegister = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setIsRegistered(true);
    }, 10000);
  };

  const filteredProducts = products.filter(p => {
    const matchPlatform = platformFilter === 'Tất cả' || p.platform === platformFilter;
    const matchBusinessStatus = businessStatusFilter === 'Tất cả' || p.businessStatus === businessStatusFilter;
    const matchProductType = productTypeFilter === 'Tất cả' || p.productType === productTypeFilter;
    return matchPlatform && matchBusinessStatus && matchProductType;
  });

  return (
    <div className="min-h-full font-sans bg-[#F9FAFB] text-gray-800 flex flex-col relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[100] bg-white border border-green-200 shadow-lg rounded-lg p-4 flex items-start gap-3 animate-fadeIn max-w-md">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-800">Thành công</h4>
            <p className="text-sm text-gray-600 mt-1">Hồ sơ đăng ký đã gửi thành công. Ban Quản trị sẽ duyệt trong 24h.</p>
          </div>
          <button onClick={() => { setShowToast(false); setIsRegistered(true); }} className="text-gray-400 hover:text-gray-600 ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-50 shadow-sm">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-1">
          Kích hoạt bán hàng đa kênh
        </h1>
        <p className="text-sm text-[#666666]">
          Hãy kiểm tra thông tin doanh nghiệp
        </p>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-8 py-8 animate-fadeIn space-y-8">
        {/* Group 1: Company Info */}
        <div className="bg-[#F2FBF5] border border-[#BCE3CD] rounded-xl p-6 shadow-sm">
          <div className="bg-white p-4 rounded-lg border border-[#BCE3CD] text-sm text-[#052E15] mb-6 flex items-start gap-3 shadow-sm">
            <span className="font-bold text-[#14A64A] text-lg leading-none">!</span> 
            <span className="mt-0.5">Thông tin này sẽ hiển thị trên các sàn thương mại điện tử để người mua liên hệ.</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tên công ty <span className="text-red-500">*</span></label>
              <input type="text" defaultValue="Saigon Garage" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mã số thuế <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nhập mã số thuế..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Địa chỉ trụ sở</label>
              <input type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nhập số điện thoại..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Người liên hệ</label>
              <input type="text" placeholder="Nhập tên người liên hệ..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
            </div>

            {/* Giấy chứng nhận đăng ký thành lập */}
            <div className="space-y-4 md:col-span-2 mt-2">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">Giấy chứng nhận đăng ký thành lập (doanh nghiệp, tổ chức, hộ kinh doanh)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Số giấy phép</label>
                  <input type="text" placeholder="Nhập số giấy phép..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Ngày cấp</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nơi cấp</label>
                  <input type="text" placeholder="Nhập nơi cấp..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Chọn file upload</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors">
                    <UploadCloud className="w-5 h-5 text-[#14A64A]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                  <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG, PDF (Tối đa 5MB)</p>
                </div>
              </div>
            </div>

            {/* Người đại diện pháp luật */}
            <div className="space-y-4 md:col-span-2 mt-2">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">Người đại diện pháp luật</h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Họ tên</label>
                <input type="text" placeholder="Nhập họ tên người đại diện..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#14A64A] focus:ring-1 focus:ring-[#14A64A] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Chọn file upload</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors">
                    <UploadCloud className="w-5 h-5 text-[#14A64A]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                  <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG, PDF (Tối đa 5MB)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleRegister}
              className="px-6 py-2.5 bg-[#14A64A] hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Đăng ký bán hàng
            </button>
          </div>
        </div>

        {/* Group 2 & 3: Only show after registration (or we can show them always, but let's show them if isRegistered or just show them anyway. The requirement says "hiển thị tiếp Nhóm 2" after 10s. Let's conditionally render) */}
        {isRegistered && (
          <>
            {/* Group 2: Sales Channels */}
            <div className="bg-white border border-[#14A64A] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Lựa chọn kênh bán hàng</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Đăng ký bán hàng đa kênh</span>
                  <button 
                    onClick={() => setIsMasterEnabled(!isMasterEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMasterEnabled ? 'bg-[#14A64A]' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMasterEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Sàn Du Mục */}
                <div className={`border rounded-xl p-5 flex flex-col gap-3 transition-colors ${selectedChannels.dumuc ? 'border-[#14A64A] bg-[#F2FBF5]' : 'border-gray-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedChannels.dumuc}
                      onChange={(e) => setSelectedChannels({...selectedChannels, dumuc: e.target.checked})}
                      className="mt-1 w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">Sàn Du Mục</div>
                    </div>
                  </label>
                  {selectedChannels.dumuc && (
                    <div className="text-xs text-[#14A64A] font-medium bg-white border border-[#BCE3CD] px-3 py-1 rounded-full inline-block self-start">
                      Đang bán
                    </div>
                  )}
                </div>

                {/* Shopee */}
                <div className={`border rounded-xl p-5 flex flex-col gap-3 transition-colors ${selectedChannels.shopee ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedChannels.shopee}
                      onChange={(e) => setSelectedChannels({...selectedChannels, shopee: e.target.checked})}
                      className="mt-1 w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">Shopee</div>
                    </div>
                  </label>
                  <div className="text-xs text-gray-500">
                    Cần kết nối tài khoản Shopee sau khi lưu.
                  </div>
                </div>

                {/* Tiktok Shop */}
                <div className={`border rounded-xl p-5 flex flex-col gap-3 transition-colors ${selectedChannels.tiktok ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedChannels.tiktok}
                      onChange={(e) => setSelectedChannels({...selectedChannels, tiktok: e.target.checked})}
                      className="mt-1 w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">Tiktok Shop</div>
                    </div>
                  </label>
                  <div className="text-xs text-gray-500">
                    Đảm bảo sản phẩm tuân thủ chính sách của Tiktok.
                  </div>
                </div>
              </div>
            </div>

            {/* Group 3: Product List */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Danh sách sản phẩm</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                    <select 
                      value={businessStatusFilter}
                      onChange={(e) => setBusinessStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#14A64A]"
                    >
                      <option value="Tất cả">Tất cả</option>
                      <option value="Đang bán">Đang bán</option>
                      <option value="Ngưng bán">Ngưng bán</option>
                      <option value="Hết hàng">Hết hàng</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Tính chất:</span>
                    <select 
                      value={productTypeFilter}
                      onChange={(e) => setProductTypeFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#14A64A]"
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
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#14A64A]"
                    >
                      <option value="Tất cả">Tất cả</option>
                      {PLATFORMS.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left min-w-[1600px]">
                  <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
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
                        <tr key={row.id} className="hover:bg-gray-50 group align-top">
                          <td className="px-4 py-3 text-center text-gray-500 pt-4">{index + 1}</td>
                          <td className="px-4 py-2">
                            <select 
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
              <div className="flex justify-start mt-4">
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 text-[#14A64A] font-medium text-sm px-4 py-2 rounded-lg border border-[#14A64A] hover:bg-[#F2FBF5] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Thêm sản phẩm
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center z-40">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 rounded-lg text-[#3B6E4B] font-medium hover:bg-gray-50 transition-colors">
            Để sau
          </button>
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
