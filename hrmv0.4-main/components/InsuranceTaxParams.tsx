import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Receipt, 
  Settings2, 
  FileText, 
  Check, 
  Info,
  Calendar,
  Layers,
  Save,
  RotateCcw,
  Copy,
  Users
} from 'lucide-react';

// Interface cho Bậc thuế lũy tiến
export interface TaxBracket {
  id: string;
  level: number;
  fromAmount: number;
  toAmount: number | null; // null = không giới hạn trên (> mức này)
  taxRate: number; // %
  quickDeduction: number; // Số trừ tính nhanh (VNĐ)
}

// Interface cho phiên bản Giảm trừ gia cảnh (GTGC)
export interface FamilyDeductionVersion {
  id: string;
  versionName: string;
  description: string;
  effectiveDate: string;
  expiryDate?: string;
  personalDeduction: number; // GTGC bản thân (VNĐ)
  dependentDeduction: number; // GTGC người phụ thuộc (VNĐ)
  isApplied: boolean; // Áp dụng: dạng tick, 1 thời điểm chỉ được chọn 1
  fileName?: string;
}

// Interface cho phiên bản Thuế TNCN
export interface PitVersion {
  id: string;
  versionName: string;
  description: string;
  effectiveDate: string;
  expiryDate?: string;
  isDefault: boolean;
  fileName?: string;
  brackets: TaxBracket[];
}

// Interface cho phiên bản BHXH
export interface SocialInsuranceVersion {
  id: string;
  versionName: string;
  description: string;
  effectiveDate: string;
  expiryDate?: string;
  retirementDeath: number; // Hưu trí & Tử tuất (%)
  sicknessMaternity: number; // Ốm đau & Thai sản (%)
  occupationalHazard: number; // TNLĐ-BNN (%)
  healthInsurance: number; // BHYT (%)
  unemploymentInsurance: number; // BHTN (%)
  totalEmployeeRate: number; // Tổng % NLĐ đóng (%)
  totalEmployerRate: number; // Tổng % NSDLĐ đóng (%)
  isDefault: boolean;
  fileName?: string;
}

// Dữ liệu mẫu ban đầu cho Biểu thuế lũy tiến 7 bậc (Thông tư 111/2013/TT-BTC)
const DEFAULT_STANDARD_BRACKETS: TaxBracket[] = [
  { id: 'b_1', level: 1, fromAmount: 0, toAmount: 5000000, taxRate: 5, quickDeduction: 0 },
  { id: 'b_2', level: 2, fromAmount: 5000000, toAmount: 10000000, taxRate: 10, quickDeduction: 250000 },
  { id: 'b_3', level: 3, fromAmount: 10000000, toAmount: 18000000, taxRate: 15, quickDeduction: 750000 },
  { id: 'b_4', level: 4, fromAmount: 18000000, toAmount: 32000000, taxRate: 20, quickDeduction: 1650000 },
  { id: 'b_5', level: 5, fromAmount: 32000000, toAmount: 52000000, taxRate: 25, quickDeduction: 3250000 },
  { id: 'b_6', level: 6, fromAmount: 52000000, toAmount: 80000000, taxRate: 30, quickDeduction: 5850000 },
  { id: 'b_7', level: 7, fromAmount: 80000000, toAmount: null, taxRate: 35, quickDeduction: 9850000 },
];

export const InsuranceTaxParams: React.FC = () => {
  // Trạng thái ẩn/hiện từng khu vực
  const [isSocialInsOpen, setIsSocialInsOpen] = useState<boolean>(true);
  const [isPitOpen, setIsPitOpen] = useState<boolean>(true);
  const [isDeductionOpen, setIsDeductionOpen] = useState<boolean>(true);

  // Danh sách phiên bản BHXH
  const [socialInsList, setSocialInsList] = useState<SocialInsuranceVersion[]>([
    {
      id: 'si_1',
      versionName: 'Quy chuẩn BHXH 2024 - 2026 (Nghị định 58 & 143)',
      description: 'Tỷ lệ trích đóng BHXH, BHYT, BHTN chuẩn theo quy định hiện hành',
      effectiveDate: '2024-07-01',
      expiryDate: '',
      retirementDeath: 22,
      sicknessMaternity: 3,
      occupationalHazard: 0.5,
      healthInsurance: 4.5,
      unemploymentInsurance: 2,
      totalEmployeeRate: 10.5,
      totalEmployerRate: 21.5,
      isDefault: true,
      fileName: 'Nghi_dinh_58_2020_NDCP.pdf'
    },
    {
      id: 'si_2',
      versionName: 'Phiên bản BHXH hỗ trợ Covid (Nghị quyết 68)',
      description: 'Giảm mức đóng vào Quỹ bảo hiểm tai nạn lao động, bệnh nghề nghiệp về 0%',
      effectiveDate: '2021-07-01',
      expiryDate: '2022-06-30',
      retirementDeath: 22,
      sicknessMaternity: 3,
      occupationalHazard: 0,
      healthInsurance: 4.5,
      unemploymentInsurance: 2,
      totalEmployeeRate: 10.5,
      totalEmployerRate: 21,
      isDefault: false,
      fileName: 'Nghi_quyet_68_NQ_CP.pdf'
    }
  ]);

  // Danh sách phiên bản Thuế TNCN
  const [pitList, setPitList] = useState<PitVersion[]>([
    {
      id: 'pit_1',
      versionName: 'Biểu thuế lũy tiến từng phần 7 bậc (Thông tư 111/2013/TT-BTC)',
      description: 'Áp dụng đối với thu nhập từ tiền lương, tiền công của cá nhân cư trú có ký HĐLĐ từ 03 tháng trở lên',
      effectiveDate: '2024-01-01',
      expiryDate: '',
      isDefault: true,
      fileName: 'Thong_tu_111_2013_TT_BTC.pdf',
      brackets: JSON.parse(JSON.stringify(DEFAULT_STANDARD_BRACKETS))
    },
    {
      id: 'pit_2',
      versionName: 'Dự thảo cải cách Biểu thuế TNCN 5 bậc',
      description: 'Phương án đề xuất thu gọn biểu thuế lũy tiến từ 7 bậc xuống còn 5 bậc theo tinh thần cải cách thuế',
      effectiveDate: '2026-01-01',
      expiryDate: '',
      isDefault: false,
      fileName: 'De_xuat_bieu_thue_5_bac.pdf',
      brackets: [
        { id: 'b5_1', level: 1, fromAmount: 0, toAmount: 10000000, taxRate: 5, quickDeduction: 0 },
        { id: 'b5_2', level: 2, fromAmount: 10000000, toAmount: 30000000, taxRate: 15, quickDeduction: 1000000 },
        { id: 'b5_3', level: 3, fromAmount: 30000000, toAmount: 60000000, taxRate: 25, quickDeduction: 4000000 },
        { id: 'b5_4', level: 4, fromAmount: 60000000, toAmount: 100000000, taxRate: 30, quickDeduction: 7000000 },
        { id: 'b5_5', level: 5, fromAmount: 100000000, toAmount: null, taxRate: 35, quickDeduction: 12000000 },
      ]
    }
  ]);

  // Danh sách phiên bản Giảm trừ gia cảnh (GTGC)
  const [deductionList, setDeductionList] = useState<FamilyDeductionVersion[]>([
    {
      id: 'gtgc_1',
      versionName: 'Nghị quyết 954/2020/UBTVQH14',
      description: 'Mức giảm trừ gia cảnh hiện hành (11 triệu bản thân, 4.4 triệu người phụ thuộc/tháng)',
      effectiveDate: '2020-07-01',
      expiryDate: '',
      personalDeduction: 11000000,
      dependentDeduction: 4400000,
      isApplied: true,
      fileName: 'Nghi_quyet_954_2020_UBTVQH14.pdf'
    },
    {
      id: 'gtgc_2',
      versionName: 'Dự thảo điều chỉnh GTGC 2026',
      description: 'Dự thảo nâng mức giảm trừ gia cảnh thuế TNCN theo biến động chỉ số CPI',
      effectiveDate: '2026-01-01',
      expiryDate: '',
      personalDeduction: 15000000,
      dependentDeduction: 6000000,
      isApplied: false,
      fileName: 'Du_thao_nang_muc_GTGC_2026.pdf'
    },
    {
      id: 'gtgc_3',
      versionName: 'Nghị quyết 01/2012/UBTVQH13',
      description: 'Quy định mức giảm trừ gia cảnh giai đoạn 01/07/2013 - 30/06/2020 (9 triệu và 3.6 triệu)',
      effectiveDate: '2013-07-01',
      expiryDate: '2020-06-30',
      personalDeduction: 9000000,
      dependentDeduction: 3600000,
      isApplied: false,
      fileName: 'Nghi_quyet_01_2012_UBTVQH13.pdf'
    }
  ]);

  // Modal Thiết lập biểu thuế lũy tiến
  const [editingPitVersion, setEditingPitVersion] = useState<PitVersion | null>(null);
  const [tempBrackets, setTempBrackets] = useState<TaxBracket[]>([]);
  const [selectedSourcePitId, setSelectedSourcePitId] = useState<string>('');

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- XỬ LÝ KHU VỰC BẢO HIỂM XÃ HỘI ---
  // Thêm dòng BHXH mới: giá trị mới ở lên trên (prepend to top)
  const handleAddSocialInsRow = () => {
    const newId = 'si_' + Date.now();
    const newRow: SocialInsuranceVersion = {
      id: newId,
      versionName: 'Phiên bản BHXH mới ' + new Date().toLocaleDateString('vi-VN'),
      description: 'Thiết lập tỷ lệ trích đóng BHXH, BHYT, BHTN',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      retirementDeath: 22,
      sicknessMaternity: 3,
      occupationalHazard: 0.5,
      healthInsurance: 4.5,
      unemploymentInsurance: 2,
      totalEmployeeRate: 10.5,
      totalEmployerRate: 21.5,
      isDefault: socialInsList.length === 0,
      fileName: ''
    };
    setSocialInsList(prev => [newRow, ...prev]);
    showToast('✓ Đã thêm 1 dòng phiên bản BHXH mới ở đầu bảng.');
  };

  // Cập nhật giá trị trường trong dòng BHXH
  const updateSocialInsRow = (id: string, field: keyof SocialInsuranceVersion, value: any) => {
    setSocialInsList(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        return updated;
      }
      return item;
    }));
  };

  // Chọn mặc định BHXH (1 thời điểm chỉ được chọn 1)
  const handleDefaultSocialInsToggle = (id: string) => {
    setSocialInsList(prev => prev.map(item => ({
      ...item,
      isDefault: item.id === id
    })));
  };

  // Xóa dòng BHXH
  const handleDeleteSocialInsRow = (id: string) => {
    if (socialInsList.length <= 1) {
      alert('Cần giữ lại ít nhất 1 phiên bản BHXH trong hệ thống.');
      return;
    }
    const itemToDelete = socialInsList.find(s => s.id === id);
    setSocialInsList(prev => prev.filter(s => s.id !== id));
    showToast(`Đã xóa phiên bản "${itemToDelete?.versionName || ''}".`);
  };

  // --- XỬ LÝ KHU VỰC THUẾ THU NHẬP CÁ NHÂN ---
  // Thêm dòng Thuế TNCN mới: giá trị mới ở lên trên (prepend to top)
  const handleAddPitRow = () => {
    const newId = 'pit_' + Date.now();
    const newRow: PitVersion = {
      id: newId,
      versionName: 'Phiên bản Thuế TNCN mới ' + new Date().toLocaleDateString('vi-VN'),
      description: 'Biểu thuế lũy tiến từng phần áp dụng tiền lương, tiền công',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isDefault: pitList.length === 0,
      fileName: '',
      brackets: JSON.parse(JSON.stringify(DEFAULT_STANDARD_BRACKETS))
    };
    setPitList(prev => [newRow, ...prev]);
    showToast('✓ Đã thêm 1 dòng phiên bản Thuế TNCN mới ở đầu bảng.');
  };

  // Cập nhật giá trị trường trong dòng Thuế TNCN
  const updatePitRow = (id: string, field: keyof PitVersion, value: any) => {
    setPitList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Chọn mặc định Thuế TNCN (1 thời điểm chỉ được chọn 1)
  const handleDefaultPitToggle = (id: string) => {
    setPitList(prev => prev.map(item => ({
      ...item,
      isDefault: item.id === id
    })));
  };

  // Xóa dòng Thuế TNCN
  const handleDeletePitRow = (id: string) => {
    if (pitList.length <= 1) {
      alert('Cần giữ lại ít nhất 1 phiên bản Thuế TNCN trong hệ thống.');
      return;
    }
    const itemToDelete = pitList.find(p => p.id === id);
    setPitList(prev => prev.filter(p => p.id !== id));
    showToast(`Đã xóa phiên bản "${itemToDelete?.versionName || ''}".`);
  };

  // --- XỬ LÝ KHU VỰC GIẢM TRỪ GIA CẢNH (GTGC) ---
  // Thêm dòng GTGC mới: giá trị mới ở lên trên (prepend to top)
  const handleAddDeductionRow = () => {
    const newId = 'gtgc_' + Date.now();
    const newRow: FamilyDeductionVersion = {
      id: newId,
      versionName: 'Phiên bản GTGC mới ' + new Date().toLocaleDateString('vi-VN'),
      description: 'Quy định mức giảm trừ gia cảnh thuế TNCN',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      personalDeduction: 11000000,
      dependentDeduction: 4400000,
      isApplied: deductionList.length === 0,
      fileName: ''
    };
    setDeductionList(prev => [newRow, ...prev]);
    showToast('✓ Đã thêm 1 dòng phiên bản Giảm trừ gia cảnh mới ở đầu bảng.');
  };

  // Cập nhật giá trị trường trong dòng GTGC
  const updateDeductionRow = (id: string, field: keyof FamilyDeductionVersion, value: any) => {
    setDeductionList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Áp dụng: dạng tick, 1 thời điểm chỉ được chọn 1
  const handleApplyDeductionToggle = (id: string) => {
    setDeductionList(prev => prev.map(item => ({
      ...item,
      isApplied: item.id === id
    })));
    const target = deductionList.find(item => item.id === id);
    showToast(`✓ Đã kích hoạt áp dụng phiên bản GTGC: "${target?.versionName || ''}".`);
  };

  // Xóa dòng GTGC
  const handleDeleteDeductionRow = (id: string) => {
    if (deductionList.length <= 1) {
      alert('Cần giữ lại ít nhất 1 phiên bản Giảm trừ gia cảnh trong hệ thống.');
      return;
    }
    const itemToDelete = deductionList.find(d => d.id === id);
    setDeductionList(prev => prev.filter(d => d.id !== id));
    showToast(`Đã xóa phiên bản "${itemToDelete?.versionName || ''}".`);
  };

  // Mở modal Thiết lập Biểu thuế lũy tiến
  const handleOpenBracketModal = (pitVersion: PitVersion) => {
    setEditingPitVersion(pitVersion);
    setTempBrackets(JSON.parse(JSON.stringify(pitVersion.brackets || [])));
    // Gợi ý phiên bản mẫu khác hoặc phiên bản đầu tiên
    const other = pitList.find(p => p.id !== pitVersion.id);
    setSelectedSourcePitId(other ? other.id : pitVersion.id);
  };

  // Thực hiện Sao chép biểu thuế từ phiên bản được chọn vào phiên bản đang mở
  const handleCopyBracketsFromSource = () => {
    if (!selectedSourcePitId) {
      alert('Vui lòng chọn Tên phiên bản để sao chép.');
      return;
    }
    const source = pitList.find(p => p.id === selectedSourcePitId);
    if (!source) return;

    if (!source.brackets || source.brackets.length === 0) {
      alert('Phiên bản được chọn không có dữ liệu biểu thuế.');
      return;
    }

    const cloned = JSON.parse(JSON.stringify(source.brackets));
    setTempBrackets(cloned);
    showToast(`✓ Đã sao chép ${cloned.length} bậc thuế từ phiên bản "${source.versionName}".`);
  };

  // Thêm bậc thuế mới trong modal
  const handleAddBracketInModal = () => {
    const nextLevel = tempBrackets.length + 1;
    const lastBracket = tempBrackets[tempBrackets.length - 1];
    const newFrom = lastBracket && lastBracket.toAmount !== null ? lastBracket.toAmount : 0;
    
    const newBracket: TaxBracket = {
      id: 'b_' + Date.now(),
      level: nextLevel,
      fromAmount: newFrom,
      toAmount: null,
      taxRate: lastBracket ? Math.min(lastBracket.taxRate + 5, 50) : 5,
      quickDeduction: 0
    };
    setTempBrackets([...tempBrackets, newBracket]);
  };

  // Xóa bậc thuế trong modal
  const handleDeleteBracketInModal = (bracketId: string) => {
    if (tempBrackets.length <= 1) {
      alert('Biểu thuế cần có ít nhất 1 bậc.');
      return;
    }
    const updated = tempBrackets.filter(b => b.id !== bracketId).map((b, idx) => ({
      ...b,
      level: idx + 1
    }));
    setTempBrackets(updated);
  };

  // Cập nhật 1 giá trị bậc trong modal
  const handleUpdateBracketInModal = (bracketId: string, field: keyof TaxBracket, value: any) => {
    setTempBrackets(prev => prev.map(b => b.id === bracketId ? { ...b, [field]: value } : b));
  };

  // Khôi phục 7 bậc thuế chuẩn
  const handleResetStandardBrackets = () => {
    setTempBrackets(JSON.parse(JSON.stringify(DEFAULT_STANDARD_BRACKETS)));
    showToast('Đã khôi phục Biểu thuế chuẩn 7 bậc theo Thông tư 111.');
  };

  // Lưu thiết lập biểu thuế lũy tiến vào phiên bản
  const handleSaveBracketsModal = () => {
    if (!editingPitVersion) return;

    setPitList(prev => prev.map(p => {
      if (p.id === editingPitVersion.id) {
        return {
          ...p,
          brackets: tempBrackets
        };
      }
      return p;
    }));

    showToast(`✓ Đã lưu biểu thuế gồm ${tempBrackets.length} bậc cho phiên bản "${editingPitVersion.versionName}".`);
    setEditingPitVersion(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4 font-sans relative overflow-y-auto space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-[80] bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Giới thiệu & Điều hướng */}
      <div className="bg-white rounded-md border border-gray-200 px-5 py-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Tham số Bảo hiểm xã hội & Thuế Thu nhập cá nhân
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Cấu hình tiền lương
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Quản lý các phiên bản tỷ lệ trích nộp BHXH, BHYT, BHTN và biểu thuế lũy tiến từng phần phục vụ tính toán Phiếu Lương.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsSocialInsOpen(true);
              setIsPitOpen(true);
            }}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded border border-gray-300 transition-colors cursor-pointer"
          >
            Mở rộng tất cả
          </button>
          <button
            onClick={() => {
              setIsSocialInsOpen(false);
              setIsPitOpen(false);
            }}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded border border-gray-300 transition-colors cursor-pointer"
          >
            Thu gọn tất cả
          </button>
        </div>
      </div>

      {/* KHU VỰC 1: BẢO HIỂM XÃ HỘI */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden transition-all">
        {/* Header Khu vực BHXH (Cho phép Ẩn/Hiện) */}
        <div 
          onClick={() => setIsSocialInsOpen(!isSocialInsOpen)}
          className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-50/60 to-white border-b border-gray-200 cursor-pointer select-none hover:bg-blue-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 text-white rounded-md shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Bảo hiểm xã hội</h2>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200">
                  {socialInsList.length} phiên bản
                </span>
                {socialInsList.some(s => s.isDefault) && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Đã chọn bản mặc định
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Thiết lập tỷ lệ trích đóng các quỹ: Hưu trí & Tử tuất, Ốm đau & Thai sản, TNLĐ-BNN, BHYT, BHTN theo luật lao động.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleAddSocialInsRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm dòng
            </button>
            <button
              type="button"
              onClick={() => setIsSocialInsOpen(!isSocialInsOpen)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title={isSocialInsOpen ? "Thu gọn khu vực" : "Mở rộng khu vực"}
            >
              {isSocialInsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nội dung Bảng BHXH khi mở rộng */}
        {isSocialInsOpen && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-gray-200">
              <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-2.5 text-center w-[45px] border-r border-gray-200">STT</th>
                  <th className="p-2.5 w-[220px] border-r border-gray-200">
                    Tên phiên bản <span className="text-red-500">*</span>
                  </th>
                  <th className="p-2.5 min-w-[180px] border-r border-gray-200">
                    Mô tả
                  </th>
                  <th className="p-2.5 w-[130px] border-r border-gray-200">
                    Ngày hiệu lực
                  </th>
                  <th className="p-2.5 w-[130px] border-r border-gray-200">
                    Ngày hết hiệu lực
                  </th>
                  <th className="p-2 text-center w-[95px] border-r border-gray-200 bg-amber-50/40">
                    Hưu trí & Tử tuất (%)
                  </th>
                  <th className="p-2 text-center w-[95px] border-r border-gray-200 bg-amber-50/40">
                    Ốm đau & Thai sản (%)
                  </th>
                  <th className="p-2 text-center w-[90px] border-r border-gray-200 bg-amber-50/40">
                    TNLĐ-BNN (%)
                  </th>
                  <th className="p-2 text-center w-[85px] border-r border-gray-200 bg-amber-50/40">
                    BHYT (%)
                  </th>
                  <th className="p-2 text-center w-[85px] border-r border-gray-200 bg-amber-50/40">
                    BHTN (%)
                  </th>
                  <th className="p-2 text-center w-[100px] border-r border-gray-200 bg-blue-50/60 font-bold text-blue-900">
                    Tổng % NLĐ đóng
                  </th>
                  <th className="p-2 text-center w-[110px] border-r border-gray-200 bg-indigo-50/60 font-bold text-indigo-900">
                    Tổng % NSDLD đóng
                  </th>
                  <th className="p-2.5 text-center w-[80px] border-r border-gray-200">
                    Áp dụng
                  </th>
                  <th className="p-2.5 w-[180px] border-r border-gray-200">
                    Upfiles
                  </th>
                  <th className="p-2.5 text-center w-[55px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {socialInsList.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="p-6 text-center text-gray-400 italic">
                      Chưa có phiên bản BHXH nào. Nhấn nút "Thêm dòng" để tạo phiên bản mới.
                    </td>
                  </tr>
                ) : (
                  socialInsList.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-blue-50/20 transition-colors ${row.isDefault ? 'bg-blue-50/10' : ''}`}
                    >
                      {/* STT: hệ thống tự tạo */}
                      <td className="p-2.5 text-center text-gray-600 font-semibold border-r border-gray-200">
                        {index + 1}
                      </td>

                      {/* Tên phiên bản: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.versionName}
                          onChange={(e) => updateSocialInsRow(row.id, 'versionName', e.target.value)}
                          placeholder="Nhập tên phiên bản..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </td>

                      {/* Mô tả: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateSocialInsRow(row.id, 'description', e.target.value)}
                          placeholder="Mô tả căn cứ pháp lý, thông tư..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </td>

                      {/* Ngày hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.effectiveDate}
                          onChange={(e) => updateSocialInsRow(row.id, 'effectiveDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* Ngày hết hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.expiryDate || ''}
                          onChange={(e) => updateSocialInsRow(row.id, 'expiryDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* Hưu trí & Tử tuất (nhập số) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-amber-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.retirementDeath}
                          onChange={(e) => updateSocialInsRow(row.id, 'retirementDeath', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1.5 py-1.5 text-xs text-center font-semibold text-gray-900 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* Ốm đau & Thai sản (nhập số) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-amber-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.sicknessMaternity}
                          onChange={(e) => updateSocialInsRow(row.id, 'sicknessMaternity', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1.5 py-1.5 text-xs text-center font-semibold text-gray-900 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* TNLĐ-BNN (nhập số) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-amber-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.occupationalHazard}
                          onChange={(e) => updateSocialInsRow(row.id, 'occupationalHazard', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1.5 py-1.5 text-xs text-center font-semibold text-gray-900 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* BHYT (nhập số) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-amber-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.healthInsurance}
                          onChange={(e) => updateSocialInsRow(row.id, 'healthInsurance', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1.5 py-1.5 text-xs text-center font-semibold text-gray-900 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* BHTN (nhập số) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-amber-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.unemploymentInsurance}
                          onChange={(e) => updateSocialInsRow(row.id, 'unemploymentInsurance', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1.5 py-1.5 text-xs text-center font-semibold text-gray-900 outline-none focus:border-blue-500 bg-white"
                        />
                      </td>

                      {/* Tổng % NLĐ đóng (nhập số / điều chỉnh) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-blue-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.totalEmployeeRate}
                          onChange={(e) => updateSocialInsRow(row.id, 'totalEmployeeRate', parseFloat(e.target.value) || 0)}
                          className="w-full border border-blue-300 rounded px-1.5 py-1.5 text-xs text-center font-bold text-blue-700 outline-none focus:border-blue-600 bg-white"
                        />
                      </td>

                      {/* Tổng % NSDLD đóng (nhập số / điều chỉnh) */}
                      <td className="p-2 border-r border-gray-200 text-center bg-indigo-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.totalEmployerRate}
                          onChange={(e) => updateSocialInsRow(row.id, 'totalEmployerRate', parseFloat(e.target.value) || 0)}
                          className="w-full border border-indigo-300 rounded px-1.5 py-1.5 text-xs text-center font-bold text-indigo-700 outline-none focus:border-indigo-600 bg-white"
                        />
                      </td>

                      {/* Mặc định: dạng tick, 1 thời điểm chỉ được chọn 1 */}
                      <td className="p-2.5 text-center border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center justify-center cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={row.isDefault}
                              onChange={() => handleDefaultSocialInsToggle(row.id)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-0 cursor-pointer accent-blue-600"
                              title="Đặt phiên bản này làm mặc định (1 thời điểm chỉ được chọn 1)"
                            />
                          </label>
                        </div>
                      </td>

                      {/* Upfiles */}
                      <td className="p-2 border-r border-gray-200">
                        {row.fileName ? (
                          <div className="flex items-center justify-between gap-1.5 bg-blue-50/70 border border-blue-200 rounded px-2 py-1 text-xs text-blue-800">
                            <span className="truncate max-w-[100px] font-medium" title={row.fileName}>
                              {row.fileName}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const blob = new Blob([`Tệp quy định BHXH: ${row.fileName}\nPhiên bản: ${row.versionName}\nNgày hiệu lực: ${row.effectiveDate}`], { type: 'text/plain;charset=utf-8' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = row.fileName || 'tai_lieu_bhxh.pdf';
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
                                      updateSocialInsRow(row.id, 'fileName', file.name);
                                      showToast(`Đã tải lên tệp: ${file.name}`);
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => updateSocialInsRow(row.id, 'fileName', '')}
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
                                  updateSocialInsRow(row.id, 'fileName', file.name);
                                  showToast(`Đã tải lên tệp: ${file.name}`);
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
                          onClick={() => handleDeleteSocialInsRow(row.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa dòng phiên bản này"
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
        )}
      </div>

      {/* KHU VỰC 2: THUẾ THU NHẬP CÁ NHÂN */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden transition-all">
        {/* Header Khu vực Thuế TNCN (Cho phép Ẩn/Hiện) */}
        <div 
          onClick={() => setIsPitOpen(!isPitOpen)}
          className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 to-white border-b border-gray-200 cursor-pointer select-none hover:bg-emerald-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-600 text-white rounded-md shadow-2xs">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Thuế Thu nhập cá nhân</h2>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  {pitList.length} phiên bản
                </span>
                {pitList.some(p => p.isDefault) && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Đã chọn bản mặc định
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Cấu hình Biểu thuế lũy tiến từng phần, số bậc thuế và mức thuế suất áp dụng cho thu nhập từ tiền lương, tiền công.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleAddPitRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm dòng
            </button>
            <button
              type="button"
              onClick={() => setIsPitOpen(!isPitOpen)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title={isPitOpen ? "Thu gọn khu vực" : "Mở rộng khu vực"}
            >
              {isPitOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nội dung Bảng Thuế TNCN khi mở rộng */}
        {isPitOpen && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-gray-200">
              <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-2.5 text-center w-[50px] border-r border-gray-200">STT</th>
                  <th className="p-2.5 w-[260px] border-r border-gray-200">
                    Tên phiên bản <span className="text-red-500">*</span>
                  </th>
                  <th className="p-2.5 min-w-[260px] border-r border-gray-200">
                    Mô tả
                  </th>
                  <th className="p-2.5 w-[140px] border-r border-gray-200">
                    Ngày hiệu lực
                  </th>
                  <th className="p-2.5 w-[140px] border-r border-gray-200">
                    Ngày hết hiệu lực
                  </th>
                  <th className="p-2.5 text-center w-[120px] border-r border-gray-200 bg-emerald-50/50">
                    Tổng số bậc
                  </th>
                  <th className="p-2.5 text-center w-[90px] border-r border-gray-200">
                    Áp dụng
                  </th>
                  <th className="p-2.5 w-[200px] border-r border-gray-200">
                    Upfiles
                  </th>
                  <th className="p-2.5 text-center w-[200px] border-r border-gray-200">
                    Thiết lập Biểu thuế lũy tiến
                  </th>
                  <th className="p-2.5 text-center w-[60px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {pitList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-gray-400 italic">
                      Chưa có phiên bản Thuế TNCN nào. Nhấn nút "Thêm dòng" để tạo phiên bản mới.
                    </td>
                  </tr>
                ) : (
                  pitList.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-emerald-50/20 transition-colors ${row.isDefault ? 'bg-emerald-50/10' : ''}`}
                    >
                      {/* STT: hệ thống tự chạy */}
                      <td className="p-2.5 text-center text-gray-600 font-semibold border-r border-gray-200">
                        {index + 1}
                      </td>

                      {/* Tên phiên bản: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.versionName}
                          onChange={(e) => updatePitRow(row.id, 'versionName', e.target.value)}
                          placeholder="Nhập tên phiên bản biểu thuế..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </td>

                      {/* Mô tả: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updatePitRow(row.id, 'description', e.target.value)}
                          placeholder="Mô tả căn cứ quy định, nghị định..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </td>

                      {/* Ngày hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.effectiveDate}
                          onChange={(e) => updatePitRow(row.id, 'effectiveDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-500 bg-white"
                        />
                      </td>

                      {/* Ngày hết hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.expiryDate || ''}
                          onChange={(e) => updatePitRow(row.id, 'expiryDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-500 bg-white"
                        />
                      </td>

                      {/* Tổng số bậc: được tự động tính tổng records trong "Thiết lập Biểu thuế lũy tiến" */}
                      <td className="p-2.5 text-center border-r border-gray-200 bg-emerald-50/20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300">
                          <Layers className="w-3 h-3 text-emerald-600" />
                          {row.brackets ? row.brackets.length : 0} bậc
                        </span>
                      </td>

                      {/* Mặc định: dạng tick, 1 thời điểm chỉ được chọn 1 */}
                      <td className="p-2.5 text-center border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center justify-center cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={row.isDefault}
                              onChange={() => handleDefaultPitToggle(row.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-0 cursor-pointer accent-emerald-600"
                              title="Đặt phiên bản này làm mặc định (1 thời điểm chỉ được chọn 1)"
                            />
                          </label>
                        </div>
                      </td>

                      {/* Upfiles */}
                      <td className="p-2 border-r border-gray-200">
                        {row.fileName ? (
                          <div className="flex items-center justify-between gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded px-2 py-1 text-xs text-emerald-800">
                            <span className="truncate max-w-[110px] font-medium" title={row.fileName}>
                              {row.fileName}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const blob = new Blob([`Tệp quy định Thuế TNCN: ${row.fileName}\nPhiên bản: ${row.versionName}\nNgày hiệu lực: ${row.effectiveDate}\nSố bậc thuế: ${row.brackets?.length || 0} bậc`], { type: 'text/plain;charset=utf-8' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = row.fileName || 'thue_tncn.pdf';
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                                className="text-gray-500 hover:text-emerald-600 cursor-pointer p-0.5"
                                title="Tải về"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <label className="text-emerald-600 hover:text-emerald-800 cursor-pointer p-0.5" title="Đổi file khác">
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      updatePitRow(row.id, 'fileName', file.name);
                                      showToast(`Đã tải lên tệp: ${file.name}`);
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => updatePitRow(row.id, 'fileName', '')}
                                className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                title="Gỡ file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer border border-dashed border-gray-300 hover:border-emerald-400 bg-gray-50/80 hover:bg-emerald-50/50 rounded px-2.5 py-1.5 w-full justify-center transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Tải file lên</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updatePitRow(row.id, 'fileName', file.name);
                                  showToast(`Đã tải lên tệp: ${file.name}`);
                                }
                              }}
                            />
                          </label>
                        )}
                      </td>

                      {/* Có nút "Thiết lập Biểu thuế lũy tiến" */}
                      <td className="p-2 text-center border-r border-gray-200">
                        <button
                          type="button"
                          onClick={() => handleOpenBracketModal(row)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded text-xs font-semibold border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          <span>Thiết lập Biểu thuế lũy tiến</span>
                        </button>
                      </td>

                      {/* Thao tác */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePitRow(row.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa dòng phiên bản này"
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
        )}
      </div>

      {/* KHU VỰC 3: GIẢM TRỪ GIA CẢNH (GTGC) */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden transition-all">
        {/* Header Khu vực Giảm trừ gia cảnh (Cho phép Ẩn/Hiện) */}
        <div 
          onClick={() => setIsDeductionOpen(!isDeductionOpen)}
          className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-50/60 to-white border-b border-gray-200 cursor-pointer select-none hover:bg-indigo-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-600 text-white rounded-md shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Giảm trừ gia cảnh (GTGC)</h2>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full border border-indigo-200">
                  {deductionList.length} phiên bản
                </span>
                {deductionList.some(d => d.isApplied) && (
                  <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Đang áp dụng: {deductionList.find(d => d.isApplied)?.versionName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Cấu hình mức giảm trừ gia cảnh cho bản thân người nộp thuế và người phụ thuộc làm căn cứ xác định thu nhập tính thuế TNCN.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleAddDeductionRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm dòng
            </button>
            <button
              type="button"
              onClick={() => setIsDeductionOpen(!isDeductionOpen)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title={isDeductionOpen ? "Thu gọn khu vực" : "Mở rộng khu vực"}
            >
              {isDeductionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nội dung Bảng Giảm trừ gia cảnh khi mở rộng */}
        {isDeductionOpen && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-gray-200">
              <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-2.5 text-center w-[50px] border-r border-gray-200">STT</th>
                  <th className="p-2.5 w-[250px] border-r border-gray-200">
                    Tên phiên bản <span className="text-red-500">*</span>
                  </th>
                  <th className="p-2.5 min-w-[240px] border-r border-gray-200">
                    Mô tả
                  </th>
                  <th className="p-2.5 w-[140px] border-r border-gray-200">
                    Ngày hiệu lực
                  </th>
                  <th className="p-2.5 w-[140px] border-r border-gray-200">
                    Ngày hết hiệu lực
                  </th>
                  <th className="p-2.5 text-right w-[180px] border-r border-gray-200 bg-indigo-50/40">
                    GTGC bản thân (VNĐ)
                  </th>
                  <th className="p-2.5 text-right w-[180px] border-r border-gray-200 bg-indigo-50/40">
                    GTGC người phụ thuộc (VNĐ)
                  </th>
                  <th className="p-2.5 text-center w-[90px] border-r border-gray-200">
                    Áp dụng
                  </th>
                  <th className="p-2.5 w-[200px] border-r border-gray-200">
                    Upfiles
                  </th>
                  <th className="p-2.5 text-center w-[60px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deductionList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-gray-400 italic">
                      Chưa có phiên bản Giảm trừ gia cảnh nào. Nhấn nút "Thêm dòng" để tạo phiên bản mới.
                    </td>
                  </tr>
                ) : (
                  deductionList.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-indigo-50/20 transition-colors ${row.isApplied ? 'bg-indigo-50/15' : ''}`}
                    >
                      {/* STT: hệ thống tự chạy */}
                      <td className="p-2.5 text-center text-gray-600 font-semibold border-r border-gray-200">
                        {index + 1}
                      </td>

                      {/* Tên phiên bản: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.versionName}
                          onChange={(e) => updateDeductionRow(row.id, 'versionName', e.target.value)}
                          placeholder="Nhập tên phiên bản GTGC..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </td>

                      {/* Mô tả: text */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateDeductionRow(row.id, 'description', e.target.value)}
                          placeholder="Mô tả căn cứ nghị quyết, quy định..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </td>

                      {/* Ngày hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.effectiveDate}
                          onChange={(e) => updateDeductionRow(row.id, 'effectiveDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 bg-white"
                        />
                      </td>

                      {/* Ngày hết hiệu lực */}
                      <td className="p-2 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.expiryDate || ''}
                          onChange={(e) => updateDeductionRow(row.id, 'expiryDate', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 bg-white"
                        />
                      </td>

                      {/* GTGC bản thân: nhập số */}
                      <td className="p-2 border-r border-gray-200 bg-indigo-50/10">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={row.personalDeduction}
                            onChange={(e) => updateDeductionRow(row.id, 'personalDeduction', Number(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold text-indigo-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-right pr-14"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-semibold select-none pointer-events-none">
                            đ/tháng
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 text-right mt-0.5 font-medium">
                          {(row.personalDeduction || 0).toLocaleString('vi-VN')} VNĐ
                        </div>
                      </td>

                      {/* GTGC người phụ thuộc: nhập số */}
                      <td className="p-2 border-r border-gray-200 bg-indigo-50/10">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={row.dependentDeduction}
                            onChange={(e) => updateDeductionRow(row.id, 'dependentDeduction', Number(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold text-indigo-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-right pr-14"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-semibold select-none pointer-events-none">
                            đ/tháng
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 text-right mt-0.5 font-medium">
                          {(row.dependentDeduction || 0).toLocaleString('vi-VN')} VNĐ/người
                        </div>
                      </td>

                      {/* Áp dụng: dạng tick, 1 thời điểm chỉ được chọn 1 */}
                      <td className="p-2.5 text-center border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center justify-center cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={row.isApplied}
                              onChange={() => handleApplyDeductionToggle(row.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-0 cursor-pointer accent-indigo-600"
                              title="Chọn áp dụng phiên bản này (1 thời điểm chỉ được chọn 1)"
                            />
                          </label>
                        </div>
                      </td>

                      {/* Upfiles */}
                      <td className="p-2 border-r border-gray-200">
                        {row.fileName ? (
                          <div className="flex items-center justify-between gap-1.5 bg-indigo-50/70 border border-indigo-200 rounded px-2 py-1 text-xs text-indigo-800">
                            <span className="truncate max-w-[110px] font-medium" title={row.fileName}>
                              {row.fileName}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const blob = new Blob([`Tệp quy định Giảm trừ gia cảnh: ${row.fileName}\nPhiên bản: ${row.versionName}\nNgày hiệu lực: ${row.effectiveDate}\nGTGC bản thân: ${(row.personalDeduction || 0).toLocaleString('vi-VN')} đ\nGTGC người phụ thuộc: ${(row.dependentDeduction || 0).toLocaleString('vi-VN')} đ/người`], { type: 'text/plain;charset=utf-8' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = row.fileName || 'giam_tru_gia_canh.pdf';
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                                className="text-gray-500 hover:text-indigo-600 cursor-pointer p-0.5"
                                title="Tải về"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <label className="text-indigo-600 hover:text-indigo-800 cursor-pointer p-0.5" title="Đổi file khác">
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      updateDeductionRow(row.id, 'fileName', file.name);
                                      showToast(`Đã tải lên tệp: ${file.name}`);
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => updateDeductionRow(row.id, 'fileName', '')}
                                className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                title="Gỡ file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer border border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50/80 hover:bg-indigo-50/50 rounded px-2.5 py-1.5 w-full justify-center transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Tải file lên</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateDeductionRow(row.id, 'fileName', file.name);
                                  showToast(`Đã tải lên tệp: ${file.name}`);
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
                          onClick={() => handleDeleteDeductionRow(row.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa dòng phiên bản này"
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
        )}
      </div>

      {/* MODAL THIẾT LẬP BIỂU THUẾ LŨY TIẾN */}
      {editingPitVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl border border-gray-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    Thiết lập Biểu thuế lũy tiến từng phần
                    <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      {tempBrackets.length} bậc
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phiên bản: <strong className="text-gray-800">{editingPitVersion.versionName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPitVersion(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200 flex-wrap gap-2">
              <div className="text-xs text-gray-600 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  Các bậc được tính liên tục theo mức thu nhập tính thuế hàng tháng. Bậc cuối cùng để trống ô "Đến mức" tương ứng mức trên.
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Field Tên phiên bản để sao chép */}
                <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded px-2.5 py-1 shadow-2xs">
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Tên phiên bản:
                  </span>
                  <select
                    value={selectedSourcePitId}
                    onChange={(e) => setSelectedSourcePitId(e.target.value)}
                    className="text-xs font-medium text-gray-800 bg-transparent outline-none cursor-pointer max-w-[250px] truncate"
                  >
                    {pitList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.versionName} ({p.brackets?.length || 0} bậc){p.id === editingPitVersion.id ? ' (Hiện tại)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nút Thực hiện Sao chép */}
                <button
                  type="button"
                  onClick={handleCopyBracketsFromSource}
                  disabled={!selectedSourcePitId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 text-xs font-semibold rounded border border-emerald-300 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sao chép toàn bộ các bậc thuế từ phiên bản đã chọn sang phiên bản đang mở"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Thực hiện Sao chép
                </button>

                {/* Nút Thêm bậc thuế */}
                <button
                  type="button"
                  onClick={handleAddBracketInModal}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm bậc thuế
                </button>
              </div>
            </div>

            {/* Modal Body: Table Bậc thuế */}
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse border border-gray-200">
                <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-2.5 text-center w-[50px] border-r border-gray-200">STT</th>
                    <th className="p-2.5 text-center w-[80px] border-r border-gray-200">Bậc thuế</th>
                    <th className="p-2.5 w-[220px] border-r border-gray-200">
                      Thu nhập tính thuế / tháng - Từ (VNĐ)
                    </th>
                    <th className="p-2.5 w-[220px] border-r border-gray-200">
                      Thu nhập tính thuế / tháng - Đến (VNĐ)
                    </th>
                    <th className="p-2.5 text-center w-[110px] border-r border-gray-200">
                      Thuế suất (%)
                    </th>
                    <th className="p-2.5 w-[200px] border-r border-gray-200">
                      Số trừ tính nhanh (VNĐ)
                    </th>
                    <th className="p-2.5 text-center w-[60px]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tempBrackets.map((bracket, index) => (
                    <tr key={bracket.id} className="hover:bg-emerald-50/20 transition-colors">
                      {/* STT */}
                      <td className="p-2.5 text-center text-gray-500 font-medium border-r border-gray-200">
                        {index + 1}
                      </td>

                      {/* Bậc */}
                      <td className="p-2 text-center border-r border-gray-200">
                        <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                          Bậc {bracket.level}
                        </span>
                      </td>

                      {/* Từ (VNĐ) */}
                      <td className="p-2 border-r border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={bracket.fromAmount.toLocaleString('vi-VN')}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^\d]/g, '');
                              const num = clean ? parseInt(clean, 10) : 0;
                              handleUpdateBracketInModal(bracket.id, 'fromAmount', num);
                            }}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono font-medium outline-none focus:border-emerald-500 bg-white"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
                            đ
                          </span>
                        </div>
                      </td>

                      {/* Đến (VNĐ) */}
                      <td className="p-2 border-r border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={bracket.toAmount !== null ? bracket.toAmount.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^\d]/g, '');
                              const num = clean ? parseInt(clean, 10) : null;
                              handleUpdateBracketInModal(bracket.id, 'toAmount', num);
                            }}
                            placeholder={index === tempBrackets.length - 1 ? "Không giới hạn trên (> mức từ)" : "Đến mức..."}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono font-medium outline-none focus:border-emerald-500 bg-white"
                          />
                          {bracket.toAmount !== null && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
                              đ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Thuế suất (%) */}
                      <td className="p-2 border-r border-gray-200 text-center">
                        <div className="relative inline-block w-20">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={bracket.taxRate}
                            onChange={(e) => handleUpdateBracketInModal(bracket.id, 'taxRate', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold text-emerald-700 text-center outline-none focus:border-emerald-500 bg-white"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                            %
                          </span>
                        </div>
                      </td>

                      {/* Số trừ tính nhanh (VNĐ) */}
                      <td className="p-2 border-r border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={bracket.quickDeduction.toLocaleString('vi-VN')}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^\d]/g, '');
                              const num = clean ? parseInt(clean, 10) : 0;
                              handleUpdateBracketInModal(bracket.id, 'quickDeduction', num);
                            }}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono outline-none focus:border-emerald-500 bg-white"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
                            đ
                          </span>
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteBracketInModal(bracket.id)}
                          disabled={tempBrackets.length <= 1}
                          className={`p-1.5 rounded transition-colors ${
                            tempBrackets.length <= 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-red-600 cursor-pointer'
                          }`}
                          title="Xóa bậc thuế này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-[#F8FAFC]">
              <div className="text-xs text-gray-500">
                Tổng số bậc hiện tại: <strong className="text-emerald-700 font-bold">{tempBrackets.length} bậc</strong> (sẽ tự động cập nhật vào danh sách ngoài).
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPitVersion(null)}
                  className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveBracketsModal}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Lưu & Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
