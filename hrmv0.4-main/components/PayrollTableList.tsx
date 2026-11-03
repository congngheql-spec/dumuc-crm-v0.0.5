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
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  FileDown,
  XCircle,
  RotateCcw,
  Send,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PayrollPeriod } from './PayrollPeriodList';

export interface PayrollEmployeeItem {
  id: string;
  code: string;
  name: string;
  department: string;
  position: string;
  baseSalary: number;
  actualWorkDays: number;
  standardWorkDays: number;
  totalPaidDays?: number;
  paidLeaveDays?: number;
  unpaidLeaveDays?: number;
  workSalary: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  socialInsurance: number;
  personalIncomeTax: number;
  netSalary: number;
  status: 'Chờ chi trả' | 'Đã chi trả';
  isApproved?: boolean;
  approvalDate?: string;
}

export interface PayrollTableRecord {
  id: string;
  code: string; // Mã bảng lương: VD BL_T10_2025
  name: string; // Tên bảng lương: VD Bảng lương T10/2025
  periodId?: string;
  periodCode: string; // Kỳ tính lương: VD T10_2025
  periodName: string; // VD: T10/2025
  totalEmployees: number; // Tổng số NLĐ
  standardWorkDays: number; // Ngày công chuẩn: 26/27
  startDate: string; // 01/10/2025
  endDate: string; // 31/10/2025
  totalGrossSalary: number;
  totalInsurance: number;
  totalTax: number;
  totalNetSalary: number;
  createdDate: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Đã chi trả' | 'Đã khóa';
  isLocked: boolean;
  notes?: string;
  employees?: PayrollEmployeeItem[];
}

// Danh sách người lao động thực tế đang tồn tại trong hệ thống (khớp với Hồ sơ hợp đồng & Kỳ tính lương)
export const SYSTEM_EMPLOYEES_SOURCE = [
  {
    code: 'NV-001',
    name: 'LÊ XUÂN NGUYÊN',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Quản lý xưởng',
    baseSalary: 20000000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 3730000, // Ăn trưa 730k + Xăng 500k + Trách nhiệm xưởng 2000k + Chuyên cần 500k
    bonus: 3500000, // KPI quản lý xưởng
    dependents: 1
  },
  {
    code: 'NV-002',
    name: 'Chế Công Vinh',
    department: 'Phòng Kế toán',
    position: 'Kế Toán',
    baseSalary: 15000000,
    actualDays: (std: number) => Math.max(std - 1, 1), // 25
    paidLeaveDays: 1, // 1 ngày phép hưởng lương -> Tổng công tính lương = 26
    unpaidLeaveDays: 0,
    allowances: 1730000, // Ăn trưa 730k + Xăng 500k + Chuyên cần 500k
    bonus: 2000000,
    dependents: 0
  },
  {
    code: 'NV-003',
    name: 'Lê Thanh Trí',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Kỹ thuật viên trưởng',
    baseSalary: 15000000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 1730000,
    bonus: 2500000,
    dependents: 0
  },
  {
    code: 'NV-004',
    name: 'Phạm Ngọc Lâm',
    department: 'Kho Phụ tùng & Lốp',
    position: 'Thủ kho phụ tùng',
    baseSalary: 12000000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 2230000, // Ăn trưa 730k + Xăng 500k + Trách nhiệm kho 1000k
    bonus: 1500000,
    dependents: 0
  },
  {
    code: 'NV-005',
    name: 'Nguyễn Hoàng Phúc',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Thợ máy - Gầm điện',
    baseSalary: 9000000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 1230000, // Ăn trưa 730k + Xăng 500k
    bonus: 1200000,
    dependents: 0
  },
  {
    code: 'NV-006',
    name: 'Đặng Văn Lâm',
    department: 'Phòng Chăm sóc khách hàng & Tiếp nhận',
    position: 'Cố vấn dịch vụ',
    baseSalary: 13000000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 1230000,
    bonus: 3500000, // Thưởng hoa hồng dịch vụ
    dependents: 0
  },
  {
    code: 'NV-007',
    name: 'Nguyễn Hữu Ý',
    department: 'Xưởng Dịch vụ & Sửa chữa',
    position: 'Kỹ thuật viên đồng sơn',
    baseSalary: 9000000,
    actualDays: (std: number) => Math.max(std - 3, 1), // Nghỉ 3 ngày không hưởng lương -> Đi làm 23
    paidLeaveDays: 0,
    unpaidLeaveDays: 3,
    allowances: 1145000, // Ăn trưa 645k theo công + Xăng 500k
    bonus: 800000,
    dependents: 0
  },
  {
    code: 'NV-008',
    name: 'Phan Khánh Tường',
    department: 'Phòng Kế toán',
    position: 'Kế toán tiền lương & Thuế',
    baseSalary: 11500000,
    actualDays: (std: number) => std, // 26
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    allowances: 1730000,
    bonus: 1500000,
    dependents: 0
  }
];

// Hàm khởi tạo danh sách nhân viên chi tiết cho bảng lương dựa trên số lượng NLĐ và ngày công chuẩn của hệ thống
export const generateEmployeesForPayroll = (
  periodName: string, 
  count: number = 8, 
  standardDays: number = 26
): PayrollEmployeeItem[] => {
  const results: PayrollEmployeeItem[] = [];

  // Thêm 8 nhân sự chuẩn có sẵn trong hệ thống
  const baseCount = Math.min(count, SYSTEM_EMPLOYEES_SOURCE.length);
  for (let i = 0; i < baseCount; i++) {
    const src = SYSTEM_EMPLOYEES_SOURCE[i];
    const actualWorkDays = src.actualDays(standardDays);
    const paidLeaveDays = src.paidLeaveDays;
    const totalPaidDays = actualWorkDays + paidLeaveDays;
    const workSalary = Math.round((src.baseSalary / standardDays) * totalPaidDays);
    const grossSalary = workSalary + src.allowances + src.bonus;

    // BHXH 10.5%
    const bhxhBase = Math.min(src.baseSalary, 36000000);
    const socialInsurance = Math.round(bhxhBase * 0.105);

    // Thuế TNCN: Giảm trừ bản thân 11tr + người phụ thuộc 4.4tr/người + tiền ăn trưa miễn thuế 730k
    const exemptLunch = Math.min(src.allowances, 730000);
    const personalDeduction = 11000000;
    const dependentDeduction = src.dependents * 4400000;
    const taxableIncome = Math.max(0, grossSalary - socialInsurance - exemptLunch - personalDeduction - dependentDeduction);
    let personalIncomeTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 5000000) {
        personalIncomeTax = Math.round(taxableIncome * 0.05);
      } else if (taxableIncome <= 10000000) {
        personalIncomeTax = Math.round(250000 + (taxableIncome - 5000000) * 0.1);
      } else {
        personalIncomeTax = Math.round(750000 + (taxableIncome - 10000000) * 0.15);
      }
    }

    const netSalary = grossSalary - socialInsurance - personalIncomeTax;

    results.push({
      id: `emp_payroll_${src.code}`,
      code: src.code,
      name: src.name,
      department: src.department,
      position: src.position,
      baseSalary: src.baseSalary,
      standardWorkDays: standardDays,
      actualWorkDays,
      paidLeaveDays,
      unpaidLeaveDays: src.unpaidLeaveDays,
      totalPaidDays,
      workSalary,
      allowances: src.allowances,
      bonus: src.bonus,
      grossSalary,
      socialInsurance,
      personalIncomeTax,
      netSalary,
      status: 'Chờ chi trả'
    });
  }

  // Nếu số lượng nhân viên của kỳ lớn hơn 8, sinh tiếp nhân viên bổ sung với phòng ban chuẩn hệ thống
  if (count > SYSTEM_EMPLOYEES_SOURCE.length) {
    const extraDepartments = [
      { name: 'Xưởng Dịch vụ & Sửa chữa', positions: ['Kỹ thuật viên bảo dưỡng', 'Thợ máy gầm bậc 3', 'Thợ sơn sấy', 'KTV chẩn đoán điện tử'] },
      { name: 'Kho Phụ tùng & Lốp', positions: ['Nhân viên kho phụ tùng', 'Nhân viên quản lý lốp', 'Nhân viên giao nhận vật tư'] },
      { name: 'Phòng Chăm sóc khách hàng & Tiếp nhận', positions: ['Cố vấn dịch vụ khách hàng', 'Nhân viên tiếp nhận xe', 'Chuyên viên CSKH'] },
      { name: 'Phòng Kế toán', positions: ['Kế toán kho & chi phí', 'Kế toán công nợ', 'Thủ quỹ'] },
      { name: 'Ban Giám đốc', positions: ['Trợ lý giám đốc xưởng', 'Giám sát dịch vụ kỹ thuật'] }
    ];

    const extraNames = [
      'Bùi Tuấn Anh', 'Vũ Quốc Bảo', 'Hoàng Minh Châu', 'Trịnh Đức Dũng', 'Hồ Hải Đăng', 
      'Dương Thái Hà', 'Đỗ Thanh Hải', 'Ngô Quang Huy', 'Mai Quốc Khánh', 'Phan Gia Long',
      'Đoàn Văn Minh', 'Cao Thành Nam', 'Lâm Khắc Phong', 'Lý Hải Quân', 'Tạ Minh Sơn',
      'Chu Anh Tuấn', 'Vương Đình Vinh', 'Trần Thu Trang', 'Lê Kim Yến', 'Nguyễn Thị Mai'
    ];

    for (let i = SYSTEM_EMPLOYEES_SOURCE.length + 1; i <= count; i++) {
      const idx = i - SYSTEM_EMPLOYEES_SOURCE.length - 1;
      const code = `NV-${String(i).padStart(3, '0')}`;
      const fullName = extraNames[idx % extraNames.length];
      const deptObj = extraDepartments[idx % extraDepartments.length];
      const deptName = deptObj.name;
      const posName = deptObj.positions[idx % deptObj.positions.length];

      let baseSalary = 9000000 + (i % 4) * 1000000;
      if (posName.includes('Trợ lý') || posName.includes('Giám sát')) {
        baseSalary = 18000000;
      }

      const actualWorkDays = Math.max(standardDays - (i % 5 === 0 ? 1 : 0), 22);
      const paidLeaveDays = (i % 5 === 0 ? 1 : 0);
      const totalPaidDays = actualWorkDays + paidLeaveDays;
      const workSalary = Math.round((baseSalary / standardDays) * totalPaidDays);
      const allowances = 730000 + 500000 + (i % 3 === 0 ? 500000 : 0);
      const bonus = 1500000 + (i % 4) * 400000;
      const grossSalary = workSalary + allowances + bonus;

      const bhxhBase = Math.min(baseSalary, 36000000);
      const socialInsurance = Math.round(bhxhBase * 0.105);
      const taxableIncome = Math.max(0, grossSalary - socialInsurance - 730000 - 11000000);
      const personalIncomeTax = taxableIncome > 0 ? Math.round(taxableIncome * 0.05) : 0;
      const netSalary = grossSalary - socialInsurance - personalIncomeTax;

      results.push({
        id: `emp_payroll_${code}`,
        code,
        name: fullName,
        department: deptName,
        position: posName,
        baseSalary,
        standardWorkDays: standardDays,
        actualWorkDays,
        paidLeaveDays,
        unpaidLeaveDays: 0,
        totalPaidDays,
        workSalary,
        allowances,
        bonus,
        grossSalary,
        socialInsurance,
        personalIncomeTax,
        netSalary,
        status: 'Chờ chi trả'
      });
    }
  }

  return results;
};

// Khởi tạo 1 record bảng lương phù hợp với 1 kỳ tính lương (Kỳ T10/2025 - Mã: T10_2025 trong menu Kỳ tính lương)
const initialEmployeesForT10 = generateEmployeesForPayroll('T10/2025', 8, 26);
const initialTotalGross = initialEmployeesForT10.reduce((sum, e) => sum + e.grossSalary, 0);
const initialTotalIns = initialEmployeesForT10.reduce((sum, e) => sum + e.socialInsurance, 0);
const initialTotalTax = initialEmployeesForT10.reduce((sum, e) => sum + e.personalIncomeTax, 0);
const initialTotalNet = initialEmployeesForT10.reduce((sum, e) => sum + e.netSalary, 0);

export const INITIAL_PAYROLL_TABLES: PayrollTableRecord[] = [
  {
    id: 'bl_t10_2025',
    code: 'BL_T10_2025',
    name: 'Bảng lương T10/2025',
    periodId: 'pp_1',
    periodCode: 'T10_2025',
    periodName: 'T10/2025',
    totalEmployees: 8,
    standardWorkDays: 26,
    startDate: '01/10/2025',
    endDate: '31/10/2025',
    totalGrossSalary: initialTotalGross,
    totalInsurance: initialTotalIns,
    totalTax: initialTotalTax,
    totalNetSalary: initialTotalNet,
    createdDate: '24/10/2025',
    status: 'Chờ duyệt',
    isLocked: false,
    notes: 'Bảng lương tổng hợp tự động từ Kỳ tính lương T10/2025 khớp với dữ liệu chấm công và hồ sơ hợp đồng NLĐ.',
    employees: initialEmployeesForT10
  }
];

export interface PayrollTableListProps {
  payrollTables?: PayrollTableRecord[];
  setPayrollTables?: React.Dispatch<React.SetStateAction<PayrollTableRecord[]>>;
  payrollPeriods?: PayrollPeriod[];
  onNavigateToPeriod?: () => void;
}

export const PayrollTableList: React.FC<PayrollTableListProps> = ({
  payrollTables: externalPayrollTables,
  setPayrollTables: externalSetPayrollTables,
  payrollPeriods = [],
  onNavigateToPeriod
}) => {
  const [localPayrollTables, setLocalPayrollTables] = useState<PayrollTableRecord[]>(INITIAL_PAYROLL_TABLES);
  const payrollTables = externalPayrollTables || localPayrollTables;
  const setPayrollTables = externalSetPayrollTables || setLocalPayrollTables;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // Modal / Detail state
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<PayrollTableRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailSearchTerm, setDetailSearchTerm] = useState('');
  const [detailDeptFilter, setDetailDeptFilter] = useState('all');

  // Employee Payslip & Actions state
  const [selectedEmployeeForPayslip, setSelectedEmployeeForPayslip] = useState<PayrollEmployeeItem | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  // Email modal state
  const [emailModalEmployee, setEmailModalEmployee] = useState<PayrollEmployeeItem | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Add Modal State (tạo bảng lương thủ công)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTableCode, setNewTableCode] = useState('');
  const [newTableName, setNewTableName] = useState('');
  const [newPeriodCode, setNewPeriodCode] = useState('');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và tab trạng thái
  const filteredTables = payrollTables.filter(t => {
    const matchSearch = t.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      t.periodName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    
    if (!matchSearch) return false;
    if (activeStatusFilter === 'all') return true;
    return t.status === activeStatusFilter;
  });

  const isAllSelected = filteredTables.length > 0 && filteredTables.every(t => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTables.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} bảng lương đã chọn?`)) {
      setPayrollTables(prev => prev.filter(t => !selectedIds.includes(t.id)));
      setSelectedIds([]);
      showToast(`Đã xóa thành công ${selectedIds.length} bảng lương.`);
    }
  };

  const handleDeleteSingle = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
      setPayrollTables(prev => prev.filter(t => t.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
      showToast(`Đã xóa bảng lương "${name}".`);
    }
  };

  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);

  const handleUpdateAttendanceData = () => {
    if (payrollTables.length === 0) {
      showToast("Chưa có bảng lương nào để cập nhật dữ liệu chấm công.");
      return;
    }

    setIsUpdatingAttendance(true);
    setTimeout(() => {
      setPayrollTables(prev => prev.map(table => {
        // Nếu đang chọn cụ thể các bảng lương thì chỉ cập nhật bảng được chọn
        if (selectedIds.length > 0 && !selectedIds.includes(table.id)) {
          return table;
        }
        if (table.isLocked) {
          return table; // Không can thiệp bảng lương đã khóa
        }

        const matchedPeriod = payrollPeriods.find(p => p.id === table.periodId || p.code === table.periodCode);
        const stdDays = matchedPeriod?.standardWorkDays || table.standardWorkDays || 27;
        const empCount = matchedPeriod?.totalEmployees || table.totalEmployees || 48;

        const updatedEmployees = generateEmployeesForPayroll(table.periodName, empCount, stdDays);
        const totalGross = updatedEmployees.reduce((sum, e) => sum + e.grossSalary, 0);
        const totalIns = updatedEmployees.reduce((sum, e) => sum + e.socialInsurance, 0);
        const totalTax = updatedEmployees.reduce((sum, e) => sum + e.personalIncomeTax, 0);
        const totalNet = updatedEmployees.reduce((sum, e) => sum + e.netSalary, 0);

        return {
          ...table,
          standardWorkDays: stdDays,
          totalEmployees: empCount,
          totalGrossSalary: totalGross,
          totalInsurance: totalIns,
          totalTax: totalTax,
          totalNetSalary: totalNet,
          employees: updatedEmployees
        };
      }));

      setIsUpdatingAttendance(false);
      showToast(
        selectedIds.length > 0
          ? `Đã cập nhật dữ liệu chấm công NLĐ cho ${selectedIds.length} bảng lương đã chọn.`
          : `Đã cập nhật dữ liệu chấm công NLĐ mới nhất cho các bảng lương.`
      );
    }, 400);
  };

  const handleToggleLock = (id: string) => {
    setPayrollTables(prev => prev.map(t => {
      if (t.id === id) {
        const nextLock = !t.isLocked;
        showToast(nextLock ? `Đã khóa bảng lương "${t.name}".` : `Đã mở khóa bảng lương "${t.name}".`);
        return {
          ...t,
          isLocked: nextLock,
          status: nextLock ? 'Đã khóa' : t.status === 'Đã khóa' ? 'Chờ duyệt' : t.status
        };
      }
      return t;
    }));
  };

  const handleExportExcel = () => {
    if (payrollTables.length === 0) {
      showToast("Chưa có dữ liệu bảng lương để xuất excel.");
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["STT,Mã bảng lương,Tên bảng lương,Kỳ tính lương,Số NLĐ,Tổng quỹ Gross,Giảm trừ BHXH,Thuế TNCN,Tổng thực lĩnh Net,Ngày tạo,Trạng thái"]
      .concat(payrollTables.map((t, idx) => 
        `${idx + 1},${t.code},${t.name},${t.periodName},${t.totalEmployees},${t.totalGrossSalary},${t.totalInsurance},${t.totalTax},${t.totalNetSalary},${t.createdDate},${t.status}`
      ))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bang_luong_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách bảng lương ra tệp Excel/CSV.");
  };

  const handleOpenDetailModal = (table: PayrollTableRecord) => {
    let currentTable = table;
    // Kiểm tra xem bảng lương đã có dữ liệu nhân viên chuẩn theo hệ thống chưa
    const isOldMock = !table.employees || table.employees.length === 0 || table.employees[0]?.code === 'NV001';
    if (isOldMock) {
      const matchedPeriod = payrollPeriods.find(p => p.id === table.periodId || p.code === table.periodCode);
      const stdDays = matchedPeriod?.standardWorkDays || table.standardWorkDays || 26;
      const empCount = matchedPeriod?.totalEmployees || table.totalEmployees || 8;
      const emps = generateEmployeesForPayroll(table.periodName, empCount, stdDays);
      const totalGross = emps.reduce((sum, e) => sum + e.grossSalary, 0);
      const totalIns = emps.reduce((sum, e) => sum + e.socialInsurance, 0);
      const totalTax = emps.reduce((sum, e) => sum + e.personalIncomeTax, 0);
      const totalNet = emps.reduce((sum, e) => sum + e.netSalary, 0);

      currentTable = {
        ...table,
        standardWorkDays: stdDays,
        totalEmployees: empCount,
        totalGrossSalary: totalGross,
        totalInsurance: totalIns,
        totalTax: totalTax,
        totalNetSalary: totalNet,
        employees: emps
      };

      setPayrollTables(prev => prev.map(t => t.id === table.id ? currentTable : t));
    }
    setSelectedRecordForDetail(currentTable);
    setIsDetailModalOpen(true);
  };

  const handleExportDetailExcel = (table: PayrollTableRecord) => {
    const employees = table.employees || [];
    if (employees.length === 0) {
      showToast("Bảng lương này chưa có danh sách nhân viên.");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + ["STT,Mã NV,Họ và tên,Bộ phận,Chức vụ,Lương cơ bản,Ngày công tháng,Ngày công đi làm thực tế,Tổng công tính lương,Lương cơ bản theo ngày công,Phụ cấp,Thưởng hiệu quả KPI,Tổng thu nhập (Lương Gross),Bảo hiểm trích nộp (10.5%),Thuế thu nhập cá nhân (TNCN),Lương thực lĩnh (Net),Trạng thái chi trả"]
      .concat(employees.map((e, idx) => 
        `${idx + 1},${e.code},"${e.name}","${e.department}","${e.position}",${e.baseSalary},${e.standardWorkDays},${e.actualWorkDays},${e.totalPaidDays ?? e.actualWorkDays},${e.workSalary},${e.allowances},${e.bonus},${e.grossSalary},${e.socialInsurance},${e.personalIncomeTax},${e.netSalary},${e.status}`
      ))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${table.code}_chi_tiet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất bảng chi tiết "${table.name}" ra Excel.`);
  };

  const handleMarkAsPaid = (id: string) => {
    setPayrollTables(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: 'Đã chi trả',
          employees: (t.employees || []).map(emp => ({ ...emp, status: 'Đã chi trả', isApproved: true }))
        };
      }
      return t;
    }));
    if (selectedRecordForDetail && selectedRecordForDetail.id === id) {
      setSelectedRecordForDetail(prev => prev ? { 
        ...prev, 
        status: 'Đã chi trả',
        employees: (prev.employees || []).map(emp => ({ ...emp, status: 'Đã chi trả', isApproved: true }))
      } : null);
    }
    showToast('Đã thay đổi cột "Trạng thái chi trả" thành "Đã chi trả".');
  };

  const handleCancelPaid = (id: string) => {
    setPayrollTables(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: 'Chờ duyệt',
          employees: (t.employees || []).map(emp => ({ ...emp, status: 'Chờ chi trả', isApproved: false }))
        };
      }
      return t;
    }));
    if (selectedRecordForDetail && selectedRecordForDetail.id === id) {
      setSelectedRecordForDetail(prev => prev ? { 
        ...prev, 
        status: 'Chờ duyệt',
        employees: (prev.employees || []).map(emp => ({ ...emp, status: 'Chờ chi trả', isApproved: false }))
      } : null);
    }
    showToast('Đã thay đổi cột "Trạng thái chi trả" thành "Chờ chi trả".');
  };

  // Aliases for compatibility
  const handleApprovePayroll = handleMarkAsPaid;
  const handleCancelApprovePayroll = handleCancelPaid;
  const handlePayPayroll = handleMarkAsPaid;

  // Xử lý chi trả / Hủy chi trả phiếu lương từng nhân sự
  const handleToggleEmployeeApproval = (employeeId: string, approve: boolean) => {
    if (!selectedRecordForDetail) return;
    const targetEmp = (selectedRecordForDetail.employees || []).find(e => e.id === employeeId);
    const empName = targetEmp ? `${targetEmp.name} (${targetEmp.code})` : 'nhân viên';

    const updatedEmployees = (selectedRecordForDetail.employees || []).map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: (approve ? 'Đã chi trả' : 'Chờ chi trả') as 'Đã chi trả' | 'Chờ chi trả',
          isApproved: approve,
          approvalDate: approve ? new Date().toLocaleDateString('vi-VN') : undefined
        };
      }
      return emp;
    });

    const allPaid = updatedEmployees.length > 0 && updatedEmployees.every(e => e.status === 'Đã chi trả');

    const updatedRecord: PayrollTableRecord = {
      ...selectedRecordForDetail,
      status: allPaid ? 'Đã chi trả' : selectedRecordForDetail.status,
      employees: updatedEmployees
    };

    setSelectedRecordForDetail(updatedRecord);
    setPayrollTables(prev => prev.map(t => t.id === updatedRecord.id ? updatedRecord : t));

    if (selectedEmployeeForPayslip && selectedEmployeeForPayslip.id === employeeId) {
      setSelectedEmployeeForPayslip(prev => prev ? {
        ...prev,
        status: (approve ? 'Đã chi trả' : 'Chờ chi trả') as 'Đã chi trả' | 'Chờ chi trả',
        isApproved: approve,
        approvalDate: approve ? new Date().toLocaleDateString('vi-VN') : undefined
      } : null);
    }

    if (approve) {
      showToast(`Đã thay đổi trạng thái chi trả của ${empName} thành "Đã chi trả".`);
    } else {
      showToast(`Đã thay đổi trạng thái chi trả của ${empName} thành "Chờ chi trả".`);
    }
  };

  // Mở modal Xem chi tiết Phiếu lương
  const handleOpenEmployeePayslip = (emp: PayrollEmployeeItem) => {
    setSelectedEmployeeForPayslip(emp);
    setIsPayslipModalOpen(true);
  };

  // Mở modal Gửi Email
  const handleOpenEmailModal = (emp: PayrollEmployeeItem) => {
    setEmailModalEmployee(emp);
    const email = `${emp.code.toLowerCase()}@remixhrm.vn`;
    setEmailRecipient(email);
    setEmailSubject(`[Remix HRM] Phiếu lương tháng ${selectedRecordForDetail?.periodName} - ${emp.name} (${emp.code})`);
    setEmailContent(`Kính gửi Anh/Chị ${emp.name},\n\nPhòng Nhân sự & Kế toán xin gửi thông báo phiếu lương tháng ${selectedRecordForDetail?.periodName}:\n- Mã nhân viên: ${emp.code}\n- Bộ phận: ${emp.department} - ${emp.position}\n- Tổng thu nhập (Gross): ${emp.grossSalary.toLocaleString('vi-VN')} đ\n- Trích nộp bảo hiểm & Thuế: ${(emp.socialInsurance + emp.personalIncomeTax).toLocaleString('vi-VN')} đ\n- Lương thực lĩnh chuyển khoản (Net): ${emp.netSalary.toLocaleString('vi-VN')} đ\n\nVui lòng kiểm tra lại thông tin. Nếu có bất kỳ thắc mắc nào, Anh/Chị vui lòng phản hồi phòng Kế toán trong vòng 3 ngày làm việc.\n\nTrân trọng!`);
    setIsEmailModalOpen(true);
  };

  // Xác nhận gửi email
  const handleSendEmail = () => {
    if (!emailModalEmployee) return;
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setIsEmailModalOpen(false);
      showToast(`Đã gửi email phiếu lương tháng ${selectedRecordForDetail?.periodName} đến ${emailModalEmployee.name} (${emailModalEmployee.code}) thành công!`);
    }, 600);
  };

  // Tải file PDF phiếu lương
  const handleDownloadEmployeePayslipPdf = (emp: PayrollEmployeeItem) => {
    if (!selectedRecordForDetail) return;
    const stdDays = emp.standardWorkDays || selectedRecordForDetail.standardWorkDays || 26;
    const actualDays = emp.actualWorkDays !== undefined ? emp.actualWorkDays : stdDays;
    const totalDays = emp.totalPaidDays !== undefined ? emp.totalPaidDays : (actualDays + (emp.paidLeaveDays || 0));
    const baseCalcSalary = emp.workSalary !== undefined && emp.workSalary > 0 
      ? emp.workSalary 
      : Math.round((emp.baseSalary / stdDays) * totalDays);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Phiếu lương - ${emp.name} (${emp.code}) - ${selectedRecordForDetail.periodName}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1f2937; background: #fff; line-height: 1.5; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company { font-size: 14px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; }
    .title { font-size: 20px; font-weight: 800; color: #111827; margin-top: 6px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; font-size: 13px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .info-item { display: flex; }
    .info-label { width: 150px; color: #64748b; font-weight: 500; }
    .info-value { font-weight: 600; color: #0f172a; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .summary-card { padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
    .summary-card.gross { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    .summary-card.deduct { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
    .summary-card.net { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .summary-title { font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    .summary-amount { font-size: 20px; font-weight: 800; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th { background: #f1f5f9; padding: 10px 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 700; }
    td { padding: 8px 12px; border: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .section-head { background: #e2e8f0; font-weight: 700; }
    .total-row { font-weight: 800; background: #f8fafc; }
    .net-row { font-weight: 800; background: #dcfce7; font-size: 14px; color: #065f46; }
    .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 12px; }
    .signature-box { width: 200px; padding-top: 60px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">Hệ Thống Quản Trị Nhân Sự & Lương Remix HRM</div>
      <div class="title">PHIẾU LƯƠNG CHI TIẾT - KỲ ${selectedRecordForDetail.periodName.toUpperCase()}</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Từ ngày ${selectedRecordForDetail.startDate} đến ngày ${selectedRecordForDetail.endDate}</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div>Mã bảng lương: <strong>${selectedRecordForDetail.code}</strong></div>
      <div style="margin-top: 4px;">Ngày lập: ${new Date().toLocaleDateString('vi-VN')}</div>
      <div style="margin-top: 4px; color: ${emp.isApproved ? '#059669' : '#d97706'}; font-weight: bold;">
        ${emp.isApproved ? '✓ ĐÃ PHÊ DUYỆT' : '⏳ CHỜ PHÊ DUYỆT'}
      </div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-item"><span class="info-label">Mã nhân viên:</span><span class="info-value">${emp.code}</span></div>
    <div class="info-item"><span class="info-label">Bộ phận:</span><span class="info-value">${emp.department}</span></div>
    <div class="info-item"><span class="info-label">Họ và tên:</span><span class="info-value">${emp.name}</span></div>
    <div class="info-item"><span class="info-label">Chức vụ:</span><span class="info-value">${emp.position}</span></div>
    <div class="info-item"><span class="info-label">Công chuẩn tháng:</span><span class="info-value">${stdDays} ngày</span></div>
    <div class="info-item"><span class="info-label">Công thực tế:</span><span class="info-value">${actualDays} ngày</span></div>
  </div>

  <div class="summary-grid">
    <div class="summary-card gross">
      <div class="summary-title">Tổng thu nhập (Gross)</div>
      <div class="summary-amount">${emp.grossSalary.toLocaleString('vi-VN')} đ</div>
    </div>
    <div class="summary-card deduct">
      <div class="summary-title">Tổng giảm trừ</div>
      <div class="summary-amount">-${(emp.socialInsurance + emp.personalIncomeTax).toLocaleString('vi-VN')} đ</div>
    </div>
    <div class="summary-card net">
      <div class="summary-title">Lương thực lĩnh (Net)</div>
      <div class="summary-amount">${emp.netSalary.toLocaleString('vi-VN')} đ</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">STT</th>
        <th>Khoản mục chi tiết</th>
        <th style="width: 130px; text-align: center;">Chỉ số / Tỷ lệ</th>
        <th style="width: 170px;" class="text-right">Số tiền (VNĐ)</th>
        <th>Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      <tr class="section-head">
        <td colspan="5">I. THU NHẬP (LƯƠNG GROSS)</td>
      </tr>
      <tr>
        <td>1</td>
        <td>Lương cơ bản theo hợp đồng</td>
        <td style="text-align: center;">Tháng</td>
        <td class="text-right">${emp.baseSalary.toLocaleString('vi-VN')}</td>
        <td>Mức lương thỏa thuận trong hợp đồng lao động</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Lương tính theo ngày công làm việc</td>
        <td style="text-align: center;">${totalDays}/${stdDays} công</td>
        <td class="text-right">${baseCalcSalary.toLocaleString('vi-VN')}</td>
        <td>(Lương CB / ${stdDays}) × ${totalDays} ngày công</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Phụ cấp ăn trưa, đi lại & chuyên cần</td>
        <td style="text-align: center;">Cố định</td>
        <td class="text-right">${emp.allowances.toLocaleString('vi-VN')}</td>
        <td>Hỗ trợ ăn trưa 730k + xăng xe và phụ cấp chức danh</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Thưởng hiệu quả công việc (KPI)</td>
        <td style="text-align: center;">KPI</td>
        <td class="text-right">${emp.bonus.toLocaleString('vi-VN')}</td>
        <td>Đánh giá kết quả hiệu suất công việc trong kỳ</td>
      </tr>
      <tr class="total-row">
        <td></td>
        <td colspan="2">TỔNG THU NHẬP (LƯƠNG GROSS)</td>
        <td class="text-right" style="color: #1d4ed8;">${emp.grossSalary.toLocaleString('vi-VN')}</td>
        <td></td>
      </tr>

      <tr class="section-head">
        <td colspan="5">II. CÁC KHOẢN GIẢM TRỪ</td>
      </tr>
      <tr>
        <td>1</td>
        <td>Trích nộp BHXH, BHYT, BHTN (NLĐ đóng)</td>
        <td style="text-align: center;">10.5%</td>
        <td class="text-right" style="color: #be123c;">${emp.socialInsurance.toLocaleString('vi-VN')}</td>
        <td>BHXH 8%, BHYT 1.5%, BHTN 1%</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Thuế thu nhập cá nhân (TNCN)</td>
        <td style="text-align: center;">Biểu lũy tiến</td>
        <td class="text-right" style="color: #be123c;">${emp.personalIncomeTax.toLocaleString('vi-VN')}</td>
        <td>Sau khi trừ bản thân 11tr và phụ cấp miễn thuế</td>
      </tr>
      <tr class="total-row">
        <td></td>
        <td colspan="2">TỔNG CÁC KHOẢN GIẢM TRỪ</td>
        <td class="text-right" style="color: #be123c;">-${(emp.socialInsurance + emp.personalIncomeTax).toLocaleString('vi-VN')}</td>
        <td></td>
      </tr>

      <tr class="net-row">
        <td>★</td>
        <td colspan="2">THỰC LĨNH CHUYỂN KHOẢN (NET)</td>
        <td class="text-right">${emp.netSalary.toLocaleString('vi-VN')}</td>
        <td>Số tiền thực nhận vào tài khoản ngân hàng</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>
      <div>Người lập biểu</div>
      <div class="signature-box">(Ký, ghi rõ họ tên)</div>
    </div>
    <div>
      <div>Kế toán trưởng</div>
      <div class="signature-box">(Ký, ghi rõ họ tên)</div>
    </div>
    <div>
      <div>Người lao động xác nhận</div>
      <div class="signature-box">${emp.name}</div>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Phieu_Luong_${emp.code}_${selectedRecordForDetail.periodCode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Đã tải xuống phiếu lương dạng tệp của nhân viên ${emp.name} (${emp.code}).`);
  };

  const handleOpenAddModal = () => {
    const defaultPeriod = payrollPeriods[0] || { code: 'T10_2025', name: 'T10/2025', standardWorkDays: 26, totalEmployees: 8 };
    setNewPeriodCode(defaultPeriod.code);
    setNewTableCode(`BL_${defaultPeriod.code}`);
    setNewTableName(`Bảng lương ${defaultPeriod.name}`);
    setShowDuplicateWarning(false);
    setIsAddModalOpen(true);
  };

  const handleCreateManual = (e?: React.FormEvent, forceConfirm: boolean = false) => {
    if (e) e.preventDefault();
    if (!newTableCode.trim() || !newTableName.trim()) {
      alert('Vui lòng nhập đầy đủ mã và tên bảng lương');
      return;
    }

    // Kiểm tra xem record của kỳ tính lương này đã tồn tại trong danh sách Bảng lương chưa
    const isExisted = payrollTables.some(
      t => t.periodCode === newPeriodCode || 
           (t.periodId && t.periodId === payrollPeriods.find(p => p.code === newPeriodCode)?.id)
    );

    if (isExisted && !forceConfirm && !showDuplicateWarning) {
      setShowDuplicateWarning(true);
      return;
    }

    const matchedPeriod = payrollPeriods.find(p => p.code === newPeriodCode);
    const periodName = matchedPeriod?.name || newPeriodCode;
    const stdDays = matchedPeriod?.standardWorkDays || 26;
    const empCount = matchedPeriod?.totalEmployees || 8;

    const employees = generateEmployeesForPayroll(periodName, empCount, stdDays);
    const totalGross = employees.reduce((sum, e) => sum + e.grossSalary, 0);
    const totalIns = employees.reduce((sum, e) => sum + e.socialInsurance, 0);
    const totalTax = employees.reduce((sum, e) => sum + e.personalIncomeTax, 0);
    const totalNet = employees.reduce((sum, e) => sum + e.netSalary, 0);

    let finalCode = newTableCode.trim();
    if (payrollTables.some(t => t.code === finalCode)) {
      finalCode = `${finalCode}_${Date.now().toString().slice(-4)}`;
    }

    const newRecord: PayrollTableRecord = {
      id: `bl_manual_${Date.now()}`,
      code: finalCode,
      name: newTableName.trim(),
      periodId: matchedPeriod?.id,
      periodCode: newPeriodCode,
      periodName: periodName,
      totalEmployees: empCount,
      standardWorkDays: stdDays,
      startDate: matchedPeriod?.startDate || '01/10/2025',
      endDate: matchedPeriod?.endDate || '31/10/2025',
      totalGrossSalary: totalGross,
      totalInsurance: totalIns,
      totalTax: totalTax,
      totalNetSalary: totalNet,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: 'Chờ duyệt',
      isLocked: false,
      employees
    };

    setPayrollTables(prev => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    setShowDuplicateWarning(false);
    showToast(`Đã tạo mới "${newRecord.name}" thành công.`);
  };

  // Helper render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Chờ duyệt
          </span>
        );
      case 'Đã duyệt':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Đã duyệt
          </span>
        );
      case 'Đã chi trả':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Đã chi trả
          </span>
        );
      case 'Đã khóa':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300">
            Đã khóa
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

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
              onClick={handleOpenAddModal}
              className="bg-[#1877F2] hover:bg-blue-600 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button 
              onClick={() => showToast("Chức năng nhập file excel bảng lương đang sẵn sàng.")}
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
            <button 
              onClick={handleUpdateAttendanceData}
              disabled={isUpdatingAttendance}
              className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ml-1"
              title="Cập nhật dữ liệu công, nghỉ phép và làm thêm của người lao động từ hệ thống chấm công"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${isUpdatingAttendance ? 'animate-spin' : ''}`} />
              <span>Cập nhật dữ liệu chấm công NLĐ</span>
            </button>
          </div>

          {/* Right Toolbar: Search & View modes */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã, tên bảng lương, kỳ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-[13px] w-64 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button 
              className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
              title="Tùy chỉnh cột hiển thị"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar by status */}
        <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Trạng thái:</span>
            {[
              { id: 'all', label: `Tất cả (${payrollTables.length})` },
              { id: 'Chờ duyệt', label: `Chờ duyệt (${payrollTables.filter(t => t.status === 'Chờ duyệt').length})` },
              { id: 'Đã duyệt', label: `Đã duyệt (${payrollTables.filter(t => t.status === 'Đã duyệt').length})` },
              { id: 'Đã chi trả', label: `Đã chi trả (${payrollTables.filter(t => t.status === 'Đã chi trả').length})` },
              { id: 'Đã khóa', label: `Đã khóa (${payrollTables.filter(t => t.status === 'Đã khóa').length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  activeStatusFilter === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-gray-500 text-xs">
            Tổng cộng: <strong className="text-gray-800">{filteredTables.length}</strong> bảng lương
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse text-[13px] text-left">
            <thead className="bg-[#F8FAFC] border-b border-gray-200 sticky top-0 z-10 select-none text-xs">
              <tr>
                <th className="p-3 border-r border-gray-200 w-10 min-w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-12 min-w-12 text-center">
                  #
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px]">
                  Mã bảng lương
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[220px] min-w-[220px]">
                  Tên bảng lương
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[140px] min-w-[140px] text-center">
                  Kỳ tính lương
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[120px] min-w-[120px] text-center">
                  Số NLĐ
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[170px] min-w-[170px] text-right">
                  Tổng quỹ Gross
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] min-w-[160px] text-right">
                  BHXH & Thuế
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[170px] min-w-[170px] text-right">
                  Tổng thực lĩnh (Net)
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[130px] min-w-[130px] text-center">
                  Ngày tạo
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[130px] min-w-[130px] text-center">
                  Trạng thái
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[140px] min-w-[140px] text-center">
                  Hành động
                </th>
                <th className="p-3 border-gray-200 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 shadow-2xs">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div className="text-base font-bold text-gray-700">Chưa có bản ghi Bảng lương nào</div>
                      <p className="text-xs text-gray-500 max-w-md">
                        Bạn có thể nhấn nút <strong>"+ Thêm"</strong> phía trên hoặc vào menu <strong>"Kỳ tính Lương"</strong> và bấm <strong>"Tạo bảng lương"</strong> để khởi tạo tự động.
                      </p>
                      {onNavigateToPeriod && (
                        <button
                          type="button"
                          onClick={onNavigateToPeriod}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                        >
                          <span>Đi đến menu Kỳ tính Lương</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTables.map((table, index) => (
                  <tr 
                    key={table.id}
                    className="border-b border-gray-200 hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(table.id)}
                        onChange={() => toggleSelect(table.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>

                    {/* # (STT) */}
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600 font-medium">
                      {index + 1}
                    </td>

                    {/* Mã bảng lương */}
                    <td className="p-3 border-r border-gray-200 font-bold text-blue-700">
                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(table)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {table.code}
                      </button>
                    </td>

                    {/* Tên bảng lương */}
                    <td className="p-3 border-r border-gray-200 text-gray-900 font-medium">
                      {table.name}
                    </td>

                    {/* Kỳ tính lương */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {table.periodName}
                      </span>
                    </td>

                    {/* Số NLĐ */}
                    <td className="p-3 border-r border-gray-200 text-center font-bold text-gray-800">
                      {table.totalEmployees}
                    </td>

                    {/* Tổng quỹ Gross */}
                    <td className="p-3 border-r border-gray-200 text-right font-semibold text-gray-900">
                      {table.totalGrossSalary.toLocaleString('vi-VN')} đ
                    </td>

                    {/* BHXH & Thuế */}
                    <td className="p-3 border-r border-gray-200 text-right font-medium text-amber-700">
                      {(table.totalInsurance + table.totalTax).toLocaleString('vi-VN')} đ
                    </td>

                    {/* Tổng thực lĩnh Net */}
                    <td className="p-3 border-r border-gray-200 text-right font-bold text-emerald-700">
                      {table.totalNetSalary.toLocaleString('vi-VN')} đ
                    </td>

                    {/* Ngày tạo */}
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600 text-xs">
                      {table.createdDate}
                    </td>

                    {/* Trạng thái */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      {renderStatusBadge(table.status)}
                    </td>

                    {/* Hành động */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Xem chi tiết */}
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(table)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Xem chi tiết bảng lương"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Lock / Unlock */}
                        <button
                          type="button"
                          onClick={() => handleToggleLock(table.id)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            table.isLocked 
                              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
                              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                          title={table.isLocked ? "Mở khóa bảng lương" : "Khóa bảng lương"}
                        >
                          {table.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Xuất Excel chi tiết */}
                        <button
                          type="button"
                          onClick={() => handleExportDetailExcel(table)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Xuất Excel chi tiết bảng lương"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Xóa */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(table.id, table.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Xóa bảng lương"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3 border-gray-200"></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tạo bảng lương mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Thêm mới Bảng lương
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Kỳ tính lương liên kết <span className="text-red-500">*</span>
                </label>
                <select
                  value={newPeriodCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setNewPeriodCode(code);
                    const p = payrollPeriods.find(item => item.code === code);
                    setNewTableCode(`BL_${code}`);
                    setNewTableName(`Bảng lương ${p?.name || code}`);
                    setShowDuplicateWarning(false);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  {payrollPeriods.length === 0 ? (
                    <option value="T10_2025">T10/2025 (Mặc định)</option>
                  ) : (
                    payrollPeriods.map(p => (
                      <option key={p.id} value={p.code}>
                        {p.name} ({p.code}) - {p.standardWorkDays} ngày công
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mã bảng lương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTableCode}
                  onChange={(e) => {
                    setNewTableCode(e.target.value);
                    setShowDuplicateWarning(false);
                  }}
                  placeholder="VD: BL_T10_2025"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tên bảng lương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="VD: Bảng lương T10/2025"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Nhắc nhở cảnh báo nếu kỳ tính lương đã tồn tại */}
              {showDuplicateWarning && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-md flex items-start gap-2.5 text-amber-900 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-xs text-amber-800">Thông báo</div>
                    <p className="text-xs text-amber-800 mt-0.5 leading-normal">
                      Kỳ tính lương này đã tồn tại, bạn vẫn muốn tiếp tục tạo mới?
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-800 text-[11px] leading-relaxed">
                Hệ thống sẽ tự động tổng hợp dữ liệu ngày công, lương cơ bản, các khoản phụ cấp và trích nộp bảo hiểm theo quy định từ hồ sơ hợp đồng.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setShowDuplicateWarning(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium cursor-pointer"
                >
                  Hủy
                </button>
                {showDuplicateWarning ? (
                  <button
                    type="button"
                    onClick={() => handleCreateManual(undefined, true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Xác nhận tạo mới
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors cursor-pointer shadow-2xs"
                  >
                    Tạo bảng lương
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-screen Detail Modal: Xem & Duyệt bảng lương chi tiết */}
      {isDetailModalOpen && selectedRecordForDetail && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-2xs flex flex-col justify-between">
          <div className="bg-white flex flex-col h-full overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-gray-900">
                      {selectedRecordForDetail.name} ({selectedRecordForDetail.code})
                    </h2>
                    {renderStatusBadge(selectedRecordForDetail.status)}
                    {selectedRecordForDetail.isLocked && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-300 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Đã khóa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kỳ: <strong className="text-blue-700">{selectedRecordForDetail.periodName}</strong> | Chuẩn: <strong className="text-emerald-700">{selectedRecordForDetail.standardWorkDays}</strong> ngày công | Từ {selectedRecordForDetail.startDate} đến {selectedRecordForDetail.endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedRecordForDetail.status !== 'Đã chi trả' ? (
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(selectedRecordForDetail.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã chi trả</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCancelPaid(selectedRecordForDetail.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Hủy Đã chi trả</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleExportDetailExcel(selectedRecordForDetail)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Xuất Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* KPI Cards Header */}
            <div className="grid grid-cols-5 gap-3.5 px-6 py-3.5 bg-gray-50 border-b border-gray-200 shrink-0">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Tổng nhân sự</span>
                <span className="text-xl font-extrabold text-gray-900 mt-1 block">
                  {selectedRecordForDetail.totalEmployees} <span className="text-xs font-normal text-gray-500">người</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs bg-blue-50/20">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Tổng quỹ Gross</span>
                <span className="text-xl font-extrabold text-blue-700 mt-1 block">
                  {selectedRecordForDetail.totalGrossSalary.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-blue-500">đ</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs bg-amber-50/20">
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Trích nộp BHXH (NLĐ)</span>
                <span className="text-xl font-extrabold text-amber-700 mt-1 block">
                  {selectedRecordForDetail.totalInsurance.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-amber-500">đ</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-purple-200 shadow-2xs bg-purple-50/20">
                <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">Thuế TNCN</span>
                <span className="text-xl font-extrabold text-purple-700 mt-1 block">
                  {selectedRecordForDetail.totalTax.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-purple-500">đ</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs bg-emerald-50/30">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Tổng thực lĩnh (Net)</span>
                <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
                  {selectedRecordForDetail.totalNetSalary.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-emerald-500">đ</span>
                </span>
              </div>
            </div>

            {/* Filter toolbar inside detail */}
            <div className="px-6 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm theo mã NV, họ và tên..."
                    value={detailSearchTerm}
                    onChange={(e) => setDetailSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs w-64 focus:outline-none focus:border-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Bộ phận:</span>
                  <select
                    value={detailDeptFilter}
                    onChange={(e) => setDetailDeptFilter(e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Tất cả bộ phận</option>
                    <option value="Xưởng Dịch vụ & Sửa chữa">Xưởng Dịch vụ & Sửa chữa</option>
                    <option value="Phòng Kế toán">Phòng Kế toán</option>
                    <option value="Kho Phụ tùng & Lốp">Kho Phụ tùng & Lốp</option>
                    <option value="Phòng Chăm sóc khách hàng & Tiếp nhận">Phòng Chăm sóc khách hàng & Tiếp nhận</option>
                    <option value="Ban Giám đốc">Ban Giám đốc</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Đang hiển thị: <strong className="text-gray-800">
                  {(selectedRecordForDetail.employees || []).filter(emp => {
                    const match = emp.name.toLowerCase().includes(detailSearchTerm.toLowerCase().trim()) ||
                      emp.code.toLowerCase().includes(detailSearchTerm.toLowerCase().trim());
                    if (!match) return false;
                    if (detailDeptFilter === 'all') return true;
                    return emp.department === detailDeptFilter;
                  }).length}
                </strong> / {selectedRecordForDetail.totalEmployees} nhân sự
              </div>
            </div>

            {/* Employee Breakdown Table */}
            <div className="flex-1 overflow-auto bg-white">
              {(() => {
                const displayedEmployees = (selectedRecordForDetail.employees || []).filter(emp => {
                  const match = emp.name.toLowerCase().includes(detailSearchTerm.toLowerCase().trim()) ||
                    emp.code.toLowerCase().includes(detailSearchTerm.toLowerCase().trim());
                  if (!match) return false;
                  if (detailDeptFilter === 'all') return true;
                  return emp.department === detailDeptFilter;
                });

                return (
                  <table className="w-full border-collapse text-xs text-left min-w-[2100px]">
                    <thead className="bg-[#F8FAFC] border-b border-gray-200 sticky top-0 z-10 select-none text-[11px]">
                      <tr>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-12 min-w-12">STT</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-[150px] min-w-[150px]">Hành động</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-28 min-w-28">Trạng thái chi trả</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-24 min-w-24">Mã NV</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 w-48 min-w-48">Họ và tên</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 w-48 min-w-48">Bộ phận</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 w-44 min-w-44">Chức vụ</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-right w-32 min-w-32">Lương cơ bản</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-28 min-w-28 bg-gray-50/70">Ngày công tháng</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-center w-32 min-w-32 bg-blue-50/30">Ngày công đi làm thực tế</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-blue-900 text-center w-32 min-w-32 bg-blue-50/60">Tổng công tính lương</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-right w-36 min-w-36">Lương cơ bản theo ngày công</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-gray-700 text-right w-32 min-w-32">Phụ cấp</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-blue-800 text-right w-32 min-w-32">Thưởng hiệu quả KPI</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-blue-950 text-right w-36 min-w-36 bg-blue-50/40">Tổng thu nhập (Lương Gross)</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-amber-800 text-right w-32 min-w-32">Bảo hiểm trích nộp (10.5%)</th>
                        <th className="p-2.5 border-r border-gray-200 font-semibold text-purple-800 text-right w-32 min-w-32">Thuế thu nhập cá nhân (TNCN)</th>
                        <th className="p-2.5 border-gray-200 font-semibold text-emerald-800 text-right w-36 min-w-36 bg-emerald-50/40">Lương thực lĩnh (Net)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={18} className="p-8 text-center text-gray-500 italic">
                            Không tìm thấy nhân viên phù hợp với bộ lọc.
                          </td>
                        </tr>
                      ) : (
                        displayedEmployees.map((emp, idx) => {
                          const stdDays = emp.standardWorkDays || selectedRecordForDetail.standardWorkDays || 26;
                          const actualDays = emp.actualWorkDays !== undefined ? emp.actualWorkDays : stdDays;
                          const totalDays = emp.totalPaidDays !== undefined ? emp.totalPaidDays : (actualDays + (emp.paidLeaveDays || 0));
                          const baseCalcSalary = emp.workSalary !== undefined && emp.workSalary > 0 
                            ? emp.workSalary 
                            : Math.round((emp.baseSalary / stdDays) * totalDays);

                          return (
                            <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
                              {/* STT */}
                              <td className="p-2.5 border-r border-gray-200 text-center text-gray-500 font-medium">
                                {idx + 1}
                              </td>

                              {/* Cột Hành động trước cột Mã NV */}
                              <td className="p-2.5 border-r border-gray-200 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {/* 1. Xem chi tiết Phiếu lương */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEmployeePayslip(emp)}
                                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="Xem chi tiết Phiếu lương"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* 2. Gửi Email */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEmailModal(emp)}
                                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                    title="Gửi Email"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>

                                  {/* 3. Tải PDF */}
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadEmployeePayslipPdf(emp)}
                                    className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                    title="Tải PDF"
                                  >
                                    <FileDown className="w-4 h-4" />
                                  </button>

                                  {/* 4. Đã chi trả / Hủy Đã chi trả */}
                                  {emp.status === 'Đã chi trả' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleEmployeeApproval(emp.id, false)}
                                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                      title="Hủy Đã chi trả"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleEmployeeApproval(emp.id, true)}
                                      className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                      title="Đã chi trả"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Trạng thái chi trả (đưa ra sau cột Hành động) */}
                              <td className="p-2.5 border-r border-gray-200 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                  emp.status === 'Đã chi trả' 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  {emp.status}
                                </span>
                              </td>

                              {/* Mã NV */}
                              <td className="p-2.5 border-r border-gray-200 font-bold text-blue-700 text-center">
                                {emp.code}
                              </td>

                              {/* Họ và tên */}
                              <td className="p-2.5 border-r border-gray-200 font-bold text-gray-900">
                                {emp.name}
                              </td>

                              {/* Bộ phận */}
                              <td className="p-2.5 border-r border-gray-200 text-gray-700">
                                {emp.department}
                              </td>

                              {/* Chức vụ */}
                              <td className="p-2.5 border-r border-gray-200 text-gray-600 text-[11px]">
                                {emp.position}
                              </td>

                              {/* Lương cơ bản */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-medium text-gray-800">
                                {emp.baseSalary.toLocaleString('vi-VN')}
                              </td>

                              {/* Ngày công tháng */}
                              <td className="p-2.5 border-r border-gray-200 text-center font-medium text-gray-700 bg-gray-50/40">
                                {stdDays}
                              </td>

                              {/* Ngày công đi làm thực tế */}
                              <td className="p-2.5 border-r border-gray-200 text-center font-medium text-gray-800 bg-blue-50/20">
                                {actualDays}
                              </td>

                              {/* Tổng công tính lương */}
                              <td className="p-2.5 border-r border-gray-200 text-center font-bold text-blue-800 bg-blue-50/40">
                                {totalDays}
                              </td>

                              {/* Lương cơ bản theo ngày công */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-medium text-gray-800">
                                {baseCalcSalary.toLocaleString('vi-VN')}
                              </td>

                              {/* Phụ cấp */}
                              <td className="p-2.5 border-r border-gray-200 text-right text-gray-700 font-medium">
                                {emp.allowances.toLocaleString('vi-VN')}
                              </td>

                              {/* Thưởng hiệu quả KPI */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-medium text-blue-700">
                                {emp.bonus.toLocaleString('vi-VN')}
                              </td>

                              {/* Tổng thu nhập (Lương Gross) */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-bold text-blue-900 bg-blue-50/30">
                                {emp.grossSalary.toLocaleString('vi-VN')}
                              </td>

                              {/* Bảo hiểm trích nộp (10.5%) */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-medium text-amber-700">
                                {emp.socialInsurance.toLocaleString('vi-VN')}
                              </td>

                              {/* Thuế thu nhập cá nhân (TNCN) */}
                              <td className="p-2.5 border-r border-gray-200 text-right font-medium text-purple-700">
                                {emp.personalIncomeTax.toLocaleString('vi-VN')}
                              </td>

                              {/* Lương thực lĩnh (Net) */}
                              <td className="p-2.5 border-gray-200 text-right font-extrabold text-emerald-700 bg-emerald-50/30">
                                {emp.netSalary.toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>

                    {/* Summary Footer */}
                    {displayedEmployees.length > 0 && (
                      <tfoot className="bg-gray-50/90 border-t-2 border-gray-300 font-bold sticky bottom-0 text-xs">
                        <tr>
                          <td colSpan={7} className="p-2.5 border-r border-gray-200 text-center text-gray-800 uppercase tracking-wider">
                            Tổng cộng ({displayedEmployees.length} nhân sự)
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-gray-900">
                            {displayedEmployees.reduce((s, e) => s + (e.baseSalary || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-center text-gray-500">-</td>
                          <td className="p-2.5 border-r border-gray-200 text-center text-gray-500">-</td>
                          <td className="p-2.5 border-r border-gray-200 text-center text-blue-900 bg-blue-50/40">
                            {displayedEmployees.reduce((s, e) => s + (e.totalPaidDays ?? e.actualWorkDays ?? 0), 0)}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-gray-900">
                            {displayedEmployees.reduce((s, e) => {
                              const std = e.standardWorkDays || selectedRecordForDetail.standardWorkDays || 26;
                              const total = e.totalPaidDays !== undefined ? e.totalPaidDays : (e.actualWorkDays + (e.paidLeaveDays || 0));
                              const val = e.workSalary && e.workSalary > 0 ? e.workSalary : Math.round((e.baseSalary / std) * total);
                              return s + val;
                            }, 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-gray-900">
                            {displayedEmployees.reduce((s, e) => s + (e.allowances || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-blue-700">
                            {displayedEmployees.reduce((s, e) => s + (e.bonus || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-blue-900 bg-blue-50/40 font-extrabold">
                            {displayedEmployees.reduce((s, e) => s + (e.grossSalary || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-amber-700">
                            {displayedEmployees.reduce((s, e) => s + (e.socialInsurance || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-r border-gray-200 text-right text-purple-700">
                            {displayedEmployees.reduce((s, e) => s + (e.personalIncomeTax || 0), 0).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-2.5 border-gray-200 text-right text-emerald-700 bg-emerald-50/40 font-extrabold">
                            {displayedEmployees.reduce((s, e) => s + (e.netSalary || 0), 0).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 shadow-lg text-xs">
              <div className="text-gray-500">
                Lưu ý: Mọi điều chỉnh tại bảng lương sẽ được cập nhật đồng bộ vào phiếu lương của người lao động.
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded bg-gray-800 hover:bg-gray-900 text-white font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết Phiếu lương - Full màn hình */}
      {isPayslipModalOpen && selectedEmployeeForPayslip && selectedRecordForDetail && (() => {
        const employees = selectedRecordForDetail.employees || [];
        const currentEmp = employees.find(e => e.id === selectedEmployeeForPayslip.id) || selectedEmployeeForPayslip;
        const currentIndex = employees.findIndex(e => e.id === currentEmp.id);

        return (
          <div className="fixed inset-0 z-[120] bg-white flex flex-col h-screen w-screen overflow-hidden animate-fadeIn">
            {/* Payslip Fullscreen Header */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">
                      Phiếu lương chi tiết: <span className="text-blue-700">{currentEmp.name}</span> ({currentEmp.code})
                    </h3>
                    {currentEmp.status === 'Đã chi trả' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3.5 h-3.5" /> Đã chi trả
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" /> Chờ chi trả
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kỳ tính lương: <strong className="text-blue-700">{selectedRecordForDetail.periodName}</strong> | {currentEmp.department} - {currentEmp.position}
                  </p>
                </div>
              </div>

              {/* Chuyển qua các records khác thông qua field "Họ và tên" dạng list */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 shadow-2xs">
                <label className="text-xs font-bold text-gray-700 whitespace-nowrap flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Họ và tên:
                </label>
                <select
                  value={currentEmp.id}
                  onChange={(e) => {
                    const found = employees.find(emp => emp.id === e.target.value);
                    if (found) setSelectedEmployeeForPayslip(found);
                  }}
                  className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[240px]"
                >
                  {employees.map((emp, idx) => (
                    <option key={emp.id} value={emp.id}>
                      {idx + 1}. {emp.name} ({emp.code}) - {emp.department}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
                  <button
                    type="button"
                    disabled={currentIndex <= 0}
                    onClick={() => {
                      if (currentIndex > 0) {
                        setSelectedEmployeeForPayslip(employees[currentIndex - 1]);
                      }
                    }}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-700 transition-colors"
                    title="Xem nhân viên trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-semibold text-gray-600 px-1 whitespace-nowrap">
                    {currentIndex + 1} / {employees.length}
                  </span>
                  <button
                    type="button"
                    disabled={currentIndex >= employees.length - 1}
                    onClick={() => {
                      if (currentIndex < employees.length - 1) {
                        setSelectedEmployeeForPayslip(employees[currentIndex + 1]);
                      }
                    }}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-700 transition-colors"
                    title="Xem nhân viên tiếp theo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Actions in Payslip Modal Header */}
                <button
                  type="button"
                  onClick={() => handleOpenEmailModal(currentEmp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs"
                  title="Gửi Email phiếu lương"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gửi Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadEmployeePayslipPdf(currentEmp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs"
                  title="Tải PDF phiếu lương"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tải PDF</span>
                </button>

                {/* Toggle Đã chi trả / Hủy Đã chi trả in Payslip Modal */}
                {currentEmp.status === 'Đã chi trả' ? (
                  <button
                    type="button"
                    onClick={() => handleToggleEmployeeApproval(currentEmp.id, false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer shadow-2xs"
                    title="Hủy Đã chi trả phiếu lương"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hủy Đã chi trả</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleEmployeeApproval(currentEmp.id, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    title="Đã chi trả phiếu lương"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã chi trả</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsPayslipModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payslip Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8FAFC]">
              <div className="max-w-6xl mx-auto space-y-5">
                {/* Company & Employee Identity Banner */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                    <div>
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Hệ Thống Quản Trị Nhân Sự & Tiền Lương</div>
                      <h2 className="text-lg font-black text-gray-900 mt-0.5">PHIẾU LƯƠNG NHÂN VIÊN - {selectedRecordForDetail.periodName.toUpperCase()}</h2>
                      <div className="text-xs text-gray-500">Kỳ thanh toán: {selectedRecordForDetail.startDate} - {selectedRecordForDetail.endDate}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Bảng lương nguồn</span>
                      <span className="font-bold text-sm text-gray-800">{selectedRecordForDetail.name} ({selectedRecordForDetail.code})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[11px]">Mã nhân viên</span>
                      <span className="font-bold text-blue-700 text-sm">{currentEmp.code}</span>
                    </div>
                    {/* Field Họ và tên trong Phiếu Lương hiển thị dạng read-only */}
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[11px]">Họ và tên</span>
                      <span className="font-bold text-gray-900 text-sm">{currentEmp.name}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[11px]">Bộ phận</span>
                      <span className="font-semibold text-gray-800">{currentEmp.department}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[11px]">Chức danh / Vị trí</span>
                      <span className="font-semibold text-gray-800">{currentEmp.position}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Main Stat Cards: Gross - Deductions - Net */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs bg-blue-50/20">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Tổng thu nhập (Gross)</span>
                    <div className="text-2xl font-black text-blue-800 mt-1">
                      {currentEmp.grossSalary.toLocaleString('vi-VN')} <span className="text-sm font-semibold">đ</span>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 block">Bao gồm lương công, phụ cấp & thưởng KPI</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs bg-rose-50/20">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Tổng các khoản giảm trừ</span>
                    <div className="text-2xl font-black text-rose-700 mt-1">
                      -{(currentEmp.socialInsurance + currentEmp.personalIncomeTax).toLocaleString('vi-VN')} <span className="text-sm font-semibold">đ</span>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 block">BHXH 10.5% + Thuế TNCN khấu trừ</span>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-xl text-white shadow-md">
                    <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider block">Thực lĩnh chuyển khoản (Net)</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {currentEmp.netSalary.toLocaleString('vi-VN')} <span className="text-sm font-semibold">đ</span>
                    </div>
                    <span className="text-[11px] text-emerald-100/90 mt-1 block">Số tiền thực tế chi trả vào tài khoản ngân hàng</span>
                  </div>
                </div>

                {/* Detailed Breakdown Tables */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 font-bold text-xs text-gray-800 flex items-center justify-between">
                    <span>CHI TIẾT CÁC KHOẢN MỤC THU NHẬP VÀ KHẤU TRỪ</span>
                    <span className="text-gray-500 font-normal">Đơn vị: VNĐ</span>
                  </div>

                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-[11px]">
                        <th className="py-2.5 px-4 font-semibold w-12 text-center">STT</th>
                        <th className="py-2.5 px-4 font-semibold">Khoản mục</th>
                        <th className="py-2.5 px-4 font-semibold w-36 text-center">Thông số / Công thức</th>
                        <th className="py-2.5 px-4 font-semibold w-44 text-right">Số tiền</th>
                        <th className="py-2.5 px-4 font-semibold">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Section I: Thu nhập */}
                      <tr className="bg-blue-50/40 border-b border-blue-100 font-bold text-blue-900">
                        <td className="py-2 px-4 text-center">I</td>
                        <td colSpan={4} className="py-2 px-4 uppercase text-[11px]">CÁC KHOẢN THU NHẬP (LƯƠNG GROSS)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">1</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Lương cơ bản theo hợp đồng</td>
                        <td className="py-2 px-4 text-center text-gray-600">Tháng</td>
                        <td className="py-2 px-4 text-right font-semibold text-gray-800">
                          {currentEmp.baseSalary.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">Mức lương thỏa thuận ký kết trong hợp đồng lao động</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">2</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Lương tính theo ngày công thực tế</td>
                        <td className="py-2 px-4 text-center text-gray-600">
                          {currentEmp.totalPaidDays ?? currentEmp.actualWorkDays} / {currentEmp.standardWorkDays} ngày
                        </td>
                        <td className="py-2 px-4 text-right font-semibold text-blue-700">
                          {((currentEmp.workSalary && currentEmp.workSalary > 0)
                            ? currentEmp.workSalary
                            : Math.round((currentEmp.baseSalary / (currentEmp.standardWorkDays || 26)) * (currentEmp.totalPaidDays ?? currentEmp.actualWorkDays))
                          ).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">
                          {currentEmp.actualWorkDays} công đi làm {currentEmp.paidLeaveDays ? `+ ${currentEmp.paidLeaveDays} công nghỉ hưởng lương` : ''}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">3</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Các khoản phụ cấp (Ăn trưa, xăng xe, trách nhiệm...)</td>
                        <td className="py-2 px-4 text-center text-gray-600">Định mức</td>
                        <td className="py-2 px-4 text-right font-semibold text-gray-800">
                          {currentEmp.allowances.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">Phụ cấp ăn trưa 730k (miễn thuế) + xăng xe và chuyên cần</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">4</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Thưởng hiệu quả công việc (KPI)</td>
                        <td className="py-2 px-4 text-center text-gray-600">Đánh giá tháng</td>
                        <td className="py-2 px-4 text-right font-semibold text-emerald-700">
                          {currentEmp.bonus.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">Thưởng đạt chỉ tiêu năng suất và doanh số xưởng</td>
                      </tr>
                      <tr className="bg-blue-50/20 border-b border-gray-200 font-bold">
                        <td></td>
                        <td className="py-2.5 px-4 text-blue-900">TỔNG THU NHẬP (LƯƠNG GROSS)</td>
                        <td></td>
                        <td className="py-2.5 px-4 text-right text-blue-900 font-extrabold">
                          {currentEmp.grossSalary.toLocaleString('vi-VN')}
                        </td>
                        <td></td>
                      </tr>

                      {/* Section II: Giảm trừ */}
                      <tr className="bg-rose-50/40 border-b border-rose-100 font-bold text-rose-900">
                        <td className="py-2 px-4 text-center">II</td>
                        <td colSpan={4} className="py-2 px-4 uppercase text-[11px]">CÁC KHOẢN GIẢM TRỪ VÀO LƯƠNG</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">1</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Bảo hiểm xã hội, y tế, thất nghiệp (NLĐ đóng)</td>
                        <td className="py-2 px-4 text-center text-gray-600">10.5% lương BHXH</td>
                        <td className="py-2 px-4 text-right font-semibold text-rose-600">
                          -{currentEmp.socialInsurance.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">BHXH 8%, BHYT 1.5%, BHTN 1%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-4 text-center text-gray-400">2</td>
                        <td className="py-2 px-4 font-medium text-gray-800">Thuế thu nhập cá nhân (TNCN) khấu trừ</td>
                        <td className="py-2 px-4 text-center text-gray-600">Biểu lũy tiến từng phần</td>
                        <td className="py-2 px-4 text-right font-semibold text-rose-600">
                          -{currentEmp.personalIncomeTax.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2 px-4 text-gray-500">Giảm trừ gia cảnh bản thân 11.000.000 đ</td>
                      </tr>
                      <tr className="bg-rose-50/20 border-b border-gray-200 font-bold">
                        <td></td>
                        <td className="py-2.5 px-4 text-rose-900">TỔNG CÁC KHOẢN GIẢM TRỪ</td>
                        <td></td>
                        <td className="py-2.5 px-4 text-right text-rose-700 font-extrabold">
                          -{(currentEmp.socialInsurance + currentEmp.personalIncomeTax).toLocaleString('vi-VN')}
                        </td>
                        <td></td>
                      </tr>

                      {/* Section III: Thực lĩnh */}
                      <tr className="bg-emerald-50/60 border-t-2 border-emerald-400 font-black text-sm">
                        <td className="py-3 px-4 text-center text-emerald-800">★</td>
                        <td className="py-3 px-4 text-emerald-950 uppercase">LƯƠNG THỰC LĨNH CHUYỂN KHOẢN (NET)</td>
                        <td className="py-3 px-4 text-center text-xs font-semibold text-emerald-700">Gross − Giảm trừ</td>
                        <td className="py-3 px-4 text-right text-emerald-700 text-base font-extrabold">
                          {currentEmp.netSalary.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-4 text-xs font-normal text-emerald-900">
                          Chi trả qua tài khoản ngân hàng của người lao động
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payslip Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 text-xs shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-gray-500 flex items-center gap-2">
                  <span>Trạng thái chi trả:</span>
                  {currentEmp.status === 'Đã chi trả' ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã chi trả
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Chờ chi trả
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex <= 0}
                  onClick={() => {
                    if (currentIndex > 0) {
                      setSelectedEmployeeForPayslip(employees[currentIndex - 1]);
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>NV trước</span>
                </button>
                <button
                  type="button"
                  disabled={currentIndex >= employees.length - 1}
                  onClick={() => {
                    if (currentIndex < employees.length - 1) {
                      setSelectedEmployeeForPayslip(employees[currentIndex + 1]);
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>NV tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadEmployeePayslipPdf(currentEmp)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  Tải tệp phiếu lương
                </button>
                <button
                  type="button"
                  onClick={() => setIsPayslipModalOpen(false)}
                  className="px-5 py-1.5 rounded bg-gray-800 hover:bg-gray-900 text-white font-semibold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Gửi Email Phiếu Lương */}
      {isEmailModalOpen && emailModalEmployee && selectedRecordForDetail && (
        <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn border border-gray-200">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                Gửi Email Phiếu Lương
              </h3>
              <button 
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Người nhận (Email nhân sự)</label>
                <input
                  type="text"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tiêu đề thư</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nội dung thông báo</label>
                <textarea
                  rows={6}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full border border-gray-300 rounded p-3 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed flex items-center gap-2">
                <FileDown className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Hệ thống sẽ tự động đính kèm tệp PDF phiếu lương điện tử chi tiết có chữ ký số của gara.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  {isSendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Email ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
