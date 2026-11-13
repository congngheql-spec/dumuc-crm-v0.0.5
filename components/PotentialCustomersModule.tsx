import React, { useState, useRef } from 'react';
import { Plus, Trash2, Filter, X, FileSearch, Inbox, Calendar, CalendarPlus, HelpCircle, ChevronDown, ChevronUp, Eye, EyeOff, Settings, Download, Mail, User, Paperclip, MessageSquarePlus, Phone, Building2, Wrench, MessageCircle, Hourglass, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Globe, MapPin, BookOpen } from 'lucide-react';
import { EventSettings } from './EventSettings';
import { HistoryItem, TaskItem, ActivityItem } from './EventsModule';
import {
  CustomerBookingsModule,
  CustomerBookingRecord,
  INITIAL_CUSTOMER_BOOKINGS,
  BookingNoteItem,
  BookingTaskItem,
  BookingActivityItem,
  INITIAL_BOOKING_INTERNAL_NOTES,
  INITIAL_BOOKING_TASKS,
} from './CustomerBookingsModule';

export type PotentialCustomerStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Xe đã đến' | 'Bỏ hẹn' | 'Đã hủy' | 'Chờ xóa' | 'Mới' | 'Đang theo dõi' | 'Khách hàng đã đặt lịch' | 'Khách hàng từ chối';
export type PotentialCustomerSource = 'Facebook' | 'Google Maps' | 'Zalo OA' | 'Website' | 'TikTok';
export type PotentialCustomerDemand = 'Bảo dưỡng định kỳ' | 'Rửa xe' | 'Cân mâm' | 'Đảo lốp' | 'Căn chỉnh thước lái' | 'Chẩn đoán tổng quát';

export const SOURCE_OPTIONS: PotentialCustomerSource[] = [
  'Facebook',
  'Google Maps',
  'Zalo OA',
  'Website',
  'TikTok',
];

export const DEMAND_OPTIONS: PotentialCustomerDemand[] = [
  'Bảo dưỡng định kỳ',
  'Rửa xe',
  'Cân mâm',
  'Đảo lốp',
  'Căn chỉnh thước lái',
  'Chẩn đoán tổng quát',
];

export const MASTER_CAR_MODELS: string[] = [
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

export const MASTER_LICENSE_PLATES: { plate: string; carModel: string }[] = [
  { plate: '51K-889.21', carModel: 'Mazda - CX-5' },
  { plate: '30H-665.43', carModel: 'Ford - Ranger' },
  { plate: '51A-992.18', carModel: 'Mercedes-Benz - C200' },
  { plate: '60A-773.12', carModel: 'Toyota - Vios' },
  { plate: '51H-123.99', carModel: 'Hyundai - SantaFe' },
  { plate: '51G-456.78', carModel: 'Honda - CR-V' },
  { plate: '30K-112.89', carModel: 'Toyota - Corolla Cross' },
  { plate: '43A-556.12', carModel: 'Kia - Carnival' },
  { plate: '65A-234.56', carModel: 'Mitsubishi - Xpander' },
];

export const CUSTOMER_VEHICLES_MAP: Record<
  string,
  { plate: string; carModel: string }[]
> = {
  'pc-1': [
    { plate: '51K-889.21', carModel: 'Mazda - CX-5' },
    { plate: '51G-456.78', carModel: 'Honda - CR-V' },
  ],
  'pc-2': [
    { plate: '30H-665.43', carModel: 'Ford - Ranger' },
    { plate: '30K-112.89', carModel: 'Toyota - Corolla Cross' },
  ],
  'pc-3': [
    { plate: '51A-992.18', carModel: 'Mercedes-Benz - C200' },
    { plate: '51H-123.99', carModel: 'Hyundai - SantaFe' },
  ],
  'pc-4': [
    { plate: '60A-773.12', carModel: 'Toyota - Vios' },
    { plate: '43A-556.12', carModel: 'Kia - Carnival' },
  ],
  'pc-5': [
    { plate: '30K-112.89', carModel: 'Toyota - Corolla Cross' },
    { plate: '65A-234.56', carModel: 'Mitsubishi - Xpander' },
  ],
  'pc-6': [
    { plate: '51H-123.99', carModel: 'Hyundai - SantaFe' },
    { plate: '51K-889.21', carModel: 'Mazda - CX-5' },
  ],
  'pc-7': [
    { plate: '43A-556.12', carModel: 'Kia - Carnival' },
    { plate: '60A-773.12', carModel: 'Toyota - Vios' },
  ],
  'pc-8': [
    { plate: '65A-234.56', carModel: 'Mitsubishi - Xpander' },
    { plate: '30H-665.43', carModel: 'Ford - Ranger' },
  ],
};

export const DEFAULT_SUGGESTED_SERVICE_TAGS: string[] = [
  'Bảo dưỡng định kỳ',
  'Rửa xe',
  'Cân mâm',
  'Đảo lốp',
  'Căn chỉnh thước lái',
  'Chẩn đoán tổng quát',
  'Thay dầu máy',
  'Kiểm tra hệ thống phanh',
];

export interface ExistingCustomerRecord {
  id: string;
  customerCode: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  taxCode: string;
  address: string;
  customerGroup: string;
  createdAt: string;
}

export const EXISTING_CUSTOMERS_IN_MODULE: ExistingCustomerRecord[] = [
  {
    id: 'cust-1',
    customerCode: 'KH-2023-089',
    customerName: 'Phạm Hoàng Nam',
    companyName: 'Công ty TNHH Nam Sài Gòn Auto',
    phone: '0901 234 567',
    email: 'nam.pham@namsaigonauto.vn',
    taxCode: '0314567890',
    address: '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    customerGroup: 'Khách hàng VIP / Đại lý',
    createdAt: '12/03/2023',
  },
  {
    id: 'cust-2',
    customerCode: 'KH-2023-142',
    customerName: 'Lê Hoàng Việt',
    companyName: 'Việt Thành Garage',
    phone: '0938 112 233',
    email: 'contact@vietthanhgarage.com',
    taxCode: '0319988776',
    address: '340 Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh',
    customerGroup: 'Khách hàng Thân thiết',
    createdAt: '20/08/2023',
  },
  {
    id: 'cust-3',
    customerCode: 'KH-2024-015',
    customerName: 'Nguyễn Thị Thu Thảo',
    companyName: 'Công ty CP Thảo Nguyên Auto Care',
    phone: '0905 000 111',
    email: 'thao.nguyen@thaonguyenauto.vn',
    taxCode: '0106543210',
    address: '108 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
    customerGroup: 'Khách hàng Doanh nghiệp',
    createdAt: '10/01/2024',
  },
  {
    id: 'cust-4',
    customerCode: 'KH-2024-051',
    customerName: 'Bùi Thanh Tùng',
    companyName: 'Tùng Lâm Auto Hải Phòng',
    phone: '0982 334 455',
    email: 'tung.bui@tunglamauto.com',
    taxCode: '0201239876',
    address: '75 Lạch Tray, Quận Ngô Quyền, Hải Phòng',
    customerGroup: 'Khách hàng Thường',
    createdAt: '04/04/2024',
  },
  {
    id: 'cust-5',
    customerCode: 'KH-2024-077',
    customerName: 'Hoàng Minh Đức',
    companyName: 'Đức Phát Detailing Center',
    phone: '0912 888 999',
    email: 'info@ducphatdetailing.vn',
    taxCode: '2901887766',
    address: '19 Nguyễn Văn Cừ, TP. Vinh, Nghệ An',
    customerGroup: 'Khách hàng Doanh nghiệp',
    createdAt: '19/05/2024',
  },
  {
    id: 'cust-6',
    customerCode: 'KH-2024-102',
    customerName: 'Trần Minh Tuấn',
    companyName: 'Công ty TNHH Nam Sài Gòn Auto (Chi nhánh Q2)',
    phone: '0909 456 789',
    email: 'nam.pham@namsaigonauto.vn',
    taxCode: '0314567890-001',
    address: '88 Trần Não, TP. Thủ Đức, TP. Hồ Chí Minh',
    customerGroup: 'Khách hàng Doanh nghiệp',
    createdAt: '02/06/2024',
  },
  {
    id: 'cust-7',
    customerCode: 'KH-2024-118',
    customerName: 'Nguyễn Thị Mai',
    companyName: 'Công ty TNHH Nam Sài Gòn Auto (Phòng Dịch vụ)',
    phone: '0914 223 344',
    email: 'nam.pham@namsaigonauto.vn',
    taxCode: '0314567890-002',
    address: '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    customerGroup: 'Khách hàng VIP / Đại lý',
    createdAt: '18/06/2024',
  },
  {
    id: 'cust-8',
    customerCode: 'KH-2024-094',
    customerName: 'Lê Văn Hùng',
    companyName: 'Công ty CP Thảo Nguyên Auto Care (Cơ sở 2)',
    phone: '0987 654 321',
    email: 'thao.nguyen@thaonguyenauto.vn',
    taxCode: '0106543210-001',
    address: '45 Phạm Hùng, Quận Nam Từ Liêm, Hà Nội',
    customerGroup: 'Khách hàng Doanh nghiệp',
    createdAt: '22/04/2024',
  },
  {
    id: 'cust-9',
    customerCode: 'KH-2024-129',
    customerName: 'Vũ Hoàng Long',
    companyName: 'Tùng Lâm Auto Hải Phòng (Cơ sở 2)',
    phone: '0936 778 899',
    email: 'tung.bui@tunglamauto.com',
    taxCode: '0201239876-001',
    address: '120 Lê Hồng Phong, Quận Ngô Quyền, Hải Phòng',
    customerGroup: 'Khách hàng Thân thiết',
    createdAt: '15/07/2024',
  },
];

export const renderSourceIcon = (source: PotentialCustomerSource) => {
  switch (source) {
    case 'Facebook':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1877F2] text-white shadow-xs" title="Facebook">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </span>
      );
    case 'Google Maps':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-[#EA4335] border border-red-200 shadow-xs" title="Google Maps">
          <MapPin className="w-4 h-4" />
        </span>
      );
    case 'Zalo OA':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0068FF] text-white font-extrabold text-[10px] tracking-tighter shadow-xs" title="Zalo OA">
          Zalo
        </span>
      );
    case 'Website':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-[#14A64A] border border-emerald-200 shadow-xs" title="Website">
          <Globe className="w-4 h-4" />
        </span>
      );
    case 'TikTok':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white shadow-xs" title="TikTok">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </span>
      );
  }
};

export interface PotentialCustomerItem {
  id: string;
  code: string;
  name: string;
  channelUserCode: string;
  fullName: string;
  garageName: string;
  phone: string;
  email: string;
  demands: PotentialCustomerDemand[];
  taxCode: string;
  registrationDate: string;
  appointmentDate: string;
  appointmentTimeSlot: string;
  status: PotentialCustomerStatus;
  address: string;
  link: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
  source: PotentialCustomerSource;
  callStatus: 'Chưa gọi' | 'Đã gọi';
  callResult: 'Rỗng' | 'Đồng ý tham gia' | 'Từ chối' | 'Sai số điện thoại' | 'Không liên hệ được lần 1' | 'Không liên hệ được lần 2' | 'Không liên hệ được lần 3';
  roles?: string[];
  otherRole?: string;
  notes?: string;
  campaignGoal?: string;
  campaignKeywords?: string;
  newCustomerScript?: string;
  existingCustomerScript?: string;
  licensePlate?: string;
  carBrand?: string;
  carModel?: string;
  originalRoCode?: string;
  originalRoDates?: string;
  originalRoRevenue?: string;
  createdBy?: string;
  selectedQuoteItemsMap?: Record<string, string[]>;
  segmentName?: string;
  segmentPurpose?: string;
  totalFilterCriteria?: number | string;
  roFilterScope?: string;
}

export const MOCK_POTENTIAL_CUSTOMERS: PotentialCustomerItem[] = [
  {
    id: 'pc-1',
    code: 'KHTN-2024-001',
    name: 'Chiến dịch Chăm sóc Xe Mùa Hè 2024',
    channelUserCode: 'FB-8839201',
    fullName: 'Phạm Hoàng Nam',
    garageName: 'Nam Sài Gòn Auto',
    phone: '0901 234 567',
    email: 'nam.pham@namsaigonauto.vn',
    demands: ['Bảo dưỡng định kỳ', 'Chẩn đoán tổng quát'],
    taxCode: '0314567890',
    registrationDate: '05/06/2024',
    appointmentDate: '08/06/2024',
    appointmentTimeSlot: '08:00 - 10:00',
    status: 'Chờ xác nhận',
    address: '215 Nguyễn Văn Linh, Phường Tân Thuận Tây, Quận 7, TP. Hồ Chí Minh',
    link: 'https://dumuc.com.vn/campaign/summer-2024',
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    isLocked: false,
    source: 'Facebook',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    roles: ['Chủ Garage', 'Cố vấn Garage'],
    otherRole: 'Đại lý phụ tùng',
    notes: 'Khách hàng tiềm năng quan tâm gói bảo dưỡng định kỳ và phần mềm quản lý xưởng dịch vụ.',
    licensePlate: '51K-889.21',
    carBrand: 'Mazda',
    carModel: 'CX-5',
    originalRoCode: 'RO-2405-0102',
    originalRoDates: '02/06/2024 - 03/06/2024',
    originalRoRevenue: '4.850.000 đ',
    createdBy: 'Nguyễn Văn Tuấn',
  },
  {
    id: 'pc-2',
    code: 'KHTN002',
    name: 'Chương trình Ưu đãi Khách hàng Mới',
    channelUserCode: 'ZALO-4920118',
    fullName: 'Đỗ Minh Quân',
    garageName: 'Quân Auto Service',
    phone: '0918 765 432',
    email: 'quan.do@quanauto.vn',
    demands: ['Rửa xe', 'Bảo dưỡng định kỳ'],
    taxCode: '0315556677',
    registrationDate: '12/07/2024',
    appointmentDate: '15/07/2024',
    appointmentTimeSlot: '09:00 - 11:00',
    status: 'Đã xác nhận',
    address: '89 Lê Văn Việt, TP. Thủ Đức, HCM',
    link: 'https://dumuc.com.vn/campaign/new-customer',
    startDate: '10/07/2024',
    endDate: '25/07/2024',
    isLocked: true,
    source: 'Zalo OA',
    callStatus: 'Đã gọi',
    callResult: 'Đồng ý tham gia',
    licensePlate: '30H-665.43',
    carBrand: 'Ford',
    carModel: 'Ranger',
    originalRoCode: 'RO-2406-0148',
    originalRoDates: '08/07/2024 - 09/07/2024',
    originalRoRevenue: '8.200.000 đ',
    createdBy: 'Trần Thị Mai',
  },
  {
    id: 'pc-3',
    code: 'KHTN003',
    name: 'Tư vấn Giải pháp Thiết bị Chẩn đoán',
    channelUserCode: 'GMAP-1029384',
    fullName: 'Lê Hoàng Việt',
    garageName: 'Việt Thành Garage',
    phone: '0938 112 233',
    email: 'viet.le@vietthanhgarage.com',
    demands: ['Chẩn đoán tổng quát', 'Căn chỉnh thước lái'],
    taxCode: '0312223344',
    registrationDate: '28/07/2024',
    appointmentDate: '30/07/2024',
    appointmentTimeSlot: '14:00 - 16:00',
    status: 'Đã xác nhận',
    address: '340 Cộng Hòa, Quận Tân Bình, HCM',
    link: 'https://dumuc.com.vn/campaign/diagnostic',
    startDate: '25/07/2024',
    endDate: '15/08/2024',
    isLocked: false,
    source: 'Google Maps',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '51A-992.18',
    carBrand: 'Mercedes-Benz',
    carModel: 'C200',
    originalRoCode: 'RO-2407-0089',
    originalRoDates: '24/07/2024 - 26/07/2024',
    originalRoRevenue: '16.500.000 đ',
    createdBy: 'Nguyễn Văn Tuấn',
  },
  {
    id: 'pc-4',
    code: 'KHTN004',
    name: 'Khuyến mãi Phụ tùng Chính hãng',
    channelUserCode: 'WEB-7748291',
    fullName: 'Trần Quốc Bảo',
    garageName: 'Bảo Tín Auto',
    phone: '0979 445 566',
    email: 'bao.tran@baotinauto.vn',
    demands: ['Cân mâm', 'Đảo lốp'],
    taxCode: '0401122334',
    registrationDate: '08/08/2024',
    appointmentDate: '11/08/2024',
    appointmentTimeSlot: '10:00 - 12:00',
    status: 'Đã hủy',
    address: '56 Điện Biên Phủ, Quận Thanh Khê, Đà Nẵng',
    link: 'https://dumuc.com.vn/campaign/genuine-parts',
    startDate: '05/08/2024',
    endDate: '20/08/2024',
    isLocked: false,
    source: 'Website',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '60A-773.12',
    carBrand: 'Toyota',
    carModel: 'Vios',
    originalRoCode: 'RO-2407-0215',
    originalRoDates: '03/08/2024 - 03/08/2024',
    originalRoRevenue: '2.450.000 đ',
    createdBy: 'Lê Minh Tâm',
  },
  {
    id: 'pc-5',
    code: 'KHTN005',
    name: 'Gói Bảo dưỡng Toàn diện',
    channelUserCode: 'TT-5591023',
    fullName: 'Nguyễn Thị Thu Thảo',
    garageName: 'Thảo Nguyên Auto Care',
    phone: '0946 778 899',
    email: 'thao.nguyen@thaonguyenauto.vn',
    demands: ['Bảo dưỡng định kỳ', 'Rửa xe', 'Chẩn đoán tổng quát'],
    taxCode: '0106543210',
    registrationDate: '16/08/2024',
    appointmentDate: '19/08/2024',
    appointmentTimeSlot: '15:00 - 17:00',
    status: 'Đã xác nhận',
    address: '108 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
    link: 'https://dumuc.com.vn/campaign/full-care',
    startDate: '15/08/2024',
    endDate: '30/08/2024',
    isLocked: true,
    source: 'TikTok',
    callStatus: 'Đã gọi',
    callResult: 'Đồng ý tham gia',
    licensePlate: '30K-112.89',
    carBrand: 'Toyota',
    carModel: 'Corolla Cross',
    originalRoCode: 'RO-2408-0041',
    originalRoDates: '12/08/2024 - 13/08/2024',
    originalRoRevenue: '6.900.000 đ',
    createdBy: 'Trần Thị Mai',
  },
  {
    id: 'pc-6',
    code: 'KHTN006',
    name: 'Hội thảo Chuyển đổi số Garage',
    channelUserCode: 'FB-3391847',
    fullName: 'Võ Văn Kiệt',
    garageName: 'Kiệt Phat Garage',
    phone: '0963 221 100',
    email: 'kiet.vo@kietphat.vn',
    demands: ['Căn chỉnh thước lái', 'Đảo lốp'],
    taxCode: '0317788990',
    registrationDate: '22/08/2024',
    appointmentDate: '25/08/2024',
    appointmentTimeSlot: '08:30 - 10:30',
    status: 'Đã hủy',
    address: '192 Kinh Dương Vương, Quận Bình Tân, HCM',
    link: 'https://dumuc.com.vn/campaign/digital-garage',
    startDate: '01/09/2024',
    endDate: '10/09/2024',
    isLocked: false,
    source: 'Facebook',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '51H-123.99',
    carBrand: 'Hyundai',
    carModel: 'SantaFe',
    originalRoCode: 'RO-2408-0119',
    originalRoDates: '18/08/2024 - 19/08/2024',
    originalRoRevenue: '5.300.000 đ',
    createdBy: 'Nguyễn Văn Tuấn',
  },
  {
    id: 'pc-7',
    code: 'KHTN007',
    name: 'Chương trình Liên kết Đại lý Dầu nhớt',
    channelUserCode: 'ZALO-6612094',
    fullName: 'Bùi Thanh Tùng',
    garageName: 'Tùng Lâm Auto',
    phone: '0982 334 455',
    email: 'tung.bui@tunglamauto.com',
    demands: ['Bảo dưỡng định kỳ'],
    taxCode: '0201239876',
    registrationDate: '02/09/2024',
    appointmentDate: '06/09/2024',
    appointmentTimeSlot: '13:30 - 15:30',
    status: 'Chờ xác nhận',
    address: '75 Lạch Tray, Quận Ngô Quyền, Hải Phòng',
    link: 'https://dumuc.com.vn/campaign/oil-partner',
    startDate: '01/09/2024',
    endDate: '20/09/2024',
    isLocked: false,
    source: 'Zalo OA',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '43A-556.12',
    carBrand: 'Kia',
    carModel: 'Carnival',
    originalRoCode: 'RO-2408-0267',
    originalRoDates: '28/08/2024 - 29/08/2024',
    originalRoRevenue: '9.750.000 đ',
    createdBy: 'Lê Minh Tâm',
  },
  {
    id: 'pc-8',
    code: 'KHTN008',
    name: 'Ưu đãi Lốp & Ắc quy Mùa Mưa',
    channelUserCode: 'GMAP-8827165',
    fullName: 'Đặng Quốc Khánh',
    garageName: 'Khánh Hòa Auto Center',
    phone: '0915 667 788',
    email: 'khanh.dang@khanhhoaauto.vn',
    demands: ['Cân mâm', 'Đảo lốp', 'Căn chỉnh thước lái'],
    taxCode: '4201122334',
    registrationDate: '10/09/2024',
    appointmentDate: '14/09/2024',
    appointmentTimeSlot: '08:00 - 10:00',
    status: 'Đã xác nhận',
    address: '42 Lê Hồng Phong, TP. Nha Trang',
    link: 'https://dumuc.com.vn/campaign/tire-battery',
    startDate: '05/09/2024',
    endDate: '25/09/2024',
    isLocked: true,
    source: 'Google Maps',
    callStatus: 'Đã gọi',
    callResult: 'Đồng ý tham gia',
    licensePlate: '65A-234.56',
    carBrand: 'Mitsubishi',
    carModel: 'Xpander',
    originalRoCode: 'RO-2409-0032',
    originalRoDates: '05/09/2024 - 06/09/2024',
    originalRoRevenue: '7.100.000 đ',
    createdBy: 'Trần Thị Mai',
  },
  {
    id: 'pc-9',
    code: 'KHTN009',
    name: 'Tư vấn Mở mới Trung tâm Chăm sóc Xe',
    channelUserCode: 'WEB-9940213',
    fullName: 'Hoàng Minh Đức',
    garageName: 'Đức Phát Detailing',
    phone: '0932 998 877',
    email: 'duc.hoang@ducphatdetailing.vn',
    demands: ['Rửa xe', 'Chẩn đoán tổng quát'],
    taxCode: '2901887766',
    registrationDate: '15/09/2024',
    appointmentDate: '18/09/2024',
    appointmentTimeSlot: '15:30 - 17:30',
    status: 'Chờ xác nhận',
    address: '19 Nguyễn Văn Cừ, TP. Vinh, Nghệ An',
    link: 'https://dumuc.com.vn/campaign/detailing-setup',
    startDate: '10/09/2024',
    endDate: '30/09/2024',
    isLocked: false,
    source: 'Website',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '51G-456.78',
    carBrand: 'Honda',
    carModel: 'CR-V',
    originalRoCode: 'RO-2409-0088',
    originalRoDates: '11/09/2024 - 12/09/2024',
    originalRoRevenue: '5.600.000 đ',
    createdBy: 'Nguyễn Văn Tuấn',
  },
  {
    id: 'pc-10',
    code: 'KHTN010',
    name: 'Tri ân Đối tác Phụ tùng Toàn quốc',
    channelUserCode: 'TT-2204918',
    fullName: 'Ngô Quang Huy',
    garageName: 'Huy Hoàng Auto Parts',
    phone: '0908 556 677',
    email: 'huy.ngo@huyhoangparts.vn',
    demands: ['Bảo dưỡng định kỳ', 'Đảo lốp'],
    taxCode: '0316677889',
    registrationDate: '20/09/2024',
    appointmentDate: '24/09/2024',
    appointmentTimeSlot: '10:00 - 12:00',
    status: 'Chờ xác nhận',
    address: '312 Cách Mạng Tháng 8, Quận 3, HCM',
    link: 'https://dumuc.com.vn/campaign/partner-2024',
    startDate: '15/09/2024',
    endDate: '05/10/2024',
    isLocked: false,
    source: 'TikTok',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    licensePlate: '51K-901.35',
    carBrand: 'VinFast',
    carModel: 'VF 8',
    originalRoCode: 'RO-2409-0154',
    originalRoDates: '16/09/2024 - 17/09/2024',
    originalRoRevenue: '3.950.000 đ',
    createdBy: 'Lê Minh Tâm',
  }
];

export type QuotationApprovalStatus =
  | 'Đang báo giá'
  | 'Chờ khách duyệt'
  | 'Khách từ chối'
  | 'Khách đã duyệt'
  | 'Hủy';

export const QUOTATION_APPROVAL_STATUS_OPTIONS: QuotationApprovalStatus[] = [
  'Đang báo giá',
  'Chờ khách duyệt',
  'Khách từ chối',
  'Khách đã duyệt',
  'Hủy',
];

export interface QuotationLineItem {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface QuotationRecord {
  id: string;
  quoteCode: string;
  quoteDate: string; // YYYY-MM-DD
  quoteDateTimeDisplay: string;
  licensePlate: string;
  customerName: string;
  phone: string;
  email: string;
  carBrand: string;
  carModel: string;
  originalRoCode: string;
  originalRoDates: string;
  originalRoRevenue: string;
  approvalStatus: QuotationApprovalStatus;
  items: QuotationLineItem[];
}

export const MOCK_QUOTATIONS_FOR_REMINDERS: QuotationRecord[] = [
  {
    id: 'q-1',
    quoteCode: 'BG2611-0007',
    quoteDate: '2026-11-09',
    quoteDateTimeDisplay: '09/11/2026 14:35',
    licensePlate: '51H11111',
    customerName: 'Trần Lâm',
    phone: '0909123456',
    email: 'tranlam@gmail.com',
    carBrand: 'Toyota',
    carModel: 'Camry',
    originalRoCode: '2611-000007',
    originalRoDates: '09/11/2026 - 09/11/2026',
    originalRoRevenue: '550.000 đ',
    approvalStatus: 'Khách từ chối',
    items: [
      {
        id: 'qi-1',
        itemCode: 'ACQUY001',
        itemName: 'Bình ắc quy GS46B42L',
        unit: 'Cái',
        quantity: 1,
        unitPrice: 550000,
        totalPrice: 550000,
      },
    ],
  },
  {
    id: 'q-2',
    quoteCode: 'BG2611-0006',
    quoteDate: '2026-11-09',
    quoteDateTimeDisplay: '09/11/2026 14:24',
    licensePlate: '51H11112',
    customerName: 'Trần Lâm',
    phone: '0909123456',
    email: 'tranlam@gmail.com',
    carBrand: 'Toyota',
    carModel: 'Vios',
    originalRoCode: '2611-000003',
    originalRoDates: '09/11/2026 - 09/11/2026',
    originalRoRevenue: '1.306.000 đ',
    approvalStatus: 'Chờ khách duyệt',
    items: [
      {
        id: 'qi-2',
        itemCode: 'BACDANTL001',
        itemName: 'Bạc đạn treo láp',
        unit: 'Cái',
        quantity: 1,
        unitPrice: 216000,
        totalPrice: 216000,
      },
      {
        id: 'qi-3',
        itemCode: 'BIMOAYO002',
        itemName: 'Bi moay ơ bánh sau 42450-52060',
        unit: 'Cái',
        quantity: 1,
        unitPrice: 378000,
        totalPrice: 378000,
      },
      {
        id: 'qi-4',
        itemCode: 'SPBACDAN00001-1521',
        itemName: 'Bạc đạn',
        unit: 'Bộ',
        quantity: 1,
        unitPrice: 162000,
        totalPrice: 162000,
      },
    ],
  },
  {
    id: 'q-3',
    quoteCode: 'BG2611-0002',
    quoteDate: '2026-11-05',
    quoteDateTimeDisplay: '05/11/2026 13:24',
    licensePlate: '51H22004',
    customerName: 'Quy',
    phone: '0918223344',
    email: 'quy.nguyen@gmail.com',
    carBrand: 'Honda',
    carModel: 'CR-V',
    originalRoCode: '2611-000002',
    originalRoDates: '05/11/2026 - 05/11/2026',
    originalRoRevenue: '700.000 đ',
    approvalStatus: 'Đang báo giá',
    items: [
      {
        id: 'qi-5',
        itemCode: 'SPABCD00001-1521',
        itemName: 'abcd',
        unit: 'Chiếc',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
      },
      {
        id: 'qi-6',
        itemCode: 'BACDAN32207',
        itemName: 'Bạc đạn 32207',
        unit: 'Cái',
        quantity: 1,
        unitPrice: 600000,
        totalPrice: 600000,
      },
    ],
  },
  {
    id: 'q-4',
    quoteCode: 'BG2611-0001',
    quoteDate: '2026-11-03',
    quoteDateTimeDisplay: '03/11/2026 09:15',
    licensePlate: '51G-889.12',
    customerName: 'Lê Hoàng Nam',
    phone: '0938112233',
    email: 'nam.le@gmail.com',
    carBrand: 'Mazda',
    carModel: 'CX-5',
    originalRoCode: '2611-000001',
    originalRoDates: '03/11/2026 - 04/11/2026',
    originalRoRevenue: '2.450.000 đ',
    approvalStatus: 'Khách đã duyệt',
    items: [
      {
        id: 'qi-7',
        itemCode: 'MAPHANH001',
        itemName: 'Má phanh trước Mazda CX-5 chính hãng',
        unit: 'Bộ',
        quantity: 1,
        unitPrice: 1850000,
        totalPrice: 1850000,
      },
      {
        id: 'qi-8',
        itemCode: 'DAUPHANH002',
        itemName: 'Dầu thắng DOT4 bảo dưỡng phanh',
        unit: 'Bình',
        quantity: 2,
        unitPrice: 300000,
        totalPrice: 600000,
      },
    ],
  },
  {
    id: 'q-5',
    quoteCode: 'BG2610-0045',
    quoteDate: '2026-10-28',
    quoteDateTimeDisplay: '28/10/2026 16:10',
    licensePlate: '30H-456.78',
    customerName: 'Phạm Minh Tuấn',
    phone: '0987654321',
    email: 'tuan.pham@gmail.com',
    carBrand: 'Hyundai',
    carModel: 'Tucson',
    originalRoCode: '2610-000045',
    originalRoDates: '28/10/2026 - 29/10/2026',
    originalRoRevenue: '1.450.000 đ',
    approvalStatus: 'Hủy',
    items: [
      {
        id: 'qi-9',
        itemCode: 'LOCGIO003',
        itemName: 'Lọc gió động cơ & lọc gió điều hòa',
        unit: 'Bộ',
        quantity: 1,
        unitPrice: 650000,
        totalPrice: 650000,
      },
      {
        id: 'qi-10',
        itemCode: 'BUGI004',
        itemName: 'Bugi Iridium cao cấp',
        unit: 'Cái',
        quantity: 4,
        unitPrice: 200000,
        totalPrice: 800000,
      },
    ],
  },
];

const SEGMENT_FILTER_CRITERIA_LIST = [
  'Ngày đăng kiễm hết hạn',
  'Ngày bảo hiểm hết hạn',
  'ODO',
  'Thời gian bảo hành của sản phẩm bán',
  'Ngày nhận xe (của RO)',
  'Ngày giao xe (của RO)',
  'Đánh giá chất lượng dịch vụ (của RO)',
  'Doanh thu (của RO)',
  'Công nợ',
] as const;

type SegmentCriterionName = (typeof SEGMENT_FILTER_CRITERIA_LIST)[number];

const SEGMENT_RO_TYPES_LIST = [
  'RO - Dịch vụ sửa chữa',
  'RO - Bán hàng thương mại',
  'RO - Bảo hành',
] as const;

type SegmentRoTypeName = (typeof SEGMENT_RO_TYPES_LIST)[number];

interface SegmentCriterionGroup {
  id: string;
  groupName: string;
  criteria: SegmentCriterionName[];
  containerClass: string;
  headerBadgeClass: string;
  headerTextClass: string;
  itemUncheckedClass: string;
  itemCheckedClass: string;
  checkboxAccentClass: string;
}

const SEGMENT_FILTER_CRITERIA_GROUPS: SegmentCriterionGroup[] = [
  {
    id: 'grp-periodic',
    groupName: 'Định kỳ',
    criteria: ['Ngày đăng kiễm hết hạn', 'Ngày bảo hiểm hết hạn'],
    containerClass: 'bg-sky-50/60 border-sky-200',
    headerBadgeClass: 'bg-sky-600 text-white',
    headerTextClass: 'text-sky-900',
    itemUncheckedClass: 'bg-white/90 border-sky-200 text-sky-900 hover:bg-sky-100/60',
    itemCheckedClass: 'bg-sky-100 border-sky-600 text-sky-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-sky-600 focus:ring-sky-500',
  },
  {
    id: 'grp-odo',
    groupName: 'Số KM',
    criteria: ['ODO'],
    containerClass: 'bg-cyan-50/60 border-cyan-200',
    headerBadgeClass: 'bg-cyan-600 text-white',
    headerTextClass: 'text-cyan-900',
    itemUncheckedClass: 'bg-white/90 border-cyan-200 text-cyan-900 hover:bg-cyan-100/60',
    itemCheckedClass: 'bg-cyan-100 border-cyan-600 text-cyan-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-cyan-600 focus:ring-cyan-500',
  },
  {
    id: 'grp-warranty',
    groupName: 'Bảo hành',
    criteria: ['Thời gian bảo hành của sản phẩm bán'],
    containerClass: 'bg-teal-50/60 border-teal-200',
    headerBadgeClass: 'bg-teal-600 text-white',
    headerTextClass: 'text-teal-900',
    itemUncheckedClass: 'bg-white/90 border-teal-200 text-teal-900 hover:bg-teal-100/60',
    itemCheckedClass: 'bg-teal-100 border-teal-600 text-teal-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-teal-600 focus:ring-teal-500',
  },
  {
    id: 'grp-ro-time',
    groupName: 'Thời gian trong RO',
    criteria: ['Ngày nhận xe (của RO)', 'Ngày giao xe (của RO)'],
    containerClass: 'bg-indigo-50/60 border-indigo-200',
    headerBadgeClass: 'bg-indigo-600 text-white',
    headerTextClass: 'text-indigo-900',
    itemUncheckedClass: 'bg-white/90 border-indigo-200 text-indigo-900 hover:bg-indigo-100/60',
    itemCheckedClass: 'bg-indigo-100 border-indigo-600 text-indigo-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-indigo-600 focus:ring-indigo-500',
  },
  {
    id: 'grp-service-quality',
    groupName: 'Chất lượng dịch vụ',
    criteria: ['Đánh giá chất lượng dịch vụ (của RO)'],
    containerClass: 'bg-amber-50/60 border-amber-200',
    headerBadgeClass: 'bg-amber-600 text-white',
    headerTextClass: 'text-amber-900',
    itemUncheckedClass: 'bg-white/90 border-amber-200 text-amber-900 hover:bg-amber-100/60',
    itemCheckedClass: 'bg-amber-100 border-amber-600 text-amber-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-amber-600 focus:ring-amber-500',
  },
  {
    id: 'grp-revenue',
    groupName: 'Doanh thu',
    criteria: ['Doanh thu (của RO)'],
    containerClass: 'bg-emerald-50/60 border-emerald-200',
    headerBadgeClass: 'bg-emerald-600 text-white',
    headerTextClass: 'text-emerald-900',
    itemUncheckedClass: 'bg-white/90 border-emerald-200 text-emerald-900 hover:bg-emerald-100/60',
    itemCheckedClass: 'bg-emerald-100 border-emerald-600 text-emerald-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-emerald-600 focus:ring-emerald-500',
  },
  {
    id: 'grp-debt',
    groupName: 'Công nợ',
    criteria: ['Công nợ'],
    containerClass: 'bg-rose-50/60 border-rose-200',
    headerBadgeClass: 'bg-rose-600 text-white',
    headerTextClass: 'text-rose-900',
    itemUncheckedClass: 'bg-white/90 border-rose-200 text-rose-900 hover:bg-rose-100/60',
    itemCheckedClass: 'bg-rose-100 border-rose-600 text-rose-950 font-semibold shadow-2xs',
    checkboxAccentClass: 'text-rose-600 focus:ring-rose-500',
  },
];

interface SegmentDetailRow {
  id: string;
  criterion: SegmentCriterionName;
  purpose: string;
  operator: string;
  value: string;
}

interface SavedCustomerSegmentPreset {
  id: string;
  name: string;
  purpose: string;
  roAllDates: boolean;
  roActiveChip: '1m' | '3m' | '6m' | '1y' | null;
  roDateFromOffsetMonths?: number;
  roTypes?: SegmentRoTypeName[];
  detailRows: Omit<SegmentDetailRow, 'id'>[];
}

const SEGMENT_PURPOSE_SUGGESTIONS: string[] = [
  'Nhắc bảo dưỡng định kỳ & thay dầu nhớt',
  'Mời gia hạn đăng kiểm & bảo hiểm vật chất xe',
  'Chăm sóc khách hàng VIP doanh thu cao',
  'Tái kích hoạt khách hàng lâu chưa quay lại xưởng',
  'Khảo sát & xử lý khiếu nại chất lượng dịch vụ',
  'Thu hồi công nợ & đối soát thanh toán',
  'Tư vấn gia hạn bảo hành phụ tùng & dịch vụ',
];

const SEGMENT_FILTER_OPERATOR_OPTIONS: string[] = [
  'Sắp hết hạn trong vòng (<= ngày)',
  'Còn hiệu lực trong khoảng',
  'Trong khoảng thời gian',
  'Đã qua tối thiểu (>=)',
  'Lớn hơn hoặc bằng (>=)',
  'Nhỏ hơn hoặc bằng (<=)',
  'Lớn hơn (>)',
  'Bằng (=)',
  'Có phát sinh hạng mục',
  'Có phát sinh đơn hàng',
  'Trạng thái bảo hành',
  'Chứa từ khóa',
  'Không trống',
];

const REGISTRATION_EXPIRY_PURPOSE_OPTIONS = [
  'Sắp hết hạn đăng kiểm',
  'Đã quá hạn đăng kiểm',
  'Không có dữ liệu đăng kiễm',
] as const;

const REGISTRATION_EXPIRY_OPERATOR_OPTIONS = [
  'Mẫu của Du Mục',
  'Tự thiết lập',
] as const;

const REGISTRATION_EXPIRY_VALUE_OPTIONS = [
  'Trước 30 ngày hết hạn đăng kiễm',
  'Trước 15 ngày hết hạn đăng kiễm',
] as const;

const DEFAULT_CRITERION_CONFIG: Record<
  SegmentCriterionName,
  { purpose: string; operator: string; value: string }
> = {
  'Ngày đăng kiễm hết hạn': {
    purpose: 'Sắp hết hạn đăng kiểm',
    operator: 'Mẫu của Du Mục',
    value: 'Trước 30 ngày hết hạn đăng kiễm',
  },
  'Ngày bảo hiểm hết hạn': {
    purpose: 'Tư vấn tái tục bảo hiểm vật chất / TNDS',
    operator: 'Sắp hết hạn trong vòng (<= ngày)',
    value: '30 ngày tới',
  },
  ODO: {
    purpose: 'Xác định xe chạm mốc bảo dưỡng định kỳ',
    operator: 'Lớn hơn hoặc bằng (>=)',
    value: '10.000 km',
  },
  'Thời gian bảo hành của sản phẩm bán': {
    purpose: 'Chăm sóc & kiểm tra trước khi hết hạn bảo hành',
    operator: 'Còn hiệu lực trong khoảng',
    value: '15 - 30 ngày',
  },
  'Ngày nhận xe (của RO)': {
    purpose: 'Lọc theo thời điểm khách mang xe vào xưởng',
    operator: 'Trong khoảng thời gian',
    value: '90 ngày gần nhất',
  },
  'Ngày giao xe (của RO)': {
    purpose: 'Theo dõi thời gian sau khi hoàn tất giao xe',
    operator: 'Đã qua tối thiểu (>=)',
    value: '60 ngày sau giao xe',
  },
  'Doanh thu (của RO)': {
    purpose: 'Phân loại nhóm khách hàng theo giá trị chi tiêu',
    operator: 'Lớn hơn hoặc bằng (>=)',
    value: '10.000.000 đ',
  },
  'Đánh giá chất lượng dịch vụ (của RO)': {
    purpose: 'Phân loại mức độ hài lòng của khách hàng',
    operator: 'Bằng (=)',
    value: '5 sao (Rất hài lòng)',
  },
  'Công nợ': {
    purpose: 'Theo dõi khách hàng còn số dư công nợ phải thu',
    operator: 'Lớn hơn (>)',
    value: '0 đ (Còn công nợ)',
  },
};

const INITIAL_SAVED_SEGMENT_PRESETS: SavedCustomerSegmentPreset[] = [
  {
    id: 'seg-preset-1',
    name: 'Khách hàng sắp hết hạn Đăng kiểm & Bảo hiểm (30 ngày tới)',
    purpose: 'Mời gia hạn đăng kiểm & bảo hiểm vật chất xe',
    roAllDates: false,
    roActiveChip: '6m',
    roDateFromOffsetMonths: 6,
    roTypes: ['RO - Dịch vụ sửa chữa'],
    detailRows: [
      {
        criterion: 'Ngày đăng kiễm hết hạn',
        purpose: 'Sắp hết hạn đăng kiểm',
        operator: 'Mẫu của Du Mục',
        value: 'Trước 30 ngày hết hạn đăng kiễm',
      },
      {
        criterion: 'Ngày bảo hiểm hết hạn',
        purpose: 'Tư vấn tái tục bảo hiểm vật chất / TNDS',
        operator: 'Sắp hết hạn trong vòng (<= ngày)',
        value: '30 ngày tới',
      },
    ],
  },
  {
    id: 'seg-preset-2',
    name: 'Khách hàng chạm mốc bảo dưỡng ODO & sau giao xe 3 tháng',
    purpose: 'Nhắc bảo dưỡng định kỳ & thay dầu nhớt',
    roAllDates: false,
    roActiveChip: '3m',
    roDateFromOffsetMonths: 3,
    roTypes: ['RO - Dịch vụ sửa chữa'],
    detailRows: [
      {
        criterion: 'ODO',
        purpose: 'Xác định xe chạm mốc bảo dưỡng định kỳ',
        operator: 'Lớn hơn hoặc bằng (>=)',
        value: '10.000 km',
      },
      {
        criterion: 'Ngày nhận xe (của RO)',
        purpose: 'Lọc theo thời điểm khách mang xe vào xưởng',
        operator: 'Trong khoảng thời gian',
        value: '3 tháng trở lại',
      },
      {
        criterion: 'Ngày giao xe (của RO)',
        purpose: 'Theo dõi thời gian sau khi hoàn tất giao xe',
        operator: 'Đã qua tối thiểu (>=)',
        value: '90 ngày sau giao xe',
      },
    ],
  },
  {
    id: 'seg-preset-3',
    name: 'Khách hàng VIP Doanh thu cao & Đánh giá 5 sao (1 năm trở lại)',
    purpose: 'Chăm sóc khách hàng VIP doanh thu cao',
    roAllDates: false,
    roActiveChip: '1y',
    roDateFromOffsetMonths: 12,
    roTypes: ['RO - Bán hàng thương mại'],
    detailRows: [
      {
        criterion: 'Doanh thu (của RO)',
        purpose: 'Phân loại nhóm khách hàng VIP chi tiêu lớn',
        operator: 'Lớn hơn hoặc bằng (>=)',
        value: '20.000.000 đ',
      },
      {
        criterion: 'Đánh giá chất lượng dịch vụ (của RO)',
        purpose: 'Khách hàng hài lòng cao để mời chương trình tri ân',
        operator: 'Bằng (=)',
        value: '5 sao (Rất hài lòng)',
      },
      {
        criterion: 'Thời gian bảo hành của sản phẩm bán',
        purpose: 'Kiểm tra định kỳ phụ tùng giá trị cao',
        operator: 'Còn hiệu lực trong khoảng',
        value: '30 - 90 ngày',
      },
    ],
  },
  {
    id: 'seg-preset-4',
    name: 'Khách hàng có Công nợ & Bảo hành cần theo dõi (Tất cả RO)',
    purpose: 'Thu hồi công nợ & đối soát thanh toán',
    roAllDates: true,
    roActiveChip: null,
    roTypes: ['RO - Bảo hành'],
    detailRows: [
      {
        criterion: 'Công nợ',
        purpose: 'Theo dõi khách hàng còn số dư công nợ phải thu',
        operator: 'Lớn hơn (>)',
        value: '5.000.000 đ',
      },
      {
        criterion: 'Thời gian bảo hành của sản phẩm bán',
        purpose: 'Kiểm tra thời hạn bảo hành sản phẩm đã xuất',
        operator: 'Còn hiệu lực trong khoảng',
        value: 'Còn hạn bảo hành',
      },
    ],
  },
];

interface PotentialCustomersModuleProps {
  onCreateCustomerBooking?: (
    booking: Omit<CustomerBookingRecord, 'id' | 'bookingCode'> & { id?: string }
  ) => void;
  bookingCounts?: Record<string, number>;
  setBookingCounts?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  customerBookings?: CustomerBookingRecord[];
  setCustomerBookings?: React.Dispatch<
    React.SetStateAction<CustomerBookingRecord[]>
  >;
  discounts?: any[];
  events?: PotentialCustomerItem[];
  setEvents?: React.Dispatch<React.SetStateAction<PotentialCustomerItem[]>>;
  guestHistory?: Record<string, HistoryItem[]>;
  setGuestHistory?: React.Dispatch<
    React.SetStateAction<Record<string, HistoryItem[]>>
  >;
  guestTasks?: Record<string, TaskItem[]>;
  setGuestTasks?: React.Dispatch<
    React.SetStateAction<Record<string, TaskItem[]>>
  >;
  guestActivityHistory?: Record<string, ActivityItem[]>;
  setGuestActivityHistory?: React.Dispatch<
    React.SetStateAction<Record<string, ActivityItem[]>>
  >;
  bookingInternalNotes?: Record<string, BookingNoteItem[]>;
  setBookingInternalNotes?: React.Dispatch<
    React.SetStateAction<Record<string, BookingNoteItem[]>>
  >;
  bookingTasks?: Record<string, BookingTaskItem[]>;
  setBookingTasks?: React.Dispatch<
    React.SetStateAction<Record<string, BookingTaskItem[]>>
  >;
  bookingActivities?: Record<string, BookingActivityItem[]>;
  setBookingActivities?: React.Dispatch<
    React.SetStateAction<Record<string, BookingActivityItem[]>>
  >;
  hideRegistrationSummary?: boolean;
  isCustomerSegmentsMode?: boolean;
}

export const PotentialCustomersModule: React.FC<PotentialCustomersModuleProps> = ({
  onCreateCustomerBooking,
  bookingCounts: externalBookingCounts,
  setBookingCounts: externalSetBookingCounts,
  customerBookings: externalCustomerBookings,
  setCustomerBookings: externalSetCustomerBookings,
  discounts = [],
  events: externalEvents,
  setEvents: externalSetEvents,
  guestHistory: externalGuestHistory,
  setGuestHistory: externalSetGuestHistory,
  guestTasks: externalGuestTasks,
  setGuestTasks: externalSetGuestTasks,
  guestActivityHistory: externalGuestActivityHistory,
  setGuestActivityHistory: externalSetGuestActivityHistory,
  bookingInternalNotes: externalBookingInternalNotes,
  setBookingInternalNotes: externalSetBookingInternalNotes,
  bookingTasks: externalBookingTasks,
  setBookingTasks: externalSetBookingTasks,
  bookingActivities: externalBookingActivities,
  setBookingActivities: externalSetBookingActivities,
  hideRegistrationSummary = false,
  isCustomerSegmentsMode = false,
}) => {
  const [internalEvents, setInternalEvents] = useState<PotentialCustomerItem[]>(MOCK_POTENTIAL_CUSTOMERS);
  const events = externalEvents ?? internalEvents;
  const setEvents = externalSetEvents ?? setInternalEvents;
  const [callScriptModalGuest, setCallScriptModalGuest] = useState<PotentialCustomerItem | null>(null);
  const [showBookingNewScript, setShowBookingNewScript] = useState(false);
  const [showBookingExistingScript, setShowBookingExistingScript] = useState(false);

  const getCampaignTelesalesDetails = (guest: PotentialCustomerItem) => {
    const matchedDiscount = discounts.find(
      (d) =>
        d.code?.toLowerCase() === guest.code?.toLowerCase() ||
        (d.discountCode && d.discountCode.toLowerCase() === guest.code?.toLowerCase()) ||
        d.name?.toLowerCase() === guest.name?.toLowerCase()
    );

    const title = matchedDiscount?.name || guest.name || 'Chương trình Chăm sóc & Bảo dưỡng Xe';
    const code = matchedDiscount?.code || guest.code || 'CK-GARAGE';

    const defaultGoal = `• Mục tiêu chuyển đổi: Liên hệ tư vấn 100% danh sách khách hàng thuộc chương trình "${title}" (${code}), đạt tỷ lệ đặt lịch hẹn đến xưởng tối thiểu 35% – 45%.\n• Gia tăng số lượng RO sử dụng mã ưu đãi ${code} cho các hạng mục bảo dưỡng định kỳ, thay dầu nhớt, cân mâm, đảo lốp và kiểm tra an toàn tổng quát.\n• Thu thập đầy đủ thông tin Biển số xe, Dòng xe, Số ODO hiện tại và khung giờ khách dự kiến ghé Garage để bộ phận Cố vấn dịch vụ chuẩn bị tiếp đón.`;
    const defaultKeywords = `• Từ khóa trọng tâm: "Ưu đãi độc quyền mã ${code}", "Miễn phí kiểm tra an toàn 18 hạng mục", "Giữ khoang dịch vụ ưu tiên – Không chờ đợi", "Phụ tùng chính hãng – Báo giá minh bạch".\n• Thông điệp cốt lõi: Chủ động bảo dưỡng định kỳ kết hợp áp dụng chương trình "${title}" giúp tiết kiệm chi phí tối đa và đảm bảo xe vận hành an toàn tuyệt đối.`;
    const defaultNewScript = `1. Chào hỏi & Giới thiệu chương trình:\n"Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] gọi từ Bộ phận Chăm sóc Khách hàng Garage. Hiện tại bên em đang triển khai chương trình '${title}' (Mã chiến dịch: ${code}) dành riêng cho khách hàng mới lần đầu trải nghiệm dịch vụ tại xưởng ạ."\n\n2. Khai thác nhu cầu & Tư vấn quyền lợi:\n"Không biết hiện tại xe mình đang sử dụng là dòng xe gì và đã đến kỳ bảo dưỡng hay cần kiểm tra hạng mục nào chưa ạ? Khi đặt lịch trước qua chương trình này, Anh/Chị sẽ được áp dụng ngay ưu đãi chiết khấu trực tiếp trên hóa đơn kèm gói Kiểm tra chẩn đoán an toàn tổng quát 18 hạng mục hoàn toàn miễn phí ạ."\n\n3. Chốt lịch hẹn đến xưởng:\n"Để Anh/Chị không phải chờ đợi khi mang xe tới, em xin phép giữ trước khoang dịch vụ ưu tiên và kích hoạt mã '${code}' theo biển số xe của mình vào Thứ 7 hoặc Chủ nhật tuần này nhé ạ? Anh/Chị ghé khung giờ 08:30 hay 14:00 sẽ thuận tiện hơn ạ?"`;
    const defaultExistingScript = `1. Chào hỏi & Hỏi thăm tình trạng xe:\n"Dạ em chào Anh/Chị [Tên KH], em là [Tên TVV] gọi từ Garage nơi Anh/Chị từng bảo dưỡng xe ạ. Thời gian vừa qua xe mình vận hành có êm ái và ổn định không Anh/Chị?"\n\n2. Thông báo ưu đãi tri ân Khách hàng cũ:\n"Nhân dịp bên em triển khai chương trình '${title}' (${code}), em liên hệ để gửi tặng Anh/Chị suất ưu đãi tri ân dành cho khách hàng thân thiết. Khi mang xe ghé xưởng đợt này, ngoài mức chiết khấu trực tiếp của chương trình, Anh/Chị còn được miễn phí kiểm tra hệ thống phanh, gầm, ắc-quy và châm nước rửa kính miễn phí ạ."\n\n3. Chốt lịch hẹn cùng Kỹ thuật viên:\n"Theo lịch sử bảo dưỡng thì xe mình cũng sắp tới mốc kiểm tra định kỳ rồi ạ. Em hỗ trợ đặt lịch trước với Cố vấn dịch vụ quen thuộc cho xe mình vào tuần này luôn Anh/Chị nhé?"`;

    return {
      code,
      name: title,
      goal: matchedDiscount?.telesalesGoal || guest.campaignGoal || defaultGoal,
      keywords: matchedDiscount?.telesalesKeywords || guest.campaignKeywords || defaultKeywords,
      newCustomerScript:
        matchedDiscount?.telesalesNewCustomerScript || guest.newCustomerScript || defaultNewScript,
      existingCustomerScript:
        matchedDiscount?.telesalesExistingCustomerScript ||
        guest.existingCustomerScript ||
        defaultExistingScript,
    };
  };
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterCallStatus, setFilterCallStatus] = useState('Tất cả');
  const [filterCallResult, setFilterCallResult] = useState('Tất cả');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterSource, setFilterSource] = useState('Tất cả');
  const [filterCarBrand, setFilterCarBrand] = useState('Tất cả');
  const [filterCarModel, setFilterCarModel] = useState('Tất cả');
  const [filterCreatedBy, setFilterCreatedBy] = useState('Tất cả');
  const [selectedRecord, setSelectedRecord] = useState<PotentialCustomerItem | null>(null);
  const [selectedRoDetailRow, setSelectedRoDetailRow] = useState<PotentialCustomerItem | null>(null);
  const [isQuotationPickerOpen, setIsQuotationPickerOpen] = useState(false);
  const [editingReminderRecord, setEditingReminderRecord] = useState<PotentialCustomerItem | null>(null);
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteVehicleFilter, setQuoteVehicleFilter] = useState('Tất cả xe');
  const [quoteDateFrom, setQuoteDateFrom] = useState('');
  const [quoteDateTo, setQuoteDateTo] = useState('');
  const [quoteApprovalStatus, setQuoteApprovalStatus] = useState<string>('Tất cả');
  const [selectedQuoteItems, setSelectedQuoteItems] = useState<Record<string, string[]>>({});
  const [collapsedQuoteIds, setCollapsedQuoteIds] = useState<Record<string, boolean>>({});
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  const [savedSegmentPresets, setSavedSegmentPresets] = useState<SavedCustomerSegmentPreset[]>(
    INITIAL_SAVED_SEGMENT_PRESETS
  );
  const [segmentName, setSegmentName] = useState('');
  const [segmentPurpose, setSegmentPurpose] = useState('');
  const [isSegmentPurposeDropdownOpen, setIsSegmentPurposeDropdownOpen] = useState(false);
  const [selectedPreviousSegmentId, setSelectedPreviousSegmentId] = useState('');
  const [segmentRoAllDates, setSegmentRoAllDates] = useState(true);
  const [segmentRoDateFrom, setSegmentRoDateFrom] = useState('');
  const [segmentRoDateTo, setSegmentRoDateTo] = useState('');
  const [segmentRoActiveChip, setSegmentRoActiveChip] = useState<'1m' | '3m' | '6m' | '1y' | null>(
    null
  );
  const [segmentSelectedRoTypes, setSegmentSelectedRoTypes] = useState<SegmentRoTypeName[]>([]);
  const [segmentDetailRows, setSegmentDetailRows] = useState<SegmentDetailRow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedEmailRecord, setSelectedEmailRecord] = useState<PotentialCustomerItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);
  const emailFileInputRef = useRef<HTMLInputElement | null>(null);
  const [zaloModalOpen, setZaloModalOpen] = useState(false);
  const [selectedZaloRecord, setSelectedZaloRecord] = useState<PotentialCustomerItem | null>(null);
  const [zaloContent, setZaloContent] = useState('');
  const [zaloAttachments, setZaloAttachments] = useState<File[]>([]);
  const zaloFileInputRef = useRef<HTMLInputElement | null>(null);

  const openEmailModalForRecord = (record: PotentialCustomerItem) => {
    const salutation = record.fullName.includes('Thị') || record.fullName.includes('Thảo') ? 'Chị' : 'Anh';
    const branchName = record.garageName || 'Sài Gòn Garage';
    const bookingTime = record.appointmentTimeSlot || '08:00 - 10:00';
    const bookingDate = record.appointmentDate || record.registrationDate;
    const branchAddress = record.address || '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh';
    const supportHotline = '1900 6868';

    const defaultSubject = `[Xác nhận lịch hẹn] Garage ${branchName} hẹn gặp ${salutation} ${record.fullName} lúc ${bookingTime} - ${bookingDate}`;
    const defaultBody = `Chào ${salutation} ${record.fullName},
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
    setEmailSubject(defaultSubject);
    setEmailContent(defaultBody);
    setEmailAttachments([]);
    setEmailModalOpen(true);
  };

  const getZaloDefaultContent = (record: PotentialCustomerItem) => {
    const salutation = record.fullName.includes('Thị') || record.fullName.includes('Thảo') ? 'Chị' : 'Anh';
    const branchName = record.garageName || 'Sài Gòn Garage';
    const bookingTime = record.appointmentTimeSlot || '08:00 - 10:00';
    const bookingDate = record.appointmentDate || record.registrationDate;
    const branchAddress = record.address || '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh';
    const supportHotline = '1900 6868';

    return `[SAIGON GARAGE] XÁC NHẬN LỊCH HẸN ĐÓN TIẾP
Chào ${salutation} ${record.fullName},
Garage ${branchName} đón tiếp ${salutation} rồi ạ!
📅 Thời gian: ${bookingTime} - ${bookingDate}
📍 Địa điểm: ${branchAddress}
📞 Hotline đón tiếp: ${supportHotline}
🗺️ [ Mở Google Maps Chỉ Đường ]`;
  };
  const [guestProfileModalOpen, setGuestProfileModalOpen] = useState(false);
  const [selectedGuestRecord, setSelectedGuestRecord] = useState<PotentialCustomerItem | null>(null);
  const [activeTab, setActiveTab] = useState<'activity_history' | 'history' | 'tasks'>('activity_history');
  const [internalGuestHistory, setInternalGuestHistory] = useState<Record<string, HistoryItem[]>>({});
  const guestHistory = externalGuestHistory ?? internalGuestHistory;
  const setGuestHistory = externalSetGuestHistory ?? setInternalGuestHistory;
  const [internalGuestActivityHistory, setInternalGuestActivityHistory] = useState<Record<string, ActivityItem[]>>({});
  const guestActivityHistory = externalGuestActivityHistory ?? internalGuestActivityHistory;
  const setGuestActivityHistory = externalSetGuestActivityHistory ?? setInternalGuestActivityHistory;
  const [noteContent, setNoteContent] = useState('');
  const [internalGuestTasks, setInternalGuestTasks] = useState<Record<string, TaskItem[]>>({});
  const guestTasks = externalGuestTasks ?? internalGuestTasks;
  const setGuestTasks = externalSetGuestTasks ?? setInternalGuestTasks;
  const [internalBookingInternalNotes, setInternalBookingInternalNotes] =
    useState<Record<string, BookingNoteItem[]>>(INITIAL_BOOKING_INTERNAL_NOTES);
  const bookingInternalNotes =
    externalBookingInternalNotes ?? internalBookingInternalNotes;
  const setBookingInternalNotes =
    externalSetBookingInternalNotes ?? setInternalBookingInternalNotes;
  const [internalBookingTasks, setInternalBookingTasks] = useState<
    Record<string, BookingTaskItem[]>
  >(INITIAL_BOOKING_TASKS);
  const bookingTasks = externalBookingTasks ?? internalBookingTasks;
  const setBookingTasks = externalSetBookingTasks ?? setInternalBookingTasks;
  const [internalBookingActivities, setInternalBookingActivities] = useState<
    Record<string, BookingActivityItem[]>
  >({});
  const bookingActivities =
    externalBookingActivities ?? internalBookingActivities;
  const setBookingActivities =
    externalSetBookingActivities ?? setInternalBookingActivities;
  const [taskContent, setTaskContent] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskContent, setEditTaskContent] = useState('');
  const [openSourceDropdownId, setOpenSourceDropdownId] = useState<string | null>(null);
  const [openDemandDropdownId, setOpenDemandDropdownId] = useState<string | null>(null);
  const [duplicateCheckRecord, setDuplicateCheckRecord] = useState<PotentialCustomerItem | null>(null);
  const [duplicateCheckFilter, setDuplicateCheckFilter] = useState<'all' | 'phone' | 'email'>('all');

  // State for full-screen "Tạo Lịch hẹn Khách đặt"
  const [bookingModalRecord, setBookingModalRecord] = useState<PotentialCustomerItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingServiceRequest, setBookingServiceRequest] = useState('');
  const [bookingSuggestedTags, setBookingSuggestedTags] = useState<string[]>([]);
  const [bookingCarModels, setBookingCarModels] = useState<string[]>([]);
  const [bookingCarModel, setBookingCarModel] = useState('');
  const [isCarModelDropdownOpen, setIsCarModelDropdownOpen] = useState(false);
  const [bookingLicensePlates, setBookingLicensePlates] = useState<string[]>([]);
  const [bookingLicensePlate, setBookingLicensePlate] = useState('');
  const [isLicensePlateDropdownOpen, setIsLicensePlateDropdownOpen] = useState(false);
  const [bookingFormError, setBookingFormError] = useState('');
  const [isBookingConfirmPopupOpen, setIsBookingConfirmPopupOpen] = useState(false);
  const [internalBookingCounts, setInternalBookingCounts] = useState<Record<string, number>>({});
  const bookingCounts = externalBookingCounts ?? internalBookingCounts;
  const setBookingCounts = externalSetBookingCounts ?? setInternalBookingCounts;
  const [internalCustomerBookings, setInternalCustomerBookings] = useState<
    CustomerBookingRecord[]
  >(INITIAL_CUSTOMER_BOOKINGS);
  const customerBookings = externalCustomerBookings ?? internalCustomerBookings;
  const setCustomerBookings =
    externalSetCustomerBookings ?? setInternalCustomerBookings;
  const [bookingListModalCustomer, setBookingListModalCustomer] =
    useState<PotentialCustomerItem | null>(null);

  const handleToggleDemand = (id: string, demand: PotentialCustomerDemand) => {
    setEvents(events.map(evt => {
      if (evt.id !== id) return evt;
      const exists = evt.demands.includes(demand);
      const nextDemands = exists
        ? evt.demands.filter(d => d !== demand)
        : [...evt.demands, demand];
      return { ...evt, demands: nextDemands };
    }));
  };

  const getDuplicateInfo = (record: PotentialCustomerItem) => {
    const normalizePhone = (p: string) => p.replace(/\s+/g, '');
    const recordEmails = record.email
      .split(/[,;]+/)
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const matchedCustomers = EXISTING_CUSTOMERS_IN_MODULE.map(cust => {
      const phoneMatch = normalizePhone(cust.phone) === normalizePhone(record.phone);
      const custEmails = cust.email
        .split(/[,;]+/)
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
      const emailMatch = custEmails.some(ce => recordEmails.includes(ce));
      const taxCodeMatch = Boolean(record.taxCode && cust.taxCode && cust.taxCode === record.taxCode);
      const matchedFields: ('Số điện thoại' | 'Email' | 'Mã số thuế')[] = [];
      if (phoneMatch) matchedFields.push('Số điện thoại');
      if (emailMatch) matchedFields.push('Email');
      if (taxCodeMatch) matchedFields.push('Mã số thuế');
      return {
        customer: cust,
        phoneMatch,
        emailMatch,
        taxCodeMatch,
        matchedFields,
      };
    }).filter(item => item.matchedFields.length > 0);

    const isPhoneDuplicate = matchedCustomers.some(m => m.phoneMatch);
    const isEmailDuplicate = matchedCustomers.some(m => m.emailMatch);
    const isTaxCodeDuplicate = matchedCustomers.some(m => m.taxCodeMatch);
    const hasDuplicate = matchedCustomers.length > 0;

    return {
      hasDuplicate,
      isPhoneDuplicate,
      isEmailDuplicate,
      isTaxCodeDuplicate,
      matchedCustomers,
    };
  };

  const handleSourceChange = (id: string, newSource: PotentialCustomerSource) => {
    setEvents(events.map(evt => evt.id === id ? { ...evt, source: newSource } : evt));
    setOpenSourceDropdownId(null);
  };
  
  const getLinkedBookingIds = (guestId: string) =>
    customerBookings
      .filter((b) => b.potentialCustomerId === guestId)
      .map((b) => b.id);

  const addActivity = (guestId: string, type: 'note' | 'task' | 'email', action: string, content: string) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      action,
      content,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      author: 'quych@pbsofu.vn'
    };
    
    setGuestActivityHistory(prev => ({
      ...prev,
      [guestId]: [newActivity, ...(prev[guestId] || [])]
    }));

    const linkedIds = getLinkedBookingIds(guestId);
    if (linkedIds.length > 0) {
      const bookingAct: BookingActivityItem = {
        id: newActivity.id,
        action: newActivity.action,
        detail: newActivity.content,
        actor: newActivity.author,
        timestamp: newActivity.timestamp,
      };
      setBookingActivities((prev) => {
        const next = { ...prev };
        linkedIds.forEach((bId) => {
          next[bId] = [bookingAct, ...(prev[bId] || [])];
        });
        return next;
      });
    }
  };
  
  const handleSaveNote = () => {
    const targetGuest = selectedGuestRecord || bookingModalRecord;
    if (!noteContent.trim() || !targetGuest) return;
    
    const newNote: HistoryItem = {
      id: Date.now().toString(),
      content: noteContent,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      author: 'quych@pbsofu.vn'
    };
    
    setGuestHistory(prev => ({
      ...prev,
      [targetGuest.id]: [newNote, ...(prev[targetGuest.id] || [])]
    }));

    const linkedIds = getLinkedBookingIds(targetGuest.id);
    if (linkedIds.length > 0) {
      setBookingInternalNotes((prev) => {
        const next = { ...prev };
        linkedIds.forEach((bId) => {
          next[bId] = [newNote, ...(prev[bId] || [])];
        });
        return next;
      });
    }
    
    addActivity(targetGuest.id, 'note', 'Ghi chú nội bộ - Thêm ghi chú', noteContent);
    
    setNoteContent('');
  };

  const handleAddTask = () => {
    const targetGuest = selectedGuestRecord || bookingModalRecord;
    if (!taskContent.trim() || !targetGuest) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      content: taskContent,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      author: 'quych@pbsofu.vn',
      completed: false
    };
    
    setGuestTasks(prev => ({
      ...prev,
      [targetGuest.id]: [newTask, ...(prev[targetGuest.id] || [])]
    }));

    const linkedIds = getLinkedBookingIds(targetGuest.id);
    if (linkedIds.length > 0) {
      setBookingTasks((prev) => {
        const next = { ...prev };
        linkedIds.forEach((bId) => {
          next[bId] = [newTask, ...(prev[bId] || [])];
        });
        return next;
      });
    }
    
    addActivity(targetGuest.id, 'task', 'Lời nhắc & Công việc - Thêm lời nhắc', taskContent);
    
    setTaskContent('');
  };

  const handleToggleTask = (taskId: string) => {
    const targetGuest = selectedGuestRecord || bookingModalRecord;
    if (!targetGuest) return;
    
    const task = guestTasks[targetGuest.id]?.find(t => t.id === taskId);
    if (task) {
      addActivity(
        targetGuest.id,
        'task',
        task.completed ? 'Lời nhắc & Công việc - Bỏ hoàn thành lời nhắc' : 'Lời nhắc & Công việc - Hoàn thành lời nhắc',
        task.content
      );
    }

    setGuestTasks(prev => ({
      ...prev,
      [targetGuest.id]: prev[targetGuest.id].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));

    const linkedIds = getLinkedBookingIds(targetGuest.id);
    if (linkedIds.length > 0) {
      setBookingTasks((prev) => {
        const next = { ...prev };
        linkedIds.forEach((bId) => {
          next[bId] = (prev[bId] || []).map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
        });
        return next;
      });
    }
  };

  const handleStartEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditTaskContent(task.content);
  };

  const handleSaveEditTask = () => {
    const targetGuest = selectedGuestRecord || bookingModalRecord;
    if (!targetGuest || !editingTaskId || !editTaskContent.trim()) return;
    
    const oldTask = guestTasks[targetGuest.id]?.find(t => t.id === editingTaskId);
    if (oldTask && oldTask.content !== editTaskContent) {
      addActivity(targetGuest.id, 'task', 'Lời nhắc & Công việc - Cập nhật lời nhắc', `Từ: "${oldTask.content}"\nThành: "${editTaskContent}"`);
    }

    setGuestTasks(prev => ({
      ...prev,
      [targetGuest.id]: prev[targetGuest.id].map(task => 
        task.id === editingTaskId ? { ...task, content: editTaskContent } : task
      )
    }));

    const linkedIds = getLinkedBookingIds(targetGuest.id);
    if (linkedIds.length > 0) {
      setBookingTasks((prev) => {
        const next = { ...prev };
        linkedIds.forEach((bId) => {
          next[bId] = (prev[bId] || []).map((t) =>
            t.id === editingTaskId ? { ...t, content: editTaskContent } : t
          );
        });
        return next;
      });
    }
    
    setEditingTaskId(null);
    setEditTaskContent('');
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditTaskContent('');
  };
  
  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    code: '',
    status: 'Tất cả',
    callStatus: 'Tất cả',
    callResult: 'Tất cả',
    dateFrom: '',
    dateTo: '',
    source: 'Tất cả',
    carBrand: 'Tất cả',
    carModel: 'Tất cả',
    createdBy: 'Tất cả'
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string, currentStatus: PotentialCustomerStatus) => {
    e.stopPropagation();
    const newStatus: PotentialCustomerStatus = currentStatus === 'Xe đã đến' ? 'Chờ xác nhận' : 'Xe đã đến';
    addActivity(id, 'note', 'Cập nhật cột Trạng thái', `Thay đổi từ "${currentStatus}" sang "${newStatus}"`);
    setEvents(events.map(evt => evt.id === id ? { ...evt, status: newStatus } : evt));
  };

  const handleStatusChange = (id: string, newStatus: PotentialCustomerStatus) => {
    const target = events.find(evt => evt.id === id);
    if (target && target.status !== newStatus) {
      addActivity(id, 'note', 'Cập nhật cột Trạng thái', `Thay đổi từ "${target.status}" sang "${newStatus}"`);
    }
    setEvents(events.map(evt => evt.id === id ? { ...evt, status: newStatus } : evt));
  };

  const handleCallStatusChange = (id: string, newStatus: PotentialCustomerItem['callStatus']) => {
    const target = events.find(evt => evt.id === id);
    if (target && target.callStatus !== newStatus) {
      addActivity(id, 'note', 'Cập nhật cột Trạng thái cuộc gọi', `Thay đổi từ "${target.callStatus}" sang "${newStatus}"`);
    }
    setEvents(events.map(evt => evt.id === id ? { ...evt, callStatus: newStatus } : evt));
  };

  const handleCallResultChange = (id: string, newResult: PotentialCustomerItem['callResult']) => {
    const target = events.find(evt => evt.id === id);
    if (target && target.callResult !== newResult) {
      addActivity(id, 'note', 'Cập nhật cột Kết quả cuộc gọi', `Thay đổi từ "${target.callResult}" sang "${newResult}"`);
    }
    setEvents(events.map(evt => evt.id === id ? { ...evt, callResult: newResult } : evt));
  };

  const handleCreateCustomerBooking = (record: PotentialCustomerItem) => {
    setBookingModalRecord(record);
    setBookingDate(record.appointmentDate || '');
    setBookingTimeSlot(record.appointmentTimeSlot || '');
    setBookingPhone(record.phone || '');
    setBookingServiceRequest(
      record.demands.length > 0 ? record.demands.join(', ') : ''
    );
    const initialTags = Array.from(
      new Set([
        ...record.demands,
        'Bảo dưỡng định kỳ',
        'Rửa xe',
        'Cân mâm',
        'Đảo lốp',
        'Căn chỉnh thước lái',
        'Chẩn đoán tổng quát',
      ])
    );
    setBookingSuggestedTags(initialTags);
    setBookingCarModels([]);
    setBookingCarModel('');
    setBookingLicensePlates([]);
    setBookingLicensePlate('');
    setBookingFormError('');
    setIsBookingConfirmPopupOpen(false);
  };

  const handleConfirmCreateCustomerBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalRecord) return;
    if (!bookingDate.trim() || !bookingTimeSlot.trim() || !bookingPhone.trim()) {
      setBookingFormError(
        'Vui lòng nhập đầy đủ Ngày hẹn, Khung giờ hẹn và Điện thoại.'
      );
      return;
    }
    setBookingFormError('');
    setIsBookingConfirmPopupOpen(true);
  };

  const handleExecuteCreateCustomerBooking = () => {
    if (!bookingModalRecord) return;
    const guestId = bookingModalRecord.id;
    const newBookingId = `cb-${Date.now()}`;

    const finalLicensePlates = Array.from(
      new Set([
        ...bookingLicensePlates,
        ...(bookingLicensePlate.trim() ? [bookingLicensePlate.trim()] : []),
      ])
    );
    const finalCarModels = Array.from(
      new Set([
        ...bookingCarModels,
        ...(bookingCarModel.trim() ? [bookingCarModel.trim()] : []),
      ])
    );
    const licensePlateStr = finalLicensePlates.join(', ');
    const carModelStr = finalCarModels.join(', ');

    const createBookingActivity: ActivityItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'task',
      action: 'Tạo Lịch hẹn Khách đặt',
      content: `Đã tạo lịch hẹn cho khách hàng ${bookingModalRecord.fullName} (${bookingPhone})\nThời gian hẹn: ${bookingTimeSlot} - ${bookingDate}\nYêu cầu dịch vụ: ${bookingServiceRequest || 'Chưa nhập'}\nDịch vụ góp ý: ${bookingSuggestedTags.join(', ') || 'Chưa chọn'}\nBiển số xe: ${licensePlateStr || 'Chưa nhập'} | Dòng xe: ${carModelStr || 'Chưa nhập'}`,
      timestamp: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      author: 'quych@pbsofu.vn',
    };

    const currentActivities = [
      createBookingActivity,
      ...(guestActivityHistory[guestId] || []),
    ];
    const currentNotes = [...(guestHistory[guestId] || [])];
    const currentTasks = [...(guestTasks[guestId] || [])];

    setGuestActivityHistory((prev) => ({
      ...prev,
      [guestId]: [createBookingActivity, ...(prev[guestId] || [])],
    }));

    const allTargetBookingIds = [
      newBookingId,
      ...getLinkedBookingIds(guestId),
    ];

    const mappedBookingActivities: BookingActivityItem[] =
      currentActivities.map((act) => ({
        id: act.id,
        action: act.action,
        detail: act.content,
        actor: act.author,
        timestamp: act.timestamp,
      }));

    setBookingActivities((prev) => {
      const next = { ...prev };
      allTargetBookingIds.forEach((bId) => {
        next[bId] = mappedBookingActivities.map((a) => ({ ...a }));
      });
      return next;
    });

    setBookingInternalNotes((prev) => {
      const next = { ...prev };
      allTargetBookingIds.forEach((bId) => {
        next[bId] = currentNotes.map((n) => ({ ...n }));
      });
      return next;
    });

    setBookingTasks((prev) => {
      const next = { ...prev };
      allTargetBookingIds.forEach((bId) => {
        next[bId] = currentTasks.map((t) => ({ ...t }));
      });
      return next;
    });

    setBookingCounts((prev) => ({
      ...prev,
      [guestId]: (prev[guestId] || 0) + 1,
    }));

    const newBookingPayload: Omit<CustomerBookingRecord, 'id' | 'bookingCode'> & {
      id?: string;
    } = {
      id: newBookingId,
      licensePlate: licensePlateStr || 'Chưa cập nhật',
      carModel: carModelStr || 'Chưa cập nhật',
      customerName: bookingModalRecord.fullName,
      phone: bookingPhone.trim(),
      appointmentDate: bookingDate.trim(),
      appointmentTimeSlot: bookingTimeSlot.trim(),
      serviceRequest: bookingServiceRequest.trim(),
      suggestedServices: [...bookingSuggestedTags],
      advisorName: 'Nguyễn Văn Tuấn',
      source: 'Module Khách hàng quan tâm',
      sourceCode: bookingModalRecord.code,
      campaignOrNote: bookingModalRecord.name,
      status: 'Chờ xe tới',
      potentialCustomerId: guestId,
    };

    if (onCreateCustomerBooking) {
      onCreateCustomerBooking(newBookingPayload);
    } else {
      setCustomerBookings((prev) => {
        const nextNum = String(prev.length + 1).padStart(2, '0');
        return [
          {
            ...newBookingPayload,
            id: newBookingId,
            bookingCode: `LH-241027-${nextNum}`,
          },
          ...prev,
        ];
      });
    }

    setIsBookingConfirmPopupOpen(false);
    setBookingModalRecord(null);
  };

  const handleApplyFilter = () => {
    setAppliedFilters({
      search: filterSearch,
      code: filterCode,
      status: filterStatus,
      callStatus: filterCallStatus,
      callResult: filterCallResult,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      source: filterSource,
      carBrand: filterCarBrand,
      carModel: filterCarModel,
      createdBy: filterCreatedBy
    });
  };

  const handleClearFilter = () => {
    setFilterSearch('');
    setFilterCode('');
    setFilterStatus('Tất cả');
    setFilterCallStatus('Tất cả');
    setFilterCallResult('Tất cả');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterSource('Tất cả');
    setFilterCarBrand('Tất cả');
    setFilterCarModel('Tất cả');
    setFilterCreatedBy('Tất cả');
    setAppliedFilters({
      search: '',
      code: '',
      status: 'Tất cả',
      callStatus: 'Tất cả',
      callResult: 'Tất cả',
      dateFrom: '',
      dateTo: '',
      source: 'Tất cả',
      carBrand: 'Tất cả',
      carModel: 'Tất cả',
      createdBy: 'Tất cả'
    });
  };

  // Unique events for the dropdown
  const uniqueEvents = Array.from(new Map<string, PotentialCustomerItem>(events.map(item => [item.code, item])).values());
  const filteredDropdownEvents = uniqueEvents.filter(item => 
    item.code.toLowerCase().includes(filterCode.toLowerCase()) || 
    item.name.toLowerCase().includes(filterCode.toLowerCase())
  );

  const uniqueCarBrands = Array.from(new Set(events.map(item => item.carBrand).filter(Boolean))) as string[];
  const uniqueCarModels = Array.from(new Set(
    events
      .filter(item => filterCarBrand === 'Tất cả' || item.carBrand === filterCarBrand)
      .map(item => item.carModel)
      .filter(Boolean)
  )) as string[];
  const uniqueCreators = Array.from(new Set(events.map(item => item.createdBy).filter(Boolean))) as string[];

  const filteredData = events.filter((item) => {
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(searchLower);
      const matchPhone = item.phone.toLowerCase().includes(searchLower);
      const matchEmail = item.email.toLowerCase().includes(searchLower);
      const matchPlate = (item.licensePlate || '').toLowerCase().includes(searchLower);
      const matchRo = (item.originalRoCode || '').toLowerCase().includes(searchLower);
      if (hideRegistrationSummary) {
        if (!matchName && !matchPhone && !matchEmail && !matchPlate && !matchRo) return false;
      } else {
        if (!matchName && !matchPhone && !matchEmail) return false;
      }
    }
    if (!hideRegistrationSummary && appliedFilters.code && !item.code.toLowerCase().includes(appliedFilters.code.toLowerCase())) return false;
    if (appliedFilters.status !== 'Tất cả' && item.status !== appliedFilters.status) return false;
    if (appliedFilters.callStatus !== 'Tất cả' && item.callStatus !== appliedFilters.callStatus) return false;
    if (appliedFilters.callResult !== 'Tất cả' && item.callResult !== appliedFilters.callResult) return false;
    if (!hideRegistrationSummary && appliedFilters.source !== 'Tất cả' && item.source !== appliedFilters.source) return false;
    if (hideRegistrationSummary && appliedFilters.carBrand !== 'Tất cả' && item.carBrand !== appliedFilters.carBrand) return false;
    if (hideRegistrationSummary && appliedFilters.carModel !== 'Tất cả' && item.carModel !== appliedFilters.carModel) return false;
    if (hideRegistrationSummary && appliedFilters.createdBy !== 'Tất cả' && item.createdBy !== appliedFilters.createdBy) return false;
    
    if (appliedFilters.dateFrom || appliedFilters.dateTo) {
      const [day, month, year] = item.registrationDate.split('/');
      const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      if (appliedFilters.dateFrom) {
        const fromDate = new Date(appliedFilters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) return false;
      }
      
      if (appliedFilters.dateTo) {
        const toDate = new Date(appliedFilters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (itemDate > toDate) return false;
      }
    }
    
    return true;
  });

  const handleDelete = () => {
    setEvents(events.filter(event => !selectedRows.includes(event.id)));
    setSelectedRows([]);
  };

  const handleExportExcel = () => {
    const headers = isCustomerSegmentsMode
      ? ['STT', 'Trạng thái', 'Tên phân khúc khách hàng', 'Mục đích', 'Tổng tiêu chí lọc', 'Phạm vị lọc RO', 'Người tạo', 'Ngày tạo']
      : hideRegistrationSummary
      ? ['STT', 'Trạng thái cuộc gọi', 'Kết quả cuộc gọi', 'Trạng thái', 'Khách hàng', 'Số điện thoại', 'Email', 'Biển số xe', 'Hiệu xe', 'Dòng xe', 'RO gốc', 'Ngày nhận - Ngày giao của RO gốc', 'Doanh thu RO gốc', 'Người tạo', 'Ngày tạo']
      : ['STT', 'Trạng thái cuộc gọi', 'Kết quả cuộc gọi', 'Họ và tên', 'Số điện thoại', 'Email', 'Nhu cầu', 'Ngày tạo', 'Nguồn', 'Mã người dùng (Kênh)', 'Mã chiến dịch', 'Tên chiến dịch', 'Ngày hẹn', 'Khung giờ hẹn', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row, index) => 
        isCustomerSegmentsMode
          ? [index + 1, `"${row.status}"`, `"${row.segmentName || row.name || ''}"`, `"${row.segmentPurpose || ''}"`, `"${row.totalFilterCriteria ?? ''}"`, `"${row.roFilterScope || ''}"`, `"${row.createdBy || ''}"`, row.registrationDate].join(',')
          : hideRegistrationSummary
          ? [index + 1, `"${row.callStatus}"`, `"${row.callResult}"`, `"${row.status}"`, `"${row.fullName}"`, row.phone, row.email, `"${row.licensePlate || ''}"`, `"${row.carBrand || ''}"`, `"${row.carModel || ''}"`, `"${row.originalRoCode || ''}"`, `"${row.originalRoDates || ''}"`, `"${row.originalRoRevenue || ''}"`, `"${row.createdBy || ''}"`, row.registrationDate].join(',')
          : [index + 1, `"${row.callStatus}"`, `"${row.callResult}"`, `"${row.fullName}"`, row.phone, row.email, `"${row.demands.join(', ')}"`, row.registrationDate, `"${row.source}"`, `"${row.channelUserCode}"`, row.code, `"${row.name}"`, row.appointmentDate, `"${row.appointmentTimeSlot}"`, `"${row.status}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', isCustomerSegmentsMode ? 'phan_khuc_khach_hang.csv' : hideRegistrationSummary ? 'lich_nhac_chu_dong.csv' : 'khach_hang_tiem_nang.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRegistrations = filteredData.length;
  const completedCount = filteredData.filter(item => item.status === 'Xe đã đến' || item.status === 'Đã xác nhận').length;
  const newCount = filteredData.filter(item => item.status === 'Chờ xác nhận').length;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          {isCustomerSegmentsMode
            ? 'Phân khúc Khách hàng'
            : hideRegistrationSummary
            ? 'Lịch nhắc chủ động'
            : 'Khách hàng quan tâm'}
        </h1>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 flex items-center gap-2 bg-gray-50 border-b border-gray-200">
        <button 
          disabled={!hideRegistrationSummary}
          onClick={() => {
            if (isCustomerSegmentsMode) {
              setSegmentName('');
              setSegmentPurpose('');
              setIsSegmentPurposeDropdownOpen(false);
              setSelectedPreviousSegmentId('');
              setSegmentRoAllDates(true);
              setSegmentRoDateFrom('');
              setSegmentRoDateTo('');
              setSegmentRoActiveChip(null);
              setSegmentSelectedRoTypes([]);
              setSegmentDetailRows([]);
              setIsSegmentModalOpen(true);
            } else if (hideRegistrationSummary) {
              setEditingReminderRecord(null);
              setQuoteSearch('');
              setQuoteVehicleFilter('Tất cả xe');
              setQuoteDateFrom('');
              setQuoteDateTo('');
              setQuoteApprovalStatus('Tất cả');
              setSelectedQuoteItems({});
              setIsQuotationPickerOpen(true);
            }
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            hideRegistrationSummary
              ? 'bg-[#1A73E8] hover:bg-blue-700 text-white cursor-pointer shadow-sm'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" /> Thêm
        </button>
        <button 
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedRows.length > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
        <button 
          onClick={handleExportExcel}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Xuất Excel
        </button>
        {!hideRegistrationSummary && (
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4" /> Thiết lập Chiến dịch
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 flex flex-col gap-4 border-b border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px] max-w-[300px]">
            <input 
              type="text" 
              placeholder={hideRegistrationSummary ? "Tìm Khách hàng, SĐT, Email, Biển số, RO gốc..." : "Tìm kiếm Họ tên, SĐT, Email..."} 
              value={filterSearch}
              onChange={(e) => {
                setFilterSearch(e.target.value);
                setAppliedFilters(prev => ({ ...prev, search: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
            />
          </div>
          {!hideRegistrationSummary ? (
            <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[250px] relative">
              <input 
                type="text" 
                placeholder="Mã chiến dịch" 
                value={filterCode}
                onChange={(e) => {
                  setFilterCode(e.target.value);
                  setAppliedFilters(prev => ({ ...prev, code: e.target.value }));
                  setIsCodeDropdownOpen(true);
                }}
                onFocus={() => setIsCodeDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsCodeDropdownOpen(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
              />
              {isCodeDropdownOpen && filteredDropdownEvents.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredDropdownEvents.map((evt) => (
                    <div
                      key={evt.code}
                      className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setFilterCode(evt.code);
                        setAppliedFilters(prev => ({ ...prev, code: evt.code }));
                        setIsCodeDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium text-gray-800">{evt.code}</div>
                      <div className="text-xs text-gray-500">{evt.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-1.5 flex-1 min-w-[140px] max-w-[180px]">
                <select 
                  value={filterCarBrand}
                  onChange={(e) => {
                    setFilterCarBrand(e.target.value);
                    setFilterCarModel('Tất cả');
                    setAppliedFilters(prev => ({ ...prev, carBrand: e.target.value, carModel: 'Tất cả' }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
                >
                  <option value="Tất cả">Hiệu xe</option>
                  {uniqueCarBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 flex-1 min-w-[140px] max-w-[180px]">
                <select 
                  value={filterCarModel}
                  onChange={(e) => {
                    setFilterCarModel(e.target.value);
                    setAppliedFilters(prev => ({ ...prev, carModel: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
                >
                  <option value="Tất cả">Dòng xe</option>
                  {uniqueCarModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
                <select 
                  value={filterCreatedBy}
                  onChange={(e) => {
                    setFilterCreatedBy(e.target.value);
                    setAppliedFilters(prev => ({ ...prev, createdBy: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
                >
                  <option value="Tất cả">Người tạo</option>
                  {uniqueCreators.map(creator => (
                    <option key={creator} value={creator}>{creator}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <select 
              value={filterCallStatus}
              onChange={(e) => {
                setFilterCallStatus(e.target.value);
                setAppliedFilters(prev => ({ ...prev, callStatus: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
            >
              <option value="Tất cả">Trạng thái cuộc gọi</option>
              <option value="Chưa gọi">Chưa gọi</option>
              <option value="Đã gọi">Đã gọi</option>
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <select 
              value={filterCallResult}
              onChange={(e) => {
                setFilterCallResult(e.target.value);
                setAppliedFilters(prev => ({ ...prev, callResult: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
            >
              <option value="Tất cả">Kết quả cuộc gọi</option>
              <option value="Rỗng">Rỗng</option>
              <option value="Đồng ý tham gia">Đồng ý tham gia</option>
              <option value="Từ chối">Từ chối</option>
              <option value="Sai số điện thoại">Sai số điện thoại</option>
              <option value="Không liên hệ được lần 1">Không liên hệ được lần 1</option>
              <option value="Không liên hệ được lần 2">Không liên hệ được lần 2</option>
              <option value="Không liên hệ được lần 3">Không liên hệ được lần 3</option>
            </select>
          </div>
          {!hideRegistrationSummary && (
            <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
              <select 
                value={filterSource}
                onChange={(e) => {
                  setFilterSource(e.target.value);
                  setAppliedFilters(prev => ({ ...prev, source: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
              >
                <option value="Tất cả">Nguồn</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Maps">Google Maps</option>
                <option value="Zalo OA">Zalo OA</option>
                <option value="Website">Website</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
          )}
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <select 
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setAppliedFilters(prev => ({ ...prev, status: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white"
            >
              <option value="Tất cả">Trạng thái</option>
              {hideRegistrationSummary ? (
                <>
                  <option value="Mới">Mới</option>
                  <option value="Đang theo dõi">Đang theo dõi</option>
                  <option value="Khách hàng đã đặt lịch">Khách hàng đã đặt lịch</option>
                  <option value="Khách hàng từ chối">Khách hàng từ chối</option>
                </>
              ) : (
                <>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đã hủy">Đã hủy</option>
                  <option value="Chờ xóa">Chờ xóa</option>
                </>
              )}
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <input 
              type="date" 
              value={filterDateFrom}
              onChange={(e) => {
                setFilterDateFrom(e.target.value);
                setAppliedFilters(prev => ({ ...prev, dateFrom: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
              title="Từ ngày"
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
            <input 
              type="date" 
              value={filterDateTo}
              onChange={(e) => {
                setFilterDateTo(e.target.value);
                setAppliedFilters(prev => ({ ...prev, dateTo: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
              title="Đến ngày"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleApplyFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Filter className="w-4 h-4" /> Lọc
            </button>
            <button 
              onClick={handleClearFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" /> Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        {filteredData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
            <Inbox className="w-12 h-12 opacity-50" />
            <p className="text-sm font-medium">Không có dữ liệu</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200 text-center w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                  />
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-center w-12">STT</th>
                {!hideRegistrationSummary && (
                  <th className="px-4 py-3 border-b border-gray-200 text-center">Trùng Khách hàng</th>
                )}
                <th className="px-4 py-3 border-b border-gray-200 text-center">Hành động</th>
                {!isCustomerSegmentsMode && (
                  <>
                    <th className="px-4 py-3 border-b border-gray-200">Trạng thái cuộc gọi</th>
                    <th className="px-4 py-3 border-b border-gray-200">Kết quả cuộc gọi</th>
                  </>
                )}
                {hideRegistrationSummary && (
                  <th className="px-4 py-3 border-b border-gray-200">Trạng thái</th>
                )}
                {isCustomerSegmentsMode ? (
                  <>
                    <th className="px-4 py-3 border-b border-gray-200">Tên phân khúc khách hàng</th>
                    <th className="px-4 py-3 border-b border-gray-200">Mục đích</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-center">Tổng tiêu chí lọc</th>
                    <th className="px-4 py-3 border-b border-gray-200">Phạm vị lọc RO</th>
                    <th className="px-4 py-3 border-b border-gray-200">Người tạo</th>
                    <th className="px-4 py-3 border-b border-gray-200">Ngày tạo</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 border-b border-gray-200">{hideRegistrationSummary ? 'Khách hàng' : 'Họ và tên'}</th>
                    <th className="px-4 py-3 border-b border-gray-200">Số điện thoại</th>
                    <th className="px-4 py-3 border-b border-gray-200">Email</th>
                    {hideRegistrationSummary ? (
                      <>
                        <th className="px-4 py-3 border-b border-gray-200">Biển số xe</th>
                        <th className="px-4 py-3 border-b border-gray-200">Hiệu xe</th>
                        <th className="px-4 py-3 border-b border-gray-200">Dòng xe</th>
                        <th className="px-4 py-3 border-b border-gray-200">RO gốc</th>
                        <th className="px-4 py-3 border-b border-gray-200">Ngày nhận - Ngày giao của RO gốc</th>
                        <th className="px-4 py-3 border-b border-gray-200 text-right">Doanh thu RO gốc</th>
                        <th className="px-4 py-3 border-b border-gray-200">Người tạo</th>
                        <th className="px-4 py-3 border-b border-gray-200">Ngày tạo</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 border-b border-gray-200">Nhu cầu</th>
                        <th className="px-4 py-3 border-b border-gray-200">Ngày tạo</th>
                        <th className="px-4 py-3 border-b border-gray-200 text-center">Nguồn</th>
                        <th className="px-4 py-3 border-b border-gray-200">Mã người dùng (Kênh)</th>
                        <th className="px-4 py-3 border-b border-gray-200">Mã chiến dịch</th>
                        <th className="px-4 py-3 border-b border-gray-200">Tên chiến dịch</th>
                        <th className="px-4 py-3 border-b border-gray-200">Ngày hẹn</th>
                        <th className="px-4 py-3 border-b border-gray-200">Khung giờ hẹn</th>
                        <th className="px-4 py-3 border-b border-gray-200">Trạng thái</th>
                      </>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, index) => {
                const dupInfo = getDuplicateInfo(row);
                return (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (hideRegistrationSummary) {
                      setEditingReminderRecord(row);
                      setQuoteSearch('');
                      setQuoteVehicleFilter('Tất cả xe');
                      setQuoteDateFrom('');
                      setQuoteDateTo('');
                      setQuoteApprovalStatus('Tất cả');
                      if (
                        row.selectedQuoteItemsMap &&
                        Object.keys(row.selectedQuoteItemsMap).some(
                          (k) => (row.selectedQuoteItemsMap?.[k] || []).length > 0
                        )
                      ) {
                        setSelectedQuoteItems(row.selectedQuoteItemsMap);
                      } else {
                        const matchedQuote = MOCK_QUOTATIONS_FOR_REMINDERS.find(
                          (q) =>
                            q.quoteCode === row.code ||
                            (row.originalRoCode && q.originalRoCode === row.originalRoCode) ||
                            (row.licensePlate && q.licensePlate === row.licensePlate)
                        );
                        if (matchedQuote) {
                          setSelectedQuoteItems({
                            [matchedQuote.id]: matchedQuote.items.map((i) => i.id),
                          });
                        } else {
                          const synthId = `q-row-${row.id}`;
                          setSelectedQuoteItems({
                            [synthId]: [`${synthId}-item-1`, `${synthId}-item-2`],
                          });
                        }
                      }
                      setIsQuotationPickerOpen(true);
                    } else {
                      setSelectedRecord(row);
                    }
                  }}
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                  {!hideRegistrationSummary && (
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <div className="relative group inline-flex items-center justify-center">
                          <button
                            className={`relative flex items-center justify-center p-1.5 rounded-md transition-colors ${
                              dupInfo.hasDuplicate
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={
                              dupInfo.hasDuplicate
                                ? `Dữ liệu này trùng với hồ sơ của khách hàng ${dupInfo.matchedCustomers.map(m => `${m.customer.customerName} (${m.customer.customerCode})`).join(', ')}. Bấm để xem thông tin chi tiết.`
                                : 'Không trùng dữ liệu trong Module Khách hàng'
                            }
                            onClick={() => {
                              setDuplicateCheckFilter('all');
                              setDuplicateCheckRecord(row);
                            }}
                          >
                            {dupInfo.hasDuplicate ? (
                              <>
                                <ShieldAlert className="w-4 h-4" />
                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                                  !
                                </span>
                              </>
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </button>
                          {dupInfo.hasDuplicate && (
                            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 w-72 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg text-left whitespace-normal leading-relaxed">
                              <div>
                                Dữ liệu này trùng với hồ sơ của khách hàng{' '}
                                <span className="font-semibold text-amber-300">
                                  {dupInfo.matchedCustomers.map(m => `${m.customer.customerName} (${m.customer.customerCode})`).join(', ')}
                                </span>.
                              </div>
                              <div className="text-gray-300 mt-1 text-[11px] italic">
                                Bấm để xem thông tin chi tiết.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                        title="Tạo Lịch hẹn Khách đặt"
                        onClick={() => handleCreateCustomerBooking(row)}
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" 
                        title="Gửi Email"
                        onClick={() => openEmailModalForRecord(row)}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 text-[#0068FF] hover:bg-blue-100 rounded-md transition-colors"
                        title="Gửi Zalo"
                        onClick={() => {
                          setSelectedZaloRecord(row);
                          setZaloContent(getZaloDefaultContent(row));
                          setZaloAttachments([]);
                          setZaloModalOpen(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      {!hideRegistrationSummary && (
                        <button 
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors" 
                          title="Thông tin Khách hàng quan tâm"
                          onClick={() => {
                            setSelectedGuestRecord(row);
                            setActiveTab('activity_history');
                            setGuestProfileModalOpen(true);
                          }}
                        >
                          <User className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="relative flex items-center justify-center p-1.5 text-purple-600 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
                        title="Danh sách Lịch hẹn Khách đặt"
                        onClick={() => setBookingListModalCustomer(row)}
                      >
                        <Calendar className="w-4 h-4" />
                        {customerBookings.filter(
                          (b) =>
                            b.source === 'Module Khách hàng quan tâm' &&
                            b.potentialCustomerId === row.id
                        ).length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {
                              customerBookings.filter(
                                (b) =>
                                  b.source === 'Module Khách hàng quan tâm' &&
                                  b.potentialCustomerId === row.id
                              ).length
                            }
                          </span>
                        )}
                      </button>
                      <button 
                        className={`relative flex items-center justify-center p-1.5 rounded-md transition-colors ${(guestTasks[row.id]?.filter(t => !t.completed).length || 0) > 0 ? 'text-orange-500 hover:bg-orange-100' : 'text-gray-400 hover:bg-gray-100'}`} 
                        title="Lời nhắc chưa hoàn thành"
                        onClick={() => {
                          setSelectedGuestRecord(row);
                          setActiveTab('tasks');
                          setGuestProfileModalOpen(true);
                        }}
                      >
                        <Hourglass className="w-4 h-4" />
                        {(guestTasks[row.id]?.filter(t => !t.completed).length || 0) > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {guestTasks[row.id].filter(t => !t.completed).length}
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                  {!isCustomerSegmentsMode && (
                    <>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={row.callStatus} 
                          onChange={(e) => handleCallStatusChange(row.id, e.target.value as any)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        >
                          <option value="Chưa gọi">Chưa gọi</option>
                          <option value="Đã gọi">Đã gọi</option>
                        </select>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={row.callResult} 
                          onChange={(e) => handleCallResultChange(row.id, e.target.value as any)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        >
                          <option value="Rỗng">Rỗng</option>
                          <option value="Đồng ý tham gia">Đồng ý tham gia</option>
                          <option value="Từ chối">Từ chối</option>
                          <option value="Sai số điện thoại">Sai số điện thoại</option>
                          <option value="Không liên hệ được lần 1">Không liên hệ được lần 1</option>
                          <option value="Không liên hệ được lần 2">Không liên hệ được lần 2</option>
                          <option value="Không liên hệ được lần 3">Không liên hệ được lần 3</option>
                        </select>
                      </td>
                    </>
                  )}
                  {hideRegistrationSummary && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value as PotentialCustomerStatus)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${
                          row.status === 'Khách hàng đã đặt lịch'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : row.status === 'Mới'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : row.status === 'Đang theo dõi'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="Mới">Mới</option>
                        <option value="Đang theo dõi">Đang theo dõi</option>
                        <option value="Khách hàng đã đặt lịch">Khách hàng đã đặt lịch</option>
                        <option value="Khách hàng từ chối">Khách hàng từ chối</option>
                      </select>
                    </td>
                  )}
                  {!isCustomerSegmentsMode && (
                    <>
                      <td className="px-4 py-3 text-gray-800">{row.fullName}</td>
                      <td className="px-4 py-3 text-gray-800">{row.phone}</td>
                      <td className="px-4 py-3 text-gray-800">{row.email}</td>
                    </>
                  )}
                  {hideRegistrationSummary ? (
                    isCustomerSegmentsMode ? (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.segmentName || row.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {row.segmentPurpose || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200">
                            {row.totalFilterCriteria ?? 0} tiêu chí
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {row.roFilterScope || 'Tất cả'}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {row.createdBy || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {row.registrationDate}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.licensePlate || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{row.carBrand || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{row.carModel || '-'}</td>
                        <td
                          className="px-4 py-3 font-medium text-[#1A73E8] hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoDetailRow(row);
                          }}
                          title="Nhấn để xem chi tiết RO gốc"
                        >
                          {row.originalRoCode || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{row.originalRoDates || '-'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{row.originalRoRevenue || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{row.createdBy || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{row.registrationDate}</td>
                      </>
                    )
                  ) : (
                    <>
                      <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setOpenDemandDropdownId(openDemandDropdownId === row.id ? null : row.id)}
                            className="min-w-[180px] max-w-[260px] px-2.5 py-1.5 border border-gray-300 rounded-md bg-white hover:border-[#1A73E8] text-left flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex flex-wrap gap-1 overflow-hidden">
                              {row.demands.length === 0 ? (
                                <span className="text-xs text-gray-400">Chọn nhu cầu...</span>
                              ) : (
                                row.demands.map((d) => (
                                  <span
                                    key={d}
                                    className="px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-medium whitespace-nowrap"
                                  >
                                    {d}
                                  </span>
                                ))
                              )}
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          </button>

                          {openDemandDropdownId === row.id && (
                            <div className="absolute left-0 top-full mt-1 z-30 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5">
                              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500">Chọn nhiều nhu cầu</span>
                                <button
                                  type="button"
                                  onClick={() => setOpenDemandDropdownId(null)}
                                  className="text-xs text-[#1A73E8] hover:underline font-medium"
                                >
                                  Xong
                                </button>
                              </div>
                              {DEMAND_OPTIONS.map((option) => {
                                const checked = row.demands.includes(option);
                                return (
                                  <label
                                    key={option}
                                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50/60 cursor-pointer text-xs text-gray-800"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => handleToggleDemand(row.id, option)}
                                      className="w-3.5 h-3.5 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                                    />
                                    <span className={checked ? 'font-semibold text-[#1A73E8]' : ''}>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.registrationDate}</td>
                      <td className="px-4 py-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-center relative">
                          <button
                            type="button"
                            onClick={() => setOpenSourceDropdownId(openSourceDropdownId === row.id ? null : row.id)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                            title={`Nguồn: ${row.source} (Nhấn để đổi)`}
                          >
                            {renderSourceIcon(row.source)}
                          </button>
                          {openSourceDropdownId === row.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 px-2 flex items-center gap-1.5">
                              {SOURCE_OPTIONS.map((src) => (
                                <button
                                  key={src}
                                  type="button"
                                  onClick={() => handleSourceChange(row.id, src)}
                                  className={`p-1 rounded-full transition-transform hover:scale-110 ${
                                    row.source === src ? 'ring-2 ring-[#14A64A] bg-green-50' : ' opacity-80 hover:opacity-100'
                                  }`}
                                  title={src}
                                >
                                  {renderSourceIcon(src)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.channelUserCode}</td>
                      <td className="px-4 py-3 font-medium text-[#1A73E8] hover:underline">{row.code}</td>
                      <td className="px-4 py-3 text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-gray-800">{row.appointmentDate}</td>
                      <td className="px-4 py-3 text-gray-800">{row.appointmentTimeSlot}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row.id, e.target.value as PotentialCustomerStatus)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${
                            row.status === 'Xe đã đến'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : row.status === 'Đã xác nhận'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : row.status === 'Chờ xác nhận'
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : row.status === 'Bỏ hẹn'
                              ? 'bg-orange-100 text-orange-700 border-orange-200'
                              : row.status === 'Chờ xóa'
                              ? 'bg-gray-200 text-gray-700 border-gray-300'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Đã hủy">Đã hủy</option>
                          <option value="Chờ xóa">Chờ xóa</option>
                        </select>
                      </td>
                    </>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Detail / Statistics */}
      {!hideRegistrationSummary && (
        <div className="h-48 border-t border-gray-200 bg-white flex flex-col items-center justify-center flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-center gap-8 w-full max-w-5xl mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex-1 text-center shadow-sm">
              <div className="text-blue-800 text-sm font-bold uppercase tracking-wider mb-2">Tổng số lượng đăng ký ban đầu</div>
              <div className="text-blue-600 text-4xl font-black">{totalRegistrations}</div>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex-1 text-center shadow-sm">
              <div className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-2">Số lượng "Hoàn tất"</div>
              <div className="text-emerald-600 text-4xl font-black">{completedCount}</div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex-1 text-center shadow-sm">
              <div className="text-amber-800 text-sm font-bold uppercase tracking-wider mb-2">Số lượng "Mới tạo" còn lại</div>
              <div className="text-amber-600 text-4xl font-black">{newCount}</div>
            </div>
          </div>
          <div className="text-gray-700 text-sm font-semibold bg-gray-100 px-6 py-2.5 rounded-full border border-gray-300 shadow-inner">
            Kết quả hiển thị theo bộ lọc: Mã sự kiện, Trạng thái cuộc gọi, Kết quả cuộc gọi, Nguồn, Trạng thái Check-in & Ngày đăng ký.
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#F4F6F8] w-[800px] max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Thêm mới sự kiện</h2>
              <button onClick={() => setIsCreating(false)} className="p-1 text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-white border border-gray-200 rounded-md p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sự kiện <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Garage / Công ty <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng ký <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="DD/MM/YYYY" />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 bg-white" defaultValue="Mới tạo">
                      <option value="Mới tạo">Mới tạo</option>
                      <option value="Hoàn tất">Hoàn tất</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="DD/MM/YYYY" />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="DD/MM/YYYY" />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Khóa sự kiện</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setIsCreating(false)} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Đóng</button>
              <button onClick={() => setIsCreating(false)} className="px-6 py-2 text-sm font-medium text-white bg-[#1A73E8] hover:bg-blue-700 rounded-md transition-colors">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#F4FBF7] w-[800px] max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#E5F3EB]">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 bg-[#F4FBF7] border-b border-[#E5F3EB]">
              <div>
                <h2 className="text-xl font-bold text-[#003311]">Xem chi tiết thông tin người đăng ký</h2>
                <p className="text-xs text-gray-500 italic mt-1">Dữ liệu ở chế độ chỉ đọc, không thể chỉnh sửa.</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-1 text-[#22C55E] hover:text-green-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Card 1: Event Info */}
              <div className="bg-white border border-[#BBE5CE] rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mã sự kiện</div>
                    <div className="text-sm font-bold text-gray-900">{selectedRecord.code}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tên sự kiện</div>
                    <div className="text-sm text-gray-800">{selectedRecord.name}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Đường dẫn sự kiện</div>
                  <a href={selectedRecord.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#22C55E] hover:underline break-all">
                    {selectedRecord.link}
                  </a>
                </div>
              </div>

              {/* Card 2: User Info */}
              <div className="bg-white border border-[#BBE5CE] rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-6 mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Họ và tên</div>
                    <div className="text-sm text-gray-800">{selectedRecord.fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tên Garage / Công ty</div>
                    <div className="text-sm text-gray-800">{selectedRecord.garageName}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Số điện thoại</div>
                    <div className="text-sm text-gray-800">{selectedRecord.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="text-sm text-gray-800">{selectedRecord.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ngày đăng ký</div>
                    <div className="text-sm text-gray-800">{selectedRecord.registrationDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nguồn</div>
                    <div className="text-sm text-gray-800">{selectedRecord.source}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Địa chỉ</div>
                  <div className="text-sm text-gray-800">{selectedRecord.address}</div>
                </div>
              </div>

              {/* Card 3: Roles */}
              <div>
                <h3 className="text-base font-bold text-[#003311] mb-2">Vai trò đăng ký</h3>
                <div className="grid grid-cols-3 gap-y-2 gap-x-4 mb-2">
                  {['Nhà đầu tư', 'Chủ Garage', 'Kỹ thuật viên', 'Cố vấn Garage', 'Kế toán Garage', 'Khác'].map(role => {
                    const isChecked = selectedRecord.roles?.includes(role) || (role === 'Chủ Garage' || role === 'Cố vấn Garage' || role === 'Khác');
                    return (
                      <label key={role} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#22C55E] border-[#22C55E]' : 'bg-white border-gray-300'}`}>
                          {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="bg-white border border-[#BBE5CE] rounded-lg p-2.5 text-sm text-gray-800">
                  {selectedRecord.otherRole || 'Nhà cung cấp linh kiện'}
                </div>
              </div>

              {/* Card 4: Notes */}
              <div className="bg-white border border-[#BBE5CE] rounded-xl p-4 shadow-sm">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Câu hỏi/ghi chú của người dùng</div>
                <div className="text-sm text-gray-700 leading-relaxed bg-[#F9FAFB] p-3 rounded-lg border border-gray-100">
                  {selectedRecord.notes || 'Tôi quan tâm đến các giải pháp chuyển đổi số cho Garage quy mô lớn. Mong chương trình có thể chia sẻ thêm về các phần mềm quản lý kho và CRM tích hợp. Tôi cũng muốn hỏi về chính sách ưu đãi cho khách hàng đăng ký sớm.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <EventSettings 
          onClose={() => setShowSettings(false)} 
          events={events as any}
          onEventsChange={setEvents as any}
          entityLabel="chiến dịch"
        />
      )}

      {/* Email Modal */}
      {emailModalOpen && selectedEmailRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setEmailModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Soạn và Gửi Email</h2>
                <p className="text-xs text-gray-500 mt-0.5">ID: {selectedEmailRecord.code} • Khách hàng: {selectedEmailRecord.fullName}</p>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Người nhận (Email)</label>
                <input 
                  type="text" 
                  value={selectedEmailRecord.email}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tiêu đề Email (Subject Line)</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Tiêu đề email"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nội dung Email (Body)</label>
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
                        <span className="font-medium truncate max-w-[220px]">{file.name}</span>
                        <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                        <button
                          type="button"
                          onClick={() => setEmailAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-600 transition-colors"
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
                      setEmailAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => emailFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[#1A73E8] hover:text-blue-700 font-medium px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Đính kèm tệp</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const attachmentText = emailAttachments.length > 0
                      ? `\nĐính kèm: ${emailAttachments.map(f => f.name).join(', ')}`
                      : '';
                    addActivity(selectedEmailRecord.id, 'email', 'Gửi Email', `Tiêu đề: ${emailSubject}\nNội dung: ${emailContent}${attachmentText}`);
                    setEmailModalOpen(false);
                    setEmailContent('');
                    setEmailAttachments([]);
                  }}
                  className="px-6 py-2.5 text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg font-medium transition-colors"
                >
                  Gửi Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zalo Modal */}
      {zaloModalOpen && selectedZaloRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setZaloModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0068FF] text-white font-extrabold text-xs tracking-tighter shadow-xs">
                  Zalo
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Gửi tin nhắn Zalo</h2>
                  <p className="text-xs text-gray-500">ID: {selectedZaloRecord.code} • Kênh: {selectedZaloRecord.channelUserCode}</p>
                </div>
              </div>
              <button
                onClick={() => setZaloModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Người nhận</label>
                <input 
                  type="text" 
                  value={`${selectedZaloRecord.fullName} - ${selectedZaloRecord.phone}`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nội dung tin nhắn Zalo</label>
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
                        <span className="font-medium truncate max-w-[220px]">{file.name}</span>
                        <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                        <button
                          type="button"
                          onClick={() => setZaloAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-600 transition-colors"
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
                      setZaloAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => zaloFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[#0068FF] hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Đính kèm tệp</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setZaloModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const attachmentText = zaloAttachments.length > 0
                      ? `\nĐính kèm: ${zaloAttachments.map(f => f.name).join(', ')}`
                      : '';
                    addActivity(selectedZaloRecord.id, 'note', 'Gửi Zalo', `${zaloContent}${attachmentText}`);
                    setZaloModalOpen(false);
                    setZaloAttachments([]);
                  }}
                  className="px-6 py-2.5 text-white bg-[#0068FF] hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Gửi Zalo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Profile Modal (Thông tin Khách hàng tiềm năng) */}
      {guestProfileModalOpen && selectedGuestRecord && (() => {
        const currentGuest = events.find(e => e.id === selectedGuestRecord.id) || selectedGuestRecord;
        const guestDupInfo = getDuplicateInfo(currentGuest);
        return (
          <div className="fixed inset-0 bg-white z-50 flex flex-col w-screen h-screen overflow-hidden">
            {/* Top Bar */}
            <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Thông tin Khách hàng tiềm năng</h2>
              </div>
              <button 
                onClick={() => setGuestProfileModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Main 2-Column Body */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Left Column: Customer Info & General Info */}
              <div className="w-[54%] border-r border-gray-200 p-5 flex flex-col justify-between overflow-hidden bg-white">
                {(() => {
                  const guestQuotationEntries = (() => {
                    if (!hideRegistrationSummary) return [];
                    const synthId = `q-row-${currentGuest.id}`;
                    const parsedRev =
                      parseInt(
                        (currentGuest.originalRoRevenue || '750000').replace(/[^\d]/g, ''),
                        10
                      ) || 750000;
                    const item1Price = Math.round(parsedRev * 0.6);
                    const item2Price = parsedRev - item1Price;
                    const synthesizedQuote: QuotationRecord = {
                      id: synthId,
                      quoteCode: currentGuest.code.startsWith('BG')
                        ? currentGuest.code
                        : `BG-${currentGuest.originalRoCode || currentGuest.code}`,
                      quoteDate: '2026-11-09',
                      quoteDateTimeDisplay: `${currentGuest.registrationDate || '09/11/2026'} 14:30`,
                      licensePlate: currentGuest.licensePlate || '51H11111',
                      customerName: currentGuest.fullName,
                      phone: currentGuest.phone,
                      email: currentGuest.email,
                      carBrand: currentGuest.carBrand || 'Toyota',
                      carModel: currentGuest.carModel || 'Camry',
                      originalRoCode: currentGuest.originalRoCode || '2611-000003',
                      originalRoDates:
                        currentGuest.originalRoDates || '09/11/2026 - 09/11/2026',
                      originalRoRevenue: currentGuest.originalRoRevenue || '750.000 đ',
                      approvalStatus: 'Chờ khách duyệt',
                      items: [
                        {
                          id: `${synthId}-item-1`,
                          itemCode: 'BDĐK001',
                          itemName: 'Bảo dưỡng định kỳ & thay dầu động cơ tổng hợp',
                          unit: 'Gói',
                          quantity: 1,
                          unitPrice: item1Price,
                          totalPrice: item1Price,
                        },
                        {
                          id: `${synthId}-item-2`,
                          itemCode: 'PHANH002',
                          itemName: 'Kiểm tra & vệ sinh bố thắng, cân chỉnh thước lái',
                          unit: 'Lần',
                          quantity: 1,
                          unitPrice: item2Price,
                          totalPrice: item2Price,
                        },
                      ],
                    };

                    const allCandidateQuotes = [
                      ...MOCK_QUOTATIONS_FOR_REMINDERS,
                      synthesizedQuote,
                    ];

                    if (
                      currentGuest.selectedQuoteItemsMap &&
                      Object.keys(currentGuest.selectedQuoteItemsMap).some(
                        (k) => (currentGuest.selectedQuoteItemsMap?.[k] || []).length > 0
                      )
                    ) {
                      return allCandidateQuotes
                        .filter(
                          (q) =>
                            (currentGuest.selectedQuoteItemsMap?.[q.id] || []).length > 0
                        )
                        .map((q) => {
                          const checkedIds =
                            currentGuest.selectedQuoteItemsMap?.[q.id] || [];
                          return {
                            quote: q,
                            checkedItems: q.items.filter((i) =>
                              checkedIds.includes(i.id)
                            ),
                          };
                        });
                    }

                    const matchedQuote = MOCK_QUOTATIONS_FOR_REMINDERS.find(
                      (q) =>
                        q.quoteCode === currentGuest.code ||
                        (currentGuest.originalRoCode &&
                          q.originalRoCode === currentGuest.originalRoCode) ||
                        (currentGuest.licensePlate &&
                          q.licensePlate === currentGuest.licensePlate)
                    );

                    if (matchedQuote) {
                      return [
                        {
                          quote: matchedQuote,
                          checkedItems: matchedQuote.items,
                        },
                      ];
                    }

                    return [
                      {
                        quote: synthesizedQuote,
                        checkedItems: synthesizedQuote.items,
                      },
                    ];
                  })();

                  const allCheckedLineItems = guestQuotationEntries.flatMap((entry) =>
                    entry.checkedItems.map((item) => ({
                      ...item,
                      quoteCode: entry.quote.quoteCode,
                    }))
                  );
                  const totalPossibleItemsCount = guestQuotationEntries.reduce(
                    (sum, entry) => sum + entry.quote.items.length,
                    0
                  );
                  const totalCheckedAmount = allCheckedLineItems.reduce(
                    (sum, item) => sum + item.totalPrice,
                    0
                  );

                  return (
                    <div className="space-y-4 overflow-y-auto pr-1">
                      {/* Top Identity & Status */}
                      <div className="space-y-3 pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{currentGuest.fullName}</h3>
                          <p className="text-xs text-gray-500">
                            Ngày tạo: <span className="font-medium text-gray-700">{currentGuest.registrationDate}</span>
                          </p>
                        </div>

                        {/* Quick Action Buttons + Status on the same single line */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {!hideRegistrationSummary && (
                            <button
                              type="button"
                              onClick={() => setCallScriptModalGuest(currentGuest)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors border border-emerald-200 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" />
                              Xem kịch bản gọi
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCreateCustomerBooking(currentGuest)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition-colors border border-indigo-200"
                          >
                            <CalendarPlus className="w-4 h-4" />
                            Tạo Lịch hẹn Khách đặt
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedZaloRecord(currentGuest);
                              setZaloContent(getZaloDefaultContent(currentGuest));
                              setZaloAttachments([]);
                              setZaloModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#0068FF] rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Gửi Zalo
                          </button>
                          <button 
                            type="button"
                            onClick={() => openEmailModalForRecord(currentGuest)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors border border-gray-200"
                          >
                            <Mail className="w-4 h-4" />
                            Gửi Email
                          </button>
                          <select
                            value={currentGuest.status}
                            onChange={(e) => handleStatusChange(currentGuest.id, e.target.value as PotentialCustomerStatus)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer ${
                              hideRegistrationSummary
                                ? currentGuest.status === 'Khách hàng đã đặt lịch'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : currentGuest.status === 'Mới'
                                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                                  : currentGuest.status === 'Đang theo dõi'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-red-100 text-red-700 border-red-200'
                                : currentGuest.status === 'Xe đã đến'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : currentGuest.status === 'Đã xác nhận'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : currentGuest.status === 'Chờ xác nhận'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : currentGuest.status === 'Bỏ hẹn'
                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                : currentGuest.status === 'Chờ xóa'
                                ? 'bg-gray-200 text-gray-700 border-gray-300'
                                : 'bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            {hideRegistrationSummary ? (
                              <>
                                <option value="Mới">Mới</option>
                                <option value="Đang theo dõi">Đang theo dõi</option>
                                <option value="Khách hàng đã đặt lịch">Khách hàng đã đặt lịch</option>
                                <option value="Khách hàng từ chối">Khách hàng từ chối</option>
                              </>
                            ) : (
                              <>
                                <option value="Chờ xác nhận">Chờ xác nhận</option>
                                <option value="Đã xác nhận">Đã xác nhận</option>
                                <option value="Đã hủy">Đã hủy</option>
                                <option value="Chờ xóa">Chờ xóa</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      {hideRegistrationSummary ? (
                        <>
                          {/* THÔNG TIN CHUNG - Phù hợp với dữ liệu trong viewlist Lịch nhắc chủ động */}
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                              THÔNG TIN CHUNG
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {/* Khách hàng */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Khách hàng
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.fullName}
                                </div>
                              </div>

                              {/* Số điện thoại */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Số điện thoại
                                </div>
                                <div className="font-semibold text-gray-800 flex items-center gap-1.5 whitespace-nowrap">
                                  <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                  <span>{currentGuest.phone}</span>
                                </div>
                              </div>

                              {/* Email */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Email
                                </div>
                                <div
                                  className="font-semibold text-gray-800 flex items-center gap-1.5 truncate"
                                  title={currentGuest.email}
                                >
                                  <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                  <span className="truncate">{currentGuest.email}</span>
                                </div>
                              </div>

                              {/* Trạng thái cuộc gọi */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Trạng thái cuộc gọi
                                </div>
                                <select
                                  value={currentGuest.callStatus}
                                  onChange={(e) =>
                                    handleCallStatusChange(
                                      currentGuest.id,
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Chưa gọi">Chưa gọi</option>
                                  <option value="Đã gọi">Đã gọi</option>
                                </select>
                              </div>

                              {/* Kết quả cuộc gọi */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Kết quả cuộc gọi
                                </div>
                                <select
                                  value={currentGuest.callResult}
                                  onChange={(e) =>
                                    handleCallResultChange(
                                      currentGuest.id,
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Rỗng">Rỗng</option>
                                  <option value="Đồng ý tham gia">Đồng ý tham gia</option>
                                  <option value="Từ chối">Từ chối</option>
                                  <option value="Sai số điện thoại">Sai số điện thoại</option>
                                  <option value="Không liên hệ được lần 1">
                                    Không liên hệ được lần 1
                                  </option>
                                  <option value="Không liên hệ được lần 2">
                                    Không liên hệ được lần 2
                                  </option>
                                  <option value="Không liên hệ được lần 3">
                                    Không liên hệ được lần 3
                                  </option>
                                </select>
                              </div>

                              {/* Trạng thái */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Trạng thái
                                </div>
                                <select
                                  value={currentGuest.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      currentGuest.id,
                                      e.target.value as PotentialCustomerStatus
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Mới">Mới</option>
                                  <option value="Đang theo dõi">Đang theo dõi</option>
                                  <option value="Khách hàng đã đặt lịch">
                                    Khách hàng đã đặt lịch
                                  </option>
                                  <option value="Khách hàng từ chối">
                                    Khách hàng từ chối
                                  </option>
                                </select>
                              </div>

                              {/* Biển số xe */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Biển số xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.licensePlate || '-'}
                                </div>
                              </div>

                              {/* Hiệu xe */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Hiệu xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.carBrand || '-'}
                                </div>
                              </div>

                              {/* Dòng xe */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Dòng xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.carModel || '-'}
                                </div>
                              </div>

                              {/* RO gốc */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  RO gốc
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedRoDetailRow(currentGuest)}
                                  className="font-semibold text-[#1A73E8] hover:underline truncate cursor-pointer"
                                >
                                  {currentGuest.originalRoCode || '-'}
                                </button>
                              </div>

                              {/* Ngày nhận - Ngày giao của RO gốc */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Ngày nhận - Ngày giao RO gốc
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.originalRoDates || '-'}
                                </div>
                              </div>

                              {/* Doanh thu RO gốc */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Doanh thu RO gốc
                                </div>
                                <div className="font-bold text-gray-900 truncate">
                                  {currentGuest.originalRoRevenue || '-'}
                                </div>
                              </div>

                              {/* Người tạo */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Người tạo
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.createdBy || '-'}
                                </div>
                              </div>

                              {/* Ngày tạo */}
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 col-span-2">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Ngày tạo
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.registrationDate}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Danh mục chi tiết phần tích chọn "Hạng mục vật tư, phụ tùng & dịch vụ" (chỉ hiển thị trong phạm vi cột 1) */}
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1 h-4 rounded-full bg-[#1A73E8]" />
                                <span className="text-xs font-bold text-slate-800">
                                  Hạng mục vật tư, phụ tùng &amp; dịch vụ
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                  {allCheckedLineItems.length}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                Đã chọn: {allCheckedLineItems.length}/{totalPossibleItemsCount} (
                                <span className="font-semibold text-slate-700 underline">
                                  {totalCheckedAmount.toLocaleString('vi-VN')} đ
                                </span>
                                )
                              </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <th className="py-2 px-2.5 w-8 text-center">
                                      <input
                                        type="checkbox"
                                        checked={allCheckedLineItems.length > 0}
                                        readOnly
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                    </th>
                                    <th className="py-2 px-2">Mã VT</th>
                                    <th className="py-2 px-2">Tên hàng / Dịch vụ</th>
                                    <th className="py-2 px-2 text-center">ĐVT</th>
                                    <th className="py-2 px-2 text-center">SL</th>
                                    <th className="py-2 px-2 text-right">Đơn giá</th>
                                    <th className="py-2 px-2.5 text-right">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {allCheckedLineItems.map((item) => (
                                    <tr key={`${item.quoteCode}-${item.id}`} className="hover:bg-blue-50/20">
                                      <td className="py-2 px-2.5 text-center">
                                        <input
                                          type="checkbox"
                                          checked={true}
                                          readOnly
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-[#1A73E8] font-bold text-[11px]">
                                          {item.itemCode}
                                        </span>
                                      </td>
                                      <td className="py-2 px-2 font-medium text-slate-800">
                                        {item.itemName}
                                      </td>
                                      <td className="py-2 px-2 text-center text-slate-500">
                                        {item.unit}
                                      </td>
                                      <td className="py-2 px-2 text-center font-bold text-slate-800">
                                        {item.quantity}
                                      </td>
                                      <td className="py-2 px-2 text-right text-slate-600 whitespace-nowrap underline decoration-slate-400">
                                        {item.unitPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                      <td className="py-2 px-2.5 text-right font-bold text-slate-900 whitespace-nowrap underline decoration-slate-700">
                                        {item.totalPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="flex items-center justify-between pt-2 mt-1.5 text-xs">
                              <span className="text-slate-600">
                                Tổng giá trị phiếu:{' '}
                                <strong className="text-slate-900 font-bold underline">
                                  {totalCheckedAmount.toLocaleString('vi-VN')} đ
                                </strong>
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* THÔNG TIN CHUNG (Matched to current Viewlist columns in Khách hàng quan tâm) */
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">THÔNG TIN CHUNG</h4>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                            <div className={`p-2.5 rounded-lg border ${guestDupInfo.isPhoneDuplicate ? 'bg-red-50/60 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="flex items-center justify-between gap-1.5 mb-1 whitespace-nowrap">
                                <span className="text-xs text-gray-500 shrink-0">Số điện thoại</span>
                                {guestDupInfo.isPhoneDuplicate && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDuplicateCheckFilter('phone');
                                      setDuplicateCheckRecord(currentGuest);
                                    }}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                    title="Nhấn để xem thông tin chi tiết của Khách hàng đang trùng"
                                  >
                                    <ShieldAlert className="w-3 h-3 shrink-0 text-red-600" />
                                    <span className="whitespace-nowrap">
                                      Trùng: {guestDupInfo.matchedCustomers.filter(m => m.phoneMatch).map(m => m.customer.customerName).join(', ')}
                                    </span>
                                  </button>
                                )}
                              </div>
                              <div className="font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap">
                                <Phone className={`w-3.5 h-3.5 shrink-0 ${guestDupInfo.isPhoneDuplicate ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`whitespace-nowrap ${guestDupInfo.isPhoneDuplicate ? 'text-red-700' : ''}`}>{currentGuest.phone}</span>
                              </div>
                            </div>

                            <div className={`p-2.5 rounded-lg border ${guestDupInfo.isEmailDuplicate ? 'bg-red-50/60 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="flex items-center justify-between gap-1.5 mb-1 whitespace-nowrap">
                                <span className="text-xs text-gray-500 shrink-0">Email</span>
                                {guestDupInfo.isEmailDuplicate && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDuplicateCheckFilter('email');
                                      setDuplicateCheckRecord(currentGuest);
                                    }}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                    title="Nhấn để xem danh sách chi tiết các records trùng Email"
                                  >
                                    <ShieldAlert className="w-3 h-3 shrink-0 text-red-600" />
                                    <span className="whitespace-nowrap">
                                      Trùng: {guestDupInfo.matchedCustomers.filter(m => m.emailMatch).length} records
                                    </span>
                                  </button>
                                )}
                              </div>
                              <div className="font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap" title={currentGuest.email}>
                                <Mail className={`w-3.5 h-3.5 shrink-0 ${guestDupInfo.isEmailDuplicate ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`whitespace-nowrap ${guestDupInfo.isEmailDuplicate ? 'text-red-700' : ''}`}>{currentGuest.email}</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-1">Trạng thái cuộc gọi</div>
                              <select 
                                value={currentGuest.callStatus} 
                                onChange={(e) => handleCallStatusChange(currentGuest.id, e.target.value as any)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8]"
                              >
                                <option value="Chưa gọi">Chưa gọi</option>
                                <option value="Đã gọi">Đã gọi</option>
                              </select>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-1">Kết quả cuộc gọi</div>
                              <select 
                                value={currentGuest.callResult} 
                                onChange={(e) => handleCallResultChange(currentGuest.id, e.target.value as any)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8]"
                              >
                                <option value="Rỗng">Rỗng</option>
                                <option value="Đồng ý tham gia">Đồng ý tham gia</option>
                                <option value="Từ chối">Từ chối</option>
                                <option value="Sai số điện thoại">Sai số điện thoại</option>
                                <option value="Không liên hệ được lần 1">Không liên hệ được lần 1</option>
                                <option value="Không liên hệ được lần 2">Không liên hệ được lần 2</option>
                                <option value="Không liên hệ được lần 3">Không liên hệ được lần 3</option>
                              </select>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Nguồn</div>
                              <div className="flex items-center gap-2 font-semibold text-gray-800">
                                {renderSourceIcon(currentGuest.source)}
                                <span>{currentGuest.source}</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Mã người dùng (Kênh)</div>
                              <div className="font-mono font-semibold text-gray-800">{currentGuest.channelUserCode}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Mã chiến dịch</div>
                              <div className="font-semibold text-[#1A73E8]">{currentGuest.code}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Tên chiến dịch</div>
                              <div className="font-semibold text-gray-800 truncate" title={currentGuest.name}>{currentGuest.name}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Ngày hẹn</div>
                              <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{currentGuest.appointmentDate}</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-0.5">Khung giờ hẹn</div>
                              <div className="font-semibold text-gray-800">{currentGuest.appointmentTimeSlot}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500 mb-1">Nhu cầu</div>
                              <div className="flex flex-wrap gap-1">
                                {currentGuest.demands.length === 0 ? (
                                  <span className="text-xs text-gray-400">Chưa chọn nhu cầu</span>
                                ) : (
                                  currentGuest.demands.map((d) => (
                                    <span
                                      key={d}
                                      className="px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-medium"
                                    >
                                      {d}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Tabs (Lịch sử, Ghi chú nội bộ, Lời nhắc & Công việc) */}
              <div className="flex-1 flex flex-col min-w-0 bg-gray-50/40 overflow-hidden">
                <div className="px-6 pt-4 border-b border-gray-200 bg-white shrink-0">
                  <div className="flex gap-6">
                    <button 
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity_history' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('activity_history')}
                    >
                      Lịch sử
                    </button>
                    <button 
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('history')}
                    >
                      Ghi chú nội bộ
                    </button>
                    <button 
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tasks' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('tasks')}
                    >
                      Lời nhắc & Công việc
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        {guestTasks[currentGuest.id]?.filter(t => !t.completed).length || 0}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'activity_history' && (
                    <div>
                      {(!guestActivityHistory[currentGuest.id] || guestActivityHistory[currentGuest.id].length === 0) ? (
                        <div className="text-sm text-gray-500 py-8 text-center">Chưa có dữ liệu lịch sử hoạt động</div>
                      ) : (
                        <div className="space-y-4">
                          {guestActivityHistory[currentGuest.id].map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">{item.action}</span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{item.author}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div>
                      <div className="mb-6">
                        <textarea 
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Thêm ghi chú..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-y mb-3"
                        />
                        <div className="flex justify-end">
                          <button 
                            onClick={handleSaveNote}
                            disabled={!noteContent.trim()}
                            className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                          >
                            Lưu ghi chú
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-800 mb-4">Lịch sử</h3>
                      {(!guestHistory[currentGuest.id] || guestHistory[currentGuest.id].length === 0) ? (
                        <div className="text-sm text-gray-500 py-4 text-center">Chưa có lịch sử trao đổi</div>
                      ) : (
                        <div className="space-y-4">
                          {guestHistory[currentGuest.id].map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">Ghi chú</span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{item.author}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div>
                      <div className="flex gap-2 mb-6">
                        <input 
                          type="text"
                          value={taskContent}
                          onChange={(e) => setTaskContent(e.target.value)}
                          placeholder="Thêm lời nhắc mới..."
                          className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <button 
                          onClick={handleAddTask}
                          disabled={!taskContent.trim()}
                          className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                          Thêm
                        </button>
                      </div>

                      {(!guestTasks[currentGuest.id] || guestTasks[currentGuest.id].length === 0) ? (
                        <div className="text-sm text-gray-500 py-4 text-center">Chưa có lời nhắc & công việc</div>
                      ) : (
                        <div className="space-y-3">
                          {guestTasks[currentGuest.id].map(task => (
                            <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-xs'}`}>
                              <input 
                                type="checkbox" 
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="mt-1 w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                              />
                              <div className="flex-1">
                                {editingTaskId === task.id ? (
                                  <div className="flex flex-col gap-2">
                                    <input 
                                      type="text"
                                      value={editTaskContent}
                                      onChange={(e) => setEditTaskContent(e.target.value)}
                                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEditTask();
                                        if (e.key === 'Escape') handleCancelEditTask();
                                      }}
                                    />
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={handleSaveEditTask}
                                        disabled={!editTaskContent.trim()}
                                        className="text-xs px-3 py-1 bg-[#1A73E8] text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                      >
                                        Lưu
                                      </button>
                                      <button 
                                        onClick={handleCancelEditTask}
                                        className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                        {task.content}
                                      </p>
                                      {!task.completed && (
                                        <button 
                                          onClick={() => handleStartEditTask(task)}
                                          className="text-gray-400 hover:text-[#1A73E8] transition-colors"
                                          title="Chỉnh sửa lời nhắc"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{task.author}</span>
                                      <span className="text-xs text-gray-400">{task.timestamp}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Full-Screen Call Script Popup Modal (Xem kịch bản gọi) */}
      {callScriptModalGuest && (() => {
        const scriptInfo = getCampaignTelesalesDetails(callScriptModalGuest);
        return (
          <div className="fixed inset-0 bg-white z-[70] flex flex-col w-screen h-screen overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center shadow-xs shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-gray-900">
                      Chi tiết kịch bản gọi — Mã chiến dịch:
                    </h2>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-[#1A73E8] border border-blue-200 rounded-md text-xs font-bold font-mono">
                      {scriptInfo.code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Chương trình: <span className="font-semibold text-gray-800">{scriptInfo.name}</span> (Module Quản lý chiết khấu)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCallScriptModalGuest(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-gray-50/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 1: Mục tiêu chương trình */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-[#1A73E8] rounded text-xs font-bold">
                      1
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Mục tiêu chương trình
                    </h4>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {scriptInfo.goal}
                  </div>
                </div>

                {/* Field 2: Từ khóa & Thông điệp trọng tâm */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                      2
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Từ khóa &amp; Thông điệp trọng tâm
                    </h4>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {scriptInfo.keywords}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 3: Kịch bản gọi chi tiết (Khách hàng mới) */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-bold">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Kịch bản gọi chi tiết (Khách hàng mới)
                    </h4>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {scriptInfo.newCustomerScript}
                  </div>
                </div>

                {/* Field 4: Kịch bản gọi chi tiết (Khách hàng cũ) */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-bold">
                      4
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Kịch bản gọi chi tiết (Khách hàng cũ)
                    </h4>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {scriptInfo.existingCustomerScript}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setCallScriptModalGuest(null)}
                className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        );
      })()}

      {/* Duplicate Check Popup Modal */}
      {duplicateCheckRecord && (() => {
        const dupInfo = getDuplicateInfo(duplicateCheckRecord);
        const filteredMatchedCustomers = duplicateCheckFilter === 'email'
          ? dupInfo.matchedCustomers.filter(m => m.emailMatch)
          : duplicateCheckFilter === 'phone'
          ? dupInfo.matchedCustomers.filter(m => m.phoneMatch)
          : dupInfo.matchedCustomers;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${dupInfo.hasDuplicate ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-3">
                  {dupInfo.hasDuplicate ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {duplicateCheckFilter === 'email'
                        ? `Danh sách chi tiết trùng Email (${filteredMatchedCustomers.length} records)`
                        : duplicateCheckFilter === 'phone'
                        ? `Thông tin chi tiết Khách hàng trùng Số điện thoại`
                        : 'Kiểm tra trùng dữ liệu với Module Khách hàng'}
                    </h2>
                    <p className={`text-xs font-medium ${dupInfo.hasDuplicate ? 'text-red-600' : 'text-emerald-700'}`}>
                      {duplicateCheckFilter === 'email'
                        ? `Email "${duplicateCheckRecord.email}" đang trùng với ${filteredMatchedCustomers.length} records trong Module Khách hàng`
                        : dupInfo.hasDuplicate
                        ? 'Phát hiện thông tin bị trùng lặp với dữ liệu trong Module Khách hàng'
                        : 'Không phát hiện trùng lặp thông tin trong Module Khách hàng'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDuplicateCheckRecord(null)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Summary of Potential Customer & Check Criteria */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Thông tin kiểm tra của Khách hàng tiềm năng ({duplicateCheckRecord.fullName})
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Phone Check Card */}
                    <div
                      onClick={() => dupInfo.isPhoneDuplicate && setDuplicateCheckFilter('phone')}
                      className={`p-3.5 rounded-lg border transition-all ${
                        dupInfo.isPhoneDuplicate
                          ? `bg-red-50/70 border-red-200 cursor-pointer ${duplicateCheckFilter === 'phone' ? 'ring-2 ring-red-400' : ''}`
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-500">Số điện thoại</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${dupInfo.isPhoneDuplicate ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {dupInfo.isPhoneDuplicate ? `Trùng (${dupInfo.matchedCustomers.filter(m => m.phoneMatch).length})` : 'Không trùng'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{duplicateCheckRecord.phone}</div>
                    </div>

                    {/* Email Check Card */}
                    <div
                      onClick={() => dupInfo.isEmailDuplicate && setDuplicateCheckFilter('email')}
                      className={`p-3.5 rounded-lg border transition-all ${
                        dupInfo.isEmailDuplicate
                          ? `bg-red-50/70 border-red-200 cursor-pointer ${duplicateCheckFilter === 'email' ? 'ring-2 ring-red-400' : ''}`
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-500">Email</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${dupInfo.isEmailDuplicate ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {dupInfo.isEmailDuplicate ? `Trùng: ${dupInfo.matchedCustomers.filter(m => m.emailMatch).length} records` : 'Không trùng'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-900 truncate" title={duplicateCheckRecord.email}>
                        {duplicateCheckRecord.email}
                      </div>
                    </div>

                    {/* Tax Code Check Card */}
                    <div
                      onClick={() => setDuplicateCheckFilter('all')}
                      className={`p-3.5 rounded-lg border cursor-pointer ${dupInfo.isTaxCodeDuplicate ? 'bg-red-50/70 border-red-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-500">Mã số thuế</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${dupInfo.isTaxCodeDuplicate ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {dupInfo.isTaxCodeDuplicate ? 'Trùng' : 'Không trùng'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{duplicateCheckRecord.taxCode || 'Chưa cập nhật'}</div>
                    </div>
                  </div>
                </div>

                {/* Matched Customer Details in Module Khách hàng */}
                {dupInfo.hasDuplicate ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {duplicateCheckFilter === 'email'
                          ? `Danh sách chi tiết các records trùng Email (${filteredMatchedCustomers.length} records)`
                          : duplicateCheckFilter === 'phone'
                          ? `Danh sách chi tiết trùng Số điện thoại (${filteredMatchedCustomers.length} records)`
                          : `Chi tiết thông tin trùng trong Module Khách hàng (${filteredMatchedCustomers.length} records)`}
                      </h3>
                      {duplicateCheckFilter !== 'all' && dupInfo.matchedCustomers.length > filteredMatchedCustomers.length && (
                        <button
                          type="button"
                          onClick={() => setDuplicateCheckFilter('all')}
                          className="text-xs font-semibold text-[#1A73E8] hover:underline"
                        >
                          Xem tất cả ({dupInfo.matchedCustomers.length} records)
                        </button>
                      )}
                    </div>
                    {filteredMatchedCustomers.map(({ customer, phoneMatch, emailMatch, taxCodeMatch, matchedFields }, idx) => (
                      <div key={customer.id} className="border border-red-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <div className="bg-red-50/80 px-4 py-2.5 border-b border-red-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-red-700 border border-red-200">
                              {customer.customerCode}
                            </span>
                            <span className="text-sm font-bold text-gray-900">{customer.customerName}</span>
                            <span className="text-xs text-gray-500">- {customer.companyName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {matchedFields.map(field => (
                              <span key={field} className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-semibold rounded-full">
                                Trùng {field}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                          <div className={`p-2.5 rounded-lg border ${phoneMatch ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="text-xs text-gray-500 mb-0.5 flex items-center justify-between">
                              <span>Số điện thoại (Khách hàng)</span>
                              {phoneMatch && <span className="text-[11px] font-bold text-red-600">Trùng khớp</span>}
                            </div>
                            <div className={`font-semibold ${phoneMatch ? 'text-red-700' : 'text-gray-800'}`}>{customer.phone}</div>
                          </div>

                          <div className={`p-2.5 rounded-lg border ${emailMatch ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="text-xs text-gray-500 mb-0.5 flex items-center justify-between">
                              <span>Email (Khách hàng)</span>
                              {emailMatch && <span className="text-[11px] font-bold text-red-600">Trùng khớp</span>}
                            </div>
                            <div className={`font-semibold truncate ${emailMatch ? 'text-red-700' : 'text-gray-800'}`} title={customer.email}>{customer.email}</div>
                          </div>

                          <div className={`p-2.5 rounded-lg border ${taxCodeMatch ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="text-xs text-gray-500 mb-0.5 flex items-center justify-between">
                              <span>Mã số thuế (Khách hàng)</span>
                              {taxCodeMatch && <span className="text-[11px] font-bold text-red-600">Trùng khớp</span>}
                            </div>
                            <div className={`font-semibold ${taxCodeMatch ? 'text-red-700' : 'text-gray-800'}`}>{customer.taxCode}</div>
                          </div>

                          <div className="p-2.5 rounded-lg border bg-gray-50 border-gray-100">
                            <div className="text-xs text-gray-500 mb-0.5">Nhóm khách hàng & Ngày tạo</div>
                            <div className="font-medium text-gray-800">{customer.customerGroup} ({customer.createdAt})</div>
                          </div>

                          <div className="col-span-2 p-2.5 rounded-lg border bg-gray-50 border-gray-100">
                            <div className="text-xs text-gray-500 mb-0.5">Địa chỉ trong Module Khách hàng</div>
                            <div className="font-medium text-gray-800">{customer.address}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <div className="text-base font-bold text-gray-900 mb-1">
                      Hồ sơ hoàn toàn mới
                    </div>
                    <p className="text-sm text-gray-600">
                      Số điện thoại, Email và Mã số thuế của khách hàng tiềm năng này chưa trùng với bất kỳ khách hàng nào trong Module Khách hàng.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setDuplicateCheckRecord(null)}
                  className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Full-Screen "Tạo Lịch hẹn Khách đặt" Modal (2-Column Layout) */}
      {bookingModalRecord && (() => {
        const currentGuest =
          events.find((e) => e.id === bookingModalRecord.id) ||
          bookingModalRecord;
        const guestDupInfo = getDuplicateInfo(currentGuest);
        const filteredCarModels = MASTER_CAR_MODELS.filter((model) =>
          model.toLowerCase().includes(bookingCarModel.toLowerCase())
        );
        const filteredLicensePlates = MASTER_LICENSE_PLATES.filter(
          (item) =>
            item.plate
              .toLowerCase()
              .includes(bookingLicensePlate.toLowerCase()) ||
            item.carModel
              .toLowerCase()
              .includes(bookingLicensePlate.toLowerCase())
        );

        const handleToggleSuggestedTag = (tag: string) => {
          setBookingSuggestedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
          );
        };

        const customerVehicles = CUSTOMER_VEHICLES_MAP[currentGuest.id] || [
          { plate: '51K-889.21', carModel: 'Mazda - CX-5' },
          { plate: '30H-665.43', carModel: 'Ford - Ranger' },
        ];

        const handleToggleLicensePlate = (plate: string) => {
          setBookingLicensePlates((prev) =>
            prev.includes(plate)
              ? prev.filter((p) => p !== plate)
              : [...prev, plate]
          );
        };

        const handleToggleCarModel = (model: string) => {
          setBookingCarModels((prev) =>
            prev.includes(model)
              ? prev.filter((m) => m !== model)
              : [...prev, model]
          );
        };

        return (
          <div className="fixed inset-0 bg-white z-[55] flex flex-col w-screen h-screen overflow-hidden">
            {/* Top Bar */}
            <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Tạo Lịch hẹn Khách đặt
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalRecord(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main 3-Column Body */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Column 1: Thông tin chung (Expanded width into Column 2, compact layout to minimize vertical scrolling) */}
              <div className="w-[40%] shrink-0 border-r border-gray-200 p-3 flex flex-col justify-between overflow-hidden bg-white">
                {(() => {
                  const telesalesDetails = getCampaignTelesalesDetails(currentGuest);

                  // Resolve quotation & checked items for Lịch nhắc chủ động
                  const guestQuotationEntries = (() => {
                    if (!hideRegistrationSummary) return [];
                    const synthId = `q-row-${currentGuest.id}`;
                    const parsedRev =
                      parseInt(
                        (currentGuest.originalRoRevenue || '750000').replace(/[^\d]/g, ''),
                        10
                      ) || 750000;
                    const item1Price = Math.round(parsedRev * 0.6);
                    const item2Price = parsedRev - item1Price;
                    const synthesizedQuote: QuotationRecord = {
                      id: synthId,
                      quoteCode: currentGuest.code.startsWith('BG')
                        ? currentGuest.code
                        : `BG-${currentGuest.originalRoCode || currentGuest.code}`,
                      quoteDate: '2026-11-09',
                      quoteDateTimeDisplay: `${currentGuest.registrationDate || '09/11/2026'} 14:30`,
                      licensePlate: currentGuest.licensePlate || '51H11111',
                      customerName: currentGuest.fullName,
                      phone: currentGuest.phone,
                      email: currentGuest.email,
                      carBrand: currentGuest.carBrand || 'Toyota',
                      carModel: currentGuest.carModel || 'Camry',
                      originalRoCode: currentGuest.originalRoCode || '2611-000003',
                      originalRoDates:
                        currentGuest.originalRoDates || '09/11/2026 - 09/11/2026',
                      originalRoRevenue: currentGuest.originalRoRevenue || '750.000 đ',
                      approvalStatus: 'Chờ khách duyệt',
                      items: [
                        {
                          id: `${synthId}-item-1`,
                          itemCode: 'BDĐK001',
                          itemName: 'Bảo dưỡng định kỳ & thay dầu động cơ tổng hợp',
                          unit: 'Gói',
                          quantity: 1,
                          unitPrice: item1Price,
                          totalPrice: item1Price,
                        },
                        {
                          id: `${synthId}-item-2`,
                          itemCode: 'PHANH002',
                          itemName: 'Kiểm tra & vệ sinh bố thắng, cân chỉnh thước lái',
                          unit: 'Lần',
                          quantity: 1,
                          unitPrice: item2Price,
                          totalPrice: item2Price,
                        },
                      ],
                    };

                    const allCandidateQuotes = [
                      ...MOCK_QUOTATIONS_FOR_REMINDERS,
                      synthesizedQuote,
                    ];

                    if (
                      currentGuest.selectedQuoteItemsMap &&
                      Object.keys(currentGuest.selectedQuoteItemsMap).some(
                        (k) => (currentGuest.selectedQuoteItemsMap?.[k] || []).length > 0
                      )
                    ) {
                      return allCandidateQuotes
                        .filter(
                          (q) =>
                            (currentGuest.selectedQuoteItemsMap?.[q.id] || []).length > 0
                        )
                        .map((q) => {
                          const checkedIds =
                            currentGuest.selectedQuoteItemsMap?.[q.id] || [];
                          return {
                            quote: q,
                            checkedItems: q.items.filter((i) =>
                              checkedIds.includes(i.id)
                            ),
                          };
                        });
                    }

                    const matchedQuote = MOCK_QUOTATIONS_FOR_REMINDERS.find(
                      (q) =>
                        q.quoteCode === currentGuest.code ||
                        (currentGuest.originalRoCode &&
                          q.originalRoCode === currentGuest.originalRoCode) ||
                        (currentGuest.licensePlate &&
                          q.licensePlate === currentGuest.licensePlate)
                    );

                    if (matchedQuote) {
                      return [
                        {
                          quote: matchedQuote,
                          checkedItems: matchedQuote.items,
                        },
                      ];
                    }

                    return [
                      {
                        quote: synthesizedQuote,
                        checkedItems: synthesizedQuote.items,
                      },
                    ];
                  })();

                  const allCheckedLineItems = guestQuotationEntries.flatMap((entry) =>
                    entry.checkedItems.map((item) => ({
                      ...item,
                      quoteCode: entry.quote.quoteCode,
                    }))
                  );
                  const totalPossibleItemsCount = guestQuotationEntries.reduce(
                    (sum, entry) => sum + entry.quote.items.length,
                    0
                  );
                  const totalCheckedAmount = allCheckedLineItems.reduce(
                    (sum, item) => sum + item.totalPrice,
                    0
                  );

                  return (
                    <div className="space-y-3 overflow-y-auto pr-0.5">
                      {/* Top Identity & Action Buttons (Gửi Zalo, Gửi email) on a compact row */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100 flex-wrap">
                        <div className="flex items-baseline gap-2.5 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {currentGuest.fullName}
                          </h3>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">
                            Ngày tạo:{' '}
                            <span className="font-medium text-gray-700">
                              {currentGuest.registrationDate}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedZaloRecord(currentGuest);
                              setZaloContent(getZaloDefaultContent(currentGuest));
                              setZaloAttachments([]);
                              setZaloModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0068FF] rounded-md text-xs font-semibold transition-colors border border-blue-200 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Gửi Zalo
                          </button>
                          <button
                            type="button"
                            onClick={() => openEmailModalForRecord(currentGuest)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold transition-colors border border-gray-200 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Gửi email
                          </button>
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                              hideRegistrationSummary
                                ? currentGuest.status === 'Khách hàng đã đặt lịch'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : currentGuest.status === 'Mới'
                                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                                  : currentGuest.status === 'Đang theo dõi'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-red-100 text-red-700 border-red-200'
                                : currentGuest.status === 'Xe đã đến'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : currentGuest.status === 'Đã xác nhận'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : currentGuest.status === 'Chờ xác nhận'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : currentGuest.status === 'Bỏ hẹn'
                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                : currentGuest.status === 'Chờ xóa'
                                ? 'bg-gray-200 text-gray-700 border-gray-300'
                                : 'bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            {currentGuest.status}
                          </span>
                        </div>
                      </div>

                      {hideRegistrationSummary ? (
                        <>
                          {/* THÔNG TIN CHUNG - Phù hợp với dữ liệu trong viewlist Lịch nhắc chủ động */}
                          <div>
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                              THÔNG TIN CHUNG
                            </h4>
                            <div className="grid grid-cols-3 gap-1.5 text-xs">
                              {/* Khách hàng */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Khách hàng
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.fullName}
                                </div>
                              </div>

                              {/* Số điện thoại */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Số điện thoại
                                </div>
                                <div className="font-semibold text-gray-800 flex items-center gap-1.5 whitespace-nowrap">
                                  <Phone className="w-3 h-3 shrink-0 text-gray-400" />
                                  <span>{currentGuest.phone}</span>
                                </div>
                              </div>

                              {/* Email */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Email
                                </div>
                                <div
                                  className="font-semibold text-gray-800 flex items-center gap-1.5 truncate"
                                  title={currentGuest.email}
                                >
                                  <Mail className="w-3 h-3 shrink-0 text-gray-400" />
                                  <span className="truncate">{currentGuest.email}</span>
                                </div>
                              </div>

                              {/* Trạng thái cuộc gọi */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Trạng thái cuộc gọi
                                </div>
                                <select
                                  value={currentGuest.callStatus}
                                  onChange={(e) =>
                                    handleCallStatusChange(
                                      currentGuest.id,
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Chưa gọi">Chưa gọi</option>
                                  <option value="Đã gọi">Đã gọi</option>
                                </select>
                              </div>

                              {/* Kết quả cuộc gọi */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Kết quả cuộc gọi
                                </div>
                                <select
                                  value={currentGuest.callResult}
                                  onChange={(e) =>
                                    handleCallResultChange(
                                      currentGuest.id,
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Rỗng">Rỗng</option>
                                  <option value="Đồng ý tham gia">Đồng ý tham gia</option>
                                  <option value="Từ chối">Từ chối</option>
                                  <option value="Sai số điện thoại">Sai số điện thoại</option>
                                  <option value="Không liên hệ được lần 1">
                                    Không liên hệ được lần 1
                                  </option>
                                  <option value="Không liên hệ được lần 2">
                                    Không liên hệ được lần 2
                                  </option>
                                  <option value="Không liên hệ được lần 3">
                                    Không liên hệ được lần 3
                                  </option>
                                </select>
                              </div>

                              {/* Trạng thái */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Trạng thái
                                </div>
                                <select
                                  value={currentGuest.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      currentGuest.id,
                                      e.target.value as PotentialCustomerStatus
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                                >
                                  <option value="Mới">Mới</option>
                                  <option value="Đang theo dõi">Đang theo dõi</option>
                                  <option value="Khách hàng đã đặt lịch">
                                    Khách hàng đã đặt lịch
                                  </option>
                                  <option value="Khách hàng từ chối">
                                    Khách hàng từ chối
                                  </option>
                                </select>
                              </div>

                              {/* Biển số xe */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Biển số xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.licensePlate || '-'}
                                </div>
                              </div>

                              {/* Hiệu xe */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Hiệu xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.carBrand || '-'}
                                </div>
                              </div>

                              {/* Dòng xe */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Dòng xe
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.carModel || '-'}
                                </div>
                              </div>

                              {/* RO gốc */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  RO gốc
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedRoDetailRow(currentGuest)}
                                  className="font-semibold text-[#1A73E8] hover:underline truncate cursor-pointer"
                                >
                                  {currentGuest.originalRoCode || '-'}
                                </button>
                              </div>

                              {/* Ngày nhận - Ngày giao của RO gốc */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Ngày nhận - Ngày giao RO gốc
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.originalRoDates || '-'}
                                </div>
                              </div>

                              {/* Doanh thu RO gốc */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Doanh thu RO gốc
                                </div>
                                <div className="font-bold text-gray-900 truncate">
                                  {currentGuest.originalRoRevenue || '-'}
                                </div>
                              </div>

                              {/* Người tạo */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Người tạo
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.createdBy || '-'}
                                </div>
                              </div>

                              {/* Ngày tạo */}
                              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 col-span-2">
                                <div className="text-[11px] text-gray-500 mb-0.5">
                                  Ngày tạo
                                </div>
                                <div className="font-semibold text-gray-800 truncate">
                                  {currentGuest.registrationDate}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Danh mục chi tiết phần tích chọn "Hạng mục vật tư, phụ tùng & dịch vụ" (chỉ hiển thị trong phạm vi cột 1) */}
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1 h-4 rounded-full bg-[#1A73E8]" />
                                <span className="text-xs font-bold text-slate-800">
                                  Hạng mục vật tư, phụ tùng &amp; dịch vụ
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                  {allCheckedLineItems.length}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Đã chọn: {allCheckedLineItems.length}/{totalPossibleItemsCount} (
                                <span className="font-semibold text-slate-700 underline">
                                  {totalCheckedAmount.toLocaleString('vi-VN')} đ
                                </span>
                                )
                              </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <th className="py-2 px-2.5 w-8 text-center">
                                      <input
                                        type="checkbox"
                                        checked={allCheckedLineItems.length > 0}
                                        readOnly
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                    </th>
                                    <th className="py-2 px-2">Mã VT</th>
                                    <th className="py-2 px-2">Tên hàng / Dịch vụ</th>
                                    <th className="py-2 px-2 text-center">ĐVT</th>
                                    <th className="py-2 px-2 text-center">SL</th>
                                    <th className="py-2 px-2 text-right">Đơn giá</th>
                                    <th className="py-2 px-2.5 text-right">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {allCheckedLineItems.map((item) => (
                                    <tr key={`${item.quoteCode}-${item.id}`} className="hover:bg-blue-50/20">
                                      <td className="py-2 px-2.5 text-center">
                                        <input
                                          type="checkbox"
                                          checked={true}
                                          readOnly
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-[#1A73E8] font-bold text-[11px]">
                                          {item.itemCode}
                                        </span>
                                      </td>
                                      <td className="py-2 px-2 font-medium text-slate-800">
                                        {item.itemName}
                                      </td>
                                      <td className="py-2 px-2 text-center text-slate-500">
                                        {item.unit}
                                      </td>
                                      <td className="py-2 px-2 text-center font-bold text-slate-800">
                                        {item.quantity}
                                      </td>
                                      <td className="py-2 px-2 text-right text-slate-600 whitespace-nowrap underline decoration-slate-400">
                                        {item.unitPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                      <td className="py-2 px-2.5 text-right font-bold text-slate-900 whitespace-nowrap underline decoration-slate-700">
                                        {item.totalPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="flex items-center justify-between pt-2 mt-1.5 text-xs">
                              <span className="text-slate-600">
                                Tổng giá trị phiếu:{' '}
                                <strong className="text-slate-900 font-bold underline">
                                  {totalCheckedAmount.toLocaleString('vi-VN')} đ
                                </strong>
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* THÔNG TIN CHUNG (Module Khách hàng quan tâm) */
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            THÔNG TIN CHUNG
                          </h4>
                          <div className="grid grid-cols-3 gap-1.5 text-xs">
                            <div
                              className={`p-1.5 rounded-lg border ${
                                guestDupInfo.isPhoneDuplicate
                                  ? 'bg-red-50/60 border-red-200'
                                  : 'bg-gray-50 border-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-0.5 whitespace-nowrap">
                                <span className="text-[11px] text-gray-500 shrink-0">
                                  Số điện thoại
                                </span>
                                {guestDupInfo.isPhoneDuplicate && (
                                  <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-red-100 text-red-700 text-[10px] font-semibold truncate">
                                    <ShieldAlert className="w-2.5 h-2.5 shrink-0 text-red-600" />
                                    <span className="truncate">Trùng</span>
                                  </span>
                                )}
                              </div>
                              <div className="font-semibold text-gray-800 flex items-center gap-1.5 whitespace-nowrap">
                                <Phone
                                  className={`w-3 h-3 shrink-0 ${
                                    guestDupInfo.isPhoneDuplicate
                                      ? 'text-red-500'
                                      : 'text-gray-400'
                                  }`}
                                />
                                <span
                                  className={`whitespace-nowrap ${
                                    guestDupInfo.isPhoneDuplicate
                                      ? 'text-red-700'
                                      : ''
                                  }`}
                                >
                                  {currentGuest.phone}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-1.5 rounded-lg border ${
                                guestDupInfo.isEmailDuplicate
                                  ? 'bg-red-50/60 border-red-200'
                                  : 'bg-gray-50 border-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-0.5 whitespace-nowrap">
                                <span className="text-[11px] text-gray-500 shrink-0">
                                  Email
                                </span>
                                {guestDupInfo.isEmailDuplicate && (
                                  <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-red-100 text-red-700 text-[10px] font-semibold whitespace-nowrap shrink-0">
                                    <ShieldAlert className="w-2.5 h-2.5 shrink-0 text-red-600" />
                                    <span>
                                      Trùng:{' '}
                                      {
                                        guestDupInfo.matchedCustomers.filter(
                                          (m) => m.emailMatch
                                        ).length
                                      }
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div
                                className="font-semibold text-gray-800 flex items-center gap-1.5 whitespace-nowrap"
                                title={currentGuest.email}
                              >
                                <Mail
                                  className={`w-3 h-3 shrink-0 ${
                                    guestDupInfo.isEmailDuplicate
                                      ? 'text-red-500'
                                      : 'text-gray-400'
                                  }`}
                                />
                                <span
                                  className={`whitespace-nowrap truncate ${
                                    guestDupInfo.isEmailDuplicate
                                      ? 'text-red-700'
                                      : ''
                                  }`}
                                >
                                  {currentGuest.email}
                                </span>
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Nguồn
                              </div>
                              <div className="flex items-center gap-1.5 font-semibold text-gray-800 truncate">
                                {renderSourceIcon(currentGuest.source)}
                                <span className="truncate">{currentGuest.source}</span>
                              </div>
                            </div>

                            {/* Trạng thái cuộc gọi (cho phép chỉnh) */}
                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Trạng thái cuộc gọi
                              </div>
                              <select
                                value={currentGuest.callStatus}
                                onChange={(e) =>
                                  handleCallStatusChange(
                                    currentGuest.id,
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                              >
                                <option value="Chưa gọi">Chưa gọi</option>
                                <option value="Đã gọi">Đã gọi</option>
                              </select>
                            </div>

                            {/* Kết quả cuộc gọi (cho phép chỉnh) */}
                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Kết quả cuộc gọi
                              </div>
                              <select
                                value={currentGuest.callResult}
                                onChange={(e) =>
                                  handleCallResultChange(
                                    currentGuest.id,
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
                              >
                                <option value="Rỗng">Rỗng</option>
                                <option value="Đồng ý tham gia">Đồng ý tham gia</option>
                                <option value="Từ chối">Từ chối</option>
                                <option value="Sai số điện thoại">Sai số điện thoại</option>
                                <option value="Không liên hệ được lần 1">
                                  Không liên hệ được lần 1
                                </option>
                                <option value="Không liên hệ được lần 2">
                                  Không liên hệ được lần 2
                                </option>
                                <option value="Không liên hệ được lần 3">
                                  Không liên hệ được lần 3
                                </option>
                              </select>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Mã người dùng (Kênh)
                              </div>
                              <div className="font-mono font-semibold text-gray-800 truncate">
                                {currentGuest.channelUserCode}
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Mã chiến dịch
                              </div>
                              <div className="font-semibold text-[#1A73E8] truncate">
                                {currentGuest.code}
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 col-span-2">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Tên chiến dịch
                              </div>
                              <div
                                className="font-semibold text-gray-800 truncate"
                                title={currentGuest.name}
                              >
                                {currentGuest.name}
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Ngày hẹn
                              </div>
                              <div className="font-semibold text-gray-800 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>{currentGuest.appointmentDate}</span>
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Khung giờ hẹn
                              </div>
                              <div className="font-semibold text-gray-800">
                                {currentGuest.appointmentTimeSlot}
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-[11px] text-gray-500 mb-0.5">
                                Nhu cầu
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {currentGuest.demands.length === 0 ? (
                                  <span className="text-[11px] text-gray-400">
                                    Chưa chọn nhu cầu
                                  </span>
                                ) : (
                                  currentGuest.demands.map((d) => (
                                    <span
                                      key={d}
                                      className="px-1.5 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-[11px] font-medium"
                                    >
                                      {d}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            {/* 4 Field kịch bản chiến dịch ở dưới field Nhu cầu */}
                            <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 col-span-3">
                              <div className="text-[11px] font-bold text-gray-700 mb-0.5">
                                Mục tiêu chương trình
                              </div>
                              <div className="text-[11px] text-gray-700 whitespace-pre-line leading-snug">
                                {telesalesDetails.goal}
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 col-span-3">
                              <div className="text-[11px] font-bold text-gray-700 mb-0.5">
                                Từ khóa &amp; Thông điệp trọng tâm
                              </div>
                              <div className="text-[11px] text-gray-700 whitespace-pre-line leading-snug">
                                {telesalesDetails.keywords}
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-blue-50/40 border border-blue-200 col-span-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-[#1A73E8]">
                                  Kịch bản gọi chi tiết (Khách hàng mới)
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowBookingNewScript((prev) => !prev)
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-[#1A73E8] border border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                                >
                                  {showBookingNewScript ? (
                                    <>
                                      <EyeOff className="w-3 h-3" />
                                      Ẩn
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" />
                                      Hiện
                                    </>
                                  )}
                                </button>
                              </div>
                              {showBookingNewScript && (
                                <div className="mt-1.5 pt-1.5 border-t border-blue-100 text-[11px] text-gray-800 whitespace-pre-line leading-snug">
                                  {telesalesDetails.newCustomerScript}
                                </div>
                              )}
                            </div>

                            <div className="p-2 rounded-lg bg-emerald-50/40 border border-emerald-200 col-span-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-emerald-700">
                                  Kịch bản gọi chi tiết (Khách hàng cũ)
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowBookingExistingScript((prev) => !prev)
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                                >
                                  {showBookingExistingScript ? (
                                    <>
                                      <EyeOff className="w-3 h-3" />
                                      Ẩn
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" />
                                      Hiện
                                    </>
                                  )}
                                </button>
                              </div>
                              {showBookingExistingScript && (
                                <div className="mt-1.5 pt-1.5 border-t border-emerald-100 text-[11px] text-gray-800 whitespace-pre-line leading-snug">
                                  {telesalesDetails.existingCustomerScript}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Column 2: Thông tin tạo Lịch hẹn Khách đặt (No vertical scroll) */}
              <div className="w-[37%] shrink-0 border-r border-gray-200 flex flex-col min-w-0 bg-gray-50/40 overflow-hidden p-3.5">
                <form
                  onSubmit={handleConfirmCreateCustomerBooking}
                  className="bg-white border border-gray-200 rounded-xl shadow-xs p-4 space-y-2.5 w-full flex-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-2.5 overflow-hidden">
                    <div className="border-b border-gray-100 pb-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        Thông tin tạo Lịch hẹn Khách đặt
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Kiểm tra và bổ sung thông tin lịch hẹn cho khách hàng{' '}
                        <span className="font-semibold text-gray-700">
                          {currentGuest.fullName}
                        </span>
                      </p>
                    </div>

                    {bookingFormError && (
                      <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                        {bookingFormError}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Điện thoại (ở trước field Ngày hẹn, nằm trên 1 dòng) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Nhập số ĐT..."
                            value={bookingPhone}
                            onChange={(e) => {
                              setBookingPhone(e.target.value);
                              setBookingFormError('');
                            }}
                            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                          />
                        </div>
                      </div>

                      {/* Ngày hẹn */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Ngày hẹn <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="DD/MM/YYYY"
                            value={bookingDate}
                            onChange={(e) => {
                              setBookingDate(e.target.value);
                              setBookingFormError('');
                            }}
                            className="w-full px-2.5 pr-7 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Khung giờ hẹn */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Khung giờ hẹn <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="VD: 08:00 - 10:00"
                          value={bookingTimeSlot}
                          onChange={(e) => {
                            setBookingTimeSlot(e.target.value);
                            setBookingFormError('');
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                        />
                      </div>
                    </div>

                    {/* Yêu cầu dịch vụ: dạng text */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Yêu cầu dịch vụ
                      </label>
                      <textarea
                        rows={1}
                        placeholder="Nhập yêu cầu dịch vụ của khách hàng..."
                        value={bookingServiceRequest}
                        onChange={(e) => setBookingServiceRequest(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 resize-none"
                      />
                    </div>

                    {/* Dịch vụ góp ý: dạng tags hiển thị sẵn 1 số cái */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Dịch vụ góp ý
                      </label>
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex flex-wrap gap-1.5">
                          {DEFAULT_SUGGESTED_SERVICE_TAGS.map((tag) => {
                            const isSelected = bookingSuggestedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleToggleSuggestedTag(tag)}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50 text-[#1A73E8] border-blue-300 shadow-2xs'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
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

                    <div className="grid grid-cols-2 gap-3 items-start">
                      {/* Left: Biển số xe (không bắt buộc - cho phép chọn nhiều) + Danh sách Xe sử dụng below it */}
                      <div className="space-y-2.5">
                        <div className="relative">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Biển số xe{' '}
                            <span className="font-normal text-gray-400">
                              (không bắt buộc - chọn nhiều)
                            </span>
                          </label>
                          <div className="min-h-[36px] px-2.5 py-1 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1 pr-7 relative">
                            {bookingLicensePlates.map((plate) => (
                              <span
                                key={plate}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-semibold"
                              >
                                <span>{plate}</span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleLicensePlate(plate)}
                                  className="text-[#1A73E8] hover:text-blue-800 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder={
                                bookingLicensePlates.length === 0
                                  ? 'Chọn hoặc nhập biển số xe...'
                                  : 'Thêm biển số...'
                              }
                              value={bookingLicensePlate}
                              onChange={(e) => {
                                setBookingLicensePlate(e.target.value);
                                setIsLicensePlateDropdownOpen(true);
                              }}
                              onFocus={() => setIsLicensePlateDropdownOpen(true)}
                              onBlur={() =>
                                setTimeout(
                                  () => setIsLicensePlateDropdownOpen(false),
                                  200
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter' &&
                                  bookingLicensePlate.trim()
                                ) {
                                  e.preventDefault();
                                  const val = bookingLicensePlate.trim();
                                  if (!bookingLicensePlates.includes(val)) {
                                    setBookingLicensePlates((prev) => [
                                      ...prev,
                                      val,
                                    ]);
                                  }
                                  setBookingLicensePlate('');
                                }
                              }}
                              className="flex-1 min-w-[100px] text-sm text-gray-800 outline-none bg-transparent"
                            />
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          </div>
                          {isLicensePlateDropdownOpen && (
                            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto py-1">
                              {filteredLicensePlates.map((item) => {
                                const isSelected = bookingLicensePlates.includes(
                                  item.plate
                                );
                                return (
                                  <div
                                    key={item.plate}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleToggleLicensePlate(item.plate);
                                      setBookingLicensePlate('');
                                    }}
                                    className={`px-3 py-1.5 text-sm hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
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
                                    <span className="text-xs text-gray-500">
                                      {item.carModel}
                                    </span>
                                  </div>
                                );
                              })}
                              {bookingLicensePlate.trim() &&
                                !MASTER_LICENSE_PLATES.some(
                                  (item) =>
                                    item.plate.toLowerCase() ===
                                    bookingLicensePlate.trim().toLowerCase()
                                ) && (
                                  <div
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      const newPlate = bookingLicensePlate.trim();
                                      if (
                                        !bookingLicensePlates.includes(newPlate)
                                      ) {
                                        setBookingLicensePlates((prev) => [
                                          ...prev,
                                          newPlate,
                                        ]);
                                      }
                                      setBookingLicensePlate('');
                                      setIsLicensePlateDropdownOpen(false);
                                    }}
                                    className="px-3 py-1.5 text-xs text-[#1A73E8] bg-blue-50/50 hover:bg-blue-50 cursor-pointer font-medium border-t border-gray-100"
                                  >
                                    + Thêm biển số mới: &quot;
                                    {bookingLicensePlate.trim()}&quot;
                                  </div>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Danh sách Xe sử dụng (hiển thị bên dưới field Biển số xe) */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Danh sách Xe sử dụng
                          </label>
                          <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex flex-wrap gap-1.5">
                              {customerVehicles.map((vehicle) => {
                                const isTicked = bookingLicensePlates.includes(
                                  vehicle.plate
                                );
                                return (
                                  <button
                                    key={`${vehicle.plate}-${vehicle.carModel}`}
                                    type="button"
                                    onClick={() =>
                                      handleToggleLicensePlate(vehicle.plate)
                                    }
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                      isTicked
                                        ? 'bg-blue-50 text-[#1A73E8] border-blue-300 shadow-2xs'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isTicked}
                                      readOnly
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#1A73E8] pointer-events-none"
                                    />
                                    <span>
                                      {vehicle.plate} - {vehicle.carModel}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Dòng xe (không bắt buộc - cho phép chọn nhiều) */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Dòng xe{' '}
                          <span className="font-normal text-gray-400">
                            (không bắt buộc - chọn nhiều)
                          </span>
                        </label>
                        <div className="min-h-[36px] px-2.5 py-1 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1 pr-7 relative">
                          {bookingCarModels.map((model) => (
                            <span
                              key={model}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded text-xs font-semibold"
                            >
                              <span>{model}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleCarModel(model)}
                                className="text-[#1A73E8] hover:text-blue-800 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder={
                              bookingCarModels.length === 0
                                ? 'Gõ tìm Hiệu xe - Dòng xe...'
                                : 'Thêm dòng xe...'
                            }
                            value={bookingCarModel}
                            onChange={(e) => {
                              setBookingCarModel(e.target.value);
                              setIsCarModelDropdownOpen(true);
                            }}
                            onFocus={() => setIsCarModelDropdownOpen(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setIsCarModelDropdownOpen(false),
                                200
                              )
                            }
                            className="flex-1 min-w-[100px] text-sm text-gray-800 outline-none bg-transparent"
                          />
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                        {isCarModelDropdownOpen && (
                          <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto py-1">
                            {filteredCarModels.length === 0 ? (
                              <div className="px-3 py-1.5 text-xs text-gray-500">
                                Không tìm thấy dòng xe trong Master data
                              </div>
                            ) : (
                              filteredCarModels.map((model) => {
                                const isSelected =
                                  bookingCarModels.includes(model);
                                return (
                                  <div
                                    key={model}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleToggleCarModel(model);
                                      setBookingCarModel('');
                                    }}
                                    className={`px-3 py-1.5 text-sm hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
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
                                      <span className="font-medium">{model}</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                      Master data
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBookingModalRecord(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Xác nhận Tạo
                    </button>
                  </div>
                </form>
              </div>

              {/* Column 3: Tabs (Lịch sử, Ghi chú nội bộ, Lời nhắc & Công việc) */}
              <div className="flex-1 flex flex-col min-w-0 bg-gray-50/40 overflow-hidden">
                <div className="px-4 pt-3.5 border-b border-gray-200 bg-white shrink-0">
                  <div className="flex gap-4 whitespace-nowrap">
                    <button
                      type="button"
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'activity_history'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('activity_history')}
                    >
                      Lịch sử
                    </button>
                    <button
                      type="button"
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'history'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('history')}
                    >
                      Ghi chú nội bộ
                    </button>
                    <button
                      type="button"
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'tasks'
                          ? 'border-[#1A73E8] text-[#1A73E8]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('tasks')}
                    >
                      Lời nhắc & Công việc
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {guestTasks[currentGuest.id]?.filter((t) => !t.completed).length || 0}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'activity_history' && (
                    <div>
                      {!guestActivityHistory[currentGuest.id] ||
                      guestActivityHistory[currentGuest.id].length === 0 ? (
                        <div className="text-sm text-gray-500 py-8 text-center">
                          Chưa có dữ liệu lịch sử hoạt động
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {guestActivityHistory[currentGuest.id].map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">
                                    {item.action}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    {item.author}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {item.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {item.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div>
                      <div className="mb-6">
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Thêm ghi chú..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-y mb-3"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveNote}
                            disabled={!noteContent.trim()}
                            className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                          >
                            Lưu ghi chú
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-800 mb-4">
                        Lịch sử
                      </h3>
                      {!guestHistory[currentGuest.id] ||
                      guestHistory[currentGuest.id].length === 0 ? (
                        <div className="text-sm text-gray-500 py-4 text-center">
                          Chưa có lịch sử trao đổi
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {guestHistory[currentGuest.id].map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">
                                    Ghi chú
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    {item.author}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {item.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {item.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div>
                      <div className="flex gap-2 mb-6">
                        <input
                          type="text"
                          value={taskContent}
                          onChange={(e) => setTaskContent(e.target.value)}
                          placeholder="Thêm lời nhắc mới..."
                          className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <button
                          type="button"
                          onClick={handleAddTask}
                          disabled={!taskContent.trim()}
                          className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                          Thêm
                        </button>
                      </div>

                      {!guestTasks[currentGuest.id] ||
                      guestTasks[currentGuest.id].length === 0 ? (
                        <div className="text-sm text-gray-500 py-4 text-center">
                          Chưa có lời nhắc & công việc
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {guestTasks[currentGuest.id].map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border ${
                                task.completed
                                  ? 'bg-gray-50 border-gray-200'
                                  : 'bg-white border-gray-200 shadow-xs'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="mt-1 w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                              />
                              <div className="flex-1">
                                {editingTaskId === task.id ? (
                                  <div className="flex flex-col gap-2">
                                    <input
                                      type="text"
                                      value={editTaskContent}
                                      onChange={(e) =>
                                        setEditTaskContent(e.target.value)
                                      }
                                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                          handleSaveEditTask();
                                        if (e.key === 'Escape')
                                          handleCancelEditTask();
                                      }}
                                    />
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={handleSaveEditTask}
                                        disabled={!editTaskContent.trim()}
                                        className="text-xs px-3 py-1 bg-[#1A73E8] text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                      >
                                        Lưu
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelEditTask}
                                        className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between gap-2">
                                      <p
                                        className={`text-sm ${
                                          task.completed
                                            ? 'text-gray-400 line-through'
                                            : 'text-gray-800'
                                        }`}
                                      >
                                        {task.content}
                                      </p>
                                      {!task.completed && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleStartEditTask(task)
                                          }
                                          className="text-gray-400 hover:text-[#1A73E8] transition-colors"
                                          title="Chỉnh sửa lời nhắc"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                        {task.author}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {task.timestamp}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Confirmation Pop-up: Xác nhận Tạo lịch hẹn */}
            {isBookingConfirmPopupOpen && (
              <div className="fixed inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center z-60 p-4">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center shadow-xs shrink-0">
                        <CalendarPlus className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        Xác nhận Tạo lịch hẹn
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBookingConfirmPopupOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5 space-y-3.5">
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-sm text-gray-800 leading-relaxed">
                      Lịch hẹn sẽ được lưu vào{' '}
                      <span className="font-bold text-[#1A73E8]">
                        Module &quot;Lịch hẹn khách đặt&quot;
                      </span>
                      .
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-1">
                      Bạn vẫn có thể{' '}
                      <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">
                        chỉnh sửa
                      </span>{' '}
                      hoặc{' '}
                      <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">
                        xóa
                      </span>{' '}
                      lịch hẹn này bất kỳ lúc nào.
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBookingConfirmPopupOpen(false)}
                      className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteCreateCustomerBooking}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Full-Screen Modal: Danh sách Lịch hẹn Khách đặt (Filtered by selected Potential Customer) */}
      {bookingListModalCustomer && (
        <div className="fixed inset-0 bg-[#F8FAFC] z-50 flex flex-col w-screen h-screen overflow-hidden">
          <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Danh sách Lịch hẹn Khách đặt
                </h2>
                <p className="text-xs text-gray-500">
                  Khách hàng:{' '}
                  <span className="font-semibold text-gray-800">
                    {bookingListModalCustomer.fullName}
                  </span>{' '}
                  • SĐT:{' '}
                  <span className="font-semibold text-gray-800">
                    {bookingListModalCustomer.phone}
                  </span>{' '}
                  • Mã chiến dịch:{' '}
                  <span className="font-semibold text-[#1A73E8]">
                    {bookingListModalCustomer.code}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookingListModalCustomer(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CustomerBookingsModule
              bookings={customerBookings}
              setBookings={setCustomerBookings}
              discounts={discounts}
              filterPotentialCustomerId={bookingListModalCustomer.id}
              defaultPotentialCustomer={bookingListModalCustomer}
              bookingInternalNotes={bookingInternalNotes}
              setBookingInternalNotes={setBookingInternalNotes}
              bookingTasks={bookingTasks}
              setBookingTasks={setBookingTasks}
              bookingActivities={bookingActivities}
              setBookingActivities={setBookingActivities}
              guestHistory={guestHistory}
              setGuestHistory={setGuestHistory}
              guestTasks={guestTasks}
              setGuestTasks={setGuestTasks}
              guestActivityHistory={guestActivityHistory}
              setGuestActivityHistory={setGuestActivityHistory}
            />
          </div>
        </div>
      )}

      {/* RO Gốc Detail Modal */}
      {selectedRoDetailRow && (
        <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-1">
          <div className="w-full h-full bg-white rounded-md shadow-2xl border border-slate-300 flex flex-col overflow-hidden font-sans">
            {/* Top Dark Header */}
            <div className="bg-[#0F172A] text-white shrink-0">
              {/* Row 1: Plate, Brand, RO Code, Action Buttons */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="bg-white text-slate-900 px-3 py-1 rounded-md flex items-center gap-2 font-extrabold text-sm tracking-widest border border-slate-300 shadow-xs">
                    <svg className="w-4 h-4 text-[#0284C7]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                    <span>{(selectedRoDetailRow.licensePlate || '51H11112').replace(/[-.]/g, '')}</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base leading-tight">
                      {selectedRoDetailRow.carBrand || 'Toyota'}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2.5 mt-0.5">
                      <span>
                        Mã RO:{' '}
                        <span className="text-[#38BDF8] font-semibold">
                          {selectedRoDetailRow.originalRoCode || '2611-000003'}
                        </span>
                      </span>
                      <span>
                        Tiếp nhận: {selectedRoDetailRow.originalRoDates?.split(' - ')[0] || '09/11/2026'} 13:37
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Mở POS sửa chữa</span>
                    <span className="text-[11px]">↗</span>
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    title="Làm mới"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    title="Phóng to"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoDetailRow(null)}
                    className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: 4 Info Columns */}
              <div className="px-5 py-3.5 grid grid-cols-4 gap-6">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    KHÁCH HÀNG
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedRoDetailRow.fullName || 'Trần Lâm'}
                  </div>
                  <div className="text-xs text-[#38BDF8] mt-0.5">
                    {selectedRoDetailRow.phone || 'Chưa có SĐT'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    CỐ VẤN DỊCH VỤ
                  </div>
                  <div className="text-sm font-bold text-white uppercase mt-0.5">
                    {selectedRoDetailRow.createdBy || 'LÊ XUÂN NGUYÊN'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">0926121299</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    SỐ ODO HIỆN TẠI
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Chưa ghi số km
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    BẢO HIỂM
                  </div>
                  <div className="text-sm text-slate-300 mt-0.5">
                    Khách tự chi trả (Không BH)
                  </div>
                </div>
              </div>
            </div>

            {/* QUY TRÌNH DỊCH VỤ Stepper */}
            <div className="px-5 py-3.5 bg-white border-b border-gray-200 shrink-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                QUY TRÌNH DỊCH VỤ
              </div>
              <div className="flex items-center gap-2">
                {/* Step 1 */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-emerald-400 bg-emerald-50/70">
                  <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-700">Tiếp nhận & chẩn đoán</div>
                    <div className="text-[11px] text-emerald-600">1 tiếp nhận</div>
                  </div>
                </div>

                <div className="w-4 h-[2px] bg-emerald-300 shrink-0" />

                {/* Step 2 */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-emerald-400 bg-emerald-50/70">
                  <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-700">Báo giá sửa chữa</div>
                    <div className="text-[11px] text-emerald-600">2 phiếu đã lập</div>
                  </div>
                </div>

                <div className="w-4 h-[2px] bg-emerald-300 shrink-0" />

                {/* Step 3 */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/80">
                  <div className="w-7 h-7 rounded-full bg-gray-300 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500">Lệnh sửa chữa</div>
                    <div className="text-[11px] text-gray-400">Chưa thực hiện</div>
                  </div>
                </div>

                <div className="w-4 h-[2px] bg-gray-200 shrink-0" />

                {/* Step 4 */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/80">
                  <div className="w-7 h-7 rounded-full bg-gray-300 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500">Nghiệm thu nội bộ</div>
                    <div className="text-[11px] text-gray-400">Chưa thực hiện</div>
                  </div>
                </div>

                <div className="w-4 h-[2px] bg-emerald-300 shrink-0" />

                {/* Step 5 */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-2 border-[#10B981] bg-emerald-50 shadow-xs">
                  <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-800">Quyết toán</div>
                    <div className="text-[11px] text-emerald-600">1 phiếu đã lập</div>
                  </div>
                </div>

                {/* Y/C Vật Tư (0) */}
                <button
                  type="button"
                  className="px-3.5 py-2.5 rounded-lg border border-indigo-400 bg-indigo-50/60 text-indigo-700 text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Y/C Vật Tư (0)</span>
                </button>
              </div>
            </div>

            {/* Quyết Toán Dịch Vụ Body */}
            <div className="flex-1 bg-white px-5 py-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Quyết Toán Dịch Vụ</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hóa đơn tính tiền cuối cùng, thanh toán và cho phép xe xuất xưởng
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Lập phiếu quyết toán</span>
                </button>
              </div>

              <table className="w-full text-xs text-left border-t border-gray-100">
                <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Số phiếu</th>
                    <th className="px-4 py-3">Ngày quyết toán</th>
                    <th className="px-4 py-3">Đối tượng</th>
                    <th className="px-4 py-3">Tên đối tượng</th>
                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-red-600">BH2611-00006</td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {selectedRoDetailRow.originalRoDates?.split(' - ')[1] || '09/11/2026'} 15:00
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">Khách hàng</td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">
                      {selectedRoDetailRow.fullName || 'Trần Lâm'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-red-600 text-sm">
                      {selectedRoDetailRow.originalRoRevenue || '1,306,000 đ'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Đã quyết toán</span>
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100 inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="In phiếu quyết toán"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Quotation Picker Modal ("Lấy chi tiết từ phiếu báo giá") */}
      {isQuotationPickerOpen && hideRegistrationSummary && (() => {
        const isEditMode = Boolean(editingReminderRecord);
        const allAvailableQuotes: QuotationRecord[] = (() => {
          if (!editingReminderRecord) return MOCK_QUOTATIONS_FOR_REMINDERS;
          const hasMatch = MOCK_QUOTATIONS_FOR_REMINDERS.some(
            (q) =>
              q.quoteCode === editingReminderRecord.code ||
              (editingReminderRecord.originalRoCode &&
                q.originalRoCode === editingReminderRecord.originalRoCode) ||
              (editingReminderRecord.licensePlate &&
                q.licensePlate === editingReminderRecord.licensePlate) ||
              Boolean(editingReminderRecord.selectedQuoteItemsMap?.[q.id]?.length)
          );
          if (hasMatch) return MOCK_QUOTATIONS_FOR_REMINDERS;

          const synthId = `q-row-${editingReminderRecord.id}`;
          const parsedRev =
            parseInt(
              (editingReminderRecord.originalRoRevenue || '750000').replace(/[^\d]/g, ''),
              10
            ) || 750000;
          const item1Price = Math.round(parsedRev * 0.6);
          const item2Price = parsedRev - item1Price;
          const synthesizedQuote: QuotationRecord = {
            id: synthId,
            quoteCode: editingReminderRecord.code.startsWith('BG')
              ? editingReminderRecord.code
              : `BG-${editingReminderRecord.originalRoCode || editingReminderRecord.code}`,
            quoteDate: '2026-11-09',
            quoteDateTimeDisplay: `${editingReminderRecord.registrationDate || '09/11/2026'} 14:30`,
            licensePlate: editingReminderRecord.licensePlate || '51H11111',
            customerName: editingReminderRecord.fullName,
            phone: editingReminderRecord.phone,
            email: editingReminderRecord.email,
            carBrand: editingReminderRecord.carBrand || 'Toyota',
            carModel: editingReminderRecord.carModel || 'Camry',
            originalRoCode: editingReminderRecord.originalRoCode || '2611-000003',
            originalRoDates:
              editingReminderRecord.originalRoDates || '09/11/2026 - 09/11/2026',
            originalRoRevenue: editingReminderRecord.originalRoRevenue || '750.000 đ',
            approvalStatus: 'Chờ khách duyệt',
            items: [
              {
                id: `${synthId}-item-1`,
                itemCode: 'BDĐK001',
                itemName: 'Bảo dưỡng định kỳ & thay dầu động cơ tổng hợp',
                unit: 'Gói',
                quantity: 1,
                unitPrice: item1Price,
                totalPrice: item1Price,
              },
              {
                id: `${synthId}-item-2`,
                itemCode: 'PHANH002',
                itemName: 'Kiểm tra & vệ sinh bố thắng, cân chỉnh thước lái',
                unit: 'Lần',
                quantity: 1,
                unitPrice: item2Price,
                totalPrice: item2Price,
              },
            ],
          };
          return [synthesizedQuote, ...MOCK_QUOTATIONS_FOR_REMINDERS];
        })();

        const uniqueVehicles = Array.from(
          new Set(allAvailableQuotes.map((q) => q.licensePlate))
        );
        const filteredQuotes = allAvailableQuotes.filter((q) => {
          const searchLower = quoteSearch.trim().toLowerCase();
          const matchSearch =
            !searchLower ||
            q.quoteCode.toLowerCase().includes(searchLower) ||
            q.licensePlate.toLowerCase().includes(searchLower) ||
            q.customerName.toLowerCase().includes(searchLower) ||
            q.items.some(
              (item) =>
                item.itemCode.toLowerCase().includes(searchLower) ||
                item.itemName.toLowerCase().includes(searchLower)
            );
          const matchVehicle =
            quoteVehicleFilter === 'Tất cả xe' || q.licensePlate === quoteVehicleFilter;
          const matchDateFrom = !quoteDateFrom || q.quoteDate >= quoteDateFrom;
          const matchDateTo = !quoteDateTo || q.quoteDate <= quoteDateTo;
          const matchApproval =
            quoteApprovalStatus === 'Tất cả' || q.approvalStatus === quoteApprovalStatus;
          return matchSearch && matchVehicle && matchDateFrom && matchDateTo && matchApproval;
        });

        const selectedQuotesCount = Object.keys(selectedQuoteItems).filter(
          (qid) => (selectedQuoteItems[qid] || []).length > 0
        ).length;

        const totalSelectedItemsCount = (Object.values(selectedQuoteItems) as string[][]).reduce(
          (sum, arr) => sum + arr.length,
          0
        );

        const toggleQuoteAllItems = (quote: QuotationRecord) => {
          const currentSelected = selectedQuoteItems[quote.id] || [];
          const allItemIds = quote.items.map((i) => i.id);
          const isAllSelected =
            allItemIds.length > 0 && allItemIds.every((id) => currentSelected.includes(id));
          setSelectedQuoteItems((prev) => ({
            ...prev,
            [quote.id]: isAllSelected ? [] : allItemIds,
          }));
        };

        const toggleSingleQuoteItem = (quoteId: string, itemId: string) => {
          setSelectedQuoteItems((prev) => {
            const current = prev[quoteId] || [];
            const exists = current.includes(itemId);
            const updated = exists
              ? current.filter((id) => id !== itemId)
              : [...current, itemId];
            return {
              ...prev,
              [quoteId]: updated,
            };
          });
        };

        const handleCloseQuotationModal = () => {
          setIsQuotationPickerOpen(false);
          setEditingReminderRecord(null);
        };

        const handleConfirmCreateRecords = () => {
          const quotesToProcess = allAvailableQuotes.filter(
            (q) => (selectedQuoteItems[q.id] || []).length > 0
          );
          if (quotesToProcess.length === 0) return;

          const todayIso = new Date().toISOString().split('T')[0];

          if (editingReminderRecord) {
            const primaryQuote = quotesToProcess[0];
            const allChosenItemsSummary = quotesToProcess
              .map((quote) => {
                const chosenItemIds = selectedQuoteItems[quote.id] || [];
                const chosenItems = quote.items.filter((i) => chosenItemIds.includes(i.id));
                return `${quote.quoteCode}: ${chosenItems
                  .map((i) => `${i.itemName} (${i.quantity} ${i.unit})`)
                  .join(', ')}`;
              })
              .join(' | ');

            const totalSelectedValue = quotesToProcess.reduce((sum, quote) => {
              const chosenItemIds = selectedQuoteItems[quote.id] || [];
              return (
                sum +
                quote.items
                  .filter((i) => chosenItemIds.includes(i.id))
                  .reduce((s, item) => s + item.totalPrice, 0)
              );
            }, 0);

            setEvents((prev) =>
              prev.map((item) =>
                item.id === editingReminderRecord.id
                  ? {
                      ...item,
                      code: primaryQuote.quoteCode,
                      name: `Nhắc bảo dưỡng từ báo giá ${primaryQuote.quoteCode}`,
                      fullName: primaryQuote.customerName,
                      phone: primaryQuote.phone || item.phone,
                      email: primaryQuote.email || item.email,
                      licensePlate: primaryQuote.licensePlate,
                      carBrand: primaryQuote.carBrand || item.carBrand,
                      carModel: primaryQuote.carModel || item.carModel,
                      originalRoCode: primaryQuote.originalRoCode || item.originalRoCode,
                      originalRoDates: primaryQuote.originalRoDates || item.originalRoDates,
                      originalRoRevenue:
                        totalSelectedValue > 0
                          ? `${totalSelectedValue.toLocaleString('vi-VN')} đ`
                          : primaryQuote.originalRoRevenue || item.originalRoRevenue,
                      notes: `Hạng mục cập nhật từ phiếu báo giá (${primaryQuote.approvalStatus}): ${allChosenItemsSummary}`,
                      selectedQuoteItemsMap: { ...selectedQuoteItems },
                    }
                  : item
              )
            );
            setSelectedQuoteItems({});
            setEditingReminderRecord(null);
            setIsQuotationPickerOpen(false);
            return;
          }

          const newRecords: PotentialCustomerItem[] = quotesToProcess.map((quote, idx) => {
            const chosenItemIds = selectedQuoteItems[quote.id] || [];
            const chosenItems = quote.items.filter((i) => chosenItemIds.includes(i.id));
            const chosenSummary = chosenItems
              .map((i) => `${i.itemName} (${i.quantity} ${i.unit})`)
              .join(', ');

            return {
              id: `pr-quote-${Date.now()}-${idx}`,
              code: quote.quoteCode,
              name: `Nhắc bảo dưỡng từ báo giá ${quote.quoteCode}`,
              channelUserCode: quote.quoteCode,
              fullName: quote.customerName,
              garageName: quote.customerName,
              phone: quote.phone,
              email: quote.email,
              demands: ['Bảo dưỡng định kỳ'],
              taxCode: '',
              registrationDate: todayIso,
              appointmentDate: todayIso,
              appointmentTimeSlot: '09:00 - 10:00',
              status: 'Mới',
              address: 'TP. Hồ Chí Minh',
              link: '',
              startDate: todayIso,
              endDate: todayIso,
              isLocked: false,
              source: 'Website',
              callStatus: 'Chưa gọi',
              callResult: 'Rỗng',
              carModel: quote.carModel,
              carBrand: quote.carBrand,
              licensePlate: quote.licensePlate,
              originalRoCode: quote.originalRoCode,
              originalRoDates: quote.originalRoDates,
              originalRoRevenue: quote.originalRoRevenue,
              createdBy: 'Lê Xuân Nguyên',
              notes: chosenSummary
                ? `Hạng mục từ phiếu báo giá ${quote.quoteCode} (${quote.approvalStatus}): ${chosenSummary}`
                : `Tạo từ phiếu báo giá ${quote.quoteCode}`,
              selectedQuoteItemsMap: {
                [quote.id]: chosenItemIds,
              },
            };
          });

          setEvents((prev) => [...newRecords, ...prev]);
          setSelectedQuoteItems({});
          setEditingReminderRecord(null);
          setIsQuotationPickerOpen(false);
        };

        return (
          <div className="fixed inset-0 z-[130] bg-white flex flex-col overflow-hidden">
            {/* Top Header */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A73E8]">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-[17px] font-bold text-slate-900">
                    Lấy chi tiết từ phiếu báo giá
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200">
                    {filteredQuotes.length === allAvailableQuotes.length
                      ? '48 phiếu'
                      : `${filteredQuotes.length} phiếu`}
                  </span>
                  {isEditMode && editingReminderRecord && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Chế độ chỉnh sửa (Edit) • {editingReminderRecord.fullName} ({editingReminderRecord.licensePlate || '-'})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteSearch('');
                    setQuoteVehicleFilter('Tất cả xe');
                    setQuoteDateFrom('');
                    setQuoteDateTo('');
                    setQuoteApprovalStatus('Tất cả');
                  }}
                  title="Làm mới"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleCloseQuotationModal}
                  title="Đóng"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 min-w-[280px]">
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    placeholder="Tìm theo số phiếu, biển số xe, khách hàng, mã/tên vật tư..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Vehicle Filter */}
                <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium shadow-2xs">
                  <svg className="w-4 h-4 text-slate-600 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                    <circle cx="7.5" cy="14.5" r="1.5" />
                    <circle cx="16.5" cy="14.5" r="1.5" />
                  </svg>
                  <select
                    value={quoteVehicleFilter}
                    onChange={(e) => setQuoteVehicleFilter(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="Tất cả xe">Tất cả xe</option>
                    {uniqueVehicles.map((plate) => (
                      <option key={plate} value={plate}>
                        {plate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Filters requested: Ngày lập báo giá (từ ngày), Ngày lập báo giá (đến ngày), Trạng thái duyệt */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    Ngày lập báo giá (từ ngày):
                  </span>
                  <input
                    type="date"
                    value={quoteDateFrom}
                    onChange={(e) => setQuoteDateFrom(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    Ngày lập báo giá (đến ngày):
                  </span>
                  <input
                    type="date"
                    value={quoteDateTo}
                    onChange={(e) => setQuoteDateTo(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    Trạng thái duyệt:
                  </span>
                  <select
                    value={quoteApprovalStatus}
                    onChange={(e) => setQuoteApprovalStatus(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Tất cả">Tất cả</option>
                    {QUOTATION_APPROVAL_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Scrollable Quotation List */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-6 py-4 space-y-4">
              {filteredQuotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  Không tìm thấy phiếu báo giá phù hợp với bộ lọc.
                </div>
              ) : (
                filteredQuotes.map((quote) => {
                  const selectedIds = selectedQuoteItems[quote.id] || [];
                  const totalItems = quote.items.length;
                  const isAllSelected =
                    totalItems > 0 && selectedIds.length === totalItems;
                  const totalQuoteAmount = quote.items.reduce(
                    (sum, item) => sum + item.totalPrice,
                    0
                  );
                  const selectedAmount = quote.items
                    .filter((item) => selectedIds.includes(item.id))
                    .reduce((sum, item) => sum + item.totalPrice, 0);
                  const isCollapsed = !!collapsedQuoteIds[quote.id];

                  return (
                    <div
                      key={quote.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
                    >
                      {/* Card Top Bar */}
                      <div className="px-5 py-3.5 flex items-start justify-between border-b border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={() => toggleQuoteAllItems(quote)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[15px] font-bold text-slate-900">
                                  {quote.quoteCode}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                                  {quote.approvalStatus}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{quote.quoteDateTimeDisplay}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                              </svg>
                              Biển số: <strong className="font-semibold text-slate-800">{quote.licensePlate}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              Khách hàng: <strong className="font-semibold text-slate-800">{quote.customerName}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                            {selectedIds.length}/{totalItems} hạng mục
                          </span>
                          <span className="text-[15px] font-bold text-[#0F766E] underline decoration-[#0F766E]/60">
                            {totalQuoteAmount.toLocaleString('vi-VN')} đ
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCollapsedQuoteIds((prev) => ({
                                ...prev,
                                [quote.id]: !prev[quote.id],
                              }))
                            }
                            className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      {!isCollapsed && (
                        <div className="px-5 py-3">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-4 rounded-full bg-[#1A73E8]" />
                              <span className="text-xs font-bold text-slate-700">
                                Hạng mục vật tư, phụ tùng & dịch vụ
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {totalItems}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Đã chọn: {selectedIds.length}/{totalItems} (
                              <span className="underline">
                                {selectedAmount.toLocaleString('vi-VN')} đ
                              </span>
                              )
                            </div>
                          </div>

                          <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                  <th className="py-2.5 px-3 w-10">
                                    <input
                                      type="checkbox"
                                      checked={isAllSelected}
                                      onChange={() => toggleQuoteAllItems(quote)}
                                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                  </th>
                                  <th className="py-2.5 px-3 w-44">Mã VT</th>
                                  <th className="py-2.5 px-3">Tên hàng / Dịch vụ</th>
                                  <th className="py-2.5 px-3 w-24 text-center">ĐVT</th>
                                  <th className="py-2.5 px-3 w-20 text-center">SL</th>
                                  <th className="py-2.5 px-3 w-36 text-right">Đơn giá</th>
                                  <th className="py-2.5 px-3 w-36 text-right">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-[13px]">
                                {quote.items.map((item) => {
                                  const isItemChecked = selectedIds.includes(item.id);
                                  return (
                                    <tr
                                      key={item.id}
                                      onClick={() => toggleSingleQuoteItem(quote.id, item.id)}
                                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                                    >
                                      <td
                                        className="py-2.5 px-3"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isItemChecked}
                                          onChange={() => toggleSingleQuoteItem(quote.id, item.id)}
                                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50/80 text-[#1A73E8] font-bold text-xs">
                                          {item.itemCode}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 font-medium text-slate-800">
                                        {item.itemName}
                                      </td>
                                      <td className="py-2.5 px-3 text-center text-slate-500">
                                        {item.unit}
                                      </td>
                                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                                        {item.quantity}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-slate-600 underline decoration-slate-400">
                                        {item.unitPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 underline decoration-slate-700">
                                        {item.totalPrice.toLocaleString('vi-VN')} đ
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-600">
                              Tổng giá trị phiếu:{' '}
                              <strong className="text-slate-900 font-bold underline">
                                {totalQuoteAmount.toLocaleString('vi-VN')} đ
                              </strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleQuoteAllItems(quote)}
                              className="text-[#1A73E8] hover:text-blue-700 font-semibold cursor-pointer"
                            >
                              {isAllSelected ? 'Bỏ chọn tất cả hạng mục' : 'Chọn tất cả hạng mục'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-sm text-slate-600">
                Đã chọn <strong className="font-bold text-slate-900">{selectedQuotesCount}</strong> phiếu báo giá ({totalSelectedItemsCount} hạng mục)
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseQuotationModal}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={selectedQuotesCount === 0}
                  onClick={handleConfirmCreateRecords}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedQuotesCount > 0
                      ? 'bg-[#1A73E8] hover:bg-blue-700 text-white cursor-pointer shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isEditMode ? 'Lưu thay đổi' : 'Xác nhận Tạo'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Full-Screen Pop-up: Thêm Phân khúc Khách hàng */}
      {isSegmentModalOpen && isCustomerSegmentsMode && (() => {
        const formatDateToYMD = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const computeDateRangeFromMonths = (monthsAgo: number) => {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - monthsAgo);
          return {
            from: formatDateToYMD(startDate),
            to: formatDateToYMD(endDate),
          };
        };

        const handleSelectPreviousSegment = (presetId: string) => {
          setSelectedPreviousSegmentId(presetId);
          if (!presetId) return;
          const preset = savedSegmentPresets.find((p) => p.id === presetId);
          if (!preset) return;

          // Auto-fill Khu vực 1
          setSegmentName(preset.name);
          setSegmentPurpose(preset.purpose);

          // Auto-fill Khu vực 3 (Phạm vi RO)
          setSegmentSelectedRoTypes(preset.roTypes || []);
          if (preset.roAllDates) {
            setSegmentRoAllDates(true);
            setSegmentRoActiveChip(null);
            setSegmentRoDateFrom('');
            setSegmentRoDateTo('');
          } else {
            setSegmentRoAllDates(false);
            setSegmentRoActiveChip(preset.roActiveChip);
            const months = preset.roDateFromOffsetMonths || 3;
            const range = computeDateRangeFromMonths(months);
            setSegmentRoDateFrom(range.from);
            setSegmentRoDateTo(range.to);
          }

          // Auto-fill Khu vực 2 & Khu vực 4 (2-way bound via segmentDetailRows)
          setSegmentDetailRows(
            preset.detailRows.map((row, idx) => ({
              id: `seg-row-${Date.now()}-${idx}`,
              criterion: row.criterion,
              purpose: row.purpose,
              operator: row.operator,
              value: row.value,
            }))
          );
        };

        const handleToggleRoTypeCheckbox = (roType: SegmentRoTypeName) => {
          setSegmentSelectedRoTypes((prev) =>
            prev.includes(roType)
              ? prev.filter((item) => item !== roType)
              : [...prev, roType]
          );
        };

        const handleToggleCriterionCheckbox = (criterion: SegmentCriterionName) => {
          setSegmentDetailRows((prev) => {
            const exists = prev.some((r) => r.criterion === criterion);
            if (exists) {
              // Bỏ tick ở Tiêu chí lọc -> gỡ dòng tương ứng khỏi Cấu hình chi tiết
              return prev.filter((r) => r.criterion !== criterion);
            } else {
              // Tick chọn ở Tiêu chí lọc -> đẩy bộ lọc đó thành 1 dòng mới trong Bảng Cấu hình chi tiết
              const defaultCfg = DEFAULT_CRITERION_CONFIG[criterion];
              return [
                ...prev,
                {
                  id: `seg-row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  criterion,
                  purpose:
                    criterion === 'Ngày đăng kiễm hết hạn'
                      ? defaultCfg.purpose
                      : segmentPurpose.trim() || defaultCfg.purpose,
                  operator: defaultCfg.operator,
                  value: defaultCfg.value,
                },
              ];
            }
          });
        };

        const handleRemoveDetailRow = (criterion: SegmentCriterionName) => {
          setSegmentDetailRows((prev) => prev.filter((r) => r.criterion !== criterion));
        };

        const handleUpdateDetailRow = (
          rowId: string,
          field: 'purpose' | 'operator' | 'value',
          newVal: string
        ) => {
          setSegmentDetailRows((prev) =>
            prev.map((r) => (r.id === rowId ? { ...r, [field]: newVal } : r))
          );
        };

        const handleToggleRoAllDates = (checked: boolean) => {
          setSegmentRoAllDates(checked);
          if (checked) {
            setSegmentRoDateFrom('');
            setSegmentRoDateTo('');
            setSegmentRoActiveChip(null);
          }
        };

        const handleClickRoDateChip = (
          chipKey: '1m' | '3m' | '6m' | '1y',
          monthsAgo: number
        ) => {
          setSegmentRoAllDates(false);
          setSegmentRoActiveChip(chipKey);
          const range = computeDateRangeFromMonths(monthsAgo);
          setSegmentRoDateFrom(range.from);
          setSegmentRoDateTo(range.to);
        };

        const handleSaveSegment = () => {
          const finalName =
            segmentName.trim() ||
            `Phân khúc khách hàng mới (${new Date().toLocaleDateString('vi-VN')})`;
          const finalPurpose =
            segmentPurpose.trim() || 'Chăm sóc & mời khách hàng quay lại xưởng';
          const todayIso = formatDateToYMD(new Date());

          // Save to previous segments list for future reuse
          const newPreset: SavedCustomerSegmentPreset = {
            id: `seg-preset-${Date.now()}`,
            name: finalName,
            purpose: finalPurpose,
            roAllDates: segmentRoAllDates,
            roActiveChip: segmentRoActiveChip,
            roDateFromOffsetMonths:
              segmentRoActiveChip === '1m'
                ? 1
                : segmentRoActiveChip === '3m'
                ? 3
                : segmentRoActiveChip === '6m'
                ? 6
                : segmentRoActiveChip === '1y'
                ? 12
                : undefined,
            roTypes: segmentSelectedRoTypes,
            detailRows: segmentDetailRows.map((r) => ({
              criterion: r.criterion,
              purpose: r.purpose,
              operator: r.operator,
              value: r.value,
            })),
          };
          setSavedSegmentPresets((prev) => [newPreset, ...prev]);

          const roScopeDisplay = segmentRoAllDates
            ? 'Tất cả'
            : segmentRoActiveChip === '1m'
            ? `1 tháng trở lại (${segmentRoDateFrom} - ${segmentRoDateTo})`
            : segmentRoActiveChip === '3m'
            ? `3 tháng trở lại (${segmentRoDateFrom} - ${segmentRoDateTo})`
            : segmentRoActiveChip === '6m'
            ? `6 tháng trở lại (${segmentRoDateFrom} - ${segmentRoDateTo})`
            : segmentRoActiveChip === '1y'
            ? `1 năm trở lại (${segmentRoDateFrom} - ${segmentRoDateTo})`
            : segmentRoDateFrom && segmentRoDateTo
            ? `${segmentRoDateFrom} - ${segmentRoDateTo}`
            : 'Tất cả';

          // Also add corresponding record into Customer Segments viewlist
          const newRecord: PotentialCustomerItem = {
            id: `seg-item-${Date.now()}`,
            code: `PK-${String(events.length + 1).padStart(3, '0')}`,
            name: finalName,
            segmentName: finalName,
            segmentPurpose: finalPurpose,
            totalFilterCriteria: segmentDetailRows.length,
            roFilterScope: roScopeDisplay,
            garageName: 'Sài Gòn Garage',
            channelUserCode: 'CRM-SEG',
            fullName: finalName,
            phone: '0909123456',
            email: 'cskh@garage.vn',
            demands: ['Bảo dưỡng định kỳ'],
            taxCode: '',
            registrationDate: todayIso,
            appointmentDate: todayIso,
            appointmentTimeSlot: '09:00 - 10:00',
            status: 'Mới',
            address: 'TP. Hồ Chí Minh',
            link: '',
            startDate: segmentRoDateFrom || todayIso,
            endDate: segmentRoDateTo || todayIso,
            isLocked: false,
            source: 'Website',
            callStatus: 'Chưa gọi',
            callResult: 'Rỗng',
            createdBy: 'Lê Xuân Nguyên',
            notes: `Mục đích: ${finalPurpose} | Số tiêu chí lọc: ${segmentDetailRows.length}`,
          };

          setEvents((prev) => [newRecord, ...prev]);
          setIsSegmentModalOpen(false);
        };

        return (
          <div className="fixed inset-0 z-[130] bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A73E8]">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Thiết lập Phân khúc Khách hàng
                  </h2>
                  <p className="text-xs text-slate-500">
                    Khởi tạo hoặc kế thừa phân khúc khách hàng theo bộ tiêu chí lọc tự động
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSegmentName('');
                    setSegmentPurpose('');
                    setSelectedPreviousSegmentId('');
                    setSegmentRoAllDates(true);
                    setSegmentRoDateFrom('');
                    setSegmentRoDateTo('');
                    setSegmentRoActiveChip(null);
                    setSegmentSelectedRoTypes([]);
                    setSegmentDetailRows([]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Làm mới cấu hình
                </button>
                <button
                  type="button"
                  onClick={() => setIsSegmentModalOpen(false)}
                  title="Đóng"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Main Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* KHU VỰC 1: Thông tin Phân khúc khách hàng */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
                <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Thông tin Phân khúc khách hàng
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tên Phân khúc khách hàng */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Tên Phân khúc khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                      placeholder="Nhập Tên Phân khúc khách hàng..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                    />
                  </div>

                  {/* Mục đích xác định (Chọn hoặc nhập) */}
                  <div className="space-y-1.5 relative">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mục đích xác định <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={segmentPurpose}
                        onChange={(e) => setSegmentPurpose(e.target.value)}
                        onFocus={() => setIsSegmentPurposeDropdownOpen(true)}
                        placeholder="Chọn hoặc nhập Mục đích xác định..."
                        className="w-full pl-3.5 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsSegmentPurposeDropdownOpen((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Chọn từ danh sách gợi ý"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    {isSegmentPurposeDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto py-1">
                        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                          Gợi ý mục đích xác định
                        </div>
                        {SEGMENT_PURPOSE_SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setSegmentPurpose(suggestion);
                              setIsSegmentPurposeDropdownOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1A73E8] transition-colors cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tên Phân khúc khách hàng (trước đó) - Dropdown Auto-fill */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Tên Phân khúc khách hàng (trước đó)
                    </label>
                    <select
                      value={selectedPreviousSegmentId}
                      onChange={(e) => handleSelectPreviousSegment(e.target.value)}
                      className="w-full px-3.5 py-2 bg-blue-50/40 border border-blue-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] cursor-pointer"
                    >
                      <option value="">-- Chọn phân khúc cũ để tự động điền (Auto-fill) --</option>
                      {savedSegmentPresets.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* KHU VỰC 2: Phạm vi RO */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Phạm vi RO
                  </h3>
                </div>

                {/* Nhóm con Loại RO trong Phạm vi RO */}
                <div className="flex flex-col justify-between rounded-xl border p-3 bg-violet-50/60 border-violet-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-violet-900">
                      Loại RO
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {SEGMENT_RO_TYPES_LIST.map((roType) => {
                      const isChecked = segmentSelectedRoTypes.includes(roType);
                      return (
                        <label
                          key={roType}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                            isChecked
                              ? 'bg-violet-100 border-violet-600 text-violet-950 font-semibold shadow-2xs'
                              : 'bg-white/90 border-violet-200 text-violet-900 hover:bg-violet-100/60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRoTypeCheckbox(roType)}
                            className="w-4 h-4 rounded border-slate-300 cursor-pointer shrink-0 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="whitespace-nowrap">{roType}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Checkbox Tất cả */}
                    <label
                      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer select-none transition-colors ${
                        segmentRoAllDates
                          ? 'bg-blue-50 border-[#1A73E8] text-[#1A73E8]'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={segmentRoAllDates}
                        onChange={(e) => handleToggleRoAllDates(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                      />
                      <span>Tất cả</span>
                    </label>

                    {/* Date Pickers: Ngày nhận xe (Bắt đầu) & Ngày nhận xe (Kết thúc) */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                          Ngày nhận xe (Bắt đầu):
                        </span>
                        <input
                          type="date"
                          disabled={segmentRoAllDates}
                          value={segmentRoAllDates ? '' : segmentRoDateFrom}
                          onChange={(e) => {
                            setSegmentRoActiveChip(null);
                            setSegmentRoDateFrom(e.target.value);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                            segmentRoAllDates
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                          Ngày nhận xe (Kết thúc):
                        </span>
                        <input
                          type="date"
                          disabled={segmentRoAllDates}
                          value={segmentRoAllDates ? '' : segmentRoDateTo}
                          onChange={(e) => {
                            setSegmentRoActiveChip(null);
                            setSegmentRoDateTo(e.target.value);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                            segmentRoAllDates
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chips gợi ý */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 mr-1">Gợi ý nhanh:</span>
                    {(
                      [
                        { key: '1m', label: '1 tháng trở lại', months: 1 },
                        { key: '3m', label: '3 tháng trở lại', months: 3 },
                        { key: '6m', label: '6 tháng trở lại', months: 6 },
                        { key: '1y', label: '1 năm trở lại', months: 12 },
                      ] as const
                    ).map((chip) => {
                      const isActive = !segmentRoAllDates && segmentRoActiveChip === chip.key;
                      return (
                        <button
                          key={chip.key}
                          type="button"
                          onClick={() => handleClickRoDateChip(chip.key, chip.months)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-200'
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* KHU VỰC 3: Tiêu chí lọc */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Tiêu chí lọc
                    </h3>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200">
                      Đã chọn: {segmentDetailRows.length}/{SEGMENT_FILTER_CRITERIA_LIST.length}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 italic">
                    * Sắp xếp theo dòng chảy của tiền (Định kỳ → Số KM → Bảo hành → Thời gian trong RO → Chất lượng dịch vụ → Doanh thu → Công nợ)
                  </span>
                </div>

                <div className="flex flex-wrap items-stretch gap-2.5">
                  {SEGMENT_FILTER_CRITERIA_GROUPS.map((group) => (
                    <div
                      key={group.id}
                      className={`flex flex-col justify-between rounded-xl border p-3 transition-all ${group.containerClass}`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wide ${group.headerTextClass}`}>
                          {group.groupName}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {group.criteria.map((criterion) => {
                          const isChecked = segmentDetailRows.some(
                            (r) => r.criterion === criterion
                          );
                          return (
                            <label
                              key={criterion}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                                isChecked ? group.itemCheckedClass : group.itemUncheckedClass
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleCriterionCheckbox(criterion)}
                                className={`w-4 h-4 rounded border-slate-300 cursor-pointer shrink-0 ${group.checkboxAccentClass}`}
                              />
                              <span className="whitespace-nowrap">{criterion}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHU VỰC 4: Thiết lập Tiêu chí lọc */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Thiết lập Tiêu chí lọc
                    </h3>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {segmentDetailRows.length} điều kiện lọc
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-center w-16">STT</th>
                        <th className="px-4 py-3 min-w-[220px]">Tiêu chí lọc</th>
                        <th className="px-4 py-3 min-w-[240px]">Mục đích lọc</th>
                        <th className="px-4 py-3 min-w-[220px]">Bộ lọc</th>
                        <th className="px-4 py-3 min-w-[220px]">Giá trị thiết lập</th>
                        <th className="px-4 py-3 text-center w-28">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {segmentDetailRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-10 text-center text-slate-400 italic"
                          >
                            Chưa có tiêu chí lọc nào được chọn. Vui lòng tick chọn tại mục "Tiêu chí lọc" (Khu vực 2) hoặc chọn một phân khúc cũ tại Khu vực 1.
                          </td>
                        </tr>
                      ) : (
                        segmentDetailRows.map((detailRow, idx) => {
                          const isRegistrationExpiry =
                            detailRow.criterion === 'Ngày đăng kiễm hết hạn';
                          const isCustomSetup =
                            isRegistrationExpiry && detailRow.operator === 'Tự thiết lập';

                          return (
                            <tr key={detailRow.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-3 text-center font-semibold text-slate-600">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-[#1A73E8] font-semibold text-xs border border-blue-100">
                                  {detailRow.criterion}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {isRegistrationExpiry ? (
                                  <select
                                    value={detailRow.purpose}
                                    onChange={(e) =>
                                      handleUpdateDetailRow(detailRow.id, 'purpose', e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8] cursor-pointer"
                                  >
                                    {REGISTRATION_EXPIRY_PURPOSE_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={detailRow.purpose}
                                    onChange={(e) =>
                                      handleUpdateDetailRow(detailRow.id, 'purpose', e.target.value)
                                    }
                                    placeholder="Nhập mục đích lọc..."
                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isRegistrationExpiry ? (
                                  <select
                                    value={detailRow.operator}
                                    onChange={(e) => {
                                      const nextOperator = e.target.value;
                                      setSegmentDetailRows((prev) =>
                                        prev.map((r) => {
                                          if (r.id !== detailRow.id) return r;
                                          const nextValue =
                                            nextOperator === 'Mẫu của Du Mục' &&
                                            !(
                                              REGISTRATION_EXPIRY_VALUE_OPTIONS as readonly string[]
                                            ).includes(r.value)
                                              ? REGISTRATION_EXPIRY_VALUE_OPTIONS[0]
                                              : r.value;
                                          return {
                                            ...r,
                                            operator: nextOperator,
                                            value: nextValue,
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8] cursor-pointer"
                                  >
                                    {REGISTRATION_EXPIRY_OPERATOR_OPTIONS.map((op) => (
                                      <option key={op} value={op}>
                                        {op}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <select
                                    value={detailRow.operator}
                                    onChange={(e) =>
                                      handleUpdateDetailRow(detailRow.id, 'operator', e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8] cursor-pointer"
                                  >
                                    {SEGMENT_FILTER_OPERATOR_OPTIONS.map((op) => (
                                      <option key={op} value={op}>
                                        {op}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isRegistrationExpiry ? (
                                  <select
                                    disabled={isCustomSetup}
                                    value={detailRow.value}
                                    onChange={(e) =>
                                      handleUpdateDetailRow(detailRow.id, 'value', e.target.value)
                                    }
                                    className={`w-full px-3 py-1.5 border rounded-md text-sm transition-colors ${
                                      isCustomSetup
                                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-white border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8] cursor-pointer'
                                    }`}
                                  >
                                    {REGISTRATION_EXPIRY_VALUE_OPTIONS.map((valOpt) => (
                                      <option key={valOpt} value={valOpt}>
                                        {valOpt}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={detailRow.value}
                                    onChange={(e) =>
                                      handleUpdateDetailRow(detailRow.id, 'value', e.target.value)
                                    }
                                    placeholder="Nhập giá trị thiết lập..."
                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="inline-flex items-center justify-center gap-2">
                                  {isCustomSetup && (
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#1A73E8] hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                      <Settings className="w-3.5 h-3.5" />
                                      Thiết lập
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDetailRow(detailRow.criterion)}
                                    title="Xóa điều kiện lọc (Bỏ tick tiêu chí)"
                                    className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-sm text-slate-600">
                Đã thiết lập <strong className="font-bold text-slate-900">{segmentDetailRows.length}</strong> tiêu chí lọc
                {!segmentRoAllDates && segmentRoDateFrom && segmentRoDateTo && (
                  <span className="ml-2 text-xs text-slate-500">
                    • Ngày nhận xe RO: <strong>{segmentRoDateFrom}</strong> đến <strong>{segmentRoDateTo}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSegmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSegment}
                  className="px-5 py-2 rounded-lg bg-[#1A73E8] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Xác nhận Tạo
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
