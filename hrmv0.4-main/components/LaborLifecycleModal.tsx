import React, { useState, useMemo, useEffect } from 'react';
import {
  UserCheck,
  Search,
  ChevronDown,
  ArrowUpDown,
  FileText,
  Paperclip,
  Briefcase,
  Calendar,
  Mail,
  Check,
  Eye,
  FolderOpen,
  Upload,
  ExternalLink,
  Trash2,
  GitBranch,
  GitCommit,
  ArrowLeft,
  X,
  Users,
  Filter,
  RotateCcw
} from 'lucide-react';
import { Laborer } from './LaborDetailModal';
import { MOCK_GRADES } from './SalaryGradeList';

export interface ContractMilestone {
  id: string;
  contractTypeLabel: string; // VD: 'Hợp đồng lao động', 'Phụ lục hợp đồng', 'Thỏa thuận CTV', 'Hợp đồng thử việc'
  contractFullType: string;
  contractCode: string;
  status: 'Đang hiệu lực' | 'Hết hiệu lực' | 'Chờ ký' | string;
  effectiveDate: string; // DD/MM/YYYY
  isoEffectiveDate: string; // YYYY-MM-DD
  expiryDate: string; // DD/MM/YYYY
  createdAt: string; // YYYY-MM-DD HH:mm
  targetType: 'Người lao động' | 'Cộng tác viên' | 'Môi giới' | 'Nhân sự B2B' | string;
  department: string;
  position: string;
  rank: string;
  monthlySalary: string;
  paymentMethod: 'Chuyển khoản' | 'Tiền mặt' | string;
  officialWorkDate: string;
  employeeCode: string;
  timekeepingCode: string;
  directManager: string;
  companyEmail: string;
  summaryQuote: string;
  nodeKind: 'contract' | 'appendix' | 'termination';
}

export interface StoredDocumentItem {
  id: string;
  docCategory: 'CV' | 'CCCD' | 'Văn bằng' | 'Giấy khám sức khỏe' | 'Chứng chỉ' | string;
  title: string;
  subtitle: string;
  targetType: 'Người lao động' | 'Cộng tác viên' | 'Môi giới' | 'Nhân sự B2B' | string;
  effectiveDate: string; // DD/MM/YYYY
  isoEffectiveDate: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD HH:mm
  status: 'Đã xác thực' | 'Đang hiệu lực' | 'Đã đối chiếu' | 'Hết hiệu lực' | string;
}

interface LaborLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  laborers: Laborer[];
  initialLaborer?: Laborer | null;
}

const getSalaryFromGrade = (position?: string, rank?: string): string => {
  if (!position) return '20.000.000 VNĐ';
  const normPos = position.toLowerCase().trim();
  let matchedGrade = MOCK_GRADES.find(g => g.name.toLowerCase() === normPos);
  if (!matchedGrade) {
    if (normPos.includes('kế toán')) matchedGrade = MOCK_GRADES.find(g => g.code === 'KT');
    else if (normPos.includes('quản lý') || normPos.includes('quản đốc')) matchedGrade = MOCK_GRADES.find(g => g.code === 'QX');
    else if (normPos.includes('kỹ thuật') || normPos.includes('ktv')) matchedGrade = MOCK_GRADES.find(g => g.code === 'GR_KTV');
    else if (normPos.includes('cố vấn')) matchedGrade = MOCK_GRADES.find(g => g.code === 'GR_CV');
    else if (normPos.includes('phó giám đốc')) matchedGrade = MOCK_GRADES.find(g => g.code === 'PGD');
    else if (normPos.includes('giám đốc')) matchedGrade = MOCK_GRADES.find(g => g.code === 'GD');
  }
  if (!matchedGrade || !matchedGrade.steps || matchedGrade.steps.length === 0) {
    return '20.000.000 VNĐ';
  }
  const normRank = (rank || '').toLowerCase().trim();
  const step =
    matchedGrade.steps.find(s => s.name.toLowerCase() === normRank) ||
    matchedGrade.steps[0];
  return step.salary.toLocaleString('vi-VN') + ' VNĐ';
};

const toIsoDate = (ddmmyyyy?: string, fallback = '2026-01-01'): string => {
  if (!ddmmyyyy) return fallback;
  const parts = ddmmyyyy.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return fallback;
};

const buildLifecycleDataForLaborer = (lab: Laborer): {
  milestones: ContractMilestone[];
  documents: StoredDocumentItem[];
} => {
  const empCode = lab.employeeCode || 'NV-001';
  const tkCode = lab.timekeepingCode || empCode.replace('NV-', 'CC-');
  const dept = lab.department || 'Phòng Tư vấn, Dịch vụ';
  const pos = lab.position || 'Quản lý xưởng';
  const rnk = lab.rank || 'Bậc 1';
  const target = lab.contractTargetType || 'Người lao động';
  const salaryStr = getSalaryFromGrade(pos, rnk);
  const workDate = lab.officialWorkDate || '01/01/2024';
  const manager = lab.directManager || 'Trần Văn Giám Đốc';
  const compEmail = lab.companyEmail || lab.email || 'nhanvien@company.vn';
  const payMethod = lab.paymentMethod || 'Chuyển khoản';

  if (empCode === 'NV-001' || lab.name.toUpperCase().includes('LÊ XUÂN NGUYÊN')) {
    return {
      milestones: [
        {
          id: 'ms-nv001-1',
          contractTypeLabel: 'Hợp đồng lao động',
          contractFullType: lab.contractType || 'Hợp đồng lao động xác định thời hạn',
          contractCode: lab.code || 'HDLD_XDH-2026/01',
          status: lab.status || 'Đang hiệu lực',
          effectiveDate: '01/01/2026',
          isoEffectiveDate: '2026-01-01',
          expiryDate: '31/12/2026',
          createdAt: '2025-12-20 16:00',
          targetType: target,
          department: dept,
          position: pos,
          rank: rnk,
          monthlySalary: salaryStr,
          paymentMethod: payMethod,
          officialWorkDate: workDate,
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Hợp đồng lao động gia hạn niên độ mới 2026 (Hiển thị theo hồ sơ hợp đồng hiện hành).',
          nodeKind: 'contract'
        },
        {
          id: 'ms-nv001-2',
          contractTypeLabel: 'Phụ lục hợp đồng',
          contractFullType: 'Phụ lục hợp đồng',
          contractCode: 'PLHD_01/HDLD-2024',
          status: 'Hết hiệu lực',
          effectiveDate: '01/07/2025',
          isoEffectiveDate: '2025-07-01',
          expiryDate: '31/12/2025',
          createdAt: '2025-06-25 14:15',
          targetType: 'Người lao động',
          department: dept,
          position: pos,
          rank: rnk,
          monthlySalary: salaryStr,
          paymentMethod: payMethod,
          officialWorkDate: '01/01/2024',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: `Điều chỉnh thăng cấp lên ${pos} & áp dụng thang lương ${rnk}.`,
          nodeKind: 'appendix'
        },
        {
          id: 'ms-nv001-3',
          contractTypeLabel: 'Thỏa thuận CTV',
          contractFullType: 'Thỏa thuận CTV',
          contractCode: 'HDCTV_DT-2024/05',
          status: 'Đang hiệu lực',
          effectiveDate: '01/06/2024',
          isoEffectiveDate: '2024-06-01',
          expiryDate: '31/12/2026',
          createdAt: '2024-05-20 08:30',
          targetType: 'Cộng tác viên',
          department: 'Trung tâm Đào tạo Nội bộ',
          position: 'Giảng viên thỉnh giảng nội bộ',
          rank: 'Bậc 1',
          monthlySalary: '8.000.000 VNĐ',
          paymentMethod: 'Chuyển khoản',
          officialWorkDate: '01/06/2024',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Kiêm nhiệm làm chuyên gia đào tạo an toàn lao động ngoài giờ.',
          nodeKind: 'contract'
        },
        {
          id: 'ms-nv001-4',
          contractTypeLabel: 'Hợp đồng lao động',
          contractFullType: 'Hợp đồng lao động xác định thời hạn',
          contractCode: 'HDLD_XDH-2024/01',
          status: 'Hết hiệu lực',
          effectiveDate: '01/01/2024',
          isoEffectiveDate: '2024-01-01',
          expiryDate: '30/06/2025',
          createdAt: '2023-12-25 15:40',
          targetType: 'Người lao động',
          department: dept,
          position: 'Quản lý xưởng phó',
          rank: 'Bậc 1',
          monthlySalary: '18.000.000 VNĐ',
          paymentMethod: 'Chuyển khoản',
          officialWorkDate: '01/01/2024',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Ký hợp đồng xác định thời hạn 24 tháng sau khi hoàn thành thử việc.',
          nodeKind: 'contract'
        },
        {
          id: 'ms-nv001-5',
          contractTypeLabel: 'Hợp đồng thử việc',
          contractFullType: 'Hợp đồng thử việc',
          contractCode: 'HDTV_XDH-2023/11',
          status: 'Hết hiệu lực',
          effectiveDate: '01/11/2023',
          isoEffectiveDate: '2023-11-01',
          expiryDate: '31/12/2023',
          createdAt: '2023-10-28 10:15',
          targetType: 'Người lao động',
          department: dept,
          position: 'Chuyên viên thử việc',
          rank: 'Bậc 1',
          monthlySalary: '15.000.000 VNĐ',
          paymentMethod: 'Chuyển khoản',
          officialWorkDate: '01/11/2023',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Thử việc 2 tháng theo Luật Lao Động. Đánh giá hoàn thành xuất sắc 100% KPI.',
          nodeKind: 'contract'
        }
      ],
      documents: [
        {
          id: 'doc-nv001-1',
          docCategory: 'CV',
          title: 'CV Ứng tuyển Quản lý Vận hành & Dự án',
          subtitle: 'CV tiếng Việt, cập nhật 8 năm kinh nghiệm vận hành.',
          targetType: 'Người lao động',
          effectiveDate: '15/10/2023',
          isoEffectiveDate: '2023-10-15',
          createdAt: '2023-10-12 09:30',
          status: 'Đã xác thực'
        },
        {
          id: 'doc-nv001-2',
          docCategory: 'CCCD',
          title: 'Căn cước công dân gắn chip (Bản số hóa)',
          subtitle: `Số CCCD: ${lab.cccd} cấp bởi Cục CSQLHC về TTXH.`,
          targetType: 'Người lao động',
          effectiveDate: '15/10/2023',
          isoEffectiveDate: '2023-10-15',
          createdAt: '2023-10-12 09:35',
          status: 'Đang hiệu lực'
        },
        {
          id: 'doc-nv001-3',
          docCategory: 'Văn bằng',
          title: 'Bằng Cử nhân Kỹ thuật Cơ khí - ĐH Bách Khoa',
          subtitle: 'Bằng chính quy loại Giỏi.',
          targetType: 'Người lao động',
          effectiveDate: '15/10/2023',
          isoEffectiveDate: '2023-10-15',
          createdAt: '2023-10-12 09:40',
          status: 'Đã đối chiếu'
        },
        {
          id: 'doc-nv001-4',
          docCategory: 'Giấy khám sức khỏe',
          title: 'Giấy chứng nhận sức khỏe đi làm - BV Bạch Mai',
          subtitle: 'Phân loại sức khỏe: Loại 1. Đã hết hạn sau 12 tháng.',
          targetType: 'Người lao động',
          effectiveDate: '20/10/2023',
          isoEffectiveDate: '2023-10-20',
          createdAt: '2023-10-21 14:00',
          status: 'Hết hiệu lực'
        },
        {
          id: 'doc-nv001-5',
          docCategory: 'Chứng chỉ',
          title: 'Chứng chỉ Đào tạo An toàn Vệ sinh Lao động Nhóm 2',
          subtitle: 'Cấp bởi Viện Khoa học ATLĐ, thời hạn 3 năm.',
          targetType: 'Người lao động',
          effectiveDate: '10/03/2025',
          isoEffectiveDate: '2025-03-10',
          createdAt: '2025-03-12 11:00',
          status: 'Đang hiệu lực'
        }
      ]
    };
  }

  if (empCode === 'NV-002' || lab.name.toLowerCase().includes('chế công vinh')) {
    return {
      milestones: [
        {
          id: 'ms-nv002-1',
          contractTypeLabel: 'Hợp đồng lao động',
          contractFullType: lab.contractType || 'Hợp đồng lao động không xác định thời hạn',
          contractCode: lab.code || 'HDLD_KXD-2026/02',
          status: lab.status || 'Đang hiệu lực',
          effectiveDate: '15/02/2026',
          isoEffectiveDate: '2026-02-15',
          expiryDate: '31/12/2028',
          createdAt: '2026-02-10 14:20',
          targetType: target,
          department: dept,
          position: pos,
          rank: rnk,
          monthlySalary: salaryStr,
          paymentMethod: payMethod,
          officialWorkDate: workDate,
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Hợp đồng lao động không xác định thời hạn niên độ 2026 - Phòng Kế toán.',
          nodeKind: 'contract'
        },
        {
          id: 'ms-nv002-2',
          contractTypeLabel: 'Phụ lục hợp đồng',
          contractFullType: 'Phụ lục hợp đồng',
          contractCode: 'PLHD_01/HDLD-2025',
          status: 'Hết hiệu lực',
          effectiveDate: '01/08/2025',
          isoEffectiveDate: '2025-08-01',
          expiryDate: '14/02/2026',
          createdAt: '2025-07-25 10:00',
          targetType: 'Người lao động',
          department: dept,
          position: pos,
          rank: rnk,
          monthlySalary: salaryStr,
          paymentMethod: payMethod,
          officialWorkDate: '15/02/2024',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: `Điều chỉnh nâng ngạch lương lên ${pos} (${rnk}) theo đánh giá định kỳ.`,
          nodeKind: 'appendix'
        },
        {
          id: 'ms-nv002-3',
          contractTypeLabel: 'Hợp đồng lao động',
          contractFullType: 'Hợp đồng lao động xác định thời hạn',
          contractCode: 'HDLD_XDH-2024/02',
          status: 'Hết hiệu lực',
          effectiveDate: '15/02/2024',
          isoEffectiveDate: '2024-02-15',
          expiryDate: '31/07/2025',
          createdAt: '2024-02-10 16:00',
          targetType: 'Người lao động',
          department: dept,
          position: pos,
          rank: '2 năm kinh nghiệm',
          monthlySalary: '12.000.000 VNĐ',
          paymentMethod: 'Chuyển khoản',
          officialWorkDate: '15/02/2024',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Ký hợp đồng lao động xác định thời hạn 24 tháng sau khi hoàn thành thử việc.',
          nodeKind: 'contract'
        },
        {
          id: 'ms-nv002-4',
          contractTypeLabel: 'Hợp đồng thử việc',
          contractFullType: 'Hợp đồng thử việc',
          contractCode: 'HDTV_XDH-2023/12',
          status: 'Hết hiệu lực',
          effectiveDate: '15/12/2023',
          isoEffectiveDate: '2023-12-15',
          expiryDate: '14/02/2024',
          createdAt: '2023-12-12 09:00',
          targetType: 'Người lao động',
          department: dept,
          position: 'Kế toán thử việc',
          rank: '1 năm kinh nghiệm',
          monthlySalary: '10.000.000 VNĐ',
          paymentMethod: 'Chuyển khoản',
          officialWorkDate: '15/12/2023',
          employeeCode: empCode,
          timekeepingCode: tkCode,
          directManager: manager,
          companyEmail: compEmail,
          summaryQuote: 'Thử việc 2 tháng theo Luật Lao Động. Đánh giá hoàn thành xuất sắc 100% KPI.',
          nodeKind: 'contract'
        }
      ],
      documents: [
        {
          id: 'doc-nv002-1',
          docCategory: 'CV',
          title: 'CV Ứng tuyển Chuyên viên Kế toán Tổng hợp',
          subtitle: 'CV tiếng Việt, cập nhật 5 năm kinh nghiệm kế toán & thuế.',
          targetType: 'Người lao động',
          effectiveDate: '10/12/2023',
          isoEffectiveDate: '2023-12-10',
          createdAt: '2023-12-08 09:15',
          status: 'Đã xác thực'
        },
        {
          id: 'doc-nv002-2',
          docCategory: 'CCCD',
          title: 'Căn cước công dân gắn chip (Bản số hóa)',
          subtitle: `Số CCCD: ${lab.cccd} cấp bởi Cục CSQLHC về TTXH.`,
          targetType: 'Người lao động',
          effectiveDate: '10/12/2023',
          isoEffectiveDate: '2023-12-10',
          createdAt: '2023-12-08 09:20',
          status: 'Đang hiệu lực'
        },
        {
          id: 'doc-nv002-3',
          docCategory: 'Văn bằng',
          title: 'Bằng Cử nhân Tài chính Kế toán - ĐH Kinh tế TP.HCM',
          subtitle: 'Bằng chính quy loại Giỏi.',
          targetType: 'Người lao động',
          effectiveDate: '10/12/2023',
          isoEffectiveDate: '2023-12-10',
          createdAt: '2023-12-08 09:25',
          status: 'Đã đối chiếu'
        },
        {
          id: 'doc-nv002-4',
          docCategory: 'Giấy khám sức khỏe',
          title: 'Giấy chứng nhận sức khỏe đi làm - BV Gia Định',
          subtitle: 'Phân loại sức khỏe: Loại 1. Đã hết hạn sau 12 tháng.',
          targetType: 'Người lao động',
          effectiveDate: '12/12/2023',
          isoEffectiveDate: '2023-12-12',
          createdAt: '2023-12-12 14:30',
          status: 'Hết hiệu lực'
        },
        {
          id: 'doc-nv002-5',
          docCategory: 'Chứng chỉ',
          title: 'Chứng chỉ Kế toán trưởng & Khai báo Thuế điện tử',
          subtitle: 'Cấp bởi Bộ Tài chính, thời hạn 5 năm.',
          targetType: 'Người lao động',
          effectiveDate: '15/05/2025',
          isoEffectiveDate: '2025-05-15',
          createdAt: '2025-05-16 10:30',
          status: 'Đang hiệu lực'
        }
      ]
    };
  }

  // Fallback for any newly added record in Hồ sơ hợp đồng
  const isoEff = toIsoDate(workDate, '2026-01-01');
  return {
    milestones: [
      {
        id: `ms-${empCode}-1`,
        contractTypeLabel: lab.contractType || 'Hợp đồng lao động',
        contractFullType: lab.contractType || 'Hợp đồng lao động xác định thời hạn',
        contractCode: lab.code || 'HDLD_XDH-2026/01',
        status: lab.status || 'Đang hiệu lực',
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        expiryDate: '31/12/2026',
        createdAt: `${isoEff} 09:00`,
        targetType: target,
        department: dept,
        position: pos,
        rank: rnk,
        monthlySalary: salaryStr,
        paymentMethod: payMethod,
        officialWorkDate: workDate,
        employeeCode: empCode,
        timekeepingCode: tkCode,
        directManager: manager,
        companyEmail: compEmail,
        summaryQuote: `Ký kết ${lab.contractType || 'Hợp đồng lao động'} tại ${dept} - Chức vụ: ${pos}.`,
        nodeKind: 'contract'
      }
    ],
    documents: [
      {
        id: `doc-${empCode}-1`,
        docCategory: 'CV',
        title: `CV Ứng tuyển ${pos}`,
        subtitle: `Hồ sơ ứng tuyển vị trí ${pos} - ${dept}.`,
        targetType: target,
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        createdAt: `${isoEff} 08:30`,
        status: 'Đã xác thực'
      },
      {
        id: `doc-${empCode}-2`,
        docCategory: 'CCCD',
        title: 'Căn cước công dân gắn chip (Bản số hóa)',
        subtitle: `Số CCCD: ${lab.cccd || '—'} cấp bởi Cục CSQLHC về TTXH.`,
        targetType: target,
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        createdAt: `${isoEff} 08:35`,
        status: 'Đang hiệu lực'
      },
      {
        id: `doc-${empCode}-3`,
        docCategory: 'Văn bằng',
        title: 'Bằng Tốt nghiệp Chuyên ngành Kỹ thuật / Kinh tế',
        subtitle: 'Bằng chính quy đã đối chiếu bản gốc.',
        targetType: target,
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        createdAt: `${isoEff} 08:40`,
        status: 'Đã đối chiếu'
      },
      {
        id: `doc-${empCode}-4`,
        docCategory: 'Giấy khám sức khỏe',
        title: 'Giấy chứng nhận sức khỏe đi làm',
        subtitle: 'Phân loại sức khỏe: Loại 1.',
        targetType: target,
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        createdAt: `${isoEff} 08:45`,
        status: 'Đang hiệu lực'
      },
      {
        id: `doc-${empCode}-5`,
        docCategory: 'Chứng chỉ',
        title: 'Chứng chỉ Đào tạo An toàn Vệ sinh Lao động Nhóm 2',
        subtitle: 'Cấp bởi Viện Khoa học ATLĐ, thời hạn 3 năm.',
        targetType: target,
        effectiveDate: workDate,
        isoEffectiveDate: isoEff,
        createdAt: `${isoEff} 08:50`,
        status: 'Đang hiệu lực'
      }
    ]
  };
};

export const LaborLifecycleModal: React.FC<LaborLifecycleModalProps> = ({
  isOpen,
  onClose,
  laborers,
  initialLaborer
}) => {
  const safeLaborers = laborers && laborers.length > 0 ? laborers : [];
  const [selectedLaborerIndex, setSelectedLaborerIndex] = useState<number>(0);

  // Sync initialLaborer when modal opens
  useEffect(() => {
    if (isOpen && initialLaborer && safeLaborers.length > 0) {
      const idx = safeLaborers.findIndex(
        l =>
          (l.employeeCode && l.employeeCode === initialLaborer.employeeCode) ||
          (l.code && l.code === initialLaborer.code) ||
          l.cccd === initialLaborer.cccd
      );
      if (idx >= 0) {
        setSelectedLaborerIndex(idx);
      } else {
        setSelectedLaborerIndex(0);
      }
    }
  }, [isOpen, initialLaborer, safeLaborers.length]);

  const currentLaborer = safeLaborers[selectedLaborerIndex] || safeLaborers[0];

  const lifecycleData = useMemo(() => {
    if (!currentLaborer) return { milestones: [], documents: [] };
    return buildLifecycleDataForLaborer(currentLaborer);
  }, [currentLaborer]);

  // Target type checkboxes
  const [checkedTargets, setCheckedTargets] = useState<string[]>([
    'Người lao động',
    'Cộng tác viên'
  ]);
  const [sortBy, setSortBy] = useState<'effectiveDate' | 'createdAt'>('effectiveDate');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [filterContractType, setFilterContractType] = useState<string>('ALL');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Selected contract milestone in Section 3
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [paymentMethodOverride, setPaymentMethodOverride] = useState<Record<string, string>>({});
  const [customDocumentsMap, setCustomDocumentsMap] = useState<Record<string, StoredDocumentItem[]>>({});

  useEffect(() => {
    if (lifecycleData.milestones.length > 0) {
      // Default to the second milestone if available (like PLHD_01 in screenshot) or the first active milestone
      const defaultMs = lifecycleData.milestones[0];
      setSelectedMilestoneId(defaultMs.id);
    }
  }, [selectedLaborerIndex, lifecycleData.milestones]);

  const personKey = currentLaborer ? (currentLaborer.employeeCode || currentLaborer.cccd || currentLaborer.name) : '';
  const documentsList = (personKey && customDocumentsMap[personKey]) || lifecycleData.documents;

  const activeMilestone =
    lifecycleData.milestones.find(m => m.id === selectedMilestoneId) ||
    lifecycleData.milestones[0];

  const currentPaymentMethod =
    (activeMilestone && paymentMethodOverride[activeMilestone.id]) ||
    activeMilestone?.paymentMethod ||
    'Chuyển khoản';

  const toggleTargetCheckbox = (targetName: string) => {
    setCheckedTargets(prev =>
      prev.includes(targetName)
        ? prev.filter(t => t !== targetName)
        : [...prev, targetName]
    );
  };

  // Unified timeline items combining milestones + documents
  type TimelineEntry =
    | { entryType: 'milestone'; data: ContractMilestone; sortKeyEffective: string; sortKeyCreated: string }
    | { entryType: 'document'; data: StoredDocumentItem; sortKeyEffective: string; sortKeyCreated: string };

  const timelineEntries = useMemo(() => {
    const list: TimelineEntry[] = [];

    lifecycleData.milestones.forEach(ms => {
      if (checkedTargets.length > 0 && !checkedTargets.includes(ms.targetType)) return;
      if (filterContractType !== 'ALL' && ms.contractTypeLabel !== filterContractType) return;
      if (filterStatus !== 'ALL' && ms.status !== filterStatus) return;

      list.push({
        entryType: 'milestone',
        data: ms,
        sortKeyEffective: ms.isoEffectiveDate,
        sortKeyCreated: ms.createdAt
      });
    });

    documentsList.forEach(doc => {
      if (checkedTargets.length > 0 && !checkedTargets.includes(doc.targetType)) return;
      if (filterDocType !== 'ALL' && doc.docCategory !== filterDocType) return;
      if (filterStatus !== 'ALL' && doc.status !== filterStatus) return;

      list.push({
        entryType: 'document',
        data: doc,
        sortKeyEffective: doc.isoEffectiveDate,
        sortKeyCreated: doc.createdAt
      });
    });

    list.sort((a, b) => {
      const keyA = sortBy === 'effectiveDate' ? a.sortKeyEffective : a.sortKeyCreated;
      const keyB = sortBy === 'effectiveDate' ? b.sortKeyEffective : b.sortKeyCreated;
      return sortDirection === 'desc'
        ? keyB.localeCompare(keyA)
        : keyA.localeCompare(keyB);
    });

    return list;
  }, [lifecycleData.milestones, documentsList, checkedTargets, filterContractType, filterDocType, filterStatus, sortBy, sortDirection]);

  if (!isOpen || !currentLaborer) return null;

  const handleUploadNewDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dd = pad(now.getDate());
    const mm = pad(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());

    const newDoc: StoredDocumentItem = {
      id: `doc-upload-${Date.now()}`,
      docCategory: 'Chứng chỉ',
      title: file.name.replace(/\.[^/.]+$/, ''),
      subtitle: `Tệp số hóa tải lên (${file.name})`,
      targetType: currentLaborer.contractTargetType || 'Người lao động',
      effectiveDate: `${dd}/${mm}/${yyyy}`,
      isoEffectiveDate: `${yyyy}-${mm}-${dd}`,
      createdAt: `${yyyy}-${mm}-${dd} ${hh}:${min}`,
      status: 'Đang hiệu lực'
    };

    setCustomDocumentsMap(prev => ({
      ...prev,
      [personKey]: [...(prev[personKey] || lifecycleData.documents), newDoc]
    }));
    e.target.value = '';
  };

  const handleDeleteDocument = (docId: string) => {
    setCustomDocumentsMap(prev => ({
      ...prev,
      [personKey]: (prev[personKey] || lifecycleData.documents).filter(d => d.id !== docId)
    }));
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'Đang hiệu lực' || status === 'Đã xác thực' || status === 'Đã đối chiếu') {
      return 'bg-[#E6F7EF] text-[#0D8A4E] border-[#B8EBD0]';
    }
    if (status === 'Hết hiệu lực') {
      return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F1F5F9] flex flex-col font-sans overflow-hidden animate-fadeIn">
      {/* Sticky Top Navigation Bar for Fullscreen View */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Hồ sơ hợp đồng
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#2563EB]" />
            <span className="text-sm font-bold text-gray-800">
              Vòng đời Hồ sơ Nhân sự & Hợp đồng
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Đóng màn hình"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6">
        <div className="max-w-[1280px] mx-auto space-y-4">
          
          {/* 1. XÁC ĐỊNH ĐỐI TƯỢNG NHÂN SỰ TRA CỨU */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2 text-[#1D4ED8] font-bold text-xs uppercase tracking-wide">
                <UserCheck className="w-4 h-4 text-[#2563EB]" />
                <span>XÁC ĐỊNH ĐỐI TƯỢNG NHÂN SỰ TRA CỨU</span>
              </div>
              <span className="text-[11px] italic text-gray-400">
                Dữ liệu đồng bộ từ Hồ sơ nhân sự gốc
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Xác định đối tượng dropdown */}
              <div className="col-span-12 md:col-span-5">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  Xác định đối tượng: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedLaborerIndex}
                    onChange={(e) => setSelectedLaborerIndex(Number(e.target.value))}
                    className="w-full pl-9 pr-8 py-2 bg-[#F8FAFC] border border-gray-300 rounded-lg text-[13px] font-semibold text-gray-800 outline-none focus:border-blue-500 focus:bg-white appearance-none cursor-pointer transition-colors"
                  >
                    {safeLaborers.map((lab, index) => (
                      <option key={lab.id || index} value={index}>
                        {lab.name} - {lab.cccd} ({lab.employeeCode || lab.code || `NV-00${index + 1}`})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Họ tên đầy đủ */}
              <div className="col-span-12 sm:col-span-4 md:col-span-3">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  Họ tên đầy đủ
                </label>
                <div className="w-full py-2 px-3.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-800 text-center truncate">
                  {currentLaborer.name}
                </div>
              </div>

              {/* Ngày sinh */}
              <div className="col-span-6 sm:col-span-4 md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  Ngày sinh
                </label>
                <div className="w-full py-2 px-3 bg-[#F8FAFC] border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-800 text-center">
                  {currentLaborer.dob || '15/08/1992'}
                </div>
              </div>

              {/* Giới tính */}
              <div className="col-span-6 sm:col-span-4 md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  Giới tính
                </label>
                <div className="w-full py-2 px-3 bg-[#F8FAFC] border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-800 text-center">
                  {currentLaborer.gender || 'Nam'}
                </div>
              </div>
            </div>
          </div>

          {/* 2. HIỂN THỊ THEO & BỘ LỌC */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
            {/* Khu vực A: HIỂN THỊ THEO (Sắp xếp thứ tự) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50/80 border border-blue-100 text-[#1D4ED8] text-xs font-bold uppercase tracking-wide">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>HIỂN THỊ THEO</span>
                </div>
                <div className="inline-flex bg-[#F1F5F9] p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSortBy('effectiveDate')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      sortBy === 'effectiveDate'
                        ? 'bg-white text-[#2563EB] shadow-2xs border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Ngày có hiệu lực
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('createdAt')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      sortBy === 'createdAt'
                        ? 'bg-white text-[#2563EB] shadow-2xs border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Thời gian tạo
                  </button>
                </div>
              </div>

              <span className="text-xs text-gray-500 italic">
                Thứ tự trục thời gian: Sắp xếp{' '}
                {sortDirection === 'desc' ? 'từ mới nhất đến cũ nhất' : 'từ cũ nhất đến mới nhất'} theo{' '}
                <strong className="text-gray-700 not-italic">
                  {sortBy === 'effectiveDate' ? 'Ngày có hiệu lực' : 'Thời gian tạo'}
                </strong>
              </span>
            </div>

            {/* Khu vực B: Chỉ hiển thị theo tiêu chí sau */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50/80 border border-blue-100 text-[#1D4ED8] text-xs font-bold tracking-wide">
                    <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Chỉ hiển thị theo tiêu chí sau:</span>
                  </div>
                </div>

                {(filterContractType !== 'ALL' ||
                  filterDocType !== 'ALL' ||
                  filterStatus !== 'ALL' ||
                  checkedTargets.length !== 2) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedTargets(['Người lao động', 'Cộng tác viên']);
                      setFilterContractType('ALL');
                      setFilterDocType('ALL');
                      setFilterStatus('ALL');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Đặt lại mặc định
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl p-3.5 items-center">
                {/* 1. Đối tượng hợp đồng */}
                <div className="lg:col-span-5 lg:border-r lg:border-gray-200 lg:pr-4">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase mb-2">
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Đối tượng hợp đồng <span className="text-red-500">*</span></span>
                  </label>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {(['Người lao động', 'Cộng tác viên', 'Môi giới', 'Nhân sự B2B'] as const).map((targetItem) => {
                      const isChecked = checkedTargets.includes(targetItem);
                      return (
                        <label
                          key={targetItem}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTargetCheckbox(targetItem)}
                            className="w-4 h-4 rounded border-gray-300 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                          />
                          <span className={isChecked ? 'text-gray-900 font-semibold' : 'text-gray-600'}>
                            {targetItem}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Các tiêu chí lọc chi tiết */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Loại Hợp đồng */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Loại hợp đồng
                    </label>
                    <div className="relative flex items-center">
                      <FileText className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 pointer-events-none" />
                      <select
                        value={filterContractType}
                        onChange={(e) => setFilterContractType(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-blue-400 appearance-none cursor-pointer"
                      >
                        <option value="ALL">Tất cả loại hợp đồng</option>
                        <option value="Hợp đồng lao động">Hợp đồng lao động</option>
                        <option value="Phụ lục hợp đồng">Phụ lục hợp đồng</option>
                        <option value="Thỏa thuận CTV">Thỏa thuận CTV</option>
                        <option value="Hợp đồng thử việc">Hợp đồng thử việc</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Loại Văn bản đính kèm */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Loại văn bản đính kèm
                    </label>
                    <div className="relative flex items-center">
                      <Paperclip className="w-3.5 h-3.5 text-[#10B981] absolute left-2.5 pointer-events-none" />
                      <select
                        value={filterDocType}
                        onChange={(e) => setFilterDocType(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-blue-400 appearance-none cursor-pointer"
                      >
                        <option value="ALL">Tất cả văn bản đính kèm</option>
                        <option value="CV">CV</option>
                        <option value="CCCD">CCCD</option>
                        <option value="Văn bằng">Văn bằng</option>
                        <option value="Giấy khám sức khỏe">Giấy khám sức khỏe</option>
                        <option value="Chứng chỉ">Chứng chỉ</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Trạng thái hồ sơ / HĐ
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-blue-400 appearance-none cursor-pointer"
                      >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="Đang hiệu lực">Đang hiệu lực</option>
                        <option value="Hết hiệu lực">Hết hiệu lực</option>
                        <option value="Đã xác thực">Đã xác thực</option>
                        <option value="Đã đối chiếu">Đã đối chiếu</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. LỊCH SỬ */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs">
            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="text-[15px] font-bold text-gray-900">
                    Lịch sử
                  </h2>
                </div>

                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                {/* Sắp xếp hiển thị: Mới nhất trước, Cũ nhất trước */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB]" />
                    Sắp xếp hiển thị:
                  </span>
                  <div className="inline-flex bg-[#F1F5F9] p-0.5 rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setSortDirection('desc')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        sortDirection === 'desc'
                          ? 'bg-white text-[#2563EB] shadow-2xs border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Mới nhất trước
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortDirection('asc')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        sortDirection === 'asc'
                          ? 'bg-white text-[#2563EB] shadow-2xs border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Cũ nhất trước
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  HĐLĐ / Phụ lục
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  Hồ sơ Văn bản
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  Thanh lý
                </span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-12 space-y-5 before:content-[''] before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gray-200">
              {timelineEntries.map((item) => {
                if (item.entryType === 'milestone') {
                  const ms = item.data;
                  const isSelected = activeMilestone?.id === ms.id;
                  const isAppendix = ms.nodeKind === 'appendix' || ms.contractTypeLabel.includes('Phụ lục');

                  return (
                    <div key={ms.id} className="relative">
                      {/* Left Circular Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm absolute -left-12 top-1 ${
                          isAppendix ? 'bg-[#3B82F6]' : 'bg-[#2563EB]'
                        }`}
                      >
                        {isAppendix ? (
                          <GitBranch className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className={`rounded-xl border p-4 transition-all ${
                          isSelected
                            ? 'border-blue-300 bg-white shadow-xs ring-1 ring-blue-100'
                            : 'border-gray-200 bg-white hover:border-blue-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                                  isAppendix
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : 'bg-blue-50 text-[#1D4ED8] border-blue-200'
                                }`}
                              >
                                {ms.contractTypeLabel}
                              </span>
                              <span className="text-[13px] font-bold text-gray-900">
                                {ms.contractCode}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(
                                  ms.status
                                )}`}
                              >
                                {ms.status}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span>
                                Đối tượng: <strong className="text-gray-800">{ms.targetType}</strong>
                              </span>
                              <span>•</span>
                              <span>Phòng: {ms.department}</span>
                              <span>•</span>
                              <span>Chức vụ: {ms.position}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-800">
                              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>Hiệu lực: {ms.effectiveDate}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              Ngày tạo: {ms.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Quote bar */}
                        <div className="mt-3 bg-[#F8FAFC] border border-gray-100 rounded-lg px-3.5 py-2 flex items-center justify-between gap-3">
                          <span className="text-xs italic text-gray-600">
                            "{ms.summaryQuote}"
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedMilestoneId(ms.id)}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-blue-200 text-[#2563EB] hover:bg-blue-50 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Xem thẻ chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const doc = item.data;
                  return (
                    <div key={doc.id} className="relative">
                      {/* Left Circular Icon */}
                      <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm absolute -left-12 top-1">
                        <Paperclip className="w-4 h-4" />
                      </div>

                      {/* Card */}
                      <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-emerald-200 transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#E6F7EF] text-[#0D8A4E] border border-[#B8EBD0]">
                                Văn bản: {doc.docCategory}
                              </span>
                              <span className="text-[13px] font-bold text-gray-900">
                                {doc.title}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(
                                  doc.status
                                )}`}
                              >
                                {doc.status}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 mt-1.5">
                              Đối tượng: <strong className="text-gray-800">{doc.targetType}</strong>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-800">
                              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>Hiệu lực: {doc.effectiveDate}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              Ngày tạo: {doc.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Quote bar */}
                        <div className="mt-3 bg-[#F8FAFC] border border-gray-100 rounded-lg px-3.5 py-2 flex items-center justify-between gap-3">
                          <span className="text-xs italic text-gray-600">
                            "{doc.subtitle}"
                          </span>
                          <button
                            type="button"
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            Hồ sơ số hóa
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* 5. DANH MỤC TÀI LIỆU */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-500" />
                <h2 className="text-[15px] font-bold text-gray-900">
                  Danh mục Tài liệu
                </h2>
              </div>

              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-gray-600" />
                <span>Tải lên văn bản mới</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadNewDocument}
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-y border-gray-200 text-[11px] font-bold text-gray-500 uppercase">
                    <th className="py-3 px-4 w-[160px]">LOẠI VĂN BẢN</th>
                    <th className="py-3 px-4 min-w-[280px]">TÊN VĂN BẢN / MÃ TÀI LIỆU</th>
                    <th className="py-3 px-4 w-[190px]">GẮN LIỀN VỚI ĐỐI TƯỢNG / HĐ</th>
                    <th className="py-3 px-4 w-[130px]">NGÀY HIỆU LỰC</th>
                    <th className="py-3 px-4 w-[160px]">THỜI GIAN TẠO HỆ THỐNG</th>
                    <th className="py-3 px-4 w-[140px]">TÌNH TRẠNG</th>
                    <th className="py-3 px-4 w-[100px] text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-gray-200 text-gray-700 font-semibold text-xs">
                          <Paperclip className="w-3 h-3 text-[#2563EB]" />
                          {doc.docCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-xs">{doc.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{doc.subtitle}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                          {doc.targetType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        {doc.effectiveDate}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                        {doc.createdAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-400">
                          <button
                            type="button"
                            className="p-1 hover:text-[#2563EB] transition-colors cursor-pointer"
                            title="Mở văn bản số hóa"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                            title="Xóa văn bản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
