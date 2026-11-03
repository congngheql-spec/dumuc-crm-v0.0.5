import React from 'react';
import { Plus, Download, Upload, Trash2, Search, LayoutTemplate, Trash, X, Check, Edit2 } from 'lucide-react';

export const APPLIED_TARGET_OPTIONS = [
  'Người lao động',
  'Cộng tác viên',
  'Môi giới',
  'Nhân sự B2B',
] as const;

export type AppliedTargetType = typeof APPLIED_TARGET_OPTIONS[number];

export interface ContractTypeItem {
  code: string;
  name: string;
  appliedTargets: string[];
  description: string;
  status: string;
}

export const MOCK_CONTRACT_TYPES: ContractTypeItem[] = [
  { 
    code: 'HD_DTN', 
    name: 'Hợp đồng đào tạo nghề', 
    appliedTargets: ['Người lao động'],
    description: 'Đào tạo nghề nghiệp tại garage/xưởng', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HD_TV', 
    name: 'Hợp đồng thử việc', 
    appliedTargets: ['Người lao động'],
    description: 'Thời gian thử việc theo quy định', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HDLD_XDH', 
    name: 'Hợp đồng lao động xác định thời hạn', 
    appliedTargets: ['Người lao động'],
    description: 'Hợp đồng lao động có thời hạn (12-36 tháng)', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HDLD_KXDH', 
    name: 'Hợp đồng lao động không xác định thời hạn', 
    appliedTargets: ['Người lao động'],
    description: 'Hợp đồng lao động chính thức dài hạn', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HD_GK', 
    name: 'Hợp đồng giao khoán', 
    appliedTargets: ['Người lao động', 'Cộng tác viên'],
    description: 'Giao khoán khối lượng công việc, công trình hoặc hạng mục dịch vụ', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HD_MG', 
    name: 'Hợp đồng môi giới', 
    appliedTargets: ['Môi giới'],
    description: 'Môi giới khách hàng, dịch vụ garage, phụ tùng và hợp tác kinh doanh', 
    status: 'Hoạt động' 
  },
  { 
    code: 'HD_TN', 
    name: 'Hợp đồng thuê ngoài', 
    appliedTargets: ['Nhân sự B2B'],
    description: 'Thuê ngoài nhân sự B2B, nhà thầu phụ và dịch vụ chuyên môn', 
    status: 'Hoạt động' 
  },
];

export const ContractTypeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCodes, setSelectedCodes] = React.useState<string[]>([]);
  const [contractTypes, setContractTypes] = React.useState<ContractTypeItem[]>(MOCK_CONTRACT_TYPES);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ContractTypeItem | null>(null);
  const [modalForm, setModalForm] = React.useState<ContractTypeItem>({
    code: '',
    name: '',
    appliedTargets: ['Người lao động'],
    description: '',
    status: 'Hoạt động',
  });

  const filteredContracts = contractTypes.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.appliedTargets.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isAllSelected = filteredContracts.length > 0 && filteredContracts.every((c) => selectedCodes.includes(c.code));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(filteredContracts.map((c) => c.code));
    }
  };

  const toggleSelect = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedCodes.length === 0) return;
    setContractTypes((prev) => prev.filter((c) => !selectedCodes.includes(c.code)));
    setSelectedCodes([]);
  };

  const handleDeleteItem = (code: string) => {
    setContractTypes((prev) => prev.filter((c) => c.code !== code));
    setSelectedCodes((prev) => prev.filter((c) => c !== code));
  };

  // Toggle single target for a row
  const toggleTargetForContract = (contractCode: string, target: string) => {
    setContractTypes((prev) =>
      prev.map((c) => {
        if (c.code !== contractCode) return c;
        const exists = c.appliedTargets.includes(target);
        const updatedTargets = exists
          ? c.appliedTargets.filter((t) => t !== target)
          : [...c.appliedTargets, target];
        return { ...c, appliedTargets: updatedTargets };
      })
    );
  };

  // Modal Open Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalForm({
      code: '',
      name: '',
      appliedTargets: ['Người lao động'],
      description: '',
      status: 'Hoạt động',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ContractTypeItem) => {
    setEditingItem(item);
    setModalForm({ ...item, appliedTargets: [...item.appliedTargets] });
    setIsModalOpen(true);
  };

  const handleToggleModalTarget = (target: string) => {
    setModalForm((prev) => {
      const exists = prev.appliedTargets.includes(target);
      return {
        ...prev,
        appliedTargets: exists
          ? prev.appliedTargets.filter((t) => t !== target)
          : [...prev.appliedTargets, target],
      };
    });
  };

  const handleSelectAllModalTargets = () => {
    setModalForm((prev) => {
      const allSelected = APPLIED_TARGET_OPTIONS.every((t) => prev.appliedTargets.includes(t));
      return {
        ...prev,
        appliedTargets: allSelected ? [] : [...APPLIED_TARGET_OPTIONS],
      };
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.code.trim() || !modalForm.name.trim()) return;

    if (editingItem) {
      setContractTypes((prev) =>
        prev.map((c) => (c.code === editingItem.code ? modalForm : c))
      );
    } else {
      setContractTypes((prev) => [modalForm, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
      {/* Main white container */}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleOpenAdd}
              className="bg-[#2563EB] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4 text-gray-500" /> Nhập excel
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-500" /> Xuất excel
            </button>
            <button 
              disabled={selectedCodes.length === 0}
              onClick={handleDeleteSelected}
              className={`border border-gray-300 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 ml-1 transition-colors ${
                selectedCodes.length > 0 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer' 
                  : 'bg-[#E2E8F0] text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Xóa {selectedCodes.length > 0 ? `(${selectedCodes.length})` : ''}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên loại HĐ, đối tượng..."
                className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-[260px] focus:outline-none focus:border-blue-500 bg-white"
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
          <table className="w-full min-w-[1450px] text-left border-collapse text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-12 min-w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 cursor-pointer" 
                  />
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[150px] min-w-[150px] whitespace-nowrap">Mã loại HĐ</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[350px] min-w-[350px] whitespace-nowrap">Tên loại hợp đồng</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[500px] min-w-[500px] whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-gray-800">Đối tượng áp dụng</span>
                    <span className="text-[11px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap">
                      Cho phép tick chọn đồng thời
                    </span>
                  </div>
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 min-w-[260px]">Mô tả</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[130px] min-w-[130px] text-center whitespace-nowrap">Trạng thái</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[100px] min-w-[100px] text-center whitespace-nowrap">Hành động</th>
                <th className="p-3 border-gray-200 font-medium text-gray-700 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr 
                  key={contract.code} 
                  className={`border-b border-gray-200 hover:bg-blue-50/40 transition-colors ${
                    selectedCodes.includes(contract.code) ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <td className="p-3 border-r border-gray-200 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCodes.includes(contract.code)}
                      onChange={() => toggleSelect(contract.code)}
                      className="rounded border-gray-300 cursor-pointer" 
                    />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-800 font-medium whitespace-nowrap">{contract.code}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800 font-semibold whitespace-nowrap">{contract.name}</td>
                  
                  {/* Cột Đối tượng áp dụng - hiển thị trên cùng 1 dòng */}
                  <td className="p-2.5 border-r border-gray-200 whitespace-nowrap">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {APPLIED_TARGET_OPTIONS.map((target) => {
                        const isChecked = (contract.appliedTargets || []).includes(target);
                        return (
                          <label
                            key={target}
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs cursor-pointer select-none transition-all border whitespace-nowrap ${
                              isChecked
                                ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium shadow-xs'
                                : 'bg-gray-50/90 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                            title={isChecked ? `Đang áp dụng: ${target}` : `Bấm để chọn: ${target}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTargetForContract(contract.code, target)}
                              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                            />
                            <span className="whitespace-nowrap">{target}</span>
                          </label>
                        );
                      })}
                    </div>
                  </td>

                  <td className="p-3 border-r border-gray-200 text-gray-600 min-w-[260px]">{contract.description}</td>
                  <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center border border-[#16A34A] text-[#16A34A] bg-emerald-50/50 px-4 py-1 rounded-full text-xs font-medium w-full max-w-[100px]">
                      {contract.status}
                    </span>
                  </td>
                  <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleOpenEdit(contract)}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(contract.code)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1"
                        title="Xóa"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh sửa Loại hợp đồng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[560px] overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-[15px]">
                {editingItem ? 'Chỉnh sửa loại hợp đồng' : 'Thêm mới loại hợp đồng'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium text-xs mb-1.5">
                  Mã loại HĐ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={modalForm.code}
                  onChange={(e) => setModalForm({ ...modalForm, code: e.target.value })}
                  placeholder="VD: HD_LD, HD_TV"
                  className={`w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 ${editingItem ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'text-gray-800'}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium text-xs mb-1.5">
                  Tên loại hợp đồng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="VD: Hợp đồng lao động xác định thời hạn"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Đối tượng áp dụng (Cho phép chọn 4 giá trị đồng thời) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-medium text-xs">
                    Đối tượng áp dụng: (Cho phép tick chọn đồng thời)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllModalTargets}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    {APPLIED_TARGET_OPTIONS.every((t) => modalForm.appliedTargets.includes(t)) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 p-3 border border-gray-200 rounded-md bg-gray-50/50">
                  {APPLIED_TARGET_OPTIONS.map((target) => {
                    const isChecked = modalForm.appliedTargets.includes(target);
                    return (
                      <label
                        key={target}
                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-800 font-medium shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModalTarget(target)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs">{target}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium text-xs mb-1.5">
                  Mô tả
                </label>
                <textarea
                  rows={2}
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  placeholder="Nhập mô tả chi tiết loại hợp đồng"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium text-xs mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={modalForm.status}
                  onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

