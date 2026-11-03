import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Search, 
  Filter, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  UserCheck, 
  Users, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  Lock,
  CalendarPlus,
  CalendarCheck,
  CalendarX,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  User,
  Check
} from 'lucide-react';
import { PayrollPeriod } from './PayrollPeriodList';
import { MOCK_LABORERS } from './LaborList';
import { Laborer } from './LaborDetailModal';

// Mock danh sách NLĐ ban đầu cho Kỳ tính lương (kế thừa cấu trúc từ Hồ sơ hợp đồng)
const INITIAL_PERIOD_LABORERS: Laborer[] = [
  ...MOCK_LABORERS,
  {
    id: 'lab-3',
    code: 'HDLD_XDH-2026/03',
    employeeCode: 'NV-003',
    timekeepingCode: 'CC-003',
    name: 'Lê Thanh Trí',
    gender: 'Nam',
    dob: '10/11/1995',
    phone: '0987 654 321',
    email: 'trilt@example.com',
    cccd: '079095987654',
    nationality: 'Việt Nam',
    address: 'Quận Gò Vấp, TP.HCM',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Kỹ thuật viên trưởng',
    rank: 'Bậc 2',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng lao động xác định thời hạn',
    status: 'Đang hiệu lực',
    officialWorkDate: '01/03/2026',
    directManager: 'LÊ XUÂN NGUYÊN',
    companyEmail: 'tri.lt@garage.vn',
  },
  {
    id: 'lab-4',
    code: 'HDLD_KXDH-2026/04',
    employeeCode: 'NV-004',
    timekeepingCode: 'CC-004',
    name: 'Phạm Ngọc Lâm',
    gender: 'Nam',
    dob: '05/01/1988',
    phone: '0987 654 322',
    email: 'lampn@example.com',
    cccd: '079088112233',
    nationality: 'Việt Nam',
    address: 'Quận 7, TP.HCM',
    department: 'Kho Phụ tùng & Lốp',
    position: 'Thủ kho phụ tùng',
    rank: 'Chuyên viên',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng lao động không xác định thời hạn',
    status: 'Đang hiệu lực',
    officialWorkDate: '10/01/2026',
    directManager: 'Trần Văn Giám Đốc',
    companyEmail: 'lam.pn@garage.vn',
  },
  {
    id: 'lab-5',
    code: 'HDLD_XDH-2026/05',
    employeeCode: 'NV-005',
    timekeepingCode: 'CC-005',
    name: 'Nguyễn Hoàng Phúc',
    gender: 'Nam',
    dob: '30/06/1998',
    phone: '0912 345 678',
    email: 'phucnh@example.com',
    cccd: '079098445566',
    nationality: 'Việt Nam',
    address: 'Quận 3, TP.HCM',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Thợ máy - Gầm điện',
    rank: 'Bậc 1',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng lao động xác định thời hạn',
    status: 'Đang hiệu lực',
    officialWorkDate: '15/02/2026',
    directManager: 'Lê Thanh Trí',
    companyEmail: 'phuc.nh@garage.vn',
  },
  {
    id: 'lab-6',
    code: 'HDLD_XDH-2026/06',
    employeeCode: 'NV-006',
    timekeepingCode: 'CC-006',
    name: 'Đặng Văn Lâm',
    gender: 'Nam',
    dob: '12/12/1994',
    phone: '0337 866 270',
    email: 'lamdv@example.com',
    cccd: '079094778899',
    nationality: 'Việt Nam',
    address: 'Quận 2, TP.HCM',
    department: 'Phòng Chăm sóc khách hàng & Tiếp nhận',
    position: 'Cố vấn dịch vụ',
    rank: 'Chuyên viên',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng lao động xác định thời hạn',
    status: 'Đang hiệu lực',
    officialWorkDate: '01/02/2026',
    directManager: 'LÊ XUÂN NGUYÊN',
    companyEmail: 'lam.dv@garage.vn',
  },
  {
    id: 'lab-7',
    code: 'HD_TV-2026/07',
    employeeCode: 'NV-007',
    timekeepingCode: 'CC-007',
    name: 'Nguyễn Hữu Ý',
    gender: 'Nam',
    dob: '18/03/1991',
    phone: '0912 345 679',
    email: 'ynhu@example.com',
    cccd: '079091223344',
    nationality: 'Việt Nam',
    address: 'Quận Phú Nhuận, TP.HCM',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Kỹ thuật viên đồng sơn',
    rank: 'Bậc 1',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng thử việc',
    status: 'Chờ ký',
    officialWorkDate: '01/04/2026',
    directManager: 'Lê Thanh Trí',
    companyEmail: 'y.nh@garage.vn',
  },
  {
    id: 'lab-8',
    code: 'HDLD_XDH-2026/08',
    employeeCode: 'NV-008',
    timekeepingCode: 'CC-008',
    name: 'Phan Khánh Tường',
    gender: 'Nữ',
    dob: '25/09/1996',
    phone: '0912 345 680',
    email: 'tuongpk@example.com',
    cccd: '079096556677',
    nationality: 'Việt Nam',
    address: 'Quận Tân Bình, TP.HCM',
    department: 'Phòng Kế toán',
    position: 'Kế toán tiền lương & Thuế',
    rank: 'Chuyên viên',
    contractTargetType: 'Người lao động',
    contractType: 'Hợp đồng lao động xác định thời hạn',
    status: 'Đang hiệu lực',
    officialWorkDate: '10/01/2026',
    directManager: 'Chế Công Vinh',
    companyEmail: 'tuong.pk@garage.vn',
  }
];

// Interface cho bảng tổng hợp chấm công
export interface TimekeepingSummaryRow {
  employeeCode: string;
  name: string;
  department: string;
  position: string;
  monthlyWorkDays: number; // Ngày công tháng (đổi từ Công chuẩn)
  actualWorkDays: number; // Ngày công đi làm thực tế (đổi từ Công thực tế)
  paidLeaveDays: number; // Nghỉ phép có hưởng lương
  unpaidLeaveDays: number; // Nghỉ không hưởng lương
  normalOtDays: number; // Ngày tăng ca thường
  holidayOtDays: number; // Ngày tăng ca Lễ
  weekendOtHours: number; // Giờ tăng ca cuối tuần
  lateMinutes: number; // Số phút đi muộn
  earlyMinutes: number; // Số phút về sớm
  totalPaidDays: number; // Tổng công tính lương
  timekeepingStatus: 'Đạt chuẩn' | 'Thiếu công' | 'Vượt công';
  evaluationNote?: string;
  bonusPenaltyProposal?: string;
}

interface PayrollPeriodDetailProps {
  initialPeriod?: PayrollPeriod | null;
  onSave: (period: PayrollPeriod) => void;
  onCancel: () => void;
}

export const PayrollPeriodDetail: React.FC<PayrollPeriodDetailProps> = ({
  initialPeriod,
  onSave,
  onCancel
}) => {
  // Dòng 1: Các trường thông tin kỳ tính lương
  const [code, setCode] = useState(initialPeriod?.code || 'T11_2025');
  const [name, setName] = useState(initialPeriod?.name || 'T11/2025');
  const [startDate, setStartDate] = useState(initialPeriod?.startDate || '01/11/2025');
  const [endDate, setEndDate] = useState(initialPeriod?.endDate || '30/11/2025');
  const [standardWorkDays, setStandardWorkDays] = useState<number>(initialPeriod?.standardWorkDays || 26);
  const [status, setStatus] = useState(initialPeriod?.status || 'Chưa chấm công');

  // Tabs: 'labor_list' | 'timekeeping_summary'
  const [activeTab, setActiveTab] = useState<'labor_list' | 'timekeeping_summary'>('labor_list');

  // Danh sách người lao động trong kỳ tính lương
  const [laborers, setLaborers] = useState<Laborer[]>(INITIAL_PERIOD_LABORERS);
  const [selectedLaborerIds, setSelectedLaborerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRow, setActiveRow] = useState<Laborer | null>(INITIAL_PERIOD_LABORERS[0] || null);

  // Filter cho Tab Tổng hợp chấm công
  const [tkSearchTerm, setTkSearchTerm] = useState('');

  // State cho Màn hình Full Đánh giá chi tiết chấm công
  const [evalFormData, setEvalFormData] = useState<TimekeepingSummaryRow | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper ID cho danh sách NLĐ
  const getRecordId = (lab: Laborer, idx: number) => lab.employeeCode || lab.code || lab.cccd || `${lab.name}-${idx}`;

  // Lọc danh sách NLĐ theo tìm kiếm
  const filteredLaborers = useMemo(() => {
    return laborers.filter(lab => 
      (lab.name && lab.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.employeeCode && lab.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.timekeepingCode && lab.timekeepingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.code && lab.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.phone && lab.phone.includes(searchTerm)) ||
      (lab.department && lab.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.position && lab.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.contractTargetType && lab.contractTargetType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.contractType && lab.contractType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lab.status && lab.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [laborers, searchTerm]);

  // Dữ liệu bảng Tổng hợp chấm công: Quản lý dưới dạng state để người dùng có thể Chấm công hoặc Hủy chấm công từng NLĐ
  const [timekeepingList, setTimekeepingList] = useState<TimekeepingSummaryRow[]>(() => {
    // Khi nhấn nút Thêm (tạo kỳ tính lương mới, initialPeriod là null/undefined) -> mặc định rỗng
    if (!initialPeriod) {
      return [];
    }
    return INITIAL_PERIOD_LABORERS.map((lab, index) => {
      const actualWorkDays = index === 0 ? 26 : index === 1 ? 25 : index === 6 ? 23 : 26;
      const paidLeaveDays = index === 1 ? 1 : 0;
      const unpaidLeaveDays = index === 6 ? 3 : 0;
      const normalOtDays = index === 0 ? 1 : index === 4 ? 2 : 0;
      const holidayOtDays = index === 0 ? 1 : 0;
      const weekendOtHours = index === 0 ? 8 : index === 2 ? 4 : index === 4 ? 6 : 0;
      const lateMinutes = index === 2 ? 15 : index === 4 ? 20 : 0;
      const earlyMinutes = index === 4 ? 10 : 0;
      const totalPaidDays = actualWorkDays + paidLeaveDays;
      const timekeepingStatus: 'Đạt chuẩn' | 'Thiếu công' | 'Vượt công' = 
        totalPaidDays >= 26 ? 'Đạt chuẩn' : 'Thiếu công';

      return {
        employeeCode: lab.employeeCode || `NV-${String(index + 1).padStart(3, '0')}`,
        name: lab.name,
        department: lab.department || 'Xưởng Dịch vụ',
        position: lab.position || 'Nhân viên',
        monthlyWorkDays: 26,
        actualWorkDays,
        paidLeaveDays,
        unpaidLeaveDays,
        normalOtDays,
        holidayOtDays,
        weekendOtHours,
        lateMinutes,
        earlyMinutes,
        totalPaidDays,
        timekeepingStatus
      };
    });
  });

  // Kiểm tra xem NLĐ đã có trong bảng Tổng hợp chấm công chưa
  const isAlreadyInTimekeeping = (lab: Laborer) => {
    const empCode = lab.employeeCode || lab.code || lab.cccd || lab.name;
    return timekeepingList.some(tk => tk.employeeCode === empCode || tk.name.trim().toLowerCase() === lab.name.trim().toLowerCase());
  };

  // Thao tác: Nhấn "Chấm công" ở Tab Danh sách NLĐ -> Thêm record đó qua Tab "Tổng hợp chấm công NLĐ"
  const handleAddToTimekeeping = (lab: Laborer) => {
    const empCode = lab.employeeCode || lab.code || lab.cccd || `NV-${Date.now().toString().slice(-4)}`;
    if (isAlreadyInTimekeeping(lab)) {
      showToast(`NLĐ "${lab.name}" (${empCode}) đã có trong bảng Tổng hợp chấm công.`);
      return;
    }

    const newRow: TimekeepingSummaryRow = {
      employeeCode: empCode,
      name: lab.name,
      department: lab.department || 'Xưởng Dịch vụ',
      position: lab.position || 'Nhân viên',
      monthlyWorkDays: Number(standardWorkDays) || 26,
      actualWorkDays: Number(standardWorkDays) || 26,
      paidLeaveDays: 0,
      unpaidLeaveDays: 0,
      normalOtDays: 0,
      holidayOtDays: 0,
      weekendOtHours: 0,
      lateMinutes: 0,
      earlyMinutes: 0,
      totalPaidDays: Number(standardWorkDays) || 26,
      timekeepingStatus: 'Đạt chuẩn'
    };

    setTimekeepingList(prev => [newRow, ...prev]);
    showToast(`Đã thêm "${lab.name}" qua bảng Tổng hợp chấm công.`);
  };

  // Thao tác: Nhấn "Hủy chấm công" ở Tab Tổng hợp chấm công NLĐ -> Đưa record này ra khỏi Tab này
  const handleRemoveFromTimekeeping = (empCode: string, empName: string) => {
    setTimekeepingList(prev => prev.filter(tk => tk.employeeCode !== empCode));
    showToast(`Đã hủy chấm công cho "${empName}" (đã đưa ra khỏi bảng).`);
  };

  // Mở màn hình Full Đánh giá chi tiết chấm công
  const handleOpenEvaluationDetail = (row: TimekeepingSummaryRow) => {
    setEvalFormData({
      ...row,
      evaluationNote: row.evaluationNote || (row.totalPaidDays >= row.monthlyWorkDays 
        ? 'Nhân viên chấp hành tốt nội quy kỷ luật công, hoàn thành đầy đủ ngày công trong kỳ.' 
        : 'Cần chú ý bù ngày công thiếu và nâng cao tính kỷ luật giờ giấc.'),
      bonusPenaltyProposal: row.bonusPenaltyProposal || (row.normalOtDays > 0 || row.holidayOtDays > 0 
        ? 'Đề xuất tính phụ cấp làm thêm giờ theo quy chế công ty.' 
        : '')
    });
  };

  // Đổi sang nhân viên khác từ select "Họ và tên" trên màn hình Đánh giá chi tiết
  const handleSelectEmployeeInEvaluation = (newEmpCode: string) => {
    if (!newEmpCode) return;
    // Tự động lưu dữ liệu đang nhập của nhân viên hiện tại vào timekeepingList
    if (evalFormData) {
      setTimekeepingList(prev => prev.map(item => item.employeeCode === evalFormData.employeeCode ? evalFormData : item));
    }
    const targetRow = timekeepingList.find(item => item.employeeCode === newEmpCode);
    if (targetRow) {
      setEvalFormData({
        ...targetRow,
        evaluationNote: targetRow.evaluationNote || (targetRow.totalPaidDays >= targetRow.monthlyWorkDays 
          ? 'Nhân viên chấp hành tốt nội quy kỷ luật công, hoàn thành đầy đủ ngày công trong kỳ.' 
          : 'Cần chú ý bù ngày công thiếu và nâng cao tính kỷ luật giờ giấc.'),
        bonusPenaltyProposal: targetRow.bonusPenaltyProposal || (targetRow.normalOtDays > 0 || targetRow.holidayOtDays > 0 
          ? 'Đề xuất tính phụ cấp làm thêm giờ theo quy chế công ty.' 
          : '')
      });
      showToast(`Đã chuyển sang hồ sơ của: ${targetRow.name}`);
    }
  };

  // Lưu dữ liệu đánh giá chi tiết
  const handleSaveEvaluationForm = (stayOnScreen: boolean = false) => {
    if (!evalFormData) return;
    setTimekeepingList(prev => prev.map(item => item.employeeCode === evalFormData.employeeCode ? evalFormData : item));
    showToast(`Đã lưu dữ liệu đánh giá chấm công cho "${evalFormData.name}".`);
    if (!stayOnScreen) {
      setEvalFormData(null);
    }
  };

  // Cập nhật trường dữ liệu trong form đánh giá chi tiết
  const handleFormChange = (field: keyof TimekeepingSummaryRow, value: any) => {
    setEvalFormData(prev => {
      if (!prev) return null;
      let parsedValue = value;
      const numericFields: (keyof TimekeepingSummaryRow)[] = [
        'actualWorkDays',
        'paidLeaveDays',
        'unpaidLeaveDays',
        'normalOtDays',
        'holidayOtDays',
        'weekendOtHours',
        'lateMinutes',
        'earlyMinutes',
        'monthlyWorkDays',
        'totalPaidDays'
      ];

      if (numericFields.includes(field)) {
        parsedValue = value === '' || value === null || isNaN(Number(value)) ? 0 : Number(value);
      }

      const updated: TimekeepingSummaryRow = { ...prev, [field]: parsedValue };

      // Luôn tính toán lại an toàn tuyệt đối với Number
      if (field === 'actualWorkDays' || field === 'paidLeaveDays' || field === 'monthlyWorkDays') {
        const actual = Number(updated.actualWorkDays) || 0;
        const paid = Number(updated.paidLeaveDays) || 0;
        const sum = actual + paid;
        updated.totalPaidDays = Number(sum.toFixed(1));
        const standard = Number(updated.monthlyWorkDays) || 26;
        updated.timekeepingStatus = updated.totalPaidDays >= standard ? 'Đạt chuẩn' : 'Thiếu công';
      }
      return updated;
    });
  };

  // Vị trí của nhân viên đang đánh giá trong timekeepingList
  const currentEvaluationIndex = useMemo(() => {
    if (!evalFormData) return -1;
    return timekeepingList.findIndex(item => item.employeeCode === evalFormData.employeeCode);
  }, [evalFormData, timekeepingList]);

  const handlePrevEvaluation = () => {
    if (currentEvaluationIndex > 0) {
      const prevEmp = timekeepingList[currentEvaluationIndex - 1];
      handleSelectEmployeeInEvaluation(prevEmp.employeeCode);
    }
  };

  const handleNextEvaluation = () => {
    if (currentEvaluationIndex >= 0 && currentEvaluationIndex < timekeepingList.length - 1) {
      const nextEmp = timekeepingList[currentEvaluationIndex + 1];
      handleSelectEmployeeInEvaluation(nextEmp.employeeCode);
    }
  };

  const filteredTimekeeping = useMemo(() => {
    return timekeepingList.filter(tk => 
      tk.name.toLowerCase().includes(tkSearchTerm.toLowerCase()) ||
      tk.employeeCode.toLowerCase().includes(tkSearchTerm.toLowerCase()) ||
      tk.department.toLowerCase().includes(tkSearchTerm.toLowerCase()) ||
      tk.position.toLowerCase().includes(tkSearchTerm.toLowerCase())
    );
  }, [timekeepingList, tkSearchTerm]);

  // Checkbox handlers
  const handleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedLaborerIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLaborerIds(filteredLaborers.map((emp, idx) => getRecordId(emp, idx)));
    } else {
      setSelectedLaborerIds([]);
    }
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Vui lòng điền đầy đủ Mã kỳ lương và Tên kỳ lương.');
      return;
    }

    const updatedPeriod: PayrollPeriod = {
      id: initialPeriod?.id || 'pp_' + Date.now(),
      code: code.trim(),
      name: name.trim(),
      totalEmployees: timekeepingList.length,
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      standardWorkDays: Number(standardWorkDays) || 26,
      status: status,
      isLocked: status === 'Đã khóa',
      hasPayrollTable: initialPeriod?.hasPayrollTable || false
    };

    onSave(updatedPeriod);
  };

  // Lắng nghe phím Esc để đóng màn hình full
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F4F6F8] font-sans overflow-hidden animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-[110] bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Quay lại danh sách kỳ lương (Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Kỳ tính lương</span>
              <span className="text-gray-300">/</span>
              <h2 className="text-base font-bold text-gray-800">
                {initialPeriod ? `Chi tiết Kỳ tính lương: ${initialPeriod.name}` : 'Thêm mới Kỳ tính lương'}
              </h2>
              <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                Toàn màn hình
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Thiết lập thông số kỳ tính lương, quản lý danh sách người lao động và theo dõi tổng hợp công
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-2xs transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu kỳ tính lương
          </button>
          <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Đóng toàn màn hình (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* DÒNG 1: Mã kỳ lương, Tên kỳ lương, Ngày bắt đầu, Ngày kết thúc, Ngày công chuẩn, Số NLĐ có chấm công (read-only), Trạng thái */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 shrink-0 shadow-2xs">
        <div className="grid grid-cols-7 gap-3.5 items-end">
          {/* 1. Mã kỳ lương */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mã kỳ lương <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: T11_2025"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
            />
          </div>

          {/* 2. Tên kỳ lương */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tên kỳ lương <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: T11/2025"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
            />
          </div>

          {/* 3. Ngày bắt đầu */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Ngày bắt đầu
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="01/11/2025"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
            />
          </div>

          {/* 4. Ngày kết thúc */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Ngày kết thúc
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="30/11/2025"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
            />
          </div>

          {/* 5. Ngày công chuẩn */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Ngày công chuẩn
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={standardWorkDays}
              onChange={(e) => setStandardWorkDays(parseInt(e.target.value, 10) || 0)}
              className="w-full border border-emerald-300 bg-emerald-50/50 rounded px-2.5 py-1.5 text-xs font-bold text-emerald-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
          </div>

          {/* 6. Số NLĐ có chấm công */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 truncate" title="Số NLĐ có chấm công">
              Số NLĐ có chấm công
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={`${timekeepingList.length} nhân sự`}
                title="Số NLĐ có chấm công được tự động tính từ bảng chấm công bên dưới"
                className="w-full border border-gray-300 bg-gray-100 rounded px-2.5 py-1.5 text-xs font-bold text-blue-800 cursor-not-allowed select-none shadow-2xs pl-8"
              />
              <Users className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 7. Trạng thái */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-500 bg-white shadow-2xs cursor-pointer"
            >
              <option value="Chưa chấm công">Chưa chấm công</option>
              <option value="Đang chấm công">Đang chấm công</option>
              <option value="Đã khóa">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex-1 flex flex-col min-h-0 p-4">
        <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
          
          {/* Tabs Bar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-[#F8FAFC] px-4 pt-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('labor_list')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold text-xs transition-colors cursor-pointer ${
                  activeTab === 'labor_list'
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-md shadow-2xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 rounded-t-md'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Danh sách NLĐ</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'labor_list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {laborers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('timekeeping_summary')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold text-xs transition-colors cursor-pointer ${
                  activeTab === 'timekeeping_summary'
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-md shadow-2xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 rounded-t-md'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Tổng hợp chấm công NLĐ</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'timekeeping_summary' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {timekeepingList.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-gray-500 font-medium pb-2 pr-2 hidden sm:block">
              {activeTab === 'labor_list' 
                ? 'Dữ liệu hiển thị tương thích hoàn toàn với viewlist "Hồ sơ hợp đồng"' 
                : `Bảng tổng hợp công tính lương chuẩn: ${standardWorkDays} ngày công`}
            </div>
          </div>

          {/* TAB CONTENT 1: DANH SÁCH NLĐ (Giao diện & Dữ liệu như viewlist Hồ sơ hợp đồng) */}
          {activeTab === 'labor_list' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tìm theo mã, họ tên, SĐT, bộ phận..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-xs w-[320px] focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLaborerIds([]);
                    }}
                    className="bg-[#F8F9FA] border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Làm mới
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedLaborerIds.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => {
                        let addedCount = 0;
                        const newRows: TimekeepingSummaryRow[] = [];
                        laborers.forEach((lab, idx) => {
                          const id = getRecordId(lab, idx);
                          if (selectedLaborerIds.includes(id) && !isAlreadyInTimekeeping(lab)) {
                            const empCode = lab.employeeCode || lab.code || lab.cccd || `NV-${Date.now().toString().slice(-4)}`;
                            newRows.push({
                              employeeCode: empCode,
                              name: lab.name,
                              department: lab.department || 'Xưởng Dịch vụ',
                              position: lab.position || 'Nhân viên',
                              monthlyWorkDays: Number(standardWorkDays) || 26,
                              actualWorkDays: Number(standardWorkDays) || 26,
                              paidLeaveDays: 0,
                              unpaidLeaveDays: 0,
                              normalOtDays: 0,
                              holidayOtDays: 0,
                              weekendOtHours: 0,
                              lateMinutes: 0,
                              earlyMinutes: 0,
                              totalPaidDays: Number(standardWorkDays) || 26,
                              timekeepingStatus: 'Đạt chuẩn'
                            });
                            addedCount++;
                          }
                        });
                        if (newRows.length > 0) {
                          setTimekeepingList(prev => [...newRows, ...prev]);
                          showToast(`Đã thêm ${addedCount} người lao động vào bảng Tổng hợp chấm công.`);
                        } else {
                          showToast('Các NLĐ đã chọn đều đã có trong bảng Tổng hợp chấm công.');
                        }
                        setSelectedLaborerIds([]);
                      }}
                      className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" /> Chấm công đã chọn ({selectedLaborerIds.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Table Viewlist: Thứ tự cột như "Hồ sơ hợp đồng" */}
              <div className="flex-1 overflow-auto bg-white">
                <table className="w-full min-w-[1320px] text-left border-collapse text-[13px]">
                  <thead className="sticky top-0 bg-[#F9FAFB] z-10 border-b border-gray-200">
                    <tr>
                      <th className="p-3 border-r border-gray-200 w-12 min-w-12 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 cursor-pointer"
                          checked={filteredLaborers.length > 0 && selectedLaborerIds.length === filteredLaborers.length}
                          onChange={handleSelectAll} 
                        />
                      </th>
                      {/* Bổ sung cột "Chấm công" trước cột "Tình trạng" */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-blue-700 w-[130px] min-w-[130px] text-center whitespace-nowrap">
                        Chấm công
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[140px] min-w-[140px] text-center whitespace-nowrap">
                        Tình trạng
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[150px] min-w-[150px] whitespace-nowrap">
                        Đối tượng
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[140px] min-w-[140px] whitespace-nowrap">
                        Mã
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[220px] whitespace-nowrap">
                        Họ tên
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[140px] min-w-[140px] whitespace-nowrap">
                        Số điện thoại
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[190px] whitespace-nowrap">
                        Bộ phận
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[180px] whitespace-nowrap">
                        Chức vụ
                      </th>
                      <th className="p-3 border-gray-200 font-semibold text-gray-700 min-w-[250px] whitespace-nowrap">
                        Loại hợp đồng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLaborers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-gray-400 italic">
                          Không có người lao động nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredLaborers.map((lab, idx) => {
                        const recId = getRecordId(lab, idx);
                        const isChecked = selectedLaborerIds.includes(recId);
                        const isActive = activeRow && getRecordId(activeRow, 0) === recId;
                        const inTimekeeping = isAlreadyInTimekeeping(lab);

                        return (
                          <tr 
                            key={recId} 
                            onClick={() => setActiveRow(lab)}
                            className={`cursor-pointer transition-colors ${
                              isActive 
                                ? 'bg-blue-50/90 font-medium' 
                                : isChecked 
                                  ? 'bg-blue-50/50' 
                                  : 'hover:bg-blue-50/30'
                            }`}
                          >
                            <td className="p-3 border-r border-gray-200 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300 cursor-pointer" 
                                checked={isChecked}
                                onChange={() => handleSelect(recId)}
                              />
                            </td>

                            {/* Cột "Chấm công" trước cột "Tình trạng" */}
                            <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              {inTimekeeping ? (
                                <button
                                  type="button"
                                  onClick={() => handleAddToTimekeeping(lab)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                                  title="Đã có trong bảng chấm công"
                                >
                                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Đã chấm công</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddToTimekeeping(lab)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                                  title="Chấm công (Thêm vào Tab Tổng hợp chấm công NLĐ)"
                                >
                                  <CalendarPlus className="w-3.5 h-3.5" />
                                  <span>Chấm công</span>
                                </button>
                              )}
                            </td>

                            {/* 1. Tình trạng */}
                            <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-medium border ${
                                lab.status === 'Đã chấm dứt' || lab.status === 'Hết hiệu lực'
                                   ? 'bg-red-50 text-red-600 border-red-200'
                                   : lab.status === 'Chờ ký'
                                     ? 'bg-amber-50 text-amber-700 border-amber-200'
                                     : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              }`}>
                                {lab.status || 'Đang hiệu lực'}
                              </span>
                            </td>

                            {/* 2. Đối tượng */}
                            <td className="p-3 border-r border-gray-200 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {lab.contractTargetType || 'Người lao động'}
                              </span>
                            </td>

                            {/* 3. Mã */}
                            <td className="p-3 border-r border-gray-200 text-gray-800 font-mono font-medium whitespace-nowrap">
                              {lab.employeeCode ? (
                                <div className="flex flex-col">
                                  <span className="text-blue-700 font-semibold">{lab.employeeCode}</span>
                                  <span className="text-[11px] text-gray-400 font-normal">{lab.code}</span>
                                </div>
                              ) : (
                                lab.code || '—'
                              )}
                            </td>

                            {/* 4. Họ tên */}
                            <td className="p-3 border-r border-gray-200 text-gray-900 font-semibold whitespace-nowrap">
                              {lab.name}
                            </td>

                            {/* 5. Số điện thoại */}
                            <td className="p-3 border-r border-gray-200 text-gray-700 whitespace-nowrap">
                              {lab.phone || '—'}
                            </td>

                            {/* 6. Bộ phận */}
                            <td className="p-3 border-r border-gray-200 text-gray-800 whitespace-nowrap">
                              {lab.department || '—'}
                            </td>

                            {/* 7. Chức vụ */}
                            <td className="p-3 border-r border-gray-200 text-gray-800 whitespace-nowrap">
                              {lab.position || '—'}
                            </td>

                            {/* 8. Loại hợp đồng */}
                            <td className="p-3 border-gray-200 text-gray-700 whitespace-nowrap">
                              {lab.contractType || '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom status bar */}
              <div className="bg-[#F8FAFC] border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Hiển thị <strong>{filteredLaborers.length}</strong> / <strong>{laborers.length}</strong> người lao động trong kỳ lương
                </span>
                <span>
                  Đã chọn: <strong className="text-blue-600">{selectedLaborerIds.length}</strong>
                </span>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: TỔNG HỢP CHẤM CÔNG NLĐ */}
          {activeTab === 'timekeeping_summary' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tìm theo mã NV, họ tên, bộ phận..." 
                      value={tkSearchTerm}
                      onChange={(e) => setTkSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-xs w-[320px] focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setTkSearchTerm('')}
                    className="bg-[#F8F9FA] border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Làm mới
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded">
                    Ngày công tháng: {standardWorkDays} ngày
                  </span>
                </div>
              </div>

              {/* Timekeeping Table */}
              <div className="flex-1 overflow-auto bg-white">
                <table className="w-full min-w-[1880px] text-left border-collapse text-[13px]">
                  <thead className="sticky top-0 bg-[#F9FAFB] z-10 border-b border-gray-200">
                    <tr>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-12 text-center">
                        STT
                      </th>
                      {/* Bổ sung cột "Chấm công" trước cột "Mã NV" với nút Hủy và nút Đánh giá chi tiết */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-blue-900 w-[230px] min-w-[230px] text-center whitespace-nowrap">
                        Chấm công
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[100px]">
                        Mã NV
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[190px]">
                        Họ và tên
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[170px]">
                        Bộ phận
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 min-w-[150px]">
                        Chức vụ
                      </th>
                      {/* Đổi từ Công chuẩn thành Ngày công tháng */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[130px] text-center bg-emerald-50/50">
                        Ngày công tháng
                      </th>
                      {/* Đổi từ Công thực tế thành Ngày công đi làm thực tế */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-gray-700 w-[170px] text-center bg-blue-50/40">
                        Ngày công đi làm thực tế
                      </th>
                      {/* Bổ sung sau Ngày công đi làm thực tế: Nghỉ phép có hưởng lương */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-emerald-800 w-[175px] text-center">
                        Nghỉ phép có hưởng lương
                      </th>
                      {/* Bổ sung sau Nghỉ phép có hưởng lương: Nghỉ không hưởng lương */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-red-600 w-[165px] text-center">
                        Nghỉ không hưởng lương
                      </th>
                      {/* Tiếp theo bổ sung các cột: */}
                      <th className="p-3 border-r border-gray-200 font-semibold text-amber-700 w-[150px] text-center">
                        Ngày tăng ca thường
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-purple-700 w-[140px] text-center">
                        Ngày tăng ca Lễ
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-blue-700 w-[155px] text-center">
                        Giờ tăng ca cuối tuần
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-orange-600 w-[135px] text-center">
                        Số phút đi muộn
                      </th>
                      <th className="p-3 border-r border-gray-200 font-semibold text-orange-600 w-[135px] text-center">
                        Số phút về sớm
                      </th>
                      {/* Tổng công tính lương (cột cuối) */}
                      <th className="p-3 border-gray-200 font-semibold text-blue-900 w-[140px] text-center bg-blue-50/80">
                        Tổng công tính lương
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTimekeeping.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="p-8 text-center text-gray-400 italic">
                          Chưa có người lao động nào trong bảng chấm công. Vui lòng sang Tab "Danh sách NLĐ" và nhấn biểu tượng "Chấm công" để thêm.
                        </td>
                      </tr>
                    ) : (
                      filteredTimekeeping.map((row, idx) => (
                        <tr key={row.employeeCode} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3 border-r border-gray-200 text-center text-gray-600">
                            {idx + 1}
                          </td>
                          {/* Nút "Hủy" và nút "Đánh giá chi tiết" */}
                          <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromTimekeeping(row.employeeCode, row.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-all cursor-pointer shadow-2xs"
                                title={`Hủy chấm công cho "${row.name}" (đưa record ra khỏi Tab này)`}
                              >
                                <CalendarX className="w-3.5 h-3.5 text-red-500" />
                                <span>Hủy</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEvaluationDetail(row)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 transition-all cursor-pointer shadow-2xs"
                                title={`Đánh giá chi tiết chấm công của "${row.name}"`}
                              >
                                <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span>Đánh giá chi tiết</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3 border-r border-gray-200 font-mono font-bold text-blue-700">
                            {row.employeeCode}
                          </td>
                        <td className="p-3 border-r border-gray-200 font-semibold text-gray-900">
                          {row.name}
                        </td>
                        <td className="p-3 border-r border-gray-200 text-gray-800">
                          {row.department}
                        </td>
                        <td className="p-3 border-r border-gray-200 text-gray-800">
                          {row.position}
                        </td>
                        {/* Ngày công tháng */}
                        <td className="p-3 border-r border-gray-200 text-center font-bold text-emerald-800 bg-emerald-50/30">
                          {row.monthlyWorkDays}
                        </td>
                        {/* Ngày công đi làm thực tế */}
                        <td className="p-3 border-r border-gray-200 text-center font-bold text-blue-800 bg-blue-50/30">
                          {row.actualWorkDays}
                        </td>
                        {/* Nghỉ phép có hưởng lương */}
                        <td className="p-3 border-r border-gray-200 text-center font-semibold">
                          {row.paidLeaveDays > 0 ? (
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200">
                              {row.paidLeaveDays}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Nghỉ không hưởng lương */}
                        <td className="p-3 border-r border-gray-200 text-center font-semibold">
                          {row.unpaidLeaveDays > 0 ? (
                            <span className="text-red-600 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                              {row.unpaidLeaveDays}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Ngày tăng ca thường */}
                        <td className="p-3 border-r border-gray-200 text-center font-semibold text-amber-700">
                          {row.normalOtDays > 0 ? (
                            <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                              {row.normalOtDays} ngày
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Ngày tăng ca Lễ */}
                        <td className="p-3 border-r border-gray-200 text-center font-semibold text-purple-700">
                          {row.holidayOtDays > 0 ? (
                            <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                              {row.holidayOtDays} ngày
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Giờ tăng ca cuối tuần */}
                        <td className="p-3 border-r border-gray-200 text-center font-semibold text-blue-700">
                          {row.weekendOtHours > 0 ? (
                            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                              {row.weekendOtHours}h
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Số phút đi muộn */}
                        <td className="p-3 border-r border-gray-200 text-center text-gray-700">
                          {row.lateMinutes > 0 ? (
                            <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              {row.lateMinutes}p
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Số phút về sớm */}
                        <td className="p-3 border-r border-gray-200 text-center text-gray-700">
                          {row.earlyMinutes > 0 ? (
                            <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              {row.earlyMinutes}p
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        {/* Tổng công tính lương (cột cuối) */}
                        <td className="p-3 border-gray-200 text-center font-bold text-blue-900 bg-blue-50/60">
                          {row.totalPaidDays}
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>

              {/* Bottom status bar */}
              <div className="bg-[#F8FAFC] border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Tổng số nhân sự chấm công: <strong>{filteredTimekeeping.length}</strong>
                </span>
                <span>
                  Tiêu chuẩn tính công: 1 ngày công = 8 giờ làm việc theo quy định xưởng
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MÀN HÌNH FULL: ĐÁNH GIÁ CHI TIẾT CHẤM CÔNG NLĐ */}
      {evalFormData && (
        <div className="fixed inset-0 z-[150] bg-[#F4F5F7] flex flex-col overflow-hidden animate-in fade-in duration-150">
          {/* Top Navigation & Action Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveEvaluationForm(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại kỳ lương</span>
              </button>
              <div className="h-5 w-px bg-gray-300" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                      ĐÁNH GIÁ CHI TIẾT CHẤM CÔNG NLĐ
                    </h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      Full Màn hình
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Kỳ lương: <strong className="text-blue-700">{name || 'Kỳ tính lương'}</strong> | Chuẩn: <strong className="text-emerald-700">{evalFormData.monthlyWorkDays}</strong> ngày công
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Previous / Next navigation */}
              <div className="flex items-center bg-gray-100 rounded border border-gray-300 p-0.5 text-xs">
                <button
                  type="button"
                  disabled={currentEvaluationIndex <= 0}
                  onClick={handlePrevEvaluation}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                    currentEvaluationIndex > 0 ? 'hover:bg-white text-gray-800 cursor-pointer font-semibold shadow-2xs' : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title="Chuyển sang người lao động trước"
                >
                  <ChevronLeft className="w-4 h-4" /> Trước
                </button>
                <span className="px-3 py-1 text-gray-700 font-bold border-x border-gray-300">
                  {currentEvaluationIndex >= 0 ? `${currentEvaluationIndex + 1} / ${timekeepingList.length}` : '—'}
                </span>
                <button
                  type="button"
                  disabled={currentEvaluationIndex < 0 || currentEvaluationIndex >= timekeepingList.length - 1}
                  onClick={handleNextEvaluation}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                    currentEvaluationIndex >= 0 && currentEvaluationIndex < timekeepingList.length - 1 ? 'hover:bg-white text-gray-800 cursor-pointer font-semibold shadow-2xs' : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title="Chuyển sang người lao động kế tiếp"
                >
                  Sau <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSaveEvaluationForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Lưu dữ liệu
              </button>
              <button
                type="button"
                onClick={() => handleSaveEvaluationForm(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" /> Lưu & Đóng
              </button>
              <button
                type="button"
                onClick={() => setEvalFormData(null)}
                className="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                title="Đóng màn hình đánh giá"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* THẺ 1: HỌ VÀ TÊN & ĐIỀU CHUYỂN HỒ SƠ */}
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-5">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-900">
                    1. THÔNG TIN NHÂN SỰ & CHỌN HỒ SƠ ĐÁNH GIÁ
                  </h3>
                </div>
                <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Chọn tại ô "Họ và tên" để đổi hồ sơ ngay trên màn hình này
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Field Họ và tên: Select dropdown */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      Họ và tên NLĐ <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] font-medium text-blue-700 normal-case">
                      (Đổi chọn để chuyển dữ liệu NLĐ khác)
                    </span>
                  </label>
                  <select
                    value={evalFormData.employeeCode}
                    onChange={(e) => handleSelectEmployeeInEvaluation(e.target.value)}
                    className="w-full bg-blue-50/80 border-2 border-blue-500 text-blue-950 font-bold text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-xs"
                  >
                    {timekeepingList.map((item, idx) => (
                      <option key={item.employeeCode} value={item.employeeCode}>
                        {idx + 1}. {item.name} — Mã: {item.employeeCode} | {item.department} ({item.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mã nhân viên (Read-only):
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={evalFormData.employeeCode}
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold text-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Kỳ tính lương:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${name || 'Kỳ lương'} (${startDate} - ${endDate})`}
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-xs font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bộ phận:
                  </label>
                  <input
                    type="text"
                    value={evalFormData.department}
                    onChange={(e) => handleFormChange('department', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Chức vụ:
                  </label>
                  <input
                    type="text"
                    value={evalFormData.position}
                    onChange={(e) => handleFormChange('position', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">
                    Ngày công tháng chuẩn:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={evalFormData.monthlyWorkDays}
                    onChange={(e) => handleFormChange('monthlyWorkDays', Number(e.target.value) || 0)}
                    className="w-full bg-emerald-50 border border-emerald-300 rounded px-3 py-1.5 text-xs font-bold text-emerald-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* THẺ 2: CHI TIẾT NGÀY CÔNG & THỜI GIAN LÀM VIỆC (INPUTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Nhóm 1: Công làm việc & Phép */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                      2.1 Ngày công & Nghỉ phép
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-blue-900 mb-1">
                        Ngày công đi làm thực tế:
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="31"
                        value={evalFormData.actualWorkDays}
                        onChange={(e) => handleFormChange('actualWorkDays', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border-2 border-blue-300 rounded px-3 py-2 text-sm font-bold text-blue-900 focus:border-blue-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-800 mb-1">
                        Nghỉ phép có hưởng lương (ngày):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="31"
                        value={evalFormData.paidLeaveDays}
                        onChange={(e) => handleFormChange('paidLeaveDays', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-emerald-300 rounded px-3 py-2 text-sm font-bold text-emerald-800 focus:border-emerald-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-red-600 mb-1">
                        Nghỉ không hưởng lương (ngày):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="31"
                        value={evalFormData.unpaidLeaveDays}
                        onChange={(e) => handleFormChange('unpaidLeaveDays', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-red-300 rounded px-3 py-2 text-sm font-bold text-red-700 focus:border-red-500 focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Kết quả tổng công tính lương */}
                <div className="mt-4 pt-3 border-t border-blue-100 bg-blue-50/70 p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900">Tổng công tính lương:</span>
                    <strong className="text-base font-bold text-blue-950">
                      {evalFormData.totalPaidDays} / {evalFormData.monthlyWorkDays} ngày
                    </strong>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-blue-700">
                    <span>Tỷ lệ hoàn thành công:</span>
                    <span className="font-bold">
                      {Math.round((evalFormData.totalPaidDays / (evalFormData.monthlyWorkDays || 26)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Tăng ca (OT) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                      2.2 Tăng ca & Ngoài giờ (OT)
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-amber-800 mb-1">
                        Ngày tăng ca thường (hệ số 1.5):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={evalFormData.normalOtDays}
                        onChange={(e) => handleFormChange('normalOtDays', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-amber-300 rounded px-3 py-2 text-sm font-bold text-amber-800 focus:border-amber-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-purple-800 mb-1">
                        Ngày tăng ca Lễ / Tết (hệ số 3.0):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={evalFormData.holidayOtDays}
                        onChange={(e) => handleFormChange('holidayOtDays', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-purple-300 rounded px-3 py-2 text-sm font-bold text-purple-800 focus:border-purple-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-800 mb-1">
                        Giờ tăng ca cuối tuần (giờ, hệ số 2.0):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={evalFormData.weekendOtHours}
                        onChange={(e) => handleFormChange('weekendOtHours', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-indigo-300 rounded px-3 py-2 text-sm font-bold text-indigo-800 focus:border-indigo-500 focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 bg-amber-50/60 p-3 rounded-lg border">
                  <div className="flex items-center justify-between text-xs text-amber-900">
                    <span className="font-semibold">Tổng thời gian tăng ca:</span>
                    <strong>{evalFormData.normalOtDays + evalFormData.holidayOtDays} ngày + {evalFormData.weekendOtHours}h</strong>
                  </div>
                </div>
              </div>

              {/* Nhóm 3: Giờ giấc & Vi phạm */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                      2.3 Kỷ luật giờ giấc & Trễ / Sớm
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-orange-700 mb-1">
                        Số phút đi muộn (phút):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={evalFormData.lateMinutes}
                        onChange={(e) => handleFormChange('lateMinutes', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-orange-300 rounded px-3 py-2 text-sm font-bold text-orange-700 focus:border-orange-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-orange-700 mb-1">
                        Số phút về sớm (phút):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={evalFormData.earlyMinutes}
                        onChange={(e) => handleFormChange('earlyMinutes', Number(e.target.value) || 0)}
                        className="w-full bg-white border border-orange-300 rounded px-3 py-2 text-sm font-bold text-orange-700 focus:border-orange-500 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Tình trạng chấp hành giờ:
                      </label>
                      <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-xs">
                        {evalFormData.lateMinutes === 0 && evalFormData.earlyMinutes === 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đúng giờ tuyệt đối
                          </span>
                        ) : (
                          <span className="text-orange-700 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Vi phạm: {evalFormData.lateMinutes + evalFormData.earlyMinutes} phút
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-orange-100 bg-orange-50/60 p-3 rounded-lg border">
                  <div className="flex items-center justify-between text-xs text-orange-900">
                    <span className="font-semibold">Quy chế kỷ luật:</span>
                    <span>{evalFormData.lateMinutes + evalFormData.earlyMinutes > 30 ? 'Cảnh cáo / Trừ chuyên cần' : 'Trong mức nhắc nhở'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Footer Bar */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-lg text-xs">
            <div className="flex items-center gap-3 text-gray-700">
              <span>Đang đánh giá: <strong className="text-blue-700">{evalFormData.name}</strong> ({evalFormData.employeeCode})</span>
              <span>•</span>
              <span>Tổng ngày công: <strong className="text-emerald-700 text-sm font-bold">{evalFormData.totalPaidDays}</strong> / {evalFormData.monthlyWorkDays}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full font-bold ${
                evalFormData.timekeepingStatus === 'Đạt chuẩn' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {evalFormData.timekeepingStatus}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEvalFormData(null)}
                className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handleSaveEvaluationForm(true)}
                className="px-4 py-2 rounded border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors cursor-pointer"
              >
                Lưu dữ liệu
              </button>
              <button
                type="button"
                onClick={() => handleSaveEvaluationForm(false)}
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Lưu & Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
