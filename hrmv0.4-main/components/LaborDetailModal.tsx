import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Calendar, Download, AlertTriangle, Search, ChevronDown, ChevronUp, Eye, EyeOff, Check, FileText, Briefcase, DollarSign, ShieldCheck, Plus, Trash2, Clock, Info, AlertCircle, CreditCard, PhoneCall, ShieldAlert, Upload, Banknote, Paperclip, UserCheck, Printer, Calculator, Sparkles } from 'lucide-react';
import { MOCK_EMPLOYEES } from './EmployeeList';
import { MOCK_CONTRACT_TYPES } from './ContractTypeList';
import { MOCK_GRADES } from './SalaryGradeList';
import { SkillQualificationRow } from './EmployeeDetailModal';
import { INITIAL_STRUCTURES } from './SalaryStructureList';

export interface BankAccountRow {
  id: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  branch: string;
  isDefault: boolean;
  notes: string;
  fileName?: string;
}

export interface CashRecipientRow {
  id: string;
  idCard: string;
  fullName: string;
  pickupLocation: string;
  isDefault: boolean;
  notes: string;
  fileName?: string;
}

export interface FamilyRelativeRow {
  id: string;
  fullName: string;
  relationship: string;
  idCard: string;
  dob: string;
  isDependent: boolean;
  isEmergencyContact: boolean;
  phone: string;
  email: string;
  notes: string;
  fileName?: string;
}

export interface EmergencyContact {
  hasContact: boolean;
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const POPULAR_BANKS = [
  'Vietcombank (VCB)',
  'VietinBank (CTG)',
  'BIDV',
  'Agribank (VBA)',
  'MB Bank (Quân đội)',
  'Techcombank (TCB)',
  'VPBank (VPB)',
  'ACB (Á Châu)',
  'TPBank (Tiên Phong)',
  'Sacombank (STB)',
  'HDBank',
  'VIB (Quốc tế)',
  'SHB (Sài Gòn - Hà Nội)',
  'MSB (Hàng Hải)',
  'OCB (Phương Đông)',
  'SeABank',
  'LPBank (Bưu điện Liên Việt)',
  'Eximbank (EIB)'
];

export interface Laborer {
  id?: string;
  code?: string;
  employeeCode?: string;
  timekeepingCode?: string;
  status?: string;
  contractTargetType?: string;
  name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  cccd: string;
  nationality: string;
  address: string;
  maritalStatus?: 'Độc thân' | 'Đã kết hôn' | string;
  department?: string;
  position?: string;
  rank?: string;
  contractType?: string;
  officialWorkDate?: string;
  directManager?: string;
  companyEmail?: string;
  paymentMethod?: string;
  bankAccounts?: BankAccountRow[];
  cashRecipients?: CashRecipientRow[];
  familyRelatives?: FamilyRelativeRow[];
  emergencyContact?: EmergencyContact;
  salaryStructure?: string;
  salaryStructureCode?: string;
}

export const CONTRACT_TARGET_OPTIONS = ['Người lao động', 'Cộng tác viên', 'Môi giới', 'Nhân sự B2B'] as const;
export type ContractTargetType = typeof CONTRACT_TARGET_OPTIONS[number];

interface LaborDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingLaborers: Laborer[];
  onAddLaborer?: (laborer: Laborer) => void;
  salaryStructures?: any[];
}

interface CertificateRow {
  id: string;
  type: string;
  description: string;
  institution: string;
  issueDate: string;
  expirationDate: string;
  link: string;
  file: string;
}

export const LaborDetailModal: React.FC<LaborDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  existingLaborers,
  onAddLaborer,
  salaryStructures
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'salary' | 'contract_setup' | 'payslip' | 'family_info'>('personal');
  const [certificates, setCertificates] = useState<CertificateRow[]>([
    {
      id: '1',
      type: 'Chứng chỉ nghề',
      description: 'Chứng chỉ an toàn vệ sinh lao động',
      institution: 'Trung tâm Huấn luyện An toàn',
      issueDate: '12/03/2022',
      expirationDate: '12/03/2027',
      link: '',
      file: 'chung_chi_atld.pdf'
    }
  ]);
  
  const [selectedEmployee, setSelectedEmployee] = useState<typeof MOCK_EMPLOYEES[0] | null>(null);
  const [contractTargetType, setContractTargetType] = useState<ContractTargetType>('Người lao động');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const objectSelectRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cccd, setCccd] = useState('');
  const [nationality, setNationality] = useState('Việt Nam');
  const [address, setAddress] = useState('');
  const [cccdError, setCccdError] = useState<{isError: boolean, message: string}>({isError: false, message: ''});

  // Tab 5: Thông tin gia đình
  const [maritalStatus, setMaritalStatus] = useState<'Độc thân' | 'Đã kết hôn'>('Độc thân');
  const [showMaritalSection, setShowMaritalSection] = useState(true);

  // Khu vực: Nhân thân và Người phụ thuộc & Liên hệ khẩn cấp
  const [showFamilyRelSection, setShowFamilyRelSection] = useState(true);
  const [familyRelatives, setFamilyRelatives] = useState<FamilyRelativeRow[]>([
    {
      id: 'rel-1',
      fullName: 'Lê Thị Thu Hương',
      relationship: 'Vợ',
      idCard: '079185012345',
      dob: '1988-06-15',
      isDependent: false,
      isEmergencyContact: true,
      phone: '0908 776 554',
      email: 'huong.lt@gmail.com',
      notes: 'Liên hệ chính khi có sự cố khẩn cấp',
      fileName: 'giay_dang_ky_ket_hon.pdf'
    },
    {
      id: 'rel-2',
      fullName: 'Lê Minh Khôi',
      relationship: 'Con',
      idCard: '079314098765',
      dob: '2016-09-20',
      isDependent: true,
      isEmergencyContact: false,
      phone: '',
      email: '',
      notes: 'Giảm trừ gia cảnh (học sinh tiểu học)',
      fileName: 'giay_khai_sinh_ban_sao.pdf'
    }
  ]);

  const handleAddRelative = () => {
    const newRel: FamilyRelativeRow = {
      id: `rel-${Date.now()}`,
      fullName: '',
      relationship: 'Con',
      idCard: '',
      dob: '',
      isDependent: false,
      isEmergencyContact: false,
      phone: '',
      email: '',
      notes: '',
      fileName: ''
    };
    setFamilyRelatives(prev => [...prev, newRel]);
  };

  const handleUpdateRelative = (id: string, field: keyof FamilyRelativeRow, value: any) => {
    setFamilyRelatives(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteRelative = (id: string) => {
    setFamilyRelatives(prev => prev.filter(r => r.id !== id));
  };

  const handleUploadRelativeFile = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpdateRelative(id, 'fileName', file.name);
    }
  };
  const [hasEmergencyContact, setHasEmergencyContact] = useState(true);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactEmail, setEmergencyContactEmail] = useState('');
  const [emergencyContactAddress, setEmergencyContactAddress] = useState('');

  // Thiết lập Hợp đồng States
  const [contractCode, setContractCode] = useState('HĐLĐ-2026/001');
  const [contractType, setContractType] = useState('Hợp đồng lao động xác định thời hạn (12 tháng)');
  const [contractStatus, setContractStatus] = useState('Đang hiệu lực');
  const [signDate, setSignDate] = useState('15/01/2026');
  const [effectiveStartDate, setEffectiveStartDate] = useState('01/02/2026');
  const [effectiveEndDate, setEffectiveEndDate] = useState('31/01/2027');
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [signerRepresentative, setSignerRepresentative] = useState('Nguyễn Văn Quản Lý');
  const [signerRole, setSignerRole] = useState('Giám Đốc Điều Hành');

  const [department, setDepartment] = useState('Xưởng Dịch vụ & Sửa chữa');
  const [jobPosition, setJobPosition] = useState('Kỹ thuật viên gầm - máy');
  const [workLocation, setWorkLocation] = useState('Garage Du Mục - Trụ sở chính (TP. Hồ Chí Minh)');
  const [workScheduleType, setWorkScheduleType] = useState('Toàn thời gian cố định');
  const [workHours, setWorkHours] = useState('44 giờ/tuần (Thứ 2 - Thứ 7, nghỉ CN)');

  const [salaryGradeStep, setSalaryGradeStep] = useState('Bậc 3/7 - Thợ kỹ thuật chuyên môn');
  const [baseSalary, setBaseSalary] = useState('12,500,000');
  const [responsibilityAllowance, setResponsibilityAllowance] = useState('1,500,000');
  const [otherAllowances, setOtherAllowances] = useState('1,200,000');
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
  const [salaryPaymentDay, setSalaryPaymentDay] = useState('Ngày 05 hàng tháng');
  const [insuranceEnrolled, setInsuranceEnrolled] = useState(true);

  const [probationPeriod, setProbationPeriod] = useState('30 ngày');
  const [probationSalaryRate, setProbationSalaryRate] = useState('85%');
  const [confidentialityAgreed, setConfidentialityAgreed] = useState(true);
  const [contractNotes, setContractNotes] = useState('Tuân thủ quy chế vận hành garage và an toàn kỹ thuật xưởng.');

  // States specifically for "Người lao động" in Thiết lập Hợp đồng
  const [officialWorkDate, setOfficialWorkDate] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeCodeError, setEmployeeCodeError] = useState('');
  const [timekeepingCode, setTimekeepingCode] = useState('');
  const [probationStartDate, setProbationStartDate] = useState('');
  const [probationEndDate, setProbationEndDate] = useState('');
  const [laborPosition, setLaborPosition] = useState('Quản lý xưởng');
  const [laborDepartment, setLaborDepartment] = useState('Phòng Tư vấn, Dịch vụ');
  const [laborRank, setLaborRank] = useState('Bậc 1');
  const [directManager, setDirectManager] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  // Khu vực Tài khoản nhận (Người lao động)
  const [bankAccounts, setBankAccounts] = useState<BankAccountRow[]>([
    {
      id: 'bank-1',
      accountNumber: '',
      accountHolder: '',
      bankName: 'Vietcombank (VCB)',
      branch: '',
      isDefault: true,
      notes: '',
      fileName: ''
    }
  ]);

  const addBankAccountRow = () => {
    const newRow: BankAccountRow = {
      id: `bank-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      accountNumber: '',
      accountHolder: name ? name.trim().toUpperCase() : '',
      bankName: '',
      branch: '',
      isDefault: bankAccounts.length === 0,
      notes: '',
      fileName: ''
    };
    setBankAccounts(prev => [...prev, newRow]);
  };

  const updateBankAccountRow = (id: string, field: keyof BankAccountRow, value: any) => {
    setBankAccounts(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const deleteBankAccountRow = (id: string) => {
    setBankAccounts(prev => {
      const remaining = prev.filter(row => row.id !== id);
      const wasDefault = prev.find(r => r.id === id)?.isDefault;
      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const handleDefaultBankToggle = (id: string) => {
    // 1 thời điểm chỉ được 1 tick chọn
    setBankAccounts(prev =>
      prev.map(row => ({
        ...row,
        isDefault: row.id === id
      }))
    );
  };

  // Khu vực Thông tin người nhận (Người lao động - Tiền mặt)
  const [cashRecipients, setCashRecipients] = useState<CashRecipientRow[]>([
    {
      id: 'recipient-1',
      idCard: '',
      fullName: '',
      pickupLocation: 'Văn phòng Công ty (Bộ phận Kế toán)',
      isDefault: true,
      notes: '',
      fileName: ''
    }
  ]);

  const addCashRecipientRow = () => {
    const newRow: CashRecipientRow = {
      id: `recipient-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      idCard: cccd ? cccd.trim() : '',
      fullName: name ? name.trim().toUpperCase() : '',
      pickupLocation: 'Văn phòng Công ty (Bộ phận Kế toán)',
      isDefault: cashRecipients.length === 0,
      notes: '',
      fileName: ''
    };
    setCashRecipients(prev => [...prev, newRow]);
  };

  const updateCashRecipientRow = (id: string, field: keyof CashRecipientRow, value: any) => {
    setCashRecipients(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const deleteCashRecipientRow = (id: string) => {
    setCashRecipients(prev => {
      const remaining = prev.filter(row => row.id !== id);
      const wasDefault = prev.find(r => r.id === id)?.isDefault;
      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const handleDefaultCashRecipientToggle = (id: string) => {
    // 1 thời điểm chỉ được 1 tick chọn
    setCashRecipients(prev =>
      prev.map(row => ({
        ...row,
        isDefault: row.id === id
      }))
    );
  };

  useEffect(() => {
    if (name && name.trim()) {
      const upper = name.trim().toUpperCase();
      setBankAccounts(prev =>
        prev.map(row => (!row.accountHolder ? { ...row, accountHolder: upper } : row))
      );
      setCashRecipients(prev =>
        prev.map((row, idx) => (idx === 0 && !row.fullName ? { ...row, fullName: upper } : row))
      );
    }
  }, [name]);

  useEffect(() => {
    if (cccd && cccd.trim()) {
      setCashRecipients(prev =>
        prev.map((row, idx) => (idx === 0 && !row.idCard ? { ...row, idCard: cccd.trim() } : row))
      );
    }
  }, [cccd]);

  const [laborContractType, setLaborContractType] = useState('Hợp đồng lao động xác định thời hạn');
  const [laborContractCode, setLaborContractCode] = useState('HDLD_XDH-2026/01');
  const [contractSignDate, setContractSignDate] = useState('');
  const [contractExpiryDate, setContractExpiryDate] = useState('');
  const [resignationDate, setResignationDate] = useState('');
  const [workStatus, setWorkStatus] = useState('Đang làm việc');
  const [resignationReason, setResignationReason] = useState('');

  // Helper mapping Chức vụ / Vị trí với Grade trong Thang bảng lương
  const getMatchedSalaryGrade = (posName: string) => {
    if (!posName) return MOCK_GRADES[2]; // Mặc định Quản lý xưởng
    const norm = posName.toLowerCase().trim();
    const exact = MOCK_GRADES.find(g => g.name.toLowerCase() === norm);
    if (exact) return exact;

    if (norm.includes('kỹ thuật viên') || norm.includes('thợ') || norm.includes('ktv') || norm.includes('kho')) {
      return MOCK_GRADES.find(g => g.code === 'GR_KTV') || MOCK_GRADES[5];
    }
    if (norm.includes('kế toán')) {
      return MOCK_GRADES.find(g => g.code === 'KT') || MOCK_GRADES[3];
    }
    if (norm.includes('cố vấn')) {
      return MOCK_GRADES.find(g => g.code === 'GR_CV') || MOCK_GRADES[4];
    }
    if (norm.includes('quản lý') || norm.includes('quản đốc')) {
      return MOCK_GRADES.find(g => g.code === 'QX') || MOCK_GRADES[2];
    }
    if (norm.includes('phó giám đốc')) {
      return MOCK_GRADES.find(g => g.code === 'PGD') || MOCK_GRADES[1];
    }
    if (norm.includes('giám đốc')) {
      return MOCK_GRADES.find(g => g.code === 'GD') || MOCK_GRADES[0];
    }
    return MOCK_GRADES[2];
  };

  const currentSalaryGrade = useMemo(() => {
    return getMatchedSalaryGrade(laborPosition);
  }, [laborPosition]);

  const availableStepsForPosition = useMemo(() => {
    if (currentSalaryGrade && currentSalaryGrade.steps && currentSalaryGrade.steps.length > 0) {
      return currentSalaryGrade.steps;
    }
    return [
      { id: '1', level: 1, name: 'Bậc 1', salary: 10000000 },
      { id: '2', level: 2, name: 'Bậc 2', salary: 12000000 },
      { id: '3', level: 3, name: 'Bậc 3', salary: 15000000 },
      { id: '4', level: 4, name: 'Bậc 4', salary: 18000000 },
      { id: '5', level: 5, name: 'Bậc 5', salary: 22000000 },
    ];
  }, [currentSalaryGrade]);

  const monthlySalaryValue = useMemo(() => {
    if (!currentSalaryGrade || !currentSalaryGrade.steps) return 0;
    const normRank = (laborRank || '').toLowerCase().trim();
    
    // 1. Khớp theo tên chính xác
    let step = currentSalaryGrade.steps.find(s => s.name.toLowerCase() === normRank);
    
    // 2. Nếu không khớp, thử khớp theo số bậc (ví dụ "Bậc 1" -> level 1 hoặc tên có "Bậc 1")
    if (!step) {
      const matchNum = normRank.match(/\d+/);
      if (matchNum) {
        const num = parseInt(matchNum[0], 10);
        step = currentSalaryGrade.steps.find(s => s.name.toLowerCase() === `bậc ${num}`);
        if (!step) {
          step = currentSalaryGrade.steps.find(s => s.level === num);
        }
      }
    }

    // 3. Khớp chuỗi gần đúng
    if (!step) {
      step = currentSalaryGrade.steps.find(s => normRank.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(normRank));
    }

    return step ? step.salary : (currentSalaryGrade.steps[0]?.salary || 0);
  }, [currentSalaryGrade, laborRank]);

  const formattedMonthlySalary = useMemo(() => {
    if (!monthlySalaryValue) return '0 VNĐ';
    return monthlySalaryValue.toLocaleString('vi-VN') + ' VNĐ';
  }, [monthlySalaryValue]);

  // Tab Phiếu Lương States & Computations
  const [selectedStructureCode, setSelectedStructureCode] = useState<string>('CTL_VP');
  const [manualAllowances, setManualAllowances] = useState<{ [key: string]: number }>({
    chuyenCan: 500000,
    congTac: 300000,
  });

  // Tự động đồng bộ / gợi ý cấu trúc lương theo bộ phận
  useEffect(() => {
    if (laborDepartment) {
      if (laborDepartment.includes('Kinh doanh')) {
        setSelectedStructureCode('CTL_KD');
      } else if (laborDepartment.includes('Kỹ Thuật') || laborDepartment.includes('Sửa chữa') || laborDepartment.includes('Kho')) {
        setSelectedStructureCode('CTL_KT');
      } else {
        setSelectedStructureCode('CTL_VP');
      }
    }
  }, [laborDepartment]);

  const availableStructures = useMemo(() => {
    return (salaryStructures && salaryStructures.length > 0) ? salaryStructures : INITIAL_STRUCTURES;
  }, [salaryStructures]);

  const selectedStructure = useMemo(() => {
    return (
      availableStructures.find((s: any) => s.code === selectedStructureCode || s.name === selectedStructureCode || String(s.id) === selectedStructureCode) ||
      availableStructures[0]
    );
  }, [availableStructures, selectedStructureCode]);

  const getBadgeColor = (ruleGroupName?: string) => {
    const gName = (ruleGroupName || '').toLowerCase();
    if (gName.includes('lương')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (gName.includes('phụ cấp')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (gName.includes('bảo hiểm') || gName.includes('bhxh')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (gName.includes('thuế') || gName.includes('tncn')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (gName.includes('thưởng') || gName.includes('hiệu quả')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (gName.includes('giảm trừ') || gName.includes('khấu trừ')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (gName.includes('bổ sung') || gName.includes('hỗ trợ')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const computedPayslip = useMemo(() => {
    const baseSalary = monthlySalaryValue || 12000000;
    const stdWorkDays = 26;
    const actWorkDays = 26;
    const lunchPerDay = 730000;
    const dependentCount = (familyRelatives || []).filter(r => r.isDependent).length;

    const workSalary = Math.round((baseSalary / stdWorkDays) * actWorkDays);

    const isGrossSummary = (c: any) => {
      const n = (c.name || '').toLowerCase();
      return n.includes('lương gross') || n.includes('tổng thu nhập') || n === 'gross';
    };

    const isNetSummary = (c: any) => {
      const n = (c.name || '').toLowerCase();
      return n.includes('thực lĩnh') || n.includes('lương net') || n === 'net';
    };

    const isDeduction = (c: any) => {
      const g = (c.ruleGroupName || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return (
        g.includes('bảo hiểm') || g.includes('bhxh') || g.includes('thuế') || g.includes('tncn') ||
        g.includes('giảm trừ') || g.includes('khấu trừ') || n.includes('bảo hiểm') || n.includes('bhxh') ||
        n.includes('bhyt') || n.includes('bhtn') || n.includes('thuế') || n.includes('giảm trừ') ||
        n.includes('khấu trừ') || n.includes('phạt')
      );
    };

    let incomeList: Array<{ id: string; name: string; ruleGroupName: string; explanation: string; amount: number; isManual?: boolean; manualKey?: string }> = [];
    let deductionList: Array<{ id: string; name: string; ruleGroupName: string; explanation: string; amount: number }> = [];

    // Lấy components từ Cấu trúc Lương được chọn
    const rawComps = selectedStructure?.components || [];
    const activeComps = rawComps.filter((c: any) => c.enabled !== false);

    if (activeComps.length > 0) {
      // 1. Phân loại các khoản thu nhập (không phải summary và không phải deduction)
      const incomeComps = activeComps.filter((c: any) => !isGrossSummary(c) && !isNetSummary(c) && !isDeduction(c));

      incomeList = incomeComps.map((c: any) => {
        const isManual = c.calcType === 'manual';
        const n = (c.name || '').toLowerCase();
        let amount = 0;
        let explanation = '';

        if (isManual) {
          if (manualAllowances[c.id] !== undefined) {
            amount = manualAllowances[c.id];
          } else if (n.includes('kiêm nhiệm')) {
            amount = manualAllowances['kiemNhiem'] !== undefined ? manualAllowances['kiemNhiem'] : 1500000;
          } else if (n.includes('chuyên cần')) {
            amount = manualAllowances['chuyenCan'] !== undefined ? manualAllowances['chuyenCan'] : 500000;
          } else if (n.includes('công tác')) {
            amount = manualAllowances['congTac'] !== undefined ? manualAllowances['congTac'] : 300000;
          } else {
            amount = c.fixedValue !== undefined && c.fixedValue !== null ? Number(c.fixedValue) : 0;
          }
          explanation = c.formulaSummary || 'Tự nhập trong Phiếu Lương';
        } else if (c.calcType === 'fixed') {
          amount = c.fixedValue !== undefined && c.fixedValue !== null ? Number(c.fixedValue) : 0;
          explanation = c.formulaSummary || (amount > 0 ? `${amount.toLocaleString('vi-VN')} đ (Cố định)` : 'Cố định hàng tháng');
        } else {
          // formula
          if (n.includes('lương') && (n.includes('ngày công') || n.includes('thời gian') || n.includes('cơ bản'))) {
            amount = workSalary;
            explanation = `[${baseSalary.toLocaleString('vi-VN')}] ÷ [${stdWorkDays}] × [${actWorkDays}] (Lương hợp đồng theo công làm việc)`;
          } else if (n.includes('ăn trưa')) {
            amount = lunchPerDay;
            explanation = `[${lunchPerDay.toLocaleString('vi-VN')}] ÷ [${stdWorkDays}] × [${actWorkDays}] (Hỗ trợ tiền ăn ca theo quy chế)`;
          } else if (n.includes('xăng xe')) {
            amount = 500000;
            explanation = '500,000 đ (Khoản chi trả hỗ trợ di chuyển cố định hàng tháng)';
          } else if (n.includes('điện thoại')) {
            amount = 500000;
            explanation = '500,000 đ (Khoản hỗ trợ liên lạc chăm sóc khách hàng showroom)';
          } else if (n.includes('độc hại')) {
            amount = 1000000;
            explanation = '1,000,000 đ (Phụ cấp nghề kỹ thuật sửa chữa & thiết bị gầm máy)';
          } else if (n.includes('trách nhiệm')) {
            amount = 800000;
            explanation = '800,000 đ (Theo quy chế phụ cấp hành chính - văn phòng)';
          } else if (n.includes('doanh số')) {
            amount = 3500000;
            explanation = '3,500,000 đ (Doanh số bán phụ tùng & dịch vụ đạt 100% KPI tháng)';
          } else if (n.includes('hoa hồng')) {
            amount = 1200000;
            explanation = '1,200,000 đ (Tỷ lệ hoa hồng hợp đồng xe & phụ tùng bàn giao hoàn tất)';
          } else if (n.includes('năng suất')) {
            amount = 1800000;
            explanation = '1,800,000 đ (Đạt chỉ tiêu giờ công chuẩn và an toàn lao động xưởng)';
          } else if (n.includes('hao mòn')) {
            amount = 300000;
            explanation = '300,000 đ (Khoản hỗ trợ bảo quản trang thiết bị đồ nghề chuyên dụng)';
          } else if (n.includes('kpi') || n.includes('hiệu quả')) {
            amount = 1500000;
            explanation = '1,500,000 đ (Đánh giá hoàn thành nhiệm vụ và chỉ tiêu tháng)';
          } else {
            amount = c.fixedValue !== undefined && c.fixedValue !== null ? Number(c.fixedValue) : 1000000;
            explanation = c.formulaSummary || c.description || 'Theo công thức tính cấu trúc lương';
          }
        }

        return {
          id: c.id,
          name: c.name,
          ruleGroupName: c.ruleGroupName,
          explanation,
          amount,
          isManual,
          manualKey: c.id
        };
      });
    }

    const totalGross = incomeList.reduce((sum, item) => sum + item.amount, 0);

    const bhxh = Math.round(baseSalary * 0.08);
    const bhyt = Math.round(baseSalary * 0.015);
    const bhtn = Math.round(baseSalary * 0.01);
    const totalInsurance = bhxh + bhyt + bhtn;

    const selfDeduction = 11000000;
    const dependentDeduction = dependentCount * 4400000;
    const taxableBase = Math.max(0, totalGross - totalInsurance - selfDeduction - dependentDeduction);

    let pit = 0;
    if (taxableBase > 0) {
      if (taxableBase <= 5000000) pit = taxableBase * 0.05;
      else if (taxableBase <= 10000000) pit = 250000 + (taxableBase - 5000000) * 0.1;
      else if (taxableBase <= 18000000) pit = 750000 + (taxableBase - 10000000) * 0.15;
      else if (taxableBase <= 32000000) pit = 1950000 + (taxableBase - 18000000) * 0.2;
      else pit = 4750000 + (taxableBase - 32000000) * 0.25;
    }
    pit = Math.round(pit);

    // 2. Phân loại các khoản trích nộp giảm trừ
    const deductComps = activeComps.filter((c: any) => !isGrossSummary(c) && !isNetSummary(c) && isDeduction(c));

    if (deductComps.length > 0) {
      deductionList = deductComps.map((c: any) => {
        const n = (c.name || '').toLowerCase();
        let amount = 0;
        let explanation = '';

        if (n.includes('bhxh') || (c.ruleGroupName.includes('Bảo hiểm') && n.includes('8%'))) {
          amount = bhxh;
          explanation = `[${baseSalary.toLocaleString('vi-VN')}] × 8% (Người lao động đóng)`;
        } else if (n.includes('bhyt') || (c.ruleGroupName.includes('Bảo hiểm') && n.includes('1.5%'))) {
          amount = bhyt;
          explanation = `[${baseSalary.toLocaleString('vi-VN')}] × 1.5% (Người lao động đóng)`;
        } else if (n.includes('bhtn') || (c.ruleGroupName.includes('Bảo hiểm') && n.includes('1%'))) {
          amount = bhtn;
          explanation = `[${baseSalary.toLocaleString('vi-VN')}] × 1% (Người lao động đóng)`;
        } else if (n.includes('10.5%') || n.includes('trích nộp')) {
          amount = totalInsurance;
          explanation = `[${baseSalary.toLocaleString('vi-VN')}] × 10.5% (BHXH 8%, BHYT 1.5%, BHTN 1%)`;
        } else if (n.includes('thuế') || n.includes('tncn')) {
          amount = pit;
          explanation = `Khấu trừ theo biểu lũy tiến (Sau khi trừ bản thân 11tr ${dependentCount > 0 ? `+ ${dependentCount} NPT: ${dependentDeduction.toLocaleString('vi-VN')} đ` : ''})`;
        } else {
          amount = c.fixedValue !== undefined && c.fixedValue !== null ? Number(c.fixedValue) : 0;
          explanation = c.formulaSummary || c.description || 'Khấu trừ theo quy chế';
        }

        return {
          id: c.id,
          name: c.name,
          ruleGroupName: c.ruleGroupName,
          explanation,
          amount
        };
      });
    } else {
      deductionList = [
        {
          id: 'ded_1',
          name: 'Bảo hiểm xã hội (BHXH 8%)',
          ruleGroupName: 'Bảo hiểm xã hội',
          explanation: `[${baseSalary.toLocaleString('vi-VN')}] × 8% (Người lao động đóng)`,
          amount: bhxh
        },
        {
          id: 'ded_2',
          name: 'Bảo hiểm y tế (BHYT 1.5%)',
          ruleGroupName: 'Bảo hiểm xã hội',
          explanation: `[${baseSalary.toLocaleString('vi-VN')}] × 1.5% (Người lao động đóng)`,
          amount: bhyt
        },
        {
          id: 'ded_3',
          name: 'Bảo hiểm thất nghiệp (BHTN 1%)',
          ruleGroupName: 'Bảo hiểm xã hội',
          explanation: `[${baseSalary.toLocaleString('vi-VN')}] × 1% (Người lao động đóng)`,
          amount: bhtn
        },
        {
          id: 'ded_4',
          name: 'Thuế thu nhập cá nhân (TNCN)',
          ruleGroupName: 'Thuế TNCN',
          explanation: `Khấu trừ theo biểu lũy tiến (Sau khi trừ bản thân 11tr ${dependentCount > 0 ? `+ ${dependentCount} NPT: ${dependentDeduction.toLocaleString('vi-VN')} đ` : ''})`,
          amount: pit
        }
      ];
    }

    const totalDeductions = deductionList.reduce((sum, item) => sum + item.amount, 0);
    const netSalary = totalGross - totalDeductions;

    return {
      incomeList,
      deductionList,
      totalGross,
      totalDeductions,
      netSalary,
      deductionsSubtitle: `Bao gồm 10.5% BHXH, BHYT, BHTN (${totalInsurance.toLocaleString('vi-VN')} đ) & Thuế TNCN`,
      activeComponentsCount: incomeList.length + deductionList.length,
      dependentCount,
      dependentDeduction
    };
  }, [monthlySalaryValue, selectedStructure, familyRelatives, manualAllowances]);

  const getNextEmployeeCode = () => {
    const existingCodes = (existingLaborers || []).map(l => (l.employeeCode || l.code || '').trim().toUpperCase());
    let nextNum = 1;
    while (existingCodes.includes(`NV-${String(nextNum).padStart(3, '0')}`)) {
      nextNum++;
    }
    return `NV-${String(nextNum).padStart(3, '0')}`;
  };

  const handleEmployeeCodeChange = (val: string) => {
    setEmployeeCode(val);
    const trimmed = val.trim().toUpperCase();
    if (!trimmed) {
      setEmployeeCodeError('Mã nhân viên không được để trống.');
      return;
    }
    const isDuplicate = (existingLaborers || []).some(lab => 
      (lab.employeeCode && lab.employeeCode.trim().toUpperCase() === trimmed) ||
      (lab.code && lab.code.trim().toUpperCase() === trimmed)
    );
    if (isDuplicate) {
      setEmployeeCodeError('Mã nhân viên đã tồn tại trên hệ thống, vui lòng nhập mã khác.');
    } else {
      setEmployeeCodeError('');
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedEmployee(null);
      setContractTargetType('Người lao động');
      setSearchQuery('');
      setIsDropdownOpen(false);
      setName('');
      setGender('Nam');
      setDob('');
      setPhone('');
      setEmail('');
      setCccd('');
      setNationality('Việt Nam');
      setAddress('');
      setCccdError({isError: false, message: ''});
      setActiveTab('personal');

      // Reset form Người lao động
      setOfficialWorkDate('');
      const autoCode = getNextEmployeeCode();
      setEmployeeCode(autoCode);
      setEmployeeCodeError('');
      setTimekeepingCode(autoCode.replace('NV-', 'CC-'));
      setProbationStartDate('');
      setProbationEndDate('');
      setLaborDepartment('Phòng Tư vấn, Dịch vụ');
      setLaborPosition('Quản lý xưởng');
      setLaborRank('Bậc 1');
      setContractStatus('Đang hiệu lực');
      setPaymentMethod('Chuyển khoản');
      setDirectManager('');
      setCompanyEmail('');
      setLaborContractType('Hợp đồng lao động xác định thời hạn');
      setLaborContractCode('HDLD_XDH-2026/01');
      setContractSignDate('');
      setContractExpiryDate('');
      setResignationDate('');
      setWorkStatus('Đang làm việc');
      setResignationReason('');
      setHasEmergencyContact(false);
      setEmergencyContactName('');
      setEmergencyContactRelationship('');
      setEmergencyContactPhone('');
      setEmergencyContactEmail('');
      setEmergencyContactAddress('');
      setBankAccounts([
        {
          id: `bank-${Date.now()}`,
          accountNumber: '',
          accountHolder: '',
          bankName: 'Vietcombank (VCB)',
          branch: '',
          isDefault: true,
          notes: '',
          fileName: ''
        }
      ]);
      setCashRecipients([
        {
          id: `recipient-${Date.now()}`,
          idCard: '',
          fullName: '',
          pickupLocation: 'Văn phòng Công ty (Bộ phận Kế toán)',
          isDefault: true,
          notes: '',
          fileName: ''
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (objectSelectRef.current && !objectSelectRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_EMPLOYEES;
    // If the query matches the currently selected employee label, display all to allow easy re-selection
    if (selectedEmployee && (
      q === `${selectedEmployee.name} - cccd: ${selectedEmployee.cccd}`.toLowerCase() ||
      q === selectedEmployee.name.toLowerCase() ||
      q === selectedEmployee.cccd.toLowerCase()
    )) {
      return MOCK_EMPLOYEES;
    }
    const cleanQ = q.replace(/\s+/g, '');
    return MOCK_EMPLOYEES.filter(emp => 
      emp.name.toLowerCase().includes(q) || 
      emp.cccd.toLowerCase().includes(q) ||
      emp.cccd.replace(/\s+/g, '').includes(cleanQ)
    );
  }, [searchQuery, selectedEmployee]);

  const handleSelectEmployee = (emp: typeof MOCK_EMPLOYEES[0]) => {
    setSelectedEmployee(emp);
    setSearchQuery(`${emp.name} - CCCD: ${emp.cccd}`);
    setIsDropdownOpen(false);
    
    setName(emp.name);
    setGender(emp.gender);
    setDob(emp.dob);
    setCccd(emp.cccd);
    setPhone(emp.phone);
    setEmail(emp.email);
    setCompanyEmail(emp.email || '');
    setNationality(emp.nationality || 'Việt Nam');
    setAddress(emp.address || '');
    handleCccdChange(emp.cccd);

    setCashRecipients(prev => {
      if (prev.length > 0) {
        const copy = [...prev];
        copy[0] = {
          ...copy[0],
          idCard: emp.cccd || copy[0].idCard,
          fullName: emp.name ? emp.name.trim().toUpperCase() : copy[0].fullName
        };
        return copy;
      }
      return prev;
    });
  };

  const handleClearSelection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedEmployee(null);
    setSearchQuery('');
    setIsDropdownOpen(false);
    
    setName('');
    setGender('Nam');
    setDob('');
    setCccd('');
    setPhone('');
    setEmail('');
    setCompanyEmail('');
    setNationality('Việt Nam');
    setAddress('');
    setMaritalStatus('Độc thân');
    setHasEmergencyContact(true);
    setEmergencyContactName('');
    setEmergencyContactRelationship('');
    setEmergencyContactPhone('');
    setEmergencyContactEmail('');
    setEmergencyContactAddress('');
    setCccdError({ isError: false, message: '' });
    setCashRecipients([
      {
        id: `recipient-${Date.now()}`,
        idCard: '',
        fullName: '',
        pickupLocation: 'Văn phòng Công ty (Bộ phận Kế toán)',
        isDefault: true,
        notes: '',
        fileName: ''
      }
    ]);
  };

  const handleCccdChange = (value: string) => {
    setCccd(value);
    if (!value) {
      setCccdError({isError: false, message: ''});
      return;
    }
    const duplicate = existingLaborers.find(lab => lab.cccd === value);
    if (duplicate) {
      setCccdError({
        isError: true,
        message: `Số CCCD bị trùng với lao động: ${duplicate.name}`
      });
    } else {
      setCccdError({isError: false, message: ''});
    }
  };

  const getSystemTimestamp = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = pad(now.getDate());
    const m = pad(now.getMonth() + 1);
    const y = now.getFullYear();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    return `${d}/${m}/${y} ${hh}:${mm}`;
  };

  const [skillRows, setSkillRows] = useState<SkillQualificationRow[]>([
    {
      id: 'skill-1',
      highestEducation: 'Đại học',
      graduationYear: '2019',
      major: 'Kỹ thuật Ô tô / Cơ khí Động lực',
      institution: 'Đại học Bách Khoa TP.HCM',
      experienceYears: '4 năm',
      previousExperience: 'Kỹ thuật viên trưởng tại Garage AutoCare, phụ trách chẩn đoán gầm máy và cố vấn dịch vụ.',
      createdAt: '12/03/2026 09:15',
      createdBy: 'Admin (Hệ thống)'
    }
  ]);

  const addSkillRow = () => {
    const newRow: SkillQualificationRow = {
      id: `skill-${Date.now()}`,
      highestEducation: '',
      graduationYear: '',
      major: '',
      institution: '',
      experienceYears: '',
      previousExperience: '',
      createdAt: getSystemTimestamp(),
      createdBy: 'Admin (Hệ thống)'
    };
    setSkillRows(prev => [...prev, newRow]);
  };

  const updateSkillRow = (id: string, field: keyof SkillQualificationRow, value: string) => {
    setSkillRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const deleteSkillRow = (id: string) => {
    setSkillRows(prev => prev.filter(row => row.id !== id));
  };

  const addCertificateRow = () => {
    setCertificates(prev => [...prev, {
      id: Date.now().toString(),
      type: '',
      description: '',
      institution: '',
      issueDate: '',
      expirationDate: '',
      link: '',
      file: ''
    }]);
  };

  const updateCertificateRow = (id: string, field: keyof CertificateRow, value: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDownloadFile = (cert: CertificateRow) => {
    if (!cert.file) return;
    const blob = new Blob([`Tài liệu: ${cert.file}\nLoại: ${cert.type}\nMô tả: ${cert.description}\nĐơn vị cấp: ${cert.institution}\nNgày cấp: ${cert.issueDate}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cert.file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (cccdError.isError) return;
    const target = contractTargetType || 'Người lao động';
    if (target === 'Người lao động') {
      const trimmedCode = employeeCode.trim().toUpperCase();
      if (!trimmedCode) {
        setEmployeeCodeError('Mã nhân viên không được để trống.');
        setActiveTab('contract_setup');
        return;
      }
      const isDuplicate = (existingLaborers || []).some(lab => 
        (lab.employeeCode && lab.employeeCode.trim().toUpperCase() === trimmedCode) ||
        (lab.code && lab.code.trim().toUpperCase() === trimmedCode)
      );
      if (isDuplicate) {
        setEmployeeCodeError('Mã nhân viên đã tồn tại trên hệ thống, vui lòng nhập mã khác.');
        setActiveTab('contract_setup');
        return;
      }
    }

    if (onAddLaborer && name.trim()) {
      let assignedCode = laborContractCode;
      let assignedType = laborContractType;
      let assignedStatus = target === 'Người lao động' ? (contractStatus || 'Đang hiệu lực') : (workStatus || 'Còn hiệu lực');

      if (target === 'Cộng tác viên') {
        assignedCode = contractCode || 'HĐCTV-2026/01';
        assignedType = contractType || 'Hợp đồng cộng tác viên';
      } else if (target === 'Môi giới') {
        assignedCode = contractCode || 'HĐMG-2026/01';
        assignedType = 'Hợp đồng môi giới';
      } else if (target === 'Nhân sự B2B') {
        assignedCode = contractCode || 'HĐB2B-2026/01';
        assignedType = 'Hợp đồng thuê ngoài';
      }

      onAddLaborer({
        code: assignedCode || `HĐ-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeCode: target === 'Người lao động' ? employeeCode.trim().toUpperCase() : undefined,
        timekeepingCode: target === 'Người lao động' ? timekeepingCode.trim() : undefined,
        status: assignedStatus,
        contractTargetType: target,
        name: name.trim().toUpperCase(),
        gender: gender || 'Nam',
        dob: dob || '01/01/1992',
        phone: phone || '0901 000 111',
        email: email || 'laodong@garage.vn',
        cccd: cccd || `0790${Math.floor(10000000 + Math.random() * 90000000)}`,
        nationality: nationality || 'Việt Nam',
        address: address || 'TP. Hồ Chí Minh',
        maritalStatus: maritalStatus,
        familyRelatives: familyRelatives,
        department: laborDepartment || department || 'Phòng Tư vấn, Dịch vụ',
        position: laborPosition || jobPosition || 'Kỹ thuật viên',
        rank: laborRank || 'Bậc 1',
        contractType: assignedType || 'Hợp đồng lao động xác định thời hạn',
        officialWorkDate: target === 'Người lao động' ? officialWorkDate : undefined,
        directManager: target === 'Người lao động' ? directManager : undefined,
        companyEmail: target === 'Người lao động' ? companyEmail : undefined,
        paymentMethod: target === 'Người lao động' ? paymentMethod : undefined,
        bankAccounts: (target === 'Người lao động' && paymentMethod === 'Chuyển khoản') ? bankAccounts : undefined,
        cashRecipients: (target === 'Người lao động' && paymentMethod === 'Tiền mặt') ? cashRecipients : undefined,
        emergencyContact: (target === 'Người lao động') ? (() => {
          const emergencyRel = familyRelatives.find(r => r.isEmergencyContact && r.fullName.trim());
          if (emergencyRel) {
            return {
              hasContact: true,
              name: emergencyRel.fullName.trim(),
              relationship: emergencyRel.relationship.trim(),
              phone: emergencyRel.phone.trim(),
              email: emergencyRel.email.trim(),
              address: emergencyRel.notes.trim()
            };
          }
          return undefined;
        })() : undefined,
        salaryStructure: selectedStructure.name,
        salaryStructureCode: selectedStructureCode
      });
    }
    onClose();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'F2') {
        e.preventDefault();
        if (activeTab === 'skills') {
          addSkillRow();
        } else if (activeTab === 'salary') {
          addCertificateRow();
        } else if (activeTab === 'contract_setup' && contractTargetType === 'Người lao động') {
          addBankAccountRow();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F8FAFC] overflow-hidden animate-fadeIn">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between px-8 py-3.5 border-b border-gray-200 bg-white shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-bold text-gray-800">Chi tiết Hồ sơ Hợp đồng</h2>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
            Toàn màn hình
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          title="Đóng (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-8 pt-3 bg-white border-b border-gray-200 shrink-0">
        <button 
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'personal' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Thông tin cá nhân
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'skills' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Trình độ & Kỹ năng
        </button>
        <button 
          onClick={() => setActiveTab('salary')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'salary' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Danh mục Tài liệu
        </button>
        <button 
          onClick={() => setActiveTab('contract_setup')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'contract_setup' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Thiết lập Hợp đồng / PLHĐ
        </button>
        <button 
          onClick={() => setActiveTab('payslip')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'payslip' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Phiếu Lương
        </button>
        <button 
          onClick={() => setActiveTab('family_info')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'family_info' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Thông tin gia đình
        </button>
      </div>

      {/* Persistent Bar under Tabs: Xác định đối tượng, Họ tên đầy đủ, Ngày sinh, Giới tính, Đối tượng Hợp đồng */}
      <div className="bg-white px-8 py-3.5 border-b border-gray-200 shrink-0 shadow-xs relative z-40 overflow-visible">
        <div className="flex items-end gap-3 w-full flex-nowrap overflow-visible">
          {/* Field 1: Xác định đối tượng: */}
          <div className="flex-1 min-w-[360px] max-w-[460px] relative shrink-0" ref={objectSelectRef}>
            <label className="block text-gray-700 font-semibold text-xs mb-1">
              Xác định đối tượng: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Tìm theo CCCD hoặc Họ tên từ Hồ sơ Nhân sự..."
                  className="w-full pl-9 pr-14 py-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white transition-all placeholder:text-gray-400 h-[38px]"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                  {(selectedEmployee || searchQuery) && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa lựa chọn và chọn lại (Clear)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Mở danh sách nhân sự"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Dropdown Menu - nổi phủ lên toàn bộ màn hình phía dưới */}
              {isDropdownOpen && (
                <div className="absolute left-0 w-full min-w-[440px] top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-gray-100 ring-1 ring-black/5 animate-fadeIn">
                  <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 flex items-center justify-between">
                    <span>Nguồn: Hồ sơ Nhân sự ({filteredEmployees.length} nhân sự)</span>
                    <span className="text-[11px] text-gray-400 font-normal">Hiển thị Họ tên & CCCD</span>
                  </div>
                  {filteredEmployees.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">
                      Không tìm thấy nhân sự nào khớp với từ khóa "{searchQuery}"
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const isSelected = selectedEmployee?.cccd === emp.cccd;
                      return (
                        <div
                          key={emp.cccd}
                          onClick={() => handleSelectEmployee(emp)}
                          className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-gray-900">{emp.name}</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold">
                                CCCD: {emp.cccd}
                              </span>
                            </div>
                            <div className="text-[12px] text-gray-500 flex items-center gap-2">
                              <span>Ngày sinh: <strong className="font-medium text-gray-700">{emp.dob}</strong></span>
                              <span>•</span>
                              <span>Giới tính: <strong className="font-medium text-gray-700">{emp.gender}</strong></span>
                              <span>•</span>
                              <span>ĐT: {emp.phone}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Field 2: Họ tên đầy đủ */}
          <div className="w-[180px] shrink-0">
            <label className="block text-gray-700 font-semibold text-xs mb-1">
              Họ tên đầy đủ
            </label>
            <input
              type="text"
              readOnly
              value={selectedEmployee ? selectedEmployee.name : ''}
              placeholder="Chưa chọn đối tượng"
              title={selectedEmployee ? selectedEmployee.name : ''}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-800 font-semibold border border-gray-300 rounded cursor-not-allowed outline-none select-none h-[38px] truncate"
            />
          </div>

          {/* Field 3: Ngày sinh */}
          <div className="w-[110px] shrink-0">
            <label className="block text-gray-700 font-semibold text-xs mb-1">
              Ngày sinh
            </label>
            <input
              type="text"
              readOnly
              value={selectedEmployee ? selectedEmployee.dob : ''}
              placeholder="DD/MM/YYYY"
              className="w-full px-2 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-300 rounded cursor-not-allowed outline-none select-none text-center font-medium h-[38px]"
            />
          </div>

          {/* Field 4: Giới tính */}
          <div className="w-[85px] shrink-0">
            <label className="block text-gray-700 font-semibold text-xs mb-1">
              Giới tính
            </label>
            <input
              type="text"
              readOnly
              value={selectedEmployee ? selectedEmployee.gender : ''}
              placeholder="---"
              className="w-full px-2 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-300 rounded cursor-not-allowed outline-none select-none text-center font-medium h-[38px]"
            />
          </div>

          {/* Field 5: Đối tượng Hợp đồng */}
          <div className="shrink-0">
            <label className="block text-gray-700 font-semibold text-xs mb-1">
              Đối tượng Hợp đồng: <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 h-[38px] px-3.5 bg-white border border-gray-300 rounded">
              {CONTRACT_TARGET_OPTIONS.map((opt) => {
                const isChecked = contractTargetType === opt;
                return (
                  <label
                    key={opt}
                    onClick={() => setContractTargetType(opt)}
                    className="flex items-center gap-2 cursor-pointer select-none group py-1"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'border-gray-400 bg-white group-hover:border-blue-500'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${isChecked ? 'text-blue-900 font-semibold' : 'text-gray-700 font-medium'}`}>
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 text-[14px]">
          
          {activeTab === 'personal' && (
            <>
              <div className="flex gap-6 items-start">
                
                {/* Column 1: Identity Info */}
                <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <h3 className="text-blue-600 font-medium mb-6">Thông tin định danh</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-gray-700 font-medium">Họ tên người lao động <span className="text-red-500">*</span></label>
                        <span className="text-[11px] text-gray-400 italic">(Từ Xác định đối tượng)</span>
                      </div>
                      <input 
                        type="text" 
                        readOnly
                        value={selectedEmployee ? selectedEmployee.name : ''}
                        placeholder="Chưa chọn đối tượng (ở trên)" 
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-100 text-gray-800 font-semibold cursor-not-allowed" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-gray-700 font-medium">Giới tính</label>
                        <span className="text-[11px] text-gray-400 italic">(Từ Xác định đối tượng)</span>
                      </div>
                      <input 
                        type="text"
                        readOnly
                        value={selectedEmployee ? selectedEmployee.gender : ''}
                        placeholder="---"
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-100 text-gray-800 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-gray-700 font-medium">Ngày sinh</label>
                        <span className="text-[11px] text-gray-400 italic">(Từ Xác định đối tượng)</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly
                          value={selectedEmployee ? selectedEmployee.dob : ''}
                          placeholder="DD/MM/YYYY" 
                          className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-100 text-gray-800 cursor-not-allowed" 
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Nơi sinh</label>
                      <input type="text" placeholder="Nhập nơi sinh" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Quốc tịch</label>
                      <input 
                        type="text" 
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Nhập quốc tịch" 
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Contact Info */}
                <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <h3 className="text-blue-600 font-medium mb-6">Thông tin liên hệ</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Điện thoại <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại" 
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Email</label>
                      <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email" 
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* CCCD section */}
              <div className="mt-6 bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-blue-600 font-medium mb-6">Căn cước công dân (CCCD)</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-gray-700 font-medium">Số CCCD</label>
                      <span className="text-[11px] text-gray-400 italic">(Từ Xác định đối tượng)</span>
                    </div>
                    <input 
                      type="text" 
                      readOnly
                      placeholder="Chưa chọn đối tượng" 
                      value={selectedEmployee ? selectedEmployee.cccd : ''}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-100 text-gray-800 font-mono font-medium cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Ngày cấp</label>
                    <div className="relative">
                      <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Nơi cấp</label>
                    <input type="text" placeholder="Nhập nơi cấp" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-gray-700 font-medium mb-1.5">Địa chỉ thường trú / Chỗ ở hiện nay</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nhập địa chỉ chỗ ở hiện nay" 
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-blue-600 font-medium text-[15px] flex items-center gap-2">
                      Danh sách Trình độ học vấn & Kỹ năng
                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                        {skillRows.length} dòng
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>
                        Hệ thống tự động ghi nhận <strong className="text-gray-700">Ngày tạo</strong> và <strong className="text-gray-700">Người tạo</strong> cho từng dòng khi được thêm vào bảng.
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSkillRow}
                    className="bg-[#1A4B9F] text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm dòng
                  </button>
                </div>

                <div className="border border-blue-200 rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1250px]">
                      <thead className="bg-[#EBF5FF]">
                        <tr>
                          <th className="p-3 border-r border-b border-blue-200 w-12 text-center text-gray-700 font-medium text-[13px] whitespace-nowrap">STT</th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[200px] whitespace-nowrap">
                            Trình độ Học vấn cao nhất
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[130px] whitespace-nowrap">
                            Năm tốt nghiệp
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[190px] whitespace-nowrap">
                            Chuyên ngành đào tạo
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[220px] whitespace-nowrap">
                            Trường / Trung tâm đào tạo
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[140px] whitespace-nowrap">
                            Số năm kinh nghiệm
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[250px] whitespace-nowrap">
                            Kinh nghiệm trước đây
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[160px] whitespace-nowrap bg-blue-50/70">
                            <div className="flex items-center gap-1">
                              <span>Ngày tạo</span>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-normal leading-none">(Tự động)</span>
                            </div>
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[170px] whitespace-nowrap bg-blue-50/70">
                            <div className="flex items-center gap-1">
                              <span>Người tạo</span>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-normal leading-none">(Tự động)</span>
                            </div>
                          </th>
                          <th className="p-3 border-b border-blue-200 w-16 text-center text-gray-700 font-medium text-[13px] whitespace-nowrap">
                            Xóa
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillRows.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-8 text-center text-gray-500 text-[13px]">
                              Chưa có dữ liệu trình độ & kỹ năng. Nhấn nút <strong className="text-blue-600">"Thêm dòng"</strong> để bắt đầu.
                            </td>
                          </tr>
                        ) : (
                          skillRows.map((row, index) => (
                            <tr key={row.id} className="border-b border-dashed border-gray-200 hover:bg-gray-50/70 transition-colors">
                              <td className="p-3 border-r border-dashed border-gray-200 text-center text-[13px] font-semibold text-gray-600 bg-gray-50/30">
                                {index + 1}
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <select
                                  value={row.highestEducation}
                                  onChange={(e) => updateSkillRow(row.id, 'highestEducation', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white text-[13px] cursor-pointer hover:border-gray-400"
                                >
                                  <option value="">-- Chọn trình độ --</option>
                                  <option value="Sau Đại học">Sau Đại học (Thạc sĩ, Tiến sĩ)</option>
                                  <option value="Đại học">Đại học</option>
                                  <option value="Cao đẳng">Cao đẳng</option>
                                  <option value="Trung cấp">Trung cấp</option>
                                  <option value="THPT">THPT (12/12)</option>
                                  <option value="THCS">THCS</option>
                                  <option value="Sơ cấp nghề / Chứng chỉ nghề">Sơ cấp nghề / Chứng chỉ nghề</option>
                                  <option value="Khác">Khác</option>
                                </select>
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.graduationYear}
                                  onChange={(e) => updateSkillRow(row.id, 'graduationYear', e.target.value)}
                                  placeholder="YYYY"
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-[13px] text-center"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.major}
                                  onChange={(e) => updateSkillRow(row.id, 'major', e.target.value)}
                                  placeholder="Nhập chuyên ngành..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px]"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.institution}
                                  onChange={(e) => updateSkillRow(row.id, 'institution', e.target.value)}
                                  placeholder="Tên trường / trung tâm đào tạo..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px]"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.experienceYears}
                                  onChange={(e) => updateSkillRow(row.id, 'experienceYears', e.target.value)}
                                  placeholder="VD: 3 hoặc 5 năm"
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-[13px] text-center"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <textarea
                                  rows={1}
                                  value={row.previousExperience}
                                  onChange={(e) => updateSkillRow(row.id, 'previousExperience', e.target.value)}
                                  placeholder="Mô tả công việc, vị trí hoặc nơi làm việc trước đây..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px] resize-y min-h-[34px] leading-snug"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200 bg-gray-50/40">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 text-[12px] select-none font-mono" title="Ngày tạo được hệ thống tự động ghi nhận">
                                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>{row.createdAt}</span>
                                </div>
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200 bg-gray-50/40">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/60 border border-blue-200/80 rounded text-blue-900 text-[12px] select-none font-medium truncate" title="Người tạo được hệ thống tự động ghi nhận">
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{row.createdBy}</span>
                                </div>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => deleteSkillRow(row.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Xóa dòng này"
                                >
                                  <Trash2 className="w-4 h-4 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}

                        <tr>
                          <td className="p-3 border-r border-b border-dashed border-gray-200 text-center text-blue-500">
                            <Plus className="w-3.5 h-3.5 mx-auto" />
                          </td>
                          <td
                            colSpan={9}
                            className="p-3 border-b border-dashed border-gray-200 text-blue-600 italic bg-white text-[13px] cursor-pointer hover:bg-blue-50/50 hover:text-blue-800 transition-colors select-none font-medium"
                            onClick={addSkillRow}
                          >
                            + Bấm vào đây để thêm dòng mới
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-white border-t border-blue-100">
                    <button
                      type="button"
                      onClick={addSkillRow}
                      className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Thêm dòng (F2)
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      <span>Hệ thống tự động ghi nhận <strong className="text-gray-700">Ngày tạo</strong> và <strong className="text-gray-700">Người tạo</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              {/* Danh mục Văn bằng / Chứng chỉ / CV */}
              <h3 className="text-blue-600 font-medium mb-6 text-[15px]">Danh mục Văn bằng / Chứng chỉ / CV</h3>
              
              <div className="border border-blue-200 rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EBF5FF]">
                    <tr>
                      <th className="p-3 border-r border-b border-blue-200 w-12 text-center text-gray-700 font-medium text-[13px]">#</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[140px]">Loại</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[150px]">Mô tả loại</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[200px]">Trường/ Trung tâm đào tạo</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">Ngày cấp</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[160px]">Ngày hết hạn (nếu có)</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">Link</th>
                      <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">File tải lên</th>
                      <th className="p-3 border-b border-blue-200 bg-[#EBF5FF] text-[13px] w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert, index) => (
                      <tr key={cert.id} className="border-b border-dashed border-gray-200 hover:bg-gray-50/50">
                        <td className="p-3 border-r border-dashed border-gray-200 text-center text-[13px]">{index + 1}</td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <select 
                            value={cert.type}
                            onChange={(e) => updateCertificateRow(cert.id, 'type', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 bg-white text-[13px]"
                          >
                            <option value="">Chọn loại</option>
                            <option value="Văn bằng">Văn bằng</option>
                            <option value="Chứng chỉ">Chứng chỉ</option>
                            <option value="CV">CV</option>
                            <option value="Giấy khám sức khỏe">Giấy khám sức khỏe</option>
                            <option value="CCCD">CCCD</option>
                            <option value="GPLX">GPLX</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <input 
                            type="text" 
                            value={cert.description}
                            onChange={(e) => updateCertificateRow(cert.id, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                            placeholder="Mô tả" 
                          />
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <input 
                            type="text" 
                            value={cert.institution}
                            onChange={(e) => updateCertificateRow(cert.id, 'institution', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                            placeholder="Trường/Trung tâm" 
                          />
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <input 
                            type="text" 
                            value={cert.issueDate}
                            onChange={(e) => updateCertificateRow(cert.id, 'issueDate', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                            placeholder="DD/MM/YYYY" 
                          />
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <input 
                            type="text" 
                            value={cert.expirationDate}
                            onChange={(e) => updateCertificateRow(cert.id, 'expirationDate', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                            placeholder="DD/MM/YYYY" 
                          />
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <input 
                            type="text" 
                            value={cert.link}
                            onChange={(e) => updateCertificateRow(cert.id, 'link', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                            placeholder="Link" 
                          />
                        </td>
                        <td className="p-2 border-r border-dashed border-gray-200">
                          <label className="text-blue-600 hover:text-blue-700 text-[13px] font-medium w-full text-left cursor-pointer block truncate" title={cert.file || "Chọn file..."}>
                            {cert.file ? cert.file : 'Chọn file...'}
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateCertificateRow(cert.id, 'file', file.name);
                                }
                              }} 
                            />
                          </label>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                              title="Tải về"
                              onClick={() => handleDownloadFile(cert)}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setCertificates(certificates.filter(c => c.id !== cert.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Xóa"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-3 border-r border-b border-dashed border-gray-200"></td>
                      <td colSpan={8} className="p-3 border-b border-dashed border-gray-200 text-gray-500 italic bg-white text-[13px] cursor-pointer hover:bg-gray-50" onClick={addCertificateRow}>
                        Bấm vào đây để thêm dòng mới
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-3 flex items-center gap-1.5 bg-white text-gray-700 font-medium text-[13px] cursor-pointer hover:text-blue-600" onClick={addCertificateRow}>
                  Thêm dòng (F2) 
                  <div className="w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">?</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contract_setup' && (
            <div className="flex flex-col gap-6">
              {contractTargetType === 'Người lao động' ? (
                <>
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Bên trái: Thông tin Hợp đồng */}
                  <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-blue-600 font-semibold text-[15px]">Thông tin Hợp đồng</h3>
                    </div>

                    {/* Dòng 1: Loại hợp đồng, Số hiệu hợp đồng, Trạng thái hợp đồng trên cùng 1 dòng */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 mb-4">
                      {/* Loại hợp đồng: list danh sách từ field "Tên loại Hợp đồng" trong menu "Loại hợp đồng" */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Loại hợp đồng <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={laborContractType}
                          onChange={(e) => {
                            const selectedName = e.target.value;
                            setLaborContractType(selectedName);
                            const matched = MOCK_CONTRACT_TYPES.find(c => c.name === selectedName);
                            if (matched) {
                              setLaborContractCode(`${matched.code}-2026/01`);
                            }
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          {MOCK_CONTRACT_TYPES.map((ct) => (
                            <option key={ct.code} value={ct.name}>
                              {ct.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Số hiệu hợp đồng */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Số hiệu hợp đồng <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={laborContractCode}
                          onChange={(e) => setLaborContractCode(e.target.value)}
                          placeholder="VD: HDLD_XDH-2026/01"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Trạng thái hợp đồng: ở sau field Số hiệu hợp đồng và nằm trên cùng 1 dòng */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Trạng thái hợp đồng <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={contractStatus}
                          onChange={(e) => setContractStatus(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800 font-medium"
                        >
                          <option value="Chờ hiệu lực">Chờ hiệu lực</option>
                          <option value="Đang hiệu lực">Đang hiệu lực</option>
                          <option value="Hết hiệu lực">Hết hiệu lực</option>
                        </select>
                      </div>
                    </div>

                    {/* Ngày hiệu lực và Ngày hết hạn hợp đồng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-4">
                      {/* Ngày ký hợp đồng đổi thành "Ngày hiệu lực hợp đồng" */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày hiệu lực hợp đồng
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={contractSignDate}
                            onChange={(e) => setContractSignDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày hết hạn hợp đồng
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={contractExpiryDate}
                            onChange={(e) => setContractExpiryDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bộ phận, Chức vụ / Vị trí, Bậc trên cùng 1 dòng */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 mb-4">
                      {/* Bộ phận */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Bộ phận <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={laborDepartment}
                          onChange={(e) => setLaborDepartment(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Phòng Tư vấn, Dịch vụ">Phòng Tư vấn, Dịch vụ</option>
                          <option value="Xưởng Dịch vụ & Sửa chữa">Xưởng Dịch vụ & Sửa chữa</option>
                          <option value="Phòng Kỹ Thuật">Phòng Kỹ Thuật</option>
                          <option value="Kho & Phụ tùng">Kho & Phụ tùng</option>
                          <option value="Phòng Kế toán">Phòng Kế toán</option>
                          <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                        </select>
                      </div>

                      {/* Chức vụ / Vị trí: lấy dữ liệu trong "Tên chức vụ/Vị trí" của menu Thang Bảng lương */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Chức vụ / Vị trí <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={laborPosition}
                          onChange={(e) => {
                            const newPos = e.target.value;
                            setLaborPosition(newPos);
                            const grade = getMatchedSalaryGrade(newPos);
                            if (grade && grade.steps && grade.steps.length > 0) {
                              const stepExists = grade.steps.some(s => s.name === laborRank);
                              if (!stepExists) {
                                setLaborRank(grade.steps[0].name);
                              }
                            }
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800 font-medium"
                        >
                          {MOCK_GRADES.map((grade) => (
                            <option key={grade.code || grade.name} value={grade.name}>
                              {grade.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bậc: sau field "Chức vụ / Vị trí", ở trên cùng 1 dòng */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Bậc <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={laborRank}
                          onChange={(e) => setLaborRank(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800 font-medium"
                        >
                          {availableStepsForPosition.map((step) => (
                            <option key={step.id || step.level} value={step.name}>
                              {step.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Lương hàng tháng & Phương thức thanh toán */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      {/* Lương hàng tháng */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Lương hàng tháng
                          <span className="text-[11px] text-blue-600 font-normal ml-1.5">(Quy ước Thang bảng lương)</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            readOnly
                            value={formattedMonthlySalary}
                            className="w-full border border-blue-200 rounded px-3 py-2 text-sm outline-none bg-blue-50/60 text-blue-800 font-bold cursor-not-allowed select-all"
                            title="Lương hàng tháng được hiển thị tự động theo Chức vụ / Vị trí và Bậc được quy ước trong menu Thang bảng lương"
                          />
                        </div>
                      </div>

                      {/* Phương thức thanh toán: hiển thị dạng button (Chuyển khoản, Tiền mặt) */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Phương thức thanh toán <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 h-[38px]">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Chuyển khoản')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition-all cursor-pointer ${
                              paymentMethod === 'Chuyển khoản'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {paymentMethod === 'Chuyển khoản' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            Chuyển khoản
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('Tiền mặt');
                              setCashRecipients(prev => {
                                if (prev.length > 0 && (!prev[0].idCard || !prev[0].fullName)) {
                                  const copy = [...prev];
                                  copy[0] = {
                                    ...copy[0],
                                    idCard: copy[0].idCard || (cccd ? cccd.trim() : ''),
                                    fullName: copy[0].fullName || (name ? name.trim().toUpperCase() : '')
                                  };
                                  return copy;
                                }
                                return prev;
                              });
                            }}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition-all cursor-pointer ${
                              paymentMethod === 'Tiền mặt'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {paymentMethod === 'Tiền mặt' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            Tiền mặt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bên phải: Thông tin công việc */}
                  <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="text-blue-600 font-semibold text-[15px]">Thông tin công việc</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                      {/* Ngày đi làm chính thức */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày đi làm chính thức
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={officialWorkDate}
                            onChange={(e) => setOfficialWorkDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Mã nhân viên: sau field Ngày đi làm chính thức, duy nhất, thông báo nếu bị trùng */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Mã nhân viên <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={employeeCode}
                          onChange={(e) => handleEmployeeCodeChange(e.target.value)}
                          placeholder="NV-001"
                          className={`w-full border rounded px-3 py-2 text-sm outline-none font-medium uppercase ${
                            employeeCodeError 
                              ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600' 
                              : 'border-gray-300 focus:border-blue-500 text-gray-800'
                          }`}
                        />
                        {employeeCodeError ? (
                          <span className="text-xs text-red-600 mt-1 block font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                            {employeeCodeError}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400 mt-0.5 block">Mã định danh duy nhất của nhân viên</span>
                        )}
                      </div>

                      {/* Mã chấm công: ở dưới field Ngày đi làm chính thức */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Mã chấm công
                        </label>
                        <input 
                          type="text"
                          value={timekeepingCode}
                          onChange={(e) => setTimekeepingCode(e.target.value)}
                          placeholder="CC-001"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 font-medium"
                        />
                      </div>

                      {/* Quản lý trực tiếp */}
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Quản lý trực tiếp
                        </label>
                        <input 
                          type="text"
                          value={directManager}
                          onChange={(e) => setDirectManager(e.target.value)}
                          placeholder="Họ tên quản lý"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                        />
                      </div>

                      {/* Email công ty */}
                      <div className="col-span-2">
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Email công ty
                        </label>
                        <input 
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          placeholder="email@company.vn"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khi tick chọn Chuyển khoản: hiển thị khu vực "Tài khoản nhận", ẩn khu vực "Thông tin người nhận" */}
                {paymentMethod === 'Chuyển khoản' && (
                  <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h3 className="text-blue-600 font-semibold text-[15px]">Tài khoản nhận</h3>
                        <span className="text-xs text-gray-400 font-normal hidden sm:inline">
                          (Tài khoản ngân hàng chi trả lương & chế độ cho người lao động)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={addBankAccountRow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm mới dòng
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#f0f5fa] text-gray-700 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="p-2.5 text-center w-[50px] border-r border-gray-200">STT</th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Số tài khoản ngân hàng <span className="text-red-500">*</span>
                            </th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Tên chủ tài khoản
                            </th>
                            <th className="p-2.5 w-[220px] border-r border-gray-200">
                              Tên ngân hàng
                            </th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Chi nhánh mở thẻ
                            </th>
                            <th className="p-2.5 text-center w-[90px] border-r border-gray-200">
                              Mặc định
                            </th>
                            <th className="p-2.5 min-w-[180px] border-r border-gray-200">
                              Lưu ý
                            </th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Up files
                            </th>
                            <th className="p-2.5 text-center w-[60px]">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {bankAccounts.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-4 text-center text-gray-400 italic">
                                Chưa có tài khoản nhận nào. Bấm "Thêm mới dòng" để thêm.
                              </td>
                            </tr>
                          ) : (
                            bankAccounts.map((acc, index) => (
                              <tr key={acc.id} className="hover:bg-blue-50/20 transition-colors">
                                {/* STT */}
                                <td className="p-2.5 text-center text-gray-600 font-medium border-r border-gray-200">
                                  {index + 1}
                                </td>

                                {/* Số tài khoản ngân hàng */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={acc.accountNumber}
                                    onChange={(e) => updateBankAccountRow(acc.id, 'accountNumber', e.target.value)}
                                    placeholder="Nhập số tài khoản..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Tên chủ tài khoản */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={acc.accountHolder}
                                    onChange={(e) => updateBankAccountRow(acc.id, 'accountHolder', e.target.value.toUpperCase())}
                                    placeholder="TÊN CHỦ TÀI KHOẢN"
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs uppercase font-medium outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Tên ngân hàng */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    list="vietnam-banks-list"
                                    value={acc.bankName}
                                    onChange={(e) => updateBankAccountRow(acc.id, 'bankName', e.target.value)}
                                    placeholder="Chọn hoặc nhập tên ngân hàng"
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Chi nhánh mở thẻ */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={acc.branch}
                                    onChange={(e) => updateBankAccountRow(acc.id, 'branch', e.target.value)}
                                    placeholder="Chi nhánh mở thẻ..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Mặc định: dạng tick, 1 thời điểm chỉ được 1 tick chọn */}
                                <td className="p-2 text-center border-r border-gray-200">
                                  <div className="flex items-center justify-center">
                                    <label className="relative inline-flex items-center justify-center cursor-pointer p-1">
                                      <input 
                                        type="checkbox"
                                        checked={acc.isDefault}
                                        onChange={() => handleDefaultBankToggle(acc.id)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-0 cursor-pointer accent-blue-600"
                                        title="Tick chọn đặt làm tài khoản mặc định (1 thời điểm chỉ được 1 tick chọn)"
                                      />
                                    </label>
                                  </div>
                                </td>

                                {/* Lưu ý */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={acc.notes}
                                    onChange={(e) => updateBankAccountRow(acc.id, 'notes', e.target.value)}
                                    placeholder="Ghi chú / Lưu ý..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Up files */}
                                <td className="p-2 border-r border-gray-200">
                                  {acc.fileName ? (
                                    <div className="flex items-center justify-between gap-1.5 bg-blue-50/70 border border-blue-200 rounded px-2 py-1 text-xs text-blue-800">
                                      <span className="truncate max-w-[100px] font-medium" title={acc.fileName}>
                                        {acc.fileName}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const blob = new Blob([`Tệp đính kèm tài khoản ngân hàng: ${acc.fileName}\nChủ tài khoản: ${acc.accountHolder}\nSố tài khoản: ${acc.accountNumber}\nNgân hàng: ${acc.bankName} - ${acc.branch}`], { type: 'text/plain;charset=utf-8' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = acc.fileName || 'file.txt';
                                            a.click();
                                            URL.revokeObjectURL(url);
                                          }}
                                          className="text-gray-500 hover:text-blue-600 cursor-pointer p-0.5"
                                          title="Tải về"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </button>
                                        <label className="text-blue-600 hover:text-blue-800 cursor-pointer p-0.5" title="Đổi file khác">
                                          <Upload className="w-3.5 h-3.5" />
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                updateBankAccountRow(acc.id, 'fileName', file.name);
                                              }
                                            }} 
                                          />
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => updateBankAccountRow(acc.id, 'fileName', '')}
                                          className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                          title="Gỡ file"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <label className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer border border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/80 hover:bg-blue-50/50 rounded px-2.5 py-1.5 w-full justify-center transition-colors">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Tải file lên</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            updateBankAccountRow(acc.id, 'fileName', file.name);
                                          }
                                        }} 
                                      />
                                    </label>
                                  )}
                                </td>

                                {/* Thao tác */}
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => deleteBankAccountRow(acc.id)}
                                    disabled={bankAccounts.length <= 1}
                                    className={`p-1.5 rounded transition-colors ${
                                      bankAccounts.length <= 1 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer'
                                    }`}
                                    title={bankAccounts.length <= 1 ? "Cần giữ ít nhất 1 dòng tài khoản" : "Xóa dòng"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* Footer row: Thêm mới dòng */}
                      <div 
                        onClick={addBankAccountRow}
                        className="p-2.5 flex items-center justify-center sm:justify-start gap-1.5 bg-gray-50/70 border-t border-dashed border-gray-200 text-blue-600 hover:bg-blue-50/60 font-medium text-xs cursor-pointer transition-colors select-none"
                      >
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>Bấm vào đây để thêm mới dòng tài khoản nhận (F2)</span>
                      </div>
                    </div>

                    <datalist id="vietnam-banks-list">
                      {POPULAR_BANKS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>
                )}

                {/* Khi tick chọn Tiền mặt: ẩn "Tài khoản nhận", hiển thị khu vực "Thông tin người nhận" */}
                {paymentMethod === 'Tiền mặt' && (
                  <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-blue-600" />
                        <h3 className="text-blue-600 font-semibold text-[15px]">Thông tin người nhận</h3>
                        <span className="text-xs text-gray-400 font-normal hidden sm:inline">
                          (Thông tin người nhận tiền mặt và địa điểm chi trả lương trực tiếp)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={addCashRecipientRow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm mới dòng
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#f0f5fa] text-gray-700 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="p-2.5 text-center w-[50px] border-r border-gray-200">STT</th>
                            <th className="p-2.5 w-[170px] border-r border-gray-200">
                              Số CCCD <span className="text-red-500">*</span>
                            </th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Họ tên người nhận <span className="text-red-500">*</span>
                            </th>
                            <th className="p-2.5 min-w-[220px] border-r border-gray-200">
                              Địa điểm nhận tiền <span className="text-red-500">*</span>
                            </th>
                            <th className="p-2.5 text-center w-[90px] border-r border-gray-200">
                              Mặc định
                            </th>
                            <th className="p-2.5 min-w-[180px] border-r border-gray-200">
                              Lưu ý
                            </th>
                            <th className="p-2.5 w-[200px] border-r border-gray-200">
                              Up files
                            </th>
                            <th className="p-2.5 text-center w-[60px]">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {cashRecipients.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-4 text-center text-gray-400 italic">
                                Chưa có thông tin người nhận tiền nào. Bấm "Thêm mới dòng" để thêm.
                              </td>
                            </tr>
                          ) : (
                            cashRecipients.map((recipient, index) => (
                              <tr key={recipient.id} className="hover:bg-blue-50/20 transition-colors">
                                {/* STT */}
                                <td className="p-2.5 text-center text-gray-600 font-medium border-r border-gray-200">
                                  {index + 1}
                                </td>

                                {/* Số CCCD */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={recipient.idCard}
                                    onChange={(e) => updateCashRecipientRow(recipient.id, 'idCard', e.target.value)}
                                    placeholder="Số CCCD người nhận..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Họ tên người nhận */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={recipient.fullName}
                                    onChange={(e) => updateCashRecipientRow(recipient.id, 'fullName', e.target.value.toUpperCase())}
                                    placeholder="HỌ TÊN NGƯỜI NHẬN"
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs uppercase font-medium outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Địa điểm nhận tiền */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={recipient.pickupLocation}
                                    onChange={(e) => updateCashRecipientRow(recipient.id, 'pickupLocation', e.target.value)}
                                    placeholder="Địa điểm nhận tiền (VD: Phòng Kế toán / Văn phòng công ty)..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Mặc định */}
                                <td className="p-2 text-center border-r border-gray-200">
                                  <div className="flex items-center justify-center">
                                    <label className="relative inline-flex items-center justify-center cursor-pointer p-1">
                                      <input 
                                        type="checkbox"
                                        checked={recipient.isDefault}
                                        onChange={() => handleDefaultCashRecipientToggle(recipient.id)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-0 cursor-pointer accent-blue-600"
                                        title="Tick chọn đặt làm người nhận mặc định (1 thời điểm chỉ được 1 tick chọn)"
                                      />
                                    </label>
                                  </div>
                                </td>

                                {/* Lưu ý */}
                                <td className="p-2 border-r border-gray-200">
                                  <input 
                                    type="text"
                                    value={recipient.notes}
                                    onChange={(e) => updateCashRecipientRow(recipient.id, 'notes', e.target.value)}
                                    placeholder="Ghi chú / Lưu ý (nếu có)..."
                                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-gray-800 bg-white"
                                  />
                                </td>

                                {/* Up files */}
                                <td className="p-2 border-r border-gray-200">
                                  {recipient.fileName ? (
                                    <div className="flex items-center justify-between gap-1.5 bg-blue-50/70 border border-blue-200 rounded px-2 py-1 text-xs text-blue-800">
                                      <span className="truncate max-w-[100px] font-medium" title={recipient.fileName}>
                                        {recipient.fileName}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const blob = new Blob([`Tệp đính kèm: ${recipient.fileName}\nNgười nhận: ${recipient.fullName}\nCCCD: ${recipient.idCard}`], { type: 'text/plain;charset=utf-8' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = recipient.fileName || 'file.txt';
                                            a.click();
                                            URL.revokeObjectURL(url);
                                          }}
                                          className="text-gray-500 hover:text-blue-600 cursor-pointer p-0.5"
                                          title="Tải về"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </button>
                                        <label className="text-blue-600 hover:text-blue-800 cursor-pointer p-0.5" title="Đổi file khác">
                                          <Upload className="w-3.5 h-3.5" />
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                updateCashRecipientRow(recipient.id, 'fileName', file.name);
                                              }
                                            }} 
                                          />
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => updateCashRecipientRow(recipient.id, 'fileName', '')}
                                          className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                          title="Gỡ file"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <label className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer border border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/80 hover:bg-blue-50/50 rounded px-2.5 py-1.5 w-full justify-center transition-colors">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Tải file lên</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            updateCashRecipientRow(recipient.id, 'fileName', file.name);
                                          }
                                        }} 
                                      />
                                    </label>
                                  )}
                                </td>

                                {/* Thao tác */}
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => deleteCashRecipientRow(recipient.id)}
                                    disabled={cashRecipients.length <= 1}
                                    className={`p-1.5 rounded transition-colors ${
                                      cashRecipients.length <= 1 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer'
                                    }`}
                                    title={cashRecipients.length <= 1 ? "Cần giữ ít nhất 1 dòng người nhận" : "Xóa dòng"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* Footer row: Thêm mới dòng */}
                      <div 
                        onClick={addCashRecipientRow}
                        className="p-2.5 flex items-center justify-center sm:justify-start gap-1.5 bg-gray-50/70 border-t border-dashed border-gray-200 text-blue-600 hover:bg-blue-50/60 font-medium text-xs cursor-pointer transition-colors select-none"
                      >
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>Bấm vào đây để thêm mới dòng thông tin người nhận tiền</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : contractTargetType === 'Cộng tác viên' ? (
                <>
                  {/* Card cho Cộng tác viên */}
                  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h3 className="text-purple-600 font-semibold text-[15px]">1. Thiết lập Hợp đồng Cộng tác viên</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Số / Mã Hợp đồng CTV <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={contractCode || 'HĐCTV-2026/01'}
                          onChange={(e) => setContractCode(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Lĩnh vực / Chuyên môn hỗ trợ
                        </label>
                        <input 
                          type="text"
                          placeholder="VD: Cố vấn kỹ thuật sơn, điện tử ô tô..."
                          defaultValue="Tư vấn dịch vụ & hỗ trợ kỹ thuật"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Hình thức thù lao / Hoa hồng
                        </label>
                        <select
                          defaultValue="Theo ca / công việc phát sinh"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Theo ca / công việc phát sinh">Theo ca / công việc phát sinh</option>
                          <option value="Khoán định kỳ hàng tháng">Khoán định kỳ hàng tháng</option>
                          <option value="Hoa hồng theo % doanh số dịch vụ">Hoa hồng theo % doanh số dịch vụ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày bắt đầu cộng tác
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="01/02/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày kết thúc thỏa thuận
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="31/12/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Mức thù lao thỏa thuận (VND)
                        </label>
                        <input 
                          type="text"
                          defaultValue="8,000,000"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : contractTargetType === 'Môi giới' ? (
                <>
                  {/* Card cho Môi giới */}
                  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-emerald-600 font-semibold text-[15px]">1. Thiết lập Hợp đồng Môi giới</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Số / Mã Hợp đồng Môi giới <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={contractCode || 'HĐMG-2026/01'}
                          onChange={(e) => setContractCode(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Phạm vi / Lĩnh vực môi giới
                        </label>
                        <select
                          defaultValue="Giới thiệu khách hàng dịch vụ sửa chữa, phụ tùng"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Giới thiệu khách hàng dịch vụ sửa chữa, phụ tùng">Giới thiệu khách hàng dịch vụ sửa chữa, phụ tùng</option>
                          <option value="Môi giới mua bán xe và phụ kiện garage">Môi giới mua bán xe và phụ kiện garage</option>
                          <option value="Kết nối garage đối tác và nhà cung cấp">Kết nối garage đối tác và nhà cung cấp</option>
                          <option value="Môi giới hợp đồng dịch vụ fleet / doanh nghiệp">Môi giới hợp đồng dịch vụ fleet / doanh nghiệp</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Hình thức hoa hồng môi giới
                        </label>
                        <select
                          defaultValue="Tỷ lệ % trên giá trị hợp đồng / đơn hàng"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Tỷ lệ % trên giá trị hợp đồng / đơn hàng">Tỷ lệ % trên giá trị hợp đồng / đơn hàng</option>
                          <option value="Mức phí cố định trên mỗi lượt giới thiệu thành công">Mức phí cố định trên mỗi lượt giới thiệu thành công</option>
                          <option value="Hoa hồng định kỳ theo doanh thu phát sinh">Hoa hồng định kỳ theo doanh thu phát sinh</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày bắt đầu thỏa thuận
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="01/02/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày kết thúc thỏa thuận
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="31/12/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Tỷ lệ / Mức phí hoa hồng thỏa thuận
                        </label>
                        <input 
                          type="text"
                          defaultValue="5% - 10% doanh số dịch vụ"
                          placeholder="VD: 5% hoặc 1.000.000 đ/xe"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Kỳ đối soát & Điều khoản thanh toán
                        </label>
                        <input 
                          type="text"
                          defaultValue="Đối soát vào ngày 25 hàng tháng, thanh toán chuyển khoản trước ngày 05 tháng kế tiếp."
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Trạng thái thỏa thuận
                        </label>
                        <select
                          defaultValue="Đang hợp tác"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Đang hợp tác">Đang hợp tác</option>
                          <option value="Tạm dừng">Tạm dừng</option>
                          <option value="Đã chấm dứt">Đã chấm dứt</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Card cho Nhân sự B2B */}
                  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 w-full">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-indigo-600 font-semibold text-[15px]">1. Thiết lập Hợp đồng Dịch vụ Nhân sự B2B</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Số / Mã Hợp đồng B2B <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={contractCode || 'HĐB2B-2026/01'}
                          onChange={(e) => setContractCode(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Đơn vị / Công ty cung ứng đối tác
                        </label>
                        <input 
                          type="text"
                          defaultValue="Công ty Cổ phần Dịch vụ Kỹ thuật Ô tô Việt"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Gói dịch vụ / SLA cam kết
                        </label>
                        <select
                          defaultValue="Cung ứng kỹ thuật viên chuyên sâu theo dự án"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white text-gray-800"
                        >
                          <option value="Cung ứng kỹ thuật viên chuyên sâu theo dự án">Cung ứng kỹ thuật viên chuyên sâu theo dự án</option>
                          <option value="Bảo trì hệ thống xưởng định kỳ">Bảo trì hệ thống xưởng định kỳ</option>
                          <option value="Cố vấn chẩn đoán & nghiệm thu xe">Cố vấn chẩn đoán & nghiệm thu xe</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày bắt đầu hiệu lực
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="01/01/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Ngày kết thúc hợp đồng
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            defaultValue="31/12/2026"
                            placeholder="DD/MM/YYYY"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800"
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium text-xs mb-1.5">
                          Giá trị hợp đồng khung (VND/tháng)
                        </label>
                        <input 
                          type="text"
                          defaultValue="25,000,000"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: PHIẾU LƯƠNG */}
          {activeTab === 'payslip' && (
            <div className="space-y-6">
              {/* KHU VỰC 1: THÔNG TIN CHUNG */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Thông tin chung
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 italic hidden sm:inline">
                      Dữ liệu liên kết từ Tab "Thiết lập Hợp đồng / PLHĐ" & "Thông tin gia đình"
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contract_setup')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                    >
                      Chỉnh sửa Hợp đồng
                    </button>
                  </div>
                </div>

                {/* DÒNG 1: Số hiệu hợp đồng, Bộ phận, Chức vụ/ Vị trí, Bậc, Lương hàng tháng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Field 1: Số hiệu hợp đồng */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Số hiệu hợp đồng
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={laborContractCode || 'Chưa thiết lập'}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800 font-mono font-medium cursor-not-allowed select-all"
                      title="Lấy từ Tab Thiết lập Hợp đồng / PLHĐ > khu vực Thông tin Hợp đồng"
                    />
                  </div>

                  {/* Field 2: Bộ phận */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Bộ phận
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={laborDepartment || 'Phòng Tư vấn, Dịch vụ'}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800 font-medium cursor-not-allowed"
                      title="Lấy từ Tab Thiết lập Hợp đồng / PLHĐ > khu vực Thông tin Hợp đồng"
                    />
                  </div>

                  {/* Field 3: Chức vụ / Vị trí */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Chức vụ / Vị trí
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={laborPosition || 'Quản lý xưởng'}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800 font-medium cursor-not-allowed"
                      title="Lấy từ Tab Thiết lập Hợp đồng / PLHĐ > khu vực Thông tin Hợp đồng"
                    />
                  </div>

                  {/* Field 4: Bậc */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Bậc
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={laborRank || 'Bậc 1'}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800 font-medium cursor-not-allowed"
                      title="Lấy từ Tab Thiết lập Hợp đồng / PLHĐ > khu vực Thông tin Hợp đồng"
                    />
                  </div>

                  {/* Field 5: Lương hàng tháng */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Lương hàng tháng
                      <span className="text-[11px] text-blue-600 font-normal ml-1">(Quy ước)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formattedMonthlySalary}
                      className="w-full border border-blue-200 rounded px-3 py-2 text-sm bg-blue-50/70 text-blue-900 font-bold cursor-not-allowed select-all"
                      title="Lấy từ Tab Thiết lập Hợp đồng / PLHĐ > khu vực Thông tin Hợp đồng"
                    />
                  </div>
                </div>

                {/* DÒNG 2: Tổng số người phụ thuộc, Tên Cấu trúc Lương */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  {/* Field: Tổng số người phụ thuộc */}
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1.5">
                      Tổng số người phụ thuộc
                      <span className="text-[11px] text-gray-500 font-normal ml-1">
                        (Tính từ Tab "Thông tin gia đình" &gt; Đăng ký NPT)
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={`${(familyRelatives || []).filter(r => r.isDependent).length} người`}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-900 font-bold cursor-not-allowed"
                        title="Tổng số bản ghi có tích chọn ở cột Đăng ký NPT trong bảng Nhân thân và Người phụ thuộc & Liên hệ khẩn cấp"
                      />
                      {(familyRelatives || []).filter(r => r.isDependent).length > 0 && (
                        <span className="absolute right-3 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                          Giảm trừ: {((familyRelatives || []).filter(r => r.isDependent).length * 4400000).toLocaleString('vi-VN')} đ/tháng
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field: Cấu trúc lương */}
                  <div>
                    <label className="block text-gray-700 font-semibold text-xs mb-1.5 text-blue-900">
                      Cấu trúc lương <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedStructure.code}
                      onChange={(e) => setSelectedStructureCode(e.target.value)}
                      className="w-full border-2 border-blue-500 rounded px-3 py-2 text-sm bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-300 outline-none shadow-xs"
                      title="Chọn cấu trúc lương từ danh mục Cấu trúc Lương để áp dụng công thức cho nhân viên"
                    >
                      {availableStructures.map((s: any) => (
                        <option key={s.id || s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* KHU VỰC 2: BẢNG CHI TIẾT CẤU TRÚC LƯƠNG */}
              {/* (Giao diện giống "Mô phỏng phiếu lương mẫu" trong menu Cấu trúc Lương) */}
              <div className="space-y-6">
                {/* 1. Các thẻ tóm tắt chỉ số KPI (Gross - Deduct - Net) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tổng thu nhập (Lương Gross)
                      </span>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {computedPayslip.totalGross.toLocaleString('vi-VN')} đ
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5 block">
                        Bao gồm lương công, phụ cấp & thưởng KPI
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                      Gross
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tổng các khoản giảm trừ
                      </span>
                      <div className="text-2xl font-bold text-rose-600 mt-1">
                        −{computedPayslip.totalDeductions.toLocaleString('vi-VN')} đ
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5 block">
                        {computedPayslip.deductionsSubtitle}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg border border-rose-100 shrink-0">
                      Deduct
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-md p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                        Lương thực lĩnh chuyển khoản (Net)
                      </span>
                      <div className="text-3xl font-extrabold text-white mt-1">
                        {computedPayslip.netSalary.toLocaleString('vi-VN')} đ
                      </div>
                      <span className="text-xs text-blue-100 mt-0.5 block">
                        Số tiền thực nhận chuyển về tài khoản nhân viên
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-xs shrink-0">
                      Net
                    </div>
                  </div>
                </div>

                {/* 3. Bảng chi tiết các khoản mục theo Cấu trúc Lương */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Bảng chi tiết Cấu trúc Lương
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        Cấu trúc đang chọn: <strong className="text-blue-700 font-semibold">{selectedStructure.name}</strong>
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                        {computedPayslip.activeComponentsCount} khoản mục
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-700 font-semibold">
                        <tr>
                          <th className="p-3.5 w-14 text-center border-r border-gray-200">STT</th>
                          <th className="p-3.5 border-r border-gray-200 w-[280px]">Khoản mục thu nhập / Khấu trừ</th>
                          <th className="p-3.5 border-r border-gray-200 w-[150px]">Nhóm quy tắc</th>
                          <th className="p-3.5 border-r border-gray-200">Diễn giải & Công thức tính áp dụng</th>
                          <th className="p-3.5 text-right w-[180px]">Số tiền mô phỏng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* SECTION 1: THU NHẬP */}
                        <tr className="bg-gray-50/70 border-b border-gray-200">
                          <td colSpan={5} className="p-2.5 px-4 font-bold text-blue-900 text-xs uppercase tracking-wider">
                            I. Các khoản thu nhập từ lương & Phụ cấp
                          </td>
                        </tr>
                        {computedPayslip.incomeList.map((item, idx) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                            <td className="p-3.5 text-center text-gray-500 border-r border-gray-200">{idx + 1}</td>
                            <td className="p-3.5 font-bold text-gray-900 border-r border-gray-200">
                              <div className="flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.isManual && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                                    Tự nhập
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 border-r border-gray-200">
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.ruleGroupName)}`}>
                                {item.ruleGroupName}
                              </span>
                            </td>
                            <td className="p-3.5 text-gray-600 border-r border-gray-200 font-mono text-xs">
                              {item.explanation}
                            </td>
                            <td className="p-3.5 text-right font-bold text-gray-900">
                              {item.isManual ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={item.amount > 0 ? item.amount.toLocaleString('vi-VN') : ''}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/[^\d]/g, '');
                                      const val = raw ? parseInt(raw, 10) : 0;
                                      setManualAllowances(prev => ({
                                        ...prev,
                                        [item.manualKey || item.id]: val
                                      }));
                                    }}
                                    placeholder="0"
                                    className="w-28 text-right font-bold text-blue-700 bg-white border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none shadow-2xs hover:border-blue-400 transition-colors"
                                  />
                                  <span className="text-gray-500 text-xs font-semibold">đ</span>
                                </div>
                              ) : (
                                <span>{item.amount.toLocaleString('vi-VN')} đ</span>
                              )}
                            </td>
                          </tr>
                        ))}

                        {/* SECTION 2: TỔNG GROSS */}
                        <tr className="border-y-2 border-emerald-300 bg-emerald-50/50">
                          <td className="p-3.5 text-center font-bold text-emerald-800 border-r border-emerald-200">★</td>
                          <td className="p-3.5 font-bold text-emerald-950 border-r border-emerald-200 text-sm">
                            II. TỔNG THU NHẬP (LƯƠNG GROSS)
                          </td>
                          <td className="p-3.5 border-r border-emerald-200 text-emerald-800 font-semibold text-xs">Tổng hợp</td>
                          <td className="p-3.5 text-emerald-800 border-r border-emerald-200 text-xs font-mono">
                            Tổng hợp toàn bộ các khoản lương thời gian, phụ cấp và thưởng hiệu quả
                          </td>
                          <td className="p-3.5 text-right font-black text-emerald-700 text-base">
                            {computedPayslip.totalGross.toLocaleString('vi-VN')} đ
                          </td>
                        </tr>

                        {/* SECTION 3: GIẢM TRỪ */}
                        <tr className="bg-gray-50/70 border-b border-gray-200">
                          <td colSpan={5} className="p-2.5 px-4 font-bold text-rose-900 text-xs uppercase tracking-wider">
                            III. Các khoản trích nộp theo lương & Thuế TNCN
                          </td>
                        </tr>
                        {computedPayslip.deductionList.map((item, idx) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors text-rose-900">
                            <td className="p-3.5 text-center text-gray-500 border-r border-gray-200">{computedPayslip.incomeList.length + idx + 1}</td>
                            <td className="p-3.5 font-semibold border-r border-gray-200">{item.name}</td>
                            <td className="p-3.5 border-r border-gray-200">
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.ruleGroupName)}`}>
                                {item.ruleGroupName}
                              </span>
                            </td>
                            <td className="p-3.5 text-gray-600 border-r border-gray-200 font-mono text-xs">
                              {item.explanation}
                            </td>
                            <td className="p-3.5 text-right font-bold text-rose-600">
                              −{item.amount.toLocaleString('vi-VN')} đ
                            </td>
                          </tr>
                        ))}

                        {/* SECTION 4: THỰC LĨNH NET */}
                        <tr className="bg-[#2563EB] text-white border-t-2 border-blue-700">
                          <td className="p-4 text-center font-bold text-white border-r border-blue-500/40">★</td>
                          <td className="p-4 font-bold text-white border-r border-blue-500/40 text-base">
                            IV. LƯƠNG THỰC LĨNH CHUYỂN KHOẢN (NET)
                          </td>
                          <td className="p-4 border-r border-blue-500/40 text-blue-100 font-semibold text-xs">Thực nhận</td>
                          <td className="p-4 text-blue-100 border-r border-blue-500/40 text-xs font-mono">
                            Tổng thu nhập (Gross) − Tổng các khoản giảm trừ (Bảo hiểm & Thuế)
                          </td>
                          <td className="p-4 text-right font-black text-white text-xl">
                            {computedPayslip.netSalary.toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THÔNG TIN GIA ĐÌNH */}
          {activeTab === 'family_info' && (
            <div className="space-y-6">
              {/* Khu vực 1: Tình trạng hôn nhân */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                {/* Header khu vực với nút Ẩn / Hiện */}
                <div className="p-5 flex items-center justify-between bg-white border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-blue-600 font-medium text-[15px]">Tình trạng hôn nhân</h3>
                    {!showMaritalSection && (
                      <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded">
                        Đang ẩn
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMaritalSection(prev => !prev)}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer select-none"
                    title={showMaritalSection ? "Ẩn khu vực" : "Hiện khu vực"}
                  >
                    {showMaritalSection ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                        <span>Ẩn khu vực</span>
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                        <span>Hiện khu vực</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </>
                    )}
                  </button>
                </div>

                {/* Nội dung khu vực: Button Độc thân & Đã kết hôn trên cùng 1 dòng */}
                {showMaritalSection && (
                  <div className="p-5 bg-white">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                        Tình trạng hôn nhân:
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMaritalStatus('Độc thân')}
                          className={`px-6 py-2 rounded text-sm font-medium transition-all border cursor-pointer ${
                            maritalStatus === 'Độc thân'
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs font-semibold'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Độc thân
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaritalStatus('Đã kết hôn')}
                          className={`px-6 py-2 rounded text-sm font-medium transition-all border cursor-pointer ${
                            maritalStatus === 'Đã kết hôn'
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs font-semibold'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Đã kết hôn
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Khu vực 2: Nhân thân và Người phụ thuộc & Liên hệ khẩn cấp */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                {/* Header khu vực với thống kê & nút Ẩn / Hiện */}
                <div className="p-5 flex items-center justify-between bg-white border-b border-gray-100 flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-blue-600 font-medium text-[15px]">
                      Nhân thân và Người phụ thuộc & Liên hệ khẩn cấp
                    </h3>
                    {!showFamilyRelSection ? (
                      <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded">
                        Đang ẩn
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded font-medium border border-gray-200">
                          {familyRelatives.length} người thân
                        </span>
                        {familyRelatives.filter(r => r.isDependent).length > 0 && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                            {familyRelatives.filter(r => r.isDependent).length} NPT
                          </span>
                        )}
                        {familyRelatives.filter(r => r.isEmergencyContact).length > 0 && (
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            {familyRelatives.filter(r => r.isEmergencyContact).length} SOS
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {showFamilyRelSection && (
                      <button
                        type="button"
                        onClick={handleAddRelative}
                        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded font-medium transition-colors cursor-pointer select-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm người thân</span>
                      </button>
                    )}

                    {/* Nút Ẩn / Hiện khu vực */}
                    <button
                      type="button"
                      onClick={() => setShowFamilyRelSection(prev => !prev)}
                      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer select-none"
                      title={showFamilyRelSection ? "Ẩn khu vực" : "Hiện khu vực"}
                    >
                      {showFamilyRelSection ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Ẩn khu vực</span>
                          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          <span>Hiện khu vực</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nội dung bảng danh sách người thân khi hiển thị */}
                {showFamilyRelSection && (
                  <div className="p-5 bg-white space-y-4">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-2xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700 uppercase font-semibold text-[11px] border-b border-gray-200">
                            <th className="py-2.5 px-2 text-center w-[45px] shrink-0">STT</th>
                            <th className="py-2.5 px-3 min-w-[170px]">Họ và tên người thân</th>
                            <th className="py-2.5 px-2 w-[125px]">Mối quan hệ</th>
                            <th className="py-2.5 px-2 w-[130px]">Số CCCD</th>
                            <th className="py-2.5 px-2 w-[125px]">Ngày sinh</th>
                            <th className="py-2.5 px-2 text-center w-[120px] bg-blue-50/70 text-blue-900 border-x border-blue-200">
                              Đăng ký NPT
                            </th>
                            <th className="py-2.5 px-2 text-center w-[135px] bg-red-50 text-red-900 border-x border-red-300">
                              <span className="flex items-center justify-center gap-1 font-bold">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                Liên hệ khẩn cấp
                              </span>
                            </th>
                            <th className="py-2.5 px-2 w-[125px]">Số điện thoại</th>
                            <th className="py-2.5 px-2 w-[150px]">Email</th>
                            <th className="py-2.5 px-2 min-w-[140px]">Lưu ý</th>
                            <th className="py-2.5 px-2 w-[130px] text-center">Up files</th>
                            <th className="py-2.5 px-2 text-center w-[50px]">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {familyRelatives.length === 0 ? (
                            <tr>
                              <td colSpan={12} className="py-8 text-center text-gray-400 italic">
                                Chưa có thông tin nhân thân. Nhấn &quot;Thêm người thân&quot; để bổ sung thông tin.
                              </td>
                            </tr>
                          ) : (
                            familyRelatives.map((rel, index) => (
                              <tr 
                                key={rel.id} 
                                className={`hover:bg-gray-50/80 transition-colors ${
                                  rel.isEmergencyContact ? 'bg-red-50/25' : ''
                                }`}
                              >
                                {/* 1. STT */}
                                <td className="py-2.5 px-2 text-center font-medium text-gray-500">
                                  {index + 1}
                                </td>

                                {/* 2. Họ và tên người thân */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    value={rel.fullName}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'fullName', e.target.value)}
                                    placeholder="Họ và tên người thân..."
                                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 3. Mối quan hệ */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    list="family-rel-options"
                                    value={rel.relationship}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'relationship', e.target.value)}
                                    placeholder="Vợ, Chồng, Con..."
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 4. Số CCCD */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    value={rel.idCard}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'idCard', e.target.value)}
                                    placeholder="12 chữ số..."
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 5. Ngày sinh */}
                                <td className="py-2 px-2">
                                  <input
                                    type="date"
                                    value={rel.dob}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'dob', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 6. Đăng ký Người phụ thuộc: dạng tick (cho tick nhiều) */}
                                <td className="py-2 px-2 text-center bg-blue-50/40 border-x border-blue-100">
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={rel.isDependent}
                                      onChange={(e) => handleUpdateRelative(rel.id, 'isDependent', e.target.checked)}
                                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                                      title="Đăng ký người phụ thuộc giảm trừ gia cảnh"
                                    />
                                    {rel.isDependent && (
                                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1 rounded leading-tight">
                                        NPT
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 7. Liên hệ khẩn cấp: dạng tick (cho tick nhiều), màu sắc quan trọng */}
                                <td className="py-2 px-2 text-center bg-red-50/60 border-x border-red-200">
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={rel.isEmergencyContact}
                                      onChange={(e) => handleUpdateRelative(rel.id, 'isEmergencyContact', e.target.checked)}
                                      className="w-4 h-4 text-red-600 rounded border-red-400 focus:ring-red-500 cursor-pointer accent-red-600 ring-1 ring-red-300"
                                      title="Liên hệ khẩn cấp (SOS)"
                                    />
                                    {rel.isEmergencyContact && (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-red-700 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                                        SOS
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 8. Số điện thoại */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    value={rel.phone}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'phone', e.target.value)}
                                    placeholder="09xx..."
                                    className={`w-full border rounded px-2 py-1.5 text-xs font-mono outline-none bg-white transition-colors ${
                                      rel.isEmergencyContact && !rel.phone
                                        ? 'border-red-400 bg-red-50/20 text-red-900 placeholder:text-red-300'
                                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-400'
                                    }`}
                                  />
                                </td>

                                {/* 9. Email */}
                                <td className="py-2 px-2">
                                  <input
                                    type="email"
                                    value={rel.email}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'email', e.target.value)}
                                    placeholder="email@..."
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 10. Lưu ý */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    value={rel.notes}
                                    onChange={(e) => handleUpdateRelative(rel.id, 'notes', e.target.value)}
                                    placeholder="Ghi chú thêm..."
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white"
                                  />
                                </td>

                                {/* 11. Up files */}
                                <td className="py-2 px-2 text-center">
                                  <div className="flex items-center justify-center">
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleUploadRelativeFile(rel.id, e)}
                                      />
                                      {rel.fileName ? (
                                        <span 
                                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded max-w-[110px] truncate hover:bg-emerald-100 transition-colors"
                                          title={rel.fileName}
                                        >
                                          <Paperclip className="w-3 h-3 shrink-0" />
                                          <span className="truncate">{rel.fileName}</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2 py-1 rounded transition-colors">
                                          <Upload className="w-3 h-3 text-gray-500" />
                                          Tải file
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                </td>

                                {/* 12. Xóa */}
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRelative(rel.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Xóa người thân này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Datalist gợi ý Mối quan hệ */}
                    <datalist id="family-rel-options">
                      <option value="Vợ" />
                      <option value="Chồng" />
                      <option value="Con" />
                      <option value="Bố ruột" />
                      <option value="Mẹ ruột" />
                      <option value="Bố chồng" />
                      <option value="Mẹ chồng" />
                      <option value="Bố vợ" />
                      <option value="Mẹ vợ" />
                      <option value="Anh ruột" />
                      <option value="Chị ruột" />
                      <option value="Em ruột" />
                      <option value="Người giám hộ" />
                    </datalist>

                    {/* Footer gợi ý & Nút thêm nhanh */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-4 flex-wrap text-[11px]">
                        <span className="flex items-center gap-1 text-blue-700">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <strong>Đăng ký Người phụ thuộc:</strong> Được tích chọn nhiều người để đăng ký giảm trừ gia cảnh thuế TNCN.
                        </span>
                        <span className="flex items-center gap-1 text-red-700 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <strong>Liên hệ khẩn cấp:</strong> Được tích chọn nhiều người, được bảo hộ ưu tiên khi xảy ra sự cố cấp cứu y tế hoặc sự cố nguy hiểm.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRelative}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Thêm dòng người thân</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-white shrink-0">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[14px]">
            Đóng
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={cccdError.isError}
            className={`px-5 py-2 text-white rounded font-medium transition-colors text-[14px] ${cccdError.isError ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700'}`}
          >
            Ghi nhận
          </button>
        </div>
    </div>
  );
};
