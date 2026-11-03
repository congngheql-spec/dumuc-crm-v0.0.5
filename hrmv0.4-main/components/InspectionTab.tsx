import React, { useState, useRef, useEffect } from 'react';
import { Info, Mic, Camera, Video, Upload, Eye, X, RotateCcw, Save, Activity } from 'lucide-react';

type VehicleType = 'gas' | 'hybrid' | 'electric' | null;
type ResultType = 'good' | 'monitor' | 'fix' | null;
type FilterType = 'all' | 'good' | 'monitor' | 'fix' | 'uninspected';

interface InspectionItem {
  id: string;
  name: string;
  help: string;
}

interface InspectionCategory {
  id: string;
  name: string;
  items: InspectionItem[];
}

const CATEGORIES: InspectionCategory[] = [
  {
    id: 'exterior',
    name: 'Ngoại thất & Sạc',
    items: [
      { id: 'ext_1', name: 'Đèn pha/cos', help: 'Kiểm tra độ sáng, nứt vỡ' },
      { id: 'ext_2', name: 'Đèn xi nhan', help: 'Kiểm tra nháy đều, sáng rõ' },
      { id: 'ext_3', name: 'Gạt mưa', help: 'Kiểm tra lưỡi gạt, nước rửa kính' },
      { id: 'ext_4', name: 'Sơn xe', help: 'Kiểm tra trầy xước, móp méo' },
      { id: 'ext_5', name: 'Cổng sạc', help: 'Kiểm tra tiếp xúc, nắp đậy' },
      { id: 'ext_6', name: 'Kính chắn gió', help: 'Kiểm tra nứt, xước' },
    ]
  },
  {
    id: 'wheels',
    name: 'Bánh xe và Gầm',
    items: [
      { id: 'whl_1', name: 'Áp suất lốp', help: 'Đo áp suất 4 bánh' },
      { id: 'whl_2', name: 'Độ mòn gai lốp', help: 'Kiểm tra vạch chỉ thị mòn' },
      { id: 'whl_3', name: 'Phanh', help: 'Kiểm tra má phanh, đĩa phanh' },
      { id: 'whl_4', name: 'Giảm xóc', help: 'Kiểm tra rò rỉ dầu' },
      { id: 'whl_5', name: 'Gầm xe', help: 'Kiểm tra rỉ sét, va đập' },
      { id: 'whl_6', name: 'Ống xả', help: 'Kiểm tra rò rỉ, rỉ sét' },
    ]
  },
  {
    id: 'engine',
    name: 'Khoang máy và Điện',
    items: [
      { id: 'eng_1', name: 'Dầu động cơ', help: 'Kiểm tra mức dầu, chất lượng' },
      { id: 'eng_2', name: 'Nước làm mát', help: 'Kiểm tra mức nước, rò rỉ' },
      { id: 'eng_3', name: 'Ắc quy', help: 'Đo điện áp, kiểm tra cọc bình' },
      { id: 'eng_4', name: 'Dây curoa', help: 'Kiểm tra nứt, chùng' },
      { id: 'eng_5', name: 'Lọc gió', help: 'Kiểm tra độ bẩn' },
      { id: 'eng_6', name: 'Bugi', help: 'Kiểm tra khe hở, muội than' },
    ]
  },
  {
    id: 'interior',
    name: 'Nội thất và Tiện nghi',
    items: [
      { id: 'int_1', name: 'Điều hòa', help: 'Kiểm tra độ lạnh, gió' },
      { id: 'int_2', name: 'Hệ thống âm thanh', help: 'Kiểm tra loa, màn hình' },
      { id: 'int_3', name: 'Ghế ngồi', help: 'Kiểm tra bọc ghế, chỉnh ghế' },
      { id: 'int_4', name: 'Dây đai an toàn', help: 'Kiểm tra độ căng, chốt' },
      { id: 'int_5', name: 'Cửa sổ điện', help: 'Kiểm tra lên xuống kính' },
      { id: 'int_6', name: 'Đèn nội thất', help: 'Kiểm tra các đèn trần' },
    ]
  }
];

interface ItemState {
  result: ResultType;
  note: string;
  media: string[]; // Mock media URLs
}

export const InspectionTab: React.FC<{
  triggerValidation: boolean;
  onValidationComplete: (isValid: boolean) => void;
}> = ({ triggerValidation, onValidationComplete }) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeNoteInput, setActiveNoteInput] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [reviewModalItem, setReviewModalItem] = useState<string | null>(null);

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const totalItems = CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const goodCount = Object.values(itemStates).filter((s: ItemState) => s.result === 'good').length;
  const monitorCount = Object.values(itemStates).filter((s: ItemState) => s.result === 'monitor').length;
  const fixCount = Object.values(itemStates).filter((s: ItemState) => s.result === 'fix').length;
  const uninspectedCount = totalItems - (goodCount + monitorCount + fixCount);

  useEffect(() => {
    if (triggerValidation) {
      const errors = new Set<string>();
      let firstErrorId: string | null = null;

      CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (!itemStates[item.id]?.result) {
            errors.add(item.id);
            if (!firstErrorId) firstErrorId = item.id;
          }
        });
      });

      setValidationErrors(errors);
      onValidationComplete(errors.size === 0);

      if (firstErrorId && itemRefs.current[firstErrorId]) {
        itemRefs.current[firstErrorId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [triggerValidation, itemStates, onValidationComplete]);

  const handleResultChange = (itemId: string, result: ResultType) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], result }
    }));
    setValidationErrors(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleNoteSave = (itemId: string, note: string) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], note }
    }));
    setActiveNoteInput(null);
  };

  const addMockMedia = (itemId: string, type: 'photo' | 'video') => {
    setItemStates(prev => {
      const current = prev[itemId] || { result: null, note: '', media: [] };
      return {
        ...prev,
        [itemId]: {
          ...current,
          media: [...(current.media || []), `${type}_${Date.now()}`]
        }
      };
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Vehicle Type Selection and Filters */}
      <div className="flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 border-r pr-6 border-gray-200">
          <span className="font-medium text-gray-700">Danh mục kiểm tra:</span>
          <div className="flex gap-4">
            {(['gas', 'hybrid', 'electric'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="vehicleType"
                  value={type}
                  checked={vehicleType === type}
                  onChange={() => setVehicleType(type)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  {type === 'gas' ? 'Xe xăng' : type === 'hybrid' ? 'Xe Hybrid' : 'Xe điện'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {vehicleType && (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Lọc:</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" value="all" checked={filterType === 'all'} onChange={() => setFilterType('all')} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className="text-gray-700">Tất cả ({totalItems})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" value="good" checked={filterType === 'good'} onChange={() => setFilterType('good')} className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" />
                <span className="text-gray-700">Tốt ({goodCount})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" value="monitor" checked={filterType === 'monitor'} onChange={() => setFilterType('monitor')} className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500" />
                <span className="text-gray-700">Theo dõi ({monitorCount})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" value="fix" checked={filterType === 'fix'} onChange={() => setFilterType('fix')} className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                <span className="text-gray-700">Cần xử lý ({fixCount})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" value="uninspected" checked={filterType === 'uninspected'} onChange={() => setFilterType('uninspected')} className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                <span className="text-gray-700">Chưa kiểm tra ({uninspectedCount})</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Progressive Disclosure: Checklist */}
      {vehicleType && (
        <div className="flex flex-col gap-6 pb-20">
          {CATEGORIES.map((category) => {
            const filteredItems = category.items.filter(item => {
              const state = itemStates[item.id];
              if (filterType === 'all') return true;
              if (filterType === 'good') return state?.result === 'good';
              if (filterType === 'monitor') return state?.result === 'monitor';
              if (filterType === 'fix') return state?.result === 'fix';
              if (filterType === 'uninspected') return !state?.result;
              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
            <div key={category.id} className="flex flex-col gap-4">
              {/* Category Header */}
              <div className="bg-[#BCE3CD] px-4 py-2 rounded-md">
                <h3 className="text-[#052E15] font-bold">{category.name}</h3>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const index = category.items.findIndex(i => i.id === item.id);
                  const state = itemStates[item.id] || { result: null, note: '', media: [] };
                  const isFocused = focusedItemId === item.id;
                  const isDimmed = focusedItemId !== null && !isFocused;
                  const hasError = validationErrors.has(item.id);

                  return (
                    <div
                      key={item.id}
                      ref={el => itemRefs.current[item.id] = el}
                      className={`bg-white p-4 rounded-lg border shadow-sm transition-all duration-300 flex flex-col gap-3
                        ${isDimmed ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
                        ${hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}
                        ${isFocused ? 'ring-2 ring-blue-200 border-blue-400' : ''}
                      `}
                      onMouseEnter={() => setFocusedItemId(item.id)}
                      onMouseLeave={() => setFocusedItemId(null)}
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[#3B6E4B] font-bold min-w-[24px]">{index + 1}.</span>
                          <span className="font-medium text-gray-800">{item.name}</span>
                          
                          {/* Info Tooltip */}
                          <div className="relative">
                            <button
                              onMouseEnter={() => setActiveTooltip(item.id)}
                              onMouseLeave={() => setActiveTooltip(null)}
                              className="text-[#14A64A] hover:bg-green-50 rounded-full p-0.5 transition-colors"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            {activeTooltip === item.id && (
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10 text-center">
                                {item.help}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Results Buttons */}
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResultChange(item.id, 'good')}
                            className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors
                              ${state.result === 'good' 
                                ? 'bg-[#14A64A] text-white border-[#14A64A]' 
                                : 'border-[#14A64A] text-[#14A64A] hover:bg-green-50'}`}
                          >
                            Tốt
                          </button>
                          <button
                            onClick={() => handleResultChange(item.id, 'monitor')}
                            className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors
                              ${state.result === 'monitor' 
                                ? 'bg-yellow-400 text-black border-yellow-400' 
                                : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}
                          >
                            Theo dõi
                          </button>
                          <button
                            onClick={() => handleResultChange(item.id, 'fix')}
                            className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors
                              ${state.result === 'fix' 
                                ? 'bg-red-500 text-white border-red-500' 
                                : 'border-red-500 text-red-500 hover:bg-red-50'}`}
                          >
                            Cần xử lý
                          </button>
                        </div>
                        {hasError && (
                          <span className="text-red-500 text-xs mt-1">Vui lòng chọn trạng thái kiểm tra cho mục này</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => setActiveNoteInput(activeNoteInput === item.id ? null : item.id)}
                          className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${state.note ? 'text-blue-600' : 'text-gray-500'}`}
                          title="Ghi chú"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => addMockMedia(item.id, 'photo')}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Chụp ảnh"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => addMockMedia(item.id, 'video')}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Quay phim"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Tải lên"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        
                        {(state.note || (state.media && state.media.length > 0)) && (
                          <button 
                            onClick={() => setReviewModalItem(item.id)}
                            className="ml-auto p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors flex items-center gap-1 text-xs font-medium"
                            title="Xem lại"
                          >
                            <Eye className="w-4 h-4" />
                            Xem lại
                          </button>
                        )}
                      </div>

                      {/* Voice Note Input Area */}
                      {activeNoteInput === item.id && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-blue-600 text-xs font-medium">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Đang nghe...
                          </div>
                          <textarea
                            autoFocus
                            defaultValue={state.note}
                            placeholder="Nói để nhập liệu..."
                            className="w-full text-sm p-2 border border-blue-200 rounded resize-none focus:outline-none focus:border-blue-400"
                            rows={2}
                            id={`note-input-${item.id}`}
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                const el = document.getElementById(`note-input-${item.id}`) as HTMLTextAreaElement;
                                if (el) el.value = '';
                              }}
                              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Xóa
                            </button>
                            <button 
                              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> Làm lại
                            </button>
                            <button 
                              onClick={() => {
                                const el = document.getElementById(`note-input-${item.id}`) as HTMLTextAreaElement;
                                handleNoteSave(item.id, el?.value || '');
                              }}
                              className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Lưu
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Xem lại nội dung đính kèm</h3>
              <button onClick={() => setReviewModalItem(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-4">
              {itemStates[reviewModalItem]?.note && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ghi chú:</h4>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
                    {itemStates[reviewModalItem].note}
                  </div>
                </div>
              )}
              {itemStates[reviewModalItem]?.media?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Media đính kèm:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {itemStates[reviewModalItem].media.map((m, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                        {m.startsWith('photo') ? <Camera className="w-6 h-6 mb-1" /> : <Video className="w-6 h-6 mb-1" />}
                        <span className="sr-only">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!itemStates[reviewModalItem]?.note && (!itemStates[reviewModalItem]?.media || itemStates[reviewModalItem]?.media.length === 0) && (
                <div className="text-center text-gray-500 py-8">Chưa có nội dung đính kèm</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
