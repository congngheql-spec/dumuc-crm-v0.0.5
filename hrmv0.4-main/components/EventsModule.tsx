import React, { useState } from 'react';
import { Plus, Trash2, Filter, X, FileSearch, Inbox, Calendar, HelpCircle, ChevronDown, Settings, Download, Mail, User, Paperclip, MessageSquarePlus, Phone, Building2, Wrench, MessageCircle, Hourglass } from 'lucide-react';
import { EventSettings } from './EventSettings';

export interface EventItem {
  id: string;
  code: string;
  name: string;
  fullName: string;
  garageName: string;
  phone: string;
  email: string;
  registrationDate: string;
  status: 'Mới tạo' | 'Hoàn tất';
  address: string;
  link: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
  source: 'Landing Page' | 'Thủ công';
  callStatus: 'Chưa gọi' | 'Đã gọi';
  callResult: 'Rỗng' | 'Đồng ý tham gia' | 'Từ chối' | 'Sai số điện thoại' | 'Không liên hệ được lần 1' | 'Không liên hệ được lần 2' | 'Không liên hệ được lần 3';
  roles?: string[];
  otherRole?: string;
  notes?: string;
}

export interface HistoryItem {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface TaskItem {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'task' | 'email';
  action: string;
  content: string;
  timestamp: string;
  author: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    code: 'EVENT-2024-001',
    name: 'Hội thảo Kỹ thuật Ô tô Toàn quốc 2024',
    fullName: 'Nguyễn Văn An',
    garageName: 'Auto Care Pro Center',
    phone: '0909 123 456',
    email: 'an.nguyen@autocarepro.vn',
    registrationDate: '01/06/2024',
    status: 'Mới tạo',
    address: '123 Đường Số 7, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
    link: 'https://workshop.auto-event.com/registration/detail/2024-001',
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
    roles: ['Chủ Garage', 'Cố vấn Garage', 'Khác'],
    otherRole: 'Nhà cung cấp linh kiện',
    notes: 'Tôi quan tâm đến các giải pháp chuyển đổi số cho Garage quy mô lớn. Mong chương trình có thể chia sẻ thêm về các phần mềm quản lý kho và CRM tích hợp. Tôi cũng muốn hỏi về chính sách ưu đãi cho khách hàng đăng ký sớm.'
  },
  {
    id: '2',
    code: 'EVT002',
    name: 'Tri ân khách hàng',
    fullName: 'Trần Thị B',
    garageName: 'Công ty TNHH B',
    phone: '0987654321',
    email: 'ttb@example.com',
    registrationDate: '10/07/2024',
    status: 'Hoàn tất',
    address: '456 Nguyễn Huệ, Q1, HCM',
    link: 'https://example.com/customer-appreciation',
    startDate: '15/07/2024',
    endDate: '20/07/2024',
    isLocked: true,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '3',
    code: 'EVT003',
    name: 'Giảm giá phụ tùng',
    fullName: 'Lê Văn C',
    garageName: 'Gara C',
    phone: '0912345678',
    email: 'lvc@example.com',
    registrationDate: '25/07/2024',
    status: 'Mới tạo',
    address: '789 Trần Hưng Đạo, Q5, HCM',
    link: 'https://example.com/parts-discount',
    startDate: '01/08/2024',
    endDate: '15/08/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '4',
    code: 'EVT004',
    name: 'Thay lốp đồng giá',
    fullName: 'Phạm Minh D',
    garageName: 'Gara Dũng Lốp',
    phone: '0923456789',
    email: 'pmd@example.com',
    registrationDate: '05/08/2024',
    status: 'Mới tạo',
    address: '12 Nguyễn Văn Linh, Đà Nẵng',
    link: 'https://example.com/thay-lop',
    startDate: '10/08/2024',
    endDate: '20/08/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '5',
    code: 'EVT005',
    name: 'Bảo dưỡng mùa mưa',
    fullName: 'Hoàng Thị E',
    garageName: 'Auto Care E',
    phone: '0934567890',
    email: 'hte@example.com',
    registrationDate: '12/08/2024',
    status: 'Hoàn tất',
    address: '45 Lê Duẩn, Hà Nội',
    link: 'https://example.com/bao-duong-mua-mua',
    startDate: '15/08/2024',
    endDate: '30/08/2024',
    isLocked: true,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '6',
    code: 'EVT006',
    name: 'Tuần lễ dầu nhớt',
    fullName: 'Đặng Văn F',
    garageName: 'Gara F-Service',
    phone: '0945678901',
    email: 'dvf@example.com',
    registrationDate: '20/08/2024',
    status: 'Mới tạo',
    address: '88 Võ Văn Kiệt, HCM',
    link: 'https://example.com/tuan-le-dau-nhot',
    startDate: '01/09/2024',
    endDate: '07/09/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '7',
    code: 'EVT007',
    name: 'Giảm giá ắc quy',
    fullName: 'Bùi Xuân G',
    garageName: 'Bình Minh Auto',
    phone: '0956789012',
    email: 'bxg@example.com',
    registrationDate: '22/08/2024',
    status: 'Mới tạo',
    address: '102 Trần Phú, Hải Phòng',
    link: 'https://example.com/giam-gia-ac-quy',
    startDate: '05/09/2024',
    endDate: '15/09/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '8',
    code: 'EVT008',
    name: 'Khuyến mãi lốp Michelin',
    fullName: 'Ngô Thị H',
    garageName: 'Michelin Center',
    phone: '0967890123',
    email: 'nth@example.com',
    registrationDate: '01/09/2024',
    status: 'Hoàn tất',
    address: '333 Điện Biên Phủ, HCM',
    link: 'https://example.com/michelin-promo',
    startDate: '05/09/2024',
    endDate: '25/09/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '9',
    code: 'EVT009',
    name: 'Chăm sóc nội thất',
    fullName: 'Vũ Đức I',
    garageName: 'I-Detailing',
    phone: '0978901234',
    email: 'vdi@example.com',
    registrationDate: '05/09/2024',
    status: 'Mới tạo',
    address: '55 Láng Hạ, Hà Nội',
    link: 'https://example.com/cham-soc-noi-that',
    startDate: '10/09/2024',
    endDate: '20/09/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '10',
    code: 'EVT010',
    name: 'Đổi cũ lấy mới',
    fullName: 'Đinh Văn K',
    garageName: 'K-Parts',
    phone: '0989012345',
    email: 'dvk@example.com',
    registrationDate: '10/09/2024',
    status: 'Mới tạo',
    address: '77 Tôn Đức Thắng, Đà Nẵng',
    link: 'https://example.com/doi-cu-lay-moi',
    startDate: '15/09/2024',
    endDate: '30/09/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '11',
    code: 'EVT011',
    name: 'Ngày hội xe tải',
    fullName: 'Lý Thị L',
    garageName: 'Gara Tải Nặng',
    phone: '0990123456',
    email: 'ltl@example.com',
    registrationDate: '12/09/2024',
    status: 'Hoàn tất',
    address: '1A QL1A, Bình Chánh, HCM',
    link: 'https://example.com/ngay-hoi-xe-tai',
    startDate: '20/09/2024',
    endDate: '25/09/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '12',
    code: 'EVT012',
    name: 'Ưu đãi phanh xe',
    fullName: 'Châu Văn M',
    garageName: 'M-Brake',
    phone: '0902345678',
    email: 'cvm@example.com',
    registrationDate: '15/09/2024',
    status: 'Mới tạo',
    address: '222 Lý Thường Kiệt, HCM',
    link: 'https://example.com/uu-dai-phanh',
    startDate: '01/10/2024',
    endDate: '15/10/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '13',
    code: 'EVT013',
    name: 'Tri ân đối tác',
    fullName: 'Trương N',
    garageName: 'N-Auto Group',
    phone: '0913456789',
    email: 'tn@example.com',
    registrationDate: '20/09/2024',
    status: 'Mới tạo',
    address: '99 Phạm Văn Đồng, Hà Nội',
    link: 'https://example.com/tri-an-doi-tac',
    startDate: '05/10/2024',
    endDate: '10/10/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '14',
    code: 'EVT001',
    name: 'Khuyến mãi mùa hè',
    fullName: 'Trần Văn Sang',
    garageName: 'Sang Auto',
    phone: '0909111222',
    email: 'sang.auto@example.com',
    registrationDate: '02/06/2024',
    status: 'Hoàn tất',
    address: '12 Nguyễn Trãi, Q5, HCM',
    link: 'https://example.com/summer-sale',
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '15',
    code: 'EVT001',
    name: 'Khuyến mãi mùa hè',
    fullName: 'Lê Thị Hoa',
    garageName: 'Hoa Garage',
    phone: '0988333444',
    email: 'hoa.garage@example.com',
    registrationDate: '05/06/2024',
    status: 'Mới tạo',
    address: '45 Lê Văn Sỹ, Q3, HCM',
    link: 'https://example.com/summer-sale',
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '16',
    code: 'EVT002',
    name: 'Tri ân khách hàng',
    fullName: 'Phạm Minh Tuấn',
    garageName: 'Tuấn Auto Care',
    phone: '0911222333',
    email: 'tuan.auto@example.com',
    registrationDate: '11/07/2024',
    status: 'Mới tạo',
    address: '88 Điện Biên Phủ, Bình Thạnh, HCM',
    link: 'https://example.com/customer-appreciation',
    startDate: '15/07/2024',
    endDate: '20/07/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '17',
    code: 'EVT003',
    name: 'Giảm giá phụ tùng',
    fullName: 'Nguyễn Hải Đăng',
    garageName: 'Đăng Parts',
    phone: '0933444555',
    email: 'dang.parts@example.com',
    registrationDate: '26/07/2024',
    status: 'Hoàn tất',
    address: '150 Trần Hưng Đạo, Q1, HCM',
    link: 'https://example.com/parts-discount',
    startDate: '01/08/2024',
    endDate: '15/08/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '18',
    code: 'EVT004',
    name: 'Thay lốp đồng giá',
    fullName: 'Vũ Đình Kiên',
    garageName: 'Kiên Lốp',
    phone: '0944555666',
    email: 'kien.lop@example.com',
    registrationDate: '06/08/2024',
    status: 'Mới tạo',
    address: '25 Nguyễn Tri Phương, Đà Nẵng',
    link: 'https://example.com/thay-lop',
    startDate: '10/08/2024',
    endDate: '20/08/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '19',
    code: 'EVT004',
    name: 'Thay lốp đồng giá',
    fullName: 'Bùi Thị Lan',
    garageName: 'Lan Auto Tires',
    phone: '0955666777',
    email: 'lan.tires@example.com',
    registrationDate: '08/08/2024',
    status: 'Hoàn tất',
    address: '102 Hải Phòng, Đà Nẵng',
    link: 'https://example.com/thay-lop',
    startDate: '10/08/2024',
    endDate: '20/08/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '20',
    code: 'EVT005',
    name: 'Bảo dưỡng mùa mưa',
    fullName: 'Đỗ Văn Mạnh',
    garageName: 'Mạnh Auto',
    phone: '0966777888',
    email: 'manh.auto@example.com',
    registrationDate: '13/08/2024',
    status: 'Mới tạo',
    address: '50 Giải Phóng, Hà Nội',
    link: 'https://example.com/bao-duong-mua-mua',
    startDate: '15/08/2024',
    endDate: '30/08/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '21',
    code: 'EVT005',
    name: 'Bảo dưỡng mùa mưa',
    fullName: 'Hoàng Quốc Việt',
    garageName: 'Việt Garage',
    phone: '0977888999',
    email: 'viet.garage@example.com',
    registrationDate: '14/08/2024',
    status: 'Hoàn tất',
    address: '120 Lò Đúc, Hà Nội',
    link: 'https://example.com/bao-duong-mua-mua',
    startDate: '15/08/2024',
    endDate: '30/08/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '22',
    code: 'EVT006',
    name: 'Tuần lễ dầu nhớt',
    fullName: 'Ngô Bá Khá',
    garageName: 'Khá Oil',
    phone: '0988999000',
    email: 'kha.oil@example.com',
    registrationDate: '21/08/2024',
    status: 'Mới tạo',
    address: '55 3/2, Q10, HCM',
    link: 'https://example.com/tuan-le-dau-nhot',
    startDate: '01/09/2024',
    endDate: '07/09/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '23',
    code: 'EVT008',
    name: 'Khuyến mãi lốp Michelin',
    fullName: 'Lý Hải',
    garageName: 'Hải Michelin',
    phone: '0999000111',
    email: 'hai.michelin@example.com',
    registrationDate: '02/09/2024',
    status: 'Mới tạo',
    address: '111 Cộng Hòa, Tân Bình, HCM',
    link: 'https://example.com/michelin-promo',
    startDate: '05/09/2024',
    endDate: '25/09/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '24',
    code: 'EVT008',
    name: 'Khuyến mãi lốp Michelin',
    fullName: 'Trần Đăng Khoa',
    garageName: 'Khoa Tires',
    phone: '0900111222',
    email: 'khoa.tires@example.com',
    registrationDate: '03/09/2024',
    status: 'Hoàn tất',
    address: '222 Trường Chinh, Tân Bình, HCM',
    link: 'https://example.com/michelin-promo',
    startDate: '05/09/2024',
    endDate: '25/09/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '25',
    code: 'EVT008',
    name: 'Khuyến mãi lốp Michelin',
    fullName: 'Lê Thanh Bình',
    garageName: 'Bình Auto Care',
    phone: '0911222444',
    email: 'binh.auto@example.com',
    registrationDate: '04/09/2024',
    status: 'Mới tạo',
    address: '333 Âu Cơ, Tân Phú, HCM',
    link: 'https://example.com/michelin-promo',
    startDate: '05/09/2024',
    endDate: '25/09/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '26',
    code: 'EVT010',
    name: 'Đổi cũ lấy mới',
    fullName: 'Phan Văn Trường',
    garageName: 'Trường Parts',
    phone: '0922333555',
    email: 'truong.parts@example.com',
    registrationDate: '11/09/2024',
    status: 'Hoàn tất',
    address: '44 Nguyễn Tất Thành, Đà Nẵng',
    link: 'https://example.com/doi-cu-lay-moi',
    startDate: '15/09/2024',
    endDate: '30/09/2024',
    isLocked: true,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '27',
    code: 'EVT010',
    name: 'Đổi cũ lấy mới',
    fullName: 'Đinh Trọng Thủy',
    garageName: 'Thủy Auto',
    phone: '0933444666',
    email: 'thuy.auto@example.com',
    registrationDate: '12/09/2024',
    status: 'Mới tạo',
    address: '55 Tôn Đức Thắng, Đà Nẵng',
    link: 'https://example.com/doi-cu-lay-moi',
    startDate: '15/09/2024',
    endDate: '30/09/2024',
    isLocked: false,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '28',
    code: 'EVT011',
    name: 'Ngày hội xe tải',
    fullName: 'Vương Đình Huệ',
    garageName: 'Huệ Truck',
    phone: '0944555777',
    email: 'hue.truck@example.com',
    registrationDate: '13/09/2024',
    status: 'Mới tạo',
    address: '2A QL1A, Bình Tân, HCM',
    link: 'https://example.com/ngay-hoi-xe-tai',
    startDate: '20/09/2024',
    endDate: '25/09/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '29',
    code: 'EVT012',
    name: 'Ưu đãi phanh xe',
    fullName: 'Trịnh Xuân Thanh',
    garageName: 'Thanh Brake',
    phone: '0955666888',
    email: 'thanh.brake@example.com',
    registrationDate: '16/09/2024',
    status: 'Hoàn tất',
    address: '66 Lý Thái Tổ, Q10, HCM',
    link: 'https://example.com/uu-dai-phanh',
    startDate: '01/10/2024',
    endDate: '15/10/2024',
    isLocked: true,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '30',
    code: 'EVT012',
    name: 'Ưu đãi phanh xe',
    fullName: 'Mai Văn Phấn',
    garageName: 'Phấn Auto',
    phone: '0966777999',
    email: 'phan.auto@example.com',
    registrationDate: '17/09/2024',
    status: 'Mới tạo',
    address: '77 Hùng Vương, Q5, HCM',
    link: 'https://example.com/uu-dai-phanh',
    startDate: '01/10/2024',
    endDate: '15/10/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '31',
    code: 'EVT013',
    name: 'Tri ân đối tác',
    fullName: 'Hồ Quang Hiếu',
    garageName: 'Hiếu Group',
    phone: '0977888000',
    email: 'hieu.group@example.com',
    registrationDate: '21/09/2024',
    status: 'Mới tạo',
    address: '88 Cầu Giấy, Hà Nội',
    link: 'https://example.com/tri-an-doi-tac',
    startDate: '05/10/2024',
    endDate: '10/10/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '32',
    code: 'EVT013',
    name: 'Tri ân đối tác',
    fullName: 'Tạ Quang Bửu',
    garageName: 'Bửu Auto',
    phone: '0988999111',
    email: 'buu.auto@example.com',
    registrationDate: '22/09/2024',
    status: 'Hoàn tất',
    address: '99 Xuân Thủy, Hà Nội',
    link: 'https://example.com/tri-an-doi-tac',
    startDate: '05/10/2024',
    endDate: '10/10/2024',
    isLocked: true,
    source: 'Landing Page',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  },
  {
    id: '33',
    code: 'EVT013',
    name: 'Tri ân đối tác',
    fullName: 'Chu Văn An',
    garageName: 'An Garage',
    phone: '0999000222',
    email: 'an.garage@example.com',
    registrationDate: '23/09/2024',
    status: 'Mới tạo',
    address: '100 Nguyễn Phong Sắc, Hà Nội',
    link: 'https://example.com/tri-an-doi-tac',
    startDate: '05/10/2024',
    endDate: '10/10/2024',
    isLocked: false,
    source: 'Thủ công',
    callStatus: 'Chưa gọi',
    callResult: 'Rỗng',
  }
];

export const EventsModule: React.FC = () => {
  const [events, setEvents] = useState(MOCK_EVENTS);
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
  const [selectedRecord, setSelectedRecord] = useState<typeof MOCK_EVENTS[0] | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedEmailRecord, setSelectedEmailRecord] = useState<EventItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('Thông tin lịch hẹn tại Gara XYZ');
  const [emailContent, setEmailContent] = useState('');
  const [guestProfileModalOpen, setGuestProfileModalOpen] = useState(false);
  const [selectedGuestRecord, setSelectedGuestRecord] = useState<EventItem | null>(null);
  const [activeTab, setActiveTab] = useState<'activity_history' | 'history' | 'tasks'>('activity_history');
  const [guestHistory, setGuestHistory] = useState<Record<string, HistoryItem[]>>({});
  const [guestActivityHistory, setGuestActivityHistory] = useState<Record<string, ActivityItem[]>>({});
  const [noteContent, setNoteContent] = useState('');
  const [guestTasks, setGuestTasks] = useState<Record<string, TaskItem[]>>({});
  const [taskContent, setTaskContent] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskContent, setEditTaskContent] = useState('');
  
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
    
    addActivity(selectedGuestRecord.id, 'note', 'Thêm ghi chú', noteContent);
    
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
    
    addActivity(selectedGuestRecord.id, 'task', 'Thêm lời nhắc', taskContent);
    
    setTaskContent('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedGuestRecord) return;
    
    const task = guestTasks[selectedGuestRecord.id]?.find(t => t.id === taskId);
    if (task) {
      addActivity(selectedGuestRecord.id, 'task', task.completed ? 'Bỏ hoàn thành lời nhắc' : 'Hoàn thành lời nhắc', task.content);
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
      addActivity(selectedGuestRecord.id, 'task', 'Cập nhật lời nhắc', `Từ: "${oldTask.content}"\nThành: "${editTaskContent}"`);
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

  const handleToggleStatus = (e: React.MouseEvent, id: string, currentStatus: 'Mới tạo' | 'Hoàn tất') => {
    e.stopPropagation();
    const newStatus = currentStatus === 'Mới tạo' ? 'Hoàn tất' : 'Mới tạo';
    setEvents(events.map(evt => evt.id === id ? { ...evt, status: newStatus } : evt));
  };

  const handleCallStatusChange = (id: string, newStatus: EventItem['callStatus']) => {
    setEvents(events.map(evt => evt.id === id ? { ...evt, callStatus: newStatus } : evt));
  };

  const handleCallResultChange = (id: string, newResult: EventItem['callResult']) => {
    setEvents(events.map(evt => evt.id === id ? { ...evt, callResult: newResult } : evt));
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
  const uniqueEvents = Array.from(new Map<string, typeof MOCK_EVENTS[0]>(events.map(item => [item.code, item])).values());
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
    const headers = ['STT', 'Trạng thái cuộc gọi', 'Kết quả cuộc gọi', 'Mã sự kiện', 'Tên sự kiện', 'Họ và tên', 'Tên Garage / Công ty', 'Số điện thoại', 'Email', 'Ngày đăng ký', 'Nguồn', 'Trạng thái Check-in', 'Địa chỉ'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row, index) => 
        [index + 1, `"${row.callStatus}"`, `"${row.callResult}"`, row.code, `"${row.name}"`, `"${row.fullName}"`, `"${row.garageName}"`, row.phone, row.email, row.registrationDate, `"${row.source}"`, `"${row.status}"`, `"${row.address}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'su_kien.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRegistrations = filteredData.length;
  const completedCount = filteredData.filter(item => item.status === 'Hoàn tất').length;
  const newCount = totalRegistrations - completedCount;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Sự kiện</h1>
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
          <Settings className="w-4 h-4" /> Thiết lập sự kiện
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
              placeholder="Mã sự kiện" 
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
              <option value="Landing Page">Landing Page</option>
              <option value="Thủ công">Thủ công</option>
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
              <option value="Tất cả">Trạng thái Check-in</option>
              <option value="Mới tạo">Mới tạo</option>
              <option value="Hoàn tất">Hoàn tất</option>
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
                <th className="px-4 py-3 border-b border-gray-200 text-center">Hành động</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái cuộc gọi</th>
                <th className="px-4 py-3 border-b border-gray-200">Kết quả cuộc gọi</th>
                <th className="px-4 py-3 w-32 border-b border-gray-200 text-xs font-medium text-gray-500">
                  Thao tác Check-in
                </th>
                <th className="px-4 py-3 border-b border-gray-200">Mã sự kiện</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên sự kiện</th>
                <th className="px-4 py-3 border-b border-gray-200">Họ và tên</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên Garage / Công ty</th>
                <th className="px-4 py-3 border-b border-gray-200">Số điện thoại</th>
                <th className="px-4 py-3 border-b border-gray-200">Email</th>
                <th className="px-4 py-3 border-b border-gray-200">Ngày đăng ký</th>
                <th className="px-4 py-3 border-b border-gray-200">Nguồn</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái Check-in</th>
                <th className="px-4 py-3 border-b border-gray-200">Địa chỉ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, index) => (
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
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" 
                        title="Gửi Email"
                        onClick={() => {
                          setSelectedEmailRecord(row);
                          setEmailModalOpen(true);
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors" 
                        title="Hồ sơ khách mời"
                        onClick={() => {
                          setSelectedGuestRecord(row);
                          setActiveTab('activity_history');
                          setGuestProfileModalOpen(true);
                        }}
                      >
                        <User className="w-4 h-4" />
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
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleStatus(e, row.id, row.status)}
                      className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                        row.status === 'Mới tạo' 
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                      title={`Chuyển sang ${row.status === 'Mới tạo' ? 'Hoàn tất' : 'Mới tạo'}`}
                    >
                      {row.status === 'Mới tạo' ? 'Hoàn tất' : 'Mới tạo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1A73E8] hover:underline">{row.code}</td>
                  <td className="px-4 py-3 text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-800">{row.fullName}</td>
                  <td className="px-4 py-3 text-gray-800">{row.garageName}</td>
                  <td className="px-4 py-3 text-gray-800">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{row.email}</td>
                  <td className="px-4 py-3 text-gray-800">{row.registrationDate}</td>
                  <td className="px-4 py-3 text-gray-800">{row.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{row.address}</td>
                </tr>
              ))}
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
          events={events}
          onEventsChange={setEvents}
        />
      )}

      {/* Email Modal */}
      {emailModalOpen && selectedEmailRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Soạn và Gửi Email</h2>
            </div>
            
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <input 
                  type="text" 
                  value={selectedEmailRecord.email}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Tiêu đề email"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                />
              </div>
              <div>
                <textarea 
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Nội dung email..."
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-y"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <button className="flex items-center gap-2 text-[#1A73E8] hover:text-blue-700 font-medium px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Paperclip className="w-4 h-4" />
                <span>Đính kèm tệp</span>
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setEmailModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    // Handle send email logic here
                    addActivity(selectedEmailRecord.id, 'email', 'Gửi Email', `Tiêu đề: ${emailSubject}\nNội dung: ${emailContent}`);
                    setEmailModalOpen(false);
                    setEmailContent('');
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

      {/* Guest Profile Modal */}
      {guestProfileModalOpen && selectedGuestRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Hồ sơ khách mời</h2>
              <button 
                onClick={() => setGuestProfileModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedGuestRecord.fullName}</h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                      {selectedGuestRecord.status === 'Mới tạo' ? 'Mới' : selectedGuestRecord.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Ngày đăng ký: 08:15 {selectedGuestRecord.registrationDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200">
                  <MessageSquarePlus className="w-5 h-5" />
                  Tin nhắn mẫu
                </button>
                <button 
                  onClick={() => {
                    setGuestProfileModalOpen(false);
                    setSelectedEmailRecord(selectedGuestRecord);
                    setEmailModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"
                >
                  <Mail className="w-5 h-5" />
                  Gửi Email
                </button>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">THÔNG TIN CHUNG</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedGuestRecord.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedGuestRecord.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedGuestRecord.garageName}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedGuestRecord.startDate} - {selectedGuestRecord.endDate}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedGuestRecord.name}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500">Kênh đặt lịch:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span>{selectedGuestRecord.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>Ghi chú khách: {selectedGuestRecord.notes || 'Không có ghi chú'}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-4">
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
                      {selectedGuestRecord && guestTasks[selectedGuestRecord.id]?.filter(t => !t.completed).length || 0}
                    </span>
                  </button>
                </div>
              </div>

              {activeTab === 'activity_history' && (
                <div>
                  {(!guestActivityHistory[selectedGuestRecord.id] || guestActivityHistory[selectedGuestRecord.id].length === 0) ? (
                    <div className="text-sm text-gray-500 py-4 text-center">Chưa có dữ liệu lịch sử hoạt động</div>
                  ) : (
                    <div className="space-y-4">
                      {guestActivityHistory[selectedGuestRecord.id].map(item => (
                        <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
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
                  {(!guestHistory[selectedGuestRecord.id] || guestHistory[selectedGuestRecord.id].length === 0) ? (
                    <div className="text-sm text-gray-500 py-4 text-center">Chưa có lịch sử trao đổi</div>
                  ) : (
                    <div className="space-y-4">
                      {guestHistory[selectedGuestRecord.id].map(item => (
                        <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
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

                  {(!guestTasks[selectedGuestRecord.id] || guestTasks[selectedGuestRecord.id].length === 0) ? (
                    <div className="text-sm text-gray-500 py-4 text-center">Chưa có lời nhắc & công việc</div>
                  ) : (
                    <div className="space-y-3">
                      {guestTasks[selectedGuestRecord.id].map(task => (
                        <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}>
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
      )}
    </div>
  );
};
