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
  Mail,
  MessageCircle,
  Paperclip,
  Copy,
  Check,
  Phone,
  Calendar,
  CalendarPlus,
  ChevronDown,
  User,
  Building2,
  Car,
  XCircle,
  RotateCcw,
  History,
  Tag,
  Clock,
  Save,
  Edit3,
  CheckSquare,
  Hourglass,
} from 'lucide-react';

export type BookingSourceType =
  | 'Hotline'
  | 'Module Khách hàng quan tâm'
  | 'Mobile App';
export type BookingStatusType =
  | 'Chờ xe tới'
  | 'Xe đã tới'
  | 'Hoàn thành'
  | 'Bỏ hẹn'
  | 'Đã hủy'
  | 'Đã hủy bởi Garage';

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
  potentialCustomerId?: string;
  createdBy?: string;
  cancelledByGarage?: boolean;
}

export interface BookingCustomerVehicle {
  plate: string;
  carModel: string; // Format: "Hiệu xe - Dòng xe"
}

export interface BookingCustomerProfile {
  id: string;
  phone: string;
  email: string;
  customerName: string;
  customerCode: string;
  cccd: string;
  province: string;
  ward: string;
  companyName: string;
  position: string;
  taxCode: string;
  vehicles: BookingCustomerVehicle[];
}

export const INITIAL_BOOKING_CUSTOMER_PROFILES: BookingCustomerProfile[] = [
  {
    id: 'bcp-1',
    phone: '0901 234 567',
    email: 'nam.pham@namsaigonauto.vn',
    customerName: 'Phạm Hoàng Nam',
    customerCode: 'KH-2023-089',
    cccd: '079088001234',
    province: 'TP. Hồ Chí Minh',
    ward: 'Phường Tân Phong, Quận 7',
    companyName: 'Công ty TNHH Nam Sài Gòn Auto',
    position: 'Giám đốc',
    taxCode: '0314567890',
    vehicles: [
      { plate: '51K-889.21', carModel: 'Mazda - CX-5' },
      { plate: '51G-456.78', carModel: 'Honda - CR-V' },
    ],
  },
  {
    id: 'bcp-2',
    phone: '0918 765 432',
    email: 'quan.do@quanauto.vn',
    customerName: 'Đỗ Minh Quân',
    customerCode: 'KH-2023-115',
    cccd: '001090005678',
    province: 'Hà Nội',
    ward: 'Phường Dịch Vọng, Quận Cầu Giấy',
    companyName: 'Công ty CP Dịch vụ Ô tô Minh Quân',
    position: 'Trưởng phòng Kỹ thuật',
    taxCode: '0108877665',
    vehicles: [
      { plate: '30H-665.43', carModel: 'Ford - Ranger' },
      { plate: '30K-112.89', carModel: 'Toyota - Corolla Cross' },
    ],
  },
  {
    id: 'bcp-3',
    phone: '0938 112 233',
    email: 'contact@vietthanhgarage.com',
    customerName: 'Lê Hoàng Việt',
    customerCode: 'KH-2023-142',
    cccd: '079085009876',
    province: 'TP. Hồ Chí Minh',
    ward: 'Phường 13, Quận Tân Bình',
    companyName: 'Công ty TNHH Việt Thành Garage',
    position: 'Chủ tịch HĐTV',
    taxCode: '0319988776',
    vehicles: [
      { plate: '51A-992.18', carModel: 'Mercedes-Benz - C200' },
      { plate: '51H-123.99', carModel: 'Hyundai - SantaFe' },
    ],
  },
  {
    id: 'bcp-4',
    phone: '0979 445 566',
    email: 'bao.tran@baotinauto.vn',
    customerName: 'Trần Quốc Bảo',
    customerCode: 'KH-2024-028',
    cccd: '075092003456',
    province: 'Đồng Nai',
    ward: 'Phường Thống Nhất, TP. Biên Hòa',
    companyName: 'Công ty TNHH Vận tải Bảo Tín',
    position: 'Phó Giám đốc',
    taxCode: '3603344556',
    vehicles: [
      { plate: '60A-773.12', carModel: 'Toyota - Vios' },
      { plate: '43A-556.12', carModel: 'Kia - Carnival' },
    ],
  },
  {
    id: 'bcp-5',
    phone: '0932 998 877',
    email: 'info@ducphatdetailing.vn',
    customerName: 'Hoàng Minh Đức',
    customerCode: 'KH-2024-077',
    cccd: '040089007654',
    province: 'Nghệ An',
    ward: 'Phường Hưng Bình, TP. Vinh',
    companyName: 'Đức Phát Detailing Center',
    position: 'Quản lý Điều hành',
    taxCode: '2901887766',
    vehicles: [
      { plate: '51H-123.99', carModel: 'Hyundai - SantaFe' },
      { plate: '65A-234.56', carModel: 'Mitsubishi - Xpander' },
    ],
  },
  {
    id: 'bcp-6',
    phone: '0905 000 111',
    email: 'thao.nguyen@thaonguyenauto.vn',
    customerName: 'Nguyễn Thị Thu Thảo',
    customerCode: 'KH-2024-015',
    cccd: '001193002211',
    province: 'Hà Nội',
    ward: 'Phường Thượng Đình, Quận Thanh Xuân',
    companyName: 'Công ty CP Thảo Nguyên Auto Care',
    position: 'Kế toán trưởng',
    taxCode: '0106543210',
    vehicles: [
      { plate: '30K-112.89', carModel: 'Toyota - Corolla Cross' },
      { plate: '65A-234.56', carModel: 'Mitsubishi - Xpander' },
    ],
  },
];

export const BOOKING_MASTER_CAR_MODELS: string[] = [
  'Mazda - CX-5',
  'Mazda - Mazda 3',
  'Mazda - CX-8',
  'Toyota - Vios',
  'Toyota - Corolla Cross',
  'Toyota - Camry',
  'Toyota - Fortuner',
  'Toyota - Innova Cross',
  'Ford - Ranger',
  'Ford - Everest',
  'Ford - Territory',
  'Honda - CR-V',
  'Honda - City',
  'Honda - Civic',
  'Hyundai - SantaFe',
  'Hyundai - Tucson',
  'Hyundai - Accent',
  'Kia - Seltos',
  'Kia - Carnival',
  'Kia - Sonet',
  'Mercedes-Benz - C200',
  'Mercedes-Benz - GLC 300',
  'BMW - 320i',
  'Mitsubishi - Xpander',
  'VinFast - VF 8',
  'VinFast - VF 5',
];

export const BOOKING_SUGGESTED_SERVICE_TAGS: string[] = [
  'Bảo dưỡng định kỳ',
  'Rửa xe',
  'Cân mâm',
  'Đảo lốp',
  'Căn chỉnh thước lái',
  'Chẩn đoán tổng quát',
  'Thay dầu máy',
  'Kiểm tra hệ thống phanh',
];

export const PLATE_TO_CAR_MODEL_MAP: Record<string, string> = {
  '51K-889.21': 'Mazda - CX-5',
  '30H-665.43': 'Ford - Ranger',
  '51A-992.18': 'Mercedes-Benz - C200',
  '60A-773.12': 'Toyota - Vios',
  '51H-123.99': 'Hyundai - SantaFe',
  '51G-456.78': 'Honda - CR-V',
  '30K-112.89': 'Toyota - Corolla Cross',
  '43A-556.12': 'Kia - Carnival',
  '65A-234.56': 'Mitsubishi - Xpander',
};

export const INITIAL_CUSTOMER_BOOKINGS: CustomerBookingRecord[] = [
  {
    id: 'cb-1',
    bookingCode: 'LH-241027-01',
    licensePlate: '51K-889.21',
    carModel: 'Mazda - CX-5',
    customerName: 'Phạm Hoàng Nam',
    phone: '0901 234 567',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '08:30 - 09:30',
    serviceRequest: 'Bảo dưỡng định kỳ, Cân chỉnh thước lái',
    suggestedServices: ['Bảo dưỡng định kỳ', 'Căn chỉnh thước lái'],
    advisorName: 'Nguyễn Văn Tuấn',
    source: 'Module Khách hàng quan tâm',
    sourceCode: 'KHTN-2024-001',
    campaignOrNote: 'Chăm sóc xe mùa hè',
    status: 'Chờ xe tới',
  },
  {
    id: 'cb-2',
    bookingCode: 'LH-241027-02',
    licensePlate: '30H-665.43',
    carModel: 'Ford - Ranger',
    customerName: 'Đỗ Minh Quân',
    phone: '0918 765 432',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '09:30 - 10:30',
    serviceRequest: 'Kiểm tra tiếng kêu gầm, Thay dầu máy',
    suggestedServices: ['Chẩn đoán tổng quát', 'Bảo dưỡng định kỳ'],
    advisorName: 'Trần Quốc Hùng',
    source: 'Hotline',
    sourceCode: '',
    campaignOrNote: '',
    createdBy: 'Thu Thảo',
    status: 'Chờ xe tới',
  },
  {
    id: 'cb-3',
    bookingCode: 'LH-241027-03',
    licensePlate: '51A-992.18',
    carModel: 'Mercedes-Benz - C200',
    customerName: 'Lê Hoàng Việt',
    phone: '0938 112 233',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '10:00 - 11:30',
    serviceRequest: 'Chẩn đoán lỗi động cơ, Rửa khoang máy',
    suggestedServices: ['Chẩn đoán tổng quát', 'Rửa xe'],
    advisorName: 'Lê Thanh Tùng',
    source: 'Mobile App',
    sourceCode: 'Khách tự đặt',
    campaignOrNote: 'App Du Muc',
    status: 'Xe đã tới',
  },
  {
    id: 'cb-4',
    bookingCode: 'LH-241027-04',
    licensePlate: '60A-773.12',
    carModel: 'Toyota - Vios',
    customerName: 'Trần Quốc Bảo',
    phone: '0979 445 566',
    appointmentDate: '27/10/2026',
    appointmentTimeSlot: '14:00 - 15:00',
    serviceRequest: 'Bảo dưỡng 40.000 Km',
    suggestedServices: ['Bảo dưỡng định kỳ', 'Đảo lốp', 'Cân mâm'],
    advisorName: 'Nguyễn Văn Tuấn',
    source: 'Module Khách hàng quan tâm',
    sourceCode: 'KHTN-2024-004',
    campaignOrNote: 'Khuyến mãi phụ tùng',
    status: 'Bỏ hẹn',
  },
  {
    id: 'cb-5',
    bookingCode: 'LH-241027-05',
    licensePlate: '51H-123.99',
    carModel: 'Hyundai - SantaFe',
    customerName: 'Hoàng Minh Đức',
    phone: '0932 998 877',
    appointmentDate: '28/10/2026',
    appointmentTimeSlot: '08:00 - 09:00',
    serviceRequest: 'Sơn dặm cản trước',
    suggestedServices: ['Rửa xe', 'Đồng sơn'],
    advisorName: 'Trần Quốc Hùng',
    source: 'Mobile App',
    sourceCode: 'Khách tự đặt',
    campaignOrNote: 'App Du Muc',
    status: 'Hoàn thành',
  },
];

const BOOKING_STATUS_OPTIONS: BookingStatusType[] = [
  'Chờ xe tới',
  'Xe đã tới',
  'Hoàn thành',
  'Bỏ hẹn',
  'Đã hủy',
  'Đã hủy bởi Garage',
];

const BOOKING_SOURCE_OPTIONS: BookingSourceType[] = [
  'Hotline',
  'Module Khách hàng quan tâm',
  'Mobile App',
];

interface CustomerBookingsModuleProps {
  bookings?: CustomerBookingRecord[];
  setBookings?: React.Dispatch<React.SetStateAction<CustomerBookingRecord[]>>;
  filterPotentialCustomerId?: string;
  defaultPotentialCustomer?: {
    id: string;
    code: string;
    name: string;
    fullName: string;
    phone: string;
  };
}

export const CustomerBookingsModule: React.FC<CustomerBookingsModuleProps> = ({
  bookings: externalBookings,
  setBookings: externalSetBookings,
  filterPotentialCustomerId,
  defaultPotentialCustomer,
}) => {
  const [internalBookings, setInternalBookings] = useState<
    CustomerBookingRecord[]
  >(INITIAL_CUSTOMER_BOOKINGS);
  const bookings = externalBookings ?? internalBookings;
  const setBookings = externalSetBookings ?? setInternalBookings;
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
  const [viewingPlateInfo, setViewingPlateInfo] = useState<{
    fullLabel: string;
    plate: string;
    brandModel: string;
    booking: CustomerBookingRecord;
  } | null>(null);
  const [onlyCompletedRO, setOnlyCompletedRO] = useState(false);
  const [copiedCarModelKey, setCopiedCarModelKey] = useState<string | null>(
    null
  );
  const [editingBooking, setEditingBooking] =
    useState<CustomerBookingRecord | null>(null);
  const [hoveredLockedEditBooking, setHoveredLockedEditBooking] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);
  const [
    hoveredCancelledByGarageBooking,
    setHoveredCancelledByGarageBooking,
  ] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);
  const [hoveredAppDuMucBooking, setHoveredAppDuMucBooking] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingSingleId, setDeletingSingleId] = useState<string | null>(null);

  // Customer directory & Full-screen "Thêm mới" state
  const [customerProfiles, setCustomerProfiles] = useState<
    BookingCustomerProfile[]
  >(INITIAL_BOOKING_CUSTOMER_PROFILES);

  // Khu vực "Khách hàng gọi"
  const [selectedCaller, setSelectedCaller] =
    useState<BookingCustomerProfile | null>(null);
  const [callerPhoneQuery, setCallerPhoneQuery] = useState('');
  const [callerEmailQuery, setCallerEmailQuery] = useState('');
  const [isCallerPhoneOpen, setIsCallerPhoneOpen] = useState(false);
  const [isCallerEmailOpen, setIsCallerEmailOpen] = useState(false);

  // Cột 1: "Thông tin Khách hàng đến"
  const [isSameAsCaller, setIsSameAsCaller] = useState(false);
  const [selectedVisitor, setSelectedVisitor] =
    useState<BookingCustomerProfile | null>(null);
  const [visitorPhoneQuery, setVisitorPhoneQuery] = useState('');
  const [visitorEmailQuery, setVisitorEmailQuery] = useState('');
  const [isVisitorPhoneOpen, setIsVisitorPhoneOpen] = useState(false);
  const [isVisitorEmailOpen, setIsVisitorEmailOpen] = useState(false);

  // Cột 3: "Lịch hẹn"
  const [addBookingLicensePlates, setAddBookingLicensePlates] = useState<
    string[]
  >([]);
  const [addBookingPlateInput, setAddBookingPlateInput] = useState('');
  const [isAddPlateDropdownOpen, setIsAddPlateDropdownOpen] = useState(false);

  const [addBookingCarModels, setAddBookingCarModels] = useState<string[]>([]);
  const [addBookingCarModelInput, setAddBookingCarModelInput] = useState('');
  const [isAddCarModelDropdownOpen, setIsAddCarModelDropdownOpen] =
    useState(false);

  const [addBookingDate, setAddBookingDate] = useState('27/10/2026');
  const [addBookingTimeSlot, setAddBookingTimeSlot] = useState('08:30 - 09:30');
  const [addBookingServiceRequest, setAddBookingServiceRequest] = useState('');
  const [addBookingSuggestedTags, setAddBookingSuggestedTags] = useState<
    string[]
  >(['Bảo dưỡng định kỳ']);
  const [addBookingError, setAddBookingError] = useState('');

  // Quick "Thêm mới Khách hàng" modal state (triggered from Số điện thoại / Email in Khách hàng gọi or Số điện thoại in Khách hàng đến)
  const [newCustomerTarget, setNewCustomerTarget] = useState<
    'caller' | 'visitor' | null
  >(null);
  const [newCustForm, setNewCustForm] = useState<{
    phone: string;
    email: string;
    customerName: string;
    customerCode: string;
    cccd: string;
    province: string;
    ward: string;
    companyName: string;
    position: string;
    taxCode: string;
    vehiclePlate: string;
    vehicleCarModel: string;
  }>({
    phone: '',
    email: '',
    customerName: '',
    customerCode: '',
    cccd: '',
    province: '',
    ward: '',
    companyName: '',
    position: '',
    taxCode: '',
    vehiclePlate: '',
    vehicleCarModel: 'Mazda - CX-5',
  });
  const [newCustError, setNewCustError] = useState('');

  // Form state for Edit
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
    source: 'Module Khách hàng quan tâm',
    sourceCode: '',
    campaignOrNote: '',
    status: 'Chờ xe tới',
  });
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Email & Zalo Modals state (copied from PotentialCustomersModule)
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedEmailRecord, setSelectedEmailRecord] =
    useState<CustomerBookingRecord | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);
  const emailFileInputRef = useRef<HTMLInputElement | null>(null);

  const [zaloModalOpen, setZaloModalOpen] = useState(false);
  const [selectedZaloRecord, setSelectedZaloRecord] =
    useState<CustomerBookingRecord | null>(null);
  const [zaloContent, setZaloContent] = useState('');
  const [zaloAttachments, setZaloAttachments] = useState<File[]>([]);
  const zaloFileInputRef = useRef<HTMLInputElement | null>(null);

  // Hủy lịch, Đặt lại lịch, Lịch sử hoạt động states
  const [cancelBookingRecord, setCancelBookingRecord] =
    useState<CustomerBookingRecord | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelMobileAppStep, setCancelMobileAppStep] = useState<
    'warning' | 'confirm' | 'preview'
  >('warning');
  const [cancelDropdownReason, setCancelDropdownReason] = useState('');
  const [cancelNotifyApp, setCancelNotifyApp] = useState(true);
  const [cancelNotifyEmail, setCancelNotifyEmail] = useState(true);
  const [cancelPreviewTab, setCancelPreviewTab] = useState<'app' | 'email'>(
    'app'
  );
  const [isEditingCancelPreview, setIsEditingCancelPreview] = useState(false);
  const [cancelPreviewCustomized, setCancelPreviewCustomized] = useState(false);
  const [cancelAppTitle, setCancelAppTitle] = useState('');
  const [cancelAppBody, setCancelAppBody] = useState('');
  const [cancelEmailSubject, setCancelEmailSubject] = useState('');
  const [cancelEmailBody, setCancelEmailBody] = useState('');

  const MOBILE_APP_CANCEL_REASONS = [
    'Khách hàng gọi điện nhờ Garage hủy hộ (không tiện vào app)',
    'Đã liên hệ xác nhận: Khách bận đột xuất / Không thể đến',
    'Garage gặp sự cố kỹ thuật / Quá tải khoang xưởng không thể tiếp nhận',
    'Đặt trùng lịch hẹn với xe khác / Đặt nhầm thông tin',
    'Lý do khác (yêu cầu nhập chi tiết)',
  ];

  const buildDefaultCancelNotifications = (
    booking: CustomerBookingRecord,
    dropdownReason: string,
    detailNote: string
  ) => {
    const reasonText =
      dropdownReason || 'Theo trao đổi xác nhận lịch hẹn từ hệ thống Garage';
    const noteText = detailNote.trim()
      ? `\nGhi chú chi tiết: ${detailNote.trim()}`
      : '';
    const appTitle = `[Thông báo hủy lịch hẹn] Mã lịch hẹn ${booking.bookingCode}`;
    const appBody = `Chào ${booking.customerName},\nLịch hẹn dịch vụ cho xe ${booking.licensePlate} (${booking.carModel}) vào lúc ${booking.appointmentTimeSlot} ngày ${booking.appointmentDate} đã được cập nhật trạng thái "Đã hủy" từ phía Sài Gòn Garage.\n• Lý do hủy: ${reasonText}${noteText}\nNếu cần đặt lại lịch hẹn mới hoặc hỗ trợ thêm, Quý khách vui lòng thao tác trên Du Mục Official App hoặc liên hệ Hotline 1900 6868.`;

    const emailSubj = `[Sài Gòn Garage] Thông báo hủy lịch hẹn ${booking.bookingCode} (${booking.appointmentDate})`;
    const emailContentText = `Chào Quý khách ${booking.customerName},\n\nSài Gòn Garage xin thông báo lịch hẹn dịch vụ của Quý khách đặt qua Mobile App đã được hủy trên hệ thống:\n\n📌 THÔNG TIN LỊCH HẸN ĐÃ HỦY\n- Mã lịch hẹn: ${booking.bookingCode}\n- Phương tiện: ${booking.licensePlate} (${booking.carModel})\n- Thời gian hẹn: ${booking.appointmentTimeSlot} - Ngày ${booking.appointmentDate}\n- Lý do hủy: ${reasonText}${
      detailNote.trim() ? `\n- Chi tiết trao đổi: ${detailNote.trim()}` : ''
    }\n\nTrạng thái "Đã hủy" đã được đồng bộ trực tiếp về ứng dụng Du Mục Official App của Quý khách.\nRất mong được đón tiếp và phục vụ Quý khách trong lần hẹn tiếp theo.\n\nTrân trọng,\nSài Gòn Garage | Hotline hỗ trợ: 1900 6868`;

    return {
      appTitle,
      appBody,
      emailSubj,
      emailContentText,
    };
  };

  const openCancelBookingModal = (booking: CustomerBookingRecord) => {
    if (booking.cancelledByGarage || booking.status === 'Đã hủy bởi Garage') {
      return;
    }
    const defaults = buildDefaultCancelNotifications(booking, '', '');
    setCancelBookingRecord(booking);
    setCancelReason('');
    setCancelMobileAppStep('warning');
    setCancelDropdownReason('');
    setCancelNotifyApp(true);
    setCancelNotifyEmail(true);
    setCancelPreviewTab('app');
    setIsEditingCancelPreview(false);
    setCancelPreviewCustomized(false);
    setCancelAppTitle(defaults.appTitle);
    setCancelAppBody(defaults.appBody);
    setCancelEmailSubject(defaults.emailSubj);
    setCancelEmailBody(defaults.emailContentText);
  };

  const handleOpenCancelPreview = () => {
    if (!cancelBookingRecord) return;
    if (!cancelPreviewCustomized) {
      const defaults = buildDefaultCancelNotifications(
        cancelBookingRecord,
        cancelDropdownReason,
        cancelReason
      );
      setCancelAppTitle(defaults.appTitle);
      setCancelAppBody(defaults.appBody);
      setCancelEmailSubject(defaults.emailSubj);
      setCancelEmailBody(defaults.emailContentText);
    }
    setIsEditingCancelPreview(false);
    setCancelMobileAppStep('preview');
  };

  const [rescheduleBookingRecord, setRescheduleBookingRecord] =
    useState<CustomerBookingRecord | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('');
  const [rescheduleNote, setRescheduleNote] = useState('');

  const [activityHistoryBookingRecord, setActivityHistoryBookingRecord] =
    useState<CustomerBookingRecord | null>(null);
  const [activeActivityTab, setActiveActivityTab] = useState<
    'activity_history' | 'history' | 'tasks'
  >('activity_history');
  const [bookingNoteContent, setBookingNoteContent] = useState('');
  const [bookingTaskContent, setBookingTaskContent] = useState('');
  const [editingBookingTaskId, setEditingBookingTaskId] = useState<
    string | null
  >(null);
  const [editBookingTaskContent, setEditBookingTaskContent] = useState('');

  const [bookingInternalNotes, setBookingInternalNotes] = useState<
    Record<
      string,
      Array<{ id: string; content: string; timestamp: string; author: string }>
    >
  >({
    'cb-1': [
      {
        id: 'bn-1',
        content:
          'Khách ưu tiên kiểm tra phanh và thay nhớt tổng hợp, cần chuẩn bị sẵn phụ tùng Mazda CX-5.',
        timestamp: '27/10/2026 08:05',
        author: 'quych@pbsofu.vn',
      },
    ],
    'cb-2': [
      {
        id: 'bn-2',
        content: 'Đã gọi xác nhận lịch hẹn, khách báo sẽ đến đúng khung giờ 09:30.',
        timestamp: '27/10/2026 08:30',
        author: 'quych@pbsofu.vn',
      },
    ],
  });

  const [bookingTasks, setBookingTasks] = useState<
    Record<
      string,
      Array<{
        id: string;
        content: string;
        timestamp: string;
        author: string;
        completed: boolean;
      }>
    >
  >({
    'cb-1': [
      {
        id: 'bt-1',
        content: 'Gọi nhắc khách trước giờ hẹn 1 tiếng và chuẩn bị khoang dịch vụ',
        timestamp: '27/10/2026 08:10',
        author: 'quych@pbsofu.vn',
        completed: false,
      },
    ],
    'cb-2': [
      {
        id: 'bt-2',
        content: 'Kiểm tra tồn kho má phanh trước Honda CR-V trước khi xe tới',
        timestamp: '27/10/2026 08:40',
        author: 'quych@pbsofu.vn',
        completed: true,
      },
    ],
  });

  const [bookingActivities, setBookingActivities] = useState<
    Record<
      string,
      Array<{
        id: string;
        action: string;
        detail: string;
        actor: string;
        timestamp: string;
      }>
    >
  >({});

  const getNowTimestamp = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const addBookingActivity = (
    bookingId: string,
    action: string,
    detail: string,
    actor = 'quych@pbsofu.vn'
  ) => {
    setBookingActivities((prev) => ({
      ...prev,
      [bookingId]: [
        {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          action,
          detail,
          actor,
          timestamp: getNowTimestamp(),
        },
        ...(prev[bookingId] || []),
      ],
    }));
  };

  const getActivitiesForBooking = (booking: CustomerBookingRecord) => {
    const customList = bookingActivities[booking.id] || [];
    const defaultList = [
      {
        id: `init-confirm-${booking.id}`,
        action: 'Cập nhật lịch hẹn',
        detail: `Xác nhận thông tin đặt lịch cho xe ${booking.licensePlate} (${booking.carModel}) - Dịch vụ: ${booking.serviceRequest}`,
        actor: 'quych@pbsofu.vn',
        timestamp: '27/10/2026 08:15',
      },
      {
        id: `init-${booking.id}`,
        action: 'Tạo lịch hẹn Khách đặt',
        detail: `Khởi tạo lịch hẹn ${booking.bookingCode} từ nguồn "${booking.source}" • Thời gian hẹn: ${booking.appointmentDate} (${booking.appointmentTimeSlot})`,
        actor:
          booking.createdBy ||
          booking.advisorName ||
          'quych@pbsofu.vn',
        timestamp: '27/10/2026 08:00',
      },
    ];
    return [...customList, ...defaultList];
  };

  const handleSaveBookingNote = (bookingId: string) => {
    if (!bookingNoteContent.trim()) return;
    const noteText = bookingNoteContent.trim();
    const newNote = {
      id: `bn-${Date.now()}`,
      content: noteText,
      timestamp: getNowTimestamp(),
      author: 'quych@pbsofu.vn',
    };
    setBookingInternalNotes((prev) => ({
      ...prev,
      [bookingId]: [newNote, ...(prev[bookingId] || [])],
    }));
    addBookingActivity(
      bookingId,
      'Ghi chú nội bộ - Thêm ghi chú',
      `Đã lưu ghi chú nội bộ: "${noteText}"`
    );
    setBookingNoteContent('');
  };

  const handleAddBookingTask = (bookingId: string) => {
    if (!bookingTaskContent.trim()) return;
    const taskText = bookingTaskContent.trim();
    const newTask = {
      id: `bt-${Date.now()}`,
      content: taskText,
      timestamp: getNowTimestamp(),
      author: 'quych@pbsofu.vn',
      completed: false,
    };
    setBookingTasks((prev) => ({
      ...prev,
      [bookingId]: [newTask, ...(prev[bookingId] || [])],
    }));
    addBookingActivity(
      bookingId,
      'Lời nhắc & Công việc - Thêm mới',
      `Đã thêm công việc mới: "${taskText}"`
    );
    setBookingTaskContent('');
  };

  const handleToggleBookingTask = (bookingId: string, taskId: string) => {
    const currentTask = (bookingTasks[bookingId] || []).find(
      (t) => t.id === taskId
    );
    const nextCompleted = currentTask ? !currentTask.completed : true;
    setBookingTasks((prev) => ({
      ...prev,
      [bookingId]: (prev[bookingId] || []).map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
    if (currentTask) {
      addBookingActivity(
        bookingId,
        nextCompleted
          ? 'Lời nhắc & Công việc - Hoàn thành'
          : 'Lời nhắc & Công việc - Mở lại',
        `${
          nextCompleted ? 'Đã đánh dấu hoàn thành' : 'Đã mở lại'
        } công việc: "${currentTask.content}"`
      );
    }
  };

  const handleStartEditBookingTask = (task: {
    id: string;
    content: string;
  }) => {
    setEditingBookingTaskId(task.id);
    setEditBookingTaskContent(task.content);
  };

  const handleSaveEditBookingTask = (bookingId: string, taskId: string) => {
    if (!editBookingTaskContent.trim()) return;
    const updatedText = editBookingTaskContent.trim();
    const oldTask = (bookingTasks[bookingId] || []).find(
      (t) => t.id === taskId
    );
    setBookingTasks((prev) => ({
      ...prev,
      [bookingId]: (prev[bookingId] || []).map((t) =>
        t.id === taskId ? { ...t, content: updatedText } : t
      ),
    }));
    addBookingActivity(
      bookingId,
      'Lời nhắc & Công việc - Chỉnh sửa',
      oldTask && oldTask.content !== updatedText
        ? `Đã cập nhật nội dung công việc từ "${oldTask.content}" thành "${updatedText}"`
        : `Đã cập nhật nội dung công việc: "${updatedText}"`
    );
    setEditingBookingTaskId(null);
    setEditBookingTaskContent('');
  };

  const handleCancelEditBookingTask = () => {
    setEditingBookingTaskId(null);
    setEditBookingTaskContent('');
  };

  const getBookingStatusBadgeStyle = (status: BookingStatusType) => {
    switch (status) {
      case 'Chờ xe tới':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Xe đã tới':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Hoàn thành':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Bỏ hẹn':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Đã hủy':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Đã hủy bởi Garage':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getDefaultEmailForRecord = (record: CustomerBookingRecord) => {
    const emailMap: Record<string, string> = {
      'Phạm Hoàng Nam': 'nam.pham@saigongarage.vn',
      'Đỗ Minh Quân': 'quan.do@quanauto.vn',
      'Lê Hoàng Việt': 'viet.le@vietthanhgarage.com',
      'Trần Quốc Bảo': 'bao.tran@baotinauto.vn',
      'Hoàng Minh Đức': 'duc.hoang@ducauto.vn',
    };
    if (emailMap[record.customerName]) return emailMap[record.customerName];
    const slug = record.customerName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.');
    return `${slug || 'khachhang'}@gmail.com`;
  };

  const openEmailModalForRecord = (record: CustomerBookingRecord) => {
    const salutation =
      record.customerName.includes('Thị') ||
      record.customerName.includes('Thảo')
        ? 'Chị'
        : 'Anh';
    const branchName = 'Sài Gòn Garage';
    const bookingTime = record.appointmentTimeSlot || '08:00 - 10:00';
    const bookingDate = record.appointmentDate;
    const branchAddress = '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh';
    const supportHotline = '1900 6868';

    const defaultSubject = `[Xác nhận lịch hẹn] Garage ${branchName} hẹn gặp ${salutation} ${record.customerName} lúc ${bookingTime} - ${bookingDate}`;
    const defaultBody = `Chào ${salutation} ${record.customerName},
Cảm ơn ${salutation} đã đặt lịch tại ${branchName}.
📌 THÔNG TIN ĐÓN TIẾP
Khung giờ hẹn: ${bookingTime} - ${bookingDate}
Địa điểm đón tiếp: ${branchAddress}
Số điện thoại hỗ trợ nhanh: ${supportHotline}
🚘 LƯU Ý DÀNH CHO ${salutation.toUpperCase()}:
[ 🗺️ CHỈ ĐƯỜNG BẰNG GOOGLE MAPS ]
[ 📅 THÊM VÀO LỊCH GOOGLE / APPLE ]
Hẹn gặp lại ${salutation} tại Garage.
Trân trọng,

🌐 Website: www.garagename.vn | ☎️ Hotline: ${supportHotline}`;

    setSelectedEmailRecord(record);
    setEmailRecipient(getDefaultEmailForRecord(record));
    setEmailSubject(defaultSubject);
    setEmailContent(defaultBody);
    setEmailAttachments([]);
    setEmailModalOpen(true);
  };

  const getZaloDefaultContent = (record: CustomerBookingRecord) => {
    const salutation =
      record.customerName.includes('Thị') ||
      record.customerName.includes('Thảo')
        ? 'Chị'
        : 'Anh';
    const branchName = 'Sài Gòn Garage';
    const bookingTime = record.appointmentTimeSlot || '08:00 - 10:00';
    const bookingDate = record.appointmentDate;
    const branchAddress = '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh';
    const supportHotline = '1900 6868';

    return `[SAIGON GARAGE] XÁC NHẬN LỊCH HẸN ĐÓN TIẾP
Chào ${salutation} ${record.customerName},
Garage ${branchName} đón tiếp ${salutation} rồi ạ!
📅 Thời gian: ${bookingTime} - ${bookingDate}
📍 Địa điểm: ${branchAddress}
📞 Hotline đón tiếp: ${supportHotline}
🗺️ [ Mở Google Maps Chỉ Đường ]`;
  };

  // Filtered bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (filterPotentialCustomerId) {
        if (
          b.source !== 'Module Khách hàng quan tâm' ||
          b.potentialCustomerId !== filterPotentialCustomerId
        ) {
          return false;
        }
      }

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
  }, [bookings, appliedFilters, filterPotentialCustomerId]);

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

  // Open Add Modal (Full-screen)
  const handleOpenAddModal = () => {
    setEditingBooking(null);
    const initialCaller =
      (defaultPotentialCustomer
        ? customerProfiles.find(
            (c) =>
              c.phone.replace(/\s+/g, '') ===
              defaultPotentialCustomer.phone.replace(/\s+/g, '')
          )
        : null) || customerProfiles[0] || null;

    setSelectedCaller(initialCaller);
    setCallerPhoneQuery(initialCaller?.phone || defaultPotentialCustomer?.phone || '');
    setCallerEmailQuery(initialCaller?.email || '');
    setIsCallerPhoneOpen(false);
    setIsCallerEmailOpen(false);

    setIsSameAsCaller(true);
    setSelectedVisitor(initialCaller);
    setVisitorPhoneQuery(initialCaller?.phone || defaultPotentialCustomer?.phone || '');
    setVisitorEmailQuery(initialCaller?.email || '');
    setIsVisitorPhoneOpen(false);
    setIsVisitorEmailOpen(false);

    setAddBookingLicensePlates([]);
    setAddBookingPlateInput('');
    setIsAddPlateDropdownOpen(false);

    setAddBookingCarModels([]);
    setAddBookingCarModelInput('');
    setIsAddCarModelDropdownOpen(false);

    setAddBookingDate('27/10/2026');
    setAddBookingTimeSlot('08:30 - 09:30');
    setAddBookingServiceRequest('');
    setAddBookingSuggestedTags(['Bảo dưỡng định kỳ']);
    setAddBookingError('');
    setNewCustomerTarget(null);

    setIsAddModalOpen(true);
  };

  const handleSelectCallerCustomer = (cust: BookingCustomerProfile) => {
    setSelectedCaller(cust);
    setCallerPhoneQuery(cust.phone);
    setCallerEmailQuery(cust.email);
    setIsCallerPhoneOpen(false);
    setIsCallerEmailOpen(false);
    if (isSameAsCaller) {
      setSelectedVisitor(cust);
      setVisitorPhoneQuery(cust.phone);
      setVisitorEmailQuery(cust.email);
    }
  };

  const handleSelectVisitorCustomer = (cust: BookingCustomerProfile) => {
    setSelectedVisitor(cust);
    setVisitorPhoneQuery(cust.phone);
    setVisitorEmailQuery(cust.email);
    setIsVisitorPhoneOpen(false);
    setIsVisitorEmailOpen(false);
  };

  const handleOpenNewCustomerModal = (
    target: 'caller' | 'visitor',
    prefillPhone?: string,
    prefillEmail?: string
  ) => {
    const nextCodeNum = String(customerProfiles.length + 90).padStart(3, '0');
    setNewCustForm({
      phone: prefillPhone ?? (target === 'caller' ? callerPhoneQuery : visitorPhoneQuery),
      email: prefillEmail ?? (target === 'caller' ? callerEmailQuery : visitorEmailQuery),
      customerName: '',
      customerCode: `KH-2026-${nextCodeNum}`,
      cccd: '',
      province: 'TP. Hồ Chí Minh',
      ward: '',
      companyName: '',
      position: '',
      taxCode: '',
      vehiclePlate: '',
      vehicleCarModel: 'Mazda - CX-5',
    });
    setNewCustError('');
    setNewCustomerTarget(target);
  };

  const handleSaveNewCustomerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.phone.trim() || !newCustForm.customerName.trim()) {
      setNewCustError('Vui lòng nhập Số điện thoại và Tên khách hàng.');
      return;
    }
    const newVehicles: BookingCustomerVehicle[] = [];
    if (newCustForm.vehiclePlate.trim()) {
      const cleanPlate = newCustForm.vehiclePlate.trim();
      const cleanModel = newCustForm.vehicleCarModel.trim() || 'Mazda - CX-5';
      PLATE_TO_CAR_MODEL_MAP[cleanPlate] = cleanModel;
      newVehicles.push({
        plate: cleanPlate,
        carModel: cleanModel,
      });
    }
    const createdProfile: BookingCustomerProfile = {
      id: `bcp-${Date.now()}`,
      phone: newCustForm.phone.trim(),
      email: newCustForm.email.trim(),
      customerName: newCustForm.customerName.trim(),
      customerCode:
        newCustForm.customerCode.trim() ||
        `KH-2026-${String(customerProfiles.length + 90).padStart(3, '0')}`,
      cccd: newCustForm.cccd.trim() || '--',
      province: newCustForm.province.trim() || '--',
      ward: newCustForm.ward.trim() || '--',
      companyName: newCustForm.companyName.trim() || '--',
      position: newCustForm.position.trim() || '--',
      taxCode: newCustForm.taxCode.trim() || '--',
      vehicles: newVehicles,
    };

    setCustomerProfiles((prev) => [createdProfile, ...prev]);
    if (newCustomerTarget === 'caller') {
      handleSelectCallerCustomer(createdProfile);
    } else if (newCustomerTarget === 'visitor') {
      handleSelectVisitorCustomer(createdProfile);
    }
    setNewCustomerTarget(null);
  };

  const handleToggleAddLicensePlate = (plate: string) => {
    setAddBookingLicensePlates((prev) =>
      prev.includes(plate) ? prev.filter((p) => p !== plate) : [...prev, plate]
    );
  };

  const handleToggleAddCarModel = (model: string) => {
    setAddBookingCarModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleToggleAddSuggestedTag = (tag: string) => {
    setAddBookingSuggestedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleConfirmCreateFullScreenBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBookingDate.trim() || !addBookingTimeSlot.trim()) {
      setAddBookingError(
        'Vui lòng nhập đầy đủ Ngày hẹn và Khung giờ hẹn.'
      );
      return;
    }

    const effectiveVisitor = isSameAsCaller ? selectedCaller : selectedVisitor;
    const effectiveName =
      effectiveVisitor?.customerName ||
      selectedCaller?.customerName ||
      defaultPotentialCustomer?.fullName ||
      'Khách hàng mới';
    const effectivePhone =
      (isSameAsCaller ? callerPhoneQuery : visitorPhoneQuery).trim() ||
      effectiveVisitor?.phone ||
      selectedCaller?.phone ||
      '';

    if (!effectivePhone) {
      setAddBookingError(
        'Vui lòng chọn hoặc nhập Số điện thoại khách hàng.'
      );
      return;
    }

    const finalPlates = Array.from(
      new Set([
        ...addBookingLicensePlates,
        ...(addBookingPlateInput.trim() ? [addBookingPlateInput.trim()] : []),
      ])
    );
    const finalCarModels = Array.from(
      new Set([
        ...addBookingCarModels,
        ...(addBookingCarModelInput.trim()
          ? [addBookingCarModelInput.trim()]
          : []),
      ])
    );

    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === editingBooking.id
            ? {
                ...b,
                licensePlate:
                  finalPlates.length > 0
                    ? finalPlates.join(', ')
                    : 'Chưa cập nhật',
                carModel:
                  finalCarModels.length > 0
                    ? finalCarModels.join(', ')
                    : 'Chưa cập nhật',
                customerName: effectiveName,
                phone: effectivePhone,
                appointmentDate: addBookingDate.trim(),
                appointmentTimeSlot: addBookingTimeSlot.trim(),
                serviceRequest:
                  addBookingServiceRequest.trim() || 'Bảo dưỡng định kỳ',
                suggestedServices:
                  addBookingSuggestedTags.length > 0
                    ? [...addBookingSuggestedTags]
                    : ['Bảo dưỡng định kỳ'],
              }
            : b
        )
      );
      addBookingActivity(
        editingBooking.id,
        'Chỉnh sửa thông tin lịch hẹn',
        `Đã cập nhật thông tin lịch hẹn (${addBookingDate.trim()} • ${addBookingTimeSlot.trim()} • Xe: ${
          finalPlates.length > 0 ? finalPlates.join(', ') : 'Chưa cập nhật'
        })`
      );
      setEditingBooking(null);
      setIsAddModalOpen(false);
      return;
    }

    const nextNum = String(bookings.length + 1).padStart(2, '0');
    const newBooking: CustomerBookingRecord = {
      id: `cb-${Date.now()}`,
      bookingCode: `LH-241027-${nextNum}`,
      licensePlate:
        finalPlates.length > 0 ? finalPlates.join(', ') : 'Chưa cập nhật',
      carModel:
        finalCarModels.length > 0
          ? finalCarModels.join(', ')
          : 'Chưa cập nhật',
      customerName: effectiveName,
      phone: effectivePhone,
      appointmentDate: addBookingDate.trim(),
      appointmentTimeSlot: addBookingTimeSlot.trim(),
      serviceRequest:
        addBookingServiceRequest.trim() || 'Bảo dưỡng định kỳ',
      suggestedServices:
        addBookingSuggestedTags.length > 0
          ? [...addBookingSuggestedTags]
          : ['Bảo dưỡng định kỳ'],
      advisorName: 'Nguyễn Văn Tuấn',
      source: 'Hotline',
      sourceCode: '',
      campaignOrNote: '',
      createdBy: 'Thu Thảo',
      status: 'Chờ xe tới',
      potentialCustomerId: filterPotentialCustomerId,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setIsAddModalOpen(false);
  };

  // Open Edit Modal (Full-screen identical to Thêm mới)
  const handleOpenEditModal = (booking: CustomerBookingRecord) => {
    if (booking.source === 'Mobile App') {
      return;
    }

    const cleanPhone = booking.phone.replace(/\s+/g, '');
    const existingCust = customerProfiles.find(
      (c) =>
        c.phone.replace(/\s+/g, '') === cleanPhone ||
        c.customerName.trim().toLowerCase() ===
          booking.customerName.trim().toLowerCase()
    );

    const parsedPlates =
      booking.licensePlate && booking.licensePlate !== 'Chưa cập nhật'
        ? booking.licensePlate
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const parsedCarModels =
      booking.carModel && booking.carModel !== 'Chưa cập nhật'
        ? booking.carModel
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const fallbackVehicles: BookingCustomerVehicle[] = parsedPlates.map(
      (plate, idx) => ({
        plate,
        carModel:
          PLATE_TO_CAR_MODEL_MAP[plate] ||
          parsedCarModels[idx] ||
          parsedCarModels[0] ||
          'Mazda - CX-5',
      })
    );

    const resolvedProfile: BookingCustomerProfile = existingCust || {
      id: `bcp-edit-${booking.id}`,
      phone: booking.phone,
      email: getDefaultEmailForRecord(booking),
      customerName: booking.customerName,
      customerCode: 'KH-2026-089',
      cccd: '079090001234',
      province: 'TP. Hồ Chí Minh',
      ward: 'Phường Tân Phong, Quận 7',
      companyName: '--',
      position: '--',
      taxCode: '--',
      vehicles: fallbackVehicles,
    };

    setEditingBooking(booking);

    setSelectedCaller(resolvedProfile);
    setCallerPhoneQuery(resolvedProfile.phone);
    setCallerEmailQuery(resolvedProfile.email);
    setIsCallerPhoneOpen(false);
    setIsCallerEmailOpen(false);

    setIsSameAsCaller(true);
    setSelectedVisitor(resolvedProfile);
    setVisitorPhoneQuery(resolvedProfile.phone);
    setVisitorEmailQuery(resolvedProfile.email);
    setIsVisitorPhoneOpen(false);
    setIsVisitorEmailOpen(false);

    setAddBookingLicensePlates(parsedPlates);
    setAddBookingPlateInput('');
    setIsAddPlateDropdownOpen(false);

    setAddBookingCarModels(parsedCarModels);
    setAddBookingCarModelInput('');
    setIsAddCarModelDropdownOpen(false);

    setAddBookingDate(booking.appointmentDate);
    setAddBookingTimeSlot(booking.appointmentTimeSlot);
    setAddBookingServiceRequest(booking.serviceRequest);
    setAddBookingSuggestedTags(
      booking.suggestedServices && booking.suggestedServices.length > 0
        ? [...booking.suggestedServices]
        : ['Bảo dưỡng định kỳ']
    );
    setAddBookingError('');
    setNewCustomerTarget(null);

    setIsAddModalOpen(true);
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
      potentialCustomerId:
        editingBooking?.potentialCustomerId ?? filterPotentialCustomerId,
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
      'Khách hàng',
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
              (cols[10] as BookingSourceType) || 'Module Khách hàng quan tâm',
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

  const renderSourceCell = (source: BookingSourceType, createdBy?: string) => {
    switch (source) {
      case 'Module Khách hàng quan tâm':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0070E0] border border-[#004C99] inline-block shrink-0" />
            <span>Module Khách hàng quan tâm</span>
          </div>
        );
      case 'Hotline':
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2 font-bold text-gray-800">
              <span className="text-sm leading-none">📞</span>
              <span>Hotline</span>
            </div>
            {createdBy && (
              <div className="text-xs text-gray-700 font-medium pl-6">
                {createdBy}
              </div>
            )}
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
    const target = bookings.find((b) => b.id === id);
    if (target && target.status !== newStatus) {
      addBookingActivity(
        id,
        'Thay đổi trạng thái',
        `Chuyển trạng thái lịch hẹn từ "${target.status}" sang "${newStatus}"`
      );
    }
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
      case 'Đã hủy':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-white border border-gray-800 inline-block shrink-0" />
            <span>Đã hủy</span>
          </div>
        );
      case 'Đã hủy bởi Garage':
        return (
          <div className="inline-flex items-center gap-2 font-bold text-gray-800">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-gray-800 inline-block shrink-0" />
            <span>Đã hủy bởi Garage</span>
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
                <th className="py-4 px-4 whitespace-nowrap">Hành động</th>
                <th className="py-4 px-4 whitespace-nowrap">Mã lịch hẹn</th>
                <th className="py-4 px-4 whitespace-nowrap">Nguồn tạo</th>
                <th className="py-4 px-4 whitespace-nowrap">
                  Mã nguồn / Chiến dịch
                </th>
                <th className="py-4 px-4 whitespace-nowrap">Khách hàng</th>
                <th className="py-4 px-4 whitespace-nowrap">Số điện thoại</th>
                <th className="py-4 px-4 whitespace-nowrap">Thời gian hẹn</th>
                <th className="py-4 px-4 whitespace-nowrap">Yêu cầu Dịch vụ</th>
                <th className="py-4 px-4 whitespace-nowrap">Dịch vụ gợi ý</th>
                <th className="py-4 px-4 whitespace-nowrap">
                  Biển số xe &amp; Dòng xe
                </th>
                <th className="py-4 px-4 whitespace-nowrap">Trạng thái</th>
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

                    {/* Hành động */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <button
                          type="button"
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                          title="Gửi Email"
                          onClick={() => openEmailModalForRecord(booking)}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-[#0068FF] hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                          title="Gửi Zalo"
                          onClick={() => {
                            setSelectedZaloRecord(booking);
                            setZaloContent(getZaloDefaultContent(booking));
                            setZaloAttachments([]);
                            setZaloModalOpen(true);
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        {(() => {
                          const isMobileAppLocked =
                            booking.source === 'Mobile App';
                          return (
                            <span
                              className="relative inline-flex items-center gap-0.5 p-0.5"
                              onMouseEnter={(e) => {
                                if (!isMobileAppLocked) return;
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const tooltipHeight = 200;
                                const placeAbove =
                                  rect.bottom + tooltipHeight >
                                  window.innerHeight - 16;
                                setHoveredLockedEditBooking({
                                  id: booking.id,
                                  top: placeAbove
                                    ? Math.max(12, rect.top - tooltipHeight - 8)
                                    : rect.bottom + 8,
                                  left: Math.min(
                                    window.innerWidth - 420,
                                    Math.max(12, rect.left)
                                  ),
                                });
                              }}
                              onMouseLeave={() =>
                                setHoveredLockedEditBooking((prev) =>
                                  prev?.id === booking.id ? null : prev
                                )
                              }
                            >
                              <button
                                type="button"
                                disabled={isMobileAppLocked}
                                onClick={() => handleOpenEditModal(booking)}
                                className={`p-1 rounded-md transition-all ${
                                  isMobileAppLocked
                                    ? 'opacity-40 grayscale cursor-not-allowed bg-gray-100'
                                    : 'hover:scale-110 cursor-pointer'
                                }`}
                                title={
                                  isMobileAppLocked ? undefined : 'Chỉnh sửa'
                                }
                              >
                                ✏️
                              </button>
                              {isMobileAppLocked && (
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 border border-amber-300 text-[11px] font-black leading-none shrink-0 cursor-help">
                                  !
                                </span>
                              )}
                            </span>
                          );
                        })()}
                        {(() => {
                          const isCancelledByGarage =
                            Boolean(booking.cancelledByGarage) ||
                            booking.status === 'Đã hủy bởi Garage';
                          const showDetailedGarageCancelTooltip =
                            isCancelledByGarage &&
                            booking.source === 'Mobile App';
                          return (
                            <span
                              className="relative group inline-flex items-center gap-0.5"
                              title={
                                showDetailedGarageCancelTooltip
                                  ? undefined
                                  : isCancelledByGarage
                                  ? 'Hủy lịch bởi Garage'
                                  : 'Hủy lịch'
                              }
                              onMouseEnter={(e) => {
                                if (!showDetailedGarageCancelTooltip) return;
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const tooltipHeight = 265;
                                const placeAbove =
                                  rect.bottom + tooltipHeight >
                                  window.innerHeight - 16;
                                setHoveredCancelledByGarageBooking({
                                  id: booking.id,
                                  top: placeAbove
                                    ? Math.max(12, rect.top - tooltipHeight - 8)
                                    : rect.bottom + 8,
                                  left: Math.min(
                                    window.innerWidth - 436,
                                    Math.max(12, rect.left - 180)
                                  ),
                                });
                              }}
                              onMouseLeave={() =>
                                setHoveredCancelledByGarageBooking((prev) =>
                                  prev?.id === booking.id ? null : prev
                                )
                              }
                            >
                              <button
                                type="button"
                                disabled={isCancelledByGarage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  isCancelledByGarage
                                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                                    : 'text-red-600 hover:bg-red-100 cursor-pointer'
                                }`}
                                title={
                                  showDetailedGarageCancelTooltip
                                    ? undefined
                                    : isCancelledByGarage
                                    ? 'Hủy lịch bởi Garage'
                                    : 'Hủy lịch'
                                }
                                onClick={() => openCancelBookingModal(booking)}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              {showDetailedGarageCancelTooltip && (
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 border border-amber-300 text-[11px] font-black leading-none shrink-0 cursor-help">
                                  !
                                </span>
                              )}
                              {isCancelledByGarage &&
                                !showDetailedGarageCancelTooltip && (
                                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-900 text-white whitespace-nowrap shadow-lg z-30">
                                    Hủy lịch bởi Garage
                                  </span>
                                )}
                            </span>
                          );
                        })()}
                        <button
                          type="button"
                          className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
                          title="Lịch sử hoạt động"
                          onClick={() => {
                            setActivityHistoryBookingRecord(booking);
                            setActiveActivityTab('activity_history');
                            setBookingNoteContent('');
                            setBookingTaskContent('');
                            setEditingBookingTaskId(null);
                          }}
                        >
                          <History className="w-4 h-4" />
                        </button>
                        {(() => {
                          const uncompletedCount =
                            bookingTasks[booking.id]?.filter(
                              (t) => !t.completed
                            ).length || 0;
                          return (
                            <button
                              type="button"
                              className={`relative flex items-center justify-center p-1.5 rounded-md transition-colors cursor-pointer ${
                                uncompletedCount > 0
                                  ? 'text-orange-500 hover:bg-orange-100'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title="Lời nhắc chưa hoàn thành"
                              onClick={() => {
                                setActivityHistoryBookingRecord(booking);
                                setActiveActivityTab('tasks');
                                setBookingNoteContent('');
                                setBookingTaskContent('');
                                setEditingBookingTaskId(null);
                              }}
                            >
                              <Hourglass className="w-4 h-4" />
                              {uncompletedCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                  {uncompletedCount}
                                </span>
                              )}
                            </button>
                          );
                        })()}
                      </div>
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
                      {renderSourceCell(
                        booking.source,
                        booking.createdBy ||
                          (booking.source === 'Hotline'
                            ? booking.campaignOrNote.replace(/^Sales:\s*/i, '')
                            : undefined)
                      )}
                    </td>

                    {/* Mã nguồn / Chiến dịch */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {booking.source === 'Hotline' ? null : booking.source ===
                        'Mobile App' ? (
                        <a
                          href="https://apps.apple.com/us/app/dumuc/id6813362339"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#1A73E8] hover:underline font-medium"
                          onMouseEnter={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const tooltipHeight = 110;
                            const placeAbove =
                              rect.bottom + tooltipHeight >
                              window.innerHeight - 16;
                            setHoveredAppDuMucBooking({
                              id: booking.id,
                              top: placeAbove
                                ? Math.max(12, rect.top - tooltipHeight - 8)
                                : rect.bottom + 8,
                              left: Math.max(
                                12,
                                Math.min(window.innerWidth - 760, rect.left)
                              ),
                            });
                          }}
                          onMouseLeave={() =>
                            setHoveredAppDuMucBooking((prev) =>
                              prev?.id === booking.id ? null : prev
                            )
                          }
                        >
                          <span>App Du Muc</span>
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 border border-amber-300 text-[11px] font-black leading-none shrink-0">
                            !
                          </span>
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

                    {/* Khách hàng */}
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
                      <div className="space-y-2.5">
                        {/* Phần 1: Biển số xe riêng (hiển thị "Biển số xe - Hiệu xe - Dòng xe", cho phép nhấn vào để xem) */}
                        <div>
                          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Biển số xe
                          </div>
                          {!booking.licensePlate ||
                          booking.licensePlate === 'Chưa cập nhật' ? (
                            <span className="text-xs text-gray-400 italic">
                              Chưa cập nhật
                            </span>
                          ) : (
                            <div className="flex flex-col items-start gap-1">
                              {booking.licensePlate
                                .split(',')
                                .map((p) => p.trim())
                                .filter(Boolean)
                                .map((rawPlate, idx) => {
                                  const firstCarModel =
                                    booking.carModel &&
                                    booking.carModel !== 'Chưa cập nhật'
                                      ? booking.carModel.split(',')[0].trim()
                                      : 'Mazda - CX-5';
                                  const brandModel =
                                    PLATE_TO_CAR_MODEL_MAP[rawPlate] ||
                                    (firstCarModel.includes(' - ')
                                      ? firstCarModel
                                      : firstCarModel.replace(/\s+/, ' - '));
                                  const fullLabel =
                                    rawPlate.split(' - ').length >= 3
                                      ? rawPlate
                                      : `${rawPlate} - ${brandModel}`;
                                  return (
                                    <button
                                      key={`${rawPlate}-${idx}`}
                                      type="button"
                                      onClick={() =>
                                        setViewingPlateInfo({
                                          fullLabel,
                                          plate: rawPlate,
                                          brandModel,
                                          booking,
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/70 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 rounded-md font-bold text-xs transition-colors cursor-pointer text-left"
                                      title="Nhấn vào để xem chi tiết xe"
                                    >
                                      <span>{fullLabel}</span>
                                    </button>
                                  );
                                })}
                            </div>
                          )}
                        </div>

                        {/* Phần 2: Dòng xe riêng (chỉ hiển thị, không nhấn vào để xem, cho phép copy từng dòng xe) */}
                        <div className="pt-1.5 border-t border-gray-100">
                          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Dòng xe
                          </div>
                          {!booking.carModel ||
                          booking.carModel === 'Chưa cập nhật' ? (
                            <span className="text-xs text-gray-400 italic">
                              Chưa cập nhật
                            </span>
                          ) : (
                            <div className="flex flex-col items-start gap-1">
                              {booking.carModel
                                .split(',')
                                .map((m) => m.trim())
                                .filter(Boolean)
                                .map((singleModel, mIdx) => {
                                  const copyKey = `${booking.id}-${mIdx}`;
                                  return (
                                    <div
                                      key={copyKey}
                                      className="inline-flex items-center gap-1.5"
                                    >
                                      <span className="text-xs text-gray-700 font-medium select-all">
                                        {singleModel}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard?.writeText(
                                            singleModel
                                          );
                                          setCopiedCarModelKey(copyKey);
                                          setTimeout(() => {
                                            setCopiedCarModelKey((prev) =>
                                              prev === copyKey ? null : prev
                                            );
                                          }, 1500);
                                        }}
                                        className="p-0.5 text-gray-400 hover:text-[#1A73E8] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                        title={`Copy "${singleModel}"`}
                                      >
                                        {copiedCarModelKey === copyKey ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
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
                            : booking.status === 'Đã hủy'
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : booking.status === 'Đã hủy bởi Garage'
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
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

      {/* View Plate Info Right-Half Screen Drawer (khi nhấn vào Biển số xe - Hiệu xe - Dòng xe) */}
      {viewingPlateInfo &&
        (() => {
          const parts = viewingPlateInfo.brandModel
            .split(' - ')
            .map((s) => s.trim());
          const brandText = parts[0] || '__';
          const modelText = parts.slice(1).join(' - ') || '__';

          const roRecords = [
            {
              id: 'ro-1',
              roNumber: '2601-000063',
              entryDate: '20/01/2026 15:30',
              status: 'Đã bàn giao' as const,
              quoteAmount: 340000,
              totalSpent: 340000,
              debtAmount: 0,
              advisor: '',
              requestContent: '',
            },
            {
              id: 'ro-2',
              roNumber: '4',
              entryDate: '31/03/2026 14:52',
              status: 'Hoàn thành' as const,
              quoteAmount: 1512000,
              totalSpent: 1624000,
              debtAmount: 1624000,
              advisor: '',
              requestContent: '',
            },
          ];

          const completedCount = roRecords.filter(
            (r) => r.status === 'Hoàn thành'
          ).length;
          const visibleROs = onlyCompletedRO
            ? roRecords.filter((r) => r.status === 'Hoàn thành')
            : roRecords;

          const totalQuote = visibleROs.reduce(
            (sum, r) => sum + r.quoteAmount,
            0
          );
          const totalSpent = visibleROs.reduce(
            (sum, r) => sum + r.totalSpent,
            0
          );
          const totalDebt = visibleROs.reduce(
            (sum, r) => sum + r.debtAmount,
            0
          );

          return (
            <div
              className="fixed inset-0 bg-black/35 z-60 flex justify-end"
              onClick={() => {
                setViewingPlateInfo(null);
                setOnlyCompletedRO(false);
              }}
            >
              <div
                className="bg-white w-[76vw] max-w-[1200px] min-w-[860px] h-screen shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Header & Summary Info matching screenshot */}
                <div className="px-5 pt-4 pb-3 bg-white flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-8 text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-gray-500">Biển số</span>
                        <span className="text-gray-900 font-medium">
                          {viewingPlateInfo.plate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-gray-500">Hiệu xe</span>
                        <span className="text-gray-900 font-medium">
                          {brandText}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-gray-500">Loại xe</span>
                        <span className="text-gray-900 font-medium">
                          {modelText}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setViewingPlateInfo(null);
                        setOnlyCompletedRO(false);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Đóng"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-gray-500">Tổng RO</span>
                      <span className="text-gray-900 font-medium">
                        {roRecords.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-gray-500">RO hoàn thành</span>
                      <span className="text-[#1A73E8] font-medium">
                        {completedCount}
                      </span>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={onlyCompletedRO}
                        onChange={(e) => setOnlyCompletedRO(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-400 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                      />
                      <span className="text-gray-800">
                        Chỉ hiển RO hoàn thành
                      </span>
                    </label>
                  </div>
                </div>

                {/* RO Table matching screenshot (fits 100% without horizontal scroll) */}
                <div className="px-4 pb-6 flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="border border-[#D5E1EF] rounded-t-md overflow-hidden">
                    <table className="w-full table-auto text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#EEF4FB] text-gray-800 border-b border-[#D5E1EF]">
                          <th className="py-2.5 px-2.5 text-left font-medium border-r border-[#D5E1EF] whitespace-nowrap w-12">
                            <div className="flex items-center justify-between gap-1">
                              <span>STT</span>
                              <span className="text-[#D97706] text-[10px]">
                                📌
                              </span>
                            </div>
                          </th>
                          <th className="py-2.5 px-2.5 text-left font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            <div className="flex items-center justify-between gap-1">
                              <span>Số RO</span>
                              <span className="text-[#D97706] text-[10px]">
                                📌
                              </span>
                            </div>
                          </th>
                          <th className="py-2.5 px-2.5 text-left font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Ngày vào xưởng
                          </th>
                          <th className="py-2.5 px-2.5 text-center font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Trạng thái
                          </th>
                          <th className="py-2.5 px-2.5 text-right font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Tổng tiền báo giá
                          </th>
                          <th className="py-2.5 px-2.5 text-right font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Tổng chi tiêu
                          </th>
                          <th className="py-2.5 px-2.5 text-right font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Công nợ
                          </th>
                          <th className="py-2.5 px-2.5 text-left font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Cố vấn garage
                          </th>
                          <th className="py-2.5 px-2.5 text-left font-medium border-r border-[#D5E1EF] whitespace-nowrap">
                            Nội dung yêu cầu
                          </th>
                          <th className="py-2.5 px-2 w-6"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* TỔNG CỘNG Row */}
                        <tr className="bg-[#F4F8FC] border-b border-[#D5E1EF]">
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF]"></td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF] text-[#1A73E8] font-medium whitespace-nowrap">
                            TỔNG CỘNG
                          </td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF]"></td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF]"></td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF] text-right text-[#1A73E8] font-medium whitespace-nowrap">
                            {totalQuote.toLocaleString('en-US')}
                          </td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF] text-right text-[#1A73E8] font-medium whitespace-nowrap">
                            {totalSpent.toLocaleString('en-US')}
                          </td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF] text-right text-[#C92A2A] font-medium whitespace-nowrap">
                            {totalDebt > 0
                              ? totalDebt.toLocaleString('en-US')
                              : ''}
                          </td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF]"></td>
                          <td className="py-2.5 px-2.5 border-r border-[#D5E1EF]"></td>
                          <td className="py-2.5 px-2"></td>
                        </tr>

                        {/* Data Rows */}
                        {visibleROs.map((ro, idx) => (
                          <tr
                            key={ro.id}
                            className="border-b border-[#E5ECF4] hover:bg-gray-50/60"
                          >
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-gray-900">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-[#1A73E8] whitespace-nowrap">
                              {ro.roNumber}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-gray-900 whitespace-nowrap">
                              {ro.entryDate}
                            </td>
                            <td className="py-2.5 px-2.5 border-r border-[#E5ECF4] text-center whitespace-nowrap">
                              {ro.status === 'Đã bàn giao' ? (
                                <span className="inline-block px-3 py-0.5 rounded-full bg-[#E6FAEA] text-[#22C55E] border border-[#6EE787] text-xs">
                                  Đã bàn giao
                                </span>
                              ) : (
                                <span className="inline-block px-3 py-0.5 rounded-full bg-[#E6F4F7] text-[#1790A7] border border-[#4EA8B8] text-xs">
                                  Hoàn thành
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-right text-gray-900 whitespace-nowrap">
                              {ro.quoteAmount.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-right text-gray-900 whitespace-nowrap">
                              {ro.totalSpent.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-right text-[#C92A2A] whitespace-nowrap">
                              {ro.debtAmount > 0
                                ? ro.debtAmount.toLocaleString('en-US')
                                : ''}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-gray-800">
                              {ro.advisor}
                            </td>
                            <td className="py-3 px-2.5 border-r border-[#E5ECF4] text-gray-800">
                              {ro.requestContent}
                            </td>
                            <td className="py-3 px-2"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
                <div>
                  {renderSourceCell(
                    viewingBooking.source,
                    viewingBooking.createdBy
                  )}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Mã nguồn / Chiến dịch
                </div>
                <div className="font-semibold text-gray-800">
                  {viewingBooking.source === 'Hotline'
                    ? ''
                    : `${viewingBooking.sourceCode} - ${viewingBooking.campaignOrNote}`}
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
              {viewingBooking.source !== 'Mobile App' && (
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
              )}
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

      {/* Full-Screen Add Booking Modal ("Thêm mới") */}
      {isAddModalOpen &&
        (() => {
          const normalizeStr = (s: string) => s.trim().toLowerCase();

          // Filter lists for "Khách hàng gọi"
          const isCallerPhoneExactSelected =
            selectedCaller &&
            normalizeStr(callerPhoneQuery) ===
              normalizeStr(selectedCaller.phone);
          const filteredCallerByPhone = customerProfiles.filter((c) => {
            if (!callerPhoneQuery.trim() || isCallerPhoneExactSelected)
              return true;
            const q = normalizeStr(callerPhoneQuery);
            const qDigits = q.replace(/\s+/g, '');
            return (
              c.phone.toLowerCase().includes(q) ||
              c.phone.replace(/\s+/g, '').includes(qDigits) ||
              c.customerName.toLowerCase().includes(q) ||
              c.customerCode.toLowerCase().includes(q)
            );
          });

          const isCallerEmailExactSelected =
            selectedCaller &&
            normalizeStr(callerEmailQuery) ===
              normalizeStr(selectedCaller.email);
          const filteredCallerByEmail = customerProfiles.filter((c) => {
            if (!callerEmailQuery.trim() || isCallerEmailExactSelected)
              return true;
            const q = normalizeStr(callerEmailQuery);
            return (
              c.email.toLowerCase().includes(q) ||
              c.customerName.toLowerCase().includes(q) ||
              c.customerCode.toLowerCase().includes(q)
            );
          });

          // Effective visitor customer for Cột 1 & Cột 2
          const activeVisitor = isSameAsCaller
            ? selectedCaller
            : selectedVisitor;
          const displayVisitorPhone = isSameAsCaller
            ? callerPhoneQuery
            : visitorPhoneQuery;
          const displayVisitorEmail = isSameAsCaller
            ? callerEmailQuery
            : visitorEmailQuery;

          // Filter lists for Cột 1 "Thông tin Khách hàng đến" (when un-ticked)
          const isVisitorPhoneExactSelected =
            selectedVisitor &&
            normalizeStr(visitorPhoneQuery) ===
              normalizeStr(selectedVisitor.phone);
          const filteredVisitorByPhone = customerProfiles.filter((c) => {
            if (!visitorPhoneQuery.trim() || isVisitorPhoneExactSelected)
              return true;
            const q = normalizeStr(visitorPhoneQuery);
            const qDigits = q.replace(/\s+/g, '');
            return (
              c.phone.toLowerCase().includes(q) ||
              c.phone.replace(/\s+/g, '').includes(qDigits) ||
              c.customerName.toLowerCase().includes(q) ||
              c.customerCode.toLowerCase().includes(q)
            );
          });

          const isVisitorEmailExactSelected =
            selectedVisitor &&
            normalizeStr(visitorEmailQuery) ===
              normalizeStr(selectedVisitor.email);
          const filteredVisitorByEmail = customerProfiles.filter((c) => {
            if (!visitorEmailQuery.trim() || isVisitorEmailExactSelected)
              return true;
            const q = normalizeStr(visitorEmailQuery);
            return (
              c.email.toLowerCase().includes(q) ||
              c.customerName.toLowerCase().includes(q) ||
              c.customerCode.toLowerCase().includes(q)
            );
          });

          // Vehicles for Cột 2
          const callerVehicles = selectedCaller?.vehicles || [];
          const visitorVehicles = activeVisitor?.vehicles || [];

          // All known license plates for Cột 3 dropdown ("cho phép chọn thêm")
          const allKnownVehiclesMap = new Map<string, string>();
          Object.entries(PLATE_TO_CAR_MODEL_MAP).forEach(([plate, model]) => {
            allKnownVehiclesMap.set(plate, model);
          });
          customerProfiles.forEach((c) => {
            c.vehicles.forEach((v) => {
              allKnownVehiclesMap.set(v.plate, v.carModel);
            });
          });
          const allPlateOptions = Array.from(allKnownVehiclesMap.entries()).map(
            ([plate, carModel]) => ({ plate, carModel })
          );
          const filteredPlateOptions = allPlateOptions.filter((item) => {
            if (!addBookingPlateInput.trim()) return true;
            const q = normalizeStr(addBookingPlateInput);
            return (
              item.plate.toLowerCase().includes(q) ||
              item.carModel.toLowerCase().includes(q)
            );
          });

          const filteredCarModelOptions = BOOKING_MASTER_CAR_MODELS.filter(
            (m) => {
              if (!addBookingCarModelInput.trim()) return true;
              return m
                .toLowerCase()
                .includes(normalizeStr(addBookingCarModelInput));
            }
          );

          return (
            <div className="fixed inset-0 bg-[#F8FAFC] z-70 flex flex-col w-screen h-screen overflow-hidden font-sans">
              {/* Top Header */}
              <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1A73E8] border border-blue-200 flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingBooking
                        ? `Chỉnh sửa Lịch hẹn Khách đặt (${editingBooking.bookingCode})`
                        : 'Thêm mới Lịch hẹn Khách đặt'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Nhập thông tin Khách hàng gọi và Thông tin Lịch hẹn Khách đặt
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingBooking(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Main Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* KHU VỰC 1: KHÁCH HÀNG GỌI */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
                    <User className="w-4 h-4 text-[#1A73E8]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Khách hàng gọi
                    </h3>
                  </div>

                  {/* Row 1: Searchable Số điện thoại & Email (Cho phép gõ vào, search, list ra danh sách, Thêm mới nếu chưa có) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Số điện thoại */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          Số điện thoại
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenNewCustomerModal(
                              'caller',
                              callerPhoneQuery,
                              callerEmailQuery
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A73E8] hover:text-blue-700 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Thêm mới
                        </button>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Gõ số điện thoại để tìm kiếm hoặc thêm mới..."
                          value={callerPhoneQuery}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCallerPhoneQuery(val);
                            setIsCallerPhoneOpen(true);
                            const exact = customerProfiles.find(
                              (c) =>
                                c.phone.replace(/\s+/g, '') ===
                                val.trim().replace(/\s+/g, '')
                            );
                            if (exact) {
                              setSelectedCaller(exact);
                              setCallerEmailQuery(exact.email);
                              if (isSameAsCaller) {
                                setSelectedVisitor(exact);
                                setVisitorPhoneQuery(exact.phone);
                                setVisitorEmailQuery(exact.email);
                              }
                            } else if (!val.trim()) {
                              setSelectedCaller(null);
                              if (isSameAsCaller) {
                                setSelectedVisitor(null);
                                setVisitorPhoneQuery('');
                              }
                            }
                          }}
                          onFocus={() => setIsCallerPhoneOpen(true)}
                          onBlur={() =>
                            setTimeout(() => setIsCallerPhoneOpen(false), 200)
                          }
                          className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>

                      {isCallerPhoneOpen && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
                          {filteredCallerByPhone.length === 0 ? (
                            <div className="px-3.5 py-2 text-xs text-gray-500">
                              Không tìm thấy khách hàng phù hợp
                            </div>
                          ) : (
                            filteredCallerByPhone.map((cust) => {
                              const isSelected = selectedCaller?.id === cust.id;
                              return (
                                <div
                                  key={cust.id}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectCallerCustomer(cust);
                                  }}
                                  className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected ? 'bg-blue-50/50' : ''
                                  }`}
                                >
                                  <div>
                                    <span className="font-bold text-emerald-700">
                                      {cust.phone}
                                    </span>{' '}
                                    -{' '}
                                    <span className="font-bold text-gray-900">
                                      {cust.customerName}
                                    </span>{' '}
                                    <span className="text-gray-400">
                                      ({cust.customerCode})
                                    </span>
                                  </div>
                                  <span className="text-gray-500 truncate max-w-[180px]">
                                    {cust.email}
                                  </span>
                                </div>
                              );
                            })
                          )}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIsCallerPhoneOpen(false);
                              handleOpenNewCustomerModal(
                                'caller',
                                callerPhoneQuery,
                                callerEmailQuery
                              );
                            }}
                            className="px-3.5 py-2 text-xs text-[#1A73E8] bg-blue-50/60 hover:bg-blue-100/70 cursor-pointer font-semibold border-t border-gray-100 flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>
                              Thêm mới khách hàng
                              {callerPhoneQuery.trim()
                                ? ` với SĐT "${callerPhoneQuery.trim()}"`
                                : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          Email
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenNewCustomerModal(
                              'caller',
                              callerPhoneQuery,
                              callerEmailQuery
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A73E8] hover:text-blue-700 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Thêm mới
                        </button>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Gõ email để tìm kiếm hoặc thêm mới..."
                          value={callerEmailQuery}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCallerEmailQuery(val);
                            setIsCallerEmailOpen(true);
                            const exact = customerProfiles.find(
                              (c) =>
                                c.email.toLowerCase() ===
                                val.trim().toLowerCase()
                            );
                            if (exact) {
                              setSelectedCaller(exact);
                              setCallerPhoneQuery(exact.phone);
                              if (isSameAsCaller) {
                                setSelectedVisitor(exact);
                                setVisitorPhoneQuery(exact.phone);
                                setVisitorEmailQuery(exact.email);
                              }
                            } else if (!val.trim()) {
                              setSelectedCaller(null);
                              if (isSameAsCaller) {
                                setSelectedVisitor(null);
                                setVisitorEmailQuery('');
                              }
                            }
                          }}
                          onFocus={() => setIsCallerEmailOpen(true)}
                          onBlur={() =>
                            setTimeout(() => setIsCallerEmailOpen(false), 200)
                          }
                          className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>

                      {isCallerEmailOpen && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
                          {filteredCallerByEmail.length === 0 ? (
                            <div className="px-3.5 py-2 text-xs text-gray-500">
                              Không tìm thấy email khách hàng phù hợp
                            </div>
                          ) : (
                            filteredCallerByEmail.map((cust) => {
                              const isSelected = selectedCaller?.id === cust.id;
                              return (
                                <div
                                  key={cust.id}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectCallerCustomer(cust);
                                  }}
                                  className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected ? 'bg-blue-50/50' : ''
                                  }`}
                                >
                                  <div>
                                    <span className="font-bold text-[#1A73E8]">
                                      {cust.email}
                                    </span>{' '}
                                    -{' '}
                                    <span className="font-bold text-gray-900">
                                      {cust.customerName}
                                    </span>
                                  </div>
                                  <span className="text-emerald-700 font-semibold">
                                    {cust.phone}
                                  </span>
                                </div>
                              );
                            })
                          )}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIsCallerEmailOpen(false);
                              handleOpenNewCustomerModal(
                                'caller',
                                callerPhoneQuery,
                                callerEmailQuery
                              );
                            }}
                            className="px-3.5 py-2 text-xs text-[#1A73E8] bg-blue-50/60 hover:bg-blue-100/70 cursor-pointer font-semibold border-t border-gray-100 flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>
                              Thêm mới khách hàng
                              {callerEmailQuery.trim()
                                ? ` với Email "${callerEmailQuery.trim()}"`
                                : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2 (Read-only): Tên khách hàng, Mã khách hàng, CCCD, Tỉnh / Thành phố, Xã / Phường */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.customerName || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Mã khách hàng
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.customerCode || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-semibold text-[#1A73E8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        CCCD
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.cccd || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tỉnh / Thành phố
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.province || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Xã / Phường
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.ward || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 3 (Read-only): Tên công ty, Chức vụ, Mã số thuế */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tên công ty
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.companyName || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Chức vụ
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.position || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Mã số thuế
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCaller?.taxCode || ''}
                        placeholder="--"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* KHU VỰC 2: THÔNG TIN LỊCH HẸN KHÁCH ĐẶT (Chia thành 3 cột) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-[#1A73E8]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Thông tin Lịch hẹn Khách đặt
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                    {/* CỘT 1: Thông tin Khách hàng đến */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900">
                          Thông tin Khách hàng đến
                        </h4>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A73E8] bg-blue-50/70 px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isSameAsCaller}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsSameAsCaller(checked);
                              if (checked) {
                                setSelectedVisitor(selectedCaller);
                                setVisitorPhoneQuery(callerPhoneQuery);
                                setVisitorEmailQuery(callerEmailQuery);
                              }
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] cursor-pointer"
                          />
                          <span>Là Khách hàng đang gọi</span>
                        </label>
                      </div>

                      {/* Số điện thoại & Email của Khách hàng đến */}
                      <div className="space-y-3">
                        {/* Số điện thoại (Cho phép Thêm mới nếu chưa có khi un-tick) */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-gray-700">
                              Số điện thoại
                            </label>
                            {!isSameAsCaller && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenNewCustomerModal(
                                    'visitor',
                                    visitorPhoneQuery,
                                    visitorEmailQuery
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A73E8] hover:text-blue-700 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Thêm mới
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="text"
                              readOnly={isSameAsCaller}
                              placeholder={
                                isSameAsCaller
                                  ? 'Tự động lấy từ Khách hàng gọi'
                                  : 'Gõ số điện thoại để tìm kiếm hoặc thêm mới...'
                              }
                              value={displayVisitorPhone}
                              onChange={(e) => {
                                if (isSameAsCaller) return;
                                const val = e.target.value;
                                setVisitorPhoneQuery(val);
                                setIsVisitorPhoneOpen(true);
                                const exact = customerProfiles.find(
                                  (c) =>
                                    c.phone.replace(/\s+/g, '') ===
                                    val.trim().replace(/\s+/g, '')
                                );
                                if (exact) {
                                  setSelectedVisitor(exact);
                                  setVisitorEmailQuery(exact.email);
                                } else if (!val.trim()) {
                                  setSelectedVisitor(null);
                                }
                              }}
                              onFocus={() => {
                                if (!isSameAsCaller) setIsVisitorPhoneOpen(true);
                              }}
                              onBlur={() =>
                                setTimeout(
                                  () => setIsVisitorPhoneOpen(false),
                                  200
                                )
                              }
                              className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm outline-none ${
                                isSameAsCaller
                                  ? 'bg-gray-50 border-gray-200 text-gray-700 font-semibold'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15'
                              }`}
                            />
                            {!isSameAsCaller && (
                              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                            )}
                          </div>

                          {!isSameAsCaller && isVisitorPhoneOpen && (
                            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto py-1">
                              {filteredVisitorByPhone.length === 0 ? (
                                <div className="px-3.5 py-2 text-xs text-gray-500">
                                  Không tìm thấy khách hàng phù hợp
                                </div>
                              ) : (
                                filteredVisitorByPhone.map((cust) => {
                                  const isSelected =
                                    selectedVisitor?.id === cust.id;
                                  return (
                                    <div
                                      key={cust.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectVisitorCustomer(cust);
                                      }}
                                      className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between gap-2 ${
                                        isSelected ? 'bg-blue-50/50' : ''
                                      }`}
                                    >
                                      <div>
                                        <span className="font-bold text-emerald-700">
                                          {cust.phone}
                                        </span>{' '}
                                        -{' '}
                                        <span className="font-bold text-gray-900">
                                          {cust.customerName}
                                        </span>
                                      </div>
                                      <span className="text-gray-400">
                                        {cust.customerCode}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                              <div
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setIsVisitorPhoneOpen(false);
                                  handleOpenNewCustomerModal(
                                    'visitor',
                                    visitorPhoneQuery,
                                    visitorEmailQuery
                                  );
                                }}
                                className="px-3.5 py-2 text-xs text-[#1A73E8] bg-blue-50/60 hover:bg-blue-100/70 cursor-pointer font-semibold border-t border-gray-100 flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  Thêm mới khách hàng
                                  {visitorPhoneQuery.trim()
                                    ? ` với SĐT "${visitorPhoneQuery.trim()}"`
                                    : ''}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Email (cho phép gõ vào, search, list ra danh sách khi un-tick) */}
                        <div className="relative">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="text"
                              readOnly={isSameAsCaller}
                              placeholder={
                                isSameAsCaller
                                  ? 'Tự động lấy từ Khách hàng gọi'
                                  : 'Gõ email để tìm kiếm khách hàng...'
                              }
                              value={displayVisitorEmail}
                              onChange={(e) => {
                                if (isSameAsCaller) return;
                                const val = e.target.value;
                                setVisitorEmailQuery(val);
                                setIsVisitorEmailOpen(true);
                                const exact = customerProfiles.find(
                                  (c) =>
                                    c.email.toLowerCase() ===
                                    val.trim().toLowerCase()
                                );
                                if (exact) {
                                  setSelectedVisitor(exact);
                                  setVisitorPhoneQuery(exact.phone);
                                } else if (!val.trim()) {
                                  setSelectedVisitor(null);
                                }
                              }}
                              onFocus={() => {
                                if (!isSameAsCaller) setIsVisitorEmailOpen(true);
                              }}
                              onBlur={() =>
                                setTimeout(
                                  () => setIsVisitorEmailOpen(false),
                                  200
                                )
                              }
                              className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm outline-none ${
                                isSameAsCaller
                                  ? 'bg-gray-50 border-gray-200 text-gray-700'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15'
                              }`}
                            />
                            {!isSameAsCaller && (
                              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                            )}
                          </div>

                          {!isSameAsCaller && isVisitorEmailOpen && (
                            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto py-1">
                              {filteredVisitorByEmail.length === 0 ? (
                                <div className="px-3.5 py-2 text-xs text-gray-500">
                                  Không tìm thấy email khách hàng phù hợp
                                </div>
                              ) : (
                                filteredVisitorByEmail.map((cust) => {
                                  const isSelected =
                                    selectedVisitor?.id === cust.id;
                                  return (
                                    <div
                                      key={cust.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectVisitorCustomer(cust);
                                      }}
                                      className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between gap-2 ${
                                        isSelected ? 'bg-blue-50/50' : ''
                                      }`}
                                    >
                                      <div>
                                        <span className="font-bold text-[#1A73E8]">
                                          {cust.email}
                                        </span>{' '}
                                        -{' '}
                                        <span className="font-bold text-gray-900">
                                          {cust.customerName}
                                        </span>
                                      </div>
                                      <span className="text-emerald-700 font-semibold">
                                        {cust.phone}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Read-only group 1: Tên khách hàng, Mã khách hàng, CCCD, Tỉnh / Thành phố, Xã / Phường */}
                      <div className="pt-2 border-t border-gray-100 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Tên khách hàng
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.customerName || ''}
                              placeholder="--"
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Mã khách hàng
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.customerCode || ''}
                              placeholder="--"
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-semibold text-[#1A73E8] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              CCCD
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.cccd || ''}
                              placeholder="--"
                              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Tỉnh / Thành phố
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.province || ''}
                              placeholder="--"
                              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Xã / Phường
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.ward || ''}
                              placeholder="--"
                              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Read-only group 2: Tên công ty, Chức vụ, Mã số thuế */}
                      <div className="pt-2 border-t border-gray-100 space-y-2.5">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Tên công ty
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={activeVisitor?.companyName || ''}
                            placeholder="--"
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Chức vụ
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.position || ''}
                              placeholder="--"
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Mã số thuế
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={activeVisitor?.taxCode || ''}
                              placeholder="--"
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CỘT 2: Danh sách Xe sử dụng */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
                        <Car className="w-4 h-4 text-[#1A73E8]" />
                        <h4 className="text-sm font-bold text-gray-900">
                          Danh sách Xe sử dụng
                        </h4>
                      </div>

                      {/* Phần 1: Danh sách Xe của Khách hàng gọi */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-gray-700">
                            Danh sách Xe của Khách hàng gọi
                          </label>
                          {selectedCaller && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              {selectedCaller.customerName}
                            </span>
                          )}
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {callerVehicles.length === 0 ? (
                            <div className="text-xs text-gray-400 italic py-2 text-center">
                              Chưa có dữ liệu xe của Khách hàng gọi
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {callerVehicles.map((vehicle) => {
                                const isTicked =
                                  addBookingLicensePlates.includes(
                                    vehicle.plate
                                  );
                                return (
                                  <button
                                    key={`caller-${vehicle.plate}`}
                                    type="button"
                                    onClick={() =>
                                      handleToggleAddLicensePlate(vehicle.plate)
                                    }
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer text-left ${
                                      isTicked
                                        ? 'bg-blue-50 text-[#1A73E8] border-blue-300 shadow-2xs'
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isTicked}
                                      readOnly
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] pointer-events-none shrink-0"
                                    />
                                    <span>
                                      {vehicle.plate} - {vehicle.carModel}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phần 2: Danh sách Xe của Khách hàng đến */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-gray-700">
                            Danh sách Xe của Khách hàng đến
                          </label>
                          {activeVisitor && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              {activeVisitor.customerName}
                            </span>
                          )}
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {visitorVehicles.length === 0 ? (
                            <div className="text-xs text-gray-400 italic py-2 text-center">
                              Chưa có dữ liệu xe của Khách hàng đến
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {visitorVehicles.map((vehicle) => {
                                const isTicked =
                                  addBookingLicensePlates.includes(
                                    vehicle.plate
                                  );
                                return (
                                  <button
                                    key={`visitor-${vehicle.plate}`}
                                    type="button"
                                    onClick={() =>
                                      handleToggleAddLicensePlate(vehicle.plate)
                                    }
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer text-left ${
                                      isTicked
                                        ? 'bg-blue-50 text-[#1A73E8] border-blue-300 shadow-2xs'
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isTicked}
                                      readOnly
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] pointer-events-none shrink-0"
                                    />
                                    <span>
                                      {vehicle.plate} - {vehicle.carModel}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CỘT 3: Lịch hẹn */}
                    <form
                      onSubmit={handleConfirmCreateFullScreenBooking}
                      className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4"
                    >
                      <div className="pb-2.5 border-b border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900">
                          Lịch hẹn
                        </h4>
                      </div>

                      {addBookingError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                          {addBookingError}
                        </div>
                      )}

                      {/* Field 1: "Biển số xe" (không bắt buộc - cho phép chọn nhiều): cho phép chọn thêm */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Biển số xe{' '}
                          <span className="font-normal text-gray-400">
                            (không bắt buộc - cho phép chọn nhiều)
                          </span>
                        </label>
                        <div className="min-h-[40px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1.5 pr-8 relative">
                          {addBookingLicensePlates.map((plate) => (
                            <span
                              key={plate}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-semibold"
                            >
                              <span>{plate}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleAddLicensePlate(plate)
                                }
                                className="text-[#1A73E8] hover:text-blue-800 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder={
                              addBookingLicensePlates.length === 0
                                ? 'Chọn hoặc nhập thêm biển số xe...'
                                : 'Chọn thêm biển số...'
                            }
                            value={addBookingPlateInput}
                            onChange={(e) => {
                              setAddBookingPlateInput(e.target.value);
                              setIsAddPlateDropdownOpen(true);
                            }}
                            onFocus={() => setIsAddPlateDropdownOpen(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setIsAddPlateDropdownOpen(false),
                                200
                              )
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === 'Enter' &&
                                addBookingPlateInput.trim()
                              ) {
                                e.preventDefault();
                                const val = addBookingPlateInput.trim();
                                if (!addBookingLicensePlates.includes(val)) {
                                  setAddBookingLicensePlates((prev) => [
                                    ...prev,
                                    val,
                                  ]);
                                }
                                setAddBookingPlateInput('');
                              }
                            }}
                            className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent"
                          />
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>

                        {isAddPlateDropdownOpen && (
                          <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto py-1">
                            {filteredPlateOptions.map((item) => {
                              const isSelected =
                                addBookingLicensePlates.includes(item.plate);
                              return (
                                <div
                                  key={item.plate}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleToggleAddLicensePlate(item.plate);
                                    setAddBookingPlateInput('');
                                  }}
                                  className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-blue-50/40 text-[#1A73E8]'
                                      : 'text-gray-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      readOnly
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] pointer-events-none"
                                    />
                                    <span className="font-bold text-gray-900">
                                      {item.plate}
                                    </span>
                                  </div>
                                  <span className="text-gray-500">
                                    {item.carModel}
                                  </span>
                                </div>
                              );
                            })}
                            {addBookingPlateInput.trim() &&
                              !allPlateOptions.some(
                                (item) =>
                                  item.plate.toLowerCase() ===
                                  addBookingPlateInput.trim().toLowerCase()
                              ) && (
                                <div
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    const newPlate =
                                      addBookingPlateInput.trim();
                                    if (
                                      !addBookingLicensePlates.includes(
                                        newPlate
                                      )
                                    ) {
                                      setAddBookingLicensePlates((prev) => [
                                        ...prev,
                                        newPlate,
                                      ]);
                                    }
                                    setAddBookingPlateInput('');
                                    setIsAddPlateDropdownOpen(false);
                                  }}
                                  className="px-3.5 py-2 text-xs text-[#1A73E8] bg-blue-50/50 hover:bg-blue-50 cursor-pointer font-semibold border-t border-gray-100"
                                >
                                  + Chọn thêm biển số mới: &quot;
                                  {addBookingPlateInput.trim()}&quot;
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Field 2: Dòng xe (không bắt buộc - cho phép chọn nhiều) */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Dòng xe{' '}
                          <span className="font-normal text-gray-400">
                            (không bắt buộc - cho phép chọn nhiều)
                          </span>
                        </label>
                        <div className="min-h-[40px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1.5 pr-8 relative">
                          {addBookingCarModels.map((model) => (
                            <span
                              key={model}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-semibold"
                            >
                              <span>{model}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleAddCarModel(model)}
                                className="text-[#1A73E8] hover:text-blue-800 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder={
                              addBookingCarModels.length === 0
                                ? 'Gõ tìm Hiệu xe - Dòng xe...'
                                : 'Thêm dòng xe...'
                            }
                            value={addBookingCarModelInput}
                            onChange={(e) => {
                              setAddBookingCarModelInput(e.target.value);
                              setIsAddCarModelDropdownOpen(true);
                            }}
                            onFocus={() => setIsAddCarModelDropdownOpen(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setIsAddCarModelDropdownOpen(false),
                                200
                              )
                            }
                            className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent"
                          />
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>

                        {isAddCarModelDropdownOpen && (
                          <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto py-1">
                            {filteredCarModelOptions.length === 0 ? (
                              <div className="px-3.5 py-2 text-xs text-gray-500">
                                Không tìm thấy dòng xe phù hợp
                              </div>
                            ) : (
                              filteredCarModelOptions.map((model) => {
                                const isSelected =
                                  addBookingCarModels.includes(model);
                                return (
                                  <div
                                    key={model}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleToggleAddCarModel(model);
                                      setAddBookingCarModelInput('');
                                    }}
                                    className={`px-3.5 py-2 text-xs hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-blue-50/40 text-[#1A73E8]'
                                        : 'text-gray-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] pointer-events-none"
                                      />
                                      <span className="font-medium">
                                        {model}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>

                      {/* Field 3 & 4: Ngày hẹn (bắt buộc nhập) & Khung giờ hẹn (bắt buộc nhập) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Ngày hẹn <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="DD/MM/YYYY"
                              value={addBookingDate}
                              onChange={(e) => {
                                setAddBookingDate(e.target.value);
                                setAddBookingError('');
                              }}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                            />
                            <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Khung giờ hẹn{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="VD: 08:30 - 09:30"
                            value={addBookingTimeSlot}
                            onChange={(e) => {
                              setAddBookingTimeSlot(e.target.value);
                              setAddBookingError('');
                            }}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                          />
                        </div>
                      </div>

                      {/* Field 5: Yêu cầu dịch vụ (dạng text) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Yêu cầu dịch vụ
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Nhập yêu cầu dịch vụ..."
                          value={addBookingServiceRequest}
                          onChange={(e) =>
                            setAddBookingServiceRequest(e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 resize-y"
                        />
                      </div>

                      {/* Field 6: Dịch vụ gợi ý (dạng tags hiển thị sẵn 1 số cái) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Dịch vụ gợi ý
                        </label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex flex-wrap gap-1.5">
                            {BOOKING_SUGGESTED_SERVICE_TAGS.map((tag) => {
                              const isSelected =
                                addBookingSuggestedTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() =>
                                    handleToggleAddSuggestedTag(tag)
                                  }
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-50 text-[#1A73E8] border-blue-300 shadow-2xs'
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <span>{tag}</span>
                                  {isSelected && (
                                    <X className="w-3 h-3 text-[#1A73E8]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Submit Button: Xác nhận Tạo */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddModalOpen(false);
                            setEditingBooking(null);
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                        >
                          <CalendarPlus className="w-4 h-4" />
                          Xác nhận Tạo
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Sub-modal: Thêm mới Khách hàng (khi chưa có) */}
              {newCustomerTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-[#1A73E8]" />
                        <h3 className="text-base font-bold text-gray-900">
                          Thêm mới Khách hàng (
                          {newCustomerTarget === 'caller'
                            ? 'Khách hàng gọi'
                            : 'Khách hàng đến'}
                          )
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewCustomerTarget(null)}
                        className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleSaveNewCustomerProfile}
                      className="p-6 space-y-4"
                    >
                      {newCustError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                          {newCustError}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Số điện thoại{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nhập số điện thoại..."
                            value={newCustForm.phone}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập email..."
                            value={newCustForm.email}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Tên khách hàng{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nhập tên khách hàng..."
                            value={newCustForm.customerName}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                customerName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mã khách hàng
                          </label>
                          <input
                            type="text"
                            value={newCustForm.customerCode}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                customerCode: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            CCCD
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập số CCCD..."
                            value={newCustForm.cccd}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                cccd: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Tỉnh / Thành phố
                          </label>
                          <input
                            type="text"
                            placeholder="VD: TP. Hồ Chí Minh"
                            value={newCustForm.province}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                province: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Xã / Phường
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Phường Tân Phong, Quận 7"
                            value={newCustForm.ward}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                ward: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Tên công ty
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập tên công ty..."
                            value={newCustForm.companyName}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                companyName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Chức vụ
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Giám đốc / Quản lý..."
                            value={newCustForm.position}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                position: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mã số thuế
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập mã số thuế..."
                            value={newCustForm.taxCode}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                taxCode: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Biển số xe (nếu có)
                          </label>
                          <input
                            type="text"
                            placeholder="VD: 51K-999.99"
                            value={newCustForm.vehiclePlate}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                vehiclePlate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Hiệu xe - Dòng xe (nếu có)
                          </label>
                          <select
                            value={newCustForm.vehicleCarModel}
                            onChange={(e) =>
                              setNewCustForm({
                                ...newCustForm,
                                vehicleCarModel: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white"
                          >
                            {BOOKING_MASTER_CAR_MODELS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setNewCustomerTarget(null)}
                          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Lưu Khách hàng
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* Tooltip khi rê chuột vào nút Chỉnh sửa bị khóa (Nguồn tạo = Mobile App) */}
      {hoveredLockedEditBooking && (
        <div
          style={{
            top: hoveredLockedEditBooking.top,
            left: hoveredLockedEditBooking.left,
          }}
          className="fixed z-90 w-[400px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-amber-300 overflow-hidden pointer-events-none"
        >
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
              DỮ LIỆU ĐƯỢC BẢO VỆ BỞI KHÁCH HÀNG (MOBILE APP)
            </div>
          </div>
          <div className="p-4 space-y-2.5 text-xs leading-relaxed text-gray-700">
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-gray-900">Lý do khóa:</span> Bản
              ghi này do chính Khách hàng đặt trực tiếp trên Mobile App. Hệ
              thống tự động khóa tính năng chỉnh sửa trực tiếp để ngăn chặn sai
              lệch thông tin giữa màn hình App của khách và hệ thống xưởng.
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-gray-800">
              <span className="font-bold text-[#1A73E8]">
                Quy định vận hành:
              </span>{' '}
              Mọi thay đổi về Ngày hẹn, Giờ hẹn và Hạng mục dịch vụ phải do
              Khách hàng chủ động sửa trên Mobile App của họ.
            </div>
          </div>
        </div>
      )}

      {/* Tooltip khi rê chuột vào nút Hủy lịch đang disable (Nguồn tạo = Mobile App) */}
      {hoveredCancelledByGarageBooking && (
        <div
          style={{
            top: hoveredCancelledByGarageBooking.top,
            left: hoveredCancelledByGarageBooking.left,
          }}
          className="fixed z-90 w-[420px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-red-300 overflow-hidden pointer-events-none"
        >
          <div className="px-4 py-2.5 bg-red-50 border-b border-red-200 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="text-xs font-extrabold text-red-950 uppercase tracking-wide">
              Hủy lịch được thực hiện bởi Garage
            </div>
          </div>
          <div className="p-4 space-y-3 text-xs leading-relaxed text-gray-700">
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
              <div>
                <span className="font-bold text-gray-900">
                  Người thực hiện:
                </span>{' '}
                <span className="font-semibold text-gray-800">
                  Nguyễn Văn Tuấn (Mã NV: NV-0042)
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Thời gian:</span>{' '}
                <span className="font-semibold text-gray-800">
                  10:45 - 28/10/2026
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Xem chi tiết:</span>{' '}
                <span className="text-[#1A73E8] font-medium">
                  Bấm xem toàn bộ tiến trình tại nút &quot;Lịch sử hoạt động&quot;
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-red-50/70 rounded-lg border border-red-200 text-red-950 space-y-1">
              <div className="font-extrabold text-red-700 uppercase tracking-wide">
                ⛔ QUY ĐỊNH BẢO TOÀN DỮ LIỆU :
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-800 font-medium">
                <li>Không thể khôi phục lại trạng thái khác.</li>
                <li>
                  Vui lòng liên hệ Khách hàng để hướng dẫn đặt lại lịch mới qua
                  Mobile App.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip khi rê chuột vào cụm từ "App Du Muc" ở cột Mã nguồn / Chiến dịch */}
      {hoveredAppDuMucBooking && (
        <div
          style={{
            top: hoveredAppDuMucBooking.top,
            left: hoveredAppDuMucBooking.left,
          }}
          className="fixed z-90 w-max max-w-[98vw] bg-white rounded-xl shadow-2xl border border-blue-200 overflow-hidden pointer-events-none p-3 space-y-2 text-xs text-gray-700"
        >
          <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 whitespace-nowrap">
            <span className="font-bold text-gray-900">Nguồn:</span> Khách hàng
            đặt lịch qua{' '}
            <span className="font-semibold text-[#1A73E8]">App Du Mục</span>{' '}
            (Mạng xã hội Cộng đồng người lái xe — nhấn vào tên ứng dụng để tải
            về).
          </div>
          <div className="px-3 py-2 bg-blue-50/70 rounded-lg border border-blue-200 text-gray-800 whitespace-nowrap">
            <span className="font-bold text-[#1A73E8]">Việc cần làm:</span> Chủ
            động liên hệ để đảm bảo khách đến đúng hẹn.
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

      {/* Email Modal (copied from PotentialCustomersModule) */}
      {emailModalOpen && selectedEmailRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4"
          onClick={() => setEmailModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Soạn và Gửi Email
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: {selectedEmailRecord.bookingCode} • Khách hàng:{' '}
                  {selectedEmailRecord.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Người nhận (Email)
                </label>
                <input
                  type="text"
                  value={emailRecipient}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Tiêu đề Email (Subject Line)
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Tiêu đề email"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nội dung Email (Body)
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Nội dung email..."
                  rows={12}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-y"
                />
              </div>

              {emailAttachments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tệp đính kèm ({emailAttachments.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {emailAttachments.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                        <span className="font-medium truncate max-w-[220px]">
                          {file.name}
                        </span>
                        <span className="text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEmailAttachments((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa tệp"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <input
                  ref={emailFileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setEmailAttachments((prev) => [
                        ...prev,
                        ...Array.from(e.target.files!),
                      ]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => emailFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[#1A73E8] hover:text-blue-700 font-medium px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Đính kèm tệp</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addBookingActivity(
                      selectedEmailRecord.id,
                      'Gửi Email',
                      `Đã gửi email "${emailSubject}" tới ${emailRecipient}`
                    );
                    setEmailModalOpen(false);
                    setEmailContent('');
                    setEmailAttachments([]);
                  }}
                  className="px-6 py-2.5 text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Gửi Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zalo Modal (copied from PotentialCustomersModule) */}
      {zaloModalOpen && selectedZaloRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4"
          onClick={() => setZaloModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0068FF] text-white font-extrabold text-xs tracking-tighter shadow-xs">
                  Zalo
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Gửi tin nhắn Zalo
                  </h2>
                  <p className="text-xs text-gray-500">
                    ID: {selectedZaloRecord.bookingCode} • Nguồn:{' '}
                    {selectedZaloRecord.source}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setZaloModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Người nhận
                </label>
                <input
                  type="text"
                  value={`${selectedZaloRecord.customerName} - ${selectedZaloRecord.phone}`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nội dung tin nhắn Zalo
                </label>
                <textarea
                  value={zaloContent}
                  onChange={(e) => setZaloContent(e.target.value)}
                  placeholder="Nội dung tin nhắn Zalo..."
                  rows={9}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0068FF]/20 focus:border-[#0068FF] resize-y"
                />
              </div>

              {zaloAttachments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tệp đính kèm ({zaloAttachments.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zaloAttachments.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                        <span className="font-medium truncate max-w-[220px]">
                          {file.name}
                        </span>
                        <span className="text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setZaloAttachments((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa tệp"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <input
                  ref={zaloFileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setZaloAttachments((prev) => [
                        ...prev,
                        ...Array.from(e.target.files!),
                      ]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => zaloFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[#0068FF] hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Đính kèm tệp</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZaloModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addBookingActivity(
                      selectedZaloRecord.id,
                      'Gửi tin nhắn Zalo',
                      `Đã gửi tin nhắn Zalo xác nhận lịch hẹn tới SĐT ${selectedZaloRecord.phone}`
                    );
                    setZaloModalOpen(false);
                    setZaloAttachments([]);
                  }}
                  className="px-6 py-2.5 text-white bg-[#0068FF] hover:bg-blue-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Gửi Zalo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hủy lịch */}
      {cancelBookingRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4"
          onClick={() => setCancelBookingRecord(null)}
        >
          {cancelBookingRecord.source === 'Mobile App' ? (
            cancelMobileAppStep === 'warning' ? (
              /* BƯỚC 1: CẢNH BÁO LỊCH HẸN TỪ MOBILE APP (Kích thước đồng nhất max-w-2xl h-[620px]) */
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[620px] max-h-[90vh] flex flex-col overflow-hidden border border-amber-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-amber-950 uppercase tracking-wide">
                        LỊCH HẸN DO KHÁCH HÀNG TỰ ĐẶT TỪ MOBILE APP
                      </h3>
                      <p className="text-xs text-amber-700 font-medium mt-0.5">
                        Mã lịch hẹn: {cancelBookingRecord.bookingCode} •{' '}
                        {cancelBookingRecord.customerName} (
                        {cancelBookingRecord.phone})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCancelBookingRecord(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-amber-100/60 rounded-lg cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between gap-5">
                  <div className="space-y-5">
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-sm text-gray-800 leading-relaxed">
                      Vui lòng gọi điện trao đổi trước với Khách hàng để hướng
                      dẫn khách thao tác hủy trên App hoặc xin phép khách trước
                      khi hủy từ hệ thống.
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2.5">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pb-1 border-b border-gray-200">
                        Thông tin lịch hẹn đang chọn
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Mã lịch hẹn:</span>
                        <span className="font-mono font-bold text-gray-900">
                          {cancelBookingRecord.bookingCode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Khách hàng:</span>
                        <span className="font-bold text-gray-900">
                          {cancelBookingRecord.customerName} •{' '}
                          <span className="text-[#1A73E8]">
                            {cancelBookingRecord.phone}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Thời gian hẹn:</span>
                        <span className="font-semibold text-gray-800">
                          {cancelBookingRecord.appointmentDate} (
                          {cancelBookingRecord.appointmentTimeSlot})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Phương tiện:</span>
                        <span className="font-medium text-gray-800">
                          {cancelBookingRecord.licensePlate} •{' '}
                          {cancelBookingRecord.carModel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Yêu cầu dịch vụ:</span>
                        <span className="font-medium text-gray-800">
                          {cancelBookingRecord.serviceRequest}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCancelBookingRecord(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Đóng / Giữ lại lịch
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelMobileAppStep('confirm')}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Tôi vẫn muốn hủy từ Garage</span>
                      <span className="text-sm leading-none">❯</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : cancelMobileAppStep === 'confirm' ? (
              /* BƯỚC 2: XÁC NHẬN NGHIÊM NGẶT VỚI TÔNG MÀU ĐỎ (Kích thước đồng nhất max-w-2xl h-[620px]) */
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[620px] max-h-[90vh] flex flex-col overflow-hidden border-2 border-red-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 bg-red-600 text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">🛑</span>
                    <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      XÁC NHẬN HỦY LỊCH HẸN TỪ PHÍA GARAGE
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCancelBookingRecord(null)}
                    className="p-1 text-red-100 hover:text-white hover:bg-red-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                  {/* Khung cảnh báo đỏ */}
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
                    <div className="text-sm font-bold text-red-900">
                      &ldquo;Bạn chắc chắn muốn hủy lịch này?&rdquo;
                    </div>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Việc hủy lịch từ nội bộ sẽ ngay lập tức đồng bộ trạng thái{' '}
                      <span className="font-bold">&ldquo;Đã hủy&rdquo;</span> về
                      Mobile App của khách hàng và gửi thông báo giải thích lý
                      do đến khách.
                    </p>
                  </div>

                  {/* 1. Chọn lý do hủy (Bắt buộc) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      1. Chọn lý do hủy{' '}
                      <span className="text-red-600">(Bắt buộc)</span>:
                    </label>
                    <select
                      value={cancelDropdownReason}
                      onChange={(e) => setCancelDropdownReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                    >
                      <option value="">-- Dropdown chọn lý do --</option>
                      {MOBILE_APP_CANCEL_REASONS.map((reasonOption) => (
                        <option key={reasonOption} value={reasonOption}>
                          {reasonOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Ghi chú chi tiết lý do (Bắt buộc) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      2. Ghi chú chi tiết lý do{' '}
                      <span className="text-red-600">(Bắt buộc)</span>:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập nội dung đã trao đổi với khách hoặc lý do kỹ thuật xưởng..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                    />
                  </div>

                  {/* 3. Tùy chọn gửi thông báo cho Khách hàng */}
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-bold text-gray-800">
                        3. Tùy chọn gửi thông báo cho Khách hàng:
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenCancelPreview}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-[#1A73E8] border border-blue-200 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>Xem trước nội dung Thông báo</span>
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-0.5">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cancelNotifyApp}
                          onChange={(e) => setCancelNotifyApp(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span>Gửi thông báo lên App</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cancelNotifyEmail}
                          onChange={(e) =>
                            setCancelNotifyEmail(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span>Gửi thông báo qua Email</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCancelMobileAppStep('warning')}
                    className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={!cancelDropdownReason}
                    onClick={() => {
                      if (!cancelDropdownReason) return;
                      const target = cancelBookingRecord;
                      const channels = [
                        cancelNotifyApp ? 'App' : '',
                        cancelNotifyEmail ? 'Email' : '',
                      ]
                        .filter(Boolean)
                        .join(', ');
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === target.id
                            ? {
                                ...b,
                                status: 'Đã hủy bởi Garage',
                                cancelledByGarage: true,
                              }
                            : b
                        )
                      );
                      addBookingActivity(
                        target.id,
                        'Hủy lịch bởi Garage (Mobile App)',
                        `Đã hủy lịch hẹn từ phía Garage.\n• Lý do: ${cancelDropdownReason}${
                          cancelReason.trim()
                            ? `\n• Ghi chú chi tiết: ${cancelReason.trim()}`
                            : ''
                        }\n• Thông báo khách hàng: ${
                          channels || 'Không gửi thông báo'
                        }`
                      );
                      setCancelBookingRecord(null);
                    }}
                    className={`px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all inline-flex items-center gap-1.5 ${
                      cancelDropdownReason
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span>❌</span>
                    <span>XÁC NHẬN HỦY LỊCH</span>
                  </button>
                </div>
              </div>
            ) : (
              /* BƯỚC 3: XEM TRƯỚC NỘI DUNG THÔNG BÁO (Dạng Tab: trên App, Email + nút Chỉnh sửa, kích thước đồng nhất max-w-2xl h-[620px]) */
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[620px] max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      Xem trước nội dung Thông báo
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Mã lịch hẹn: {cancelBookingRecord.bookingCode} • Khách
                      hàng: {cancelBookingRecord.customerName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCancelPreview(false);
                      setCancelMobileAppStep('confirm');
                    }}
                    className="p-1 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                    title="Quay lại"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs Bar (trên App / Email) + Nút Chỉnh sửa */}
                <div className="px-6 pt-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setCancelPreviewTab('app')}
                      className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                        cancelPreviewTab === 'app'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>📱 Trên App</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          cancelNotifyApp
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cancelNotifyApp ? 'Sẽ gửi' : 'Đang tắt'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancelPreviewTab('email')}
                      className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                        cancelPreviewTab === 'email'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>✉️ Email</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          cancelNotifyEmail
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cancelNotifyEmail ? 'Sẽ gửi' : 'Đang tắt'}
                      </span>
                    </button>
                  </div>

                  <div className="pb-2">
                    {isEditingCancelPreview ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCancelPreview(false);
                          setCancelPreviewCustomized(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu chỉnh sửa</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingCancelPreview(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-[#1A73E8] border border-blue-200 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-white">
                  {cancelPreviewTab === 'app' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Thiết bị / Tài khoản nhận trên Du Mục Official App
                        </label>
                        <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                          {cancelBookingRecord.customerName} • SĐT đăng nhập App:{' '}
                          <span className="text-[#1A73E8]">
                            {cancelBookingRecord.phone}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Tiêu đề thông báo trên App
                        </label>
                        {isEditingCancelPreview ? (
                          <input
                            type="text"
                            value={cancelAppTitle}
                            onChange={(e) => {
                              setCancelAppTitle(e.target.value);
                              setCancelPreviewCustomized(true);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#1A73E8] rounded-lg text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#1A73E8]/20"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900">
                            {cancelAppTitle}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nội dung chi tiết thông báo trên App
                        </label>
                        {isEditingCancelPreview ? (
                          <textarea
                            rows={8}
                            value={cancelAppBody}
                            onChange={(e) => {
                              setCancelAppBody(e.target.value);
                              setCancelPreviewCustomized(true);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#1A73E8] rounded-lg text-sm text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-[#1A73E8]/20 resize-none"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {cancelAppBody}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Người nhận (Email)
                        </label>
                        <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                          {cancelBookingRecord.customerName} &lt;
                          <span className="text-[#1A73E8]">
                            {getDefaultEmailForRecord(cancelBookingRecord)}
                          </span>
                          &gt;
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Tiêu đề Email
                        </label>
                        {isEditingCancelPreview ? (
                          <input
                            type="text"
                            value={cancelEmailSubject}
                            onChange={(e) => {
                              setCancelEmailSubject(e.target.value);
                              setCancelPreviewCustomized(true);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#1A73E8] rounded-lg text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#1A73E8]/20"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900">
                            {cancelEmailSubject}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nội dung chi tiết Email
                        </label>
                        {isEditingCancelPreview ? (
                          <textarea
                            rows={8}
                            value={cancelEmailBody}
                            onChange={(e) => {
                              setCancelEmailBody(e.target.value);
                              setCancelPreviewCustomized(true);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#1A73E8] rounded-lg text-sm text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-[#1A73E8]/20 resize-none"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {cancelEmailBody}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCancelPreview(false);
                      setCancelMobileAppStep('confirm');
                    }}
                    className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    ❮ Quay lại xác nhận hủy
                  </button>

                  <div className="flex items-center gap-2.5">
                    {!isEditingCancelPreview ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingCancelPreview(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCancelPreview(false);
                          setCancelPreviewCustomized(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu nội dung</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingCancelPreview(false);
                        setCancelMobileAppStep('confirm');
                      }}
                      className="px-4 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Hoàn tất xem trước
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* MODAL HỦY LỊCH THÔNG THƯỜNG (Nguồn khác Mobile App) */
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-gray-900">
                    Hủy lịch hẹn ({cancelBookingRecord.bookingCode})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelBookingRecord(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div>
                    <span className="text-gray-500">Khách hàng:</span>{' '}
                    <span className="font-bold text-gray-900">
                      {cancelBookingRecord.customerName}
                    </span>{' '}
                    ({cancelBookingRecord.phone})
                  </div>
                  <div>
                    <span className="text-gray-500">Thời gian hẹn:</span>{' '}
                    <span className="font-semibold text-gray-800">
                      {cancelBookingRecord.appointmentDate} •{' '}
                      {cancelBookingRecord.appointmentTimeSlot}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Lý do hủy lịch
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập lý do hủy lịch hẹn..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCancelBookingRecord(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const target = cancelBookingRecord;
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === target.id ? { ...b, status: 'Đã hủy' } : b
                        )
                      );
                      addBookingActivity(
                        target.id,
                        'Hủy lịch hẹn',
                        cancelReason.trim()
                          ? `Đã hủy lịch hẹn. Lý do: ${cancelReason.trim()}`
                          : 'Đã chuyển trạng thái lịch hẹn sang Đã hủy'
                      );
                      setCancelBookingRecord(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Xác nhận Hủy lịch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Đặt lại lịch */}
      {rescheduleBookingRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4"
          onClick={() => setRescheduleBookingRecord(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Đặt lại lịch hẹn ({rescheduleBookingRecord.bookingCode})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleBookingRecord(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
                <div>
                  <span className="text-gray-500">Khách hàng:</span>{' '}
                  <span className="font-bold text-gray-900">
                    {rescheduleBookingRecord.customerName}
                  </span>{' '}
                  ({rescheduleBookingRecord.phone})
                </div>
                <div>
                  <span className="text-gray-500">Lịch hẹn hiện tại:</span>{' '}
                  <span className="font-semibold text-gray-800">
                    {rescheduleBookingRecord.appointmentDate} •{' '}
                    {rescheduleBookingRecord.appointmentTimeSlot}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày hẹn mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Khung giờ hẹn mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 08:30 - 09:30"
                    value={rescheduleTimeSlot}
                    onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú đặt lại lịch
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập ghi chú thay đổi giờ hẹn..."
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRescheduleBookingRecord(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = rescheduleBookingRecord;
                    const updatedDate =
                      rescheduleDate.trim() || target.appointmentDate;
                    const updatedSlot =
                      rescheduleTimeSlot.trim() || target.appointmentTimeSlot;
                    setBookings((prev) =>
                      prev.map((b) =>
                        b.id === target.id
                          ? {
                              ...b,
                              appointmentDate: updatedDate,
                              appointmentTimeSlot: updatedSlot,
                              status: 'Chờ xe tới',
                            }
                          : b
                      )
                    );
                    addBookingActivity(
                      target.id,
                      'Đặt lại lịch hẹn',
                      `Đổi lịch hẹn sang ${updatedDate} (${updatedSlot})${
                        rescheduleNote.trim()
                          ? ` • Ghi chú: ${rescheduleNote.trim()}`
                          : ''
                      }`
                    );
                    setRescheduleBookingRecord(null);
                  }}
                  className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Xác nhận Đặt lại lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lịch sử hoạt động - Full-screen 2-column interface matching Thông tin Khách hàng tiềm năng */}
      {activityHistoryBookingRecord &&
        (() => {
          const currentBooking =
            bookings.find((b) => b.id === activityHistoryBookingRecord.id) ||
            activityHistoryBookingRecord;
          const bookingNotesList =
            bookingInternalNotes[currentBooking.id] || [];
          const bookingTasksList = bookingTasks[currentBooking.id] || [];
          const bookingActivityList = getActivitiesForBooking(currentBooking);
          const uncompletedBookingTasksCount = bookingTasksList.filter(
            (t) => !t.completed
          ).length;

          return (
            <div className="fixed inset-0 bg-white z-60 flex flex-col w-screen h-screen overflow-hidden">
              {/* Top Bar */}
              <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] font-bold text-sm">
                    LH
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Thông tin Lịch hẹn Khách đặt
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivityHistoryBookingRecord(null)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main 2-Column Body */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Column: Booking & Customer Info (No Scroll) */}
                <div className="w-[54%] border-r border-gray-200 p-5 flex flex-col justify-between overflow-hidden bg-white">
                  {/* Top Identity & Status */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                          {currentBooking.customerName}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Mã lịch hẹn: {currentBooking.bookingCode} • Thời gian
                          hẹn: {currentBooking.appointmentDate} (
                          {currentBooking.appointmentTimeSlot})
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Buttons + Status on the same single line */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedZaloRecord(currentBooking);
                          setZaloContent(getZaloDefaultContent(currentBooking));
                          setZaloAttachments([]);
                          setZaloModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0068FF] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Gửi Zalo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEmailModalForRecord(currentBooking)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gửi Email</span>
                      </button>

                      {(() => {
                        const isMobileAppLocked =
                          currentBooking.source === 'Mobile App';
                        return (
                          <span
                            className="inline-flex items-center shrink-0"
                            onMouseEnter={(e) => {
                              if (!isMobileAppLocked) return;
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const tooltipHeight = 200;
                              const placeAbove =
                                rect.bottom + tooltipHeight >
                                window.innerHeight - 16;
                              setHoveredLockedEditBooking({
                                id: currentBooking.id,
                                top: placeAbove
                                  ? Math.max(12, rect.top - tooltipHeight - 8)
                                  : rect.bottom + 8,
                                left: Math.min(
                                  window.innerWidth - 420,
                                  Math.max(12, rect.left)
                                ),
                              });
                            }}
                            onMouseLeave={() =>
                              setHoveredLockedEditBooking((prev) =>
                                prev?.id === currentBooking.id ? null : prev
                              )
                            }
                          >
                            <button
                              type="button"
                              disabled={isMobileAppLocked}
                              onClick={() =>
                                handleOpenEditModal(currentBooking)
                              }
                              title={
                                isMobileAppLocked ? undefined : 'Chỉnh sửa'
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${
                                isMobileAppLocked
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 cursor-pointer'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Chỉnh sửa</span>
                            </button>
                          </span>
                        );
                      })()}

                      {(() => {
                        const isCancelledByGarage =
                          Boolean(currentBooking.cancelledByGarage) ||
                          currentBooking.status === 'Đã hủy bởi Garage';
                        return (
                          <span
                            className="inline-flex items-center shrink-0"
                            title={
                              isCancelledByGarage
                                ? 'Hủy lịch bởi Garage'
                                : 'Hủy lịch'
                            }
                          >
                            <button
                              type="button"
                              disabled={isCancelledByGarage}
                              onClick={() =>
                                openCancelBookingModal(currentBooking)
                              }
                              title={
                                isCancelledByGarage
                                  ? 'Hủy lịch bởi Garage'
                                  : 'Hủy lịch'
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${
                                isCancelledByGarage
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 cursor-pointer'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Hủy lịch</span>
                            </button>
                          </span>
                        );
                      })()}

                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Trạng thái
                        </span>
                        <select
                          value={currentBooking.status}
                          onChange={(e) =>
                            handleStatusChange(
                              currentBooking.id,
                              e.target.value as BookingStatusType
                            )
                          }
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer focus:outline-none transition-colors ${getBookingStatusBadgeStyle(
                            currentBooking.status
                          )}`}
                        >
                          {BOOKING_STATUS_OPTIONS.map((statusOption) => (
                            <option
                              key={statusOption}
                              value={statusOption}
                              className="bg-white text-gray-800 font-medium"
                            >
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-2" />

                  {/* THÔNG TIN CHUNG */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#1A73E8] rounded-full inline-block" />
                      THÔNG TIN CHUNG
                    </h3>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                      {/* Mã lịch hẹn */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Mã lịch hẹn
                        </div>
                        <div className="font-mono font-bold text-gray-900 text-xs">
                          {currentBooking.bookingCode}
                        </div>
                      </div>

                      {/* Khách hàng */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Khách hàng
                        </div>
                        <div className="font-bold text-gray-900 text-xs">
                          {currentBooking.customerName}
                        </div>
                      </div>

                      {/* Số điện thoại */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Số điện thoại
                        </div>
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-[#1A73E8]" />
                          <span>{currentBooking.phone}</span>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Email
                        </div>
                        <div className="font-medium text-gray-800 flex items-center gap-1.5 truncate text-xs">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {getDefaultEmailForRecord(currentBooking)}
                          </span>
                        </div>
                      </div>

                      {/* Nguồn tạo */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Nguồn tạo
                        </div>
                        <div className="text-xs">
                          {renderSourceCell(
                            currentBooking.source,
                            currentBooking.createdBy ||
                              (currentBooking.source === 'Hotline' &&
                              currentBooking.campaignOrNote
                                ? currentBooking.campaignOrNote.replace(
                                    /^Sales:\s*/i,
                                    ''
                                  )
                                : undefined)
                          )}
                        </div>
                      </div>

                      {/* Mã nguồn / Chiến dịch */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Mã nguồn / Chiến dịch
                        </div>
                        <div className="font-medium text-gray-800 text-xs">
                          {currentBooking.source === 'Hotline' ? (
                            <span className="text-gray-400 italic">
                              Trống
                            </span>
                          ) : currentBooking.source === 'Mobile App' ? (
                            <span className="text-[#1A73E8] font-semibold">
                              App Du Muc
                            </span>
                          ) : (
                            <span>
                              <strong className="text-gray-900">
                                {currentBooking.sourceCode}
                              </strong>
                              {currentBooking.campaignOrNote
                                ? ` • ${currentBooking.campaignOrNote}`
                                : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Thời gian hẹn */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Thời gian hẹn
                        </div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {currentBooking.appointmentDate} (
                            {currentBooking.appointmentTimeSlot})
                          </span>
                        </div>
                      </div>

                      {/* Cố vấn dịch vụ */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Cố vấn phụ trách
                        </div>
                        <div className="font-semibold text-gray-800 text-xs">
                          {currentBooking.advisorName || 'Nguyễn Văn Tuấn'}
                        </div>
                      </div>

                      {/* Biển số xe */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Biển số xe
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-white border border-gray-200 text-gray-800 rounded font-mono text-xs font-bold">
                            {currentBooking.licensePlate}
                          </span>
                        </div>
                      </div>

                      {/* Dòng xe */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Dòng xe
                        </div>
                        <div className="font-bold text-gray-900 text-xs">
                          {currentBooking.carModel}
                        </div>
                      </div>

                      {/* Yêu cầu Dịch vụ */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Yêu cầu Dịch vụ
                        </div>
                        <div className="font-medium text-gray-800 text-xs line-clamp-2">
                          {currentBooking.serviceRequest || 'Chưa cập nhật'}
                        </div>
                      </div>

                      {/* Dịch vụ gợi ý */}
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Dịch vụ gợi ý
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {currentBooking.suggestedServices.map((srv, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200"
                            >
                              <Tag className="w-3 h-3" />
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Tabs (Lịch sử, Ghi chú nội bộ & Lời nhắc) */}
                <div className="flex-1 flex flex-col min-w-0 bg-gray-50/40 overflow-hidden">
                  {/* Tabs Header */}
                  <div className="px-6 pt-3 border-b border-gray-200 bg-white flex items-center gap-6 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveActivityTab('activity_history')}
                      className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                        activeActivityTab === 'activity_history'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>Lịch sử</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveActivityTab('history')}
                      className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                        activeActivityTab === 'history'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>Ghi chú nội bộ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveActivityTab('tasks')}
                      className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                        activeActivityTab === 'tasks'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>Lời nhắc &amp; Công việc</span>
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                          uncompletedBookingTasksCount > 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {uncompletedBookingTasksCount}
                      </span>
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeActivityTab === 'activity_history' ? (
                    <div className="flex-1 flex flex-col p-5 min-h-0 overflow-hidden">
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {bookingActivityList.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                            Chưa có lịch sử hoạt động nào cho lịch hẹn này.
                          </div>
                        ) : (
                          bookingActivityList.map((act) => (
                            <div
                              key={act.id}
                              className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#1A73E8]" />
                                  <span className="text-xs font-bold text-gray-900">
                                    {act.action}
                                  </span>
                                  <span className="text-[11px] font-medium text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    {act.actor}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  {act.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                {act.detail}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : activeActivityTab === 'history' ? (
                    <div className="flex-1 flex flex-col p-5 gap-4 min-h-0 overflow-hidden">
                      {/* Note Input Box */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs shrink-0">
                        <textarea
                          value={bookingNoteContent}
                          onChange={(e) =>
                            setBookingNoteContent(e.target.value)
                          }
                          placeholder="Thêm ghi chú..."
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-none"
                        />
                        <div className="flex justify-end mt-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveBookingNote(currentBooking.id)
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Lưu ghi chú</span>
                          </button>
                        </div>
                      </div>

                      {/* Note List */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {bookingNotesList.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                            Chưa có ghi chú nội bộ nào cho lịch hẹn này.
                          </div>
                        ) : (
                          bookingNotesList.map((note) => (
                            <div
                              key={note.id}
                              className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs"
                            >
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                <span className="font-semibold text-[#1A73E8]">
                                  {note.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  {note.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col p-5 gap-4 min-h-0 overflow-hidden">
                      {/* New Task Input Box */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs shrink-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={bookingTaskContent}
                            onChange={(e) =>
                              setBookingTaskContent(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddBookingTask(currentBooking.id);
                              }
                            }}
                            placeholder="Thêm lời nhắc mới..."
                            className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAddBookingTask(currentBooking.id)
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Thêm</span>
                          </button>
                        </div>
                      </div>

                      {/* Task List */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {bookingTasksList.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                            Chưa có lời nhắc hay công việc nào.
                          </div>
                        ) : (
                          bookingTasksList.map((task) => {
                            const isEditing = editingBookingTaskId === task.id;
                            return (
                              <div
                                key={task.id}
                                className={`p-3.5 rounded-xl border transition-colors ${
                                  task.completed
                                    ? 'bg-gray-50 border-gray-200 opacity-75'
                                    : 'bg-white border-gray-200 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() =>
                                      handleToggleBookingTask(
                                        currentBooking.id,
                                        task.id
                                      )
                                    }
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                                  />

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
                                      <span className="font-semibold text-[#1A73E8]">
                                        {task.author}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-gray-400" />
                                          {task.timestamp}
                                        </span>
                                        {!isEditing && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleStartEditBookingTask(task)
                                            }
                                            className="p-1 text-gray-400 hover:text-[#1A73E8] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                            title="Chỉnh sửa"
                                          >
                                            <Edit3 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {isEditing ? (
                                      <div className="mt-2 space-y-2">
                                        <input
                                          type="text"
                                          value={editBookingTaskContent}
                                          onChange={(e) =>
                                            setEditBookingTaskContent(
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-3 py-1.5 bg-white border border-[#1A73E8] rounded-lg text-sm text-gray-800 focus:outline-none"
                                        />
                                        <div className="flex items-center gap-2 justify-end">
                                          <button
                                            type="button"
                                            onClick={
                                              handleCancelEditBookingTask
                                            }
                                            className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                                          >
                                            Hủy
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleSaveEditBookingTask(
                                                currentBooking.id,
                                                task.id
                                              )
                                            }
                                            className="px-2.5 py-1 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 rounded-md cursor-pointer"
                                          >
                                            Lưu
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p
                                        className={`text-sm leading-relaxed ${
                                          task.completed
                                            ? 'line-through text-gray-400'
                                            : 'text-gray-800 font-medium'
                                        }`}
                                      >
                                        {task.content}
                                      </p>
                                    )}

                                    <div className="mt-1.5 flex items-center gap-1.5">
                                      <span
                                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                          task.completed
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}
                                      >
                                        <CheckSquare className="w-3 h-3" />
                                        {task.completed
                                          ? 'Đã hoàn thành'
                                          : 'Chưa hoàn thành'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
