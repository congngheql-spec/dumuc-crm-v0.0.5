import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Lock, 
  Unlock, 
  SlidersHorizontal, 
  LayoutTemplate,
  X, 
  Check, 
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PayrollPeriodDetail } from './PayrollPeriodDetail';
import { PayrollTableRecord } from './PayrollTableList';

export interface PayrollPeriod {
  id: string;
  code: string; // Mã kỳ lương: VD T10_2025
  name: string; // Tên kỳ lương: VD T10/2025
  totalEmployees?: number; // Tổng số NLĐ
  startDate: string; // 01/10/2025
  endDate: string; // 31/10/2025
  standardWorkDays: number; // Ngày công chuẩn: 26
  status: string; // Chưa chấm công / Đang chấm công / Đã khóa
  isLocked: boolean;
  hasPayrollTable?: boolean; // Đã tạo bảng lương hay chưa
}

export const INITIAL_PAYROLL_PERIODS: PayrollPeriod[] = [
  {
    id: 'pp_1',
    code: 'T10_2025',
    name: 'T10/2025',
    totalEmployees: 8,
    startDate: '01/10/2025',
    endDate: '31/10/2025',
    standardWorkDays: 26,
    status: 'Đang chấm công',
    isLocked: false,
    hasPayrollTable: true
  },
  {
    id: 'pp_2',
    code: 'T09_2025',
    name: 'T09/2025',
    totalEmployees: 8,
    startDate: '01/09/2025',
    endDate: '30/09/2025',
    standardWorkDays: 26,
    status: 'Đã khóa',
    isLocked: true,
    hasPayrollTable: false
  },
  {
    id: 'pp_3',
    code: 'T08_2025',
    name: 'T08/2025',
    totalEmployees: 8,
    startDate: '01/08/2025',
    endDate: '31/08/2025',
    standardWorkDays: 26,
    status: 'Đã khóa',
    isLocked: true,
    hasPayrollTable: false
  }
];

export interface PayrollPeriodListProps {
  periods?: PayrollPeriod[];
  setPeriods?: React.Dispatch<React.SetStateAction<PayrollPeriod[]>>;
  payrollTables?: PayrollTableRecord[];
  setPayrollTables?: React.Dispatch<React.SetStateAction<PayrollTableRecord[]>>;
  onNavigateToPayrollTable?: () => void;
}

export const PayrollPeriodList: React.FC<PayrollPeriodListProps> = ({
  periods: externalPeriods,
  setPeriods: externalSetPeriods,
  payrollTables = [],
  setPayrollTables,
  onNavigateToPayrollTable
}) => {
  const [localPeriods, setLocalPeriods] = useState<PayrollPeriod[]>(INITIAL_PAYROLL_PERIODS);
  const periods = externalPeriods || localPeriods;
  const setPeriods = externalSetPeriods || setLocalPeriods;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Full-screen Detail State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPeriodForDetail, setSelectedPeriodForDetail] = useState<PayrollPeriod | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm (Mã kỳ lương, Tên kỳ lương)
  const filteredPeriods = periods.filter(p => 
    p.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const isAllSelected = filteredPeriods.length > 0 && filteredPeriods.every(p => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPeriods.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} kỳ tính lương đã chọn?`)) {
      setPeriods(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      showToast(`Đã xóa thành công ${selectedIds.length} kỳ tính lương.`);
    }
  };

  const handleDeleteSingle = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa kỳ tính lương "${name}"?`)) {
      setPeriods(prev => prev.filter(p => p.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
      showToast(`Đã xóa kỳ tính lương "${name}".`);
    }
  };

  const handleToggleLock = (id: string) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === id) {
        const nextLock = !p.isLocked;
        showToast(nextLock ? `Đã khóa kỳ lương "${p.name}".` : `Đã mở khóa kỳ lương "${p.name}".`);
        return {
          ...p,
          isLocked: nextLock,
          status: nextLock ? 'Đã khóa' : 'Đang chấm công'
        };
      }
      return p;
    }));
  };

  // Mở giao diện full màn hình khi nhấn nút Thêm
  const handleOpenAdd = () => {
    setSelectedPeriodForDetail(null);
    setIsDetailOpen(true);
  };

  // Mở giao diện full màn hình khi chỉnh sửa
  const handleOpenEdit = (item: PayrollPeriod) => {
    setSelectedPeriodForDetail(item);
    setIsDetailOpen(true);
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["STT,Mã kỳ lương,Tên kỳ lương,Số NLĐ có chấm công,Ngày bắt đầu,Ngày kết thúc,Ngày công chuẩn,Trạng thái"]
      .concat(periods.map((p, idx) => `${idx + 1},${p.code},${p.name},${p.totalEmployees ?? 0},${p.startDate},${p.endDate},${p.standardWorkDays},${p.status}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ky_tinh_luong_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách kỳ tính lương ra tệp Excel/CSV.");
  };

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .csv';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        showToast(`Đã đọc thành công dữ liệu từ tệp: ${file.name}`);
      }
    };
    input.click();
  };

  // Hiển thị giao diện full màn hình nếu đang mở chi tiết / thêm mới
  if (isDetailOpen) {
    return (
      <PayrollPeriodDetail
        initialPeriod={selectedPeriodForDetail}
        onSave={(savedPeriod) => {
          if (selectedPeriodForDetail) {
            setPeriods(prev => prev.map(p => p.id === savedPeriod.id ? savedPeriod : p));
            showToast(`Đã cập nhật kỳ tính lương "${savedPeriod.name}".`);
          } else {
            setPeriods(prev => [savedPeriod, ...prev]);
            showToast(`Đã thêm kỳ tính lương mới "${savedPeriod.name}".`);
          }
          setIsDetailOpen(false);
        }}
        onCancel={() => setIsDetailOpen(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-[80] bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main white container */}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          {/* Left Buttons: Thêm, Nhập excel, Xuất excel, Xóa */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleOpenAdd}
              className="bg-[#1877F2] hover:bg-blue-600 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button 
              onClick={handleImportExcel}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-gray-500" /> Nhập excel
            </button>
            <button 
              onClick={handleExportExcel}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" /> Xuất excel
            </button>
            <button 
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
              className={`border border-gray-300 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 ml-1 transition-colors ${
                selectedIds.length > 0 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer' 
                  : 'bg-[#E2E8F0] text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Xóa {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </button>
          </div>

          {/* Right Toolbar: Search & LayoutTemplate */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên"
                className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-[220px] focus:outline-none focus:border-blue-500 bg-white"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="bg-[#1E3A8A] text-white p-1.5 rounded hover:bg-blue-900 transition-colors cursor-pointer">
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[13px]">
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
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-14 min-w-14 text-center">
                  #
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[180px] min-w-[180px]">
                  Mã kỳ lương
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[200px] min-w-[200px]">
                  Tên kỳ lương
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[165px] min-w-[165px] text-center whitespace-nowrap">
                  Số NLĐ có chấm công
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px]">
                  Ngày bắt đầu
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px]">
                  Ngày kết thúc
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px] text-center">
                  Ngày công chuẩn
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px]">
                  Trạng thái
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[110px] min-w-[110px] text-center">
                  Hành động
                </th>
                {/* Trailing empty column for table layout filling as in image */}
                <th className="p-3 border-gray-200 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPeriods.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-400 italic">
                    Không tìm thấy kỳ tính lương nào. Nhấp "+ Thêm" để tạo mới.
                  </td>
                </tr>
              ) : (
                filteredPeriods.map((period, index) => (
                  <tr 
                    key={period.id}
                    className="border-b border-gray-200 hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(period.id)}
                        onChange={() => toggleSelect(period.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>

                    {/* # (STT) */}
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600 font-medium">
                      {index + 1}
                    </td>

                    {/* Mã kỳ lương */}
                    <td className="p-3 border-r border-gray-200 font-medium text-gray-900">
                      {period.code}
                    </td>

                    {/* Tên kỳ lương */}
                    <td className="p-3 border-r border-gray-200 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{period.name}</span>
                        {(period.hasPayrollTable || payrollTables.some(t => t.periodCode === period.code || t.periodId === period.id)) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Đã có bảng lương trong menu Bảng lương">
                            Đã có bảng lương
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tổng số NLĐ */}
                    <td className="p-3 border-r border-gray-200 text-center font-semibold text-gray-800">
                      {period.totalEmployees !== undefined ? period.totalEmployees : 0}
                    </td>

                    {/* Ngày bắt đầu */}
                    <td className="p-3 border-r border-gray-200 text-gray-800">
                      {period.startDate}
                    </td>

                    {/* Ngày kết thúc */}
                    <td className="p-3 border-r border-gray-200 text-gray-800">
                      {period.endDate}
                    </td>

                    {/* Ngày công chuẩn: viên thuốc xanh lá như trong ảnh */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <span className="inline-block px-4 py-0.5 rounded-full border border-emerald-500 text-emerald-700 bg-emerald-50/80 text-xs font-semibold">
                        {period.standardWorkDays}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="p-3 border-r border-gray-200">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        period.status === 'Chưa chấm công'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : period.status === 'Đang chấm công'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {period.status}
                      </span>
                    </td>

                    {/* Hành động: Lock, SlidersHorizontal, Bảng lương */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Lock / Unlock */}
                        <button
                          type="button"
                          onClick={() => handleToggleLock(period.id)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            period.isLocked 
                              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
                              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                          title={period.isLocked ? "Mở khóa kỳ lương" : "Khóa kỳ lương"}
                        >
                          {period.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Sliders / Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(period)}
                          className="p-1.5 rounded text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Chỉnh sửa / Cấu hình kỳ lương"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        {/* Xem Bảng lương */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigateToPayrollTable) {
                              onNavigateToPayrollTable();
                            }
                          }}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            period.hasPayrollTable || payrollTables.some(t => t.periodCode === period.code || t.periodId === period.id)
                              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                              : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                          title={
                            period.hasPayrollTable || payrollTables.some(t => t.periodCode === period.code || t.periodId === period.id)
                              ? `Xem Bảng lương của kỳ ${period.name}` 
                              : `Tạo/Xem Bảng lương cho kỳ ${period.name}`
                          }
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Trailing column space */}
                    <td className="p-3 border-gray-200"></td>
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
