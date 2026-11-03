import json

gradesData = {
  'GD': [
    { "id": 'gd_1', "level": 1, "name": 'Bậc 1', "salary": 50000000, "increase": 0, "target": 'Đạt KPI 80%', "file": '' },
    { "id": 'gd_2', "level": 2, "name": 'Bậc 2', "salary": 60000000, "increase": 20, "target": 'Đạt KPI 100%', "file": '' },
    { "id": 'gd_3', "level": 3, "name": 'Bậc 3', "salary": 75000000, "increase": 25, "target": 'Đạt KPI 120%', "file": '' }
  ],
  'PGD': [
    { "id": 'pgd_1', "level": 1, "name": 'Bậc 1', "salary": 35000000, "increase": 0, "target": 'Đạt KPI 80%', "file": '' },
    { "id": 'pgd_2', "level": 2, "name": 'Bậc 2', "salary": 45000000, "increase": 28.5, "target": 'Đạt KPI 100%', "file": '' },
    { "id": 'pgd_3', "level": 3, "name": 'Bậc 3', "salary": 55000000, "increase": 22.2, "target": 'Đạt KPI 120%', "file": '' },
    { "id": 'pgd_4', "level": 4, "name": 'Bậc 4', "salary": 65000000, "increase": 18.1, "target": 'Vượt KPI', "file": '' }
  ],
  'QX': [
    { "id": 'qx_1', "level": 1, "name": 'Bậc 1', "salary": 20000000, "increase": 0, "target": 'Đạt chỉ tiêu doanh thu xưởng', "file": '' },
    { "id": 'qx_2', "level": 2, "name": 'Bậc 2', "salary": 25000000, "increase": 25, "target": 'Vượt chỉ tiêu doanh thu xưởng', "file": '' },
    { "id": 'qx_3', "level": 3, "name": 'Bậc 3', "salary": 30000000, "increase": 20, "target": 'Tối ưu chi phí hoạt động', "file": '' },
    { "id": 'qx_4', "level": 4, "name": 'Bậc 4', "salary": 35000000, "increase": 16.6, "target": 'Nâng cao chất lượng dịch vụ', "file": '' },
    { "id": 'qx_5', "level": 5, "name": 'Bậc 5', "salary": 42000000, "increase": 20, "target": 'Xuất sắc', "file": '' }
  ],
  'KT': [
    { "id": 'kt_1', "level": 1, "name": 'Mới vào nghề', "salary": 8000000, "increase": 0, "target": 'Hoàn thành công việc cơ bản', "file": '' },
    { "id": 'kt_2', "level": 2, "name": '1 năm kinh nghiệm', "salary": 10000000, "increase": 25, "target": 'Không sai sót báo cáo', "file": '' },
    { "id": 'kt_3', "level": 3, "name": '2 năm kinh nghiệm', "salary": 12000000, "increase": 20, "target": 'Tối ưu chi phí', "file": '' },
    { "id": 'kt_4', "level": 4, "name": 'Chuyên viên', "salary": 15000000, "increase": 25, "target": 'Đảm bảo tiến độ', "file": '' },
    { "id": 'kt_5', "level": 5, "name": 'Kế toán tổng hợp', "salary": 18000000, "increase": 20, "target": 'Quản lý tài chính tốt', "file": '' },
    { "id": 'kt_6', "level": 6, "name": 'Kế toán trưởng', "salary": 25000000, "increase": 38.8, "target": 'Hoàn thành xuất sắc', "file": '' },
    { "id": 'kt_7', "level": 7, "name": 'Kế toán trưởng (Bậc 2)', "salary": 30000000, "increase": 20, "target": 'Xuất sắc', "file": '' }
  ],
  'GR_CV': [
    { "id": 'cv_1', "level": 1, "name": 'Bậc 1', "salary": 9000000, "increase": 0, "target": 'Doanh thu cá nhân đạt', "file": '' },
    { "id": 'cv_2', "level": 2, "name": 'Bậc 2', "salary": 11000000, "increase": 22.2, "target": 'Chỉ số CSI đạt', "file": '' },
    { "id": 'cv_3', "level": 3, "name": 'Bậc 3', "salary": 13000000, "increase": 18.1, "target": 'Tỉ lệ quay lại > 80%', "file": '' },
    { "id": 'cv_4', "level": 4, "name": 'Bậc 4', "salary": 15000000, "increase": 15.3, "target": 'Doanh thu cá nhân vượt', "file": '' },
    { "id": 'cv_5', "level": 5, "name": 'Bậc 5', "salary": 18000000, "increase": 20, "target": 'Xuất sắc', "file": '' },
    { "id": 'cv_6', "level": 6, "name": 'Bậc 6', "salary": 22000000, "increase": 22.2, "target": 'Đóng góp lớn', "file": '' }
  ],
  'GR_KTV': [
    { "id": 'ktv_1', "level": 1, "name": 'Học việc', "salary": 5000000, "increase": 0, "target": 'Hoàn thành chương trình', "file": '' },
    { "id": 'ktv_2', "level": 2, "name": 'Bậc 1', "salary": 7000000, "increase": 40, "target": 'Làm được việc cơ bản', "file": '' },
    { "id": 'ktv_3', "level": 3, "name": 'Bậc 2', "salary": 9000000, "increase": 28.5, "target": 'Độc lập sửa chữa nhanh', "file": '' },
    { "id": 'ktv_4', "level": 4, "name": 'Bậc 3', "salary": 12000000, "increase": 33.3, "target": 'Sửa chữa điện, gầm', "file": '' },
    { "id": 'ktv_5', "level": 5, "name": 'Bậc 4', "salary": 15000000, "increase": 25, "target": 'Sửa chữa máy, hộp số', "file": '' },
    { "id": 'ktv_6', "level": 6, "name": 'Bậc 5', "salary": 18000000, "increase": 20, "target": 'Tổ trưởng tổ máy gầm', "file": '' },
    { "id": 'ktv_7', "level": 7, "name": 'Bậc 6', "salary": 20000000, "increase": 11.1, "target": 'Hiệu suất > 120%', "file": '' },
    { "id": 'ktv_8', "level": 8, "name": 'Bậc 7', "salary": 22000000, "increase": 10, "target": 'Ít lỗi bảo hành', "file": '' },
    { "id": 'ktv_9', "level": 9, "name": 'Bậc 8', "salary": 25000000, "increase": 13.6, "target": 'Xuất sắc', "file": '' },
    { "id": 'ktv_10', "level": 10, "name": 'Bậc 9', "salary": 30000000, "increase": 20, "target": 'KTV Trưởng xuất sắc', "file": '' }
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
        elif isinstance(v, (int, float)):
            props.append(f"{k}: {v}")
        else:
            props.append(f"{k}: {to_js_str(v)}")
    return "{" + ", ".join(props) + "}"

def items_to_js(items):
    return "[\n    " + ",\n    ".join([item_to_js(i) for i in items]) + "\n  ]"

content = f"""import React, {{ useState }} from 'react';
import {{ Plus, Download, Upload, Trash2, Search, LayoutTemplate, Trash, Calculator }} from 'lucide-react';
import {{ SalaryGradeForm }} from './SalaryGradeForm';
import {{ PersonnelCostEstimation }} from './PersonnelCostEstimation';

const MOCK_GRADES = [
  {{ code: 'GD', name: 'Giám Đốc', level: '3', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['GD'])} }},
  {{ code: 'PGD', name: 'Phó Giám Đốc', level: '4', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['PGD'])} }},
  {{ code: 'QX', name: 'Quản lý xưởng', level: '5', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['QX'])} }},
  {{ code: 'KT', name: 'Kế Toán', level: '7', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['KT'])} }},
  {{ code: 'GR_CV', name: 'Cố Vấn Garage', level: '6', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['GR_CV'])} }},
  {{ code: 'GR_KTV', name: 'GR Kỹ Thuật Viên', level: '10', description: '', status: 'Hoạt động', steps: {items_to_js(gradesData['GR_KTV'])} }},
];

export const SalaryGradeList: React.FC = () => {{
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  if (isFormOpen) {{
    return <SalaryGradeForm onClose={{() => setIsFormOpen(false)}} />;
  }}
  
  if (selectedGrade) {{
    return <SalaryGradeForm onClose={{() => setSelectedGrade(null)}} initialData={{selectedGrade}} />;
  }}

  if (isEstimatorOpen) {{
    return <PersonnelCostEstimation onClose={{() => setIsEstimatorOpen(false)}} />;
  }}

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
      {{/* Main white container */}}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {{/* Action Toolbar */}}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button onClick={{() => setIsFormOpen(true)}} className="bg-[#2563EB] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button onClick={{() => setIsEstimatorOpen(true)}} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-emerald-700 transition-colors">
              <Calculator className="w-4 h-4" /> Ước tính chi phí
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
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[200px]">Mã Chức vụ / Vị trí</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-[250px]">Tên Chức vụ / Vị trí</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700 w-24 text-center">Số Bậc</th>
                <th className="p-3 border-r border-gray-200 font-medium text-gray-700">Mô tả</th>
                <th className="p-3 border-gray-200 font-medium text-gray-700 w-32 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {{MOCK_GRADES.map((grade, index) => (
                <tr key={{index}} onClick={{() => setSelectedGrade(grade)}} className="border-b border-gray-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <td className="p-3 border-r border-gray-200 text-center" onClick={{(e) => e.stopPropagation()}}>
                    <input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-blue-600 font-medium">{{grade.code}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{{grade.name}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800 text-center">{{grade.level}}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-600">{{grade.description}}</td>
                  <td className="p-3 border-gray-200 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                      {{grade.status}}
                    </span>
                  </td>
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

with open('components/SalaryGradeList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

