import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Check, X, RotateCcw, Trash2, Delete, Calculator, 
  HelpCircle, Sparkles, Play, Layers, AlertCircle, CheckCircle2, 
  Info, ChevronDown, ChevronRight, Copy, Plus, MoveRight, Eye, EyeOff, ChevronUp, Save
} from 'lucide-react';
import { 
  MOCK_GROUPS, 
  addSalaryRuleItemToGroup, 
  getAllRuleItemsWithGroup 
} from './SalaryRuleGroupList';

export interface FormulaToken {
  id: string;
  type: 'variable' | 'operator' | 'number' | 'function' | 'parenthesis';
  value: string;
  display: string; // Tên hiển thị của biến hoặc ký hiệu toán tử (TUYỆT ĐỐI KHÔNG DÙNG MÃ BIẾN)
  category?: string;
  color?: string;
}

export interface RuleVariable {
  id: string;
  name: string; // Tên hiển thị
  groupName: string; // Tên nhóm quy tắc lương
  category: 'luong' | 'phucap' | 'hieuqua' | 'bosung' | 'hotro' | 'bhxh' | 'giamtru' | 'thue' | 'chamcong' | 'hethong' | 'cautruc';
  color: string;
  description?: string;
  defaultValue?: number;
  unit?: string;
}

export const getCategoryAndColorForGroup = (groupName: string): { category: RuleVariable['category']; color: string } => {
  switch (groupName) {
    case 'Lương': return { category: 'luong', color: 'blue' };
    case 'Hiệu quả': return { category: 'hieuqua', color: 'indigo' };
    case 'Phụ cấp': return { category: 'phucap', color: 'purple' };
    case 'Bổ sung': return { category: 'bosung', color: 'cyan' };
    case 'Hỗ trợ': return { category: 'hotro', color: 'teal' };
    case 'Bảo hiểm xã hội': return { category: 'bhxh', color: 'amber' };
    case 'Giảm trừ': return { category: 'giamtru', color: 'rose' };
    case 'Thuế TNCN': return { category: 'thue', color: 'orange' };
    case 'Dữ liệu chấm công': return { category: 'chamcong', color: 'emerald' };
    default: return { category: 'luong', color: 'blue' };
  }
};

interface VisualFormulaBuilderProps {
  componentName: string;
  componentGroup?: string;
  initialTokens?: FormulaToken[];
  onSave: (tokens: FormulaToken[], formulaSummary: string) => void;
  onClose: () => void;
  otherComponents?: { id: string; name: string; groupName: string }[];
}

// Danh sách biến chuẩn lấy từ Nhóm quy tắc lương và Hệ thống chấm công
// Chú ý: CHỈ sử dụng Tên hiển thị, không dùng mã biến
export const SYSTEM_VARIABLES: RuleVariable[] = [
  // Nhóm Lương
  { id: 'v_lcb', name: 'Lương cơ bản', groupName: 'Lương', category: 'luong', color: 'blue', description: 'Mức lương cơ bản ghi trên hợp đồng lao động', defaultValue: 12000000, unit: 'đ' },
  { id: 'v_lns', name: 'Lương năng suất', groupName: 'Lương', category: 'luong', color: 'blue', description: 'Lương trả theo năng suất công việc hoặc sản lượng', defaultValue: 3000000, unit: 'đ' },
  { id: 'v_hsl', name: 'Hệ số lương', groupName: 'Lương', category: 'luong', color: 'blue', description: 'Hệ số theo bậc thang bảng lương', defaultValue: 1.5, unit: 'hệ số' },

  // Nhóm Hiệu quả
  { id: 'v_kpi', name: 'Thưởng KPI', groupName: 'Hiệu quả', category: 'hieuqua', color: 'indigo', description: 'Tiền thưởng theo tỷ lệ hoàn thành mục tiêu KPI', defaultValue: 2500000, unit: 'đ' },
  { id: 'v_dt', name: 'Thưởng doanh thu', groupName: 'Hiệu quả', category: 'hieuqua', color: 'indigo', description: 'Hoa hồng trích từ doanh thu bán hàng/dịch vụ', defaultValue: 4000000, unit: 'đ' },

  // Nhóm Phụ cấp
  { id: 'v_pcan', name: 'Phụ cấp ăn trưa', groupName: 'Phụ cấp', category: 'phucap', color: 'purple', description: 'Phụ cấp tiền ăn ca trưa hàng tháng', defaultValue: 730000, unit: 'đ' },
  { id: 'v_pcxang', name: 'Phụ cấp xăng xe', groupName: 'Phụ cấp', category: 'phucap', color: 'purple', description: 'Hỗ trợ chi phí đi lại, xăng xe làm việc', defaultValue: 500000, unit: 'đ' },
  { id: 'v_pccv', name: 'Phụ cấp chức vụ', groupName: 'Phụ cấp', category: 'phucap', color: 'purple', description: 'Phụ cấp trách nhiệm quản lý theo vị trí', defaultValue: 1500000, unit: 'đ' },

  // Nhóm Hỗ trợ & Bổ sung
  { id: 'v_ttn', name: 'Tiền trách nhiệm', groupName: 'Bổ sung', category: 'bosung', color: 'cyan', description: 'Khoản bổ sung cho nhân sự kiêm nhiệm trách nhiệm', defaultValue: 800000, unit: 'đ' },
  { id: 'v_htdt', name: 'Hỗ trợ điện thoại', groupName: 'Hỗ trợ', category: 'hotro', color: 'teal', description: 'Chi phí cước liên lạc phục vụ công việc', defaultValue: 300000, unit: 'đ' },
  { id: 'v_htno', name: 'Hỗ trợ nhà ở', groupName: 'Hỗ trợ', category: 'hotro', color: 'teal', description: 'Trợ cấp tiền thuê nhà định kỳ', defaultValue: 1000000, unit: 'đ' },

  // Dữ liệu Chấm công
  { id: 'v_ncc', name: 'Số ngày công chuẩn', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số ngày làm việc tiêu chuẩn trong tháng (thường 24-26 ngày)', defaultValue: 26, unit: 'ngày' },
  { id: 'v_nctt', name: 'Số ngày công thực tế', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số ngày nhân viên đi làm thực tế có chấm công', defaultValue: 24, unit: 'ngày' },
  { id: 'v_np', name: 'Số ngày nghỉ phép hưởng lương', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số ngày nghỉ phép năm vẫn được tính trả lương', defaultValue: 1, unit: 'ngày' },
  { id: 'v_nkl', name: 'Số ngày nghỉ không lương', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số ngày nghỉ không được hưởng lương', defaultValue: 1, unit: 'ngày' },
  { id: 'v_ot150', name: 'Số giờ làm thêm 150%', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số giờ làm thêm ngày thường (hệ số 1.5)', defaultValue: 6, unit: 'giờ' },
  { id: 'v_ot200', name: 'Số giờ làm thêm 200%', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số giờ làm thêm ngày nghỉ cuối tuần (hệ số 2.0)', defaultValue: 4, unit: 'giờ' },
  { id: 'v_ot300', name: 'Số giờ làm thêm 300%', groupName: 'Dữ liệu chấm công', category: 'chamcong', color: 'emerald', description: 'Số giờ làm thêm ngày lễ, tết (hệ số 3.0)', defaultValue: 0, unit: 'giờ' },

  // Nhóm Bảo hiểm xã hội (NLĐ đóng)
  { id: 'v_bhxh8', name: 'BHXH (8%)', groupName: 'Bảo hiểm xã hội', category: 'bhxh', color: 'amber', description: 'Mức trích nộp BHXH bắt buộc của người lao động (8%)', defaultValue: 960000, unit: 'đ' },
  { id: 'v_bhyt15', name: 'BHYT (1.5%)', groupName: 'Bảo hiểm xã hội', category: 'bhxh', color: 'amber', description: 'Mức trích nộp BHYT bắt buộc của người lao động (1.5%)', defaultValue: 180000, unit: 'đ' },
  { id: 'v_bhtn1', name: 'BHTN (1%)', groupName: 'Bảo hiểm xã hội', category: 'bhxh', color: 'amber', description: 'Mức trích nộp BHTN bắt buộc của người lao động (1%)', defaultValue: 120000, unit: 'đ' },
  { id: 'v_tbh105', name: 'Tổng bảo hiểm bắt buộc (10.5%)', groupName: 'Bảo hiểm xã hội', category: 'bhxh', color: 'amber', description: 'Tổng tỷ lệ các khoản BHXH, BHYT, BHTN người lao động phải nộp', defaultValue: 1260000, unit: 'đ' },

  // Nhóm Giảm trừ gia cảnh
  { id: 'v_gtbt', name: 'Giảm trừ bản thân', groupName: 'Giảm trừ', category: 'giamtru', color: 'rose', description: 'Mức giảm trừ gia cảnh cho bản thân theo luật (11.000.000 đ)', defaultValue: 11000000, unit: 'đ' },
  { id: 'v_gtnpt', name: 'Giảm trừ người phụ thuộc', groupName: 'Giảm trừ', category: 'giamtru', color: 'rose', description: 'Mức giảm trừ 4.400.000 đ/người/tháng', defaultValue: 4400000, unit: 'đ' },
  { id: 'v_snpt', name: 'Số người phụ thuộc', groupName: 'Giảm trừ', category: 'hethong', color: 'rose', description: 'Số lượng người phụ thuộc đã đăng ký giảm trừ hợp lệ', defaultValue: 1, unit: 'người' },

  // Nhóm Thuế TNCN
  { id: 'v_thuetncn', name: 'Thuế TNCN lũy tiến', groupName: 'Thuế TNCN', category: 'thue', color: 'orange', description: 'Số thuế thu nhập cá nhân tính theo biểu thuế lũy tiến từng phần', defaultValue: 350000, unit: 'đ' },
];

// Danh mục "Tên nhóm" đồng bộ trực tiếp từ menu "Nhóm quy tắc Lương"
export const FILTER_RULE_GROUPS = [
  ...MOCK_GROUPS.map(g => ({
    name: g.name,
    code: g.code,
    description: g.description,
  })),
  {
    name: 'Dữ liệu chấm công',
    code: 'SYS_CHAMCONG',
    description: 'Ngày công chuẩn, ngày công thực tế, nghỉ phép, giờ làm thêm OT',
  }
];

// Mẫu công thức tính chuẩn phổ biến (1-Click Formula Templates)
const POPULAR_FORMULAS = [
  {
    name: 'Lương theo ngày công thực tế',
    desc: 'Lương cơ bản chia ngày công chuẩn nhân ngày công thực',
    tokens: [
      { id: 't1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: 't2', type: 'operator', value: '/', display: '÷' },
      { id: 't3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: 't4', type: 'operator', value: '*', display: '×' },
      { id: 't5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' }
    ]
  },
  {
    name: 'Phụ cấp ăn trưa theo ngày công',
    desc: 'Tính theo tỷ lệ ngày đi làm thực tế',
    tokens: [
      { id: 't1', type: 'variable', value: 'Phụ cấp ăn trưa', display: 'Phụ cấp ăn trưa', color: 'purple' },
      { id: 't2', type: 'operator', value: '/', display: '÷' },
      { id: 't3', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: 't4', type: 'operator', value: '*', display: '×' },
      { id: 't5', type: 'variable', value: 'Số ngày công thực tế', display: 'Số ngày công thực tế', color: 'emerald' }
    ]
  },
  {
    name: 'Tiền làm thêm giờ (OT 150%)',
    desc: '(Lương cơ bản / Công chuẩn / 8 giờ) × 1.5 × Giờ làm thêm',
    tokens: [
      { id: 't1', type: 'parenthesis', value: '(', display: '(' },
      { id: 't2', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: 't3', type: 'operator', value: '/', display: '÷' },
      { id: 't4', type: 'variable', value: 'Số ngày công chuẩn', display: 'Số ngày công chuẩn', color: 'emerald' },
      { id: 't5', type: 'operator', value: '/', display: '÷' },
      { id: 't6', type: 'number', value: '8', display: '8' },
      { id: 't7', type: 'parenthesis', value: ')', display: ')' },
      { id: 't8', type: 'operator', value: '*', display: '×' },
      { id: 't9', type: 'number', value: '1.5', display: '1.5' },
      { id: 't10', type: 'operator', value: '*', display: '×' },
      { id: 't11', type: 'variable', value: 'Số giờ làm thêm 150%', display: 'Số giờ làm thêm 150%', color: 'emerald' }
    ]
  },
  {
    name: 'Tổng trích nộp bảo hiểm (10.5%)',
    desc: 'Lương cơ bản × 10.5%',
    tokens: [
      { id: 't1', type: 'variable', value: 'Lương cơ bản', display: 'Lương cơ bản', color: 'blue' },
      { id: 't2', type: 'operator', value: '*', display: '×' },
      { id: 't3', type: 'number', value: '10.5%', display: '10.5%' }
    ]
  },
  {
    name: 'Giảm trừ gia cảnh tổng',
    desc: '11.000.000 + (Số người phụ thuộc × 4.400.000)',
    tokens: [
      { id: 't1', type: 'number', value: '11000000', display: '11,000,000' },
      { id: 't2', type: 'operator', value: '+', display: '+' },
      { id: 't3', type: 'parenthesis', value: '(', display: '(' },
      { id: 't4', type: 'variable', value: 'Số người phụ thuộc', display: 'Số người phụ thuộc', color: 'rose' },
      { id: 't5', type: 'operator', value: '*', display: '×' },
      { id: 't6', type: 'number', value: '4400000', display: '4,400,000' },
      { id: 't7', type: 'parenthesis', value: ')', display: ')' }
    ]
  }
];

export const VisualFormulaBuilder: React.FC<VisualFormulaBuilderProps> = ({
  componentName,
  componentGroup,
  initialTokens = [],
  onSave,
  onClose,
  otherComponents = []
}) => {
  const [tokens, setTokens] = useState<FormulaToken[]>(initialTokens);
  const [history, setHistory] = useState<FormulaToken[][]>([initialTokens]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchVar, setSearchVar] = useState('');
  const [testValues, setTestValues] = useState<Record<string, number>>({
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
    'Số ngày nghỉ phép hưởng lương': 1,
    'Số ngày nghỉ không lương': 1,
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
  });

  const [showTester, setShowTester] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  // State Modal "Thêm khoản mục mới"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalGroupName, setModalGroupName] = useState<string>('');
  const [modalItemName, setModalItemName] = useState<string>('');
  const [modalItemCode, setModalItemCode] = useState<string>('');
  const [modalItemDesc, setModalItemDesc] = useState<string>('');
  const [modalFormErrors, setModalFormErrors] = useState<{ group?: string; name?: string; code?: string }>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [highlightedVarId, setHighlightedVarId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [variablesVersion, setVariablesVersion] = useState(0);

  // Đồng bộ custom variables từ localStorage khi mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('CUSTOM_FORMULA_VARIABLES');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((cv: RuleVariable) => {
            if (!SYSTEM_VARIABLES.some(v => v.id === cv.id || v.name === cv.name)) {
              SYSTEM_VARIABLES.push(cv);
            }
          });
          setVariablesVersion(v => v + 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Lắng nghe sự kiện khi nhóm quy tắc lương thay đổi
  useEffect(() => {
    const handleGroupsUpdate = () => {
      setVariablesVersion(v => v + 1);
    };
    window.addEventListener('SALARY_RULE_GROUPS_UPDATED', handleGroupsUpdate);
    return () => window.removeEventListener('SALARY_RULE_GROUPS_UPDATED', handleGroupsUpdate);
  }, []);

  // Danh mục Tên nhóm tính toán động từ MOCK_GROUPS
  const ruleGroupsList = useMemo(() => [
    ...MOCK_GROUPS.map(g => ({
      name: g.name,
      code: g.code,
      description: g.description,
    })),
    {
      name: 'Dữ liệu chấm công',
      code: 'SYS_CHAMCONG',
      description: 'Ngày công chuẩn, ngày công thực tế, nghỉ phép, giờ làm thêm OT',
    }
  ], [variablesVersion]);

  // Kiểm tra trùng mã khoản mục
  const checkCodeDuplicate = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setDuplicateWarning(null);
      return null;
    }

    // 1. Kiểm tra trong danh sách tất cả các khoản mục của các nhóm trong MOCK_GROUPS
    const allItems = getAllRuleItemsWithGroup();
    const conflictInGroups = allItems.find(item => item.code === trimmed);
    if (conflictInGroups) {
      const msg = `Mã "${trimmed}" đã bị trùng với khoản mục "${conflictInGroups.name}" (thuộc Nhóm "${conflictInGroups.groupName}")!`;
      setDuplicateWarning(msg);
      return conflictInGroups;
    }

    // 2. Kiểm tra trong SYSTEM_VARIABLES
    const conflictInVariables = SYSTEM_VARIABLES.find(v => {
      const vCode = v.id.replace(/^v_/, '').toUpperCase();
      return vCode === trimmed;
    });
    if (conflictInVariables) {
      const msg = `Mã "${trimmed}" đã bị trùng với khoản mục "${conflictInVariables.name}" (thuộc Nhóm "${conflictInVariables.groupName}")!`;
      setDuplicateWarning(msg);
      return conflictInVariables;
    }

    setDuplicateWarning(null);
    return null;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setModalItemCode(rawVal);
    setModalFormErrors(prev => ({ ...prev, code: undefined }));
    checkCodeDuplicate(rawVal);
  };

  const handleOpenAddModal = () => {
    const currentGroup = MOCK_GROUPS.find(g => g.name === activeTab);
    const initialGroup = currentGroup ? currentGroup.name : (MOCK_GROUPS[0]?.name || 'Lương');
    setModalGroupName(initialGroup);
    setModalItemName('');
    setModalItemCode('');
    setModalItemDesc('');
    setModalFormErrors({});
    setDuplicateWarning(null);
    setIsAddModalOpen(true);
  };

  const handleSaveNewItem = () => {
    const errors: { group?: string; name?: string; code?: string } = {};

    if (!modalGroupName.trim()) {
      errors.group = 'Vui lòng chọn Tên nhóm quy tắc Lương.';
    }

    if (!modalItemName.trim()) {
      errors.name = 'Vui lòng nhập Tên khoản mục.';
    }

    if (!modalItemCode.trim()) {
      errors.code = 'Vui lòng nhập Mã khoản mục.';
    }

    const duplicateConflict = checkCodeDuplicate(modalItemCode);
    if (duplicateConflict) {
      errors.code = `Mã khoản mục này đã bị trùng với khoản mục "${duplicateConflict.name}" (thuộc Nhóm "${duplicateConflict.groupName}")!`;
    }

    if (Object.keys(errors).length > 0) {
      setModalFormErrors(errors);
      return;
    }

    // 1. Lưu vào trong Tên nhóm trong menu của "Nhóm quy tắc Lương"
    addSalaryRuleItemToGroup(modalGroupName, {
      name: modalItemName.trim(),
      code: modalItemCode.trim().toUpperCase(),
      description: modalItemDesc.trim(),
    });

    // 2. Lưu và hiển thị luôn ở trong khu vực "Click chuột để chọn Nhóm quy tắc Lương & khoản mục liên quan đưa vào công thức"
    const helperColors = getCategoryAndColorForGroup(modalGroupName);
    const newVarId = `v_${modalItemCode.trim().toLowerCase()}`;
    const newVar: RuleVariable = {
      id: newVarId,
      name: modalItemName.trim(),
      groupName: modalGroupName,
      category: helperColors.category,
      color: helperColors.color,
      description: modalItemDesc.trim() || `Khoản mục thuộc nhóm ${modalGroupName}`,
      defaultValue: 1000000,
      unit: 'đ',
    };

    const existingIndex = SYSTEM_VARIABLES.findIndex(v => v.name === newVar.name || v.id === newVar.id);
    if (existingIndex >= 0) {
      SYSTEM_VARIABLES[existingIndex] = newVar;
    } else {
      SYSTEM_VARIABLES.push(newVar);
    }

    try {
      const customVars = SYSTEM_VARIABLES.filter(v => !['v_lcb', 'v_lns', 'v_hsl', 'v_kpi', 'v_dt', 'v_pcan', 'v_pcxang', 'v_pccv', 'v_ttn', 'v_htdt', 'v_htno', 'v_ncc', 'v_nctt', 'v_np', 'v_nkl', 'v_ot150', 'v_ot200', 'v_ot300', 'v_bhxh8', 'v_bhyt15', 'v_bhtn1', 'v_tbh105', 'v_gtbt', 'v_gtnpt', 'v_snpt', 'v_thuetncn'].includes(v.id));
      localStorage.setItem('CUSTOM_FORMULA_VARIABLES', JSON.stringify(customVars));
    } catch (err) {
      console.error(err);
    }

    // Chuyển tab sang nhóm đã chọn, xóa từ khóa tìm kiếm và highlight khoản mục mới
    setActiveTab(modalGroupName);
    setSearchVar('');
    setHighlightedVarId(newVarId);
    setVariablesVersion(prev => prev + 1);

    // Đóng modal & hiển thị thông báo thành công
    setIsAddModalOpen(false);
    setSuccessToast(`Đã thêm thành công khoản mục "[${newVar.name}]" vào nhóm "${modalGroupName}"!`);

    setTimeout(() => {
      setHighlightedVarId(null);
    }, 4000);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Push to undo history
  const pushHistory = (newTokens: FormulaToken[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newTokens);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setTokens(newTokens);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setTokens(history[prevIndex]);
    }
  };

  const handleClear = () => {
    pushHistory([]);
  };

  const handleBackspace = () => {
    if (tokens.length > 0) {
      pushHistory(tokens.slice(0, -1));
    }
  };

  const removeToken = (id: string) => {
    pushHistory(tokens.filter(t => t.id !== id));
  };

  // Click to insert a variable pill
  const insertVariable = (variable: RuleVariable | { name: string; groupName: string; color?: string }) => {
    const newToken: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'variable',
      value: variable.name,
      display: variable.name, // CHỈ DÙNG TÊN HIỂN THỊ
      category: variable.groupName,
      color: variable.color || 'blue'
    };
    pushHistory([...tokens, newToken]);
  };

  // Click to insert an operator
  const insertOperator = (op: string, displaySymbol?: string) => {
    const newToken: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'operator',
      value: op,
      display: displaySymbol || op
    };
    pushHistory([...tokens, newToken]);
  };

  // Click to insert a parenthesis
  const insertParenthesis = (p: '(' | ')') => {
    const newToken: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'parenthesis',
      value: p,
      display: p
    };
    pushHistory([...tokens, newToken]);
  };

  // Click to insert a number / constant
  const insertNumber = (numStr: string, displayStr?: string) => {
    const newToken: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'number',
      value: numStr,
      display: displayStr || numStr
    };
    pushHistory([...tokens, newToken]);
  };

  // Click to insert a visual function
  const insertFunction = (fnName: string, display: string) => {
    const newToken: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'function',
      value: fnName,
      display: display
    };
    const openParen: FormulaToken = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'parenthesis',
      value: '(',
      display: '('
    };
    pushHistory([...tokens, newToken, openParen]);
  };

  // Apply a popular template
  const applyTemplate = (template: typeof POPULAR_FORMULAS[0]) => {
    const freshTokens = template.tokens.map(t => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9)
    }));
    pushHistory(freshTokens as FormulaToken[]);
    setShowTemplates(false);
  };

  // Drag and drop handling
  const handleDragStart = (e: React.DragEvent, variable: RuleVariable) => {
    e.dataTransfer.setData('application/json', JSON.stringify(variable));
  };

  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const variable = JSON.parse(dataStr);
        insertVariable(variable);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered variables based on selected "Tên nhóm" and search keyword
  const filteredVariables = useMemo(() => {
    return SYSTEM_VARIABLES.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(searchVar.toLowerCase()) || 
                          v.groupName.toLowerCase().includes(searchVar.toLowerCase()) ||
                          (v.description && v.description.toLowerCase().includes(searchVar.toLowerCase()));
      if (!matchSearch) return false;
      if (activeTab === 'all') return true;
      return v.groupName === activeTab;
    });
  }, [activeTab, searchVar, variablesVersion]);

  // Syntax validation
  const validation = useMemo(() => {
    if (tokens.length === 0) {
      return { valid: false, message: 'Công thức đang để trống. Vui lòng nhấp chọn các biến và phép tính bên dưới.' };
    }

    let parenCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.value === '(') parenCount++;
      if (t.value === ')') parenCount--;
      if (parenCount < 0) {
        return { valid: false, message: 'Thừa dấu đóng ngoặc ")" ở vị trí ' + (i + 1) };
      }

      // Check consecutive operators
      if (i > 0) {
        const prev = tokens[i - 1];
        if (prev.type === 'operator' && t.type === 'operator') {
          return { valid: false, message: `Hai toán tử đứng liền kề: "${prev.display}" và "${t.display}". Vui lòng xóa bớt.` };
        }
      }
    }

    if (parenCount !== 0) {
      return { valid: false, message: `Chưa đóng đủ dấu ngoặc đơn (${parenCount > 0 ? `thiếu ${parenCount} dấu ")"` : 'thừa dấu ")"'}).` };
    }

    const lastToken = tokens[tokens.length - 1];
    if (lastToken.type === 'operator') {
      return { valid: false, message: `Công thức không thể kết thúc bằng toán tử "${lastToken.display}".` };
    }

    return { valid: true, message: 'Cú pháp công thức hợp lệ! Có thể lưu và áp dụng ngay.' };
  }, [tokens]);

  // Unique variables currently present in the formula
  const formulaVariables = useMemo(() => {
    const map = new Map<string, { name: string; category?: string; color?: string; unit?: string; defaultValue: number }>();
    tokens.forEach(t => {
      if (t.type === 'variable' && !map.has(t.value)) {
        const sysVar = SYSTEM_VARIABLES.find(sv => sv.name === t.value);
        map.set(t.value, {
          name: t.value,
          category: t.category || sysVar?.groupName || 'Khoản mục',
          color: t.color || sysVar?.color || 'blue',
          unit: sysVar?.unit || 'đ',
          defaultValue: sysVar?.defaultValue ?? (t.value.toLowerCase().includes('ngày') || t.value.toLowerCase().includes('công') ? 26 : 1000000)
        });
      }
    });
    return Array.from(map.values());
  }, [tokens]);

  // Formula evaluation for simulator
  const simulatedResult = useMemo(() => {
    if (tokens.length === 0 || !validation.valid) return null;

    try {
      // Build safe math expression
      let expr = '';
      for (const t of tokens) {
        if (t.type === 'variable') {
          const sysVar = SYSTEM_VARIABLES.find(sv => sv.name === t.value);
          const defaultVal = sysVar?.defaultValue ?? (t.value.toLowerCase().includes('ngày') || t.value.toLowerCase().includes('công') ? 26 : 1000000);
          const val = testValues[t.value] !== undefined ? testValues[t.value] : defaultVal;
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

      // Safe evaluation using Function
      const cleanExpr = expr.replace(/[^0-9+\-*/().,% Math.maxinround]/g, '');
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${cleanExpr})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result);
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [tokens, testValues, validation]);

  // Substituted expression preview for simulation
  const evaluatedExpressionPreview = useMemo(() => {
    if (tokens.length === 0) return '';
    return tokens.map(t => {
      if (t.type === 'variable') {
        const sysVar = SYSTEM_VARIABLES.find(sv => sv.name === t.value);
        const defaultVal = sysVar?.defaultValue ?? (t.value.toLowerCase().includes('ngày') || t.value.toLowerCase().includes('công') ? 26 : 1000000);
        const val = testValues[t.value] !== undefined ? testValues[t.value] : defaultVal;
        return val.toLocaleString('vi-VN');
      }
      return t.display;
    }).join(' ');
  }, [tokens, testValues]);

  // Formatted human summary
  const formulaSummary = useMemo(() => {
    return tokens.map(t => t.display).join(' ');
  }, [tokens]);

  const handleSaveFormula = () => {
    onSave(tokens, formulaSummary);
  };

  // Color helper for pills
  const getPillStyle = (color?: string, type?: string) => {
    if (type === 'operator') {
      return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
    }
    if (type === 'parenthesis') {
      return 'bg-purple-50 text-purple-900 border-purple-300 font-bold';
    }
    if (type === 'number') {
      return 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium';
    }
    if (type === 'function') {
      return 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold';
    }

    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'purple': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'indigo': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'emerald': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'rose': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'cyan': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'teal': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'orange': return 'bg-orange-50 text-orange-800 border-orange-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getVariableDotColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'indigo': return 'bg-indigo-500';
      case 'emerald': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      case 'cyan': return 'bg-cyan-500';
      case 'teal': return 'bg-teal-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getVariableCardStyle = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-white hover:bg-blue-50/60 border-slate-200 hover:border-blue-400';
      case 'purple': return 'bg-white hover:bg-purple-50/60 border-slate-200 hover:border-purple-400';
      case 'indigo': return 'bg-white hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-400';
      case 'emerald': return 'bg-white hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-400';
      case 'amber': return 'bg-white hover:bg-amber-50/60 border-slate-200 hover:border-amber-400';
      case 'rose': return 'bg-white hover:bg-rose-50/60 border-slate-200 hover:border-rose-400';
      case 'cyan': return 'bg-white hover:bg-cyan-50/60 border-slate-200 hover:border-cyan-400';
      case 'teal': return 'bg-white hover:bg-teal-50/60 border-slate-200 hover:border-teal-400';
      case 'orange': return 'bg-white hover:bg-orange-50/60 border-slate-200 hover:border-orange-400';
      default: return 'bg-white hover:bg-blue-50/60 border-slate-200 hover:border-blue-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F8] flex flex-col font-sans text-gray-800 overflow-hidden animate-fadeIn">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Đang thiết lập công thức cho:</span>
              <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {componentName}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3.5 py-2 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 text-[13px] font-medium flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Mẫu công thức phổ biến (1-Click)
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-[13px] font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSaveFormula}
            disabled={!validation.valid}
            className={`px-5 py-2 rounded text-[13px] font-medium flex items-center gap-2 shadow-sm transition-all ${
              validation.valid 
                ? 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Áp dụng công thức
          </button>
        </div>
      </header>

      {/* Main Workspace Body - smooth unified scroll */}
      <div className="flex-1 overflow-y-auto flex flex-col p-5 gap-4">
        
        {/* FORMULA DISPLAY CANVAS (STICKY - ALWAYS VISIBLE WHEN SCROLLING) */}
        <div className="sticky top-0 z-30 -mt-1 pt-1 pb-1 bg-[#F4F6F8]">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnCanvas}
            className="bg-white rounded-xl border-2 border-blue-300 shadow-md p-4 flex flex-col shrink-0 min-h-[140px] max-h-[190px] relative transition-all"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Khung hiển thị công thức (Kéo thả hoặc nhấp chọn biến bên dưới)</span>
                <span className="text-[11px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Hiển thị chuẩn: [Tên biến hiển thị]
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackspace}
                  disabled={tokens.length === 0}
                  className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 transition-colors disabled:opacity-40"
                  title="Xóa phần tử vừa thêm"
                >
                  <Delete className="w-3.5 h-3.5 text-gray-600" />
                  <span>Xóa cuối</span>
                </button>
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 transition-colors disabled:opacity-40"
                  title="Hoàn tác thao tác trước"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
                  <span>Hoàn tác</span>
                </button>
                <button
                  onClick={handleClear}
                  disabled={tokens.length === 0}
                  className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs flex items-center gap-1 transition-colors disabled:opacity-40"
                  title="Xóa toàn bộ công thức"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Xóa hết</span>
                </button>
              </div>
            </div>

            {/* Tokens container */}
            <div className="flex-1 overflow-y-auto py-3 flex flex-wrap items-center gap-2 content-start">
              {tokens.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic gap-2 py-4">
                  <span>Chưa có phần tử nào trong công thức. Vui lòng nhấp vào các biến từ "Nhóm quy tắc lương" hoặc phép tính bên dưới.</span>
                </div>
              ) : (
                tokens.map((token, index) => (
                  <div
                    key={token.id}
                    className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium shadow-xs transition-all animate-fadeIn ${getPillStyle(token.color, token.type)}`}
                  >
                    {token.type === 'variable' && (
                      <span className="text-[11px] font-bold text-gray-500 mr-0.5">[{token.display}]</span>
                    )}
                    {token.type !== 'variable' && (
                      <span className="font-semibold">{token.display}</span>
                    )}
                    
                    {/* Delete button on each pill (Click to remove) */}
                    <button
                      onClick={() => removeToken(token.id)}
                      className="w-4 h-4 rounded-full bg-black/10 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center transition-colors ml-0.5"
                      title="Xóa phần tử này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Validation Banner at bottom of canvas */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {validation.message}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    {validation.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRÌNH KIỂM TRA & GIẢ LẬP KẾT QUẢ THỰC TẾ (NẰM DƯỚI KHUNG HIỂN THỊ CÔNG THỨC) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 shrink-0 transition-all">
          {/* Header */}
          <div 
            onClick={() => setShowTester(!showTester)}
            className="flex items-center justify-between cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <Play className="w-3.5 h-3.5 fill-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                    Trình kiểm tra & Giả lập kết quả thực tế
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    formulaVariables.length > 0 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {formulaVariables.length > 0 ? `${formulaVariables.length} biến trong công thức` : 'Chưa có biến nào'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Tự động hiển thị các trường nhập liệu tương ứng với mọi biến có trong công thức để bạn nhập số kiểm tra
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTester(!showTester);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  showTester 
                    ? 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs'
                }`}
              >
                {showTester ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                    <span>Ẩn trình giả lập</span>
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hiện trình giả lập</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulator Content (No scrolling, dynamic fields) */}
          {showTester && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {formulaVariables.length === 0 ? (
                <div className="py-3 px-3.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 italic flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 not-italic" />
                    <span>
                      Công thức hiện chưa có biến nào. Khi bạn nhấp chọn biến (ví dụ: <strong>Lương cơ bản, Số ngày công thực tế, Phụ cấp...</strong>) từ kho bên dưới, các ô nhập liệu sẽ tự động xuất hiện tại đây.
                    </span>
                  </div>
                  {simulatedResult !== null && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-md font-bold text-xs shrink-0 ml-3 not-italic">
                      Kết quả hằng số: {simulatedResult.toLocaleString('vi-VN')} đ
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Dynamic Fields Grid - Adaptive without vertical scroll */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {formulaVariables.map((v) => {
                      const currentVal = testValues[v.name] !== undefined ? testValues[v.name] : v.defaultValue;
                      return (
                        <div 
                          key={v.name} 
                          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between transition-colors shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[11px] font-bold text-slate-800 truncate" title={v.name}>
                              {v.name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                              {v.unit}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVal}
                              onChange={e => setTestValues({ ...testValues, [v.name]: Number(e.target.value) })}
                              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary & Live Result */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 truncate min-w-0">
                      <span className="text-gray-500 text-[11px] font-medium shrink-0">Công thức thay số thực tế:</span>
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 truncate max-w-xl">
                        {evaluatedExpressionPreview || formulaSummary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-gray-500 text-[11px] font-medium">Kết quả giả lập:</span>
                      <div className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-2 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{simulatedResult !== null ? `${simulatedResult.toLocaleString('vi-VN')} VNĐ` : 'Chưa đủ điều kiện tính'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* POPULAR TEMPLATES MODAL / SLIDE-IN */}
        {showTemplates && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Chọn mẫu công thức tính lương phổ biến (1-Click điền ngay):</span>
              </div>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {POPULAR_FORMULAS.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => applyTemplate(item)}
                  className="bg-white p-3 rounded-lg border border-indigo-100 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-[13px]">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="mt-2 text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                    <span>Áp dụng mẫu này</span>
                    <MoveRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTION AREA (Split into Left: Variables, Right: Keypad & Simulator) */}
        <div className="grid grid-cols-12 gap-4 items-start">
          
          {/* LEFT 8 COLUMNS: CATEGORIZED VARIABLE CATALOG (NO INTERNAL SCROLLING) */}
          <div className="col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            {/* Header of Variable Catalog */}
            <div className="p-3.5 border-b border-gray-200 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Click chuột để chọn Nhóm quy tắc Lương & khoản mục liên quan đưa vào công thức</span>
                </h3>
              </div>

              {/* Action buttons & Search input */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm khoản mục mới</span>
                </button>

                {/* Search input */}
                <input
                  type="text"
                  value={searchVar}
                  onChange={e => setSearchVar(e.target.value)}
                  placeholder="Tìm biến nhanh..."
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-xs w-[180px] bg-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category tabs: Hiển thị dữ liệu "Tên nhóm" từ menu "Nhóm quy tắc Lương" */}
            <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2.5 border-b border-gray-200 bg-gray-50/70 text-xs shrink-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Tên nhóm:
              </span>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Tất cả nhóm ({SYSTEM_VARIABLES.length})
              </button>

              {ruleGroupsList.map((g) => {
                const count = SYSTEM_VARIABLES.filter(v => v.groupName === g.name).length;
                const isActive = activeTab === g.name;
                return (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => setActiveTab(g.name)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span>{g.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active group informational status bar */}
            {activeTab !== 'all' && (
              <div className="px-3.5 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-blue-900 shrink-0">Nhóm: {activeTab}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 truncate">
                    {ruleGroupsList.find(g => g.name === activeTab)?.description}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-full shadow-2xs shrink-0 ml-2">
                  {filteredVariables.length} khoản mục
                </span>
              </div>
            )}

            {/* Variable Cards Grid - NO INTERNAL SCROLLBAR */}
            <div className="p-3.5 grid grid-cols-2 lg:grid-cols-3 gap-2 content-start">
              {filteredVariables.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  draggable
                  onDragStart={(e) => handleDragStart(e, v)}
                  onClick={() => insertVariable(v)}
                  className={`p-2.5 rounded-lg border text-left transition-all hover:scale-[1.01] hover:shadow-sm flex items-center justify-between group cursor-pointer ${
                    v.id === highlightedVarId 
                      ? 'ring-2 ring-blue-500 bg-blue-50/90 shadow-md scale-[1.02]' 
                      : getVariableCardStyle(v.color)
                  }`}
                  title={`${v.name}: ${v.description} (Mẫu: ${v.defaultValue?.toLocaleString('vi-VN')} ${v.unit})`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${getVariableDotColor(v.color)}`} />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-blue-700 truncate">
                          [{v.name}]
                        </span>
                        {v.id === highlightedVarId && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white animate-pulse shrink-0">
                            Mới thêm
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        {v.groupName} • {v.defaultValue ? v.defaultValue.toLocaleString('vi-VN') : '0'} {v.unit}
                      </div>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors shrink-0 ml-1.5 shadow-2xs">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}

              {filteredVariables.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-gray-400">
                  Không tìm thấy biến nào phù hợp với từ khóa "{searchVar}"
                </div>
              )}

              {/* Other already configured components in this structure */}
              {otherComponents.length > 0 && (
                <div className="col-span-full pt-2.5 mt-1 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thành phần đã định nghĩa trong Cấu trúc này:</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {otherComponents.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => insertVariable({ name: c.name, groupName: c.groupName, color: 'indigo' })}
                        className="bg-indigo-50/70 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg p-2 cursor-pointer transition-all flex items-center justify-between group text-left"
                      >
                        <div className="truncate">
                          <span className="text-xs font-bold text-indigo-900">[{c.name}]</span>
                          <div className="text-[10px] text-indigo-600 truncate">{c.groupName}</div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-indigo-500 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: VISUAL OPERATOR & NUMBER KEYPAD + SIMULATOR */}
          <div className="col-span-4 flex flex-col gap-3 min-w-0">
            
            {/* Keypad Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col shrink-0">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                  Bàn phím Toán tử & Hằng số
                </span>
                <span className="text-[10px] text-gray-400">100% Click</span>
              </div>

              {/* Basic Arithmetic Operators */}
              <div className="mb-2">
                <div className="text-[10px] font-semibold text-gray-500 mb-1">Toán tử cơ bản:</div>
                <div className="grid grid-cols-6 gap-1">
                  <button
                    onClick={() => insertOperator('+', '+')}
                    className="h-8.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-base border border-amber-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => insertOperator('-', '-')}
                    className="h-8.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-base border border-amber-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    −
                  </button>
                  <button
                    onClick={() => insertOperator('*', '×')}
                    className="h-8.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-base border border-amber-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    ×
                  </button>
                  <button
                    onClick={() => insertOperator('/', '÷')}
                    className="h-8.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-base border border-amber-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    ÷
                  </button>
                  <button
                    onClick={() => insertParenthesis('(')}
                    className="h-8.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-sm border border-purple-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    (
                  </button>
                  <button
                    onClick={() => insertParenthesis(')')}
                    className="h-8.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-sm border border-purple-300 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    )
                  </button>
                </div>
              </div>

              {/* Numeric Keypad */}
              <div>
                <div className="text-[10px] font-semibold text-gray-500 mb-1">Bàn phím số:</div>
                <div className="grid grid-cols-3 gap-1">
                  {['7', '8', '9'].map((val) => (
                    <button
                      key={val}
                      onClick={() => insertNumber(val)}
                      className="h-8 rounded-lg font-bold text-sm border bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 transition-colors shadow-2xs"
                    >
                      {val}
                    </button>
                  ))}
                  {['4', '5', '6'].map((val) => (
                    <button
                      key={val}
                      onClick={() => insertNumber(val)}
                      className="h-8 rounded-lg font-bold text-sm border bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 transition-colors shadow-2xs"
                    >
                      {val}
                    </button>
                  ))}
                  {['1', '2', '3'].map((val) => (
                    <button
                      key={val}
                      onClick={() => insertNumber(val)}
                      className="h-8 rounded-lg font-bold text-sm border bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 transition-colors shadow-2xs"
                    >
                      {val}
                    </button>
                  ))}
                  {['0', '000', '.'].map((val) => (
                    <button
                      key={val}
                      onClick={() => insertNumber(val)}
                      className="h-8 rounded-lg font-bold text-sm border bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 transition-colors shadow-2xs"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* THÔNG BÁO TOAST KHI LƯU THÀNH CÔNG */}
      {successToast && (
        <div className="fixed top-5 right-5 z-60 bg-emerald-600 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 animate-fadeIn border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* MODAL THÊM KHOẢN MỤC MỚI VÀO NHÓM QUY TẮC LƯƠNG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Thêm khoản mục mới</h3>
                  <p className="text-[11px] text-gray-500">
                    Khoản mục sẽ được lưu vào Nhóm quy tắc Lương & hiển thị ngay tại kho biến công thức
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              
              {/* Field 1: Tên nhóm quy tắc Lương (list có sẵn trong hệ thống, bắt buộc phải chọn) */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Tên nhóm quy tắc Lương <span className="text-red-500">*</span>
                </label>
                <select
                  value={modalGroupName}
                  onChange={(e) => {
                    setModalGroupName(e.target.value);
                    setModalFormErrors(prev => ({ ...prev, group: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                    modalFormErrors.group ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Chọn nhóm quy tắc Lương --</option>
                  {MOCK_GROUPS.map(g => (
                    <option key={g.code} value={g.name}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </select>
                {modalFormErrors.group && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {modalFormErrors.group}
                  </p>
                )}
              </div>

              {/* Field 2: Mô tả (read-only, hiển thị theo field "Tên nhóm quy tắc Lương") */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-800">
                    Mô tả nhóm quy tắc
                  </label>
                  <span className="text-[11px] font-normal text-gray-400 italic">
                    (Read-only, hiển thị theo Tên nhóm)
                  </span>
                </div>
                <textarea
                  readOnly
                  rows={2}
                  value={MOCK_GROUPS.find(g => g.name === modalGroupName)?.description || (modalGroupName ? 'Không có mô tả' : 'Vui lòng chọn Tên nhóm quy tắc Lương ở trên')}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 rounded-md text-xs resize-none cursor-not-allowed outline-none select-none"
                />
              </div>

              {/* Field 3: Tên khoản mục (input vào, bắt buộc) */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Tên khoản mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Phụ cấp chuyên cần, Thưởng sáng kiến..."
                  value={modalItemName}
                  onChange={(e) => {
                    setModalItemName(e.target.value);
                    setModalFormErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    modalFormErrors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {modalFormErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {modalFormErrors.name}
                  </p>
                )}
              </div>

              {/* Field 4: Mã khoản mục (không được trùng, phải nhập) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-800">
                    Mã khoản mục <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-normal text-gray-500">
                    (Bắt buộc, không được trùng)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="VD: PC_CHUYENCAN, THUONG_SK..."
                  value={modalItemCode}
                  onChange={handleCodeChange}
                  className={`w-full px-3 py-2 border rounded-md text-xs uppercase bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    (modalFormErrors.code || duplicateWarning) ? 'border-red-500 bg-red-50/20 text-red-900 font-semibold' : 'border-gray-300'
                  }`}
                />
                
                {/* Thông báo lỗi trùng đích danh khoản mục nào luôn */}
                {duplicateWarning && (
                  <div className="mt-1.5 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Cảnh báo trùng mã: </span>
                      <span>{duplicateWarning}</span>
                    </div>
                  </div>
                )}

                {modalFormErrors.code && !duplicateWarning && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {modalFormErrors.code}
                  </p>
                )}
              </div>

              {/* Field 5: Mô tả của khoản mục (cho phép rỗng) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-800">
                    Mô tả
                  </label>
                  <span className="text-[11px] font-normal text-gray-400 italic">
                    (Cho phép để trống)
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Nhập mô tả chi tiết hoặc ghi chú căn cứ tính toán (không bắt buộc)..."
                  value={modalItemDesc}
                  onChange={(e) => setModalItemDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-200 bg-[#F8FAFC] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNewItem}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
