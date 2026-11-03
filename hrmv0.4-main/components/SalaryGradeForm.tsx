import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';

interface SalaryGradeFormProps {
  onClose: () => void;
  initialData?: any;
}

const POSITIONS = [
  { code: 'GD', name: 'Giám Đốc', description: 'Điều hành, quản lý toàn bộ hoạt động của doanh nghiệp' },
  { code: 'PGD', name: 'Phó Giám Đốc', description: 'Hỗ trợ Giám đốc điều hành các mảng chuyên môn' },
  { code: 'QX', name: 'Quản lý xưởng', description: 'Điều hành và giám sát hoạt động sửa chữa tại xưởng' },
  { code: 'KT', name: 'Kế Toán', description: 'Phụ trách các nghiệp vụ kế toán, tài chính' },
  { code: 'GR_CV', name: 'Cố Vấn Garage', description: 'Tư vấn dịch vụ sửa chữa, bảo dưỡng cho khách hàng' },
  { code: 'GR_KTV', name: 'GR Kỹ Thuật Viên', description: 'Trực tiếp thực hiện các nghiệp vụ kỹ thuật sửa chữa ô tô' },
];

interface GradeStep {
  id: string;
  level: number;
  name: string;
  salary: number;
  increase: number;
  target: string;
  file: string;
}

export const SalaryGradeForm: React.FC<SalaryGradeFormProps> = ({ onClose, initialData }) => {
  const [selectedPositionCode, setSelectedPositionCode] = useState(initialData?.code || '');
  const [status, setStatus] = useState(initialData?.status || 'Hoạt động');

  const selectedPosition = POSITIONS.find(p => p.code === selectedPositionCode);
  const description = selectedPosition ? selectedPosition.description : '';

  const [gradeSteps, setGradeSteps] = useState<GradeStep[]>(
    initialData?.steps || [{ id: '1', level: 1, name: '', salary: 0, increase: 0, target: '', file: '' }]
  );

  const handleAddStep = () => {
    const newLevel = gradeSteps.length + 1;
    setGradeSteps([...gradeSteps, {
      id: Date.now().toString(),
      level: newLevel,
      name: '',
      salary: 0,
      increase: 0,
      target: '',
      file: ''
    }]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = gradeSteps.filter((_, i) => i !== index);
    // Re-adjust levels and recalculate increases
    const updatedSteps = newSteps.map((step, i) => {
      let increase = 0;
      if (i > 0 && newSteps[i - 1].salary > 0) {
        increase = ((step.salary - newSteps[i - 1].salary) / newSteps[i - 1].salary) * 100;
      }
      return { ...step, level: i + 1, increase };
    });
    setGradeSteps(updatedSteps);
  };

  const handleStepChange = (index: number, field: keyof GradeStep, value: any) => {
    const newSteps = [...gradeSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    
    // Recalculate increases if salary changed
    if (field === 'salary') {
      for (let i = 1; i < newSteps.length; i++) {
        if (newSteps[i - 1].salary > 0) {
          newSteps[i].increase = ((newSteps[i].salary - newSteps[i - 1].salary) / newSteps[i - 1].salary) * 100;
        } else {
          newSteps[i].increase = 0;
        }
      }
    }
    
    setGradeSteps(newSteps);
  };

  const formatCurrency = (value: number) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8]">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Chi tiết Thang bảng lương' : 'Thêm mới Thang bảng lương'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button className="px-4 py-2 bg-[#1A4B9F] text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition-colors">
            <Save className="w-4 h-4" /> Lưu
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-5 mb-4">
          <h3 className="text-base font-medium text-gray-800 mb-4 border-b border-gray-100 pb-2">Thông tin chung</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Chức vụ / Vị trí <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={selectedPositionCode}
                  onChange={(e) => setSelectedPositionCode(e.target.value)}
                >
                  <option value="">Chọn chức vụ / vị trí</option>
                  {POSITIONS.map(pos => (
                    <option key={pos.code} value={pos.code}>{pos.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã chức vụ / vị trí
                </label>
                <input 
                  type="text" 
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  value={selectedPositionCode}
                  placeholder="Tự động điền theo chức vụ"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 focus:outline-none"
                  rows={2}
                  readOnly
                  placeholder="Tự động điền theo chức vụ..."
                  value={description}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-5">
          <h3 className="text-base font-medium text-gray-800 mb-4 border-b border-gray-100 pb-2">Cấu trúc Bậc lương</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[800px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-16 text-center">Bậc</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-64">Tên Phân loại Bậc</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-48 text-right">Lương hàng tháng (VNĐ)</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-32 text-right">Mức tăng (%)</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700">Đối tượng & Tiêu chuẩn áp dụng</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-32 text-center">Files đính kèm</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-16 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {gradeSteps.map((step, index) => (
                  <tr key={step.id}>
                    <td className="p-3 border border-gray-200 text-center font-medium bg-gray-50">{step.level}</td>
                    <td className="p-3 border border-gray-200">
                      <input 
                        type="text"
                        className="w-full border-0 bg-transparent focus:ring-0 p-0 text-sm"
                        placeholder="Nhập tên phân loại..."
                        value={step.name}
                        onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      <input 
                        type="number"
                        className="w-full border-0 bg-transparent focus:ring-0 p-0 text-sm text-right font-medium text-blue-600"
                        placeholder="0"
                        value={step.salary || ''}
                        onChange={(e) => handleStepChange(index, 'salary', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-3 border border-gray-200 text-right bg-gray-50 font-medium text-green-600">
                      {step.increase > 0 ? `+${step.increase.toFixed(1)}%` : step.increase < 0 ? `${step.increase.toFixed(1)}%` : '-'}
                    </td>
                    <td className="p-3 border border-gray-200">
                      <input 
                        type="text"
                        className="w-full border-0 bg-transparent focus:ring-0 p-0 text-sm"
                        placeholder="Nhập tiêu chuẩn..."
                        value={step.target}
                        onChange={(e) => handleStepChange(index, 'target', e.target.value)}
                      />
                    </td>
                    <td className="p-3 border border-gray-200 text-center">
                      <label className="cursor-pointer inline-flex items-center justify-center p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-500 transition-colors">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                    <td className="p-3 border border-gray-200 text-center">
                      <button 
                        onClick={() => handleRemoveStep(index)}
                        disabled={gradeSteps.length === 1}
                        className={`p-1.5 rounded transition-colors ${gradeSteps.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={handleAddStep}
              className="px-4 py-2 border border-dashed border-blue-400 text-blue-600 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm bậc lương
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
