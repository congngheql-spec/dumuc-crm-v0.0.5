import React, { useState, useRef, useEffect } from 'react';
import { Plus, Download, Upload, Trash2, Search, Filter, RefreshCcw, MoreHorizontal, LayoutTemplate, GitMerge, AlertCircle } from 'lucide-react';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { MergeEmployeeModal } from './MergeEmployeeModal';

export const MOCK_EMPLOYEES = [
  { name: 'LÊ XUÂN NGUYÊN', gender: 'Nam', dob: '15/04/1990', phone: '0926 121 299', email: 'lxn@example.com', cccd: '079090123456', nationality: 'Việt Nam', address: 'Quận 1, TP.HCM' },
  { name: 'Chế Công Vinh', gender: 'Nam', dob: '22/08/1992', phone: '0928 121 299', email: 'vinhcc@example.com', cccd: '079092654321', nationality: 'Việt Nam', address: 'Quận Bình Thạnh, TP.HCM' },
  { name: 'Lê Thanh Trí', gender: 'Nam', dob: '10/11/1995', phone: '0987 654 321', email: 'trilt@example.com', cccd: '079095987654', nationality: 'Việt Nam', address: 'Quận Gò Vấp, TP.HCM' },
  { name: 'Phạm Ngọc Lâm', gender: 'Nam', dob: '05/01/1988', phone: '0987 654 321', email: 'lampn@example.com', cccd: '079088112233', nationality: 'Việt Nam', address: 'Quận 7, TP.HCM' },
  { name: 'Nguyễn Hoàng Phúc', gender: 'Nam', dob: '30/06/1998', phone: '0912 345 678', email: 'phucnh@example.com', cccd: '079098445566', nationality: 'Việt Nam', address: 'Quận 3, TP.HCM' },
  { name: 'Đặng Văn Lâm', gender: 'Nam', dob: '12/12/1994', phone: '0337 866 270', email: 'lamdv@example.com', cccd: '079094778899', nationality: 'Việt Nam', address: 'Quận 2, TP.HCM' },
  { name: 'Nguyễn Hữu Ý', gender: 'Nam', dob: '18/03/1991', phone: '0912 345 678', email: 'ynhu@example.com', cccd: '079091223344', nationality: 'Việt Nam', address: 'Quận Phú Nhuận, TP.HCM' },
  { name: 'Phan Khánh Tường', gender: 'Nữ', dob: '25/09/1996', phone: '0912 345 678', email: 'tuongpk@example.com', cccd: '079096556677', nationality: 'Việt Nam', address: 'Quận Tân Bình, TP.HCM' },
];

export const EmployeeList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [selectedCccds, setSelectedCccds] = useState<string[]>([]);
  const [showMergeLimitTooltip, setShowMergeLimitTooltip] = useState(false);
  const mergeTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCccds.length <= 2) {
      setShowMergeLimitTooltip(false);
    }
  }, [selectedCccds.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mergeTooltipRef.current && !mergeTooltipRef.current.contains(event.target as Node)) {
        setShowMergeLimitTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (cccd: string) => {
    setSelectedCccds(prev => 
      prev.includes(cccd) ? prev.filter(c => c !== cccd) : [...prev, cccd]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCccds(MOCK_EMPLOYEES.map(emp => emp.cccd));
    } else {
      setSelectedCccds([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
       {/* Main white container */}
       <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
          
          {/* Action Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#1A4B9F] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
                >
                   <Plus className="w-4 h-4" /> Thêm
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                   <Upload className="w-4 h-4" /> Nhập excel
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                   <Download className="w-4 h-4" /> Xuất excel
                </button>
                <button className="bg-[#F3F4F6] border border-gray-200 text-gray-400 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 cursor-not-allowed">
                   <Trash2 className="w-4 h-4" /> Xóa
                </button>
                <div ref={mergeTooltipRef} className="relative inline-flex items-center">
                  <button 
                    type="button"
                    onClick={() => {
                      if (selectedCccds.length === 2) {
                        setIsMergeModalOpen(true);
                      } else if (selectedCccds.length > 2) {
                        setShowMergeLimitTooltip(prev => !prev);
                      }
                    }}
                    className={`border px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 transition-colors ${
                      selectedCccds.length === 2 
                        ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer' 
                        : 'bg-[#F3F4F6] border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <GitMerge className="w-4 h-4" /> 
                    <span>Gộp Hồ sơ</span>
                    {selectedCccds.length > 2 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMergeLimitTooltip(prev => !prev);
                        }}
                        className="text-amber-500 hover:text-amber-600 cursor-pointer p-0.5 rounded-full hover:bg-amber-100 transition-colors inline-flex items-center ml-0.5"
                        title="Nhấn để xem giới hạn gộp hồ sơ"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>

                  {/* Tooltip / Popover khi nhấn vào biểu tượng chấm than */}
                  {showMergeLimitTooltip && selectedCccds.length > 2 && (
                    <div className="absolute top-full left-0 mt-2 z-50 bg-[#1F2937] text-white text-[12px] font-normal px-3 py-2 rounded-md shadow-xl border border-gray-700 whitespace-nowrap flex items-center gap-2">
                      <div className="absolute -top-1 left-5 w-2 h-2 bg-[#1F2937] rotate-45 border-l border-t border-gray-700" />
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Giới hạn: Chỉ chọn đúng 2 hồ sơ để Gộp</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMergeLimitTooltip(false);
                        }}
                        className="ml-1 text-gray-400 hover:text-white p-0.5 text-xs leading-none"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="Tìm mã, tên" 
                     className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-64 focus:outline-none focus:border-blue-500" 
                   />
                   <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <button className="bg-[#1A4B9F] text-white p-1.5 rounded hover:bg-blue-800 transition-colors">
                   <LayoutTemplate className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Filter Tabs Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button className="border border-gray-300 text-gray-700 bg-white rounded-full px-3 py-1 text-[13px] flex items-center gap-1.5 whitespace-nowrap hover:bg-gray-50 transition-colors">
                   Tất cả <span className="bg-gray-100 text-gray-600 px-1.5 rounded-full text-xs border border-gray-200">8</span>
                </button>
             </div>
             <div className="flex items-center gap-2 ml-4 shrink-0">
                <button className="bg-[#1A4B9F] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors">
                   <Filter className="w-3.5 h-3.5" fill="currentColor" /> Lọc
                </button>
                <button className="bg-[#F8F9FA] border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
                   <RefreshCcw className="w-3.5 h-3.5" /> Làm mới
                </button>
             </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-white">
             <table className="w-full text-left border-collapse text-[13px]">
                 <thead className="sticky top-0 bg-[#F9FAFB] z-10 shadow-[0_1px_0_#E5E7EB]">
                   <tr>
                      <th className="p-3 border-r border-b border-gray-200 w-12 text-center">
                         <input 
                           type="checkbox" 
                           className="rounded border-gray-300 cursor-pointer"
                           checked={selectedCccds.length === MOCK_EMPLOYEES.length && MOCK_EMPLOYEES.length > 0}
                           onChange={handleSelectAll} 
                         />
                      </th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 min-w-[180px]">Tên nhân sự</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[100px]">Giới tính</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[120px]">Ngày sinh</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[140px]">Điện thoại</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[180px]">Email</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[140px]">Số CCCD</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 w-[120px]">Quốc tịch</th>
                      <th className="p-3 border-r border-b border-gray-200 font-semibold text-gray-700 min-w-[200px]">Chỗ ở hiện nay</th>
                      <th className="p-3 border-b border-gray-200 w-10"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                   {MOCK_EMPLOYEES.map((emp, idx) => (
                      <tr key={idx} className={`hover:bg-blue-50/30 transition-colors ${selectedCccds.includes(emp.cccd) ? 'bg-blue-50/50' : ''}`}>
                         <td className="p-3 border-r border-gray-200 text-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 cursor-pointer" 
                              checked={selectedCccds.includes(emp.cccd)}
                              onChange={() => handleSelect(emp.cccd)}
                            />
                         </td>
                         <td className="p-3 border-r border-gray-200 text-gray-800 font-medium">{emp.name}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.gender}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.dob}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.phone}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.email}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.cccd}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.nationality}</td>
                         <td className="p-3 border-r border-gray-200 text-gray-700">{emp.address}</td>
                         <td className="p-3 text-center">
                            {/* Empty right edge */}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Bottom Split Pane Placeholder */}
          <div className="h-[200px] border-t-2 border-blue-500 bg-white flex flex-col items-center justify-center text-gray-500 relative shrink-0">
             <div className="absolute top-0 w-16 h-1 bg-blue-500 rounded-b-md cursor-row-resize"></div>
             
             <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center mb-4 mt-4">
                <LayoutTemplate className="w-8 h-8 text-gray-300" />
             </div>
             <span className="text-[14px]">Chọn một dòng bên trên</span>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-gray-200 bg-white p-3 flex items-center justify-between text-[13px] text-gray-600 shrink-0">
             <div className="flex items-center gap-2">
                 <select className="border border-gray-300 rounded-[4px] px-2 py-1 outline-none text-gray-700">
                    <option>20 Dòng</option>
                 </select>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                   <button className="p-1 text-gray-400 hover:text-gray-600 cursor-not-allowed">&lt;</button>
                   <button className="w-7 h-7 flex items-center justify-center bg-[#E5F0FF] text-blue-600 border border-blue-200 rounded-[4px] font-medium">1</button>
                   <button className="p-1 text-gray-400 hover:text-gray-600 cursor-not-allowed">&gt;</button>
                </div>
                <span>Hiển thị 1 - 8 / 8 kết quả</span>
             </div>
          </div>
       </div>

       <EmployeeDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
       />
       <MergeEmployeeModal 
          isOpen={isMergeModalOpen}
          onClose={() => setIsMergeModalOpen(false)}
          selectedCccds={selectedCccds}
          onMergeComplete={() => {
             setIsMergeModalOpen(false);
             setSelectedCccds([]);
          }}
       />
    </div>
  );
};

