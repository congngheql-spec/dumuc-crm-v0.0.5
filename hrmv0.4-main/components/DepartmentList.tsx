import React from 'react';
import { Plus, Download, Upload, Trash2, Search, LayoutTemplate, Edit3, Trash } from 'lucide-react';

const MOCK_DEPARTMENTS = [
  { code: 'GD', name: 'Giám đốc', description: '', parentDepartment: '', status: 'Hoạt động' },
  { code: 'KHO', name: 'Kho', description: '', parentDepartment: 'GD', status: 'Hoạt động' },
  { code: 'KT', name: 'Phòng kế toán', description: '', parentDepartment: 'GD', status: 'Hoạt động' },
  { code: 'KTV', name: 'Phòng Kỹ Thuật', description: '', parentDepartment: 'GD', status: 'Hoạt động' },
  { code: 'TV', name: 'Phòng Tư vấn, Dịch vụ', description: '', parentDepartment: 'GD', status: 'Hoạt động' },
];

export const DepartmentList: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8] p-4">
      {/* Main white container */}
      <div className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden relative">
        
        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="bg-[#1A4B9F] text-white px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" /> Nhập excel
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Xuất excel
            </button>
            <button className="bg-[#E2E8F0] border border-gray-300 text-gray-400 px-3 py-1.5 rounded text-[13px] flex items-center gap-1.5 cursor-not-allowed">
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã, tên"
                className="border border-gray-300 rounded px-3 py-1.5 pl-3 pr-8 text-[13px] w-[200px] focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="bg-[#1A4B9F] text-white p-1.5 rounded hover:bg-blue-800 transition-colors">
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10">
              <tr>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px]">Mã</th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-[250px]">Tên bộ phận</th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700">Mô tả</th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px]">Bộ phận Mẹ</th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px] text-center">Trạng thái</th>
                <th className="p-3 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px] text-center">Hành động</th>
                <th className="p-3 border-b border-gray-200 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DEPARTMENTS.map((dept, index) => (
                <tr key={index} className={`border-b border-gray-200 ${index === 0 ? 'bg-[#FFF9C4]' : 'hover:bg-gray-50'}`}>
                  <td className="p-3 border-r border-gray-200 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{dept.code}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{dept.name}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{dept.description}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{dept.parentDepartment}</td>
                  <td className="p-3 border-r border-gray-200 text-center">
                    <span className="inline-flex items-center justify-center border border-[#16A34A] text-[#16A34A] bg-transparent px-4 py-1 rounded-full text-xs font-medium w-full max-w-[100px]">
                      {dept.status}
                    </span>
                  </td>
                  <td className="p-3 border-r border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button className="text-gray-500 hover:text-red-600 transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3"></td>
                </tr>
              ))}
              {/* Empty rows to fill space if needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
