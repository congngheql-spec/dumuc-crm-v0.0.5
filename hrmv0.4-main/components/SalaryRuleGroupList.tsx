import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Trash2, Search, LayoutTemplate, Trash } from 'lucide-react';
import { SalaryRuleGroupForm } from './SalaryRuleGroupForm';

export const INITIAL_MOCK_GROUPS = [
  { id: 1, code: 'NQT_LUONG', name: 'Lương', description: 'Quy tắc tính lương cơ bản và lương doanh thu', itemCount: 3, items: [
      {id: '1_1', name: 'Lương cơ bản', code: 'LCB', description: 'Lương theo hợp đồng', bhxhHuuTri: true, bhxhOmDau: true, bhxhTnld: true, bhxhBhyt: true, bhxhBhtn: true, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '1_2', name: 'Lương năng suất', code: 'LNS', description: 'Lương dựa trên năng suất', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '1_3', name: 'Lương kiêm nhiệm', code: 'LKN', description: 'Khoản chi trả cho công việc kiêm nhiệm, tự nhập trong phiếu lương', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: '', defaultCalcType: 'manual'}
    ] 
  },
  { id: 2, code: 'NQT_HIEUQUA', name: 'Hiệu quả', description: 'Đánh giá KPI và hiệu suất công việc', itemCount: 2, items: [
      {id: '2_1', name: 'Thưởng KPI', code: 'KPI', description: 'Thưởng đạt mục tiêu', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '2_2', name: 'Thưởng doanh thu', code: 'DT', description: 'Thưởng hoa hồng doanh thu', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''}
    ] 
  },
  { id: 3, code: 'NQT_PHUCAP', name: 'Phụ cấp', description: 'Phụ cấp ăn trưa, đi lại, điện thoại, chuyên cần', itemCount: 5, items: [
      {id: '3_1', name: 'Phụ cấp ăn trưa', code: 'PC_AN', description: 'Hỗ trợ bữa ăn giữa ca theo ngày công', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế có hạn mức tối đa cố định', taxLimitRate: '730,000', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '3_2', name: 'Phụ cấp xăng xe', code: 'PC_XANG', description: 'Hỗ trợ đi lại', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế có hạn mức tối đa cố định', taxLimitRate: '500,000', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '3_3', name: 'Phụ cấp chức vụ', code: 'PC_CV', description: 'Phụ cấp trách nhiệm quản lý', bhxhHuuTri: true, bhxhOmDau: true, bhxhTnld: true, bhxhBhyt: true, bhxhBhtn: true, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '3_4', name: 'Phụ cấp chuyên cần & thâm niên', code: 'PC_CHYENCAN', description: 'Tự nhập theo từng kỳ lương cho nhân sự', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: '', defaultCalcType: 'manual'},
      {id: '3_5', name: 'Phụ cấp công tác & lưu trú phát sinh', code: 'PC_CONGTAC', description: 'Tự nhập theo từng kỳ lương cho nhân sự', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế có chứng từ', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: '', defaultCalcType: 'manual'}
    ] 
  },
  { id: 4, code: 'NQT_BOSUNG', name: 'Bổ sung', description: 'Các khoản thu nhập bổ sung khác', itemCount: 1, items: [
      {id: '4_1', name: 'Tiền trách nhiệm', code: 'TTN', description: 'Thưởng trách nhiệm công việc', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính thuế 100%', taxLimitRate: '', tncnLuyTien: true, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''}
    ] 
  },
  { id: 5, code: 'NQT_HOTRO', name: 'Hỗ trợ', description: 'Hỗ trợ chi phí đào tạo, trang thiết bị', itemCount: 2, items: [
      {id: '5_1', name: 'Hỗ trợ điện thoại', code: 'HT_DT', description: 'Cước phí viễn thông', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế có hạn mức tối đa cố định', taxLimitRate: '300,000', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: false, khauTruLimit: ''},
      {id: '5_2', name: 'Hỗ trợ nhà ở', code: 'HT_NO', description: 'Hỗ trợ tiền thuê nhà', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Tính Thuế theo tỉ lệ tối đa', taxLimitRate: '15', tncnLuyTien: false, tncnCoDinh: true, hasKhauTru: false, khauTruLimit: ''}
    ] 
  },
  { id: 6, code: 'NQT_BHXH', name: 'Bảo hiểm xã hội', description: 'Các khoản trích nộp bảo hiểm theo quy định', itemCount: 3, items: [
      {id: '6_1', name: 'BHXH (8%)', code: 'BHXH_8', description: 'Bảo hiểm xã hội người lao động đóng', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: ''},
      {id: '6_2', name: 'BHYT (1.5%)', code: 'BHYT_15', description: 'Bảo hiểm y tế người lao động đóng', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: ''},
      {id: '6_3', name: 'BHTN (1%)', code: 'BHTN_1', description: 'Bảo hiểm thất nghiệp người lao động đóng', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: ''}
    ] 
  },
  { id: 7, code: 'NQT_GIAMTRU', name: 'Giảm trừ', description: 'Các khoản giảm trừ gia cảnh, phạt vi phạm', itemCount: 2, items: [
      {id: '7_1', name: 'Giảm trừ bản thân', code: 'GT_BT', description: 'Mức giảm trừ gia cảnh cho bản thân', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: '11,000,000'},
      {id: '7_2', name: 'Giảm trừ người phụ thuộc', code: 'GT_NPT', description: 'Mức giảm trừ cho mỗi người phụ thuộc', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: '4,400,000'}
    ] 
  },
  { id: 8, code: 'NQT_THUETNCN', name: 'Thuế TNCN', description: 'Thuế thu nhập cá nhân theo biểu thuế lũy tiến', itemCount: 1, items: [
      {id: '8_1', name: 'Thuế TNCN lũy tiến', code: 'TNCN_LT', description: 'Thuế tính theo biểu lũy tiến từng phần', bhxhHuuTri: false, bhxhOmDau: false, bhxhTnld: false, bhxhBhyt: false, bhxhBhtn: false, taxNature: 'Miễn thuế hoàn toàn', taxLimitRate: '', tncnLuyTien: false, tncnCoDinh: false, hasKhauTru: true, khauTruLimit: ''}
    ] 
  },
];

// Chuẩn hóa khoản mục nếu thiếu trường mới
const normalizeRuleItem = (item: any) => {
  let taxNature = item.taxNature;
  if (!taxNature) {
    if (item.tncnLuyTien) taxNature = 'Tính thuế 100%';
    else if (item.tncnCoDinh) taxNature = 'Tính Thuế theo tỉ lệ tối đa';
    else taxNature = 'Tính thuế 100%';
  }
  return {
    ...item,
    taxNature,
    taxLimitRate: item.taxLimitRate || '',
    tncnLuyTien: taxNature === 'Tính thuế 100%',
    tncnCoDinh: taxNature === 'Tính Thuế theo tỉ lệ tối đa',
  };
};

// Khởi tạo và đồng bộ bộ nhớ MOCK_GROUPS
const getSavedGroups = () => {
  try {
    const saved = localStorage.getItem('SALARY_RULE_GROUPS_DATA');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((g: any) => ({
          ...g,
          items: (g.items || []).map(normalizeRuleItem)
        }));
      }
    }
  } catch (e) {
    console.error('Error loading saved salary rule groups:', e);
  }
  return INITIAL_MOCK_GROUPS;
};

export const MOCK_GROUPS = getSavedGroups();

// Thêm khoản mục mới vào nhóm và đồng bộ vào menu Nhóm quy tắc Lương
export const addSalaryRuleItemToGroup = (
  groupName: string, 
  item: { name: string; code: string; description?: string }
) => {
  const group = MOCK_GROUPS.find(g => g.name === groupName);
  if (!group) return null;

  const newItem = {
    id: `${group.id}_${Date.now()}`,
    name: item.name.trim(),
    code: item.code.trim().toUpperCase(),
    description: item.description?.trim() || '',
    bhxhHuuTri: false,
    bhxhOmDau: false,
    bhxhTnld: false,
    bhxhBhyt: false,
    bhxhBhtn: false,
    taxNature: 'Tính thuế 100%',
    taxLimitRate: '',
    tncnLuyTien: true,
    tncnCoDinh: false,
    hasKhauTru: false,
    khauTruLimit: '',
  };

  group.items.push(newItem);
  group.itemCount = group.items.length;

  try {
    localStorage.setItem('SALARY_RULE_GROUPS_DATA', JSON.stringify(MOCK_GROUPS));
  } catch (e) {
    console.error('Error saving salary rule groups:', e);
  }

  window.dispatchEvent(new CustomEvent('SALARY_RULE_GROUPS_UPDATED'));
  return newItem;
};

// Lấy danh sách toàn bộ khoản mục để kiểm tra trùng mã
export const getAllRuleItemsWithGroup = () => {
  return MOCK_GROUPS.flatMap(g => 
    (g.items || []).map(i => ({
      id: i.id,
      name: i.name,
      code: i.code ? i.code.trim().toUpperCase() : '',
      description: i.description,
      groupName: g.name,
      groupCode: g.code,
    }))
  );
};

export const SalaryRuleGroupList: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groups, setGroups] = useState<typeof MOCK_GROUPS>(() => [...MOCK_GROUPS]);

  useEffect(() => {
    const handleUpdate = () => {
      setGroups([...MOCK_GROUPS]);
    };
    window.addEventListener('SALARY_RULE_GROUPS_UPDATED', handleUpdate);
    return () => {
      window.removeEventListener('SALARY_RULE_GROUPS_UPDATED', handleUpdate);
    };
  }, []);

  const handleSaveGroup = (savedData: any, isEdit: boolean = false) => {
    if (isEdit && selectedGroup) {
      const index = MOCK_GROUPS.findIndex(g => g.id === selectedGroup.id);
      if (index !== -1) {
        MOCK_GROUPS[index] = {
          ...MOCK_GROUPS[index],
          ...savedData,
          itemCount: savedData.items.length,
        };
      }
    } else {
      const newGroup = {
        id: Date.now(),
        code: savedData.code,
        name: savedData.name,
        description: savedData.description,
        itemCount: savedData.items.length,
        items: savedData.items,
      };
      MOCK_GROUPS.push(newGroup);
    }

    try {
      localStorage.setItem('SALARY_RULE_GROUPS_DATA', JSON.stringify(MOCK_GROUPS));
    } catch (e) {
      console.error('Error saving groups:', e);
    }
    setGroups([...MOCK_GROUPS]);
    window.dispatchEvent(new CustomEvent('SALARY_RULE_GROUPS_UPDATED'));
    setIsAdding(false);
    setSelectedGroup(null);
  };

  if (isAdding) {
    return (
      <SalaryRuleGroupForm 
        onBack={() => setIsAdding(false)} 
        existingCodes={groups.map(g => g.code)} 
        onSave={(data) => handleSaveGroup(data, false)}
      />
    );
  }

  if (selectedGroup) {
    return (
      <SalaryRuleGroupForm 
        onBack={() => setSelectedGroup(null)} 
        existingCodes={groups.filter(g => g.code !== selectedGroup.code).map(g => g.code)} 
        initialData={selectedGroup} 
        onSave={(data) => handleSaveGroup(data, true)}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
      {/* Main white container */}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsAdding(true)} className="bg-[#2563EB] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4 text-gray-500" /> Nhập excel
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-500" /> Xuất excel
            </button>
            <button className="bg-[#E2E8F0] border border-gray-300 text-gray-400 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 cursor-not-allowed ml-1">
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã, tên"
                className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-[220px] focus:outline-none focus:border-blue-500 bg-white"
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
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-16 text-center">STT</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[200px]">Mã</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[250px]">Tên nhóm</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700">Mô tả</th>
                <th className="p-3 border-gray-200 font-medium text-gray-700 w-[160px] text-center">Tổng số khoản mục</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={group.id} onClick={() => setSelectedGroup(group)} className="border-b border-gray-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <td className="p-3 border-r border-gray-200 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-center text-gray-800">{index + 1}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800 font-medium">{group.code}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{group.name}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-600">{group.description}</td>
                  <td className="p-3 border-gray-200 text-gray-800 text-center font-medium">{group.itemCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
