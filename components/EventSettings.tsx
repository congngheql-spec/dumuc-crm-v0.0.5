import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit2, Link as LinkIcon, Search, X, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { EventItem } from './EventsModule';

const buildAiTelesalesTemplates = (campaignName: string, campaignCode: string) => {
  const title = campaignName?.trim() || 'Chiến dịch Chăm sóc & Bảo dưỡng Xe';
  const code = campaignCode?.trim() || 'CD-GARAGE';

  return [
    {
      campaignGoal: `• Chuyển đổi tối thiểu 35% danh sách khách hàng quan tâm từ chiến dịch "${title}" (${code}) thành lịch hẹn đến xưởng.\n• Tư vấn và chốt lịch kiểm tra an toàn tổng quát kết hợp bảo dưỡng định kỳ trước các kỳ nghỉ / cao điểm di chuyển.\n• Thu thập chính xác tình trạng xe hiện tại (số ODO, dòng xe, nhu cầu phát sinh) để bộ phận Cố vấn dịch vụ chuẩn bị trước phụ tùng và khoang sửa chữa.`,
      campaignKeywords: `• Từ khóa trọng tâm: "Kiểm tra an toàn miễn phí 18 hạng mục", "Ưu đãi đặt lịch trước qua chiến dịch ${code}", "Không phải chờ đợi khoang dịch vụ", "Báo giá minh bạch trước khi làm".\n• Thông điệp cốt lõi: Chủ động bảo dưỡng định kỳ giúp xe vận hành êm ái, tiết kiệm nhiên liệu và giữ trọn giá trị xe lâu dài.`,
      newCustomerScript: `1. Chào hỏi & Xác nhận:\n"Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] gọi từ Bộ phận Chăm sóc Khách hàng Garage. Em thấy Anh/Chị có để lại thông tin quan tâm chương trình '${title}' bên em ạ."\n\n2. Khai thác nhu cầu & Trao giá trị:\n"Không biết hiện tại xe mình đang sử dụng là dòng xe gì và đã đến mốc bảo dưỡng hay đang cần kiểm tra hạng mục nào đặc biệt không ạ? Trong chiến dịch lần này, khách hàng mới lần đầu ghé xưởng sẽ được tặng gói Kiểm tra an toàn tổng quát 18 hạng mục hoàn toàn miễn phí kèm ưu đãi giảm trực tiếp trên hóa đơn dịch vụ ạ."\n\n3. Chốt lịch hẹn:\n"Để Anh/Chị không phải chờ đợi khi đến nơi, em xin phép giữ trước khoang dịch vụ ưu tiên cho xe mình vào sáng Thứ 7 hoặc Chủ nhật tuần này nhé ạ? Anh/Chị đi khung giờ 08:30 hay 10:00 sẽ thuận tiện hơn ạ?"`,
      existingCustomerScript: `1. Chào hỏi & Gợi nhắc lịch sử:\n"Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] từ Garage đây ạ. Lần trước xe mình có ghé xưởng làm dịch vụ, không biết thời gian qua xe vận hành có êm ái và ổn định không Anh/Chị?"\n\n2. Thông báo đặc quyền Khách hàng thân thiết:\n"Hiện tại bên em đang triển khai chương trình '${title}' (${code}) dành riêng cho khách hàng đã từng sử dụng dịch vụ tại xưởng. Ngoài gói kiểm tra chẩn đoán điện tử miễn phí, Anh/Chị còn được áp dụng ưu đãi cộng thêm cho khách hàng cũ khi đặt lịch bảo dưỡng định kỳ, đảo lốp và cân chỉnh thước lái ạ."\n\n3. Chốt lịch hẹn:\n"Theo lịch sử bảo dưỡng thì xe mình cũng sắp tới kỳ kiểm tra định kỳ rồi ạ. Em hỗ trợ đặt lịch trước với Kỹ thuật viên quen thuộc cho xe mình vào tuần này luôn Anh/Chị nhé?"`,
    },
    {
      campaignGoal: `• Tối ưu tỷ lệ nghe máy và đặt lịch hẹn thành công đạt trên 40% cho chiến dịch "${title}" (${code}).\n• Gia tăng doanh thu dịch vụ chăm sóc xe chuyên sâu (Bảo dưỡng định kỳ, Cân mâm, Đảo lốp, Căn chỉnh thước lái, Chẩn đoán tổng quát).\n• Xác thực thông tin phương tiện và nhắc hẹn tự động qua Zalo/Email ngay sau khi khách đồng ý khung giờ đến Garage.`,
      campaignKeywords: `• Từ khóa trọng tâm: "Chẩn đoán công nghệ cao", "Phụ tùng chính hãng 100%", "Giữ chỗ ưu tiên - Nhận xe ngay trong ngày", "Bảo hành dịch vụ rõ ràng".\n• Thông điệp cốt lõi: Chăm sóc xe đúng chuẩn kỹ thuật bởi đội ngũ Kỹ thuật viên giàu kinh nghiệm — An tâm trên mọi hành trình.`,
      newCustomerScript: `1. Mở lời ấn tượng:\n"Dạ xin chào Anh/Chị [Tên KH], em gọi từ Trung tâm Dịch vụ Garage. Em liên hệ để gửi tặng Anh/Chị suất ưu đãi trải nghiệm dịch vụ thuộc chương trình '${title}' mà Anh/Chị vừa đăng ký quan tâm ạ."\n\n2. Tư vấn theo nhu cầu thực tế:\n"Dạ đối với khách hàng mới lần đầu đến Garage, bên em hỗ trợ kiểm tra tổng quát hệ thống phanh, gầm, lốp và ắc-quy hoàn toàn miễn phí bằng máy chẩn đoán chuyên dụng. Hiện tại xe Anh/Chị có dấu hiệu nào cần kỹ thuật trưởng bên em kiểm tra kỹ hơn không ạ?"\n\n3. Đề xuất khung giờ & Xác nhận:\n"Em xin phép lên mã ưu đãi '${code}' theo biển số xe của Anh/Chị và đặt lịch đón tiếp vào khung giờ vắng khách nhất để mình không phải đợi lâu nhé ạ. Anh/Chị ghé vào trong tuần hay cuối tuần sẽ tiện hơn ạ?"`,
      existingCustomerScript: `1. Chào hỏi thân tình:\n"Dạ em chào Anh/Chị [Tên KH], rất vui được kết nối lại với Anh/Chị từ Garage ạ! Nhân dịp bên em khởi động chương trình '${title}', em gọi điện hỏi thăm tình hình xe của mình đồng thời gửi quà tri ân khách hàng cũ ạ."\n\n2. Giới thiệu quyền lợi nâng cấp:\n"Trong đợt ưu đãi '${code}' này, khách hàng thân thiết của Garage được ưu tiên kiểm tra miễn phí thước lái, độ mòn lốp và giảm giá trực tiếp gói bảo dưỡng cấp định kỳ. Nếu Anh/Chị đi cùng xe thứ 2 trong gia đình cũng được hưởng nguyên quyền lợi này luôn ạ."\n\n3. Chốt lịch đón tiếp:\n"Em đặt lịch giữ khoang dịch vụ và gửi xác nhận qua Zalo cho Anh/Chị ngay bây giờ nhé ạ. Tuần này Anh/Chị ghé buổi sáng hay buổi chiều để em báo Cố vấn dịch vụ chuẩn bị đón tiếp chu đáo ạ?"`,
    },
    {
      campaignGoal: `• Tiếp cận 100% khách hàng đăng ký từ chiến dịch "${title}" (${code}) trong vòng 2 giờ kể từ khi phát sinh dữ liệu.\n• Đẩy mạnh dịch vụ mũi nhọn: Bảo dưỡng định kỳ các cấp, Kiểm tra hệ thống an toàn, Vệ sinh & Chăm sóc xe toàn diện.\n• Giảm tỷ lệ khách bỏ hẹn (No-show) xuống dưới 10% thông qua kịch bản xác nhận nhu cầu rõ ràng và gửi lịch hẹn đa kênh.`,
      campaignKeywords: `• Từ khóa trọng tâm: "Tiết kiệm chi phí bảo dưỡng", "Đội ngũ Cố vấn tận tâm", "Quy trình chuẩn hãng", "Ưu đãi độc quyền mã ${code}".\n• Thông điệp cốt lõi: Đặt lịch chỉ 1 phút — Trải nghiệm dịch vụ chăm sóc xe chuyên nghiệp, nhanh chóng và minh bạch tuyệt đối.`,
      newCustomerScript: `1. Chào hỏi & Xác thực thông tin:\n"Dạ chào Anh/Chị [Tên KH], em là [Tên TVV] phụ trách hỗ trợ khách hàng chiến dịch '${title}' tại Garage. Em gọi để xác nhận quyền lợi ưu đãi dành cho xe của mình ạ."\n\n2. Khơi gợi nhu cầu & Giải đáp:\n"Khi đặt lịch trước qua chương trình này, Anh/Chị được ưu tiên khu vực tiếp nhận riêng, miễn phí công kiểm tra chẩn đoán tổng quát và nhận báo giá chi tiết từng hạng mục trước khi thực hiện. Hiện Anh/Chị đang quan tâm nhất đến bảo dưỡng định kỳ hay kiểm tra gầm - lốp ạ?"\n\n3. Chốt lịch & Cam kết:\n"Dạ vậy em xin phép ghi nhận lịch hẹn cho xe mình vào ngày [Ngày hẹn] lúc [Khung giờ]. Ngay sau cuộc gọi này em sẽ gửi tin nhắn xác nhận kèm vị trí Google Maps của xưởng qua Zalo để Anh/Chị tiện di chuyển nhé ạ!"`,
      existingCustomerScript: `1. Chào hỏi & Kết nối lại:\n"Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] gọi từ bộ phận Chăm sóc Khách hàng Garage nơi Anh/Chị từng bảo dưỡng xe ạ. Hôm nay bên em có chương trình ưu đãi đặc biệt '${title}' nên em liên hệ ngay để thông báo tới Anh/Chị."\n\n2. Tư vấn cá nhân hóa theo lịch sử xe:\n"Dựa trên chu kỳ vận hành từ lần ghé xưởng gần nhất, thời điểm này rất phù hợp để mình kiểm tra lại dầu máy, hệ thống phanh và đảo lốp định kỳ. Khi tham gia theo mã chiến dịch '${code}', Anh/Chị được tặng kèm gói vệ sinh khoang máy / khử khuẩn nội thất miễn phí ạ."\n\n3. Chốt lịch hẹn nhanh:\n"Anh/Chị dự kiến ghé xưởng vào ngày nào trong tuần này để em sắp xếp trước Cố vấn dịch vụ và khoang làm việc ưu tiên cho xe mình luôn ạ?"`,
    },
  ];
};

export const EventSettings: React.FC<{ 
  onClose: () => void;
  events: EventItem[];
  onEventsChange: (events: EventItem[]) => void;
  entityLabel?: string;
}> = ({ onClose, events, onEventsChange, entityLabel = 'sự kiện' }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EventItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  
  const [codeError, setCodeError] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [showIllustrationModal, setShowIllustrationModal] = useState(false);
  const [aiTemplateIndex, setAiTemplateIndex] = useState<number>(0);
  
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
    if (entityLabel === 'chiến dịch') {
      const defaultTpl = buildAiTelesalesTemplates(event.name, event.code)[0];
      setEditForm({
        ...event,
        campaignGoal: event.campaignGoal ?? defaultTpl.campaignGoal,
        campaignKeywords: event.campaignKeywords ?? defaultTpl.campaignKeywords,
        newCustomerScript: event.newCustomerScript ?? defaultTpl.newCustomerScript,
        existingCustomerScript: event.existingCustomerScript ?? defaultTpl.existingCustomerScript,
      });
      setAiTemplateIndex(0);
    } else {
      setEditForm(event);
    }
    setIsAdding(false);
    setCodeError('');
    setSaveError('');
  };

  const handleRefreshAiContent = () => {
    const templates = buildAiTelesalesTemplates(
      editForm.name || '',
      editForm.code || ''
    );
    const nextIdx = (aiTemplateIndex + 1) % templates.length;
    const selected = templates[nextIdx];
    setAiTemplateIndex(nextIdx);
    setEditForm(prev => ({
      ...prev,
      campaignGoal: selected.campaignGoal,
      campaignKeywords: selected.campaignKeywords,
      newCustomerScript: selected.newCustomerScript,
      existingCustomerScript: selected.existingCustomerScript,
    }));
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
      setCodeError(`Mã ${entityLabel} này đã tồn tại trong danh sách, vui lòng tạo mã ${entityLabel} khác`);
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
            <Plus className="w-4 h-4" /> Thêm {entityLabel}
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
          <h1 className="text-xl font-bold text-gray-800">Quản lý danh sách {entityLabel}</h1>
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
                    <label className="text-sm font-medium text-gray-700">Mã {entityLabel}</label>
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
                    <label className="text-sm font-medium text-gray-700">Tên {entityLabel}</label>
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
                      Cần điền Mã {entityLabel} để có thể lưu
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
                      <label className="text-sm font-medium text-gray-700">Mã {entityLabel}</label>
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
                      <label className="text-sm font-medium text-gray-700">Tên {entityLabel}</label>
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
                            title="Chỉnh sửa thông tin"
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

                {/* Khu vực: Thông tin chiến dịch dành cho Telesales (chỉ hiển thị khi chỉnh sửa chiến dịch) */}
                {isEditing && entityLabel === 'chiến dịch' && (
                  <div className="mt-5 pt-5 border-t border-gray-200 pl-14 pr-24">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-gray-800">
                          Thông tin chiến dịch dành cho Telesales
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowIllustrationModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Minh họa
                          </button>
                          <button
                            type="button"
                            onClick={handleRefreshAiContent}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            A.I - Hoàn thiện nội dung dưới
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Field 1: Mục tiêu chiến dịch */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Mục tiêu chiến dịch
                        </label>
                        <textarea
                          rows={4}
                          value={editForm.campaignGoal || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, campaignGoal: e.target.value })
                          }
                          placeholder="Nhập mục tiêu chiến dịch dành cho Telesales..."
                          className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] resize-y"
                        />
                      </div>

                      {/* Field 2: Từ khóa & Thông điệp trọng tâm */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Từ khóa &amp; Thông điệp trọng tâm
                        </label>
                        <textarea
                          rows={4}
                          value={editForm.campaignKeywords || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, campaignKeywords: e.target.value })
                          }
                          placeholder="Nhập từ khóa & thông điệp trọng tâm..."
                          className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] resize-y"
                        />
                      </div>

                      {/* Field 3: Kịch bản gọi chi tiết (Khách hàng mới) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Kịch bản gọi chi tiết (Khách hàng mới)
                        </label>
                        <textarea
                          rows={7}
                          value={editForm.newCustomerScript || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, newCustomerScript: e.target.value })
                          }
                          placeholder="Nhập kịch bản gọi chi tiết dành cho khách hàng mới..."
                          className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] resize-y"
                        />
                      </div>

                      {/* Field 4: Kịch bản gọi chi tiết (Khách hàng cũ) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Kịch bản gọi chi tiết (Khách hàng cũ)
                        </label>
                        <textarea
                          rows={7}
                          value={editForm.existingCustomerScript || ''}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              existingCustomerScript: e.target.value,
                            })
                          }
                          placeholder="Nhập kịch bản gọi chi tiết dành cho khách hàng cũ..."
                          className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-[#14A64A] focus:border-[#14A64A] resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                          Cần điền Mã {entityLabel} để có thể lưu
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

      {/* Pop-up Minh họa chi tiết 4 field */}
      {showIllustrationModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowIllustrationModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center shadow-xs shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Ví dụ minh họa chi tiết: Thông tin chiến dịch dành cho Telesales
                  </h2>
                  <p className="text-xs text-gray-500">
                    Mẫu tham khảo đầy đủ cho 4 trường thông tin hướng dẫn Telesales triển khai chiến dịch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIllustrationModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 bg-gray-50/40">
              <div className="grid grid-cols-2 gap-4">
                {/* Ví dụ Field 1 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-[#1A73E8] rounded text-xs font-bold">
                      Field 1
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Mục tiêu chiến dịch
                    </h4>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p>
                      <strong>• Mục tiêu chuyển đổi:</strong> Liên hệ 100% khách hàng để lại thông tin trong vòng 2 giờ; đặt lịch hẹn thành công tối thiểu 35% – 45% khách hàng đến xưởng.
                    </p>
                    <p>
                      <strong>• Dịch vụ trọng tâm:</strong> Bảo dưỡng định kỳ các cấp (5.000km – 40.000km), cân mâm bấm chì, đảo lốp, căn chỉnh thước lái công nghệ 3D và chẩn đoán tổng quát hệ thống điều hòa/phanh.
                    </p>
                    <p>
                      <strong>• Yêu cầu thông tin cần thu thập:</strong> Xác nhận chính xác Biển số xe, Dòng xe, Số ODO hiện tại, triệu chứng bất thường của xe và khung giờ khách có thể đưa xe đến Garage.
                    </p>
                  </div>
                </div>

                {/* Ví dụ Field 2 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                      Field 2
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Từ khóa &amp; Thông điệp trọng tâm
                    </h4>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p>
                      <strong>• Cụm từ khóa neo giá trị:</strong> &quot;Miễn phí 100% kiểm tra an toàn 18 hạng mục&quot;, &quot;Giữ khoang dịch vụ ưu tiên – Không chờ đợi&quot;, &quot;Báo giá minh bạch trước khi sửa chữa&quot;, &quot;Phụ tùng chính hãng bảo hành dài hạn&quot;.
                    </p>
                    <p>
                      <strong>• Thông điệp xuyên suốt:</strong> Chủ động kiểm tra và bảo dưỡng xe định kỳ giúp phát hiện sớm hư hỏng tiềm ẩn, tiết kiệm tới 40% chi phí sửa chữa lớn và đảm bảo an toàn tuyệt đối cho cả gia đình.
                    </p>
                    <p>
                      <strong>• Ưu đãi thúc đẩy chốt lịch:</strong> Tặng ngay gói khử khuẩn nội thất / châm nước rửa kính miễn phí cho khách đặt lịch hẹn trước qua điện thoại.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Ví dụ Field 3 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-bold">
                      Field 3
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Kịch bản gọi chi tiết (Khách hàng mới)
                    </h4>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p>
                      <strong>Bước 1 – Chào hỏi &amp; Xác nhận đăng ký (15 giây):</strong><br />
                      &quot;Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] gọi từ Bộ phận Chăm sóc Khách hàng Garage. Em thấy mình vừa đăng ký nhận ưu đãi tại chương trình [Tên Chiến Dịch] bên em nên em gọi hỗ trợ kích hoạt quyền lợi cho xe mình ạ.&quot;
                    </p>
                    <p>
                      <strong>Bước 2 – Khai thác tình trạng xe &amp; Nêu quyền lợi (30 giây):</strong><br />
                      &quot;Dạ hiện tại Anh/Chị đang đi dòng xe gì và xe mình đang cần bảo dưỡng định kỳ hay kiểm tra hạng mục nào ạ? Khi lần đầu ghé Garage qua chương trình này, Anh/Chị được tặng gói Kiểm tra an toàn tổng quát 18 hạng mục bằng máy chẩn đoán chuyên sâu hoàn toàn miễn phí và giảm 15% tổng chi phí bảo dưỡng ạ.&quot;
                    </p>
                    <p>
                      <strong>Bước 3 – Xử lý băn khoăn &amp; Chốt khung giờ hẹn (30 giây):</strong><br />
                      &quot;Để khi Anh/Chị đưa xe tới được ưu tiên vào khoang kỹ thuật ngay mà không phải chờ đợi, em xin phép đặt lịch trước cho biển số xe của mình vào sáng Thứ 7 (08:00 - 10:00) hoặc chiều Thứ 7 (14:00 - 16:00) tuần này nhé ạ? Ngay sau cuộc gọi em sẽ gửi tin nhắn Zalo xác nhận kèm định vị Google Maps của xưởng cho Anh/Chị ạ.&quot;
                    </p>
                  </div>
                </div>

                {/* Ví dụ Field 4 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-bold">
                      Field 4
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Kịch bản gọi chi tiết (Khách hàng cũ)
                    </h4>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p>
                      <strong>Bước 1 – Chào hỏi thân thiết &amp; Hỏi thăm sau dịch vụ (15 giây):</strong><br />
                      &quot;Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] từ Garage nơi Anh/Chị đã từng làm dịch vụ cho xe [Biển số / Dòng xe] ạ. Thời gian vừa qua xe mình di chuyển có êm ái và ổn định không Anh/Chị?&quot;
                    </p>
                    <p>
                      <strong>Bước 2 – Cá nhân hóa theo lịch sử &amp; Trao đặc quyền tri ân (30 giây):</strong><br />
                      &quot;Dạ theo lịch sử bảo dưỡng tại xưởng thì xe mình cũng sắp đến mốc kiểm tra định kỳ tiếp theo rồi ạ. Nhân dịp bên em triển khai chiến dịch [Tên Chiến Dịch], Garage dành tặng riêng khách hàng thân thiết suất miễn phí cân chỉnh thước lái / đảo lốp và ưu đãi giảm trực tiếp 20% công bảo dưỡng định kỳ ạ.&quot;
                    </p>
                    <p>
                      <strong>Bước 3 – Chốt lịch hẹn cùng Kỹ thuật viên quen thuộc (25 giây):</strong><br />
                      &quot;Em hỗ trợ giữ lịch trước với Cố vấn dịch vụ và Kỹ thuật viên quen thuộc cho xe mình vào tuần này luôn Anh/Chị nhé? Anh/Chị ghé khung giờ 08:30 sáng hay 14:00 chiều sẽ thuận tiện công việc của mình hơn ạ?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowIllustrationModal(false)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
      
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

