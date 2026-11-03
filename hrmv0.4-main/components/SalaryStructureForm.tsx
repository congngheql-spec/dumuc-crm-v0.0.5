import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Calculator, 
  Check, X, Eye, FileText, ChevronRight, AlertCircle, Sparkles, Layers,
  Copy, Save, HelpCircle, Printer, UserCheck, Search, CheckCircle2,
  FolderPlus
} from 'lucide-react';
import { VisualFormulaBuilder, FormulaToken } from './VisualFormulaBuilder';
import { MOCK_GROUPS } from './SalaryRuleGroupList';

export interface StructureComponent {
  id: string;
  name: string;
  ruleGroupName: string; // Tên từ 'Nhóm quy tắc lương'
  calcType: 'formula' | 'fixed' | 'manual';
  fixedValue?: number;
  formulaTokens: FormulaToken[];
  formulaSummary: string; // Chuỗi hiển thị tên biến
  enabled: boolean;
  description?: string;
}

interface SalaryStructureFormProps {
  initialData?: any;
  onClose: () => void;
  onSave: (structure: any) => void;
}

export const DEFAULT_COMPONENTS: StructureComponent[] = [
  {
    id: 'c_1',
    name: 'Lương cơ bản theo ngày công',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Lương cơ bản] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Tính lương thực nhận theo số ngày công đi làm trong tháng'
  },
  {
    id: 'c_luong_kiem_nhiem',
    name: 'Lương kiêm nhiệm',
    ruleGroupName: 'Lương',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Khoản chi trả kiêm nhiệm, tự nhập trực tiếp trong Phiếu Lương'
  },
  {
    id: 'c_2',
    name: 'Phụ cấp ăn trưa theo công',
    ruleGroupName: 'Phụ cấp',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Phụ cấp ăn trưa] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Hỗ trợ ăn ca trưa trả theo ngày công thực tế'
  },
  {
    id: 'c_3',
    name: 'Phụ cấp xăng xe & đi lại',
    ruleGroupName: 'Phụ cấp',
    calcType: 'fixed',
    fixedValue: 500000,
    formulaTokens: [],
    formulaSummary: '500,000 đ (Cố định)',
    enabled: true,
    description: 'Khoản chi trả cố định hàng tháng'
  },
  {
    id: 'c_pc_manual_1',
    name: 'Phụ cấp chuyên cần & thâm niên',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Tự nhập theo từng kỳ lương cho từng nhân sự tại Phiếu Lương'
  },
  {
    id: 'c_pc_manual_2',
    name: 'Phụ cấp công tác & lưu trú phát sinh',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Khoản phụ cấp biến động phát sinh, tự nhập trực tiếp trong Phiếu Lương'
  },
  {
    id: 'c_4',
    name: 'Thưởng hiệu quả KPI',
    ruleGroupName: 'Hiệu quả',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Thưởng KPI', display: 'Thưởng KPI', color: 'indigo' },
    ],
    formulaSummary: '[Thưởng KPI]',
    enabled: true,
    description: 'Thưởng theo đánh giá hoàn thành công việc của tháng'
  },
  {
    id: 'c_5',
    name: 'Tổng thu nhập (Lương Gross)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '+', display: '+' },
      { id: '3', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: '4', type: 'operator', value: '+', display: '+' },
      { id: '5', type: 'variable', value: 'Phụ cấp xăng xe', display: 'Phụ cấp xăng xe', color: 'purple' },
      { id: '6', type: 'operator', value: '+', display: '+' },
      { id: '7', type: 'variable', value: 'Thưởng KPI', display: 'Thưởng KPI', color: 'indigo' },
    ],
    formulaSummary: '[Lương cơ bản] + [Phụ cấp ăn trưa] + [Phụ cấp xăng xe] + [Thưởng KPI]',
    enabled: true,
    description: 'Tổng toàn bộ thu nhập trước khi trích nộp bảo hiểm và thuế'
  },
  {
    id: 'c_6',
    name: 'Bảo hiểm trích nộp (10.5%)',
    ruleGroupName: 'Bảo hiểm xã hội',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '*', display: '×' },
      { id: '3', type: 'number', value: '10.5%', display: '10.5%' },
    ],
    formulaSummary: '[Lương cơ bản] × 10.5%',
    enabled: true,
    description: 'Bao gồm BHXH 8%, BHYT 1.5%, BHTN 1% người lao động đóng'
  },
  {
    id: 'c_7',
    name: 'Thuế thu nhập cá nhân (TNCN)',
    ruleGroupName: 'Thuế TNCN',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Thuế TNCN lũy tiến', display: 'Thuế TNCN lũy tiến', color: 'orange' },
    ],
    formulaSummary: '[Thuế TNCN lũy tiến]',
    enabled: true,
    description: 'Thuế TNCN khấu trừ theo biểu lũy tiến'
  },
  {
    id: 'c_8',
    name: 'Lương thực lĩnh (Net)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '+', display: '+' },
      { id: '3', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: '4', type: 'operator', value: '+', display: '+' },
      { id: '5', type: 'variable', value: 'Thưởng KPI', display: 'Thưởng KPI', color: 'indigo' },
      { id: '6', type: 'operator', value: '-', display: '−' },
      { id: '7', type: 'variable', value: 'BHXH (8%)', display: 'BHXH (8%)', color: 'amber' },
      { id: '8', type: 'operator', value: '-', display: '−' },
      { id: '9', type: 'variable', value: 'Thuế TNCN lũy tiến', display: 'Thuế TNCN lũy tiến', color: 'orange' },
    ],
    formulaSummary: '[Lương cơ bản] + [Phụ cấp ăn trưa] + [Thưởng KPI] − [BHXH (8%)] − [Thuế TNCN lũy tiến]',
    enabled: true,
    description: 'Số tiền thực nhận chuyển khoản cho người lao động'
  },
];

export const DEFAULT_KD_COMPONENTS: StructureComponent[] = [
  {
    id: 'kd_1',
    name: 'Lương thời gian theo ngày công',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Lương cơ bản] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Lương hợp đồng theo công làm việc'
  },
  {
    id: 'kd_2',
    name: 'Phụ cấp ăn trưa theo công',
    ruleGroupName: 'Phụ cấp',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Phụ cấp ăn trưa] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Hỗ trợ tiền ăn ca theo quy chế'
  },
  {
    id: 'kd_3',
    name: 'Phụ cấp điện thoại & liên lạc khách hàng',
    ruleGroupName: 'Phụ cấp',
    calcType: 'fixed',
    fixedValue: 500000,
    formulaTokens: [],
    formulaSummary: '500,000 đ (Cố định)',
    enabled: true,
    description: 'Khoản hỗ trợ liên lạc chăm sóc khách hàng showroom'
  },
  {
    id: 'kd_pc_manual_1',
    name: 'Phụ cấp chuyên cần & thâm niên',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Tự nhập theo từng kỳ lương cho từng nhân sự tại Phiếu Lương'
  },
  {
    id: 'kd_pc_manual_2',
    name: 'Phụ cấp công tác & lưu trú phát sinh',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Khoản phụ cấp biến động phát sinh, tự nhập trực tiếp trong Phiếu Lương'
  },
  {
    id: 'kd_4',
    name: 'Thưởng doanh số bán hàng (KPI)',
    ruleGroupName: 'Hiệu quả',
    calcType: 'fixed',
    fixedValue: 3500000,
    formulaTokens: [],
    formulaSummary: '3,500,000 đ (Doanh số bán phụ tùng & dịch vụ đạt 100% KPI tháng)',
    enabled: true,
    description: 'Doanh số bán phụ tùng & dịch vụ đạt 100% KPI tháng'
  },
  {
    id: 'kd_5',
    name: 'Hoa hồng hợp đồng thương mại',
    ruleGroupName: 'Hiệu quả',
    calcType: 'fixed',
    fixedValue: 1200000,
    formulaTokens: [],
    formulaSummary: '1,200,000 đ (Tỷ lệ hoa hồng hợp đồng xe & phụ tùng bàn giao hoàn tất)',
    enabled: true,
    description: 'Tỷ lệ hoa hồng hợp đồng xe & phụ tùng bàn giao hoàn tất'
  },
  {
    id: 'kd_gross',
    name: 'Tổng thu nhập (Lương Gross)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: 'Tổng hợp toàn bộ các khoản lương thời gian, phụ cấp và thưởng hiệu quả',
    enabled: true,
    description: 'Tổng toàn bộ thu nhập trước khi trích nộp bảo hiểm và thuế'
  },
  {
    id: 'kd_ins',
    name: 'Bảo hiểm trích nộp (10.5%)',
    ruleGroupName: 'Bảo hiểm xã hội',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: '[Lương cơ bản] × 10.5%',
    enabled: true,
    description: 'Bao gồm BHXH 8%, BHYT 1.5%, BHTN 1% người lao động đóng'
  },
  {
    id: 'kd_tax',
    name: 'Thuế thu nhập cá nhân (TNCN)',
    ruleGroupName: 'Thuế TNCN',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: '[Thuế TNCN lũy tiến]',
    enabled: true,
    description: 'Thuế TNCN khấu trừ theo biểu lũy tiến'
  },
  {
    id: 'kd_net',
    name: 'Lương thực lĩnh (Net)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: 'Lương Gross − Bảo hiểm & Thuế',
    enabled: true,
    description: 'Số tiền thực nhận chuyển khoản cho người lao động'
  }
];

export const DEFAULT_KT_COMPONENTS: StructureComponent[] = [
  {
    id: 'kt_1',
    name: 'Lương thời gian theo ngày công',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Lương cơ bản] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Lương hợp đồng theo công làm việc'
  },
  {
    id: 'kt_2',
    name: 'Phụ cấp ăn trưa theo công',
    ruleGroupName: 'Phụ cấp',
    calcType: 'formula',
    formulaTokens: [
      { id: '1', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: '2', type: 'operator', value: '/', display: '÷' },
      { id: '3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: '4', type: 'operator', value: '*', display: '×' },
      { id: '5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' },
    ],
    formulaSummary: '[Phụ cấp ăn trưa] ÷ [Số ngày công chuẩn] × [Số ngày công thực tế]',
    enabled: true,
    description: 'Hỗ trợ tiền ăn ca theo quy chế'
  },
  {
    id: 'kt_3',
    name: 'Phụ cấp độc hại & nặng nhọc xưởng',
    ruleGroupName: 'Phụ cấp',
    calcType: 'fixed',
    fixedValue: 1000000,
    formulaTokens: [],
    formulaSummary: '1,000,000 đ (Cố định)',
    enabled: true,
    description: 'Phụ cấp nghề kỹ thuật sửa chữa & thiết bị gầm máy'
  },
  {
    id: 'kt_pc_manual_1',
    name: 'Phụ cấp chuyên cần & thâm niên',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Tự nhập theo từng kỳ lương cho từng nhân sự tại Phiếu Lương'
  },
  {
    id: 'kt_pc_manual_2',
    name: 'Phụ cấp công tác & lưu trú phát sinh',
    ruleGroupName: 'Phụ cấp',
    calcType: 'manual',
    formulaTokens: [],
    formulaSummary: 'Tự nhập trong Phiếu Lương',
    enabled: true,
    description: 'Khoản phụ cấp biến động phát sinh, tự nhập trực tiếp trong Phiếu Lương'
  },
  {
    id: 'kt_4',
    name: 'Thưởng năng suất sửa chữa & an toàn kỹ thuật',
    ruleGroupName: 'Hiệu quả',
    calcType: 'fixed',
    fixedValue: 1800000,
    formulaTokens: [],
    formulaSummary: '1,800,000 đ (Đạt chỉ tiêu giờ công chuẩn và an toàn lao động xưởng)',
    enabled: true,
    description: 'Đạt chỉ tiêu giờ công chuẩn và an toàn lao động xưởng'
  },
  {
    id: 'kt_5',
    name: 'Phụ cấp hao mòn đồ nghề & dụng cụ',
    ruleGroupName: 'Bổ sung',
    calcType: 'fixed',
    fixedValue: 300000,
    formulaTokens: [],
    formulaSummary: '300,000 đ (Cố định)',
    enabled: true,
    description: 'Khoản hỗ trợ bảo quản trang thiết bị đồ nghề chuyên dụng'
  },
  {
    id: 'kt_gross',
    name: 'Tổng thu nhập (Lương Gross)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: 'Tổng hợp toàn bộ các khoản lương thời gian, phụ cấp và thưởng hiệu quả',
    enabled: true,
    description: 'Tổng toàn bộ thu nhập trước khi trích nộp bảo hiểm và thuế'
  },
  {
    id: 'kt_ins',
    name: 'Bảo hiểm trích nộp (10.5%)',
    ruleGroupName: 'Bảo hiểm xã hội',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: '[Lương cơ bản] × 10.5%',
    enabled: true,
    description: 'Bao gồm BHXH 8%, BHYT 1.5%, BHTN 1% người lao động đóng'
  },
  {
    id: 'kt_tax',
    name: 'Thuế thu nhập cá nhân (TNCN)',
    ruleGroupName: 'Thuế TNCN',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: '[Thuế TNCN lũy tiến]',
    enabled: true,
    description: 'Thuế TNCN khấu trừ theo biểu lũy tiến'
  },
  {
    id: 'kt_net',
    name: 'Lương thực lĩnh (Net)',
    ruleGroupName: 'Lương',
    calcType: 'formula',
    formulaTokens: [],
    formulaSummary: 'Lương Gross − Bảo hiểm & Thuế',
    enabled: true,
    description: 'Số tiền thực nhận chuyển khoản cho người lao động'
  }
];

// Danh mục nhóm quy tắc có thể thêm nhanh
const RULE_GROUP_PRESETS = [
  { group: 'Lương', name: 'Lương năng suất', calcType: 'formula' },
  { group: 'Lương', name: 'Lương kiêm nhiệm', calcType: 'manual' },
  { group: 'Phụ cấp', name: 'Phụ cấp chức vụ', calcType: 'fixed', defaultVal: 1500000 },
  { group: 'Phụ cấp', name: 'Phụ cấp chuyên cần & thâm niên', calcType: 'manual' },
  { group: 'Phụ cấp', name: 'Phụ cấp công tác & lưu trú phát sinh', calcType: 'manual' },
  { group: 'Bổ sung', name: 'Tiền trách nhiệm', calcType: 'fixed', defaultVal: 800000 },
  { group: 'Hỗ trợ', name: 'Hỗ trợ điện thoại', calcType: 'fixed', defaultVal: 300000 },
  { group: 'Hỗ trợ', name: 'Hỗ trợ nhà ở', calcType: 'fixed', defaultVal: 1000000 },
  { group: 'Hiệu quả', name: 'Thưởng doanh thu bán hàng', calcType: 'formula' },
  { group: 'Giảm trừ', name: 'Giảm trừ gia cảnh tổng', calcType: 'formula' },
];

export const SalaryStructureForm: React.FC<SalaryStructureFormProps> = ({
  initialData,
  onClose,
  onSave
}) => {
  const [code, setCode] = useState(initialData?.code || `CTL_${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Selected departments and positions
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['Văn phòng', 'Kinh doanh']);
  const [selectedContracts, setSelectedContracts] = useState<string[]>(['HĐ Chính thức', 'HĐ Thử việc']);
  
  // List of salary components
  const [components, setComponents] = useState<StructureComponent[]>(
    initialData?.components || DEFAULT_COMPONENTS
  );

  // Visual Formula Builder state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);

  // Quick add modal state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSelectedGroup, setQuickAddSelectedGroup] = useState<string>('ALL');
  const [quickAddSearchTerm, setQuickAddSearchTerm] = useState<string>('');
  const [quickAddNotification, setQuickAddNotification] = useState<string | null>(null);

  const showQuickAddToast = (msg: string) => {
    setQuickAddNotification(msg);
    setTimeout(() => setQuickAddNotification(null), 3000);
  };

  const handleAddFromRuleGroup = (group: typeof MOCK_GROUPS[0], item: typeof MOCK_GROUPS[0]['items'][0]) => {
    const isExisted = components.some(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase());
    if (isExisted) {
      showQuickAddToast(`Khoản mục "${item.name}" đã có trong Cấu trúc lương.`);
      return;
    }

    let calcType: 'formula' | 'fixed' | 'manual' = 'formula';
    let fixedVal: number | undefined = undefined;
    let formulaSummary = `[${item.name}]`;

    if (item.khauTruLimit && !isNaN(Number(item.khauTruLimit.replace(/,/g, '')))) {
      calcType = 'fixed';
      fixedVal = Number(item.khauTruLimit.replace(/,/g, ''));
      formulaSummary = `${fixedVal.toLocaleString('vi-VN')} đ (Cố định)`;
    } else if ((item as any).defaultCalcType === 'manual' || item.name.includes('chuyên cần') || item.name.includes('công tác') || item.name.includes('kiêm nhiệm')) {
      calcType = 'manual';
      formulaSummary = 'Tự nhập trong Phiếu Lương';
    } else if (group.name === 'Phụ cấp' && item.name.includes('xăng xe')) {
      calcType = 'fixed';
      fixedVal = 500000;
      formulaSummary = '500,000 đ (Cố định)';
    } else if (group.name === 'Phụ cấp' && item.name.includes('chức vụ')) {
      calcType = 'fixed';
      fixedVal = 1500000;
      formulaSummary = '1,500,000 đ (Cố định)';
    } else if (group.name === 'Bổ sung') {
      calcType = 'fixed';
      fixedVal = 800000;
      formulaSummary = '800,000 đ (Cố định)';
    } else if (group.name === 'Hỗ trợ' && item.name.includes('điện thoại')) {
      calcType = 'fixed';
      fixedVal = 300000;
      formulaSummary = '300,000 đ (Cố định)';
    } else if (group.name === 'Hỗ trợ' && item.name.includes('nhà ở')) {
      calcType = 'fixed';
      fixedVal = 1000000;
      formulaSummary = '1,000,000 đ (Cố định)';
    } else if (group.name === 'Bảo hiểm xã hội') {
      calcType = 'formula';
      formulaSummary = `[Lương cơ bản HĐ] × ${item.name.includes('8%') ? '8%' : item.name.includes('1.5%') ? '1.5%' : '1%'}`;
    }

    const newComp: StructureComponent = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: item.name,
      ruleGroupName: group.name, // Exact "Tên nhóm" from "Nhóm quy tắc Lương"
      calcType,
      fixedValue: fixedVal,
      formulaTokens: [],
      formulaSummary,
      enabled: true,
      description: item.description || `Khoản mục thuộc nhóm quy tắc ${group.name}`
    };

    setComponents(prev => [...prev, newComp]);
    showQuickAddToast(`✓ Đã thêm khoản mục "${item.name}" (thuộc Tên nhóm: ${group.name}) vào cấu trúc!`);
  };

  const handleAddAllFromGroup = (group: typeof MOCK_GROUPS[0]) => {
    const toAdd: StructureComponent[] = [];
    group.items.forEach((item, idx) => {
      const exists = components.some(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase()) ||
                     toAdd.some(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase());
      if (!exists) {
        let calcType: 'formula' | 'fixed' | 'manual' = 'formula';
        let fixedVal: number | undefined = undefined;
        let formulaSummary = `[${item.name}]`;

        if (item.khauTruLimit && !isNaN(Number(item.khauTruLimit.replace(/,/g, '')))) {
          calcType = 'fixed';
          fixedVal = Number(item.khauTruLimit.replace(/,/g, ''));
          formulaSummary = `${fixedVal.toLocaleString('vi-VN')} đ (Cố định)`;
        } else if (group.name === 'Bảo hiểm xã hội') {
          calcType = 'formula';
          formulaSummary = `[Lương cơ bản HĐ] × ${item.name.includes('8%') ? '8%' : item.name.includes('1.5%') ? '1.5%' : '1%'}`;
        }

        toAdd.push({
          id: 'c_' + Date.now() + '_' + idx,
          name: item.name,
          ruleGroupName: group.name,
          calcType,
          fixedValue: fixedVal,
          formulaTokens: [],
          formulaSummary,
          enabled: true,
          description: item.description || `Khoản mục thuộc nhóm quy tắc ${group.name}`
        });
      }
    });

    if (toAdd.length > 0) {
      setComponents(prev => [...prev, ...toAdd]);
      showQuickAddToast(`✓ Đã thêm toàn bộ ${toAdd.length} khoản mục của Tên nhóm "${group.name}" vào cấu trúc!`);
    } else {
      showQuickAddToast(`Tất cả khoản mục của Tên nhóm "${group.name}" đã có trong cấu trúc.`);
    }
  };

  // Filtered groups based on quickAddSelectedGroup and search term
  const filteredRuleGroups = useMemo(() => {
    return MOCK_GROUPS.filter(group => {
      const matchGroup = quickAddSelectedGroup === 'ALL' || group.name === quickAddSelectedGroup;
      if (!matchGroup) return false;

      if (!quickAddSearchTerm.trim()) return true;

      const term = quickAddSearchTerm.toLowerCase();
      const matchName = group.name.toLowerCase().includes(term);
      const matchCode = group.code.toLowerCase().includes(term);
      const matchDesc = group.description.toLowerCase().includes(term);
      const matchItem = group.items.some(it => 
        it.name.toLowerCase().includes(term) || 
        it.code.toLowerCase().includes(term) ||
        it.description.toLowerCase().includes(term)
      );

      return matchName || matchCode || matchDesc || matchItem;
    });
  }, [quickAddSelectedGroup, quickAddSearchTerm]);

  // Payslip preview simulation modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);

  const activeComponent = components.find(c => c.id === activeComponentId);

  // Toggle department
  const toggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter(d => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  // Toggle contract
  const toggleContract = (contract: string) => {
    if (selectedContracts.includes(contract)) {
      setSelectedContracts(selectedContracts.filter(c => c !== contract));
    } else {
      setSelectedContracts([...selectedContracts, contract]);
    }
  };

  // Reordering components
  const moveComponent = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === components.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...components];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setComponents(updated);
  };

  // Delete component
  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Toggle enabled
  const toggleEnabled = (id: string) => {
    setComponents(components.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  // Update calculation type (Viết công thức tính / Nhập số tiền cố định / Tự nhập trong Phiếu Lương)
  const updateCalcType = (id: string, calcType: 'formula' | 'fixed' | 'manual') => {
    setComponents(components.map(c => {
      if (c.id === id) {
        return {
          ...c,
          calcType,
          fixedValue: calcType === 'fixed' ? (c.fixedValue ?? 0) : c.fixedValue
        };
      }
      return c;
    }));
  };

  // Update fixed monetary value
  const updateFixedValue = (id: string, value: number) => {
    setComponents(components.map(c => c.id === id ? { ...c, fixedValue: value } : c));
  };

  // Open Visual Formula Builder for a component
  const handleOpenFormulaBuilder = (component: StructureComponent) => {
    setActiveComponentId(component.id);
    setBuilderOpen(true);
  };

  // Save formula from builder
  const handleSaveFormula = (tokens: FormulaToken[], summary: string) => {
    if (activeComponentId) {
      setComponents(components.map(c => {
        if (c.id === activeComponentId) {
          return {
            ...c,
            formulaTokens: tokens,
            formulaSummary: summary,
            calcType: 'formula'
          };
        }
        return c;
      }));
    }
    setBuilderOpen(false);
    setActiveComponentId(null);
  };

  // Add new component
  const handleAddPresetComponent = (preset: typeof RULE_GROUP_PRESETS[0]) => {
    const newComp: StructureComponent = {
      id: 'c_' + Date.now(),
      name: preset.name,
      ruleGroupName: preset.group,
      calcType: preset.calcType as any,
      fixedValue: preset.defaultVal,
      formulaTokens: [],
      formulaSummary: preset.defaultVal ? `${preset.defaultVal.toLocaleString('vi-VN')} đ (Cố định)` : 'Chưa cấu hình công thức',
      enabled: true,
      description: `Thành phần thuộc nhóm quy tắc ${preset.group}`
    };
    setComponents([...components, newComp]);
    setQuickAddOpen(false);
  };

  // Custom new component
  const handleAddCustomComponent = () => {
    const newComp: StructureComponent = {
      id: 'c_' + Date.now(),
      name: 'Khoản mục lương mới',
      ruleGroupName: 'Phụ cấp',
      calcType: 'formula',
      formulaTokens: [],
      formulaSummary: 'Chưa cấu hình công thức',
      enabled: true,
      description: 'Nhấp "Thiết lập công thức" để định nghĩa cách tính'
    };
    setComponents([...components, newComp]);
    setActiveComponentId(newComp.id);
    setBuilderOpen(true);
  };

  // Validate and save structure
  const handleSaveStructure = () => {
    const newErrors = [];
    if (!name.trim()) newErrors.push('Vui lòng nhập Tên Cấu trúc Lương.');
    if (!code.trim()) newErrors.push('Vui lòng nhập Mã Cấu trúc Lương.');
    if (components.length === 0) newErrors.push('Cấu trúc lương cần có ít nhất một thành phần lương.');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const structureData = {
      id: initialData?.id || Date.now(),
      code,
      name,
      description,
      departments: selectedDepts,
      contractTypes: selectedContracts,
      components,
    };

    onSave(structureData);
  };

  // Dữ liệu tham số mô phỏng mẫu nhân viên (Tháng 09/2026)
  const SIMULATION_PARAMS: Record<string, number> = useMemo(() => ({
    'Lương cơ bản': 15000000,
    'Lương năng suất': 3000000,
    'Hệ số lương': 1.5,
    'Thưởng KPI': 2000000,
    'Thưởng doanh thu': 3500000,
    'Phụ cấp ăn trưa': 730000,
    'Phụ cấp xăng xe': 500000,
    'Phụ cấp chức vụ': 1500000,
    'Tiền trách nhiệm': 800000,
    'Hỗ trợ điện thoại': 300000,
    'Hỗ trợ nhà ở': 1000000,
    'Số ngày công chuẩn': 26,
    'Số ngày công thực tế': 24,
    'Số ngày nghỉ phép hưởng lương': 2,
    'Số ngày nghỉ không lương': 0,
    'Số giờ làm thêm 150%': 6,
    'Số giờ làm thêm 200%': 2,
    'Số giờ làm thêm 300%': 0,
    'BHXH (8%)': 1200000,
    'BHYT (1.5%)': 225000,
    'BHTN (1%)': 150000,
    'Tổng bảo hiểm bắt buộc (10.5%)': 1575000,
    'Giảm trừ bản thân': 11000000,
    'Giảm trừ người phụ thuộc': 4400000,
    'Số người phụ thuộc': 1,
    'Thuế TNCN lũy tiến': 350000,
  }), []);

  // Tính toán các khoản mục trong khu vực "2. Thiết lập công thức tính Phiếu Lương" cho Phiếu Lương mô phỏng
  const simulatedData = useMemo(() => {
    // Lấy các khoản mục được bật hiển thị trên phiếu lương
    const activeComps = components.filter(c => c.enabled !== false);

    // Phân loại: Khấu trừ vs Thu nhập vs Hàng tổng hợp
    const isDeduction = (c: StructureComponent) => {
      const g = (c.ruleGroupName || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return (
        g.includes('bảo hiểm') || g.includes('bhxh') || g.includes('thuế') || g.includes('tncn') ||
        g.includes('giảm trừ') || g.includes('khấu trừ') || n.includes('bảo hiểm') || n.includes('bhxh') ||
        n.includes('bhyt') || n.includes('bhtn') || n.includes('thuế') || n.includes('giảm trừ') ||
        n.includes('khấu trừ') || n.includes('phạt')
      );
    };

    const isGrossSummary = (c: StructureComponent) => {
      const n = (c.name || '').toLowerCase();
      return n.includes('lương gross') || n.includes('tổng thu nhập') || n === 'gross';
    };

    const isNetSummary = (c: StructureComponent) => {
      const n = (c.name || '').toLowerCase();
      return n.includes('thực lĩnh') || n.includes('lương net') || n === 'net';
    };

    // Hàm tính số tiền mô phỏng của 1 component
    const computeAmount = (c: StructureComponent): number => {
      if (c.calcType === 'manual') {
        if (c.name.toLowerCase().includes('chuyên cần')) return 500000;
        if (c.name.toLowerCase().includes('công tác')) return 300000;
        if (c.name.toLowerCase().includes('kiêm nhiệm')) return 1500000;
        return 0;
      }
      if (c.calcType === 'fixed') {
        return c.fixedValue !== undefined && c.fixedValue !== null ? Number(c.fixedValue) : 0;
      }

      if (c.formulaTokens && c.formulaTokens.length > 0) {
        try {
          let expr = '';
          for (const t of c.formulaTokens) {
            if (t.type === 'variable') {
              const defaultVal = 
                t.value.toLowerCase().includes('ngày') || t.value.toLowerCase().includes('công') 
                  ? 26 
                  : 1000000;
              const val = SIMULATION_PARAMS[t.value] !== undefined ? SIMULATION_PARAMS[t.value] : defaultVal;
              expr += ` ${val} `;
            } else if (t.type === 'operator') {
              if (t.value === '×' || t.value === '*') expr += ' * ';
              else if (t.value === '÷' || t.value === '/') expr += ' / ';
              else expr += ` ${t.value} `;
            } else if (t.type === 'number') {
              if (t.value.endsWith('%')) {
                const num = parseFloat(t.value.replace('%', ''));
                expr += ` (${num / 100}) `;
              } else {
                expr += ` ${t.value.replace(/,/g, '')} `;
              }
            } else if (t.type === 'parenthesis') {
              expr += t.value;
            } else if (t.type === 'function') {
              if (t.value === 'MAX') expr += ' Math.max';
              else if (t.value === 'MIN') expr += ' Math.min';
              else if (t.value === 'ROUND') expr += ' Math.round';
            }
          }
          const cleanExpr = expr.replace(/[^0-9+\-*/().,% Math.maxinround]/g, '');
          // eslint-disable-next-line no-new-func
          const result = new Function(`return (${cleanExpr})`)();
          if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            return Math.round(result);
          }
        } catch (e) {
          console.warn('Simulation eval error for', c.name, e);
        }
      }

      // Fallback cho trường hợp công thức chưa được tokenize đầy đủ
      const n = c.name.toLowerCase();
      if (n.includes('bảo hiểm') || n.includes('bhxh')) return Math.round(SIMULATION_PARAMS['Lương cơ bản'] * 0.105);
      if (n.includes('thuế')) return SIMULATION_PARAMS['Thuế TNCN lũy tiến'] || 350000;
      if (n.includes('lương cơ bản')) return Math.round((SIMULATION_PARAMS['Lương cơ bản'] / SIMULATION_PARAMS['Số ngày công chuẩn']) * SIMULATION_PARAMS['Số ngày công thực tế']);
      if (n.includes('ăn trưa')) return Math.round((SIMULATION_PARAMS['Phụ cấp ăn trưa'] / SIMULATION_PARAMS['Số ngày công chuẩn']) * SIMULATION_PARAMS['Số ngày công thực tế']);
      if (n.includes('xăng xe')) return SIMULATION_PARAMS['Phụ cấp xăng xe'] || 500000;
      if (n.includes('kpi')) return SIMULATION_PARAMS['Thưởng KPI'] || 2000000;
      return 0;
    };

    // Hàm tạo chuỗi diễn giải công thức trực quan
    const computeExplanation = (c: StructureComponent): string => {
      if (c.calcType === 'manual') {
        return 'Tự nhập trong Phiếu Lương (Vào Hồ sơ Hợp đồng > Phiếu Lương để tự nhập cho từng nhân sự)';
      }
      if (c.calcType === 'fixed') {
        const valStr = (c.fixedValue || 0).toLocaleString('vi-VN');
        return c.description ? `${valStr} đ (${c.description})` : `${valStr} đ (Khoản chi trả cố định hàng tháng)`;
      }

      if (c.formulaTokens && c.formulaTokens.length > 0) {
        const substituted = c.formulaTokens.map(t => {
          if (t.type === 'variable') {
            const val = SIMULATION_PARAMS[t.value];
            if (val !== undefined) {
              return `[${val.toLocaleString('vi-VN')}]`;
            }
            return `[${t.display}]`;
          }
          if (t.type === 'operator') return t.display;
          return t.display || t.value;
        }).join(' ');

        return c.description ? `${substituted} (${c.description})` : substituted;
      }

      if (c.formulaSummary) {
        return c.description ? `${c.formulaSummary} (${c.description})` : c.formulaSummary;
      }

      return c.description || 'Theo công thức tính toán cấu trúc lương';
    };

    const incomeList: Array<{ id: string; name: string; ruleGroupName: string; explanation: string; amount: number }> = [];
    const deductionList: Array<{ id: string; name: string; ruleGroupName: string; explanation: string; amount: number }> = [];

    activeComps.forEach(c => {
      if (isGrossSummary(c) || isNetSummary(c)) {
        // Bỏ qua hàng tổng hợp để đưa vào Section II & IV
        return;
      }
      const amount = computeAmount(c);
      const explanation = computeExplanation(c);

      if (isDeduction(c)) {
        deductionList.push({
          id: c.id,
          name: c.name,
          ruleGroupName: c.ruleGroupName,
          explanation,
          amount
        });
      } else {
        incomeList.push({
          id: c.id,
          name: c.name,
          ruleGroupName: c.ruleGroupName,
          explanation,
          amount
        });
      }
    });

    const totalGross = incomeList.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = deductionList.reduce((sum, item) => sum + item.amount, 0);
    const netSalary = totalGross - totalDeductions;

    // Diễn giải cho hàng Gross
    const grossComp = activeComps.find(isGrossSummary);
    const grossExplanation = grossComp && grossComp.formulaSummary
      ? grossComp.formulaSummary
      : (incomeList.length > 0 ? incomeList.map(i => `[${i.name}]`).join(' + ') : 'Chưa có khoản thu nhập nào');

    // Diễn giải cho hàng Net
    const netComp = activeComps.find(isNetSummary);
    const netExplanation = netComp && netComp.formulaSummary
      ? netComp.formulaSummary
      : '[Lương Gross] − [Trích nộp BHXH 10.5%] − [Thuế TNCN lũy tiến]';

    // Subtitle card Giảm trừ
    const deductionsSubtitle = deductionList.length > 0
      ? deductionList.map(d => `${d.name} (${d.amount.toLocaleString('vi-VN')} đ)`).join(' + ')
      : 'Không có khoản trích nộp hoặc giảm trừ';

    return {
      activeComponentsCount: activeComps.length,
      incomeList,
      deductionList,
      totalGross,
      totalDeductions,
      netSalary,
      grossExplanation,
      netExplanation,
      deductionsSubtitle
    };
  }, [components, SIMULATION_PARAMS]);

  // Color helper for badges
  const getBadgeColor = (group: string) => {
    switch (group) {
      case 'Lương': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Phụ cấp': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hiệu quả': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Bổ sung': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Hỗ trợ': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Bảo hiểm xã hội': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Giảm trừ': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Thuế TNCN': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F8] flex flex-col font-sans text-gray-800 overflow-hidden animate-fadeIn">
      
      {/* Visual Formula Builder in Full-Screen mode if opened */}
      {builderOpen && activeComponent && (
        <VisualFormulaBuilder
          componentName={activeComponent.name}
          componentGroup={activeComponent.ruleGroupName}
          initialTokens={activeComponent.formulaTokens}
          onSave={handleSaveFormula}
          onClose={() => {
            setBuilderOpen(false);
            setActiveComponentId(null);
          }}
          otherComponents={components
            .filter(c => c.id !== activeComponent.id && c.name.trim() !== '')
            .map(c => ({ id: c.id, name: c.name, groupName: c.ruleGroupName }))}
        />
      )}

      {/* TOP HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {initialData ? `Chỉnh sửa: ${initialData.name}` : 'Thêm mới Cấu trúc Lương'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded border border-emerald-300 bg-emerald-50 text-emerald-700 text-[13px] font-medium flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            Mô phỏng phiếu lương mẫu
          </button>

          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-[13px] font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>

          <button 
            onClick={handleSaveStructure}
            className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu Cấu trúc Lương
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        
        {/* Error notifications */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex flex-col gap-1 text-[13px]">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {/* GENERAL SETTINGS CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 shrink-0">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            1. Phạm vi áp dụng
          </h2>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">
                Mã cấu trúc <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={code}
                onChange={e => setCode(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-blue-500 bg-white"
                placeholder="VD: CTL_VP, CTL_KD..."
              />
            </div>

            <div className="col-span-5 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">
                Tên Cấu trúc Lương <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-blue-500 bg-white"
                placeholder="VD: Cấu trúc lương khối Kinh doanh & Showroom"
              />
            </div>

            <div className="col-span-4 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">Mô tả cấu trúc</label>
              <input 
                type="text" 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-blue-500 bg-white"
                placeholder="Áp dụng cho vị trí nhân sự, chuyên viên, kỹ thuật viên..."
              />
            </div>

            {/* Department selector (Click-only badges) */}
            <div className="col-span-12 flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-600">Phòng ban / Bộ phận áp dụng (Click chọn):</span>
              <div className="flex flex-wrap gap-2">
                {['Văn phòng', 'Kinh doanh', 'Xưởng Kỹ thuật', 'Kho Phụ tùng', 'Kế toán & Tài chính', 'Ban Giám Đốc'].map((dept) => {
                  const isSelected = selectedDepts.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleDept(dept)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{dept}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SALARY RULE COMPONENTS SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col flex-1 min-h-[450px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                2. Thiết lập công thức tính Phiếu Lương
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Các khoản mục được liên kết từ menu <strong>Nhóm quy tắc Lương</strong>. Click <strong>"Thiết lập công thức"</strong> để mở Bộ dựng công thức trực quan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickAddOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                Chọn nhanh từ Nhóm quy tắc Lương
              </button>
              <button
                onClick={handleAddCustomComponent}
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Tạo khoản mục mới
              </button>
            </div>
          </div>

          {/* TABLE OF SALARY COMPONENTS */}
          <div className="flex-1 overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-12 text-center">STT</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-16 text-center">Thứ tự</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[150px]">Nhóm quy tắc</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[240px]">Tên nhóm quy tắc</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[185px]">Phương thức tính</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700">Giá trị thiết lập</th>
                  <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[160px] text-center">Hành động</th>
                  <th className="p-3 border-gray-200 font-medium text-gray-700 w-[170px] text-center">Hiển thị trên Phiếu lương</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component, index) => (
                  <tr 
                    key={component.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50/80 transition-colors ${
                      !component.enabled ? 'opacity-50 bg-gray-50' : ''
                    }`}
                  >
                    {/* STT */}
                    <td className="p-3 border-r border-gray-200 text-center font-medium text-gray-600">
                      {index + 1}
                    </td>

                    {/* Move Up/Down (Thứ tự - Sau cột STT) */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => moveComponent(index, 'up')}
                          className="p-1 rounded text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors cursor-pointer"
                          title="Di chuyển lên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === components.length - 1}
                          onClick={() => moveComponent(index, 'down')}
                          className="p-1 rounded text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors cursor-pointer"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Rule Group Badge (Nhóm quy tắc - Sau cột Thứ tự) */}
                    <td className="p-3 border-r border-gray-200">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getBadgeColor(component.ruleGroupName)}`}>
                        {component.ruleGroupName}
                      </span>
                    </td>

                    {/* Component Name (Tên nhóm quy tắc - Đổi từ Tên khoản mục Lương) */}
                    <td className="p-3 border-r border-gray-200 font-bold text-gray-900">
                      <div className="flex flex-col">
                        <span>{component.name}</span>
                        {component.description && (
                          <span className="text-[11px] font-normal text-gray-400 line-clamp-1">
                            {component.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Calculation Type (Dạng list: Viết công thức tính / Nhập số tiền cố định / Tự nhập trong Phiếu Lương) */}
                    <td className="p-3 border-r border-gray-200">
                      <select
                        value={component.calcType === 'fixed' ? 'fixed' : component.calcType === 'manual' ? 'manual' : 'formula'}
                        onChange={(e) => updateCalcType(component.id, e.target.value as 'formula' | 'fixed' | 'manual')}
                        className="w-full text-xs font-semibold border border-gray-300 rounded-md px-2.5 py-1.5 bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs hover:border-gray-400 transition-colors"
                      >
                        <option value="formula">Viết công thức tính</option>
                        <option value="fixed">Nhập số tiền cố định</option>
                        <option value="manual">Tự nhập trong Phiếu Lương</option>
                      </select>
                    </td>

                    {/* Visual Formula Pills / Summary or Fixed amount input or Manual Notice */}
                    <td className="p-3 border-r border-gray-200">
                      {component.calcType === 'manual' ? (
                        <div className="text-xs text-blue-800 bg-blue-50/80 border border-blue-200/90 rounded px-2.5 py-1.5 font-medium leading-relaxed">
                          Vào Hồ sơ Hợp đồng &gt; Hồ sơ Người lao động &gt; Phiếu Lương &gt; Nhập giá trị này cho từng nhân sự
                        </div>
                      ) : component.calcType === 'formula' ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {component.formulaTokens && component.formulaTokens.length > 0 ? (
                            component.formulaTokens.map((t) => (
                              <span 
                                key={t.id}
                                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                                  t.type === 'variable' 
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold' 
                                    : t.type === 'operator'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                                    : t.type === 'parenthesis'
                                    ? 'bg-purple-50 text-purple-800 border-purple-200 font-bold'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {t.type === 'variable' ? `[${t.display}]` : t.display}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-amber-600 italic">
                              Chưa có công thức (Nhấp "Thiết lập" bên cạnh)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 max-w-[280px]">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={component.fixedValue !== undefined && component.fixedValue !== null ? component.fixedValue.toLocaleString('vi-VN') : ''}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/[^\d]/g, '');
                                const num = clean ? parseInt(clean, 10) : 0;
                                updateFixedValue(component.id, num);
                              }}
                              placeholder="Nhập số tiền..."
                              className="w-full text-xs font-semibold px-2.5 py-1.5 pr-8 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                              đ
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 italic shrink-0">
                            (Cố định)
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {component.calcType === 'formula' ? (
                          <button
                            onClick={() => handleOpenFormulaBuilder(component)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200 shadow-xs cursor-pointer"
                            title="Mở bộ dựng công thức trực quan"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Thiết lập</span>
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            className="px-2.5 py-1 rounded bg-gray-100 text-gray-400 text-xs font-semibold flex items-center gap-1 border border-gray-200 cursor-not-allowed opacity-50"
                            title={component.calcType === 'manual' ? "Tự nhập trong Phiếu Lương - Không cần thiết lập công thức" : "Số tiền cố định - Không cần thiết lập công thức"}
                          >
                            <Calculator className="w-3.5 h-3.5 text-gray-400" />
                            <span>Thiết lập</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteComponent(component.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa khoản mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Hiển thị trên Phiếu lương (dạng tick/un-tick) */}
                    <td className="p-3 border-gray-200 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          id={`display-payslip-${component.id}`}
                          checked={component.enabled}
                          onChange={() => toggleEnabled(component.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-colors"
                          title={component.enabled ? "Đang hiển thị trên phiếu lương (Nhấp để bỏ chọn)" : "Không hiển thị trên phiếu lương (Nhấp để chọn)"}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* PAYSLIP SIMULATOR (FULL-SCREEN VIEW) */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-[#F4F6F8] flex flex-col font-sans text-gray-800 overflow-hidden animate-fadeIn">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                title="Quay lại thiết lập cấu trúc"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Mô phỏng Phiếu Lương Nhân Viên (Payslip Preview)
                </h1>
                <p className="text-xs text-gray-500">
                  Kiểm tra kết quả tính toán tự động dựa trên cấu trúc: <strong className="text-blue-700">{name || code}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                In phiếu lương
              </button>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
                Đóng xem trước
              </button>
            </div>
          </header>

          {/* Main Full-Screen Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Employee selection & Simulation parameters card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Thông tin nhân sự mẫu & Tham số tính lương tháng
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-1 rounded-full">
                    Kỳ lương: Tháng 09/2026 (Công chuẩn: 26 ngày)
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-4 text-xs">
                  <div className="col-span-3 bg-gray-50 p-3 rounded-lg border border-gray-200/80">
                    <span className="text-gray-500 font-medium">Họ và tên nhân viên:</span>
                    <div className="font-bold text-gray-900 text-sm mt-0.5">Nguyễn Văn An</div>
                    <span className="text-[11px] text-gray-500">Mã NV: NV-00284</span>
                  </div>

                  <div className="col-span-3 bg-gray-50 p-3 rounded-lg border border-gray-200/80">
                    <span className="text-gray-500 font-medium">Chức vụ & Phòng ban:</span>
                    <div className="font-bold text-gray-900 text-sm mt-0.5">Chuyên viên Kinh doanh</div>
                    <span className="text-[11px] text-gray-500">Bộ phận: Khối Kinh doanh & Showroom</span>
                  </div>

                  <div className="col-span-3 bg-blue-50/50 p-3 rounded-lg border border-blue-200/80">
                    <span className="text-blue-800 font-medium">Số ngày công chuẩn / thực tế:</span>
                    <div className="font-bold text-blue-900 text-sm mt-0.5">26 ngày / 24 ngày</div>
                    <span className="text-[11px] text-blue-600">Nghỉ phép có lương: 02 ngày</span>
                  </div>

                  <div className="col-span-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/80">
                    <span className="text-emerald-800 font-medium">Lương cơ bản HĐLĐ:</span>
                    <div className="font-bold text-emerald-900 text-base mt-0.5">15,000,000 đ</div>
                    <span className="text-[11px] text-emerald-600">Mức đóng BHXH theo lương HĐ</span>
                  </div>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng thu nhập (Lương Gross)</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{simulatedData.totalGross.toLocaleString('vi-VN')} đ</div>
                    <span className="text-xs text-gray-400 mt-0.5 block">Bao gồm lương công, phụ cấp & thưởng KPI</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                    Gross
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng các khoản giảm trừ</span>
                    <div className="text-2xl font-bold text-rose-600 mt-1">−{simulatedData.totalDeductions.toLocaleString('vi-VN')} đ</div>
                    <span className="text-xs text-gray-400 mt-0.5 block">{simulatedData.deductionsSubtitle}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg border border-rose-100">
                    Deduct
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-md p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Lương thực lĩnh chuyển khoản (Net)</span>
                    <div className="text-3xl font-extrabold text-white mt-1">{simulatedData.netSalary.toLocaleString('vi-VN')} đ</div>
                    <span className="text-xs text-blue-100 mt-0.5 block">Số tiền thực nhận chuyển về tài khoản nhân viên</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-xs">
                    Net
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Bảng chi tiết các khoản mục theo Cấu trúc Lương
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    Số khoản mục đang áp dụng: <strong className="text-gray-800">{simulatedData.activeComponentsCount}</strong>
                  </span>
                </div>

                <table className="w-full text-left text-[13px] border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3.5 w-14 text-center border-r border-gray-200">STT</th>
                      <th className="p-3.5 border-r border-gray-200 w-[280px]">Khoản mục thu nhập / Khấu trừ</th>
                      <th className="p-3.5 border-r border-gray-200 w-[140px]">Nhóm quy tắc</th>
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
                    {simulatedData.incomeList.length === 0 ? (
                      <tr className="border-b border-gray-100">
                        <td colSpan={5} className="p-3.5 text-center text-gray-400 italic">
                          Chưa có khoản mục thu nhập nào được áp dụng.
                        </td>
                      </tr>
                    ) : (
                      simulatedData.incomeList.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                          <td className="p-3.5 text-center text-gray-500 border-r border-gray-200">{idx + 1}</td>
                          <td className="p-3.5 font-bold text-gray-900 border-r border-gray-200">{item.name}</td>
                          <td className="p-3.5 border-r border-gray-200">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.ruleGroupName)}`}>
                              {item.ruleGroupName}
                            </span>
                          </td>
                          <td className="p-3.5 text-gray-600 border-r border-gray-200 font-mono text-xs">
                            {item.explanation}
                          </td>
                          <td className="p-3.5 text-right font-bold text-gray-900">
                            {item.amount.toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))
                    )}

                    {/* SECTION 2: TỔNG GROSS */}
                    <tr className="border-y-2 border-emerald-300 bg-emerald-50/50">
                      <td className="p-3.5 text-center font-bold text-emerald-800 border-r border-emerald-200">★</td>
                      <td className="p-3.5 font-bold text-emerald-950 border-r border-emerald-200 text-sm">
                        II. TỔNG THU NHẬP (LƯƠNG GROSS)
                      </td>
                      <td className="p-3.5 border-r border-emerald-200 text-emerald-800 font-semibold text-xs">Tổng hợp</td>
                      <td className="p-3.5 text-emerald-800 border-r border-emerald-200 text-xs font-mono">
                        {simulatedData.grossExplanation}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-700 text-base">
                        {simulatedData.totalGross.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>

                    {/* SECTION 3: GIẢM TRỪ */}
                    <tr className="bg-gray-50/70 border-b border-gray-200">
                      <td colSpan={5} className="p-2.5 px-4 font-bold text-rose-900 text-xs uppercase tracking-wider">
                        III. Các khoản trích nộp theo lương & Thuế TNCN
                      </td>
                    </tr>
                    {simulatedData.deductionList.length === 0 ? (
                      <tr className="border-b border-gray-100">
                        <td colSpan={5} className="p-3.5 text-center text-gray-400 italic">
                          Không có khoản trích nộp hoặc giảm trừ nào được áp dụng.
                        </td>
                      </tr>
                    ) : (
                      simulatedData.deductionList.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors text-rose-900">
                          <td className="p-3.5 text-center text-gray-500 border-r border-gray-200">{simulatedData.incomeList.length + idx + 1}</td>
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
                      ))
                    )}

                    {/* SECTION 4: THỰC LĨNH NET */}
                    <tr className="bg-[#2563EB] text-white border-t-2 border-blue-700">
                      <td className="p-4 text-center font-bold text-white border-r border-blue-500/40">★</td>
                      <td className="p-4 font-bold text-white border-r border-blue-500/40 text-base">
                        IV. LƯƠNG THỰC LĨNH CHUYỂN KHOẢN (NET)
                      </td>
                      <td className="p-4 border-r border-blue-500/40 text-blue-100 font-semibold text-xs">Thực nhận</td>
                      <td className="p-4 text-blue-100 border-r border-blue-500/40 text-xs font-mono">
                        {simulatedData.netExplanation}
                      </td>
                      <td className="p-4 text-right font-black text-white text-xl">
                        {simulatedData.netSalary.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom return button */}
              <div className="flex justify-end pb-8">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại Cấu trúc Lương
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN VIEW: CHỌN NHANH TỪ NHÓM QUY TẮC LƯƠNG */}
      {quickAddOpen && (
        <div className="fixed inset-0 z-50 bg-[#F4F6F8] flex flex-col font-sans text-gray-800 overflow-hidden animate-fadeIn">
          {/* Full-Screen Header */}
          <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuickAddOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                title="Quay lại thiết lập cấu trúc"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                    Chọn nhanh từ Nhóm quy tắc Lương
                    <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                      8 Tên nhóm hiện hành
                    </span>
                  </h1>
                  <p className="text-xs text-gray-500">
                    Dữ liệu "Tên nhóm" và các khoản mục được đồng bộ trực tiếp từ danh mục Nhóm quy tắc Lương
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuickAddOpen(false)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                Hoàn tất & Quay lại
              </button>
            </div>
          </header>

          {/* Filter Bar & Search */}
          <div className="px-6 py-3.5 bg-white border-b border-gray-200 shrink-0 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  value={quickAddSearchTerm}
                  onChange={(e) => setQuickAddSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo Tên nhóm (Lương, Phụ cấp, BHXH...), Mã nhóm, hoặc Tên khoản mục..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                />
                {quickAddSearchTerm && (
                  <button 
                    onClick={() => setQuickAddSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500 shrink-0">
                Hiển thị: <strong className="text-gray-800">{filteredRuleGroups.length}</strong> / 8 Tên nhóm
              </div>
            </div>

            {/* Filter Tabs by Tên nhóm */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Tên nhóm:
              </span>
              <button
                onClick={() => setQuickAddSelectedGroup('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  quickAddSelectedGroup === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Tất cả Tên nhóm (8)
              </button>

              {MOCK_GROUPS.map(g => {
                const isActive = quickAddSelectedGroup === g.name;
                return (
                  <button
                    key={g.id}
                    onClick={() => setQuickAddSelectedGroup(g.name)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span>{g.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {g.itemCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Toast notification banner */}
            {quickAddNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{quickAddNotification}</span>
              </div>
            )}
          </div>

          {/* Full-Screen Content: List of Rule Groups */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto space-y-6">
              {filteredRuleGroups.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-700 mb-1">Không tìm thấy Nhóm quy tắc nào phù hợp</h4>
                  <p className="text-xs text-gray-500">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc.</p>
                  <button 
                    onClick={() => { setQuickAddSelectedGroup('ALL'); setQuickAddSearchTerm(''); }}
                    className="mt-3 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100"
                  >
                    Xem tất cả 8 Tên nhóm
                  </button>
                </div>
              ) : (
                filteredRuleGroups.map(group => {
                  const allAdded = group.items.every(it => 
                    components.some(c => c.name.trim().toLowerCase() === it.name.trim().toLowerCase())
                  );
                  const addedCount = group.items.filter(it => 
                    components.some(c => c.name.trim().toLowerCase() === it.name.trim().toLowerCase())
                  ).length;

                  return (
                    <div key={group.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      {/* Group Card Header */}
                      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 via-slate-50 to-blue-50/30 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên nhóm:</span>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeColor(group.name)}`}>
                              {group.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">|</span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="font-semibold text-gray-500">Mã nhóm:</span>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-700">{group.code}</span>
                          </div>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs text-gray-600 italic">
                            {group.description}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-500">
                            Đã thêm: <strong className={addedCount === group.itemCount ? 'text-emerald-600' : 'text-blue-600'}>{addedCount}/{group.itemCount}</strong> khoản mục
                          </span>
                          <button
                            onClick={() => handleAddAllFromGroup(group)}
                            disabled={allAdded}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              allAdded
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 hover:border-blue-500 shadow-xs'
                            }`}
                          >
                            {allAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-gray-400" />
                                Đã thêm cả nhóm
                              </>
                            ) : (
                              <>
                                <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
                                Thêm cả nhóm ({group.itemCount} khoản mục)
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Table of items in this Tên nhóm */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-600 font-semibold">
                            <tr>
                              <th className="p-3 w-12 text-center border-r border-gray-200">STT</th>
                              <th className="p-3 w-[260px] border-r border-gray-200">Tên khoản mục</th>
                              <th className="p-3 w-[140px] border-r border-gray-200">Mã khoản mục</th>
                              <th className="p-3 border-r border-gray-200">Mô tả quy tắc tính</th>
                              <th className="p-3 w-[190px] text-center">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {group.items.map((item, idx) => {
                              const isAdded = components.some(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase());
                              return (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                  <td className="p-3 text-center text-gray-500 font-mono border-r border-gray-200">
                                    {idx + 1}
                                  </td>
                                  <td className="p-3 font-semibold text-gray-900 border-r border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <span>{item.name}</span>
                                      {item.khauTruLimit && (
                                        <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                          Hạn mức: {item.khauTruLimit}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 border-r border-gray-200">
                                    <span className="font-mono text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">
                                      {item.code}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-600 border-r border-gray-200">
                                    {item.description || 'Theo quy chế tiền lương của công ty'}
                                  </td>
                                  <td className="p-3 text-center">
                                    {isAdded ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Đã có trong cấu trúc
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleAddFromRuleGroup(group, item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        Thêm vào cấu trúc
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Full-Screen Footer */}
          <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 shadow-sm">
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Cấu trúc lương hiện có <strong className="text-gray-900 font-bold">{components.length}</strong> khoản mục.</span>
            </div>

            <button
              onClick={() => setQuickAddOpen(false)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Hoàn tất & Quay lại Cấu trúc Lương
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
