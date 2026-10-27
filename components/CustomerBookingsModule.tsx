import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  X,
  AlertTriangle,
} from 'lucide-react';

export type BookingSourceType =
  | 'Hotline'
  | 'Module Khách hàng tiềm năng'
  | 'Mobile App';
export type BookingStatusType =
  | 'Chờ xe tới'
  | 'Xe đã tới'
  | 'Hoàn thành'
  | 'Bỏ hẹn';

export interface CustomerBookingRecord {
  id: string;
  bookingCode: string;
  licensePlate: string;
  carModel: string;
  customerName: string;
  phone: string;
  appointmentDate: string;
  appointmentTimeSlot: string;
  serviceRequest: string;
  suggestedServices: string[];
  advisorName: string;
  source: BookingSourceType;
  sourceCode: string;
  campaignOrNote: string;
  status: BookingStatusType;
}

const INITIAL_CUSTOMER_BOOKINGS: CustomerBookingRecord[] = [
  {
    id: 'cb-1',
    bookingCode: 'LH-241027-01',
    licensePlate: '51K-889.21',
    carModel: 'Mazda CX-5 2021',
    customerName: 'Phạm Hoàng Nam',
    phone: '0901 234 567',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '08:30 - 09:30',
    serviceRequest: 'Bảo dưỡng định kỳ, Cân chỉnh thước lái',
    suggestedServices: ['Bảo dưỡng định kỳ', 'Căn chỉnh thước lái'],
    advisorName: 'Nguyễn Văn Tuấn',
    source: 'Module Khách hàng tiềm năng',
    sourceCode: 'KHTN-2024-001',
    campaignOrNote: 'Chăm sóc xe mùa hè',
    status: 'Chờ xe tới',
  },
  {
    id: 'cb-2',
    bookingCode: 'LH-241027-02',
    licensePlate: '30H-665.43',
    carModel: 'Ford Ranger 2020',
    customerName: 'Đỗ Minh Quân',
    phone: '0918 765 432',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '09:30 - 10:30',
    serviceRequest: 'Kiểm tra tiếng kêu gầm, Thay dầu máy',
    suggestedServices: ['Chẩn đoán tổng quát', 'Bảo dưỡng định kỳ'],
    advisorName: 'Trần Quốc Hùng',
    source: 'Hotline',
    sourceCode: 'Tạo thủ công',
    campaignOrNote: 'Thu Thảo',
    status: 'Chờ xe tới',
  },
  {
    id: 'cb-3',
    bookingCode: 'LH-241027-03',
    licensePlate: '51A-992.18',
    carModel: 'Mercedes C200 2019',
    customerName: 'Lê Hoàng Việt',
    phone: '0938 112 233',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '10:00 - 11:30',
    serviceRequest: 'Chẩn đoán lỗi động cơ, Rửa khoang máy',
    suggestedServices: ['Chẩn đoán tổng quát', 'Rửa xe'],
    advisorName: 'Lê Thanh Tùng',
    source: 'Mobile App',
    sourceCode: 'Khách tự đặt',
    campaignOrNote: 'Du Mục Official App',
    status: 'Xe đã tới',
  },
  {
    id: 'cb-4',
    bookingCode: 'LH-241027-04',
    licensePlate: '60A-773.12',
    carModel: 'Toyota Vios 2022',
    customerName: 'Trần Quốc Bảo',
    phone: '0979 445 566',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '14:00 - 15:00',
    serviceRequest: 'Bảo dưỡng 40.000 Km',
    suggestedServices: ['Bảo dưỡng định kỳ', 'Đảo lốp', 'Cân mâm'],
    advisorName: 'Nguyễn Văn Tuấn',
    source: 'Module Khách hàng tiềm năng',
    sourceCode: 'KHTN-2024-004',
    campaignOrNote: 'Khuyến mãi phụ tùng',
    status: 'Bỏ hẹn',
  },
  {
    id: 'cb-5',
    bookingCode: 'LH-241027-05',
    licensePlate: '51H-123.99',
    carModel: 'Hyundai SantaFe 2023',
    customerName: 'Hoàng Minh Đức',
    phone: '0932 998 877',
    appointmentDate: '28/10/2026',
    appointmentTimeSlot: '08:00 - 09:00',
    serviceRequest: 'Sơn dặm cản trước',
    suggestedServices: ['Rửa xe', 'Đồng sơn'],
    advisorName: 'Trần Quốc Hùng',
    source: 'Mobile App',
    sourceCode: 'Khách tự đặt',
    campaignOrNote: 'Du Mục Official App',
    status: 'Hoàn thành',
  },
];

const BOOKING_STATUS_OPTIONS: BookingStatusType[] = [
  'Chờ xe tới',
  'Xe đã tới',
  'Hoàn thành',
  'Bỏ hẹn',
];

const BOOKING_SOURCE_OPTIONS: BookingSourceType[] = [
  'Hotline',
  'Module Khách hàng tiềm năng',
  'Mobile App',
];

export const CustomerBookingsModule: React.FC = () => {
  const [bookings, setBookings] = useState<CustomerBookingRecord[]>(
    INITIAL_CUSTOMER_BOOKINGS
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter inputs (matching CustomersModule layout)
  const [searchInput, setSearchInput] = useState('');
  const [sourceInput, setSourceInput] = useState('Tất cả');
  const [statusInput, setStatusInput] = useState('Tất cả');

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    source: 'Tất cả',
    status: 'Tất cả',
  });

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [viewingBooking, setViewingBooking] =
    useState<CustomerBookingRecord | null>(null);
  const [editingBooking, setEditingBooking] =
    useState<CustomerBookingRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingSingleId, setDeletingSingleId] = useState<string | null>(null);

  // Form state for Add / Edit
  const [formData, setFormData] = useState<{
    bookingCode: string;
    licensePlate: string;
    carModel: string;
    customerName: string;
    phone: string;
    appointmentDate: string;
    appointmentTimeSlot: string;
    serviceRequest: string;
    suggestedServicesText: string;
    advisorName: string;
    source: BookingSourceType;
    sourceCode: string;
    campaignOrNote: string;
    status: BookingStatusType;
  }>({
    bookingCode: '',
    licensePlate: '',
    carModel: '',
    customerName: '',
    phone: '',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '08:30 - 09:30',
    serviceRequest: '',
    suggestedServicesText: '',
    advisorName: 'Nguyễn Văn Tuấn',
    source: 'Module Khách hàng tiềm năng',
    sourceCode: '',
    campaignOrNote: '',
    status: 'Chờ xe tới',
  });
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (appliedFilters.search.trim()) {
        const q = appliedFilters.search.trim().toLowerCase();
        const matchCode = b.bookingCode.toLowerCase().includes(q);
        const matchPlate = b.licensePlate.toLowerCase().includes(q);
        const matchCar = b.carModel.toLowerCase().includes(q);
        const matchName = b.customerName.toLowerCase().includes(q);
        const matchPhone = b.phone.toLowerCase().includes(q);
        const matchAdvisor = b.advisorName.toLowerCase().includes(q);
        const matchSourceCode = b.sourceCode.toLowerCase().includes(q);
        const matchCampaign = b.campaignOrNote.toLowerCase().includes(q);
        if (
          !matchCode &&
          !matchPlate &&
          !matchCar &&
          !matchName &&
          !matchPhone &&
          !matchAdvisor &&
          !matchSourceCode &&
          !matchCampaign
        ) {
          return false;
        }
      }

      if (
        appliedFilters.source !== 'Tất cả' &&
        b.source !== appliedFilters.source
      ) {
        return false;
      }

      if (
        appliedFilters.status !== 'Tất cả' &&
        b.status !== appliedFilters.status
      ) {
        return false;
      }

      return true;
    });
  }, [bookings, appliedFilters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchInput,
      source: sourceInput,
      status: statusInput,
    });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setSourceInput('Tất cả');
    setStatusInput('Tất cả');
    setAppliedFilters({
      search: '',
      source: 'Tất cả',
      status: 'Tất cả',
    });
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedBookings.map((b) => b.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextNum = String(bookings.length + 1).padStart(2, '0');
    setFormData({
      bookingCode: `LH-241027-${nextNum}`,
      licensePlate: '',
      carModel: '',
      customerName: '',
      phone: '',
      appointmentDate: '27/10/2026',
      appointmentTimeSlot: '08:30 - 09:30',
      serviceRequest: '',
      suggestedServicesText: '',
      advisorName: 'Nguyễn Văn Tuấn',
      source: 'Module Khách hàng tiềm năng',
      sourceCode: 'KHTN-2024-001',
      campaignOrNote: '',
      status: 'Chờ xe tới',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (booking: CustomerBookingRecord) => {
    setFormData({
      bookingCode: booking.bookingCode,
      licensePlate: booking.licensePlate,
      carModel: booking.carModel,
      customerName: booking.customerName,
      phone: booking.phone,
      appointmentDate: booking.appointmentDate,
      appointmentTimeSlot: booking.appointmentTimeSlot,
      serviceRequest: booking.serviceRequest,
      suggestedServicesText: booking.suggestedServices.join(', '),
      advisorName: booking.advisorName,
      source: booking.source,
      sourceCode: booking.sourceCode,
      campaignOrNote: booking.campaignOrNote,
      status: booking.status,
    });
    setFormError('');
    setEditingBooking(booking);
  };

  // Save Add / Edit
  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setFormError('Vui lòng nhập đầy đủ Họ và tên và Số điện thoại.');
      return;
    }

    const suggestedList = formData.suggestedServicesText
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    const recordData: Omit<CustomerBookingRecord, 'id'> = {
      bookingCode: formData.bookingCode,
      licensePlate: formData.licensePlate,
      carModel: formData.carModel,
      customerName: formData.customerName,
      phone: formData.phone,
      appointmentDate: formData.appointmentDate,
      appointmentTimeSlot: formData.appointmentTimeSlot,
      serviceRequest: formData.serviceRequest.trim() || 'Bảo dưỡng định kỳ',
      suggestedServices:
        suggestedList.length > 0 ? suggestedList : ['Bảo dưỡng định kỳ'],
      advisorName: formData.advisorName,
      source: formData.source,
      sourceCode: formData.sourceCode,
      campaignOrNote: formData.campaignOrNote,
      status: formData.status,
    };

    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === editingBooking.id ? { ...recordData, id: b.id } : b
        )
      );
      setEditingBooking(null);
    } else {
      const newBooking: CustomerBookingRecord = {
        ...recordData,
        id: `cb-${Date.now()}`,
      };
      setBookings((prev) => [newBooking, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingSingleId) {
      setBookings((prev) => prev.filter((b) => b.id !== deletingSingleId));
      setSelectedRows((prev) => prev.filter((id) => id !== deletingSingleId));
      setDeletingSingleId(null);
    } else {
      setBookings((prev) => prev.filter((b) => !selectedRows.includes(b.id)));
      setSelectedRows([]);
    }
    setIsDeleteConfirmOpen(false);
  };

  // Export Excel
  const handleExportExcel = () => {
    const headers = [
      'STT',
      'Mã lịch hẹn',
      'Biển số xe',
      'Dòng xe',
      'Họ và tên',
      'Số điện thoại',
      'Ngày hẹn',
      'Khung giờ hẹn',
      'Yêu cầu Dịch vụ',
      'Dịch vụ gợi ý',
      'Nguồn tạo',
      'Mã nguồn / Chiến dịch',
      'Chi tiết nguồn',
      'Trạng thái',
    ];
    const rows = filteredBookings.map((b, idx) => [
      idx + 1,
      `"${b.bookingCode}"`,
      `"${b.licensePlate}"`,
      `"${b.carModel}"`,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      `"${b.appointmentDate}"`,
      `"${b.appointmentTimeSlot}"`,
      `"${b.serviceRequest}"`,
      `"${b.suggestedServices.join('; ')}"`,
      `"${b.source}"`,
      `"${b.sourceCode}"`,
      `"${b.campaignOrNote}"`,
      `"${b.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
      '\n'
    );
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lich_hen_khach_dat.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Excel / CSV
  const handleImportExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length <= 1) return;

      const imported: CustomerBookingRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i]
          .split(',')
          .map((col) => col.replace(/^"|"$/g, '').trim());
        if (cols.length >= 5) {
          imported.push({
            id: `cb-imp-${Date.now()}-${i}`,
            bookingCode: cols[1] || `LH-241027-0${bookings.length + i}`,
            licensePlate: cols[2] || '51K-000.00',
            carModel: cols[3] || 'Mazda CX-5',
            customerName: cols[4] || 'Khách hàng mới',
            phone: cols[5] || '',
            appointmentDate: cols[6] || '27/10/2026',
            appointmentTimeSlot: cols[7] || '08:30 - 09:30',
            serviceRequest: cols[8] || 'Bảo dưỡng định kỳ',
            suggestedServices: cols[9]
              ? cols[9].split(';').map((s) => s.trim())
              : ['Bảo dưỡng định kỳ'],
            advisorName: 'Nguyễn Văn Tuấn',
            source:
              (cols[10] as BookingSourceType) || 'Module Khách hàng tiềm năng',
            sourceCode: cols[11] || 'Tạo thủ công',
            campaignOrNote: cols[12] || '',
            status: (cols[13] as BookingStatusType) || 'Chờ xe tới',
          });
        }
      }
      if (imported.length > 0) {
        setBookings((prev) => [...imported, ...prev]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const renderSourceCell = (source: BookingSourceType) => {
    switch (source) {
      case 'Module Khách hàng tiềm năng':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0070E0] border border-[#004C99] inline-block shrink-0" />
            <span>Module Khách hàng tiềm năng</span>
          </div>
        );
      case 'Hotline':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="text-sm leading-none">📞</span>
            <span>Hotline</span>
          </div>
        );
      case 'Mobile App':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="text-sm leading-none">📱</span>
            <span>Mobile App</span>
          </div>
        );
    }
  };

  const handleStatusChange = (id: string, newStatus: BookingStatusType) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const renderStatusCell = (status: BookingStatusType) => {
    switch (status) {
      case 'Chờ xe tới':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border border-gray-800 inline-block shrink-0" />
            <span>Chờ xe tới</span>
          </div>
        );
      case 'Xe đã tới':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0070E0] border border-gray-800 inline-block shrink-0" />
            <span>Xe đã tới</span>
          </div>
        );
      case 'Hoàn thành':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#00B327] border border-gray-800 inline-block shrink-0" />
            <span>Hoàn thành</span>
          </div>
        );
      case 'Bỏ hẹn':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#E01E26] border border-gray-800 inline-block shrink-0" />
            <span>Bỏ hẹn</span>
          </div>
        );
    }
  };

  const renderThirdActionIcon = (status: BookingStatusType) => {
    if (status === 'Chờ xe tới') {
      return <span title="Tiếp nhận xe">📥</span>;
    }
    if (status === 'Xe đã tới' || status === 'Hoàn thành') {
      return <span title="Phiếu dịch vụ">📋</span>;
    }
    return <span title="Đặt lại lịch hẹn">🔄</span>;
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6 flex flex-col gap-5 font-sans">
      {/* Hidden File Input for Excel Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleImportExcelChange}
      />

      {/* Top Action & Filter Card (copied from CustomersModule) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        {/* Top Row: Action Buttons + Total Count Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>

            <button
              type="button"
              disabled={selectedRows.length === 0}
              onClick={() => {
                setDeletingSingleId(null);
                setIsDeleteConfirmOpen(true);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedRows.length > 0
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-500" />
              Nhập Excel
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Xuất Excel
            </button>
          </div>

          <div className="px-3.5 py-1.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded-full text-xs font-semibold">
            Tổng số: {filteredBookings.length} lịch hẹn
          </div>
        </div>

        {/* Bottom Row: Filter Controls */}
        <div className="pt-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              TÌM KIẾM NHANH
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Mã lịch hẹn, Biển số, Họ tên, SĐT, Cố vấn DV..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setAppliedFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] transition-colors"
              />
            </div>
          </div>

          <div className="w-full sm:w-[220px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              NGUỒN TẠO
            </label>
            <select
              value={sourceInput}
              onChange={(e) => {
                setSourceInput(e.target.value);
                setAppliedFilters((prev) => ({
                  ...prev,
                  source: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white cursor-pointer transition-colors"
            >
              <option value="Tất cả">Tất cả nguồn tạo</option>
              {BOOKING_SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-[220px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              TRẠNG THÁI
            </label>
            <select
              value={statusInput}
              onChange={(e) => {
                setStatusInput(e.target.value);
                setAppliedFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white cursor-pointer transition-colors"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              {BOOKING_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyFilter}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              Lọc
            </button>
            <button
              type="button"
              onClick={handleClearFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewlist Card (matching attached screenshot) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-800">
                <th className="py-4 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedBookings.length > 0 &&
                      paginatedBookings.every((b) =>
                        selectedRows.includes(b.id)
                      )
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                  />
                </th>
                <th className="py-4 px-3 whitespace-nowrap">STT</th>
                <th className="py-4 px-4 whitespace-nowrap">Mã lịch hẹn</th>
                <th className="py-4 px-4 whitespace-nowrap">Nguồn tạo</th>
                <th className="py-4 px-4 whitespace-nowrap">
                  Mã nguồn / Chiến dịch
                </th>
                <th className="py-4 px-4 whitespace-nowrap">Họ và tên</th>
                <th className="py-4 px-4 whitespace-nowrap">Số điện thoại</th>
                <th className="py-4 px-4 whitespace-nowrap">Thời gian hẹn</th>
                <th className="py-4 px-4 whitespace-nowrap">Yêu cầu Dịch vụ</th>
                <th className="py-4 px-4 whitespace-nowrap">Dịch vụ gợi ý</th>
                <th className="py-4 px-4 whitespace-nowrap">
                  Biển số xe &amp; Dòng xe
                </th>
                <th className="py-4 px-4 whitespace-nowrap">Trạng thái</th>
                <th className="py-4 px-4 whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy lịch hẹn nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-4 px-3 text-center align-top">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(booking.id)}
                        onChange={() => handleSelectRow(booking.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                      />
                    </td>

                    {/* STT */}
                    <td className="py-4 px-3 align-top text-gray-800">
                      {startIndex + index + 1}
                    </td>

                    {/* Mã lịch hẹn */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setViewingBooking(booking)}
                        className="inline-block px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-mono text-[11px] transition-colors cursor-pointer"
                      >
                        {booking.bookingCode}
                      </button>
                    </td>

                    {/* Nguồn tạo */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {renderSourceCell(booking.source)}
                    </td>

                    {/* Mã nguồn / Chiến dịch */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {booking.source === 'Hotline' ? (
                        <div className="text-gray-800">
                          {booking.campaignOrNote.replace(/^Sales:\s*/i, '') ||
                            booking.customerName}
                        </div>
                      ) : booking.source === 'Mobile App' ? (
                        <a
                          href="https://apps.apple.com/us/app/dumuc/id6813362339"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1A73E8] hover:underline font-medium"
                        >
                          Du Mục Official App
                        </a>
                      ) : (
                        <>
                          <div className="mb-3">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-mono text-[11px]">
                              {booking.sourceCode}
                            </span>
                          </div>
                          <div className="text-gray-800">
                            {booking.campaignOrNote}
                          </div>
                        </>
                      )}
                    </td>

                    {/* Họ và tên */}
                    <td className="py-4 px-4 align-top whitespace-nowrap text-gray-800">
                      {booking.customerName}
                    </td>

                    {/* Số điện thoại */}
                    <td className="py-4 px-4 align-top whitespace-nowrap text-gray-800">
                      {booking.phone}
                    </td>

                    {/* Thời gian hẹn */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="font-bold text-gray-900 mb-3">
                        {booking.appointmentDate}
                      </div>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-mono text-[11px]">
                        {booking.appointmentTimeSlot}
                      </span>
                    </td>

                    {/* Yêu cầu Dịch vụ (dạng text) */}
                    <td className="py-4 px-4 align-top max-w-[240px] text-gray-800">
                      {booking.serviceRequest}
                    </td>

                    {/* Dịch vụ gợi ý (dạng tags) */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {booking.suggestedServices.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-[11px] font-medium whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Biển số xe & Dòng xe */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="font-bold text-gray-900 mb-3">
                        {booking.licensePlate}
                      </div>
                      <div className="text-gray-700">{booking.carModel}</div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking.id,
                            e.target.value as BookingStatusType
                          )
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border outline-none cursor-pointer ${
                          booking.status === 'Chờ xe tới'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : booking.status === 'Xe đã tới'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : booking.status === 'Hoàn thành'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {BOOKING_STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Hành động */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <button
                          type="button"
                          onClick={() => setViewingBooking(booking)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          title="Gọi điện"
                        >
                          📞
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingBooking(booking)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          title="Nhắn tin"
                        >
                          💬
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingBooking(booking)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          {renderThirdActionIcon(booking.status)}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(booking)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingSingleId(booking.id);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          title="Xóa"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (copied from CustomersModule) */}
        <div className="px-5 py-3.5 border-t border-gray-200 bg-white flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-700 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
            >
              <option value={10}>10 dòng / trang</option>
              <option value={20}>20 dòng / trang</option>
              <option value={50}>50 dòng / trang</option>
              <option value={100}>100 dòng / trang</option>
            </select>
            <span>
              Hiển thị{' '}
              <span className="font-semibold text-gray-800">
                {filteredBookings.length === 0 ? 0 : startIndex + 1} -{' '}
                {Math.min(startIndex + pageSize, filteredBookings.length)}
              </span>{' '}
              trong tổng số{' '}
              <span className="font-semibold text-gray-800">
                {filteredBookings.length}
              </span>{' '}
              lịch hẹn
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  page === safeCurrentPage
                    ? 'bg-[#1A73E8] text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* View Booking Details Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#1A73E8] text-white text-xs font-bold rounded-md font-mono">
                  {viewingBooking.bookingCode}
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Thông tin chi tiết Lịch hẹn
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Họ và tên</div>
                <div className="font-bold text-gray-900">
                  {viewingBooking.customerName}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
                <div className="font-bold text-emerald-700">
                  {viewingBooking.phone}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Biển số xe &amp; Dòng xe
                </div>
                <div className="font-bold text-gray-900">
                  {viewingBooking.licensePlate} - {viewingBooking.carModel}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Thời gian hẹn</div>
                <div className="font-semibold text-gray-800">
                  {viewingBooking.appointmentDate} (
                  {viewingBooking.appointmentTimeSlot})
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Cố vấn DV (CVDV)
                </div>
                <div className="font-semibold text-gray-800">
                  {viewingBooking.advisorName}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                <div>{renderStatusCell(viewingBooking.status)}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Nguồn tạo</div>
                <div>{renderSourceCell(viewingBooking.source)}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Mã nguồn / Chiến dịch
                </div>
                <div className="font-semibold text-gray-800">
                  {viewingBooking.sourceCode} - {viewingBooking.campaignOrNote}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Yêu cầu Dịch vụ</div>
                <div className="font-medium text-gray-800">
                  {viewingBooking.serviceRequest}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Dịch vụ gợi ý</div>
                <div className="flex flex-wrap gap-1.5">
                  {viewingBooking.suggestedServices.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = viewingBooking;
                  setViewingBooking(null);
                  handleOpenEditModal(target);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Booking Modal */}
      {(isAddModalOpen || editingBooking) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingBooking
                  ? `Chỉnh sửa Lịch hẹn (${editingBooking.bookingCode})`
                  : 'Thêm mới Lịch hẹn'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingBooking(null);
                }}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mã lịch hẹn
                  </label>
                  <input
                    type="text"
                    value={formData.bookingCode}
                    onChange={(e) =>
                      setFormData({ ...formData, bookingCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as BookingStatusType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white"
                  >
                    {BOOKING_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Biển số xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 51K-889.21"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dòng xe
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Mazda CX-5 2021"
                    value={formData.carModel}
                    onChange={(e) =>
                      setFormData({ ...formData, carModel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên..."
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập số điện thoại..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày hẹn
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Khung giờ hẹn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 08:30 - 09:30"
                    value={formData.appointmentTimeSlot}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentTimeSlot: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cố vấn DV (CVDV)
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên cố vấn dịch vụ..."
                    value={formData.advisorName}
                    onChange={(e) =>
                      setFormData({ ...formData, advisorName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nguồn tạo
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        source: e.target.value as BookingSourceType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white"
                  >
                    {BOOKING_SOURCE_OPTIONS.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mã nguồn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: KHTN-2024-001 / Tạo thủ công / Khách tự đặt"
                    value={formData.sourceCode}
                    onChange={(e) =>
                      setFormData({ ...formData, sourceCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Chiến dịch / Ghi chú nguồn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Chăm sóc xe mùa hè"
                    value={formData.campaignOrNote}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        campaignOrNote: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Yêu cầu Dịch vụ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bảo dưỡng định kỳ, Cân chỉnh thước lái"
                    value={formData.serviceRequest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceRequest: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dịch vụ gợi ý (Phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bảo dưỡng định kỳ, Căn chỉnh thước lái"
                    value={formData.suggestedServicesText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suggestedServicesText: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingBooking(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Xác nhận xóa lịch hẹn
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Bạn có chắc chắn muốn xóa{' '}
              <span className="font-bold text-red-600">
                {deletingSingleId ? 1 : selectedRows.length}
              </span>{' '}
              lịch hẹn đã chọn không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDeletingSingleId(null);
                  setIsDeleteConfirmOpen(false);
                }}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
