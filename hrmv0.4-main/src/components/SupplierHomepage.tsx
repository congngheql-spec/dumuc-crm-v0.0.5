import React from 'react';
import { ChevronLeft, ChevronRight, Play, Copy, Star } from 'lucide-react';

interface SupplierHomepageProps {
  supplier: any;
  onBack: () => void;
}

export const SupplierHomepage: React.FC<SupplierHomepageProps> = ({ supplier, onBack }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 pt-6 pb-0 border-b border-gray-200 flex flex-col shrink-0 relative">
        <button 
          onClick={onBack}
          className="absolute top-6 right-8 text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="flex items-start gap-6 mb-6">
          <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center relative bg-white shadow-sm">
            <div className="absolute top-0 left-0 bg-[#D4A017] text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg rounded-br-lg uppercase tracking-wider">
              Hàng Hãng
            </div>
            <span className="text-3xl font-black text-gray-900 tracking-tighter">
              {supplier.name.split(' ')[0]}<span className="text-[#14A64A]">.</span>
            </span>
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{supplier.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span>Sản phẩm: <span className="font-bold text-gray-900">128</span></span>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <button className="pb-3 text-sm font-bold text-[#14A64A] border-b-2 border-[#14A64A]">
            Trang chủ
          </button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
            Danh sách sản phẩm
          </button>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FA] p-8 space-y-8">
        
        {/* Banner Section */}
        <div className="bg-[#FAF6F0] rounded-2xl p-12 max-w-6xl mx-auto shadow-sm">
          <div className="flex items-center justify-center gap-12 mb-12">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-[#14A64A] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#14A64A] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#14A64A] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#14A64A] rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold text-[#14A64A]">buymed</span>
            </div>
            <div className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
              {supplier.name.split(' ')[0]}<span className="text-[#14A64A]">.</span>
              <div className="flex flex-col items-start leading-none ml-2">
                <span className="text-xs font-bold text-[#14A64A]">Health.</span>
                <span className="text-xs font-medium text-gray-600">In your hands.</span>
              </div>
            </div>
            <div className="text-3xl font-black text-[#052E15] uppercase tracking-tight">
              Phân phối chính hãng
            </div>
          </div>

          <div className="relative flex items-center gap-6">
            <button className="w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center hover:bg-black/40 transition-colors shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 grid grid-cols-4 gap-6">
              {/* Category 1: Phụ tùng */}
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/3] bg-[#052E15] rounded-xl overflow-hidden relative group cursor-pointer shadow-md border-4 border-[#052E15]">
                  <img src="https://picsum.photos/seed/engine/400/300" alt="Phụ tùng" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <button className="w-full py-3 bg-transparent border border-gray-400 rounded-full text-sm font-bold text-gray-800 hover:border-[#14A64A] hover:text-[#14A64A] transition-colors uppercase tracking-wide">
                  Phụ tùng
                </button>
              </div>

              {/* Category 2: Hóa chất */}
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/3] bg-[#052E15] rounded-xl overflow-hidden relative group cursor-pointer shadow-md border-4 border-[#052E15]">
                  <img src="https://picsum.photos/seed/chemical/400/300" alt="Hóa chất" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <button className="w-full py-3 bg-transparent border border-gray-400 rounded-full text-sm font-bold text-gray-800 hover:border-[#14A64A] hover:text-[#14A64A] transition-colors uppercase tracking-wide">
                  Hóa chất
                </button>
              </div>

              {/* Category 3: Lốp */}
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/3] bg-[#052E15] rounded-xl overflow-hidden relative group cursor-pointer shadow-md border-4 border-[#052E15]">
                  <img src="https://picsum.photos/seed/tire/400/300" alt="Lốp xe" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <button className="w-full py-3 bg-transparent border border-gray-400 rounded-full text-sm font-bold text-gray-800 hover:border-[#14A64A] hover:text-[#14A64A] transition-colors uppercase tracking-wide">
                  Lốp xe
                </button>
              </div>

              {/* Category 4: Thiết bị */}
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/3] bg-[#052E15] rounded-xl overflow-hidden relative group cursor-pointer shadow-md border-4 border-[#052E15]">
                  <img src="https://picsum.photos/seed/equipment/400/300" alt="Thiết bị" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <button className="w-full py-3 bg-transparent border border-gray-400 rounded-full text-sm font-bold text-gray-800 hover:border-[#14A64A] hover:text-[#14A64A] transition-colors uppercase tracking-wide">
                  Thiết bị
                </button>
              </div>
            </div>

            <button className="w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center hover:bg-black/40 transition-colors shrink-0">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-[#14A64A]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-2xl p-8 max-w-6xl mx-auto shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu chung</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            <strong className="text-gray-900">{supplier.name}</strong> là nhà phân phối hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm chất lượng cao trong lĩnh vực ô tô. Chúng tôi cam kết mang đến những giải pháp toàn diện bao gồm: <strong className="text-gray-800">Phụ tùng chính hãng</strong>, <strong className="text-gray-800">Hóa chất bảo dưỡng chuyên dụng</strong>, <strong className="text-gray-800">Lốp xe đa dạng chủng loại</strong> và <strong className="text-gray-800">Thiết bị sửa chữa hiện đại</strong>. Với mạng lưới phân phối rộng khắp và đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi luôn đồng hành cùng các garage và xưởng dịch vụ để nâng cao chất lượng sửa chữa, tối ưu hóa chi phí và đảm bảo an toàn tối đa cho mọi hành trình.
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative aspect-[21/9] bg-gray-900 shadow-lg group cursor-pointer">
          <img src="https://picsum.photos/seed/workshop/1200/500" alt="Video cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" referrerPolicy="no-referrer" />
          
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#14A64A] text-xl">
              {supplier.name.charAt(0)}
            </div>
            <span className="text-white font-medium text-lg drop-shadow-md">GIỚI THIỆU SẢN PHẨM VÀ DỊCH VỤ CỦA {supplier.name.toUpperCase()}</span>
          </div>

          <div className="absolute top-4 right-4 text-white flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <Copy className="w-5 h-5" />
            <span className="text-xs font-medium">Sao chép l...</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-14 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium border border-white/20">
            Xem trên <span className="font-bold flex items-center gap-1"><Play className="w-4 h-4 fill-white" /> YouTube</span>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto text-center pt-8 pb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">Khách hàng nói gì về chúng tôi</h2>
          
          <div className="grid grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#F0F4F8] rounded-2xl p-8 pt-16 relative mt-12">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <img src="https://picsum.photos/seed/man1/150/150" alt="Customer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-bold text-gray-900 mb-4">Anh Duy Hà</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hàng hóa đóng gói cẩn thận, kĩ càng cũng như tư vấn về các sản phẩm rất nhiệt tình và rõ ràng. Phụ tùng chính hãng giúp xưởng của tôi tăng uy tín với khách hàng.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#F0F4F8] rounded-2xl p-8 pt-16 relative mt-12">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <img src="https://picsum.photos/seed/man2/150/150" alt="Customer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-bold text-gray-900 mb-4">Anh Tuấn Anh</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Giá cả các sản phẩm luôn bình ổn cũng như có nhiều chương trình khuyến mãi, quà tặng và ưu đãi trong tháng. Giao hàng rất nhanh chóng, đúng tiến độ sửa chữa.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#F0F4F8] rounded-2xl p-8 pt-16 relative mt-12">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <img src="https://picsum.photos/seed/woman1/150/150" alt="Customer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-bold text-gray-900 mb-4">Chị Hoàng Ngân</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lượng mặt hàng đa dạng được liệt kê rõ ràng, tôi có thể dễ dàng tìm kiếm được những sản phẩm mà tôi cần. Hóa chất bảo dưỡng chất lượng rất tốt.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
