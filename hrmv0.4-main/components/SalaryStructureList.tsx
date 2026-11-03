import React, { useState } from 'react';
import { Plus, Download, Upload, Trash2, Search, LayoutTemplate, Edit3, Copy, CheckCircle } from 'lucide-react';
import { SalaryStructureForm, DEFAULT_COMPONENTS, DEFAULT_KD_COMPONENTS, DEFAULT_KT_COMPONENTS } from './SalaryStructureForm';

export const INITIAL_STRUCTURES = [
  { 
    id: 1, 
    code: 'CTL_VP', 
    name: 'Cấu trúc lương khối Văn phòng', 
    description: 'Áp dụng cho nhân viên hành chính, nhân sự, kế toán, văn thư',
    itemCount: 11,
    departments: ['Văn phòng', 'Kế toán & Tài chính'],
    contractTypes: ['HĐ Chính thức', 'HĐ Thử việc'],
    components: DEFAULT_COMPONENTS,
  },
  { 
    id: 2, 
    code: 'CTL_KD', 
    name: 'Cấu trúc lương khối Kinh doanh', 
    description: 'Áp dụng cho nhân viên sales, chuyên viên tư vấn bán hàng showroom',
    itemCount: 11,
    departments: ['Kinh doanh'],
    contractTypes: ['HĐ Chính thức'],
    components: DEFAULT_KD_COMPONENTS,
  },
  { 
    id: 3, 
    code: 'CTL_KT', 
    name: 'Cấu trúc lương khối Kỹ thuật', 
    description: 'Áp dụng cho kỹ sư, thợ máy gầm, thợ điện, cố vấn kỹ thuật xưởng',
    itemCount: 11,
    departments: ['Xưởng Kỹ thuật', 'Kho Phụ tùng'],
    contractTypes: ['HĐ Chính thức', 'HĐ Học việc'],
    components: DEFAULT_KT_COMPONENTS,
  },
];

interface SalaryStructureListProps {
  structures?: any[];
  setStructures?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const SalaryStructureList: React.FC<SalaryStructureListProps> = ({
  structures: propStructures,
  setStructures: propSetStructures,
}) => {
  const [localStructures, setLocalStructures] = useState(INITIAL_STRUCTURES);
  const structures = propStructures || localStructures;
  const setStructures = propSetStructures || setLocalStructures;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedStructure(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (structure: any) => {
    setSelectedStructure(structure);
    setIsFormOpen(true);
  };

  const handleSaveStructure = (savedData: any) => {
    if (selectedStructure) {
      setStructures(structures.map(s => s.id === savedData.id ? { ...savedData, itemCount: savedData.components?.length || s.itemCount } : s));
      showToast(`Đã cập nhật cấu trúc lương: ${savedData.name}`);
    } else {
      const newStructure = {
        ...savedData,
        id: Date.now(),
        itemCount: savedData.components?.length || 8
      };
      setStructures([newStructure, ...structures]);
      showToast(`Đã thêm thành công cấu trúc lương: ${savedData.name}`);
    }
    setIsFormOpen(false);
    setSelectedStructure(null);
  };

  const handleDuplicate = (structure: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = {
      ...structure,
      id: Date.now(),
      code: `${structure.code}_COPY`,
      name: `${structure.name} (Bản sao)`,
    };
    setStructures([...structures, duplicated]);
    showToast(`Đã nhân bản cấu trúc lương: ${structure.name}`);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    setStructures(structures.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    showToast(`Đã xóa ${selectedIds.length} cấu trúc lương đã chọn`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === structures.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(structures.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredStructures = structures.filter(s => 
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4 font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-[70] bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-SCREEN CREATION/EDIT MODAL */}
      {isFormOpen && (
        <SalaryStructureForm
          initialData={selectedStructure}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedStructure(null);
          }}
          onSave={handleSaveStructure}
        />
      )}

      {/* Main white container */}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleOpenAdd}
              className="bg-[#2563EB] text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm mới
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4 text-gray-500" /> Nhập excel
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-500" /> Xuất excel
            </button>
            <button 
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={`border border-gray-300 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 ml-1 transition-colors ${
                selectedIds.length > 0 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer' 
                  : 'bg-[#E2E8F0] text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Xóa ({selectedIds.length})
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên cấu trúc lương"
                className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-[240px] focus:outline-none focus:border-blue-500 bg-white"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="bg-[#1E3A8A] text-white p-1.5 rounded hover:bg-blue-900 transition-colors">
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === structures.length && structures.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 cursor-pointer" 
                  />
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-16 text-center">STT</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[180px]">Mã Cấu trúc</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[280px]">Tên Cấu trúc Lương</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700">Mô tả</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] text-center">Số khoản mục</th>
                <th className="p-3 border-gray-200 font-medium text-gray-700 w-[140px] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                    Không tìm thấy cấu trúc lương nào phù hợp. Nhấp "Thêm mới" để tạo cấu trúc.
                  </td>
                </tr>
              ) : (
                filteredStructures.map((structure, index) => (
                  <tr 
                    key={structure.id} 
                    onClick={() => handleOpenEdit(structure)}
                    className="border-b border-gray-200 hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 border-r border-gray-200 text-center" onClick={(e) => toggleSelectOne(structure.id, e)}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(structure.id)}
                        onChange={() => {}}
                        className="rounded border-gray-300 cursor-pointer" 
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-blue-700 font-bold">
                      {structure.code}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-900 font-medium">
                      {structure.name}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-600">
                      {structure.description}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-center">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {structure.itemCount || 8} thành phần
                      </span>
                    </td>
                    <td className="p-3 border-gray-200 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(structure)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Chỉnh sửa cấu trúc lương"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(structure, e)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Nhân bản cấu trúc"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

