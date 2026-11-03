import React, { useState } from 'react';
import { Filter, X, Inbox, CheckCircle, XCircle, Eye, Clock, FileText, Download } from 'lucide-react';

export interface RegistrationHistory {
  id: string;
  action: 'Mới tạo' | 'Từ chối' | 'Chấp nhận';
  timestamp: string;
  executor: string;
  reason?: string;
}

export interface RegistrationFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface RegistrationItem {
  id: string;
  taxCode: string;
  companyName: string;
  headquartersAddress: string;
  phone: string;
  contactPerson: string;
  licenseNumber: string;
  issueDate: string;
  issuePlace: string;
  status: 'Mới tạo' | 'Từ chối' | 'Chấp nhận';
  files: RegistrationFile[];
  history: RegistrationHistory[];
}

const MOCK_REGISTRATIONS: RegistrationItem[] = [
  {
    id: '1',
    taxCode: '0312345678',
    companyName: 'Công ty TNHH Auto Care Pro',
    headquartersAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    phone: '0909123456',
    contactPerson: 'Nguyễn Văn An',
    licenseNumber: 'GP-00123',
    issueDate: '15/05/2023',
    issuePlace: 'Sở KHĐT TP.HCM',
    status: 'Mới tạo',
    files: [
      { id: 'f1', name: 'GiayPhepKinhDoanh.pdf', url: '#', type: 'application/pdf' },
      { id: 'f2', name: 'CanCuocCongDan_MatTruoc.jpg', url: '#', type: 'image/jpeg' }
    ],
    history: [
      { id: 'h1', action: 'Mới tạo', timestamp: '01/06/2024 08:30', executor: 'Hệ thống' }
    ]
  },
  {
    id: '2',
    taxCode: '0108765432',
    companyName: 'Công ty Cổ phần Parts VN',
    headquartersAddress: '456 Lê Lợi, Hoàn Kiếm, Hà Nội',
    phone: '0987654321',
    contactPerson: 'Trần Thị B',
    licenseNumber: 'GP-00456',
    issueDate: '20/08/2022',
    issuePlace: 'Sở KHĐT Hà Nội',
    status: 'Chấp nhận',
    files: [
      { id: 'f3', name: 'GPKD_PartsVN.pdf', url: '#', type: 'application/pdf' }
    ],
    history: [
      { id: 'h2', action: 'Mới tạo', timestamp: '10/07/2024 09:15', executor: 'Hệ thống' },
      { id: 'h3', action: 'Chấp nhận', timestamp: '11/07/2024 14:20', executor: 'quych@pbsofu.vn', reason: 'Hồ sơ đầy đủ, hợp lệ' }
    ]
  },
  {
    id: '3',
    taxCode: '0405678901',
    companyName: 'Gara Dũng Lốp',
    headquartersAddress: '789 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    phone: '0912345678',
    contactPerson: 'Phạm Minh D',
    licenseNumber: 'GP-00789',
    issueDate: '01/12/2023',
    issuePlace: 'Sở KHĐT Đà Nẵng',
    status: 'Từ chối',
    files: [
      { id: 'f4', name: 'GiayPhep.png', url: '#', type: 'image/png' }
    ],
    history: [
      { id: 'h4', action: 'Mới tạo', timestamp: '25/07/2024 10:00', executor: 'Hệ thống' },
      { id: 'h5', action: 'Từ chối', timestamp: '26/07/2024 09:45', executor: 'quych@pbsofu.vn', reason: 'Thiếu CMND/CCCD người đại diện pháp luật' }
    ]
  }
];

export const RegistrationApprovalModule: React.FC = () => {
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  
  // Filters
  const [filterTaxCode, setFilterTaxCode] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    taxCode: '',
    phone: '',
    status: 'Tất cả',
  });

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'info' | 'history'>('info');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RegistrationItem | null>(null);
  const [actionType, setActionType] = useState<'Chấp nhận' | 'Từ chối' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const handleApplyFilter = () => {
    setAppliedFilters({
      taxCode: filterTaxCode,
      phone: filterPhone,
      status: filterStatus,
    });
  };

  const handleClearFilter = () => {
    setFilterTaxCode('');
    setFilterPhone('');
    setFilterStatus('Tất cả');
    setAppliedFilters({
      taxCode: '',
      phone: '',
      status: 'Tất cả',
    });
  };

  const filteredData = registrations.filter((item) => {
    if (appliedFilters.taxCode && !item.taxCode.includes(appliedFilters.taxCode)) return false;
    if (appliedFilters.phone && !item.phone.includes(appliedFilters.phone)) return false;
    if (appliedFilters.status !== 'Tất cả' && item.status !== appliedFilters.status) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mới tạo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Chấp nhận': return 'bg-green-100 text-green-800 border-green-200';
      case 'Từ chối': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleActionSubmit = () => {
    if (!selectedRecord || !actionType) return;
    
    setRegistrations(registrations.map(reg => {
      if (reg.id === selectedRecord.id) {
        return {
          ...reg,
          status: actionType,
          history: [
            ...reg.history,
            {
              id: Date.now().toString(),
              action: actionType,
              timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
              executor: 'quych@pbsofu.vn',
              reason: actionReason
            }
          ]
        };
      }
      return reg;
    }));
    
    setActionModalOpen(false);
    setActionReason('');
    setSelectedRecord({
        ...selectedRecord,
        status: actionType,
        history: [
          ...selectedRecord.history,
          {
            id: Date.now().toString(),
            action: actionType,
            timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
            executor: 'quych@pbsofu.vn',
            reason: actionReason
          }
        ]
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Xét duyệt Đăng ký sàn</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và xét duyệt các yêu cầu đăng ký tham gia sàn của Garage và Nhà cung cấp</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px] max-w-[250px]">
            <label className="block text-xs font-medium text-gray-600">Mã số thuế (MST)</label>
            <input 
              type="text" 
              placeholder="Nhập MST..." 
              value={filterTaxCode}
              onChange={(e) => setFilterTaxCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]" 
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px] max-w-[250px]">
            <label className="block text-xs font-medium text-gray-600">Số điện thoại</label>
            <input 
              type="text" 
              placeholder="Nhập số điện thoại..." 
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]" 
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <label className="block text-xs font-medium text-gray-600">Tình trạng xét duyệt</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] bg-white cursor-pointer"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Mới tạo">Mới tạo</option>
              <option value="Chấp nhận">Chấp nhận</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleApplyFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4" /> Lọc
            </button>
            <button 
              onClick={handleClearFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <X className="w-4 h-4" /> Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">STT</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MST</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên công ty</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Địa chỉ trụ sở</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Người liên hệ</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số GP</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày cấp</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nơi cấp</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tình trạng</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center sticky right-0 bg-gray-50 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{index + 1}</td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-800">{row.taxCode}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#1A73E8] cursor-pointer hover:underline" onClick={() => {
                        setSelectedRecord(row);
                        setDetailsModalOpen(true);
                      }}>{row.companyName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600 truncate max-w-[200px]" title={row.headquartersAddress}>
                        {row.headquartersAddress}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.contactPerson}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.licenseNumber}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.issueDate}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[150px]" title={row.issuePlace}>{row.issuePlace}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center sticky right-0 bg-white group-hover:bg-blue-50/30 shadow-[-4px_0_10px_rgba(0,0,0,0.02)] transition-colors">
                      <div className="flex items-center justify-center gap-1.5 transition-opacity">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors tooltip-trigger relative" 
                          title="Xem chi tiết dữ liệu"
                          onClick={() => {
                            setSelectedRecord(row);
                            setDetailsTab('info');
                            setDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {row.status === 'Mới tạo' && (
                          <>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <button 
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors tooltip-trigger relative" 
                              title="Chấp nhận"
                              onClick={() => {
                                setSelectedRecord(row);
                                setActionType('Chấp nhận');
                                setActionModalOpen(true);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors tooltip-trigger relative" 
                              title="Từ chối"
                              onClick={() => {
                                setSelectedRecord(row);
                                setActionType('Từ chối');
                                setActionModalOpen(true);
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Inbox className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-900">Không tìm thấy yêu cầu đăng ký nào</p>
                      <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Chi tiết đăng ký</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedRecord.companyName}</p>
              </div>
              <button 
                onClick={() => setDetailsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex border-b border-gray-200 px-6 bg-gray-50/50">
              <button 
                className={`pb-3 pt-4 px-4 text-sm font-medium border-b-2 transition-colors ${detailsTab === 'info' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setDetailsTab('info')}
              >
                Chi tiết dữ liệu
              </button>
              <button 
                className={`pb-3 pt-4 px-4 text-sm font-medium border-b-2 transition-colors ${detailsTab === 'history' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setDetailsTab('history')}
              >
                Lịch sử xét duyệt
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {detailsTab === 'info' ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">Thông tin chung</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Mã số thuế</div>
                      <div className="text-sm font-medium text-gray-900">{selectedRecord.taxCode}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Tên công ty / Garage</div>
                      <div className="text-sm font-medium text-gray-900">{selectedRecord.companyName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Địa chỉ trụ sở</div>
                      <div className="text-sm text-gray-900 leading-snug">{selectedRecord.headquartersAddress}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Người liên hệ</div>
                        <div className="text-sm text-gray-900">{selectedRecord.contactPerson}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Số điện thoại</div>
                        <div className="text-sm text-gray-900">{selectedRecord.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">Giấy phép đăng ký kinh doanh</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Số giấy phép</div>
                      <div className="text-sm font-medium text-[#1A73E8]">{selectedRecord.licenseNumber}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Ngày cấp</div>
                        <div className="text-sm text-gray-900">{selectedRecord.issueDate}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1 leading-none">Nơi cấp</div>
                        <div className="text-sm text-gray-900">{selectedRecord.issuePlace}</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 mt-8 uppercase tracking-wider">Tài liệu đính kèm</h3>
                  {selectedRecord.files && selectedRecord.files.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecord.files.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              {file.type.includes('pdf') ? <FileText className="w-4 h-4" /> : <img src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`} alt="icon" className="text-blue-600 w-4 h-4" />}
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                            </div>
                          </div>
                          <button className="p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-[#1A73E8] hover:bg-blue-100 rounded transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic py-2">Không có tài liệu đính kèm.</div>
                  )}
                </div>
              </div>
              ) : (
                <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4 space-y-6 pb-4">
                  {selectedRecord.history.map((event, index) => (
                    <div key={event.id} className="relative pl-6 sm:pl-8">
                      {/* Timeline dot */}
                      <div className={`absolute top-1.5 left-[-9px] w-4 h-4 rounded-full border-2 border-white ring-2 ring-gray-100 ${
                        event.action === 'Mới tạo' ? 'bg-blue-500' :
                        event.action === 'Chấp nhận' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      
                      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                           <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(event.action)}`}>
                            {event.action}
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {event.timestamp}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium text-gray-800">Người thực hiện:</span> {event.executor}
                        </div>
                        {event.reason && (
                          <div className="mt-3 text-sm bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">
                            <span className="font-semibold text-gray-800 block mb-1">Ghi chú / Nguyên nhân:</span>
                            {event.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              {selectedRecord.status === 'Mới tạo' ? (
                <>
                  <button 
                    onClick={() => {
                      setDetailsModalOpen(false);
                      setActionType('Từ chối');
                      setActionModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg transition-colors"
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={() => {
                      setDetailsModalOpen(false);
                      setActionType('Chấp nhận');
                      setActionModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Chấp nhận
                  </button>
                </>
              ) : (
                 <button 
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Approve/Reject) */}
      {actionModalOpen && selectedRecord && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${actionType === 'Chấp nhận' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {actionType === 'Chấp nhận' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-gray-800">Xác nhận {actionType.toLowerCase()}</h3>
              </div>
              <button onClick={() => setActionModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Bạn đang thực hiện xét duyệt <span className="font-bold text-gray-800">{actionType}</span> cho đăng ký của công ty:
                <br />
                <span className="font-semibold text-[#1A73E8] mt-1 block">{selectedRecord.companyName}</span>
              </p>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú nội bộ / Kèm nguyên nhân (nếu có) {actionType === 'Từ chối' && <span className="text-red-500">*</span>}
                </label>
                <textarea 
                  rows={4}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Nhập ${actionType === 'Từ chối' ? 'nguyên nhân từ chối...' : 'ghi chú thêm (không bắt buộc)...'}`}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-none"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setActionModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleActionSubmit}
                disabled={actionType === 'Từ chối' && !actionReason.trim()}
                className={`flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'Chấp nhận' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'Chấp nhận' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
