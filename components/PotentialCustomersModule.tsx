import React, { useState, useRef } from 'react';
import { Plus, Trash2, Filter, X, FileSearch, Inbox, Calendar, CalendarPlus, HelpCircle, ChevronDown, Settings, Download, Mail, User, Paperclip, MessageSquarePlus, Phone, Building2, Wrench, MessageCircle, Hourglass, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Globe, MapPin } from 'lucide-react';
import { EventSettings } from './EventSettings';
import { HistoryItem, TaskItem, ActivityItem } from './EventsModule';
import {
  CustomerBookingsModule,
  CustomerBookingRecord,
  INITIAL_CUSTOMER_BOOKINGS,
} from './CustomerBookingsModule';

export type PotentialCustomerStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Xe đã đến' | 'Bỏ hẹn' | 'Đã hủy' | 'Chờ xóa';
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
}

const MOCK_POTENTIAL_CUSTOMERS: PotentialCustomerItem[] = [
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
    notes: 'Khách hàng tiềm năng quan tâm gói bảo dưỡng định kỳ và phần mềm quản lý xưởng dịch vụ.'
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
  }
];

interface PotentialCustomersModuleProps {
  onCreateCustomerBooking?: (
    booking: Omit<CustomerBookingRecord, 'id' | 'bookingCode'>
  ) => void;
  bookingCounts?: Record<string, number>;
  setBookingCounts?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  customerBookings?: CustomerBookingRecord[];
  setCustomerBookings?: React.Dispatch<
    React.SetStateAction<CustomerBookingRecord[]>
  >;
}

export const PotentialCustomersModule: React.FC<PotentialCustomersModuleProps> = ({
  onCreateCustomerBooking,
  bookingCounts: externalBookingCounts,
  setBookingCounts: externalSetBookingCounts,
  customerBookings: externalCustomerBookings,
  setCustomerBookings: externalSetCustomerBookings,
}) => {
  const [events, setEvents] = useState<PotentialCustomerItem[]>(MOCK_POTENTIAL_CUSTOMERS);
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
  const [selectedRecord, setSelectedRecord] = useState<PotentialCustomerItem | null>(null);
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
  const [guestHistory, setGuestHistory] = useState<Record<string, HistoryItem[]>>({});
  const [guestActivityHistory, setGuestActivityHistory] = useState<Record<string, ActivityItem[]>>({});
  const [noteContent, setNoteContent] = useState('');
  const [guestTasks, setGuestTasks] = useState<Record<string, TaskItem[]>>({});
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
  };
  
  const handleSaveNote = () => {
    if (!noteContent.trim() || !selectedGuestRecord) return;
    
    const newNote: HistoryItem = {
      id: Date.now().toString(),
      content: noteContent,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      author: 'quych@pbsofu.vn'
    };
    
    setGuestHistory(prev => ({
      ...prev,
      [selectedGuestRecord.id]: [newNote, ...(prev[selectedGuestRecord.id] || [])]
    }));
    
    addActivity(selectedGuestRecord.id, 'note', 'Ghi chú nội bộ - Thêm ghi chú', noteContent);
    
    setNoteContent('');
  };

  const handleAddTask = () => {
    if (!taskContent.trim() || !selectedGuestRecord) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      content: taskContent,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      author: 'quych@pbsofu.vn',
      completed: false
    };
    
    setGuestTasks(prev => ({
      ...prev,
      [selectedGuestRecord.id]: [newTask, ...(prev[selectedGuestRecord.id] || [])]
    }));
    
    addActivity(selectedGuestRecord.id, 'task', 'Lời nhắc & Công việc - Thêm lời nhắc', taskContent);
    
    setTaskContent('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedGuestRecord) return;
    
    const task = guestTasks[selectedGuestRecord.id]?.find(t => t.id === taskId);
    if (task) {
      addActivity(
        selectedGuestRecord.id,
        'task',
        task.completed ? 'Lời nhắc & Công việc - Bỏ hoàn thành lời nhắc' : 'Lời nhắc & Công việc - Hoàn thành lời nhắc',
        task.content
      );
    }

    setGuestTasks(prev => ({
      ...prev,
      [selectedGuestRecord.id]: prev[selectedGuestRecord.id].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const handleStartEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditTaskContent(task.content);
  };

  const handleSaveEditTask = () => {
    if (!selectedGuestRecord || !editingTaskId || !editTaskContent.trim()) return;
    
    const oldTask = guestTasks[selectedGuestRecord.id]?.find(t => t.id === editingTaskId);
    if (oldTask && oldTask.content !== editTaskContent) {
      addActivity(selectedGuestRecord.id, 'task', 'Lời nhắc & Công việc - Cập nhật lời nhắc', `Từ: "${oldTask.content}"\nThành: "${editTaskContent}"`);
    }

    setGuestTasks(prev => ({
      ...prev,
      [selectedGuestRecord.id]: prev[selectedGuestRecord.id].map(task => 
        task.id === editingTaskId ? { ...task, content: editTaskContent } : task
      )
    }));
    
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
    source: 'Tất cả'
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

    addActivity(
      bookingModalRecord.id,
      'task',
      'Tạo Lịch hẹn Khách đặt',
      `Đã tạo lịch hẹn cho khách hàng ${bookingModalRecord.fullName} (${bookingPhone})\nThời gian hẹn: ${bookingTimeSlot} - ${bookingDate}\nYêu cầu dịch vụ: ${bookingServiceRequest || 'Chưa nhập'}\nDịch vụ góp ý: ${bookingSuggestedTags.join(', ') || 'Chưa chọn'}\nBiển số xe: ${licensePlateStr || 'Chưa nhập'} | Dòng xe: ${carModelStr || 'Chưa nhập'}`
    );

    setBookingCounts(prev => ({
      ...prev,
      [bookingModalRecord.id]: (prev[bookingModalRecord.id] || 0) + 1
    }));

    const newBookingPayload: Omit<CustomerBookingRecord, 'id' | 'bookingCode'> = {
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
      potentialCustomerId: bookingModalRecord.id,
    };

    if (onCreateCustomerBooking) {
      onCreateCustomerBooking(newBookingPayload);
    } else {
      setCustomerBookings((prev) => {
        const nextNum = String(prev.length + 1).padStart(2, '0');
        return [
          {
            ...newBookingPayload,
            id: `cb-${Date.now()}`,
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
      source: filterSource
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
    setAppliedFilters({
      search: '',
      code: '',
      status: 'Tất cả',
      callStatus: 'Tất cả',
      callResult: 'Tất cả',
      dateFrom: '',
      dateTo: '',
      source: 'Tất cả'
    });
  };

  // Unique events for the dropdown
  const uniqueEvents = Array.from(new Map<string, PotentialCustomerItem>(events.map(item => [item.code, item])).values());
  const filteredDropdownEvents = uniqueEvents.filter(item => 
    item.code.toLowerCase().includes(filterCode.toLowerCase()) || 
    item.name.toLowerCase().includes(filterCode.toLowerCase())
  );

  const filteredData = events.filter((item) => {
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(searchLower);
      const matchPhone = item.phone.toLowerCase().includes(searchLower);
      const matchEmail = item.email.toLowerCase().includes(searchLower);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }
    if (appliedFilters.code && !item.code.toLowerCase().includes(appliedFilters.code.toLowerCase())) return false;
    if (appliedFilters.status !== 'Tất cả' && item.status !== appliedFilters.status) return false;
    if (appliedFilters.callStatus !== 'Tất cả' && item.callStatus !== appliedFilters.callStatus) return false;
    if (appliedFilters.callResult !== 'Tất cả' && item.callResult !== appliedFilters.callResult) return false;
    if (appliedFilters.source !== 'Tất cả' && item.source !== appliedFilters.source) return false;
    
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
    const headers = ['STT', 'Trạng thái cuộc gọi', 'Kết quả cuộc gọi', 'Họ và tên', 'Số điện thoại', 'Email', 'Nhu cầu', 'Ngày tạo', 'Nguồn', 'Mã người dùng (Kênh)', 'Mã chiến dịch', 'Tên chiến dịch', 'Ngày hẹn', 'Khung giờ hẹn', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row, index) => 
        [index + 1, `"${row.callStatus}"`, `"${row.callResult}"`, `"${row.fullName}"`, row.phone, row.email, `"${row.demands.join(', ')}"`, row.registrationDate, `"${row.source}"`, `"${row.channelUserCode}"`, row.code, `"${row.name}"`, row.appointmentDate, `"${row.appointmentTimeSlot}"`, `"${row.status}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'khach_hang_tiem_nang.csv');
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
        <h1 className="text-xl font-bold text-gray-800">Khách hàng quan tâm</h1>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 flex items-center gap-2 bg-gray-50 border-b border-gray-200">
        <button 
          disabled
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
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
        <button 
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          <Settings className="w-4 h-4" /> Thiết lập Chiến dịch
        </button>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 flex flex-col gap-4 border-b border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px] max-w-[300px]">
            <input 
              type="text" 
              placeholder="Tìm kiếm Họ tên, SĐT, Email..." 
              value={filterSearch}
              onChange={(e) => {
                setFilterSearch(e.target.value);
                setAppliedFilters(prev => ({ ...prev, search: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
            />
          </div>
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
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
              <option value="Chờ xóa">Chờ xóa</option>
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
                <th className="px-4 py-3 border-b border-gray-200 text-center">Trùng Khách hàng</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Hành động</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái cuộc gọi</th>
                <th className="px-4 py-3 border-b border-gray-200">Kết quả cuộc gọi</th>
                <th className="px-4 py-3 border-b border-gray-200">Họ và tên</th>
                <th className="px-4 py-3 border-b border-gray-200">Số điện thoại</th>
                <th className="px-4 py-3 border-b border-gray-200">Email</th>
                <th className="px-4 py-3 border-b border-gray-200">Nhu cầu</th>
                <th className="px-4 py-3 border-b border-gray-200">Ngày tạo</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Nguồn</th>
                <th className="px-4 py-3 border-b border-gray-200">Mã người dùng (Kênh)</th>
                <th className="px-4 py-3 border-b border-gray-200">Mã chiến dịch</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên chiến dịch</th>
                <th className="px-4 py-3 border-b border-gray-200">Ngày hẹn</th>
                <th className="px-4 py-3 border-b border-gray-200">Khung giờ hẹn</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, index) => {
                const dupInfo = getDuplicateInfo(row);
                return (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setSelectedRecord(row)}>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
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
                      <button 
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors" 
                        title="Thông tin Khách hàng tiềm năng"
                        onClick={() => {
                          setSelectedGuestRecord(row);
                          setActiveTab('activity_history');
                          setGuestProfileModalOpen(true);
                        }}
                      >
                        <User className="w-4 h-4" />
                      </button>
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
                  <td className="px-4 py-3 text-gray-800">{row.fullName}</td>
                  <td className="px-4 py-3 text-gray-800">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{row.email}</td>
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
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Detail / Statistics */}
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
              {/* Left Column: Customer Info & General Info (No vertical scroll) */}
              <div className="w-[54%] border-r border-gray-200 p-5 flex flex-col justify-between overflow-hidden bg-white">
                <div className="space-y-5 overflow-hidden">
                  {/* Top Identity & Status */}
                  <div className="space-y-3 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{currentGuest.fullName}</h3>
                      <p className="text-xs text-gray-500">
                        Ngày tạo: <span className="font-medium text-gray-700">{currentGuest.registrationDate}</span>
                      </p>
                    </div>

                    {/* Quick Action Buttons + Status on the same single line */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
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
                          currentGuest.status === 'Xe đã đến'
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
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đã hủy">Đã hủy</option>
                        <option value="Chờ xóa">Chờ xóa</option>
                      </select>
                    </div>
                  </div>

                  {/* THÔNG TIN CHUNG (Matched to current Viewlist columns) */}
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
                </div>
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

            {/* Main 2-Column Body */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Left Column: Identical to Guest Profile Modal, buttons hidden & all fields read-only */}
              <div className="w-[54%] border-r border-gray-200 p-5 flex flex-col justify-between overflow-hidden bg-white">
                <div className="space-y-5 overflow-hidden">
                  {/* Top Identity (Read-only, buttons hidden) */}
                  <div className="space-y-3 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-0.5">
                          {currentGuest.fullName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Ngày tạo:{' '}
                          <span className="font-medium text-gray-700">
                            {currentGuest.registrationDate}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                          currentGuest.status === 'Xe đã đến'
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

                  {/* THÔNG TIN CHUNG (Read-only) */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      THÔNG TIN CHUNG
                    </h4>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                      <div
                        className={`p-2.5 rounded-lg border ${
                          guestDupInfo.isPhoneDuplicate
                            ? 'bg-red-50/60 border-red-200'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1 whitespace-nowrap">
                          <span className="text-xs text-gray-500 shrink-0">
                            Số điện thoại
                          </span>
                          {guestDupInfo.isPhoneDuplicate && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[11px] font-semibold whitespace-nowrap shrink-0">
                              <ShieldAlert className="w-3 h-3 shrink-0 text-red-600" />
                              <span className="whitespace-nowrap">
                                Trùng:{' '}
                                {guestDupInfo.matchedCustomers
                                  .filter((m) => m.phoneMatch)
                                  .map((m) => m.customer.customerName)
                                  .join(', ')}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap">
                          <Phone
                            className={`w-3.5 h-3.5 shrink-0 ${
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
                        className={`p-2.5 rounded-lg border ${
                          guestDupInfo.isEmailDuplicate
                            ? 'bg-red-50/60 border-red-200'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1 whitespace-nowrap">
                          <span className="text-xs text-gray-500 shrink-0">
                            Email
                          </span>
                          {guestDupInfo.isEmailDuplicate && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[11px] font-semibold whitespace-nowrap shrink-0">
                              <ShieldAlert className="w-3 h-3 shrink-0 text-red-600" />
                              <span className="whitespace-nowrap">
                                Trùng:{' '}
                                {
                                  guestDupInfo.matchedCustomers.filter(
                                    (m) => m.emailMatch
                                  ).length
                                }{' '}
                                records
                              </span>
                            </span>
                          )}
                        </div>
                        <div
                          className="font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap"
                          title={currentGuest.email}
                        >
                          <Mail
                            className={`w-3.5 h-3.5 shrink-0 ${
                              guestDupInfo.isEmailDuplicate
                                ? 'text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={`whitespace-nowrap ${
                              guestDupInfo.isEmailDuplicate
                                ? 'text-red-700'
                                : ''
                            }`}
                          >
                            {currentGuest.email}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">
                          Trạng thái cuộc gọi
                        </div>
                        <div className="font-semibold text-gray-800">
                          {currentGuest.callStatus}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">
                          Kết quả cuộc gọi
                        </div>
                        <div className="font-semibold text-gray-800">
                          {currentGuest.callResult}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Nguồn
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          {renderSourceIcon(currentGuest.source)}
                          <span>{currentGuest.source}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Mã người dùng (Kênh)
                        </div>
                        <div className="font-mono font-semibold text-gray-800">
                          {currentGuest.channelUserCode}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Mã chiến dịch
                        </div>
                        <div className="font-semibold text-[#1A73E8]">
                          {currentGuest.code}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Tên chiến dịch
                        </div>
                        <div
                          className="font-semibold text-gray-800 truncate"
                          title={currentGuest.name}
                        >
                          {currentGuest.name}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Ngày hẹn
                        </div>
                        <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{currentGuest.appointmentDate}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">
                          Khung giờ hẹn
                        </div>
                        <div className="font-semibold text-gray-800">
                          {currentGuest.appointmentTimeSlot}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">
                          Nhu cầu
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {currentGuest.demands.length === 0 ? (
                            <span className="text-xs text-gray-400">
                              Chưa chọn nhu cầu
                            </span>
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
                </div>
              </div>

              {/* Right Column: Booking Form */}
              <div className="flex-1 flex flex-col min-w-0 bg-gray-50/40 overflow-y-auto p-6">
                <form
                  onSubmit={handleConfirmCreateCustomerBooking}
                  className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-5 max-w-2xl"
                >
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold text-gray-900">
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
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                      {bookingFormError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Ngày hẹn */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Khung giờ hẹn */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                      />
                    </div>
                  </div>

                  {/* Điện thoại */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Nhập số điện thoại..."
                        value={bookingPhone}
                        onChange={(e) => {
                          setBookingPhone(e.target.value);
                          setBookingFormError('');
                        }}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                      />
                    </div>
                  </div>

                  {/* Yêu cầu dịch vụ: dạng text */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Yêu cầu dịch vụ
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Nhập yêu cầu dịch vụ của khách hàng..."
                      value={bookingServiceRequest}
                      onChange={(e) => setBookingServiceRequest(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 resize-y"
                    />
                  </div>

                  {/* Dịch vụ góp ý: dạng tags hiển thị sẵn 1 số cái */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Dịch vụ góp ý
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {DEFAULT_SUGGESTED_SERVICE_TAGS.map((tag) => {
                          const isSelected = bookingSuggestedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleSuggestedTag(tag)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
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

                  <div className="grid grid-cols-2 gap-4 items-start">
                    {/* Left: Biển số xe (không bắt buộc - cho phép chọn nhiều) + Danh sách Xe sử dụng below it */}
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Biển số xe{' '}
                          <span className="font-normal text-gray-400">
                            (không bắt buộc - cho phép chọn nhiều)
                          </span>
                        </label>
                        <div className="min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1.5 pr-8 relative">
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
                            className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent"
                          />
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        {isLicensePlateDropdownOpen && (
                          <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto py-1">
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
                                  className={`px-3.5 py-2 text-sm hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
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
                                  className="px-3.5 py-2 text-xs text-[#1A73E8] bg-blue-50/50 hover:bg-blue-50 cursor-pointer font-medium border-t border-gray-100"
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
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Danh sách Xe sử dụng
                        </label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex flex-wrap gap-2">
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
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
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
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Dòng xe{' '}
                        <span className="font-normal text-gray-400">
                          (không bắt buộc - cho phép chọn nhiều)
                        </span>
                      </label>
                      <div className="min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-lg focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/15 flex flex-wrap items-center gap-1.5 pr-8 relative">
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
                          className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                      {isCarModelDropdownOpen && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto py-1">
                          {filteredCarModels.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-500">
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
                                  className={`px-3.5 py-2 text-sm hover:bg-blue-50/70 cursor-pointer flex items-center justify-between ${
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

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingModalRecord(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Xác nhận Tạo
                    </button>
                  </div>
                </form>
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
              filterPotentialCustomerId={bookingListModalCustomer.id}
              defaultPotentialCustomer={bookingListModalCustomer}
            />
          </div>
        </div>
      )}
    </div>
  );
};
