import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit2, Link as LinkIcon, Search, X } from 'lucide-react';
import { EventItem } from './EventsModule';

export const EventSettings: React.FC<{ 
  onClose: () => void;
  events: EventItem[];
  onEventsChange: (events: EventItem[]) => void;
}> = ({ onClose, events, onEventsChange }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EventItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  
  const [codeError, setCodeError] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [isAdding]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = () => {
    onEventsChange(events.filter(e => !selectedIds.includes(e.id)));
    setSelectedIds([]);
  };

  const startEdit = (event: EventItem) => {
    setEditingId(event.id);
    setEditForm(event);
    setIsAdding(false);
    setCodeError('');
    setSaveError('');
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({
      code: '',
      name: '',
      fullName: '',
      garageName: '',
      phone: '',
      email: '',
      registrationDate: '',
      status: 'Mới tạo',
      address: '',
      link: '',
      startDate: '',
      endDate: '',
      isLocked: false,
    });
    setCodeError('');
    setSaveError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
    setCodeError('');
    setSaveError('');
  };

  const handleSave = () => {
    if (!editForm.code?.trim()) {
      return;
    }

    const isDuplicate = events.some(e => e.code === editForm.code && e.id !== (isAdding ? 'NEW' : editingId));
    if (isDuplicate) {
      setCodeError('Mã sự kiện này đã tồn tại trong danh sách, vui lòng tạo mã sự kiện khác');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (isAdding) {
      const newEvent: EventItem = {
        id: Date.now().toString(),
        code: editForm.code!,
        name: editForm.name || '',
        fullName: editForm.fullName || '',
        garageName: editForm.garageName || '',
        phone: editForm.phone || '',
        email: editForm.email || '',
        registrationDate: editForm.registrationDate || '',
        status: editForm.status || 'Mới tạo',
        address: editForm.address || '',
        link: editForm.link || '',
        startDate: editForm.startDate || '',
        endDate: editForm.endDate || '',
        isLocked: false,
        source: 'Thủ công',
        callStatus: 'Chưa gọi',
        callResult: 'Rỗng',
      };
      onEventsChange([newEvent, ...events]);
    } else {
      onEventsChange(events.map(e => e.id === editingId ? { ...e, ...editForm } as EventItem : e));
    }

    cancelEdit();
  };

  const isCodeEmpty = !editForm.code?.trim();
  const originalEvent = editingId ? events.find(e => e.id === editingId) : null;
  const isCodeChanged = editingId && originalEvent && editForm.code !== originalEvent.code;

  return (
    <div className="fixed inset-0 bg-[#F5F7FA] z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#14A64A] text-white rounded-md font-medium hover:bg-[#108a3d] transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm sự kiện
          </button>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#14A64A] text-[#14A64A] rounded-md font-medium hover:bg-green-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Quản lý danh sách sự kiện</h1>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          
          {/* Add New Row */}
          {isAdding && (
            <div className="bg-white border-2 border-[#14A64A] rounded-lg p-5 shadow-md relative">
              <div className="flex items-start gap-4">
                <div className="pt-8">
                  <input type="checkbox" disabled className="w-4 h-4 text-[#14A64A] rounded border-gray-300" />
                </div>
                <div className="pt-8 text-[#3B6E4B] font-medium w-6 text-center">
                  -
                </div>
                
                <div className="flex-1 grid grid-cols-12 gap-4">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Mã sự kiện</label>
                    <input 
                      ref={codeInputRef}
                      type="text" 
                      value={editForm.code || ''}
                      onChange={(e) => {
                        setEditForm({...editForm, code: e.target.value});
                        setCodeError('');
                        setSaveError('');
                      }}
                      className={`border rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A] ${isCodeEmpty || codeError ? 'border-red-500' : 'border-gray-300'} ${isShaking ? 'animate-shake' : ''}`}
                    />
                    {isCodeEmpty && <span className="text-xs text-red-500">Mã không được để trống</span>}
                    {codeError && <span className="text-xs text-red-500">{codeError}</span>}
                  </div>
                  
                  <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Tên sự kiện</label>
                    <input 
                      type="text" 
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                    />
                  </div>

                  <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Đường dẫn liên kết</label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={editForm.link || ''}
                        onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                      />
                      <button className="absolute right-2 text-gray-400 hover:text-[#14A64A]" title="Kiểm tra xem liên kết này có hoạt động hay không">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      value={editForm.startDate || ''}
                      onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                      className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      value={editForm.endDate || ''}
                      onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                      className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 pt-0 w-20">
                  <label className="text-sm font-medium text-transparent select-none">Actions</label>
                  <div className="h-9 flex items-center justify-center gap-2">
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-4 items-center">
                {saveError && <span className="text-sm text-red-500 mr-2">{saveError}</span>}
                <button 
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-white border border-[#BCE3CD] text-[#3B6E4B] rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <div className="relative group">
                  <button 
                    onClick={handleSave}
                    disabled={isCodeEmpty}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${isCodeEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#14A64A] hover:bg-[#108a3d]'}`}
                  >
                    Lưu
                  </button>
                  {isCodeEmpty && (
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
                      Cần điền Mã sự kiện để có thể lưu
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List of Events */}
          {events.map((event, index) => {
            const isEditing = editingId === event.id;
            const isFocusedMode = isAdding || editingId !== null;
            const isDimmed = isFocusedMode && !isEditing;

            return (
              <div 
                key={event.id} 
                className={`bg-white rounded-lg p-5 transition-all duration-300 ${isEditing ? 'border-2 border-[#14A64A] shadow-md' : 'border border-[#BCE3CD]'} ${isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-8">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(event.id)}
                      onChange={() => handleSelect(event.id)}
                      disabled={isFocusedMode}
                      className="w-4 h-4 text-[#14A64A] rounded border-gray-300 focus:ring-[#14A64A] disabled:opacity-50" 
                    />
                  </div>
                  <div className="pt-8 text-[#3B6E4B] font-medium w-6 text-center">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Mã sự kiện</label>
                      {isEditing ? (
                        <>
                          <input 
                            ref={codeInputRef}
                            type="text" 
                            value={editForm.code || ''}
                            onChange={(e) => {
                              setEditForm({...editForm, code: e.target.value});
                              setCodeError('');
                              setSaveError('');
                            }}
                            className={`border rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A] ${isCodeEmpty || codeError ? 'border-red-500' : 'border-gray-300'} ${isShaking ? 'animate-shake' : ''}`}
                          />
                          {isCodeEmpty && <span className="text-xs text-red-500">Mã không được để trống</span>}
                          {codeError && <span className="text-xs text-red-500">{codeError}</span>}
                          {isCodeChanged && !isCodeEmpty && !codeError && (
                            <span className="text-xs text-orange-500">Lưu ý thật kỹ khi thay đổi thông tin này để tránh sai lệch dữ liệu</span>
                          )}
                        </>
                      ) : (
                        <div className="p-2 text-sm text-gray-800 bg-gray-50 rounded-md border border-transparent h-[38px] flex items-center">
                          {event.code}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-3 flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Tên sự kiện</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                        />
                      ) : (
                        <div className="p-2 text-sm text-gray-800 bg-gray-50 rounded-md border border-transparent h-[38px] flex items-center truncate" title={event.name}>
                          {event.name}
                        </div>
                      )}
                    </div>

                    <div className="col-span-3 flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Đường dẫn liên kết</label>
                      {isEditing ? (
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={editForm.link || ''}
                            onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                            className="w-full border border-gray-300 rounded-md p-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                          />
                          <button className="absolute right-2 text-gray-400 hover:text-[#14A64A]" title="Kiểm tra xem liên kết này có hoạt động hay không">
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <div className="w-full p-2 pr-8 text-sm text-blue-600 hover:underline bg-gray-50 rounded-md border border-transparent h-[38px] flex items-center truncate" title={event.link}>
                            <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a>
                          </div>
                          <button className="absolute right-2 text-gray-400 hover:text-[#14A64A]" title="Kiểm tra xem liên kết này có hoạt động hay không">
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                          className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                        />
                      ) : (
                        <div className="p-2 text-sm text-gray-800 bg-gray-50 rounded-md border border-transparent h-[38px] flex items-center">
                          {event.startDate}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          value={editForm.endDate || ''}
                          onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                          className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#14A64A]"
                        />
                      ) : (
                        <div className="p-2 text-sm text-gray-800 bg-gray-50 rounded-md border border-transparent h-[38px] flex items-center">
                          {event.endDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-0 w-20">
                    <label className="text-sm font-medium text-transparent select-none">Actions</label>
                    <div className="h-9 flex items-center justify-center gap-2">
                      {!isEditing && (
                        <>
                          <button 
                            onClick={() => startEdit(event)}
                            className="p-1.5 text-gray-500 hover:text-[#14A64A] hover:bg-green-50 rounded-md transition-colors"
                            title="Chỉnh sửa thông tin dòng này"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 text-gray-500 hover:text-[#14A64A] hover:bg-green-50 rounded-md transition-colors"
                            title="Kiểm tra hiệu lực đường dẫn"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions for Editing Row */}
                {isEditing && (
                  <div className="flex justify-end gap-3 mt-4 items-center">
                    {saveError && <span className="text-sm text-red-500 mr-2">{saveError}</span>}
                    <button 
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-white border border-[#BCE3CD] text-[#3B6E4B] rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <div className="relative group">
                      <button 
                        onClick={handleSave}
                        disabled={isCodeEmpty}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${isCodeEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#14A64A] hover:bg-[#108a3d]'}`}
                      >
                        Lưu
                      </button>
                      {isCodeEmpty && (
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
                          Cần điền Mã sự kiện để có thể lưu
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
