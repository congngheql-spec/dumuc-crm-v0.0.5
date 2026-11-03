import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Info, Calculator, CheckSquare, Square } from 'lucide-react';

interface PersonnelCostEstimationProps {
  onClose: () => void;
}

const POSITIONS = [
  { code: 'GD', name: 'Giám Đốc' },
  { code: 'PGD', name: 'Phó Giám Đốc' },
  { code: 'QX', name: 'Quản lý xưởng' },
  { code: 'KT', name: 'Kế Toán' },
  { code: 'GR_CV', name: 'Cố Vấn Garage' },
  { code: 'GR_KTV', name: 'GR Kỹ Thuật Viên' },
];

const MOCK_SALARY_DATA: Record<string, { level: number; name: string; salary: number }[]> = {
  'GD': [
    { level: 1, name: 'Bậc 1', salary: 30000000 },
    { level: 2, name: 'Bậc 2', salary: 40000000 },
    { level: 3, name: 'Bậc 3', salary: 50000000 },
  ],
  'PGD': [
    { level: 1, name: 'Bậc 1', salary: 25000000 },
    { level: 2, name: 'Bậc 2', salary: 30000000 },
    { level: 3, name: 'Bậc 3', salary: 35000000 },
    { level: 4, name: 'Bậc 4', salary: 40000000 },
  ],
  'QX': [
    { level: 1, name: 'Bậc 1', salary: 20000000 },
    { level: 2, name: 'Bậc 2', salary: 25000000 },
    { level: 3, name: 'Bậc 3', salary: 30000000 },
    { level: 4, name: 'Bậc 4', salary: 35000000 },
    { level: 5, name: 'Bậc 5', salary: 40000000 },
  ],
  'KT': [
    { level: 1, name: 'Bậc 1', salary: 10000000 },
    { level: 2, name: 'Bậc 2', salary: 12000000 },
    { level: 3, name: 'Bậc 3', salary: 15000000 },
    { level: 4, name: 'Bậc 4', salary: 18000000 },
    { level: 5, name: 'Bậc 5', salary: 22000000 },
    { level: 6, name: 'Bậc 6', salary: 26000000 },
    { level: 7, name: 'Bậc 7', salary: 30000000 },
  ],
  'GR_CV': [
    { level: 1, name: 'Bậc 1', salary: 12000000 },
    { level: 2, name: 'Bậc 2', salary: 15000000 },
    { level: 3, name: 'Bậc 3', salary: 18000000 },
    { level: 4, name: 'Bậc 4', salary: 22000000 },
    { level: 5, name: 'Bậc 5', salary: 26000000 },
    { level: 6, name: 'Bậc 6', salary: 30000000 },
  ],
  'GR_KTV': [
    { level: 1, name: 'Bậc 1', salary: 8000000 },
    { level: 2, name: 'Bậc 2', salary: 10000000 },
    { level: 3, name: 'Bậc 3', salary: 12000000 },
    { level: 4, name: 'Bậc 4', salary: 15000000 },
    { level: 5, name: 'Bậc 5', salary: 18000000 },
    { level: 6, name: 'Bậc 6', salary: 22000000 },
    { level: 7, name: 'Bậc 7', salary: 25000000 },
    { level: 8, name: 'Bậc 8', salary: 28000000 },
    { level: 9, name: 'Bậc 9', salary: 32000000 },
    { level: 10, name: 'Bậc 10', salary: 35000000 },
  ]
};

interface CostRow {
  id: string;
  positionCode: string;
  level: number;
  salary: number;
  quantity: number;
}

export const PersonnelCostEstimation: React.FC<PersonnelCostEstimationProps> = ({ onClose }) => {
  // --- LEFT PANEL STATE ---
  const [costRows, setCostRows] = useState<CostRow[]>([
    { id: '1', positionCode: '', level: 1, salary: 0, quantity: 1 }
  ]);

  const handleAddRow = () => {
    setCostRows([...costRows, { id: Date.now().toString(), positionCode: '', level: 1, salary: 0, quantity: 1 }]);
  };

  const handleRemoveRow = (id: string) => {
    setCostRows(costRows.filter(row => row.id !== id));
  };

  const handleRowChange = (id: string, field: keyof CostRow, value: any) => {
    setCostRows(rows => rows.map(row => {
      if (row.id !== id) return row;
      const newRow = { ...row, [field]: value };
      
      // Auto-update salary if position or level changes
      if (field === 'positionCode' || field === 'level') {
        const positionData = MOCK_SALARY_DATA[newRow.positionCode];
        if (positionData) {
          // If switching position, reset level to 1 or keep if valid
          const validLevel = positionData.find(l => l.level === newRow.level) ? newRow.level : 1;
          newRow.level = validLevel;
          const levelData = positionData.find(l => l.level === validLevel);
          newRow.salary = levelData ? levelData.salary : 0;
        } else {
          newRow.salary = 0;
        }
      }
      return newRow;
    }));
  };

  const leftTotalCost = costRows.reduce((sum, row) => sum + (row.salary * row.quantity), 0);

  // --- RIGHT PANEL STATE ---
  const [targetBudgetStr, setTargetBudgetStr] = useState<string>('');
  const [positionQuantities, setPositionQuantities] = useState<Record<string, number>>({});
  const [excludeInsurance, setExcludeInsurance] = useState<boolean>(true);

  const targetBudget = parseInt(targetBudgetStr.replace(/[^0-9]/g, '')) || 0;
  
  // Calculate effective budget for base salaries. Standard VN employer insurance is ~21.5%
  const effectiveTargetBudget = excludeInsurance ? targetBudget : targetBudget / 1.215;

  const updatePositionQuantity = (code: string, delta: number) => {
    setPositionQuantities(prev => {
      const current = prev[code] || 0;
      const next = Math.max(0, current + delta);
      const newState = { ...prev };
      if (next === 0) {
        delete newState[code];
      } else {
        newState[code] = next;
      }
      return newState;
    });
  };

  // Algorithm to distribute budget
  const suggestedAllocation = useMemo(() => {
    const totalPeople = (Object.values(positionQuantities) as number[]).reduce((sum: number, qty: number) => sum + qty, 0);
    if (effectiveTargetBudget <= 0 || totalPeople === 0) return [];

    const budgetPerPerson = effectiveTargetBudget / totalPeople;
    const allocation = [];
    let remainingBudget = effectiveTargetBudget;

    for (const [code, qtyVal] of Object.entries(positionQuantities)) {
      const qty = Number(qtyVal);
      if (qty <= 0) continue;
      
      const positionData = MOCK_SALARY_DATA[code];
      if (!positionData) continue;

      // Find the highest grade that fits within budgetPerPerson
      let selectedGrade = positionData[0]; // default to lowest
      for (const grade of positionData) {
        if (grade.salary <= budgetPerPerson) {
          selectedGrade = grade;
        }
      }
      
      allocation.push({
        positionCode: code,
        positionName: POSITIONS.find(p => p.code === code)?.name || code,
        level: selectedGrade.level,
        gradeName: selectedGrade.name,
        salary: selectedGrade.salary,
        quantity: qty
      });
      remainingBudget -= (selectedGrade.salary * qty);
    }
    
    return allocation;
  }, [effectiveTargetBudget, positionQuantities]);

  const rightTotalCost = suggestedAllocation.reduce((sum, item) => sum + item.salary * item.quantity, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setTargetBudgetStr('');
      return;
    }
    setTargetBudgetStr(new Intl.NumberFormat('vi-VN').format(parseInt(rawValue)));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8]">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-4 shrink-0 shadow-sm z-10">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Dự toán Chi phí Nhân sự</h2>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4 min-h-0">
        
        {/* LEFT PANEL: Calculate Cost */}
        <div className="flex-1 flex flex-col bg-white rounded-md shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              Tính chi phí lương
            </h3>
            <p className="text-xs text-gray-500 mt-1">Lên danh sách nhân sự để tính tổng quỹ lương</p>
          </div>
          
          <div className="flex-1 overflow-auto p-5">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-[200px]">Vị trí</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-[120px]">Bậc</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-[150px] text-right">Lương mặc định</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-[100px] text-center">Số lượng</th>
                  <th className="p-3 border border-gray-200 font-medium text-gray-700 w-[150px] text-right">Tổng chi phí</th>
                  <th className="p-3 border border-gray-200 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="p-2 border border-gray-200">
                      <select 
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                        value={row.positionCode}
                        onChange={(e) => handleRowChange(row.id, 'positionCode', e.target.value)}
                      >
                        <option value="">-- Chọn vị trí --</option>
                        {POSITIONS.map(pos => (
                          <option key={pos.code} value={pos.code}>{pos.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border border-gray-200">
                      <select 
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                        value={row.level}
                        onChange={(e) => handleRowChange(row.id, 'level', parseInt(e.target.value))}
                        disabled={!row.positionCode}
                      >
                        {row.positionCode && MOCK_SALARY_DATA[row.positionCode]?.map(l => (
                          <option key={l.level} value={l.level}>{l.name}</option>
                        ))}
                        {!row.positionCode && <option value={1}>-</option>}
                      </select>
                    </td>
                    <td className="p-3 border border-gray-200 text-right text-gray-600 bg-gray-50">
                      {formatCurrency(row.salary)}
                    </td>
                    <td className="p-2 border border-gray-200">
                      <input 
                        type="number" 
                        min="1"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:border-blue-500"
                        value={row.quantity || ''}
                        onChange={(e) => handleRowChange(row.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-3 border border-gray-200 text-right font-medium text-blue-700 bg-blue-50/30">
                      {formatCurrency(row.salary * row.quantity)}
                    </td>
                    <td className="p-2 border border-gray-200 text-center">
                      <button 
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={handleAddRow}
              className="mt-4 px-4 py-2 border border-dashed border-blue-400 text-blue-600 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm dòng
            </button>
          </div>
          
          {/* Left Footer Total */}
          <div className="p-5 border-t border-gray-200 bg-[#F8FAFC] shrink-0">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md text-xs font-medium border border-amber-200">
                <Info className="w-4 h-4" />
                <span>Chưa bao gồm Bảo hiểm xã hội và các phụ cấp khác</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Tổng chi phí dự kiến / tháng</div>
                <div className="text-2xl font-bold text-[#1A4B9F]">
                  {formatCurrency(leftTotalCost)} VNĐ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Auto Allocation */}
        <div className="flex-1 flex flex-col bg-white rounded-md shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              Tự động phân bổ ngân sách
            </h3>
            <p className="text-xs text-gray-500 mt-1">Gợi ý cấp bậc tuyển dụng dựa trên ngân sách lương mục tiêu</p>
          </div>
          
          <div className="flex-1 overflow-auto p-5 flex flex-col gap-6">
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Ngân sách lương mục tiêu / tháng (VNĐ)
              </label>
              <input 
                type="text" 
                placeholder="VD: 150.000.000"
                className="w-full border border-blue-200 rounded-md px-4 py-3 text-lg font-bold text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                value={targetBudgetStr}
                onChange={handleBudgetChange}
              />
              <div 
                className="flex items-center gap-2 mt-3 cursor-pointer"
                onClick={() => setExcludeInsurance(!excludeInsurance)}
              >
                {excludeInsurance ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-700 font-medium">
                  Chưa bao gồm chi phí NSDLĐ đóng BHXH (21.5%) và phụ cấp khác
                </span>
              </div>
              {!excludeInsurance && targetBudget > 0 && (
                <div className="mt-2 text-xs text-blue-700 bg-blue-100/50 p-2 rounded">
                  * Ngân sách quỹ lương thực tế (sau khi trừ BHXH): <strong>{formatCurrency(effectiveTargetBudget)} VNĐ</strong>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn các vị trí muốn tuyển
              </label>
              <div className="grid grid-cols-2 gap-3">
                {POSITIONS.map(pos => {
                  const qty = positionQuantities[pos.code] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div 
                      key={pos.code}
                      className={`flex flex-col gap-2 p-3 rounded-md border transition-all ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className={`text-sm ${isSelected ? 'font-medium text-blue-900' : 'text-gray-600'}`}>
                        {pos.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updatePositionQuantity(pos.code, -1)}
                          disabled={qty === 0}
                          className={`p-1 rounded-full border flex items-center justify-center transition-colors ${qty > 0 ? 'border-blue-500 text-blue-600 hover:bg-blue-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                        <button 
                          onClick={() => updatePositionQuantity(pos.code, 1)}
                          className="p-1 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Danh sách Gợi ý</h4>
              
              {targetBudget <= 0 || Object.keys(positionQuantities).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center px-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                  <Calculator className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Vui lòng nhập ngân sách và chọn số lượng ít nhất 1 vị trí để hệ thống gợi ý cấp bậc phù hợp.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-[#F8FAFC]">
                      <tr>
                        <th className="p-3 border-b border-gray-200 font-medium text-gray-700">Vị trí & Cấp bậc gợi ý</th>
                        <th className="p-3 border-b border-gray-200 font-medium text-gray-700 text-center w-24">SL</th>
                        <th className="p-3 border-b border-gray-200 font-medium text-gray-700 text-right">Lương / người</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestedAllocation.length > 0 ? (
                        suggestedAllocation.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium text-gray-800">{item.positionName}</div>
                              <div className="text-xs text-blue-600 mt-0.5">{item.gradeName}</div>
                            </td>
                            <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                            <td className="p-3 text-right font-medium text-gray-700">
                              {formatCurrency(item.salary)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-red-500 text-sm">
                            Ngân sách quá thấp để đáp ứng các vị trí đã chọn.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {suggestedAllocation.length > 0 && (
                      <tfoot className="bg-blue-50/50">
                        <tr>
                          <td colSpan={2} className="p-3 text-right text-sm font-semibold text-gray-700">
                            Tổng chi quỹ lương:
                          </td>
                          <td className="p-3 text-right font-bold text-blue-700 text-base">
                            {formatCurrency(rightTotalCost)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="p-2 pt-0 text-right text-xs text-gray-500">
                            Ngân sách còn dư:
                          </td>
                          <td className="p-2 pt-0 text-right text-xs font-medium text-green-600">
                            +{formatCurrency(effectiveTargetBudget - rightTotalCost)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
