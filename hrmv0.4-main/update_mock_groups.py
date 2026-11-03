import json

itemsData = {
  1: [
    { "id": '1_1', "name": 'Lương cơ bản', "code": 'LCB', "description": 'Lương theo hợp đồng', "bhxhHuuTri": True, "bhxhOmDau": True, "bhxhTnld": True, "bhxhBhyt": True, "bhxhBhtn": True, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' },
    { "id": '1_2', "name": 'Lương năng suất', "code": 'LNS', "description": 'Lương dựa trên năng suất', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' }
  ],
  2: [
    { "id": '2_1', "name": 'Thưởng KPI', "code": 'KPI', "description": 'Thưởng đạt mục tiêu', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' },
    { "id": '2_2', "name": 'Thưởng doanh thu', "code": 'DT', "description": 'Thưởng hoa hồng doanh thu', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' }
  ],
  3: [
    { "id": '3_1', "name": 'Phụ cấp ăn trưa', "code": 'PC_AN', "description": 'Hỗ trợ bữa ăn giữa ca', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' },
    { "id": '3_2', "name": 'Phụ cấp xăng xe', "code": 'PC_XANG', "description": 'Hỗ trợ đi lại', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' },
    { "id": '3_3', "name": 'Phụ cấp chức vụ', "code": 'PC_CV', "description": 'Phụ cấp trách nhiệm quản lý', "bhxhHuuTri": True, "bhxhOmDau": True, "bhxhTnld": True, "bhxhBhyt": True, "bhxhBhtn": True, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' }
  ],
  4: [
    { "id": '4_1', "name": 'Tiền trách nhiệm', "code": 'TTN', "description": 'Thưởng trách nhiệm công việc', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' }
  ],
  5: [
    { "id": '5_1', "name": 'Hỗ trợ điện thoại', "code": 'HT_DT', "description": 'Cước phí viễn thông', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' },
    { "id": '5_2', "name": 'Hỗ trợ nhà ở', "code": 'HT_NO', "description": 'Hỗ trợ tiền thuê nhà', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": True, "tncnCoDinh": False, "hasKhauTru": False, "khauTruLimit": '' }
  ],
  6: [
    { "id": '6_1', "name": 'BHXH (8%)', "code": 'BHXH_8', "description": 'Bảo hiểm xã hội người lao động đóng', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '' },
    { "id": '6_2', "name": 'BHYT (1.5%)', "code": 'BHYT_15', "description": 'Bảo hiểm y tế người lao động đóng', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '' },
    { "id": '6_3', "name": 'BHTN (1%)', "code": 'BHTN_1', "description": 'Bảo hiểm thất nghiệp người lao động đóng', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '' }
  ],
  7: [
    { "id": '7_1', "name": 'Giảm trừ bản thân', "code": 'GT_BT', "description": 'Mức giảm trừ gia cảnh cho bản thân', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '11,000,000' },
    { "id": '7_2', "name": 'Giảm trừ người phụ thuộc', "code": 'GT_NPT', "description": 'Mức giảm trừ cho mỗi người phụ thuộc', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '4,400,000' }
  ],
  8: [
    { "id": '8_1', "name": 'Thuế TNCN lũy tiến', "code": 'TNCN_LT', "description": 'Thuế tính theo biểu lũy tiến từng phần', "bhxhHuuTri": False, "bhxhOmDau": False, "bhxhTnld": False, "bhxhBhyt": False, "bhxhBhtn": False, "tncnLuyTien": False, "tncnCoDinh": False, "hasKhauTru": True, "khauTruLimit": '' }
  ]
}

def bool_to_js(b):
    return "true" if b else "false"

def to_js_str(s):
    return f"'{s}'"

def item_to_js(item):
    props = []
    for k, v in item.items():
        if isinstance(v, bool):
            props.append(f"{k}: {bool_to_js(v)}")
        else:
            props.append(f"{k}: {to_js_str(v)}")
    return "{" + ", ".join(props) + "}"

def items_to_js(items):
    return "[" + ",\n      ".join([item_to_js(i) for i in items]) + "]"

content = f"""import React, {{ useState }} from 'react';
import {{ Plus, Download, Upload, Trash2, Search, LayoutTemplate, Trash }} from 'lucide-react';
import {{ SalaryRuleGroupForm }} from './SalaryRuleGroupForm';

const MOCK_GROUPS = [
  {{ id: 1, code: 'NQT_LUONG', name: 'Lương', description: 'Quy tắc tính lương cơ bản và lương doanh thu', itemCount: 2, items: {items_to_js(itemsData[1])} }},
  {{ id: 2, code: 'NQT_HIEUQUA', name: 'Hiệu quả', description: 'Đánh giá KPI và hiệu suất công việc', itemCount: 2, items: {items_to_js(itemsData[2])} }},
  {{ id: 3, code: 'NQT_PHUCAP', name: 'Phụ cấp', description: 'Phụ cấp ăn trưa, đi lại, điện thoại', itemCount: 3, items: {items_to_js(itemsData[3])} }},
  {{ id: 4, code: 'NQT_BOSUNG', name: 'Bổ sung', description: 'Các khoản thu nhập bổ sung khác', itemCount: 1, items: {items_to_js(itemsData[4])} }},
  {{ id: 5, code: 'NQT_HOTRO', name: 'Hỗ trợ', description: 'Hỗ trợ chi phí đào tạo, trang thiết bị', itemCount: 2, items: {items_to_js(itemsData[5])} }},
  {{ id: 6, code: 'NQT_BHXH', name: 'Bảo hiểm xã hội', description: 'Các khoản trích nộp bảo hiểm theo quy định', itemCount: 3, items: {items_to_js(itemsData[6])} }},
  {{ id: 7, code: 'NQT_GIAMTRU', name: 'Giảm trừ', description: 'Các khoản giảm trừ gia cảnh, phạt vi phạm', itemCount: 2, items: {items_to_js(itemsData[7])} }},
  {{ id: 8, code: 'NQT_THUETNCN', name: 'Thuế TNCN', description: 'Thuế thu nhập cá nhân theo biểu thuế lũy tiến', itemCount: 1, items: {items_to_js(itemsData[8])} }},
];

export const SalaryRuleGroupList: React.FC = () => {{
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  if (isAdding) {{
    return <SalaryRuleGroupForm onBack={{() => setIsAdding(false)}} existingCodes={{MOCK_GROUPS.map(g => g.code)}} />;
  }}

  if (selectedGroup) {{
    return <SalaryRuleGroupForm onBack={{() => setSelectedGroup(null)}} existingCodes={{MOCK_GROUPS.filter(g => g.code !== selectedGroup.code).map(g => g.code)}} initialData={{selectedGroup}} />;
  }}

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
      {{/* Main white container */}}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {{/* Action Toolbar */}}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button onClick={{() => setIsAdding(true)}} className="bg-[#2563EB] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
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

        {{/* Data Table */}}
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
              {{MOCK_GROUPS.map((group, index) => (
                <tr key={{group.id}} onClick={{() => setSelectedGroup(group)}} className="border-b border-gray-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <td className="p-3 border-r border-gray-200 text-center" onClick={{(e) => e.stopPropagation()}}>
                    <input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-center text-gray-800">{{index + 1}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800 font-medium">{{group.code}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{{group.name}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-600">{{group.description}}</td>
                  <td className="p-3 border-gray-200 text-gray-800 text-center font-medium">{{group.itemCount}}</td>
                </tr>
              ))}}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}};
"""

with open('components/SalaryRuleGroupList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

