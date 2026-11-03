import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';

interface SalaryRuleGroupFormProps {
  onBack: () => void;
  existingCodes: string[];
  initialData?: any;
  onSave?: (data: { code: string; name: string; description: string; items: RuleItem[] }) => void;
}

export type TaxNature = 
  | 'Tính thuế 100%' 
  | 'Miễn thuế hoàn toàn' 
  | 'Miễn thuế có hạn mức tối đa cố định' 
  | 'Tính Thuế theo tỉ lệ tối đa';

export interface RuleItem {
  id: string;
  name: string;
  code: string;
  description: string;
  bhxhHuuTri: boolean;
  bhxhOmDau: boolean;
  bhxhTnld: boolean;
  bhxhBhyt: boolean;
  bhxhBhtn: boolean;
  taxNature: TaxNature;
  taxLimitRate: string;
  tncnLuyTien?: boolean;
  tncnCoDinh?: boolean;
  hasKhauTru: boolean;
  khauTruLimit: string;
}

export const SalaryRuleGroupForm: React.FC<SalaryRuleGroupFormProps> = ({ onBack, existingCodes, initialData, onSave }) => {
  const [groupCode, setGroupCode] = useState(initialData?.code || '');
  const [groupName, setGroupName] = useState(initialData?.name || '');
  const [groupDesc, setGroupDesc] = useState(initialData?.description || '');

  const normalizeItems = (rawItems: any[]): RuleItem[] => {
    return (rawItems || []).map(item => {
      let taxNature: TaxNature = item.taxNature;
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
    });
  };

  const [items, setItems] = useState<RuleItem[]>(() => normalizeItems(initialData?.items || []));
  const [errors, setErrors] = useState<string[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        name: '',
        code: '',
        description: '',
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
      }
    ]);
  };

  const handleTaxNatureChange = (id: string, newNature: TaxNature) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const isDis = newNature === 'Tính thuế 100%' || newNature === 'Miễn thuế hoàn toàn';
        return {
          ...item,
          taxNature: newNature,
          taxLimitRate: isDis ? '' : item.taxLimitRate,
          tncnLuyTien: newNature === 'Tính thuế 100%',
          tncnCoDinh: newNature === 'Tính Thuế theo tỉ lệ tối đa',
        };
      }
      return item;
    }));
  };

  const updateItem = (id: string, field: keyof RuleItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Handle Khấu trừ checkbox uncheck
        if (field === 'hasKhauTru' && value === false) {
          updated.khauTruLimit = '';
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    const newErrors = [];
    
    if (!groupCode.trim()) newErrors.push('Mã nhóm không được để trống.');
    if (existingCodes.includes(groupCode.trim())) newErrors.push('Mã nhóm đã tồn tại.');
    if (!groupName.trim()) newErrors.push('Tên nhóm không được để trống.');

    const itemCodes = items.map(i => i.code.trim()).filter(c => c !== '');
    const uniqueItemCodes = new Set(itemCodes);
    if (itemCodes.length !== uniqueItemCodes.size) {
      newErrors.push('Mã khoản mục không được trùng nhau.');
    }
    
    items.forEach((item, index) => {
      if (!item.code.trim()) newErrors.push(`Khoản mục dòng ${index + 1} phải có Mã.`);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    if (onSave) {
      onSave({
        code: groupCode.trim(),
        name: groupName.trim(),
        description: groupDesc.trim(),
        items,
      });
    }

    alert("Lưu thành công!");
    onBack();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F8]">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">{initialData ? 'Chi tiết Nhóm Quy tắc Lương' : 'Thêm Nhóm Quy tắc Lương'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-300 bg-white rounded text-gray-700 font-medium hover:bg-gray-50 text-[13px] transition-colors">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-[13px] transition-colors">
            Lưu
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex flex-col gap-1">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[13px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top Info Section */}
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 shrink-0">
          <h3 className="text-[15px] font-medium text-blue-600 mb-4">Thông tin chung</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">Mã <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={groupCode}
                onChange={e => setGroupCode(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500"
                placeholder="Nhập mã nhóm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">Tên <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên nhóm"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">Mô tả</label>
              <textarea 
                rows={2}
                value={groupDesc}
                onChange={e => setGroupDesc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Nhập mô tả"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex-1 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-medium text-blue-600">Khoản mục quy tắc</h3>
            <button onClick={addItem} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-[13px] font-medium">
              <Plus className="w-4 h-4" /> Thêm dòng
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-md overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-[13px] min-w-[1360px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                <tr>
                  <th rowSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 w-12 text-center bg-[#F8FAFC]">STT</th>
                  <th rowSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px] bg-[#F8FAFC]">Tên khoản mục</th>
                  <th rowSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 w-[120px] bg-[#F8FAFC]">Mã khoản mục</th>
                  <th rowSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 w-[150px] bg-[#F8FAFC]">Mô tả</th>
                  <th colSpan={5} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 text-center bg-[#EBF5FF]">Quỹ BHXH (NLĐ đóng)</th>
                  <th colSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 text-center bg-[#FCE8E8]">Thuế TNCN (NLĐ đóng)</th>
                  <th rowSpan={2} className="p-2 border-r border-b border-gray-200 font-medium text-gray-700 w-[180px] bg-[#F8FAFC] text-center">Khấu trừ / Hạn mức</th>
                  <th rowSpan={2} className="p-2 border-b border-gray-200 font-medium text-gray-700 w-10 text-center bg-[#F8FAFC]"></th>
                </tr>
                <tr>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[80px] bg-[#F8FAFC] text-[11px] leading-tight">Hưu trí & Tử tuất<br/>(8%)</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[80px] bg-[#F8FAFC] text-[11px] leading-tight">Ốm đau & Thai sản<br/>(0%)</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[80px] bg-[#F8FAFC] text-[11px] leading-tight">TNLĐ-BNN<br/>(0%)</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[80px] bg-[#F8FAFC] text-[11px] leading-tight">BHYT<br/>(1.5%)</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[80px] bg-[#F8FAFC] text-[11px] leading-tight">BHTN<br/>(1%)</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[230px] bg-[#F8FAFC] text-[11px]">Tính chất Thuế</th>
                  <th className="p-2 border-r border-b border-gray-200 font-medium text-gray-600 text-center w-[170px] bg-[#F8FAFC] text-[11px]">Hạn mức / Tỉ lệ chịu Thuế</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-gray-500 italic border-b border-gray-200">
                      Chưa có khoản mục nào. Vui lòng thêm khoản mục.
                    </td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-200 text-center text-gray-700">{index + 1}</td>
                    <td className="p-2 border-r border-gray-200">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      <input 
                        type="text" 
                        value={item.code}
                        onChange={e => updateItem(item.id, 'code', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500"
                      />
                    </td>
                    
                    {/* BHXH */}
                    <td className="p-2 border-r border-gray-200 text-center">
                      <input type="checkbox" checked={item.bhxhHuuTri} onChange={e => updateItem(item.id, 'bhxhHuuTri', e.target.checked)} className="cursor-pointer" />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <input type="checkbox" checked={item.bhxhOmDau} onChange={e => updateItem(item.id, 'bhxhOmDau', e.target.checked)} className="cursor-pointer" />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <input type="checkbox" checked={item.bhxhTnld} onChange={e => updateItem(item.id, 'bhxhTnld', e.target.checked)} className="cursor-pointer" />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <input type="checkbox" checked={item.bhxhBhyt} onChange={e => updateItem(item.id, 'bhxhBhyt', e.target.checked)} className="cursor-pointer" />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <input type="checkbox" checked={item.bhxhBhtn} onChange={e => updateItem(item.id, 'bhxhBhtn', e.target.checked)} className="cursor-pointer" />
                    </td>

                    {/* TNCN */}
                    {/* Tính chất Thuế */}
                    <td className="p-2 border-r border-gray-200">
                      <select 
                        value={item.taxNature || 'Tính thuế 100%'}
                        onChange={e => handleTaxNatureChange(item.id, e.target.value as TaxNature)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-[12.5px] bg-white outline-none focus:border-blue-500 font-normal text-gray-800 cursor-pointer shadow-xs hover:border-gray-400 transition-colors"
                      >
                        <option value="Tính thuế 100%">Tính thuế 100%</option>
                        <option value="Miễn thuế hoàn toàn">Miễn thuế hoàn toàn</option>
                        <option value="Miễn thuế có hạn mức tối đa cố định">Miễn thuế có hạn mức tối đa cố định</option>
                        <option value="Tính Thuế theo tỉ lệ tối đa">Tính Thuế theo tỉ lệ tối đa</option>
                      </select>
                    </td>

                    {/* Hạn mức / Tỉ lệ chịu Thuế */}
                    <td className="p-2 border-r border-gray-200">
                      {item.taxNature === 'Tính thuế 100%' || item.taxNature === 'Miễn thuế hoàn toàn' ? (
                        <input 
                          type="text" 
                          disabled 
                          value="" 
                          placeholder="Không áp dụng"
                          className="w-full border border-gray-200 bg-gray-100 text-gray-400 rounded px-2.5 py-1 text-[12px] italic cursor-not-allowed select-none"
                        />
                      ) : item.taxNature === 'Miễn thuế có hạn mức tối đa cố định' ? (
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={item.taxLimitRate || ''}
                            onChange={e => {
                              const raw = e.target.value.replace(/\D/g, '');
                              const formatted = raw ? Number(raw).toLocaleString('vi-VN') : '';
                              updateItem(item.id, 'taxLimitRate', formatted);
                            }}
                            placeholder="Nhập số tiền"
                            className="w-full border border-blue-300 bg-white rounded px-2.5 py-1 pr-6 text-[12px] outline-none focus:border-blue-600 font-medium text-gray-800 shadow-xs"
                          />
                          <span className="absolute right-2 text-xs font-semibold text-gray-500 pointer-events-none">đ</span>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={item.taxLimitRate || ''}
                            onChange={e => {
                              let val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                              const parts = val.split('.');
                              if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                              if (Number(val) > 100) val = '100';
                              updateItem(item.id, 'taxLimitRate', val);
                            }}
                            placeholder="Nhập tỉ lệ"
                            className="w-full border border-blue-300 bg-white rounded px-2.5 py-1 pr-6 text-[12px] outline-none focus:border-blue-600 font-medium text-gray-800 shadow-xs"
                          />
                          <span className="absolute right-2 text-xs font-semibold text-gray-500 pointer-events-none">%</span>
                        </div>
                      )}
                    </td>

                    {/* Khấu trừ */}
                    <td className="p-2 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <input type="checkbox" checked={item.hasKhauTru} onChange={e => updateItem(item.id, 'hasKhauTru', e.target.checked)} className="cursor-pointer" />
                        {item.hasKhauTru && (
                          <input 
                            type="text" 
                            placeholder="Thiết lập hạn mức"
                            value={item.khauTruLimit}
                            onChange={e => updateItem(item.id, 'khauTruLimit', e.target.value)}
                            className="w-[120px] border border-gray-300 rounded px-2 py-1 text-[12px] outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    </td>

                    <td className="p-2 text-center">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
