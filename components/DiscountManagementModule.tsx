import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  X,
  Eye,
  SquarePen,
  AlertTriangle,
  Tag,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Info,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Check,
  Building,
  Car,
  Users,
  ShoppingBag,
  Receipt,
  FileText,
  ExternalLink,
  FileCheck,
  Hash,
  Ticket,
  Copy,
  ClipboardList,
  Pin,
  Phone,
  Share2,
  MoreVertical,
  DollarSign,
  CheckSquare,
  ChevronDown,
  Wrench,
  Rocket,
  Lock,
  Unlock,
  History,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
  Gift,
} from 'lucide-react';
import {
  EXISTING_CUSTOMERS_IN_MODULE,
  ExistingCustomerRecord,
} from './PotentialCustomersModule';
import { CampaignExecutionFullScreenModal } from './CampaignExecutionFullScreenModal';

// Sub-interfaces
export interface CustomerTargetItem {
  id: string;
  customerCode: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  taxCode: string;
}

export interface ProductDiscountItem {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  vat: number; // 8, 10
  priceBeforeVat: number;
  priceAfterVat: number;
  discountPercent: number | string;
  fixedDiscountAmount: number | string;
  newPriceBeforeVat: number;
  newPriceAfterVat: number;
  minBuyQuantity: number | string;
}

export interface VoucherItem {
  id: string;
  code: string;
  targetType: 'new_customer' | 'existing_customer';
  status: 'available' | 'used' | 'expired';
  createdAt: string;
  customerCode?: string;
  customerName?: string;
  address?: string;
  phone?: string;
  email?: string;
  taxCode?: string;
  debt?: number | string;
  hasCarInGarage?: 'Đang có' | 'Không có';
}

export interface ExistingCustomerVoucherRow {
  id: string;
  customerCode: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  taxCode: string;
  debt: number | string;
  hasCarInGarage: 'Đang có' | 'Không có';
}

export interface ContractFileItem {
  id: string;
  docType: string; // Loại giấy tờ
  description: string; // Mô tả
  effectiveDate: string; // Ngày hiệu lực
  expirationDate: string; // Ngày hết hạn
  isValid: boolean; // Còn hiệu lực
  link: string; // Link
  uploadedFile: string; // File tải lên
}

export interface DocumentItem {
  id: string;
  hasContract: boolean; // Có hợp đồng: dạng tick/untick
  documentName: string; // Tên tài liệu
  documentDescription: string; // Mô tả
  supplier: string; // Nhà cung cấp
  contractNumber: string; // Số hợp đồng
  contractDescription: string; // Mô tả
  effectiveDate: string; // Ngày hiệu lực
  expirationDate: string; // Ngày hết hiệu lực
  isValid: boolean; // Còn hiệu lực: dạng tick/untick
  link: string; // Link
  uploadedFile: string; // File tải lên
  details: string; // Hồ sơ chi tiết
  contractFiles?: ContractFileItem[];
}

export type DiscountCategory = 'Chiết khấu' | 'Voucher' | 'Khách cũ giới thiệu Khách mới';

export interface DiscountRecord {
  id: string;
  code: string;
  discountCode?: string; // Mã Chiết khấu khi Loại = 'Chiết khấu'
  name: string;
  category: DiscountCategory;
  type: 'percentage' | 'fixed_amount';
  value: number;
  targetAudience: string;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string; // Ngày hiệu lực
  endDate: string; // Ngày hết hiệu lực
  status: 'active' | 'paused' | 'expired'; // active = 'Mở khóa', paused = 'Khóa'
  statusDisplay?: 'Khóa' | 'Mở khóa';
  stackable?: 'allow' | 'disallow';
  allowStacking?: boolean;
  roCount?: number;
  campaignRunCount?: number;
  description?: string;
  createdAt: string;

  // Khu vực 2: Phạm vi áp dụng
  branchScope: 'all' | 'specific';
  selectedBranches: string[];
  plateColorScope: 'all' | 'specific';
  selectedPlateColors: string[];
  customerScope: 'new_customer' | 'all_with_new' | 'all' | 'all_existing' | 'specific';
  selectedCustomerGroups: string[];
  targetCustomers: CustomerTargetItem[];

  // Khu vực 3: Thiết lập chiết khấu
  maxUsageTotal?: number | string;
  maxUsagePerCustomer?: number | string;
  maxUsagePerPlate?: number | string;
  discountMethod: 'order' | 'product';
  orderDiscountType: 'percentage' | 'fixed_amount';
  orderPercent?: number | string;
  orderMaxDiscountAmount?: number | string;
  orderFixedAmount?: number | string;
  orderMinOrderValue?: number | string;
  productDiscountType: 'percentage' | 'fixed_amount';
  productItems: ProductDiscountItem[];

  // Thiết lập cho Người giới thiệu (Khách hiện hữu) khi Loại = "Khách cũ giới thiệu Khách mới"
  referrerDiscountMethod?: 'order' | 'product';
  referrerOrderDiscountType?: 'percentage' | 'fixed_amount';
  referrerOrderPercent?: number | string;
  referrerOrderMaxDiscountAmount?: number | string;
  referrerOrderFixedAmount?: number | string;
  referrerOrderMinOrderValue?: number | string;
  referrerProductDiscountType?: 'percentage' | 'fixed_amount';
  referrerProductItems?: ProductDiscountItem[];

  // Gửi Mã quà tặng cho người giới thiệu khi Loại = "Khách cũ giới thiệu Khách mới"
  sendReferrerGiftCode?: boolean;
  referrerCodePrefix?: string;
  referrerCodeSuffixType?: 'STT tăng dần' | 'Số điện thoại' | 'Email';
  referrerValidityDays?: number | string;
  referrerSendChannels?: string[];

  // Khu vực: Tài liệu
  documents?: DocumentItem[];

  // Quản lý Voucher
  vouchersList?: VoucherItem[];
  referralCodeMethod?: 'phone' | 'email' | 'customer_code';
}

const BRANCH_OPTIONS = [
  'Chi nhánh Quận 7 (TP.HCM)',
  'Chi nhánh Tân Bình (TP.HCM)',
  'Chi nhánh TP. Thủ Đức (TP.HCM)',
  'Chi nhánh Bình Thạnh (TP.HCM)',
  'Chi nhánh Thuận An (Bình Dương)',
];

const PLATE_COLOR_OPTIONS = ['Trắng', 'Vàng', 'Xanh'] as const;

const CUSTOMER_GROUP_OPTIONS = [
  'Khách hàng VIP / Đại lý',
  'Khách hàng Thân thiết',
  'Khách hàng Doanh nghiệp',
  'Khách hàng Thường',
];

const SAMPLE_GARAGE_CATALOG: Omit<ProductDiscountItem, 'id' | 'discountPercent' | 'fixedDiscountAmount' | 'newPriceBeforeVat' | 'newPriceAfterVat' | 'minBuyQuantity'>[] = [
  { itemCode: 'NHOT003', itemName: 'Nhớt Mobil 20W-50', unit: 'Lít', vat: 10, priceBeforeVat: 170000, priceAfterVat: 187000 },
  { itemCode: 'NUOCLM004', itemName: 'Nước làm mát LLC 20% 4L Red JCAP', unit: 'Bình', vat: 10, priceBeforeVat: 110000, priceAfterVat: 121000 },
  { itemCode: 'LOCNHOT', itemName: 'Lọc nhớt chính hãng', unit: 'Cái', vat: 8, priceBeforeVat: 150000, priceAfterVat: 162000 },
  { itemCode: 'LOCGIO', itemName: 'Lọc gió động cơ Denso', unit: 'Cái', vat: 8, priceBeforeVat: 220000, priceAfterVat: 237600 },
  { itemCode: 'BUGI_NGK', itemName: 'Bugi Iridium NGK Laser', unit: 'Bộ', vat: 8, priceBeforeVat: 480000, priceAfterVat: 518400 },
  { itemCode: 'BAT_GS', itemName: 'Bình ắc quy GS 12V - 60Ah', unit: 'Bình', vat: 10, priceBeforeVat: 1450000, priceAfterVat: 1595000 },
  { itemCode: 'MAPHANH_TRUOC', itemName: 'Bộ má phanh trước Brembo', unit: 'Bộ', vat: 8, priceBeforeVat: 850000, priceAfterVat: 918000 },
  { itemCode: 'DV_NHANCONG', itemName: 'Công thợ bảo dưỡng định kỳ', unit: 'Công', vat: 10, priceBeforeVat: 200000, priceAfterVat: 220000 },
];

export interface SalesContractRecord {
  id: string;
  supplierCode: string;
  supplierName: string;
  contractNumber: string;
  contractTitle: string;
  contractDescription: string;
  effectiveDate: string;
  expirationDate: string;
  isValid: boolean;
  link: string;
  uploadedFile: string;
  documentName: string;
  contractValue: string;
  signerName: string;
  signingDate: string;
  scopeNotes: string;
}

export const SALES_CONTRACT_CATALOG: SalesContractRecord[] = [
  {
    id: 'sc-01',
    supplierCode: 'NCC01',
    supplierName: 'Công ty Phụ tùng A',
    contractNumber: 'HĐ-2025/PTA-01',
    contractTitle: 'Hợp đồng phân phối phụ tùng ô tô & dầu nhờn',
    contractDescription: 'Hợp đồng nguyên tắc cung ứng phụ tùng ô tô & dầu mỡ nhờn năm 2025',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-PTA-01',
    uploadedFile: 'HD_2025_PTA_01_NguyenTac.pdf',
    documentName: 'Hợp đồng nguyên tắc cung ứng phụ tùng A',
    contractValue: '850.000.000 VNĐ',
    signerName: 'Nguyễn Văn Tuấn (Giám đốc Bán hàng)',
    signingDate: '2024-12-28',
    scopeNotes: 'Chiết khấu quý 8% theo đơn hàng thực tế, thanh toán gối đầu 30 ngày.',
  },
  {
    id: 'sc-02',
    supplierCode: 'NCC01',
    supplierName: 'Công ty Phụ tùng A',
    contractNumber: 'HĐ-2024/PTA-09',
    contractTitle: 'Phụ lục hợp đồng vật tư phụ tùng gầm máy',
    contractDescription: 'Phụ lục hợp đồng gia hạn cung cấp vật tư phụ tùng gầm máy',
    effectiveDate: '2024-06-01',
    expirationDate: '2025-05-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2024-PTA-09',
    uploadedFile: 'PhuLuc_HD2024_PTA_09.pdf',
    documentName: 'Phụ lục hợp đồng vật tư gầm máy PTA',
    contractValue: '320.000.000 VNĐ',
    signerName: 'Trần Minh Đức (Trưởng phòng Cung ứng)',
    signingDate: '2024-05-25',
    scopeNotes: 'Chiết khấu 5% trực tiếp khi mua số lượng từ 50 bộ phụ tùng gầm trở lên.',
  },
  {
    id: 'sc-03',
    supplierCode: 'NCC02',
    supplierName: 'Đại lý Michelin Việt Nam',
    contractNumber: 'HĐ-2025/MCH-02',
    contractTitle: 'Hợp đồng phân phối lốp Michelin & dịch vụ mâm lốp',
    contractDescription: 'Hợp đồng phân phối độc quyền lốp Michelin & dịch vụ cân mâm bấm chì 2025',
    effectiveDate: '2025-01-15',
    expirationDate: '2025-12-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-MCH-02',
    uploadedFile: 'HD_2025_Michelin_PhanPhoi.pdf',
    documentName: 'Hợp đồng phân phối lốp xe Michelin 2025',
    contractValue: '1.200.000.000 VNĐ',
    signerName: 'Michelin VN - Bùi Hữu Nghĩa',
    signingDate: '2025-01-10',
    scopeNotes: 'Ưu đãi đại lý ủy quyền Michelin cấp 1, hỗ trợ công nghệ cân mâm Hunter.',
  },
  {
    id: 'sc-04',
    supplierCode: 'NCC02',
    supplierName: 'Đại lý Michelin Việt Nam',
    contractNumber: 'HĐ-2024/MCH-01',
    contractTitle: 'Hợp đồng thương mại lốp xe du lịch 2024',
    contractDescription: 'Hợp đồng thương mại cung cấp lốp xe du lịch và xe tải nhẹ',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    isValid: false,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2024-MCH-01',
    uploadedFile: 'HD_2024_Michelin_ThuongMai.pdf',
    documentName: 'Hợp đồng thương mại Michelin 2024 (Đã thanh lý)',
    contractValue: '950.000.000 VNĐ',
    signerName: 'Michelin VN - Bùi Hữu Nghĩa',
    signingDate: '2023-12-25',
    scopeNotes: 'Hợp đồng đã kết thúc kỳ hạn vào 31/12/2024, đã hoàn tất quyết toán.',
  },
  {
    id: 'sc-05',
    supplierCode: 'NCC03',
    supplierName: 'Phụ tùng Bosch Việt Nam',
    contractNumber: 'HĐ-2025/BSH-08',
    contractTitle: 'Hợp đồng phân phối thiết bị & linh kiện điện Bosch',
    contractDescription: 'Hợp đồng cung cấp gạt mưa, còi xe, ắc quy và linh kiện điện tử Bosch 2025',
    effectiveDate: '2025-02-01',
    expirationDate: '2026-01-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-BSH-08',
    uploadedFile: 'HD_2025_Bosch_LinhKienDienTu.pdf',
    documentName: 'Hợp đồng phân phối thiết bị Bosch 2025',
    contractValue: '640.000.000 VNĐ',
    signerName: 'Bosch VN - Lê Quốc Toàn',
    signingDate: '2025-01-20',
    scopeNotes: 'Áp dụng chiết khấu thương mại 10% cho các gói bảo dưỡng sử dụng linh kiện Bosch.',
  },
  {
    id: 'sc-06',
    supplierCode: 'NCC04',
    supplierName: 'Tổng kho Dầu nhớt Castrol & Shell',
    contractNumber: 'HĐ-2025/CS-11',
    contractTitle: 'Hợp đồng cung ứng dầu nhớt Castrol & Shell Helix',
    contractDescription: 'Hợp đồng cung ứng dầu động cơ Castrol Magnatec & Shell Helix 2025',
    effectiveDate: '2025-03-01',
    expirationDate: '2026-02-28',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-CS-11',
    uploadedFile: 'HD_2025_Castrol_Shell_HopDong.pdf',
    documentName: 'Hợp đồng dầu nhớt Castrol & Shell 2025',
    contractValue: '1.500.000.000 VNĐ',
    signerName: 'Võ Thanh Tùng (Giám đốc Phân phối)',
    signingDate: '2025-02-25',
    scopeNotes: 'Tài trợ máy hút nhớt thải và chiết khấu bậc thang theo sản lượng phuy/tháng.',
  },
  {
    id: 'sc-07',
    supplierCode: 'NCC05',
    supplierName: 'Công ty Ắc quy GS Việt Nam',
    contractNumber: 'HĐ-2025/GS-05',
    contractTitle: 'Hợp đồng đại lý ắc quy GS ô tô',
    contractDescription: 'Hợp đồng mua bán ắc quy GS miễn bảo dưỡng (MF) dành cho xe con',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-GS-05',
    uploadedFile: 'HD_2025_AcQuyGS_BanHang.pdf',
    documentName: 'Hợp đồng đại lý ắc quy GS 2025',
    contractValue: '480.000.000 VNĐ',
    signerName: 'GS Battery - Đặng Hoàng Nam',
    signingDate: '2024-12-30',
    scopeNotes: 'Chính sách chiết khấu 12% theo doanh số tháng, cam kết đổi trả 1-1 cho bình lỗi.',
  },
  {
    id: 'sc-08',
    supplierCode: 'NCC06',
    supplierName: 'Công ty Lốp xe Bridgestone',
    contractNumber: 'HĐ-2025/BRG-03',
    contractTitle: 'Hợp đồng cung cấp lốp Bridgestone Turanza & Ecopia',
    contractDescription: 'Hợp đồng cung cấp lốp xe Bridgestone Turanza & Ecopia 2025',
    effectiveDate: '2025-01-10',
    expirationDate: '2025-12-31',
    isValid: true,
    link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-BRG-03',
    uploadedFile: 'HD_2025_Bridgestone_CungCapLop.pdf',
    documentName: 'Hợp đồng lốp xe Bridgestone 2025',
    contractValue: '1.100.000.000 VNĐ',
    signerName: 'Bridgestone VN - Chu Văn Kiên',
    signingDate: '2025-01-05',
    scopeNotes: 'Chiết khấu bán buôn 7% và thưởng quý 3% khi vượt chỉ tiêu doanh số.',
  },
];

export interface RepairOrderRecord {
  id: string;
  plateNumber: string;
  roNumber: string;
  carInfo: string;
  carSubInfo?: string;
  customerName: string;
  hasInsurance?: boolean;
  customerPhone?: string;
  advisor: string;
  receivedDate: string;
  receivedKm?: string;
  estDeliveryDate: string;
  actualDeliveryDate: string;
  stage: 'Tiếp nhận' | 'Lệnh sửa c...' | 'Quyết toán' | 'Nghiệm thu';
  status: 'Mới' | 'Đang sửa' | 'Đã bàn giao' | 'Huỷ';
}

export const SAMPLE_REPAIR_ORDERS: RepairOrderRecord[] = [
  {
    id: 'ro-1',
    plateNumber: '51A57567',
    roNumber: '2610-000040',
    carInfo: 'Volvo S90',
    carSubInfo: 'đỏ • 2015',
    customerName: '29H 12719 - Anh Phong - Mitsubishi Triton',
    hasInsurance: true,
    customerPhone: '0973088989',
    advisor: 'Minh Thắng',
    receivedDate: '16/10/2026 09:57',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-2',
    plateNumber: '12I026102',
    roNumber: '2610-000039',
    carInfo: 'Ford',
    customerName: 'Truong Test2',
    customerPhone: '0901234567',
    advisor: '—',
    receivedDate: '14/10/2026 16:11',
    estDeliveryDate: '14/10/2026 16:11',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-3',
    plateNumber: '12I026102',
    roNumber: '2610-000037',
    carInfo: 'Ford',
    customerName: 'Truong Test2',
    customerPhone: '0901234567',
    advisor: '—',
    receivedDate: '14/10/2026 14:04',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Quyết toán',
    status: 'Đang sửa',
  },
  {
    id: 'ro-4',
    plateNumber: 'CHƯA BIẾN SỐ',
    roNumber: '2610-000036',
    carInfo: 'Thông tin xe chưa cập nhật',
    customerName: 'Khách Hàng',
    advisor: '—',
    receivedDate: '14/10/2026 13:40',
    estDeliveryDate: '',
    actualDeliveryDate: '14/10/2026 14:04',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-5',
    plateNumber: '033685',
    roNumber: '2610-000038',
    carInfo: 'Lexus Lx570',
    customerName: 'Truong T',
    hasInsurance: true,
    advisor: '—',
    receivedDate: '14/10/2026 13:21',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-6',
    plateNumber: '033685',
    roNumber: '2610-000035',
    carInfo: 'Lexus Lx570',
    customerName: 'Truong T',
    advisor: '—',
    receivedDate: '13/10/2026 15:52',
    estDeliveryDate: '13/10/2026 15:52',
    actualDeliveryDate: '',
    stage: 'Quyết toán',
    status: 'Đang sửa',
  },
  {
    id: 'ro-7',
    plateNumber: '033685',
    roNumber: '2610-000034',
    carInfo: 'Lexus Lx570',
    customerName: 'Truong T',
    advisor: '—',
    receivedDate: '13/10/2026 10:09',
    estDeliveryDate: '13/10/2026 10:09',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-8',
    plateNumber: '11111',
    roNumber: '2610-000033',
    carInfo: 'Toyota',
    customerName: '29A 13919 - Anh Tam - Audi Q7',
    customerPhone: '0776703978',
    advisor: '—',
    receivedDate: '13/10/2026 09:23',
    estDeliveryDate: '13/10/2026 09:23',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-9',
    plateNumber: '12I026113',
    roNumber: '2610-000032',
    carInfo: 'Vinfast',
    customerName: 'Truong',
    advisor: '—',
    receivedDate: '12/10/2026 11:58',
    estDeliveryDate: '12/10/2026 11:58',
    actualDeliveryDate: '',
    stage: 'Quyết toán',
    status: 'Đang sửa',
  },
  {
    id: 'ro-10',
    plateNumber: '66A99999',
    roNumber: '2610-000031',
    carInfo: 'Mercedes Maybach',
    carSubInfo: 'Đen • 2020',
    customerName: 'anh Thắng',
    customerPhone: '0358500775',
    advisor: 'Minh Thắng',
    receivedDate: '12/10/2026 11:31',
    receivedKm: '157,486 km',
    estDeliveryDate: '',
    actualDeliveryDate: '12/10/2026 11:59',
    stage: 'Nghiệm thu',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-11',
    plateNumber: '51F56686',
    roNumber: '2610-000030',
    carInfo: 'Mercedes S500L',
    customerName: 'Trương Văn Cường',
    advisor: 'Minh Thắng',
    receivedDate: '10/10/2026 15:07',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-12',
    plateNumber: '66A99999',
    roNumber: '2610-000029',
    carInfo: 'Mercedes Maybach',
    carSubInfo: 'Đen • 2020',
    customerName: 'anh Thắng',
    customerPhone: '0358500775',
    advisor: 'Minh Thắng',
    receivedDate: '10/10/2026 15:07',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-13',
    plateNumber: '12A1234',
    roNumber: '2610-000020',
    carInfo: 'BMW 520',
    carSubInfo: 'đỏ • 2020',
    customerName: 'a tuan',
    customerPhone: '0936631213',
    advisor: '—',
    receivedDate: '08/10/2026 20:37',
    estDeliveryDate: '08/10/2026 20:37',
    actualDeliveryDate: '12/10/2026 11:35',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-14',
    plateNumber: '11SU1405',
    roNumber: '2610-000019',
    carInfo: 'Lexus',
    customerName: 'Tuấn',
    advisor: '—',
    receivedDate: '08/10/2026 11:23',
    estDeliveryDate: '08/10/2026 11:23',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-15',
    plateNumber: '190B26094',
    roNumber: '2610-000015',
    carInfo: 'Volkswagen Tigion',
    carSubInfo: 'red • 2022',
    customerName: 'Trường',
    customerPhone: '097737938',
    advisor: 'Minh Thắng',
    receivedDate: '07/10/2026 16:18',
    estDeliveryDate: '09/10/2026 07:35',
    actualDeliveryDate: '12/10/2026 11:35',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-16',
    plateNumber: '51A 71068',
    roNumber: '2610-000014',
    carInfo: 'Ford Focus',
    carSubInfo: 'đen • 2019',
    customerName: 'Trung Tín auto',
    customerPhone: '0914449225',
    advisor: '—',
    receivedDate: '07/10/2026 15:14',
    receivedKm: '33,545 km',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-17',
    plateNumber: '51G 88921',
    roNumber: '2610-000012',
    carInfo: 'Toyota Camry',
    carSubInfo: 'trắng • 2021',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0903112233',
    advisor: 'Minh Thắng',
    receivedDate: '06/10/2026 14:20',
    estDeliveryDate: '06/10/2026 17:00',
    actualDeliveryDate: '06/10/2026 17:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-18',
    plateNumber: '60A 54321',
    roNumber: '2610-000010',
    carInfo: 'Mazda CX-5',
    carSubInfo: 'đỏ • 2023',
    customerName: 'Lê Thị Bích',
    hasInsurance: true,
    customerPhone: '0918776655',
    advisor: '—',
    receivedDate: '05/10/2026 10:15',
    estDeliveryDate: '05/10/2026 16:30',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-19',
    plateNumber: '72A 99887',
    roNumber: '2610-000008',
    carInfo: 'Hyundai SantaFe',
    carSubInfo: 'đen • 2022',
    customerName: 'Phạm Quốc Bảo',
    customerPhone: '0982334455',
    advisor: 'Minh Thắng',
    receivedDate: '04/10/2026 08:45',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-20',
    plateNumber: '51H 12345',
    roNumber: '2610-000005',
    carInfo: 'Kia Carnival',
    carSubInfo: 'trắng • 2024',
    customerName: 'Công ty CP Vận tải Nam Việt',
    customerPhone: '0909887766',
    advisor: 'Minh Thắng',
    receivedDate: '03/10/2026 09:30',
    estDeliveryDate: '04/10/2026 12:00',
    actualDeliveryDate: '04/10/2026 11:45',
    stage: 'Nghiệm thu',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-21',
    plateNumber: '51F 98765',
    roNumber: '2610-000004',
    carInfo: 'Honda CR-V',
    carSubInfo: 'bạc • 2022',
    customerName: 'Trần Văn Hoàng',
    customerPhone: '0912554433',
    advisor: 'Minh Thắng',
    receivedDate: '02/10/2026 14:10',
    estDeliveryDate: '02/10/2026 17:30',
    actualDeliveryDate: '02/10/2026 17:10',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-22',
    plateNumber: '30E 45678',
    roNumber: '2610-000003',
    carInfo: 'Ford Ranger',
    carSubInfo: 'cam • 2021',
    customerName: 'Nguyễn Tiến Dũng',
    hasInsurance: true,
    customerPhone: '0983112244',
    advisor: '—',
    receivedDate: '02/10/2026 10:00',
    estDeliveryDate: '03/10/2026 15:00',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-23',
    plateNumber: '51K 33455',
    roNumber: '2610-000002',
    carInfo: 'Mitsubishi Xpander',
    carSubInfo: 'nâu • 2023',
    customerName: 'Lý Quốc Cường',
    customerPhone: '0978998877',
    advisor: 'Minh Thắng',
    receivedDate: '01/10/2026 08:30',
    estDeliveryDate: '01/10/2026 11:30',
    actualDeliveryDate: '01/10/2026 11:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-24',
    plateNumber: '61A 77890',
    roNumber: '2610-000001',
    carInfo: 'Toyota Vios',
    carSubInfo: 'trắng • 2020',
    customerName: 'Võ Minh Tâm',
    customerPhone: '0934112233',
    advisor: '—',
    receivedDate: '01/10/2026 08:15',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-25',
    plateNumber: '51D 66554',
    roNumber: '2609-000050',
    carInfo: 'Kia Seltos',
    carSubInfo: 'vàng • 2023',
    customerName: 'Đặng Thanh Hà',
    customerPhone: '0908332211',
    advisor: 'Minh Thắng',
    receivedDate: '30/09/2026 15:45',
    estDeliveryDate: '30/09/2026 18:00',
    actualDeliveryDate: '30/09/2026 18:10',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-26',
    plateNumber: '51G 11223',
    roNumber: '2609-000049',
    carInfo: 'Mazda 3',
    customerName: 'Bùi Anh Tuấn',
    advisor: '—',
    receivedDate: '30/09/2026 11:00',
    estDeliveryDate: '30/09/2026 16:00',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-27',
    plateNumber: '50H 99881',
    roNumber: '2609-000048',
    carInfo: 'Hyundai Tucson',
    customerName: 'Hoàng Long',
    hasInsurance: true,
    advisor: 'Minh Thắng',
    receivedDate: '29/09/2026 14:00',
    estDeliveryDate: '30/09/2026 10:00',
    actualDeliveryDate: '30/09/2026 10:20',
    stage: 'Nghiệm thu',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-28',
    plateNumber: '60C 44556',
    roNumber: '2609-000047',
    carInfo: 'Isuzu D-Max',
    customerName: 'Nguyễn Hữu Trí',
    customerPhone: '0913445566',
    advisor: '—',
    receivedDate: '29/09/2026 09:30',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-29',
    plateNumber: '51A 12398',
    roNumber: '2609-000046',
    carInfo: 'Mercedes C200',
    customerName: 'Lê Quốc Hưng',
    advisor: 'Minh Thắng',
    receivedDate: '28/09/2026 16:20',
    estDeliveryDate: '29/09/2026 11:00',
    actualDeliveryDate: '29/09/2026 11:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-30',
    plateNumber: '51F 33211',
    roNumber: '2609-000045',
    carInfo: 'Toyota Fortuner',
    customerName: 'Công ty Du lịch Á Châu',
    customerPhone: '0903778899',
    advisor: 'Minh Thắng',
    receivedDate: '28/09/2026 10:15',
    estDeliveryDate: '28/09/2026 16:30',
    actualDeliveryDate: '28/09/2026 16:40',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-31',
    plateNumber: '70A 11559',
    roNumber: '2609-000044',
    carInfo: 'Honda City',
    customerName: 'Phan Văn Đức',
    advisor: '—',
    receivedDate: '27/09/2026 13:40',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-32',
    plateNumber: '51B 88765',
    roNumber: '2609-000043',
    carInfo: 'Ford Transit',
    customerName: 'Vận tải Sài Gòn Mới',
    customerPhone: '0918223344',
    advisor: 'Minh Thắng',
    receivedDate: '27/09/2026 08:50',
    estDeliveryDate: '27/09/2026 17:00',
    actualDeliveryDate: '27/09/2026 17:30',
    stage: 'Nghiệm thu',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-33',
    plateNumber: '51G 55432',
    roNumber: '2609-000042',
    carInfo: 'Kia Morning',
    customerName: 'Trịnh Thị Mai',
    advisor: '—',
    receivedDate: '26/09/2026 14:10',
    estDeliveryDate: '26/09/2026 16:00',
    actualDeliveryDate: '26/09/2026 16:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-34',
    plateNumber: '61C 99812',
    roNumber: '2609-000041',
    carInfo: 'Hyundai Accent',
    customerName: 'Dương Đình Nghệ',
    advisor: 'Minh Thắng',
    receivedDate: '26/09/2026 10:30',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-35',
    plateNumber: '51H 44112',
    roNumber: '2609-000040',
    carInfo: 'BMW X5',
    customerName: 'Trần Đại Nghĩa',
    hasInsurance: true,
    customerPhone: '0909556677',
    advisor: 'Minh Thắng',
    receivedDate: '25/09/2026 15:00',
    estDeliveryDate: '26/09/2026 12:00',
    actualDeliveryDate: '26/09/2026 12:30',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-36',
    plateNumber: '51A 90909',
    roNumber: '2609-000039',
    carInfo: 'Audi A6',
    customerName: 'Vũ Trọng Phụng',
    advisor: '—',
    receivedDate: '25/09/2026 09:15',
    estDeliveryDate: '25/09/2026 15:30',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-37',
    plateNumber: '60A 12389',
    roNumber: '2609-000038',
    carInfo: 'Mazda 6',
    customerName: 'Chu Văn An',
    advisor: 'Minh Thắng',
    receivedDate: '24/09/2026 16:00',
    estDeliveryDate: '25/09/2026 10:00',
    actualDeliveryDate: '25/09/2026 10:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-38',
    plateNumber: '72E 66789',
    roNumber: '2609-000037',
    carInfo: 'Toyota Corolla Cross',
    customerName: 'Hồ Xuân Hương',
    customerPhone: '0977221100',
    advisor: '—',
    receivedDate: '24/09/2026 11:20',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-39',
    plateNumber: '51K 88123',
    roNumber: '2609-000036',
    carInfo: 'Vinfast VF8',
    customerName: 'Đoàn Thị Điểm',
    advisor: 'Minh Thắng',
    receivedDate: '23/09/2026 14:40',
    estDeliveryDate: '23/09/2026 17:30',
    actualDeliveryDate: '23/09/2026 17:25',
    stage: 'Nghiệm thu',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-40',
    plateNumber: '51F 77654',
    roNumber: '2609-000035',
    carInfo: 'Ford Everest',
    customerName: 'Cao Bá Quát',
    customerPhone: '0918334455',
    advisor: 'Minh Thắng',
    receivedDate: '23/09/2026 09:00',
    estDeliveryDate: '24/09/2026 11:00',
    actualDeliveryDate: '24/09/2026 11:30',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-41',
    plateNumber: '50A 55678',
    roNumber: '2609-000034',
    carInfo: 'Lexus RX350',
    customerName: 'Nguyễn Trãi',
    advisor: '—',
    receivedDate: '22/09/2026 15:10',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Mới',
  },
  {
    id: 'ro-42',
    plateNumber: '51G 44332',
    roNumber: '2609-000033',
    carInfo: 'Mercedes GLC300',
    customerName: 'Trần Hưng Đạo',
    hasInsurance: true,
    customerPhone: '0903889911',
    advisor: 'Minh Thắng',
    receivedDate: '22/09/2026 10:20',
    estDeliveryDate: '23/09/2026 15:00',
    actualDeliveryDate: '',
    stage: 'Lệnh sửa c...',
    status: 'Đang sửa',
  },
  {
    id: 'ro-43',
    plateNumber: '61A 33221',
    roNumber: '2609-000032',
    carInfo: 'Kia K5',
    customerName: 'Lê Lợi',
    advisor: '—',
    receivedDate: '21/09/2026 13:50',
    estDeliveryDate: '21/09/2026 17:00',
    actualDeliveryDate: '21/09/2026 17:15',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
  {
    id: 'ro-44',
    plateNumber: '51H 66778',
    roNumber: '2609-000031',
    carInfo: 'Hyundai Creta',
    customerName: 'Quang Trung',
    advisor: 'Minh Thắng',
    receivedDate: '21/09/2026 08:40',
    estDeliveryDate: '',
    actualDeliveryDate: '',
    stage: 'Tiếp nhận',
    status: 'Huỷ',
  },
  {
    id: 'ro-45',
    plateNumber: '51K 99001',
    roNumber: '2609-000030',
    carInfo: 'Toyota Raize',
    customerName: 'Đinh Bộ Lĩnh',
    customerPhone: '0977112233',
    advisor: 'Minh Thắng',
    receivedDate: '20/09/2026 14:00',
    estDeliveryDate: '20/09/2026 16:30',
    actualDeliveryDate: '20/09/2026 16:45',
    stage: 'Quyết toán',
    status: 'Đã bàn giao',
  },
];

export const getUsageLimitExplanation = (
  totalVal?: string | number,
  perCustomerVal?: string | number,
  perPlateVal?: string | number,
  customerScope?: 'new_customer' | 'all_with_new' | 'all' | 'all_existing' | 'specific',
  selectedGroups?: string[],
  targetCustomerCount?: number
): string => {
  // 1. Diễn giải đối tượng áp dụng đã chọn (dấu click)
  let audienceText = '';
  switch (customerScope) {
    case 'new_customer':
      audienceText = 'Chương trình chỉ áp dụng dành riêng cho Khách hàng mới (chưa có hồ sơ trong hệ thống)';
      break;
    case 'all':
    case 'all_existing':
      audienceText = 'Chương trình chỉ áp dụng dành riêng cho Khách hàng hiện hữu (đã có hồ sơ trong hệ thống)';
      break;
    case 'specific':
      if (targetCustomerCount && targetCustomerCount > 0) {
        audienceText = `Chương trình áp dụng cho Nhóm Khách hàng / Khách hàng chỉ định (${targetCustomerCount} khách hàng trong danh sách${
          selectedGroups && selectedGroups.length > 0 ? ` thuộc nhóm: ${selectedGroups.join(', ')}` : ''
        })`;
      } else if (selectedGroups && selectedGroups.length > 0) {
        audienceText = `Chương trình áp dụng cho Nhóm Khách hàng / Khách hàng chỉ định (nhóm: ${selectedGroups.join(', ')})`;
      } else {
        audienceText = 'Chương trình áp dụng cho Nhóm Khách hàng / Khách hàng chỉ định (theo danh sách cụ thể)';
      }
      break;
    case 'all_with_new':
    default:
      audienceText = 'Chương trình áp dụng công khai cho Khách hàng mới và Khách hàng Hiện hữu (toàn bộ khách hàng)';
      break;
  }

  // 2. Diễn giải giới hạn số lượng (3 fields)
  const hasTotal = totalVal !== undefined && totalVal !== '' && !isNaN(Number(totalVal)) && Number(totalVal) > 0;
  const hasCustomer = perCustomerVal !== undefined && perCustomerVal !== '' && !isNaN(Number(perCustomerVal)) && Number(perCustomerVal) > 0;
  const hasPlate = perPlateVal !== undefined && perPlateVal !== '' && !isNaN(Number(perPlateVal)) && Number(perPlateVal) > 0;

  const totalNum = hasTotal ? Number(totalVal) : 0;
  const custNum = hasCustomer ? Number(perCustomerVal) : 0;
  const plateNum = hasPlate ? Number(perPlateVal) : 0;

  if (!hasTotal && !hasCustomer && !hasPlate) {
    return `${audienceText}, không giới hạn tổng số lượt chiết khấu (mỗi khách hàng và mỗi biển số xe đều có thể sử dụng không giới hạn số lần).`;
  }

  const limitParts: string[] = [];

  // Vế 1: Tổng lượt
  if (hasTotal) {
    limitParts.push(`toàn chương trình áp dụng tối đa ${totalNum.toLocaleString('vi-VN')} lượt chiết khấu`);
  } else {
    limitParts.push('không giới hạn tổng lượt chiết khấu');
  }

  // Vế 2: Khách hàng và Biển số
  if (hasCustomer && hasPlate) {
    limitParts.push(`mỗi khách hàng được áp dụng tối đa ${custNum.toLocaleString('vi-VN')} lượt và mỗi biển số xe được áp dụng tối đa ${plateNum.toLocaleString('vi-VN')} lượt`);
  } else if (hasCustomer) {
    limitParts.push(`mỗi khách hàng được áp dụng tối đa ${custNum.toLocaleString('vi-VN')} lượt (không giới hạn theo biển số xe)`);
  } else if (hasPlate) {
    limitParts.push(`mỗi biển số xe được áp dụng tối đa ${plateNum.toLocaleString('vi-VN')} lượt (không giới hạn theo từng khách hàng)`);
  } else {
    limitParts.push('không giới hạn số lượt sử dụng đối với từng khách hàng và từng biển số xe');
  }

  return `${audienceText}. Quy định số lượng: ${limitParts.join('; trong đó ')}.`;
};

export const INITIAL_DISCOUNTS: DiscountRecord[] = [
  {
    id: 'disc-01',
    code: 'CK-KHM-10',
    name: 'Ưu đãi 10% công bảo dưỡng cho Khách hàng mới',
    category: 'Chiết khấu',
    type: 'percentage',
    value: 10,
    targetAudience: 'Khách hàng mới',
    minOrderValue: 500000,
    maxDiscountAmount: 300000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'disallow',
    allowStacking: false,
    roCount: 28,
    campaignRunCount: 5,
    description: 'Chương trình khuyến mãi giảm 10% chi phí tiền công bảo dưỡng định kỳ dành cho khách hàng lần đầu tiên mang xe đến garage.',
    createdAt: '01/01/2025',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'new_customer',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 500,
    maxUsagePerCustomer: 1,
    maxUsagePerPlate: 1,
    discountMethod: 'order',
    orderDiscountType: 'percentage',
    orderPercent: '10',
    orderMaxDiscountAmount: '300000',
    orderFixedAmount: '',
    orderMinOrderValue: '500000',
    productDiscountType: 'percentage',
    productItems: [],
    documents: [
      {
        id: 'doc-01-1',
        hasContract: false,
        documentName: 'Quy chế tiếp nhận xe & ưu đãi khách hàng mới 2025',
        documentDescription: 'Văn bản hướng dẫn áp dụng ưu đãi công thợ bảo dưỡng cho xe mới',
        supplier: '',
        contractNumber: '',
        contractDescription: '',
        effectiveDate: '2025-01-01',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/docs/qc-khach-hang-moi-2025.pdf',
        uploadedFile: 'QC_KhachHangMoi_2025.pdf',
        details: 'Giảm 10% tiền công, áp dụng đối với xe chưa từng có hồ sơ tiếp nhận tại chuỗi garage.',
      },
    ],
    vouchersList: [],
  },
  {
    id: 'disc-02',
    code: 'VC-VIP-500K',
    name: 'Voucher tri ân 500.000đ dành riêng cho Khách hàng VIP',
    category: 'Voucher',
    type: 'fixed_amount',
    value: 500000,
    targetAudience: 'Khách hàng VIP / Đại lý',
    minOrderValue: 2500000,
    maxDiscountAmount: 0,
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 14,
    campaignRunCount: 2,
    description: 'Voucher tặng khách hàng VIP / Đại lý khi làm dịch vụ đại tu, bảo dưỡng định kỳ cấp lớn từ 2.500.000đ.',
    createdAt: '10/01/2025',
    branchScope: 'specific',
    selectedBranches: ['Chi nhánh Quận 7 (TP.HCM)', 'Chi nhánh TP. Thủ Đức (TP.HCM)'],
    plateColorScope: 'specific',
    selectedPlateColors: ['Trắng'],
    customerScope: 'specific',
    selectedCustomerGroups: ['Khách hàng VIP / Đại lý'],
    targetCustomers: [],
    maxUsageTotal: 50,
    maxUsagePerCustomer: 1,
    maxUsagePerPlate: 1,
    discountMethod: 'order',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '500000',
    orderMinOrderValue: '2500000',
    productDiscountType: 'fixed_amount',
    productItems: [],
    documents: [
      {
        id: 'doc-02-1',
        hasContract: true,
        documentName: 'Hợp đồng nguyên tắc cung ứng phụ tùng A',
        documentDescription: 'Hợp đồng nguyên tắc cung ứng phụ tùng ô tô & dầu mỡ nhờn năm 2025',
        supplier: 'Công ty Phụ tùng A',
        contractNumber: 'HĐ-2025/PTA-01',
        contractDescription: 'Hợp đồng nguyên tắc cung ứng phụ tùng ô tô & dầu mỡ nhờn năm 2025',
        effectiveDate: '2025-01-01',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-PTA-01',
        uploadedFile: 'HD_2025_PTA_01_NguyenTac.pdf',
        details: 'Chiết khấu quý 8% theo đơn hàng thực tế, thanh toán gối đầu 30 ngày.',
      },
    ],
    vouchersList: [
      {
        id: 'vc-vip-001',
        code: 'VC-VIP-7781',
        targetType: 'existing_customer',
        status: 'used',
        createdAt: '15/01/2025',
        customerCode: 'KH-2023-089',
        customerName: 'Phạm Hoàng Nam',
        address: '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
        phone: '0901 234 567',
        email: 'nam.pham@namsaigonauto.vn',
        taxCode: '0314567890',
        debt: 12500000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-vip-002',
        code: 'VC-VIP-8824',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '15/01/2025',
        customerCode: 'KH-2023-142',
        customerName: 'Lê Hoàng Việt',
        address: '88 Bạch Đằng, P. 2, Tân Bình, TP. Hồ Chí Minh',
        phone: '0938 112 233',
        email: 'contact@vietthanhgarage.com',
        taxCode: '0319988776',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-vip-003',
        code: 'VC-VIP-9102',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '15/01/2025',
        customerCode: 'KH-2024-005',
        customerName: 'Trần Minh Tuấn',
        address: '56 Đường số 9, Linh Tây, TP. Thủ Đức, TP. Hồ Chí Minh',
        phone: '0912 345 678',
        email: 'tuan.tran@tuantranlogistics.com',
        taxCode: '0318765432',
        debt: 4200000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-vip-004',
        code: 'VC-VIP-3349',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '16/01/2025',
        customerCode: 'KH-2024-018',
        customerName: 'Nguyễn Thị Bích Ngọc',
        address: '102 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh',
        phone: '0987 654 321',
        email: 'bichngoc.law@gmail.com',
        taxCode: '0311223344',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-vip-005',
        code: 'VC-VIP-4512',
        targetType: 'existing_customer',
        status: 'used',
        createdAt: '16/01/2025',
        customerCode: 'KH-2024-032',
        customerName: 'Đỗ Gia Khang',
        address: '74 Mai Chí Thọ, An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
        phone: '0903 889 900',
        email: 'giakhang.do@khangland.vn',
        taxCode: '0315678901',
        debt: 8500000,
        hasCarInGarage: 'Đang có',
      },
    ],
  },
  {
    id: 'disc-03',
    code: 'CK-CASTROL-15',
    name: 'Chiết khấu 15% Dầu nhớt & Phụ gia Castrol Magnatec',
    category: 'Chiết khấu',
    type: 'percentage',
    value: 15,
    targetAudience: 'Khách hàng mới và Khách hàng Hiện hữu',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: '2025-02-01',
    endDate: '2025-08-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 45,
    campaignRunCount: 8,
    description: 'Chương trình hợp tác cùng Castrol Việt Nam, giảm 15% cho tất cả dòng sản phẩm nhớt động cơ và nước làm mát cao cấp.',
    createdAt: '25/01/2025',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'all_with_new',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 1000,
    maxUsagePerCustomer: undefined,
    maxUsagePerPlate: undefined,
    discountMethod: 'product',
    orderDiscountType: 'percentage',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '',
    orderMinOrderValue: '',
    productDiscountType: 'percentage',
    productItems: [
      {
        id: 'p-03-1',
        itemCode: 'NHOT003',
        itemName: 'Nhớt Mobil 20W-50',
        unit: 'Lít',
        vat: 10,
        priceBeforeVat: 170000,
        priceAfterVat: 187000,
        discountPercent: 15,
        fixedDiscountAmount: 25500,
        newPriceBeforeVat: 144500,
        newPriceAfterVat: 158950,
        minBuyQuantity: 4,
      },
      {
        id: 'p-03-2',
        itemCode: 'NUOCLM004',
        itemName: 'Nước làm mát LLC 20% 4L Red JCAP',
        unit: 'Bình',
        vat: 10,
        priceBeforeVat: 110000,
        priceAfterVat: 121000,
        discountPercent: 15,
        fixedDiscountAmount: 16500,
        newPriceBeforeVat: 93500,
        newPriceAfterVat: 102850,
        minBuyQuantity: 1,
      },
      {
        id: 'p-03-3',
        itemCode: 'LOCNHOT',
        itemName: 'Lọc nhớt chính hãng',
        unit: 'Cái',
        vat: 8,
        priceBeforeVat: 150000,
        priceAfterVat: 162000,
        discountPercent: 15,
        fixedDiscountAmount: 22500,
        newPriceBeforeVat: 127500,
        newPriceAfterVat: 137700,
        minBuyQuantity: 1,
      },
    ],
    documents: [
      {
        id: 'doc-03-1',
        hasContract: true,
        documentName: 'Hợp đồng dầu nhớt Castrol & Shell 2025',
        documentDescription: 'Hợp đồng cung ứng dầu động cơ Castrol Magnatec & Shell Helix 2025',
        supplier: 'Tổng kho Dầu nhớt Castrol & Shell',
        contractNumber: 'HĐ-2025/CS-11',
        contractDescription: 'Hợp đồng cung ứng dầu động cơ Castrol Magnatec & Shell Helix 2025',
        effectiveDate: '2025-03-01',
        expirationDate: '2026-02-28',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-CS-11',
        uploadedFile: 'HD_2025_Castrol_Shell_HopDong.pdf',
        details: 'Tài trợ máy hút nhớt thải và chiết khấu bậc thang theo sản lượng phuy/tháng.',
      },
    ],
    vouchersList: [],
  },
  {
    id: 'disc-04',
    code: 'VC-NEW-200K',
    name: 'Voucher 200.000đ kích cầu khách hàng mới trải nghiệm dịch vụ',
    category: 'Voucher',
    type: 'fixed_amount',
    value: 200000,
    targetAudience: 'Khách hàng mới',
    minOrderValue: 800000,
    maxDiscountAmount: 0,
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'disallow',
    allowStacking: false,
    roCount: 32,
    description: 'Mã voucher phát hành trực tuyến cho khách hàng mới đăng ký qua Fanpage/Website, giảm 200k cho đơn từ 800k.',
    createdAt: '28/02/2025',
    branchScope: 'specific',
    selectedBranches: ['Chi nhánh Tân Bình (TP.HCM)'],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'new_customer',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 100,
    maxUsagePerCustomer: 1,
    maxUsagePerPlate: 1,
    discountMethod: 'order',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '200000',
    orderMinOrderValue: '800000',
    productDiscountType: 'fixed_amount',
    productItems: [],
    documents: [],
    vouchersList: [
      { id: 'vc-n-1', code: 'VC-NEW-5501', targetType: 'new_customer', status: 'available', createdAt: '01/03/2025' },
      { id: 'vc-n-2', code: 'VC-NEW-5502', targetType: 'new_customer', status: 'available', createdAt: '01/03/2025' },
      { id: 'vc-n-3', code: 'VC-NEW-5503', targetType: 'new_customer', status: 'used', createdAt: '01/03/2025' },
      { id: 'vc-n-4', code: 'VC-NEW-5504', targetType: 'new_customer', status: 'used', createdAt: '01/03/2025' },
      { id: 'vc-n-5', code: 'VC-NEW-5505', targetType: 'new_customer', status: 'available', createdAt: '01/03/2025' },
      { id: 'vc-n-6', code: 'VC-NEW-5506', targetType: 'new_customer', status: 'available', createdAt: '01/03/2025' },
      { id: 'vc-n-7', code: 'VC-NEW-5507', targetType: 'new_customer', status: 'available', createdAt: '01/03/2025' },
      { id: 'vc-n-8', code: 'VC-NEW-5508', targetType: 'new_customer', status: 'used', createdAt: '01/03/2025' },
    ],
  },
  {
    id: 'disc-05',
    code: 'CK-DN-FLEET',
    name: 'Chính sách chiết khấu 8% tổng hóa đơn cho Đội xe Doanh nghiệp',
    category: 'Chiết khấu',
    type: 'percentage',
    value: 8,
    targetAudience: 'Khách hàng Doanh nghiệp',
    minOrderValue: 3000000,
    maxDiscountAmount: 2000000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 63,
    description: 'Áp dụng cho doanh nghiệp có hợp đồng bảo dưỡng đội xe từ 5 xe trở lên, thanh toán công nợ tháng.',
    createdAt: '01/01/2025',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'specific',
    selectedPlateColors: ['Trắng', 'Vàng'],
    customerScope: 'specific',
    selectedCustomerGroups: ['Khách hàng Doanh nghiệp'],
    targetCustomers: [],
    maxUsageTotal: 300,
    maxUsagePerCustomer: undefined,
    maxUsagePerPlate: undefined,
    discountMethod: 'order',
    orderDiscountType: 'percentage',
    orderPercent: '8',
    orderMaxDiscountAmount: '2000000',
    orderFixedAmount: '',
    orderMinOrderValue: '3000000',
    productDiscountType: 'percentage',
    productItems: [],
    documents: [
      {
        id: 'doc-05-1',
        hasContract: true,
        documentName: 'Hợp đồng phân phối phụ tùng ô tô & dầu nhờn',
        documentDescription: 'Hợp đồng nguyên tắc cung ứng phụ tùng ô tô & dầu mỡ nhờn năm 2025',
        supplier: 'Công ty Phụ tùng A',
        contractNumber: 'HĐ-2025/PTA-01',
        contractDescription: 'Hợp đồng nguyên tắc cung ứng phụ tùng ô tô & dầu mỡ nhờn năm 2025',
        effectiveDate: '2025-01-01',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-PTA-01',
        uploadedFile: 'HD_2025_PTA_01_NguyenTac.pdf',
        details: 'Chiết khấu quý 8% theo đơn hàng thực tế, thanh toán gối đầu 30 ngày.',
      },
    ],
    vouchersList: [],
  },
  {
    id: 'disc-06',
    code: 'VC-MICHELIN-1TR',
    name: 'Voucher tặng 1.000.000đ khi thay 4 lốp Michelin & cân chỉnh thước lái',
    category: 'Voucher',
    type: 'fixed_amount',
    value: 1000000,
    targetAudience: 'Khách hàng Thân thiết, Khách hàng VIP / Đại lý',
    minOrderValue: 6000000,
    maxDiscountAmount: 0,
    startDate: '2025-02-15',
    endDate: '2025-05-15',
    status: 'paused',
    statusDisplay: 'Khóa',
    stackable: 'disallow',
    allowStacking: false,
    roCount: 9,
    description: 'Chương trình kích cầu thay lốp du lịch mùa mưa, giảm ngay 1 triệu đồng cho khách hàng thân thiết và VIP.',
    createdAt: '12/02/2025',
    branchScope: 'specific',
    selectedBranches: ['Chi nhánh Quận 7 (TP.HCM)', 'Chi nhánh Bình Thạnh (TP.HCM)'],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'specific',
    selectedCustomerGroups: ['Khách hàng Thân thiết', 'Khách hàng VIP / Đại lý'],
    targetCustomers: [],
    maxUsageTotal: 30,
    maxUsagePerCustomer: 1,
    maxUsagePerPlate: 1,
    discountMethod: 'order',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '1000000',
    orderMinOrderValue: '6000000',
    productDiscountType: 'fixed_amount',
    productItems: [],
    documents: [
      {
        id: 'doc-06-1',
        hasContract: true,
        documentName: 'Hợp đồng phân phối lốp xe Michelin 2025',
        documentDescription: 'Hợp đồng phân phối độc quyền lốp Michelin & dịch vụ cân mâm bấm chì 2025',
        supplier: 'Đại lý Michelin Việt Nam',
        contractNumber: 'HĐ-2025/MCH-02',
        contractDescription: 'Hợp đồng phân phối độc quyền lốp Michelin & dịch vụ cân mâm bấm chì 2025',
        effectiveDate: '2025-01-15',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-MCH-02',
        uploadedFile: 'HD_2025_Michelin_PhanPhoi.pdf',
        details: 'Ưu đãi đại lý ủy quyền Michelin cấp 1, hỗ trợ công nghệ cân mâm Hunter.',
      },
    ],
    vouchersList: [
      {
        id: 'vc-mch-01',
        code: 'VC-MCH-201',
        targetType: 'existing_customer',
        status: 'used',
        createdAt: '15/02/2025',
        customerCode: 'KH-2023-089',
        customerName: 'Phạm Hoàng Nam',
        address: '215 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
        phone: '0901 234 567',
        email: 'nam.pham@namsaigonauto.vn',
        taxCode: '0314567890',
        debt: 12500000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-mch-02',
        code: 'VC-MCH-202',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '15/02/2025',
        customerCode: 'KH-2024-018',
        customerName: 'Nguyễn Thị Bích Ngọc',
        address: '102 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh',
        phone: '0987 654 321',
        email: 'bichngoc.law@gmail.com',
        taxCode: '0311223344',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-mch-03',
        code: 'VC-MCH-203',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '15/02/2025',
        customerCode: 'KH-2024-055',
        customerName: 'Võ Hoàng Yến',
        address: '15 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        phone: '0908 776 655',
        email: 'hoangyen.vo@vietstarcorp.vn',
        taxCode: '0313456789',
        debt: 3500000,
        hasCarInGarage: 'Không có',
      },
    ],
  },
  {
    id: 'disc-07',
    code: 'CK-ACQUY-GS-100K',
    name: 'Giảm 100.000đ trực tiếp khi thay bình Ắc quy GS chính hãng',
    category: 'Chiết khấu',
    type: 'fixed_amount',
    value: 100000,
    targetAudience: 'Khách hàng hiện hữu',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: '2025-03-01',
    endDate: '2025-10-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 21,
    description: 'Giảm giá trực tiếp 100k trên giá bán mỗi bình ắc quy GS ô tô, tặng kèm kiểm tra hệ thống sạc máy phát điện.',
    createdAt: '26/02/2025',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'all_existing',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 200,
    maxUsagePerCustomer: 2,
    maxUsagePerPlate: 1,
    discountMethod: 'product',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '',
    orderMinOrderValue: '',
    productDiscountType: 'fixed_amount',
    productItems: [
      {
        id: 'p-07-1',
        itemCode: 'BAT_GS',
        itemName: 'Bình ắc quy GS 12V - 60Ah',
        unit: 'Bình',
        vat: 10,
        priceBeforeVat: 1450000,
        priceAfterVat: 1595000,
        discountPercent: '',
        fixedDiscountAmount: 100000,
        newPriceBeforeVat: 1350000,
        newPriceAfterVat: 1485000,
        minBuyQuantity: 1,
      },
    ],
    documents: [
      {
        id: 'doc-07-1',
        hasContract: true,
        documentName: 'Hợp đồng đại lý ắc quy GS 2025',
        documentDescription: 'Hợp đồng mua bán ắc quy GS miễn bảo dưỡng (MF) dành cho xe con',
        supplier: 'Công ty Ắc quy GS Việt Nam',
        contractNumber: 'HĐ-2025/GS-05',
        contractDescription: 'Hợp đồng mua bán ắc quy GS miễn bảo dưỡng (MF) dành cho xe con',
        effectiveDate: '2025-01-01',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-GS-05',
        uploadedFile: 'HD_2025_AcQuyGS_BanHang.pdf',
        details: 'Chính sách chiết khấu 12% theo doanh số tháng, cam kết đổi trả 1-1 cho bình lỗi.',
      },
    ],
    vouchersList: [],
  },
  {
    id: 'disc-08',
    code: 'VC-BIENVANG-300K',
    name: 'Voucher hỗ trợ bảo dưỡng xe chạy dịch vụ & xe tải nhẹ 300.000đ',
    category: 'Voucher',
    type: 'fixed_amount',
    value: 300000,
    targetAudience: 'Khách hàng hiện hữu',
    minOrderValue: 1500000,
    maxDiscountAmount: 0,
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 'paused',
    statusDisplay: 'Khóa',
    stackable: 'disallow',
    allowStacking: false,
    roCount: 17,
    description: 'Gói voucher chuyên biệt hỗ trợ tài xế xe dịch vụ công nghệ, xe vận tải biển vàng cho hóa đơn từ 1.500.000đ.',
    createdAt: '20/12/2024',
    branchScope: 'specific',
    selectedBranches: ['Chi nhánh Bình Thạnh (TP.HCM)', 'Chi nhánh Thuận An (Bình Dương)'],
    plateColorScope: 'specific',
    selectedPlateColors: ['Vàng'],
    customerScope: 'all',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 80,
    maxUsagePerCustomer: 2,
    maxUsagePerPlate: 2,
    discountMethod: 'order',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '300000',
    orderMinOrderValue: '1500000',
    productDiscountType: 'fixed_amount',
    productItems: [],
    documents: [],
    vouchersList: [
      {
        id: 'vc-bv-1',
        code: 'VC-BV-3101',
        targetType: 'existing_customer',
        status: 'used',
        createdAt: '01/01/2025',
        customerCode: 'KH-2024-071',
        customerName: 'Vũ Minh Đạt',
        address: '189 Kha Vạn Cân, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh',
        phone: '0977 443 322',
        email: 'dat.vu@transportexpress.vn',
        taxCode: '0316655443',
        debt: 1800000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-bv-2',
        code: 'VC-BV-3102',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '01/01/2025',
        customerCode: 'KH-2024-099',
        customerName: 'Hoàng Văn Thái',
        address: '45 Đại lộ Bình Dương, Thuận An, Bình Dương',
        phone: '0966 554 433',
        email: 'thai.hoang@binhduonglog.com',
        taxCode: '3702112233',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-bv-3',
        code: 'VC-BV-3103',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '01/01/2025',
        customerCode: 'KH-2024-005',
        customerName: 'Trần Minh Tuấn',
        address: '56 Đường số 9, Linh Tây, TP. Thủ Đức, TP. Hồ Chí Minh',
        phone: '0912 345 678',
        email: 'tuan.tran@tuantranlogistics.com',
        taxCode: '0318765432',
        debt: 4200000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-bv-4',
        code: 'VC-BV-3104',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '01/01/2025',
        customerCode: 'KH-2023-142',
        customerName: 'Lê Hoàng Việt',
        address: '88 Bạch Đằng, P. 2, Tân Bình, TP. Hồ Chí Minh',
        phone: '0938 112 233',
        email: 'contact@vietthanhgarage.com',
        taxCode: '0319988776',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
    ],
  },
  {
    id: 'disc-09',
    code: 'CK-BOSCH-12',
    name: 'Chiết khấu 12% Bugi & Má phanh cao cấp thương hiệu Bosch',
    category: 'Chiết khấu',
    type: 'percentage',
    value: 12,
    targetAudience: 'Khách hàng mới và Khách hàng Hiện hữu',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: '2025-02-10',
    endDate: '2025-12-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 38,
    description: 'Ưu đãi định kỳ khi thay má phanh hoặc bugi Bosch, tăng cường hiệu năng phanh và tiết kiệm nhiên liệu.',
    createdAt: '05/02/2025',
    branchScope: 'specific',
    selectedBranches: ['Chi nhánh Quận 7 (TP.HCM)', 'Chi nhánh Tân Bình (TP.HCM)', 'Chi nhánh Thuận An (Bình Dương)'],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'all_with_new',
    selectedCustomerGroups: [],
    targetCustomers: [],
    maxUsageTotal: 150,
    maxUsagePerCustomer: undefined,
    maxUsagePerPlate: undefined,
    discountMethod: 'product',
    orderDiscountType: 'percentage',
    orderPercent: '10',
    orderMaxDiscountAmount: '',
    orderFixedAmount: '',
    orderMinOrderValue: '',
    productDiscountType: 'percentage',
    productItems: [
      {
        id: 'p-09-1',
        itemCode: 'BUGI_NGK',
        itemName: 'Bugi Iridium NGK Laser',
        unit: 'Bộ',
        vat: 8,
        priceBeforeVat: 480000,
        priceAfterVat: 518400,
        discountPercent: 12,
        fixedDiscountAmount: 57600,
        newPriceBeforeVat: 422400,
        newPriceAfterVat: 456192,
        minBuyQuantity: 1,
      },
      {
        id: 'p-09-2',
        itemCode: 'MAPHANH_TRUOC',
        itemName: 'Bộ má phanh trước Brembo',
        unit: 'Bộ',
        vat: 8,
        priceBeforeVat: 850000,
        priceAfterVat: 918000,
        discountPercent: 12,
        fixedDiscountAmount: 102000,
        newPriceBeforeVat: 748000,
        newPriceAfterVat: 807840,
        minBuyQuantity: 1,
      },
      {
        id: 'p-09-3',
        itemCode: 'LOCGIO',
        itemName: 'Lọc gió động cơ Denso',
        unit: 'Cái',
        vat: 8,
        priceBeforeVat: 220000,
        priceAfterVat: 237600,
        discountPercent: 12,
        fixedDiscountAmount: 26400,
        newPriceBeforeVat: 193600,
        newPriceAfterVat: 209088,
        minBuyQuantity: 1,
      },
    ],
    documents: [
      {
        id: 'doc-09-1',
        hasContract: true,
        documentName: 'Hợp đồng phân phối thiết bị Bosch 2025',
        documentDescription: 'Hợp đồng cung cấp gạt mưa, còi xe, ắc quy và linh kiện điện tử Bosch 2025',
        supplier: 'Phụ tùng Bosch Việt Nam',
        contractNumber: 'HĐ-2025/BSH-08',
        contractDescription: 'Hợp đồng cung cấp gạt mưa, còi xe, ắc quy và linh kiện điện tử Bosch 2025',
        effectiveDate: '2025-02-01',
        expirationDate: '2026-01-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/sales/contracts/HD-2025-BSH-08',
        uploadedFile: 'HD_2025_Bosch_LinhKienDienTu.pdf',
        details: 'Áp dụng chiết khấu thương mại 10% cho các gói bảo dưỡng sử dụng linh kiện Bosch.',
      },
    ],
    vouchersList: [],
  },
  {
    id: 'disc-10',
    code: 'VC-SINHNHAT-15',
    name: 'Voucher sinh nhật tri ân Khách hàng Thân thiết giảm 15%',
    category: 'Voucher',
    type: 'percentage',
    value: 15,
    targetAudience: 'Khách hàng Thân thiết',
    minOrderValue: 1000000,
    maxDiscountAmount: 600000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'disallow',
    allowStacking: false,
    roCount: 52,
    description: 'Gửi tặng khách hàng thân thiết trong tháng sinh nhật, giảm 15% tổng giá trị lệnh sửa chữa RO (tối đa 600.000đ).',
    createdAt: '01/01/2025',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'specific',
    selectedCustomerGroups: ['Khách hàng Thân thiết'],
    targetCustomers: [],
    maxUsageTotal: 200,
    maxUsagePerCustomer: 1,
    maxUsagePerPlate: 1,
    discountMethod: 'order',
    orderDiscountType: 'percentage',
    orderPercent: '15',
    orderMaxDiscountAmount: '600000',
    orderFixedAmount: '',
    orderMinOrderValue: '1000000',
    productDiscountType: 'percentage',
    productItems: [],
    documents: [
      {
        id: 'doc-10-1',
        hasContract: false,
        documentName: 'Chính sách chăm sóc khách hàng & quà tặng sinh nhật 2025',
        documentDescription: 'Quy định phát hành voucher ưu đãi sinh nhật cho thành viên thân thiết',
        supplier: '',
        contractNumber: '',
        contractDescription: '',
        effectiveDate: '2025-01-01',
        expirationDate: '2025-12-31',
        isValid: true,
        link: 'https://erp.dumuc.com.vn/docs/cs-sinh-nhat-2025.pdf',
        uploadedFile: 'CS_SinhNhat_KHTT_2025.pdf',
        details: 'Tự động gửi tin nhắn SMS / Zalo OA chúc mừng sinh nhật kèm mã Voucher ưu đãi 15%.',
      },
    ],
    vouchersList: [
      {
        id: 'vc-bd-01',
        code: 'VC-BD-8801',
        targetType: 'existing_customer',
        status: 'used',
        createdAt: '10/01/2025',
        customerCode: 'KH-2024-018',
        customerName: 'Nguyễn Thị Bích Ngọc',
        address: '102 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh',
        phone: '0987 654 321',
        email: 'bichngoc.law@gmail.com',
        taxCode: '0311223344',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-bd-02',
        code: 'VC-BD-8802',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '15/01/2025',
        customerCode: 'KH-2024-032',
        customerName: 'Đỗ Gia Khang',
        address: '74 Mai Chí Thọ, An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
        phone: '0903 889 900',
        email: 'giakhang.do@khangland.vn',
        taxCode: '0315678901',
        debt: 8500000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-bd-03',
        code: 'VC-BD-8803',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '20/01/2025',
        customerCode: 'KH-2024-055',
        customerName: 'Võ Hoàng Yến',
        address: '15 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        phone: '0908 776 655',
        email: 'hoangyen.vo@vietstarcorp.vn',
        taxCode: '0313456789',
        debt: 3500000,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-bd-04',
        code: 'VC-BD-8804',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '25/01/2025',
        customerCode: 'KH-2024-071',
        customerName: 'Vũ Minh Đạt',
        address: '189 Kha Vạn Cân, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh',
        phone: '0977 443 322',
        email: 'dat.vu@transportexpress.vn',
        taxCode: '0316655443',
        debt: 1800000,
        hasCarInGarage: 'Đang có',
      },
      {
        id: 'vc-bd-05',
        code: 'VC-BD-8805',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '28/01/2025',
        customerCode: 'KH-2024-099',
        customerName: 'Hoàng Văn Thái',
        address: '45 Đại lộ Bình Dương, Thuận An, Bình Dương',
        phone: '0966 554 433',
        email: 'thai.hoang@binhduonglog.com',
        taxCode: '3702112233',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
    ],
  },
  {
    id: 'disc-11',
    code: 'GT-2026-101',
    name: 'Chương trình Khách cũ giới thiệu Khách mới - Tặng Voucher 200K',
    category: 'Khách cũ giới thiệu Khách mới',
    type: 'fixed_amount',
    value: 200000,
    targetAudience: 'Khách cũ & Khách mới',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    statusDisplay: 'Mở khóa',
    stackable: 'allow',
    allowStacking: true,
    roCount: 15,
    campaignRunCount: 3,
    description: 'Chính sách tri ân khách hàng cũ giới thiệu bạn bè mang xe đến garage, áp dụng cho cả hai bên.',
    createdAt: '2026-01-01 08:00',
    branchScope: 'all',
    selectedBranches: [],
    plateColorScope: 'all',
    selectedPlateColors: [],
    customerScope: 'all_with_new',
    selectedCustomerGroups: [],
    targetCustomers: [],
    discountMethod: 'order',
    orderDiscountType: 'fixed_amount',
    orderPercent: '10',
    orderFixedAmount: 150000,
    orderMinOrderValue: 800000,
    productDiscountType: 'percentage',
    productItems: [],
    referrerDiscountMethod: 'order',
    referrerOrderDiscountType: 'fixed_amount',
    referrerOrderPercent: '10',
    referrerOrderFixedAmount: 200000,
    referrerOrderMinOrderValue: 1000000,
    referrerProductDiscountType: 'percentage',
    referrerProductItems: [],
    sendReferrerGiftCode: true,
    referrerCodePrefix: 'QT-',
    referrerCodeSuffixType: 'STT tăng dần',
    referrerValidityDays: 30,
    referrerSendChannels: ['SMS', 'Zalo OA', 'Email'],
    documents: [],
    referralCodeMethod: 'phone',
    vouchersList: [
      {
        id: 'vc-gt-01',
        code: 'GT-KHM-001',
        targetType: 'new_customer',
        status: 'available',
        createdAt: '01/01/2026',
        customerCode: 'KH-2024-018',
        customerName: 'Nguyễn Thị Bích Ngọc',
        address: '102 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh',
        phone: '0987 654 321',
        email: 'bichngoc.law@gmail.com',
        taxCode: '0311223344',
        debt: 0,
        hasCarInGarage: 'Không có',
      },
      {
        id: 'vc-gt-02',
        code: 'GT-KHC-002',
        targetType: 'existing_customer',
        status: 'available',
        createdAt: '01/01/2026',
        customerCode: 'KH-2024-001',
        customerName: 'Nguyễn Văn An',
        phone: '0901234567',
        address: 'Quận 7, TP.HCM',
        email: 'an.nguyen@example.com',
        taxCode: '0301234567',
        debt: 0,
        hasCarInGarage: 'Đang có',
      },
    ],
  },
];

export interface ReferralHistoryItem {
  id: string;
  orderCode: string; // Số đơn / Lệnh sửa chữa hoàn thành (e.g. 2610-000075)
  referralCode?: string; // Mã giới thiệu đã dùng
  referrerCode: string; // Mã người giới thiệu (khách cũ) (e.g. KH-2023-089)
  referrerName: string; // Tên người giới thiệu (e.g. Phạm Hoàng Nam)
  referrerPhone: string; // '0901 234 567'
  newCustomerCode?: string; // Mã người mới
  newCustomerName: string; // Tên người mới (e.g. Nguyễn Hữu Trọng)
  newCustomerPhone: string; // '0988 123 789'
  completedDate: string; // Thời gian hoàn thành e.g. '24/10/2026 16:50'
  orderValue: number; // Giá trị đơn (e.g. 2500000)
  orderStatus?: string; // Trạng thái đơn e.g. 'Hoàn thành'
  rewardCode?: string; // Mã thưởng tự động sinh e.g. 'GT-THUONG-3692'
  rewardValue?: number; // Trị giá thưởng e.g. 200000
  rewardExpiryDate?: string; // Hạn dùng e.g. '23/11/2026'
  rewardCodeStatus?: 'Chưa sử dụng' | 'Đã sử dụng' | 'Hết hạn'; // Trạng thái mã
  rewardStatus?: 'Đã thưởng' | 'Chờ trả thưởng';
}

export const INITIAL_REFERRAL_HISTORY: ReferralHistoryItem[] = [
  {
    id: 'ref-01',
    orderCode: '2610-000075',
    referralCode: 'GT-KHC-002',
    referrerCode: 'KH-2023-089',
    referrerName: 'Phạm Hoàng Nam',
    referrerPhone: '0901 234 567',
    newCustomerCode: 'KH-NEW-101',
    newCustomerName: 'Nguyễn Hữu Trọng',
    newCustomerPhone: '0988 123 789',
    completedDate: '24/10/2026 16:50',
    orderValue: 2500000,
    orderStatus: 'Hoàn thành',
    rewardCode: 'GT-THUONG-3692',
    rewardValue: 200000,
    rewardExpiryDate: '23/11/2026',
    rewardCodeStatus: 'Chưa sử dụng',
    rewardStatus: 'Đã thưởng',
  },
  {
    id: 'ref-02',
    orderCode: '2610-000088',
    referralCode: 'GT-KHC-018',
    referrerCode: 'KH-2024-018',
    referrerName: 'Nguyễn Thị Bích Ngọc',
    referrerPhone: '0987 654 321',
    newCustomerCode: 'KH-NEW-102',
    newCustomerName: 'Phạm Thu Trang',
    newCustomerPhone: '0988 776 655',
    completedDate: '24/10/2026 14:15',
    orderValue: 1850000,
    orderStatus: 'Hoàn thành',
    rewardCode: 'GT-THUONG-5512',
    rewardValue: 200000,
    rewardExpiryDate: '23/11/2026',
    rewardCodeStatus: 'Chưa sử dụng',
    rewardStatus: 'Đã thưởng',
  },
  {
    id: 'ref-03',
    orderCode: '2610-000092',
    referralCode: 'GT-KHC-032',
    referrerCode: 'KH-2024-032',
    referrerName: 'Đỗ Gia Khang',
    referrerPhone: '0903 889 900',
    newCustomerCode: 'KH-NEW-103',
    newCustomerName: 'Hoàng Anh Tuấn',
    newCustomerPhone: '0933 221 100',
    completedDate: '23/10/2026 11:30',
    orderValue: 3200000,
    orderStatus: 'Hoàn thành',
    rewardCode: 'GT-THUONG-7789',
    rewardValue: 200000,
    rewardExpiryDate: '22/11/2026',
    rewardCodeStatus: 'Đã sử dụng',
    rewardStatus: 'Đã thưởng',
  },
  {
    id: 'ref-04',
    orderCode: '2610-000104',
    referralCode: 'GT-KHC-055',
    referrerCode: 'KH-2024-055',
    referrerName: 'Võ Hoàng Yến',
    referrerPhone: '0908 776 655',
    newCustomerCode: 'KH-NEW-104',
    newCustomerName: 'Đặng Ngọc Lan',
    newCustomerPhone: '0977 665 544',
    completedDate: '22/10/2026 09:40',
    orderValue: 1500000,
    orderStatus: 'Hoàn thành',
    rewardCode: 'GT-THUONG-1204',
    rewardValue: 200000,
    rewardExpiryDate: '21/11/2026',
    rewardCodeStatus: 'Chưa sử dụng',
    rewardStatus: 'Đã thưởng',
  },
  {
    id: 'ref-05',
    orderCode: '2610-000115',
    referralCode: 'GT-KHC-071',
    referrerCode: 'KH-2024-071',
    referrerName: 'Vũ Minh Đạt',
    referrerPhone: '0977 443 322',
    newCustomerCode: 'KH-NEW-105',
    newCustomerName: 'Lý Quốc Bảo',
    newCustomerPhone: '0966 554 433',
    completedDate: '21/10/2026 17:05',
    orderValue: 4100000,
    orderStatus: 'Hoàn thành',
    rewardCode: 'GT-THUONG-9931',
    rewardValue: 200000,
    rewardExpiryDate: '20/11/2026',
    rewardCodeStatus: 'Chưa sử dụng',
    rewardStatus: 'Đã thưởng',
  },
];

export const DiscountManagementModule: React.FC = () => {
  // Khởi tạo 10 records mẫu đa dạng đầy đủ các trường hợp theo chuẩn form Thêm mới
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(INITIAL_DISCOUNTS);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter inputs
  const [searchInput, setSearchInput] = useState('');
  const [typeInput, setTypeInput] = useState('ALL');
  const [statusInput, setStatusInput] = useState('ALL');
  const [targetInput, setTargetInput] = useState('ALL');

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    type: 'ALL',
    status: 'ALL',
    target: 'ALL',
  });

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [viewingDiscount, setViewingDiscount] = useState<DiscountRecord | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [campaignModalDiscount, setCampaignModalDiscount] = useState<DiscountRecord | null>(null);
  const [lockedCampaignDiscount, setLockedCampaignDiscount] = useState<DiscountRecord | null>(null);

  // Full-screen RO Modal State
  const [viewingRODiscount, setViewingRODiscount] = useState<DiscountRecord | null>(null);
  const [roSearchPlate, setRoSearchPlate] = useState('');
  const [roSearchCustomer, setRoSearchCustomer] = useState('');
  const [roSearchAdvisor, setRoSearchAdvisor] = useState('');
  const [roPageSize, setRoPageSize] = useState<number>(20);
  const [roCurrentPage, setRoCurrentPage] = useState<number>(1);

  const handleOpenROModal = (discount: DiscountRecord) => {
    setViewingRODiscount(discount);
    setRoCurrentPage(1);
    setRoSearchPlate('');
    setRoSearchCustomer('');
    setRoSearchAdvisor('');
  };

  // Popover info states for tooltips
  const [showStartDateInfo, setShowStartDateInfo] = useState(false);
  const [showMinBuyQtyInfo, setShowMinBuyQtyInfo] = useState(false);
  const [minBuyQtyPos, setMinBuyQtyPos] = useState<{ top: number; left: number } | null>(null);
  const minBuyQtyBtnRef = useRef<HTMLButtonElement | null>(null);
  const [customerAppliedToast, setCustomerAppliedToast] = useState<string | null>(null);

  const handleMinBuyQtyEnter = () => {
    if (minBuyQtyBtnRef.current) {
      const rect = minBuyQtyBtnRef.current.getBoundingClientRect();
      const tooltipWidth = 330;
      let left = rect.right - tooltipWidth + 12;
      if (left < 16) left = 16;
      if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16;
      }
      const top = rect.bottom + 8;
      setMinBuyQtyPos({ top, left });
      setShowMinBuyQtyInfo(true);
    }
  };

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<DiscountCategory>('Chiết khấu');
  const [formDiscountCode, setFormDiscountCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'paused'>('active'); // active: Mở khóa, paused: Khóa
  const [formStackable, setFormStackable] = useState<'allow' | 'disallow'>('allow'); // Cho phép cộng dồn / Không cho phép cộng dồn

  // Khu vực 2 State
  const [formBranchScope, setFormBranchScope] = useState<'all' | 'specific'>('all');
  const [formSelectedBranches, setFormSelectedBranches] = useState<string[]>([]);

  const [formPlateColorScope, setFormPlateColorScope] = useState<'all' | 'specific'>('all');
  const [formSelectedPlateColors, setFormSelectedPlateColors] = useState<string[]>([]);

  const [formCustomerScope, setFormCustomerScope] = useState<'new_customer' | 'all_with_new' | 'all' | 'all_existing' | 'specific'>('all_with_new');
  const [formSelectedCustomerGroups, setFormSelectedCustomerGroups] = useState<string[]>([]);
  const [formTargetCustomers, setFormTargetCustomers] = useState<CustomerTargetItem[]>([]);

  // Khu vực 3 State
  const [formMaxUsageTotal, setFormMaxUsageTotal] = useState<string>('');
  const [formMaxUsagePerCustomer, setFormMaxUsagePerCustomer] = useState<string>('');
  const [formMaxUsagePerPlate, setFormMaxUsagePerPlate] = useState<string>('');
  const [formDiscountMethod, setFormDiscountMethod] = useState<'order' | 'product'>('order');
  // Sub for Order
  const [formOrderDiscountType, setFormOrderDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [formOrderPercent, setFormOrderPercent] = useState<string>('10');
  const [formOrderMaxDiscountAmount, setFormOrderMaxDiscountAmount] = useState<string>('');
  const [formOrderFixedAmount, setFormOrderFixedAmount] = useState<string>('');
  const [formOrderMinOrderValue, setFormOrderMinOrderValue] = useState<string>('');

  // Sub for Product
  const [formProductDiscountType, setFormProductDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [formProductItems, setFormProductItems] = useState<ProductDiscountItem[]>([]);

  // Khu vực 3: Thiết lập cho Khách hiện hữu (Người giới thiệu) khi Loại = "Khách cũ giới thiệu Khách mới"
  const [referrerDiscountMethod, setReferrerDiscountMethod] = useState<'order' | 'product'>('order');
  const [referrerOrderDiscountType, setReferrerOrderDiscountType] = useState<'percentage' | 'fixed_amount'>('fixed_amount');
  const [referrerOrderPercent, setReferrerOrderPercent] = useState<string>('10');
  const [referrerOrderMaxDiscountAmount, setReferrerOrderMaxDiscountAmount] = useState<string>('');
  const [referrerOrderFixedAmount, setReferrerOrderFixedAmount] = useState<string>('200000');
  const [referrerOrderMinOrderValue, setReferrerOrderMinOrderValue] = useState<string>('1000000');
  const [referrerProductDiscountType, setReferrerProductDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [referrerProductItems, setReferrerProductItems] = useState<ProductDiscountItem[]>([]);

  // Gửi Mã quà tặng cho người giới thiệu khi Loại = "Khách cũ giới thiệu Khách mới"
  const [formSendReferrerGiftCode, setFormSendReferrerGiftCode] = useState<boolean>(false);
  const [formReferrerCodePrefix, setFormReferrerCodePrefix] = useState<string>('QT-');
  const [formReferrerCodeSuffixType, setFormReferrerCodeSuffixType] = useState<'STT tăng dần' | 'Số điện thoại' | 'Email'>('STT tăng dần');
  const [formReferrerValidityDays, setFormReferrerValidityDays] = useState<string>('30');
  const [formReferrerSendChannels, setFormReferrerSendChannels] = useState<string[]>(['SMS', 'Zalo OA', 'Email']);
  const [isPreviewMessageModalOpen, setIsPreviewMessageModalOpen] = useState<boolean>(false);
  const [previewChannelTab, setPreviewChannelTab] = useState<'SMS' | 'Zalo OA' | 'Email'>('SMS');
  const [isEditingPreviewTemplate, setIsEditingPreviewTemplate] = useState<boolean>(false);

  // Nội dung mẫu tin nhắn có thể Sửa (SMS, Zalo OA, Email)
  const [smsTemplateText, setSmsTemplateText] = useState<string>(
    'Cam on Quy khach {TEN_NGUOI_GIOI_THIEU} da gioi thieu khach hang {TEN_NGUOI_DUOC_GT} den Garage Du Muc! Don hang {MA_DON_HANG} da hoan tat thanh toan. Garage xin tang Quy khach Ma qua tang tri an: {MA_QUA_TANG} ({GIA_TRI_UU_DAI}). Thoi han su dung: {HAN_DUNG_NGAY} ngay. Hotline: 1900 8899. Tran trong!'
  );
  const [zaloTemplate, setZaloTemplate] = useState<{
    title: string;
    subtitle: string;
    ctaText: string;
    secondaryCtaText: string;
    note: string;
  }>({
    title: 'TẶNG MÃ QUÀ TẶNG TRI ÂN NGƯỜI GIỚI THIỆU',
    subtitle: 'Người bạn được giới thiệu ({TEN_NGUOI_DUOC_GT}) đã hoàn tất đơn hàng {MA_DON_HANG}',
    ctaText: 'Đặt hẹn & Áp dụng mã ngay',
    secondaryCtaText: 'Lưu mã vào Ví Zalo',
    note: 'Áp dụng cho mọi dịch vụ bảo dưỡng và sửa chữa tại hệ thống Garage Du Mục',
  });
  const [emailTemplate, setEmailTemplate] = useState<{
    subject: string;
    greeting: string;
    intro: string;
    orderNote: string;
    boxTitle: string;
    footerNote: string;
  }>({
    subject: '🎁 [Garage Du Mục] Cảm ơn Quý khách {TEN_NGUOI_GIOI_THIEU} - Tặng Mã quà tặng tri ân giới thiệu bạn bè',
    greeting: 'Kính gửi Quý khách {TEN_NGUOI_GIOI_THIEU},',
    intro: 'Garage Du Mục xin gửi lời cảm ơn chân thành tới Quý khách vì đã tin tưởng giới thiệu người bạn {TEN_NGUOI_DUOC_GT} sử dụng dịch vụ tại garage của chúng tôi.',
    orderNote: 'Đơn hàng sửa chữa/bảo dưỡng {MA_DON_HANG} của bạn Quý khách đã hoàn tất thanh toán thành công. Chúng tôi xin trân trọng gửi tặng Quý khách phần quà tri ân đặc biệt:',
    boxTitle: 'MÃ QUÀ TẶNG TRI ÂN KHÁCH HÀNG',
    footerNote: 'Hotline hỗ trợ: 1900 8899 • Hệ thống Garage Du Mục toàn quốc',
  });

  // Quản lý Voucher State
  const [formVouchersList, setFormVouchersList] = useState<VoucherItem[]>([]);
  const [referralCodeMethod, setReferralCodeMethod] = useState<'phone' | 'email' | 'customer_code'>('phone');
  const [isViewVoucherListModalOpen, setIsViewVoucherListModalOpen] = useState(false);
  const [isGenerateVoucherModalOpen, setIsGenerateVoucherModalOpen] = useState(false);
  const [genVoucherTargetType, setGenVoucherTargetType] = useState<'new_customer' | 'existing_customer'>('new_customer');
  const [genVoucherQty, setGenVoucherQty] = useState<string>('10');
  const [genSelectedCustomerGroups, setGenSelectedCustomerGroups] = useState<string[]>([]);
  const [genExistingCustRows, setGenExistingCustRows] = useState<ExistingCustomerVoucherRow[]>([]);
  const [voucherSearchTerm, setVoucherSearchTerm] = useState('');
  const [voucherCopiedId, setVoucherCopiedId] = useState<string | null>(null);

  const [voucherTargetFilter, setVoucherTargetFilter] = useState<'all' | 'new_customer' | 'existing_customer'>('all');
  const [voucherGarageFilter, setVoucherGarageFilter] = useState<'all' | 'Đang có' | 'Không có'>('all');
  const [voucherDebtFilter, setVoucherDebtFilter] = useState<'all' | 'with_debt' | 'no_debt'>('all');

  // Derived counts for read-only fields
  const formVoucherTotalCount = formVouchersList.length;
  const formVoucherNewCustomerCount = formVouchersList.filter((v) => v.targetType === 'new_customer').length;
  const formVoucherExistingCustomerCount = formVouchersList.filter((v) => v.targetType === 'existing_customer').length;

  // Quản lý Lịch sử Giới thiệu State
  const [referralHistoryList, setReferralHistoryList] = useState<ReferralHistoryItem[]>(INITIAL_REFERRAL_HISTORY);
  const [isReferralHistoryModalOpen, setIsReferralHistoryModalOpen] = useState(false);
  const [referralHistorySearch, setReferralHistorySearch] = useState('');
  const [referralRewardStatusFilter, setReferralRewardStatusFilter] = useState<'all' | 'Đã thưởng' | 'Chờ trả thưởng'>('all');
  const [referralCodeStatusFilter, setReferralCodeStatusFilter] = useState<'all' | 'Chưa sử dụng' | 'Đã sử dụng'>('all');
  const [copiedRewardCode, setCopiedRewardCode] = useState<string | null>(null);

  const formReferralCompletedOrdersCount = referralHistoryList.length;

  // 4 Thống kê phục vụ giao diện Lịch sử Giới thiệu
  const referralCompletedOrdersCount = referralHistoryList.length;
  const referralGeneratedCodesCount = referralHistoryList.filter((item) => Boolean(item.rewardCode || item.referralCode)).length;
  const referralTotalPurchasedAmount = referralHistoryList.reduce((sum, item) => sum + (item.orderValue || 0), 0);
  const referralUsedRewardsCount = referralHistoryList.filter((item) => item.rewardCodeStatus === 'Đã sử dụng').length;

  const filteredReferralHistory = referralHistoryList.filter((item) => {
    if (referralHistorySearch.trim()) {
      const q = referralHistorySearch.toLowerCase();
      const match =
        item.orderCode.toLowerCase().includes(q) ||
        (item.referralCode && item.referralCode.toLowerCase().includes(q)) ||
        (item.rewardCode && item.rewardCode.toLowerCase().includes(q)) ||
        item.referrerCode.toLowerCase().includes(q) ||
        item.referrerName.toLowerCase().includes(q) ||
        item.referrerPhone.toLowerCase().includes(q) ||
        (item.newCustomerCode && item.newCustomerCode.toLowerCase().includes(q)) ||
        item.newCustomerName.toLowerCase().includes(q) ||
        item.newCustomerPhone.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (referralCodeStatusFilter !== 'all' && (item.rewardCodeStatus || 'Chưa sử dụng') !== referralCodeStatusFilter) {
      return false;
    }
    if (referralRewardStatusFilter !== 'all' && item.rewardStatus !== referralRewardStatusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenGenerateVoucher = () => {
    setGenVoucherTargetType(formCategory === 'Khách cũ giới thiệu Khách mới' ? 'existing_customer' : 'new_customer');
    setGenVoucherQty('10');
    setGenSelectedCustomerGroups([]);
    setGenExistingCustRows([]);
    setIsGenerateVoucherModalOpen(true);
  };

  const handleAddGroupsToExistingCustList = () => {
    if (genSelectedCustomerGroups.length === 0) {
      alert('Vui lòng chọn ít nhất một Nhóm khách hàng.');
      return;
    }
    const matchingCustomers = EXISTING_CUSTOMERS_IN_MODULE.filter((c) =>
      genSelectedCustomerGroups.includes(c.customerGroup)
    );

    setGenExistingCustRows((prev) => {
      const existingCodes = new Set(prev.map((r) => r.customerCode));
      const newRows: ExistingCustomerVoucherRow[] = [];

      matchingCustomers.forEach((cust, idx) => {
        if (!existingCodes.has(cust.customerCode)) {
          existingCodes.add(cust.customerCode);
          newRows.push({
            id: `gen-cust-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            customerCode: cust.customerCode,
            customerName: cust.customerName,
            address: cust.address,
            phone: cust.phone,
            email: cust.email,
            taxCode: cust.taxCode,
            debt: idx % 3 === 0 ? 15000000 : idx % 2 === 0 ? 4200000 : 0,
            hasCarInGarage: idx % 2 === 0 ? 'Đang có' : 'Không có',
          });
        }
      });

      return [...prev, ...newRows];
    });
  };

  const handleAddRowToExistingCustList = () => {
    const existingCodes = new Set(genExistingCustRows.map((r) => r.customerCode));
    const available = EXISTING_CUSTOMERS_IN_MODULE.find((c) => !existingCodes.has(c.customerCode));

    const newRow: ExistingCustomerVoucherRow = available
      ? {
          id: `gen-cust-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          customerCode: available.customerCode,
          customerName: available.customerName,
          address: available.address,
          phone: available.phone,
          email: available.email,
          taxCode: available.taxCode,
          debt: 0,
          hasCarInGarage: 'Không có',
        }
      : {
          id: `gen-cust-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          customerCode: `KH-${new Date().getFullYear()}-${String(genExistingCustRows.length + 1).padStart(3, '0')}`,
          customerName: '',
          address: '',
          phone: '',
          email: '',
          taxCode: '',
          debt: 0,
          hasCarInGarage: 'Không có',
        };

    setGenExistingCustRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRowFromExistingCustList = (id: string) => {
    setGenExistingCustRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateGenExistingRow = (
    id: string,
    field: keyof ExistingCustomerVoucherRow,
    value: any
  ) => {
    setGenExistingCustRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleConfirmGenerateVouchers = () => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const isReferralCategory = formCategory === 'Khách cũ giới thiệu Khách mới';

    if (!isReferralCategory && genVoucherTargetType === 'new_customer') {
      const qty = Math.max(1, Math.min(1000, parseInt(genVoucherQty, 10) || 1));
      const newItems: VoucherItem[] = [];

      for (let i = 0; i < qty; i++) {
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        newItems.push({
          id: `vchr-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          code: `VC-${randomCode}-${randomNum}`,
          targetType: 'new_customer',
          status: 'available',
          createdAt: dateStr,
          customerCode: `KH-NEW-${Math.floor(100 + Math.random() * 900)}`,
          customerName: `Khách mới #${formVouchersList.length + i + 1}`,
          address: 'Hồ Chí Minh',
          phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
          email: `khachmoi${randomNum}@gmail.com`,
          taxCode: `03${Math.floor(10000000 + Math.random() * 90000000)}`,
          debt: 0,
          hasCarInGarage: 'Không có',
        });
      }

      setFormVouchersList((prev) => [...newItems, ...prev]);
      setIsGenerateVoucherModalOpen(false);
    } else {
      if (genExistingCustRows.length === 0) {
        alert(
          isReferralCategory
            ? 'Vui lòng thêm ít nhất 1 khách hàng vào danh sách trước khi xác nhận tạo.'
            : 'Vui lòng thêm ít nhất 1 khách hàng hiện hữu vào danh sách trước khi xác nhận tạo.'
        );
        return;
      }

      const newItems: VoucherItem[] = genExistingCustRows.map((row, i) => {
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return {
          id: `vchr-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          code: isReferralCategory ? `REF-${randomCode}-${randomNum}` : `VC-${randomCode}-${randomNum}`,
          targetType: 'existing_customer',
          status: 'available',
          createdAt: dateStr,
          customerCode: row.customerCode || `KH-EXT-${i + 1}`,
          customerName: row.customerName || `Khách hàng #${i + 1}`,
          address: row.address || '',
          phone: row.phone || '',
          email: row.email || '',
          taxCode: row.taxCode || '',
          debt: typeof row.debt === 'number' ? row.debt : parseInt(String(row.debt).replace(/\D/g, ''), 10) || 0,
          hasCarInGarage: row.hasCarInGarage || 'Không có',
        };
      });

      setFormVouchersList((prev) => [...newItems, ...prev]);
      setIsGenerateVoucherModalOpen(false);
    }
  };

  const handleGenerateVouchers = handleConfirmGenerateVouchers;

  const handleAddVoucherRow = () => {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newRow: VoucherItem = {
      id: `vchr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: `VC-${randomCode}-${randomNum}`,
      targetType: 'new_customer',
      status: 'available',
      createdAt: dateStr,
      customerCode: '',
      customerName: '',
      address: '',
      phone: '',
      email: '',
      taxCode: '',
      debt: 0,
      hasCarInGarage: 'Không có',
    };
    setFormVouchersList((prev) => [newRow, ...prev]);
  };

  const handleDeleteVoucher = (voucherId: string) => {
    setFormVouchersList((prev) => prev.filter((v) => v.id !== voucherId));
  };

  const handleUpdateVoucherRow = (voucherId: string, field: keyof VoucherItem, value: any) => {
    setFormVouchersList((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, [field]: value } : v))
    );
  };

  const filteredVouchers = formVouchersList.filter((v) => {
    // 1. Text search
    if (voucherSearchTerm.trim()) {
      const q = voucherSearchTerm.toLowerCase();
      const effectiveCode =
        formCategory === 'Khách cũ giới thiệu Khách mới'
          ? referralCodeMethod === 'phone'
            ? v.phone?.trim() || v.code
            : referralCodeMethod === 'email'
            ? v.email?.trim() || v.code
            : v.customerCode?.trim() || v.code
          : v.code;
      const match =
        v.code.toLowerCase().includes(q) ||
        effectiveCode.toLowerCase().includes(q) ||
        (v.customerCode && v.customerCode.toLowerCase().includes(q)) ||
        (v.customerName && v.customerName.toLowerCase().includes(q)) ||
        (v.address && v.address.toLowerCase().includes(q)) ||
        (v.phone && v.phone.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.taxCode && v.taxCode.toLowerCase().includes(q));
      if (!match) return false;
    }
    // 2. Target filter
    if (voucherTargetFilter !== 'all' && v.targetType !== voucherTargetFilter) {
      return false;
    }
    // 3. Garage filter
    if (voucherGarageFilter !== 'all' && (v.hasCarInGarage || 'Không có') !== voucherGarageFilter) {
      return false;
    }
    // 4. Debt filter
    if (voucherDebtFilter === 'with_debt') {
      const debtNum = typeof v.debt === 'number' ? v.debt : parseFloat(String(v.debt || '0')) || 0;
      if (debtNum <= 0) return false;
    } else if (voucherDebtFilter === 'no_debt') {
      const debtNum = typeof v.debt === 'number' ? v.debt : parseFloat(String(v.debt || '0')) || 0;
      if (debtNum > 0) return false;
    }
    return true;
  });

  // Khu vực: Tài liệu
  const createBlankDocumentItem = (): DocumentItem => ({
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    hasContract: false,
    documentName: '',
    documentDescription: '',
    supplier: '',
    contractNumber: '',
    contractDescription: '',
    effectiveDate: '',
    expirationDate: '',
    isValid: true,
    link: '',
    uploadedFile: '',
    details: '',
  });
  const [formDocuments, setFormDocuments] = useState<DocumentItem[]>([]);
  const [viewingContractProfileDoc, setViewingContractProfileDoc] = useState<DocumentItem | null>(null);

  // Hồ sơ hợp đồng handlers
  const handleAddContractFileRow = () => {
    if (!viewingContractProfileDoc) return;
    const newRow: ContractFileItem = {
      id: `cf-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      docType: '',
      description: '',
      effectiveDate: '',
      expirationDate: '',
      isValid: true,
      link: '',
      uploadedFile: '',
    };
    const updatedFiles = [...(viewingContractProfileDoc.contractFiles || []), newRow];
    setViewingContractProfileDoc({
      ...viewingContractProfileDoc,
      contractFiles: updatedFiles,
    });
    setFormDocuments((prev) =>
      prev.map((d) =>
        d.id === viewingContractProfileDoc.id
          ? { ...d, contractFiles: updatedFiles }
          : d
      )
    );
  };

  const handleUpdateContractFileRow = (rowId: string, field: keyof ContractFileItem, value: any) => {
    if (!viewingContractProfileDoc) return;
    const updatedFiles = (viewingContractProfileDoc.contractFiles || []).map((r) =>
      r.id === rowId ? { ...r, [field]: value } : r
    );
    setViewingContractProfileDoc({
      ...viewingContractProfileDoc,
      contractFiles: updatedFiles,
    });
    setFormDocuments((prev) =>
      prev.map((d) =>
        d.id === viewingContractProfileDoc.id
          ? { ...d, contractFiles: updatedFiles }
          : d
      )
    );
  };

  const handleRemoveContractFileRow = (rowId: string) => {
    if (!viewingContractProfileDoc) return;
    const updatedFiles = (viewingContractProfileDoc.contractFiles || []).filter((r) => r.id !== rowId);
    setViewingContractProfileDoc({
      ...viewingContractProfileDoc,
      contractFiles: updatedFiles,
    });
    setFormDocuments((prev) =>
      prev.map((d) =>
        d.id === viewingContractProfileDoc.id
          ? { ...d, contractFiles: updatedFiles }
          : d
      )
    );
  };

  // Keyboard shortcut F2 for adding row and Escape for closing Hồ sơ hợp đồng
  useEffect(() => {
    if (!viewingContractProfileDoc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        handleAddContractFileRow();
      } else if (e.key === 'Escape') {
        setViewingContractProfileDoc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingContractProfileDoc]);

  // Keyboard shortcut Escape for closing full-screen RO modal
  useEffect(() => {
    if (!viewingRODiscount) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewingRODiscount(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingRODiscount]);

  // Keyboard shortcut Escape for closing campaign modal
  useEffect(() => {
    if (!campaignModalDiscount) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCampaignModalDiscount(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [campaignModalDiscount]);

  // Keyboard shortcut Escape for closing locked campaign notice modal
  useEffect(() => {
    if (!lockedCampaignDiscount) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLockedCampaignDiscount(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockedCampaignDiscount]);

  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculation helper for product row
  const calculateProductRow = (
    row: ProductDiscountItem,
    discountType: 'percentage' | 'fixed_amount',
    fieldChanged: 'vat' | 'priceBeforeVat' | 'discountPercent' | 'fixedDiscountAmount' | 'unit',
    newVal: any
  ): ProductDiscountItem => {
    let priceBeforeVat = fieldChanged === 'priceBeforeVat' ? parseFloat(newVal) || 0 : row.priceBeforeVat;
    let vat = fieldChanged === 'vat' ? parseFloat(newVal) || 0 : row.vat;
    let priceAfterVat = Math.round(priceBeforeVat * (1 + vat / 100));

    let discountPercent = row.discountPercent;
    let fixedDiscountAmount = row.fixedDiscountAmount;
    let newPriceBeforeVat = row.newPriceBeforeVat;
    let newPriceAfterVat = row.newPriceAfterVat;

    if (discountType === 'percentage') {
      const pct = fieldChanged === 'discountPercent' ? (newVal === '' ? '' : parseFloat(newVal) || 0) : (parseFloat(String(row.discountPercent)) || 0);
      discountPercent = pct;
      const numPct = typeof pct === 'number' ? pct : 0;
      const discountPreTax = priceBeforeVat * (numPct / 100);
      newPriceBeforeVat = Math.max(0, Math.round(priceBeforeVat - discountPreTax));
      newPriceAfterVat = Math.round(newPriceBeforeVat * (1 + vat / 100));
      fixedDiscountAmount = Math.round(priceAfterVat * (numPct / 100));
    } else {
      const fixAmt = fieldChanged === 'fixedDiscountAmount' ? (newVal === '' ? '' : parseFloat(newVal) || 0) : (parseFloat(String(row.fixedDiscountAmount)) || 0);
      fixedDiscountAmount = fixAmt;
      const numFix = typeof fixAmt === 'number' ? fixAmt : 0;
      newPriceAfterVat = Math.max(0, Math.round(priceAfterVat - numFix));
      newPriceBeforeVat = vat > 0 ? Math.max(0, Math.round(newPriceAfterVat / (1 + vat / 100))) : newPriceAfterVat;
      discountPercent = priceAfterVat > 0 ? Number(((numFix / priceAfterVat) * 100).toFixed(1)) : 0;
    }

    return {
      ...row,
      priceBeforeVat,
      vat,
      priceAfterVat,
      discountPercent,
      fixedDiscountAmount,
      newPriceBeforeVat,
      newPriceAfterVat,
    };
  };

  // Helper formatting
  const formatCurrency = (val?: number | string) => {
    if (val === undefined || val === null || val === '') return '0 đ';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0 đ';
    return `${num.toLocaleString('vi-VN')} đ`;
  };

  const generateAutoCode = (cat: DiscountCategory) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const prefix = cat === 'Voucher' ? 'VC' : cat === 'Khách cũ giới thiệu Khách mới' ? 'GT' : 'CK';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${yyyy}-${randomSuffix}`;
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const nextNum = String(discounts.length + 1).padStart(3, '0');

    const startDate = `${yyyy}-${mm}-${dd}`;
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDd = String(nextMonth.getDate()).padStart(2, '0');
    const endMm = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const endYyyy = nextMonth.getFullYear();
    const endDate = `${endYyyy}-${endMm}-${endDd}`;

    setFormCode(`CK-${yyyy}-${nextNum}`);
    setFormName('');
    setFormDescription('');
    setFormCategory('Chiết khấu');
    setFormDiscountCode('');
    setFormStartDate(startDate);
    setFormEndDate(endDate);
    setFormStatus('active');
    setFormStackable('allow');

    // Khu vực 2 defaults
    setFormBranchScope('all');
    setFormSelectedBranches([]);
    setFormPlateColorScope('all');
    setFormSelectedPlateColors([]);
    setFormCustomerScope('all_with_new');
    setFormSelectedCustomerGroups([]);
    setFormTargetCustomers([]);

    // Khu vực 3 defaults
    setFormMaxUsageTotal('');
    setFormMaxUsagePerCustomer('');
    setFormMaxUsagePerPlate('');
    setFormDiscountMethod('order');
    setFormOrderDiscountType('percentage');
    setFormOrderPercent('10');
    setFormOrderMaxDiscountAmount('');
    setFormOrderFixedAmount('');
    setFormOrderMinOrderValue('');

    setFormProductDiscountType('percentage');
    // Preload sample items for products if user switches
    const initialProductItems: ProductDiscountItem[] = SAMPLE_GARAGE_CATALOG.slice(0, 3).map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}`,
      discountPercent: 10,
      fixedDiscountAmount: Math.round(item.priceAfterVat * 0.1),
      newPriceBeforeVat: Math.round(item.priceBeforeVat * 0.9),
      newPriceAfterVat: Math.round(item.priceAfterVat * 0.9),
      minBuyQuantity: idx === 0 ? 2 : '',
    }));
    setFormProductItems(initialProductItems);

    // Khu vực 3 (Người giới thiệu) defaults
    setReferrerDiscountMethod('order');
    setReferrerOrderDiscountType('fixed_amount');
    setReferrerOrderPercent('10');
    setReferrerOrderMaxDiscountAmount('');
    setReferrerOrderFixedAmount('200000');
    setReferrerProductDiscountType('percentage');
    setReferrerProductItems([]);

    // Gửi Mã quà tặng cho người giới thiệu defaults (mặc định un-tick)
    setFormSendReferrerGiftCode(false);
    setFormReferrerCodePrefix('QT-');
    setFormReferrerCodeSuffixType('STT tăng dần');
    setFormReferrerValidityDays('30');
    setFormReferrerSendChannels(['SMS', 'Zalo OA', 'Email']);

    // Khu vực: Tài liệu (mặc định 1 dòng trống khi thêm mới)
    setFormDocuments([createBlankDocumentItem()]);
    setFormVouchersList([]);
    setReferralCodeMethod('phone');

    setFormError('');
    setShowStartDateInfo(false);
    setShowMinBuyQtyInfo(false);
    setCustomerAppliedToast(null);
    setEditingDiscount(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (discount: DiscountRecord) => {
    setEditingDiscount(discount);
    setFormCode(discount.code);
    setFormName(discount.name);
    setFormDescription(discount.description || '');
    setFormCategory(discount.category || 'Chiết khấu');
    setFormDiscountCode(discount.discountCode || '');
    setFormStartDate(discount.startDate);
    setFormEndDate(discount.endDate);
    setFormStatus(discount.status === 'paused' ? 'paused' : 'active');
    setFormStackable(discount.stackable || (discount.allowStacking !== false ? 'allow' : 'disallow'));

    // Khu vực 2
    setFormBranchScope(discount.branchScope || 'all');
    setFormSelectedBranches(discount.selectedBranches || []);
    setFormPlateColorScope(discount.plateColorScope || 'all');
    setFormSelectedPlateColors(discount.selectedPlateColors || []);
    setFormCustomerScope(discount.customerScope || 'all');
    setFormSelectedCustomerGroups(discount.selectedCustomerGroups || []);
    setFormTargetCustomers(discount.targetCustomers || []);

    // Khu vực 3
    setFormMaxUsageTotal(discount.maxUsageTotal !== undefined && discount.maxUsageTotal !== null ? String(discount.maxUsageTotal) : '');
    setFormMaxUsagePerCustomer(discount.maxUsagePerCustomer !== undefined && discount.maxUsagePerCustomer !== null ? String(discount.maxUsagePerCustomer) : '');
    setFormMaxUsagePerPlate(discount.maxUsagePerPlate !== undefined && discount.maxUsagePerPlate !== null ? String(discount.maxUsagePerPlate) : '');
    setFormDiscountMethod(discount.discountMethod || 'order');
    setFormOrderDiscountType(discount.orderDiscountType || 'percentage');
    setFormOrderPercent(discount.orderPercent !== undefined ? String(discount.orderPercent) : '10');
    setFormOrderMaxDiscountAmount(discount.orderMaxDiscountAmount !== undefined ? String(discount.orderMaxDiscountAmount) : '');
    setFormOrderFixedAmount(discount.orderFixedAmount !== undefined ? String(discount.orderFixedAmount) : '');
    setFormOrderMinOrderValue(discount.orderMinOrderValue !== undefined ? String(discount.orderMinOrderValue) : '');

    setFormProductDiscountType(discount.productDiscountType || 'percentage');
    setFormProductItems(discount.productItems || []);

    // Khu vực 3 (Người giới thiệu)
    setReferrerDiscountMethod(discount.referrerDiscountMethod || 'order');
    setReferrerOrderDiscountType(discount.referrerOrderDiscountType || 'fixed_amount');
    setReferrerOrderPercent(discount.referrerOrderPercent !== undefined ? String(discount.referrerOrderPercent) : '10');
    setReferrerOrderMaxDiscountAmount(discount.referrerOrderMaxDiscountAmount !== undefined ? String(discount.referrerOrderMaxDiscountAmount) : '');
    setReferrerOrderFixedAmount(discount.referrerOrderFixedAmount !== undefined ? String(discount.referrerOrderFixedAmount) : '200000');
    setReferrerOrderMinOrderValue(discount.referrerOrderMinOrderValue !== undefined ? String(discount.referrerOrderMinOrderValue) : '1000000');
    setReferrerProductDiscountType(discount.referrerProductDiscountType || 'percentage');
    setReferrerProductItems(discount.referrerProductItems || []);

    // Gửi Mã quà tặng cho người giới thiệu
    setFormSendReferrerGiftCode(discount.sendReferrerGiftCode === true);
    setFormReferrerCodePrefix(discount.referrerCodePrefix || 'QT-');
    setFormReferrerCodeSuffixType(discount.referrerCodeSuffixType || 'STT tăng dần');
    setFormReferrerValidityDays(discount.referrerValidityDays !== undefined ? String(discount.referrerValidityDays) : '30');
    setFormReferrerSendChannels(discount.referrerSendChannels && discount.referrerSendChannels.length > 0 ? discount.referrerSendChannels : ['SMS', 'Zalo OA', 'Email']);

    // Khu vực: Tài liệu
    setFormDocuments(discount.documents && discount.documents.length > 0 ? discount.documents : [createBlankDocumentItem()]);
    setFormVouchersList(discount.vouchersList || []);
    setReferralCodeMethod(discount.referralCodeMethod || 'phone');

    setFormError('');
    setShowStartDateInfo(false);
    setShowMinBuyQtyInfo(false);
    setCustomerAppliedToast(null);
    setIsAddModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveDiscount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      setFormError('Vui lòng nhập đầy đủ Tên chương trình / chiến dịch và Mã chương trình / chiến dịch.');
      return;
    }
    if (!formStartDate || !formEndDate) {
      setFormError('Vui lòng chọn Ngày hiệu lực và Ngày hết hiệu lực.');
      return;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    // Compute display value and type for list view compatibility
    let val = 0;
    let generalType: 'percentage' | 'fixed_amount' = 'percentage';
    if (formDiscountMethod === 'order') {
      if (formOrderDiscountType === 'percentage') {
        val = parseFloat(formOrderPercent) || 0;
        generalType = 'percentage';
      } else {
        val = parseFloat(formOrderFixedAmount) || 0;
        generalType = 'fixed_amount';
      }
    } else {
      generalType = formProductDiscountType;
      val = formProductItems.length > 0 ? (typeof formProductItems[0].discountPercent === 'number' ? formProductItems[0].discountPercent : parseFloat(String(formProductItems[0].discountPercent)) || 0) : 0;
    }

    const recordData: Omit<DiscountRecord, 'id'> = {
      code: formCode.trim(),
      discountCode: formCategory === 'Chiết khấu' ? formDiscountCode.trim() : undefined,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      type: generalType,
      value: val,
      targetAudience:
        formCustomerScope === 'new_customer'
          ? 'Khách hàng mới'
          : formCustomerScope === 'all_with_new'
          ? 'Khách hàng mới và Khách hàng Hiện hữu'
          : formCustomerScope === 'all' || formCustomerScope === 'all_existing'
          ? 'Khách hàng hiện hữu'
          : formSelectedCustomerGroups.length > 0
          ? formSelectedCustomerGroups.join(', ')
          : `${formTargetCustomers.length} khách hàng chỉ định`,
      minOrderValue: parseFloat(formOrderMinOrderValue) || 0,
      maxDiscountAmount: parseFloat(formOrderMaxDiscountAmount) || 0,
      startDate: formStartDate,
      endDate: formEndDate,
      status: formStatus === 'active' ? 'active' : 'paused',
      statusDisplay: formStatus === 'active' ? 'Mở khóa' : 'Khóa',
      stackable: formStackable,
      allowStacking: formStackable === 'allow',
      roCount: editingDiscount ? editingDiscount.roCount ?? 0 : 0,
      campaignRunCount: editingDiscount ? editingDiscount.campaignRunCount ?? 0 : 0,
      createdAt: editingDiscount ? editingDiscount.createdAt : `${dd}/${mm}/${yyyy}`,

      // Khu vực 2
      branchScope: formBranchScope,
      selectedBranches: formSelectedBranches,
      plateColorScope: formPlateColorScope,
      selectedPlateColors: formSelectedPlateColors,
      customerScope: formCustomerScope,
      selectedCustomerGroups: formSelectedCustomerGroups,
      targetCustomers: formTargetCustomers,

      // Khu vực 3
      maxUsageTotal: formMaxUsageTotal !== '' ? parseInt(formMaxUsageTotal, 10) : undefined,
      maxUsagePerCustomer: formMaxUsagePerCustomer !== '' ? parseInt(formMaxUsagePerCustomer, 10) : undefined,
      maxUsagePerPlate: formMaxUsagePerPlate !== '' ? parseInt(formMaxUsagePerPlate, 10) : undefined,
      discountMethod: formDiscountMethod,
      orderDiscountType: formOrderDiscountType,
      orderPercent: formOrderPercent,
      orderMaxDiscountAmount: formOrderMaxDiscountAmount,
      orderFixedAmount: formOrderFixedAmount,
      orderMinOrderValue: formOrderMinOrderValue,
      productDiscountType: formProductDiscountType,
      productItems: formProductItems,

      // Thiết lập cho Người giới thiệu (Khách hiện hữu) khi Loại = "Khách cũ giới thiệu Khách mới"
      referrerDiscountMethod: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerDiscountMethod : undefined,
      referrerOrderDiscountType: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerOrderDiscountType : undefined,
      referrerOrderPercent: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerOrderPercent : undefined,
      referrerOrderMaxDiscountAmount: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerOrderMaxDiscountAmount : undefined,
      referrerOrderFixedAmount: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerOrderFixedAmount : undefined,
      referrerOrderMinOrderValue: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerOrderMinOrderValue : undefined,
      referrerProductDiscountType: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerProductDiscountType : undefined,
      referrerProductItems: formCategory === 'Khách cũ giới thiệu Khách mới' ? referrerProductItems : [],

      // Gửi Mã quà tặng cho người giới thiệu
      sendReferrerGiftCode: formCategory === 'Khách cũ giới thiệu Khách mới' ? formSendReferrerGiftCode : undefined,
      referrerCodePrefix: formCategory === 'Khách cũ giới thiệu Khách mới' ? formReferrerCodePrefix : undefined,
      referrerCodeSuffixType: formCategory === 'Khách cũ giới thiệu Khách mới' ? formReferrerCodeSuffixType : undefined,
      referrerValidityDays: formCategory === 'Khách cũ giới thiệu Khách mới' ? formReferrerValidityDays : undefined,
      referrerSendChannels: formCategory === 'Khách cũ giới thiệu Khách mới' ? formReferrerSendChannels : undefined,

      // Khu vực: Tài liệu
      documents: formDocuments,

      // Quản lý Voucher
      vouchersList: formVouchersList,
      referralCodeMethod: formCategory === 'Khách cũ giới thiệu Khách mới' ? referralCodeMethod : undefined,
    };

    if (editingDiscount) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === editingDiscount.id ? { ...recordData, id: d.id } : d))
      );
      setEditingDiscount(null);
    } else {
      const newDiscount: DiscountRecord = {
        ...recordData,
        id: `disc-${Date.now()}`,
      };
      setDiscounts((prev) => [newDiscount, ...prev]);
    }
    setIsAddModalOpen(false);
  };

  // Toggle status directly in table
  const handleToggleStatus = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus: DiscountRecord['status'] = d.status === 'active' ? 'paused' : 'active';
          return {
            ...d,
            status: nextStatus,
            statusDisplay: nextStatus === 'active' ? 'Mở khóa' : 'Khóa',
          };
        }
        return d;
      })
    );
  };

  // Chạy chiến dịch - Nếu Trạng thái = Khóa thì thông báo Tính năng đang tạm khóa, nếu Mở khóa thì hiển thị popup chạy chiến dịch
  const handleOpenCampaignModal = (discount: DiscountRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (discount.status === 'paused' || discount.statusDisplay === 'Khóa') {
      setLockedCampaignDiscount(discount);
      return;
    }
    setCampaignModalDiscount(discount);
  };

  const handleCloseCampaignModal = () => {
    setCampaignModalDiscount(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    setDiscounts((prev) => prev.filter((d) => !selectedRows.includes(d.id)));
    setSelectedRows([]);
    setIsDeleteConfirmOpen(false);
  };

  // Apply Customer Groups logic
  const handleApplyCustomerGroups = () => {
    if (formSelectedCustomerGroups.length === 0) {
      setCustomerAppliedToast('Vui lòng chọn ít nhất 1 nhóm khách hàng trước khi bấm Áp dụng.');
      setTimeout(() => setCustomerAppliedToast(null), 3500);
      return;
    }

    const matched = EXISTING_CUSTOMERS_IN_MODULE.filter((c) =>
      formSelectedCustomerGroups.includes(c.customerGroup)
    );

    // Merge without duplicates by customerCode
    const existingCodes = new Set(formTargetCustomers.map((c) => c.customerCode));
    const newItems: CustomerTargetItem[] = matched
      .filter((c) => !existingCodes.has(c.customerCode))
      .map((c) => ({
        id: `cust-row-${Date.now()}-${c.id}`,
        customerCode: c.customerCode,
        customerName: c.customerName,
        address: c.address,
        phone: c.phone,
        email: c.email,
        taxCode: c.taxCode,
      }));

    const updated = [...formTargetCustomers, ...newItems];
    setFormTargetCustomers(updated);
    setCustomerAppliedToast(
      `Đã tự động điền ${newItems.length} khách hàng thuộc nhóm [${formSelectedCustomerGroups.join(', ')}] vào bảng!`
    );
    setTimeout(() => setCustomerAppliedToast(null), 4000);
  };

  // Add empty row to customer table
  const handleAddCustomerRow = () => {
    const newRow: CustomerTargetItem = {
      id: `cust-row-${Date.now()}`,
      customerCode: `KH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: '',
      address: '',
      phone: '',
      email: '',
      taxCode: '',
    };
    setFormTargetCustomers((prev) => [...prev, newRow]);
  };

  // Remove customer row
  const handleRemoveCustomerRow = (id: string) => {
    setFormTargetCustomers((prev) => prev.filter((r) => r.id !== id));
  };

  // Add row to product table
  const handleAddProductRow = (catalogItem?: typeof SAMPLE_GARAGE_CATALOG[0]) => {
    const base = catalogItem || {
      itemCode: `VT-${Math.floor(1000 + Math.random() * 9000)}`,
      itemName: 'Hàng hóa / phụ tùng mới',
      unit: 'Cái',
      vat: 10,
      priceBeforeVat: 100000,
      priceAfterVat: 110000,
    };

    let discountPercent = formProductDiscountType === 'percentage' ? 10 : 0;
    let fixedDiscountAmount = formProductDiscountType === 'percentage' ? Math.round(base.priceAfterVat * 0.1) : 20000;
    let newPriceBeforeVat = Math.round(base.priceBeforeVat * 0.9);
    let newPriceAfterVat = Math.round(base.priceAfterVat * 0.9);

    if (formProductDiscountType === 'fixed_amount') {
      newPriceAfterVat = Math.max(0, base.priceAfterVat - 20000);
      newPriceBeforeVat = Math.round(newPriceAfterVat / (1 + base.vat / 100));
      discountPercent = Number(((20000 / base.priceAfterVat) * 100).toFixed(1));
    }

    const newRow: ProductDiscountItem = {
      id: `prod-row-${Date.now()}`,
      itemCode: base.itemCode,
      itemName: base.itemName,
      unit: base.unit,
      vat: base.vat,
      priceBeforeVat: base.priceBeforeVat,
      priceAfterVat: base.priceAfterVat,
      discountPercent,
      fixedDiscountAmount,
      newPriceBeforeVat,
      newPriceAfterVat,
      minBuyQuantity: '',
    };
    setFormProductItems((prev) => [...prev, newRow]);
  };

  const handleRemoveProductRow = (id: string) => {
    setFormProductItems((prev) => prev.filter((r) => r.id !== id));
  };

  // Khu vực: Tài liệu handlers
  const handleAddDocumentRow = () => {
    setFormDocuments((prev) => [...prev, createBlankDocumentItem()]);
  };

  const handleRemoveDocumentRow = (id: string) => {
    setFormDocuments((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleHasContract = (docId: string, checked: boolean) => {
    setFormDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        if (checked) {
          // Khi tick ở cột Có hợp đồng:
          const availableSuppliers = Array.from(new Set(SALES_CONTRACT_CATALOG.map((c) => c.supplierName)));
          const targetSupplier = d.supplier && availableSuppliers.includes(d.supplier)
            ? d.supplier
            : availableSuppliers[0];
          const contracts = SALES_CONTRACT_CATALOG.filter((c) => c.supplierName === targetSupplier);
          const firstContract = contracts[0];

          return {
            ...d,
            hasContract: true,
            supplier: targetSupplier,
            contractNumber: firstContract?.contractNumber || '',
            contractDescription: firstContract?.contractDescription || d.contractDescription,
            documentName: d.documentName || firstContract?.documentName || '',
            documentDescription: d.documentDescription || firstContract?.contractDescription || '',
            effectiveDate: firstContract?.effectiveDate || d.effectiveDate,
            expirationDate: firstContract?.expirationDate || d.expirationDate,
            isValid: firstContract ? firstContract.isValid : d.isValid,
            link: firstContract?.link || d.link,
            uploadedFile: firstContract?.uploadedFile || d.uploadedFile,
            details: firstContract?.scopeNotes || d.details,
          };
        } else {
          // Khi un-tick
          return {
            ...d,
            hasContract: false,
            supplier: '',
            contractNumber: '',
            contractDescription: '',
          };
        }
      })
    );
  };

  const handleSupplierChange = (docId: string, supplierName: string) => {
    const contracts = SALES_CONTRACT_CATALOG.filter((c) => c.supplierName === supplierName);
    const firstContract = contracts[0];

    setFormDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        if (firstContract) {
          return {
            ...d,
            supplier: supplierName,
            contractNumber: firstContract.contractNumber,
            contractDescription: firstContract.contractDescription,
            documentName: d.documentName || firstContract.documentName,
            documentDescription: d.documentDescription || firstContract.contractDescription,
            effectiveDate: firstContract.effectiveDate,
            expirationDate: firstContract.expirationDate,
            isValid: firstContract.isValid,
            link: firstContract.link,
            uploadedFile: firstContract.uploadedFile,
            details: firstContract.scopeNotes,
          };
        }
        return {
          ...d,
          supplier: supplierName,
          contractNumber: '',
        };
      })
    );
  };

  const handleContractNumberChange = (docId: string, contractNum: string, currentSupplier: string) => {
    const matched = SALES_CONTRACT_CATALOG.find(
      (c) => (c.supplierName === currentSupplier || !currentSupplier) && c.contractNumber === contractNum
    ) || SALES_CONTRACT_CATALOG.find((c) => c.contractNumber === contractNum);

    setFormDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        if (matched) {
          return {
            ...d,
            contractNumber: contractNum,
            supplier: matched.supplierName,
            contractDescription: matched.contractDescription,
            documentName: d.documentName || matched.documentName,
            documentDescription: d.documentDescription || matched.contractDescription,
            effectiveDate: matched.effectiveDate,
            expirationDate: matched.expirationDate,
            isValid: matched.isValid,
            link: matched.link,
            uploadedFile: matched.uploadedFile,
            details: matched.scopeNotes,
          };
        }
        return {
          ...d,
          contractNumber: contractNum,
        };
      })
    );
  };

  // Export Excel / CSV
  const handleExportExcel = () => {
    const headers = [
      'STT',
      'Mã chương trình / chiến dịch',
      'Tên chương trình / chiến dịch',
      'Loại',
      'Ngày hiệu lực',
      'Ngày hết hiệu lực',
      'Trạng thái',
      'Ngày tạo',
      'Tổng lượt tối đa',
      'Số lượng RO',
    ];
    const rows = filteredDiscounts.map((d, idx) => [
      idx + 1,
      `"${d.code}"`,
      `"${d.name}"`,
      `"${d.category || (d.type === 'percentage' ? 'Chiết khấu' : 'Voucher')}"`,
      `"${d.startDate}"`,
      `"${d.endDate}"`,
      d.status === 'active' ? '"Mở khóa"' : '"Khóa"',
      `"${d.createdAt}"`,
      d.maxUsageTotal !== undefined && d.maxUsageTotal !== null && d.maxUsageTotal !== ''
        ? d.maxUsageTotal
        : '"Không giới hạn"',
      d.roCount ?? 0,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'quan_ly_chiet_khau.csv');
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

      const imported: DiscountRecord[] = [];
      const today = new Date().toLocaleDateString('vi-VN');

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((col) => col.replace(/^"|"$/g, '').trim());
        if (cols.length >= 3) {
          const isVoucher = (cols[3] || '').toLowerCase().includes('voucher');
          const isLocked = (cols[6] || '').toLowerCase().includes('khóa') && !(cols[6] || '').toLowerCase().includes('mở');
          imported.push({
            id: `disc-imp-${Date.now()}-${i}`,
            code: cols[1] || `CK-2026-${discounts.length + i + 100}`,
            name: cols[2] || 'Chương trình chiết khấu mới',
            category: isVoucher ? 'Voucher' : 'Chiết khấu',
            type: 'percentage',
            value: 10,
            targetAudience: 'Tất cả khách hàng',
            startDate: cols[4] || '2026-01-01',
            endDate: cols[5] || '2026-12-31',
            status: isLocked ? 'paused' : 'active',
            statusDisplay: isLocked ? 'Khóa' : 'Mở khóa',
            roCount: 0,
            createdAt: cols[8] || today,

            branchScope: 'all',
            selectedBranches: [],
            plateColorScope: 'all',
            selectedPlateColors: [],
            customerScope: 'all',
            selectedCustomerGroups: [],
            targetCustomers: [],

            discountMethod: 'order',
            orderDiscountType: 'percentage',
            orderPercent: '10',
            orderMaxDiscountAmount: '',
            orderFixedAmount: '',
            orderMinOrderValue: '',
            productDiscountType: 'percentage',
            productItems: [],
          });
        }
      }
      if (imported.length > 0) {
        setDiscounts((prev) => [...imported, ...prev]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered discounts
  const filteredDiscounts = React.useMemo(() => {
    return discounts.filter((d) => {
      if (appliedFilters.search.trim()) {
        const q = appliedFilters.search.trim().toLowerCase();
        const matchCode = d.code.toLowerCase().includes(q);
        const matchName = d.name.toLowerCase().includes(q);
        const matchTarget = d.targetAudience?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchTarget) {
          return false;
        }
      }

      if (appliedFilters.type !== 'ALL') {
        if (appliedFilters.type === 'Voucher' && d.category !== 'Voucher') return false;
        if (appliedFilters.type === 'Chiết khấu' && d.category !== 'Chiết khấu') return false;
        if (appliedFilters.type === 'Khách cũ giới thiệu Khách mới' && d.category !== 'Khách cũ giới thiệu Khách mới') return false;
      }

      if (appliedFilters.status !== 'ALL') {
        if (appliedFilters.status === 'active' && d.status !== 'active') return false;
        if (appliedFilters.status === 'paused' && d.status !== 'paused') return false;
      }

      return true;
    });
  }, [discounts, appliedFilters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDiscounts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedDiscounts = filteredDiscounts.slice(startIndex, startIndex + pageSize);

  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchInput,
      type: typeInput,
      status: statusInput,
      target: targetInput,
    });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setTypeInput('ALL');
    setStatusInput('ALL');
    setTargetInput('ALL');
    setAppliedFilters({
      search: '',
      type: 'ALL',
      status: 'ALL',
      target: 'ALL',
    });
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedDiscounts.map((d) => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: DiscountRecord['status']) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Unlock className="w-3.5 h-3.5" />
          Mở khóa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Lock className="w-3.5 h-3.5" />
        Khóa
      </span>
    );
  };

  const handleAddProductItemTo = (
    setItems: React.Dispatch<React.SetStateAction<ProductDiscountItem[]>>,
    currentProdType: 'percentage' | 'fixed_amount',
    catalogItem?: typeof SAMPLE_GARAGE_CATALOG[0]
  ) => {
    const base = catalogItem || {
      itemCode: `VT-${Math.floor(1000 + Math.random() * 9000)}`,
      itemName: 'Hàng hóa / phụ tùng mới',
      unit: 'Cái',
      vat: 10,
      priceBeforeVat: 100000,
      priceAfterVat: 110000,
    };

    let discountPercent = currentProdType === 'percentage' ? 10 : 0;
    let fixedDiscountAmount = currentProdType === 'percentage' ? Math.round(base.priceAfterVat * 0.1) : 20000;
    let newPriceBeforeVat = Math.round(base.priceBeforeVat * 0.9);
    let newPriceAfterVat = Math.round(base.priceAfterVat * 0.9);

    if (currentProdType === 'fixed_amount') {
      newPriceAfterVat = Math.max(0, base.priceAfterVat - 20000);
      newPriceBeforeVat = Math.round(newPriceAfterVat / (1 + base.vat / 100));
      discountPercent = Number(((20000 / base.priceAfterVat) * 100).toFixed(1));
    }

    const newRow: ProductDiscountItem = {
      id: `prod-row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      itemCode: base.itemCode,
      itemName: base.itemName,
      unit: base.unit,
      vat: base.vat,
      priceBeforeVat: base.priceBeforeVat,
      priceAfterVat: base.priceAfterVat,
      discountPercent,
      fixedDiscountAmount,
      newPriceBeforeVat,
      newPriceAfterVat,
      minBuyQuantity: '',
    };
    setItems((prev) => [...prev, newRow]);
  };

  const renderDiscountSetupFields = (
    method: 'order' | 'product',
    setMethod: (v: 'order' | 'product') => void,
    orderType: 'percentage' | 'fixed_amount',
    setOrderType: (v: 'percentage' | 'fixed_amount') => void,
    orderPercent: string,
    setOrderPercent: (v: string) => void,
    orderMaxDiscountAmount: string,
    setOrderMaxDiscountAmount: (v: string) => void,
    orderFixedAmount: string,
    setOrderFixedAmount: (v: string) => void,
    orderMinOrderValue: string,
    setOrderMinOrderValue: (v: string) => void,
    productType: 'percentage' | 'fixed_amount',
    setProductType: (v: 'percentage' | 'fixed_amount') => void,
    productItems: ProductDiscountItem[],
    setProductItems: React.Dispatch<React.SetStateAction<ProductDiscountItem[]>>,
    scopeKey: string,
    accent: 'blue' | 'emerald' = 'blue'
  ) => {
    const isEmerald = accent === 'emerald';
    const activeBtnClass = isEmerald ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#1A73E8] text-white shadow-xs';
    const activeSubBtnClass = isEmerald ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#1A73E8] text-white shadow-xs';
    const borderFocusClass = isEmerald ? 'focus:border-emerald-600' : 'focus:border-[#1A73E8]';
    const boxBg = isEmerald ? 'bg-emerald-50/40 border-emerald-100' : 'bg-blue-50/40 border-blue-100';

    return (
      <div className="space-y-5">
        {/* 1. Chọn 1 trong 2: Chiết khấu theo đơn vs Chiết khấu theo sản phẩm */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Hình thức áp dụng: <span className="text-red-500">*</span>
          </label>
          <div className="inline-flex items-center p-1.5 bg-gray-100 rounded-xl border border-gray-200 gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setMethod('order')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                method === 'order' ? activeBtnClass : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Chiết khấu theo đơn (Áp dụng trên tổng giá trị RO)
            </button>

            <button
              type="button"
              onClick={() => setMethod('product')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                method === 'product' ? activeBtnClass : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Chiết khấu theo sản phẩm
            </button>
          </div>
        </div>

        {/* TRƯỜNG HỢP A: Chiết khấu theo đơn */}
        {method === 'order' && (
          <div className={`p-5 rounded-xl border space-y-5 animate-fadeIn ${boxBg}`}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Kiểu chiết khấu đơn hàng:
              </label>
              <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOrderType('percentage')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    orderType === 'percentage' ? activeSubBtnClass : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  Theo tỉ lệ phần trăm (%)
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('fixed_amount')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    orderType === 'fixed_amount' ? activeSubBtnClass : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Theo Số tiền cố định
                </button>
              </div>
            </div>

            {/* Khi tick vào "Theo tỉ lệ phần trăm (%)" */}
            {orderType === 'percentage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số phần trăm (%) giảm giá: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={orderPercent}
                      onChange={(e) => setOrderPercent(e.target.value)}
                      placeholder="VD: 10"
                      className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none font-semibold bg-white ${borderFocusClass}`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-gray-400 font-bold text-sm pointer-events-none">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Số tiền giảm giá tối đa (VNĐ):
                    </label>
                    <span
                      className="inline-flex items-center text-gray-400 hover:text-blue-600 cursor-pointer"
                      title="Để trống, nếu không giới hạn"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                    <span className="text-[11px] text-gray-500 italic">
                      (Để trống, nếu không giới hạn)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={orderMaxDiscountAmount}
                      onChange={(e) => setOrderMaxDiscountAmount(e.target.value)}
                      placeholder="Để trống nếu không giới hạn tối đa"
                      className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white font-medium ${borderFocusClass}`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Khi tick vào "Theo số tiền cố định" */}
            {orderType === 'fixed_amount' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số tiền giảm giá (VNĐ): <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={orderFixedAmount}
                      onChange={(e) => setOrderFixedAmount(e.target.value)}
                      placeholder="VD: 200000"
                      className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white font-semibold ${borderFocusClass}`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Giá trị đơn hàng tối thiểu (VNĐ):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={orderMinOrderValue}
                      onChange={(e) => setOrderMinOrderValue(e.target.value)}
                      placeholder="VD: 1000000"
                      className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white font-medium ${borderFocusClass}`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRƯỜNG HỢP B: Chiết khấu theo sản phẩm */}
        {method === 'product' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Kiểu chiết khấu sản phẩm:
                </div>
                <div className="text-[11px] text-gray-500">
                  Chọn cách thức tính chiết khấu cho bảng hàng hóa vật tư bên dưới
                </div>
              </div>

              <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setProductType('percentage');
                    setProductItems((prev) =>
                      prev.map((r) => calculateProductRow(r, 'percentage', 'discountPercent', r.discountPercent || 10))
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    productType === 'percentage' ? activeSubBtnClass : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  Chiết khấu theo tỉ lệ phần trăm (%)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProductType('fixed_amount');
                    setProductItems((prev) =>
                      prev.map((r) => calculateProductRow(r, 'fixed_amount', 'fixedDiscountAmount', r.fixedDiscountAmount || 20000))
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    productType === 'fixed_amount' ? activeSubBtnClass : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Chiết khấu theo số tiền cố định
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#1A73E8]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Bảng Hàng hóa vật tư áp dụng ({productItems.length} mục)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const found = SAMPLE_GARAGE_CATALOG.find((c) => c.itemCode === e.target.value);
                      if (found) {
                        handleAddProductItemTo(setProductItems, productType, found);
                      }
                      e.target.value = '';
                    }}
                    className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="">+ Chọn nhanh từ kho vật tư mẫu...</option>
                    {SAMPLE_GARAGE_CATALOG.map((cat) => (
                      <option key={cat.itemCode} value={cat.itemCode}>
                        {cat.itemCode} - {cat.itemName} ({formatCurrency(cat.priceAfterVat)})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleAddProductItemTo(setProductItems, productType)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      isEmerald ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#1A73E8] hover:bg-blue-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm dòng
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-gray-100/90 text-gray-700 border-b border-gray-200 font-bold z-10 whitespace-nowrap">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">STT</th>
                      <th className="py-2.5 px-3 min-w-[110px]">Mã Hàng hóa vật tư</th>
                      <th className="py-2.5 px-3 min-w-[170px]">Tên Hàng hóa vật tư</th>
                      <th className="py-2.5 px-2 w-16">Đơn vị tính</th>
                      <th className="py-2.5 px-2 w-20 text-center">Thuế VAT (%)</th>
                      <th className="py-2.5 px-3 min-w-[110px] text-right">Giá bán (chưa thuế)</th>
                      <th className="py-2.5 px-3 min-w-[110px] text-right">Giá bán (có thuế)</th>
                      <th className="py-2.5 px-3 min-w-[100px] text-center bg-blue-50/50">CK theo tỉ lệ %</th>
                      <th className="py-2.5 px-3 min-w-[120px] text-right bg-blue-50/50">Số tiền giảm giá cố định</th>
                      <th className="py-2.5 px-3 min-w-[110px] text-right text-emerald-700">Giá bán mới (chưa thuế)</th>
                      <th className="py-2.5 px-3 min-w-[110px] text-right text-emerald-700 font-extrabold">Giá bán mới (có thuế)</th>
                      <th className="py-2.5 px-3 min-w-[150px]">
                        <div className="flex items-center gap-1.5 relative group">
                          <span>Số lượng mua tối thiểu</span>
                          <span
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                            title={"Để trống: Không ràng buộc (Đơn hàng bao nhiêu tiền cũng được giảm giá).\nNếu nhập vào: Phải đạt số lượng tổng tiền này mới được áp dụng Chiết khấu."}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </th>
                      <th className="py-2.5 px-2 text-center w-10">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productItems.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-8 text-center text-gray-400">
                          Chưa có mặt hàng nào trong bảng. Chọn nhanh từ danh mục mẫu hoặc bấm "+ Thêm dòng".
                        </td>
                      </tr>
                    ) : (
                      productItems.map((prod, idx) => (
                        <tr key={prod.id} className="hover:bg-blue-50/20">
                          <td className="py-2 px-2 text-center text-gray-500 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={prod.itemCode}
                              onChange={(e) => {
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) => (p.id === prod.id ? { ...p, itemCode: v } : p))
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-mono font-medium"
                              placeholder="Mã VT"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={prod.itemName}
                              onChange={(e) => {
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) => (p.id === prod.id ? { ...p, itemName: v } : p))
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-medium"
                              placeholder="Tên vật tư"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={prod.unit}
                              onChange={(e) => {
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) => (p.id === prod.id ? { ...p, unit: v } : p))
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center"
                              placeholder="ĐVT"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={prod.vat}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value) || 0;
                                setProductItems((prev) =>
                                  prev.map((p) =>
                                    p.id === prod.id
                                      ? calculateProductRow(p, productType, 'vat', v)
                                      : p
                                  )
                                );
                              }}
                              className="w-full px-1 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center bg-white cursor-pointer"
                            >
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={8}>8%</option>
                              <option value={10}>10%</option>
                            </select>
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="number"
                              min="0"
                              step="5000"
                              value={prod.priceBeforeVat}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value) || 0;
                                setProductItems((prev) =>
                                  prev.map((p) =>
                                    p.id === prod.id
                                      ? calculateProductRow(p, productType, 'priceBeforeVat', v)
                                      : p
                                  )
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-right font-medium"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-gray-800">
                            {formatCurrency(prod.priceAfterVat)}
                          </td>
                          <td className={`py-1.5 px-2 ${productType === "percentage" ? "bg-blue-50/30" : "bg-gray-100/60"}`}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              readOnly={productType === "fixed_amount"}
                              value={productType === "fixed_amount" ? "" : prod.discountPercent}
                              onChange={(e) => {
                                if (productType === "fixed_amount") return;
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) =>
                                    p.id === prod.id
                                      ? calculateProductRow(p, "percentage", "discountPercent", v)
                                      : p
                                  )
                                );
                              }}
                              className={`w-full px-2 py-1 border rounded text-xs outline-none text-center font-bold ${
                                productType === "fixed_amount"
                                  ? "bg-gray-100 text-transparent border-gray-200 cursor-not-allowed select-none placeholder:text-transparent"
                                  : "bg-white border-blue-200 text-[#1A73E8] focus:border-[#1A73E8]"
                              }`}
                              placeholder={productType === "fixed_amount" ? "" : "%"}
                            />
                          </td>
                          <td className={`py-1.5 px-2 ${productType === "fixed_amount" ? "bg-blue-50/30" : "bg-gray-100/60"}`}>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              readOnly={productType === "percentage"}
                              value={productType === "percentage" ? "" : prod.fixedDiscountAmount}
                              onChange={(e) => {
                                if (productType === "percentage") return;
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) =>
                                    p.id === prod.id
                                      ? calculateProductRow(p, "fixed_amount", "fixedDiscountAmount", v)
                                      : p
                                  )
                                );
                              }}
                              className={`w-full px-2 py-1 border rounded text-xs outline-none text-right font-semibold ${
                                productType === "percentage"
                                  ? "bg-gray-100 text-transparent border-gray-200 cursor-not-allowed select-none placeholder:text-transparent"
                                  : "bg-white border-blue-200 text-gray-800 focus:border-[#1A73E8]"
                              }`}
                              placeholder={productType === "percentage" ? "" : "Số tiền giảm"}
                            />
                          </td>
                          <td className="py-2 px-3 text-right text-gray-700 font-medium">
                            {formatCurrency(prod.newPriceBeforeVat)}
                          </td>
                          <td className="py-2 px-3 text-right text-emerald-600 font-bold">
                            {formatCurrency(prod.newPriceAfterVat)}
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="number"
                              min="0"
                              value={prod.minBuyQuantity}
                              onChange={(e) => {
                                const v = e.target.value;
                                setProductItems((prev) =>
                                  prev.map((p) =>
                                    p.id === prod.id ? { ...p, minBuyQuantity: v } : p
                                  )
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center"
                              placeholder="Để trống nếu K.buộc"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => setProductItems((prev) => prev.filter((p) => p.id !== prod.id))}
                              className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Xóa dòng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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

      {/* Top Action & Filter Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        {/* Top Row: Action Buttons */}
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
              onClick={() => setIsDeleteConfirmOpen(true)}
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

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Tag className="w-4 h-4 text-[#1A73E8]" />
            <span>Tổng chính sách: </span>
            <span className="text-gray-900 font-bold text-sm">{discounts.length}</span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Mã, Tên chương trình..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A73E8] bg-white"
            />
          </div>

          <div>
            <select
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
            >
              <option value="ALL">-- Tất cả loại --</option>
              <option value="Chiết khấu">Chiết khấu</option>
              <option value="Voucher">Voucher</option>
              <option value="Khách cũ giới thiệu Khách mới">Khách cũ giới thiệu Khách mới</option>
            </select>
          </div>

          <div>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
            >
              <option value="ALL">-- Tất cả trạng thái --</option>
              <option value="active">Mở khóa</option>
              <option value="paused">Khóa</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyFilter}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              Lọc dữ liệu
            </button>
            <button
              type="button"
              onClick={handleClearFilter}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg text-xs transition-colors cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewlist Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-700 tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedDiscounts.length > 0 &&
                      selectedRows.length === paginatedDiscounts.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 whitespace-nowrap">MÃ CHƯƠNG TRÌNH / CHIẾN DỊCH</th>
                <th className="py-3.5 px-4 min-w-[240px]">TÊN CHƯƠNG TRÌNH / CHIẾN DỊCH</th>
                <th className="py-3.5 px-4 whitespace-nowrap">LOẠI</th>
                <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">NGÀY HIỆU LỰC - HẾT HIỆU LỰC</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 whitespace-nowrap">NGÀY TẠO</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">TỔNG LƯỢT TỐI ĐA</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">SỐ LƯỢNG RO</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center">
                        <Tag className="w-7 h-7" />
                      </div>
                      <div className="font-semibold text-gray-700 text-base">
                        Chưa có chương trình chiết khấu nào
                      </div>
                      <p className="text-gray-400 text-xs max-w-sm">
                        Nhấn nút "Thêm mới" bên trên để tạo chương trình chiết khấu / chiến dịch đầu tiên theo cấu hình 3 khu vực chuẩn.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tạo chương trình mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDiscounts.map((discount, index) => {
                  return (
                    <tr key={discount.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(discount.id)}
                          onChange={() => handleSelectRow(discount.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-3 text-center text-gray-500 align-middle">
                        {startIndex + index + 1}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewingDiscount(discount)}
                          className="font-bold text-[#1A73E8] hover:underline cursor-pointer"
                        >
                          {discount.code}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-gray-900">{discount.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {discount.discountMethod === 'product'
                            ? `Chiết khấu theo sản phẩm (${discount.productItems?.length || 0} mục)`
                            : `Chiết khấu theo đơn (${discount.orderDiscountType === 'percentage' ? `${discount.orderPercent}%` : formatCurrency(discount.orderFixedAmount)})`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                            discount.category === 'Voucher'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : discount.category === 'Khách cũ giới thiệu Khách mới'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {discount.category || 'Chiết khấu'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {discount.startDate} → {discount.endDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-center">
                        {getStatusBadge(discount.status)}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-gray-600 text-xs">
                        {discount.createdAt}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-center font-semibold text-gray-800">
                        {discount.maxUsageTotal !== undefined &&
                        discount.maxUsageTotal !== null &&
                        discount.maxUsageTotal !== '' &&
                        Number(discount.maxUsageTotal) > 0 ? (
                          Number(discount.maxUsageTotal).toLocaleString('vi-VN')
                        ) : (
                          <span className="text-gray-400 font-normal italic">Không giới hạn</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-center font-semibold text-gray-800">
                        <button
                          type="button"
                          onClick={() => handleOpenROModal(discount)}
                          className="hover:text-[#1A73E8] hover:underline cursor-pointer font-bold transition-colors"
                          title="Xem danh sách RO"
                        >
                          {discount.roCount ?? 0}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1">
                          {/* Biểu tượng Chạy chiến dịch kèm số lần nhấn nút */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenCampaignModal(discount, e)}
                            className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-md transition-all cursor-pointer group ${
                              discount.status === 'paused' || discount.statusDisplay === 'Khóa'
                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={
                              discount.status === 'paused' || discount.statusDisplay === 'Khóa'
                                ? 'Chiến dịch đang bị Khóa. Nhấn để xem thông báo.'
                                : `Chạy chiến dịch (Đã gửi ${discount.campaignRunCount ?? 0} lần - Nhấn để chạy chiến dịch)`
                            }
                          >
                            <Rocket className="w-4 h-4 transition-transform group-hover:scale-110" />
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border leading-none ${
                              discount.status === 'paused' || discount.statusDisplay === 'Khóa'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}>
                              {discount.campaignRunCount ?? 0}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenROModal(discount)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Xem RO"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingDiscount(discount)}
                            className="p-1.5 text-[#1A73E8] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(discount)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(discount.id)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              discount.status === 'active'
                                ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={
                              discount.status === 'active'
                                ? 'Khóa chính sách'
                                : 'Mở khóa chính sách'
                            }
                          >
                            {discount.status === 'active' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
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

        {/* Pagination Footer */}
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
                {filteredDiscounts.length === 0 ? 0 : startIndex + 1} -{' '}
                {Math.min(startIndex + pageSize, filteredDiscounts.length)}
              </span>{' '}
              trong tổng số{' '}
              <span className="font-semibold text-gray-800">{filteredDiscounts.length}</span>{' '}
              chính sách
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`p-1.5 border border-gray-300 rounded-md transition-colors ${
                safeCurrentPage <= 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === safeCurrentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1A73E8] text-white border-[#1A73E8]'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`p-1.5 border border-gray-300 rounded-md transition-colors ${
                safeCurrentPage >= totalPages
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN MODAL: THÊM MỚI / CHỈNH SỬA (3 KHU VỰC THEO ĐÚNG YÊU CẦU) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F4F6F9] flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Sticky Header */}
          <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDiscount(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Quay lại danh sách"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  {editingDiscount
                    ? `Chỉnh sửa chương trình: ${formCode}`
                    : 'Thêm mới chương trình chiết khấu'}
                </h2>
                <p className="text-xs text-gray-500">
                  {formCategory === 'Khách cũ giới thiệu Khách mới'
                    ? 'Cấu hình: Thông tin chung, Quản lý Mã giới thiệu, Thiết lập Voucher, Tài liệu'
                    : formCategory === 'Voucher'
                    ? 'Cấu hình: Thông tin chung, Quản lý Voucher, Thiết lập Voucher, Tài liệu'
                    : 'Cấu hình: Thông tin chung, Phạm vi áp dụng, Thiết lập chiết khấu, Tài liệu'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDiscount(null);
                }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveDiscount}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingDiscount ? 'Cập nhật chương trình' : 'Lưu chương trình'}
              </button>
            </div>
          </div>

          {/* Fullscreen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-12">
              {formError && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* Toast notify when customers applied from customer groups */}
              {customerAppliedToast && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">{customerAppliedToast}</span>
                </div>
              )}

              {/* ================================================================= */}
              {/* KHU VỰC 1: THÔNG TIN CHUNG */}
              {/* ================================================================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Thông tin chung
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Tên chương trình / chiến dịch */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tên chương trình / chiến dịch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Nhập tên chương trình hoặc chiến dịch chiết khấu..."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-blue-100"
                    />
                  </div>

                  {/* Mã chương trình / chiến dịch: nhập text hoặc tự tạo */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Mã chương trình / chiến dịch <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormCode(generateAutoCode(formCategory))}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A73E8] hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        Tự tạo mã
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        placeholder="Nhập mã chương trình / chiến dịch hoặc nhấn Tự tạo..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-blue-100 font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Mô tả chung: trước field Ngày bắt đầu cùng dòng */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Mô tả chung
                    </label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Nhập mô tả chung..."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-blue-100 bg-white"
                    />
                  </div>

                  {/* Ngày hiệu lực + biểu tượng thông báo 2 dòng */}
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Ngày hiệu lực <span className="text-red-500">*</span>
                      </label>
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setShowStartDateInfo(!showStartDateInfo)}
                          onMouseEnter={() => setShowStartDateInfo(true)}
                          onMouseLeave={() => setShowStartDateInfo(false)}
                          className="p-0.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                          title="Nhấn để xem quy tắc áp dụng ngày hiệu lực"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {showStartDateInfo && (
                          <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white rounded-lg shadow-xl text-xs z-30 animate-fadeIn border border-gray-700 pointer-events-none">
                            <div className="font-medium text-blue-300 pb-1 border-b border-gray-800 mb-1.5">
                              Quy tắc tính ngày hiệu lực:
                            </div>
                            <div className="leading-relaxed space-y-1 text-gray-200">
                              <div>
                                <span className="font-semibold text-amber-300">Đối với</span> Dịch vụ: áp dụng theo ngày tạo Phiếu tiếp nhận
                              </div>
                              <div>
                                <span className="font-semibold text-emerald-300">Đối với</span> Bán hàng: áp dụng theo ngày tạo Chứng từ bán hàng
                              </div>
                            </div>
                            <div className="absolute left-3 top-full w-2 h-2 bg-gray-900 transform rotate-45 -mt-1 border-r border-b border-gray-700"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
                    />
                  </div>

                  {/* Ngày hết hiệu lực */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Ngày hết hiệu lực <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
                    />
                  </div>

                  {/* Cùng 1 dòng: Loại -> Mã Chiết khấu (khi Loại = Chiết khấu) -> Cộng dồn ưu đãi -> Trạng thái */}
                  <div className="lg:col-span-3 flex items-end gap-3 xl:gap-5 pt-1 w-full flex-nowrap">
                    {/* 1. Loại */}
                    <div className="shrink-0">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Loại <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => {
                          const newCat = e.target.value as DiscountCategory;
                          setFormCategory(newCat);
                          if (!formCode || formCode.startsWith('CK-') || formCode.startsWith('VC-') || formCode.startsWith('GT-')) {
                            setFormCode(generateAutoCode(newCat));
                          }
                          if (newCat === 'Khách cũ giới thiệu Khách mới' && formVouchersList.length === 0) {
                            const sampleReferrals: VoucherItem[] = EXISTING_CUSTOMERS_IN_MODULE.slice(0, 5).map((cust, idx) => ({
                              id: `vc-gt-preload-${idx + 1}`,
                              code: `GT-KHC-${String(idx + 1).padStart(3, '0')}`,
                              targetType: 'existing_customer',
                              status: 'available',
                              createdAt: '01/01/2026',
                              customerCode: cust.customerCode,
                              customerName: cust.customerName,
                              address: cust.address,
                              phone: cust.phone,
                              email: cust.email,
                              taxCode: cust.taxCode,
                              debt: idx % 2 === 0 ? 0 : 3500000,
                              hasCarInGarage: idx % 2 === 0 ? 'Đang có' : 'Không có',
                            }));
                            setFormVouchersList(sampleReferrals);
                          }
                        }}
                        className="min-w-[210px] px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 outline-none focus:border-[#1A73E8] bg-white cursor-pointer shadow-2xs h-[38px]"
                      >
                        <option value="Chiết khấu">Chiết khấu</option>
                        <option value="Voucher">Voucher</option>
                        <option value="Khách cũ giới thiệu Khách mới">Khách cũ giới thiệu Khách mới</option>
                      </select>
                    </div>

                    {/* Bổ sung field "Mã Chiết khấu" ở sau field "Loại" khi Loại = "Chiết khấu", ẩn đi khi Loại = "Voucher" */}
                    {formCategory === 'Chiết khấu' && (
                      <div className="shrink-0 min-w-[170px] animate-fadeIn">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Mã Chiết khấu
                        </label>
                        <input
                          type="text"
                          value={formDiscountCode}
                          onChange={(e) => setFormDiscountCode(e.target.value)}
                          placeholder="Nhập mã chiết khấu..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 outline-none focus:border-[#1A73E8] bg-white shadow-2xs h-[38px] font-mono"
                        />
                      </div>
                    )}

                    {/* 2. Cộng dồn ưu đãi */}
                    <div className="shrink-0">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Cộng dồn ưu đãi
                      </label>

                      <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200 gap-1 h-[38px]">
                        {/* Button 1 */}
                        <button
                          type="button"
                          onClick={() => setFormStackable('allow')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            formStackable === 'allow'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {formCategory === 'Chiết khấu'
                              ? 'Cho phép Cộng dồn với Voucher'
                              : 'Cho phép Cộng dồn với Chương trình Chiết khấu'}
                          </span>
                        </button>

                        {/* Button 2 */}
                        <button
                          type="button"
                          onClick={() => setFormStackable('disallow')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            formStackable === 'disallow'
                              ? 'bg-gray-700 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {formCategory === 'Chiết khấu'
                              ? 'Không cho phép Cộng dồn với Voucher'
                              : 'Không cho phép Cộng dồn với Chương trình Chiết khấu'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Trạng thái: đưa ra sau field Cộng dồn ưu đãi, trên cùng 1 dòng */}
                    <div className={`p-1.5 px-3 rounded-xl border transition-all shadow-2xs shrink-0 ${
                      formStatus === 'active'
                        ? 'bg-gradient-to-r from-emerald-50/70 to-emerald-100/30 border-emerald-300 shadow-emerald-100/40'
                        : 'bg-gradient-to-r from-amber-50/70 to-amber-100/30 border-amber-300 shadow-amber-100/40'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <span className={`w-2 h-2 rounded-full ${formStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          <span>Trạng thái</span>
                          <span className="text-red-500">*</span>

                          {/* Tooltip hiển thị giải thích tính năng Trạng thái */}
                          <div className="relative inline-flex items-center group">
                            <span
                              className="p-0.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                              title="Khóa: Vô hiệu hóa nút &quot;Chạy chiến dịch&quot; tại cột Thao tác.&#10;Mở khóa: Kích hoạt nút &quot;Chạy chiến dịch&quot; tại cột Thao tác."
                            >
                              <Info className="w-3.5 h-3.5" />
                            </span>
                            <div className="absolute left-0 bottom-full mb-2 w-72 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 font-normal leading-relaxed text-left hidden group-hover:block pointer-events-none z-50 animate-fadeIn">
                              <div className="font-semibold text-blue-300 pb-1 border-b border-gray-800 mb-1.5 flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span>Giải thích Trạng thái</span>
                              </div>
                              <div className="space-y-1.5 text-gray-200">
                                <div className="flex items-start gap-1.5">
                                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span><strong className="text-amber-300">Khóa:</strong> Vô hiệu hóa nút "Chạy chiến dịch" tại cột Thao tác.</span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span><strong className="text-emerald-300">Mở khóa:</strong> Kích hoạt nút "Chạy chiến dịch" tại cột Thao tác.</span>
                                </div>
                              </div>
                              <div className="absolute left-3 top-full w-2 h-2 bg-gray-900 transform rotate-45 -mt-1 border-r border-b border-gray-700"></div>
                            </div>
                          </div>
                        </label>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          formStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {formStatus === 'active' ? 'Mở khóa' : 'Khóa'}
                        </span>
                      </div>

                      <div className="inline-flex items-center p-0.5 bg-white rounded-lg border border-gray-300/80 shadow-2xs gap-1">
                        {/* Button 1: Mở khóa */}
                        <div className="relative group inline-flex">
                          <button
                            type="button"
                            onClick={() => setFormStatus('active')}
                            title="Mở khóa: Kích hoạt nút &quot;Chạy chiến dịch&quot; tại cột Thao tác."
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              formStatus === 'active'
                                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                            }`}
                          >
                            <Unlock className="w-3.5 h-3.5 shrink-0" />
                            <span>Mở khóa</span>
                          </button>

                          {/* Tooltip khi rê chuột vào button Mở khóa */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-40 hidden group-hover:block pointer-events-none transition-all">
                            <div className="w-64 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 font-normal leading-relaxed text-left animate-fadeIn">
                              <div className="flex items-start gap-1.5">
                                <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Mở khóa:</strong> Kích hoạt nút "Chạy chiến dịch" tại cột Thao tác.</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1 border-r border-b border-gray-700"></div>
                          </div>
                        </div>

                        {/* Button 2: Khóa */}
                        <div className="relative group inline-flex">
                          <button
                            type="button"
                            onClick={() => setFormStatus('paused')}
                            title="Khóa: Vô hiệu hóa nút &quot;Chạy chiến dịch&quot; tại cột Thao tác."
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              formStatus === 'paused'
                                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400/40'
                                : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50/60'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span>Khóa</span>
                          </button>

                          {/* Tooltip khi rê chuột vào button Khóa */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-40 hidden group-hover:block pointer-events-none transition-all">
                            <div className="w-64 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 font-normal leading-relaxed text-left animate-fadeIn">
                              <div className="flex items-start gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span><strong>Khóa:</strong> Vô hiệu hóa nút "Chạy chiến dịch" tại cột Thao tác.</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1 border-r border-b border-gray-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* KHU VỰC 2: PHẠM VI ÁP DỤNG */}
              {/* ================================================================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    {formCategory === 'Khách cũ giới thiệu Khách mới'
                      ? 'Quản lý Mã giới thiệu'
                      : formCategory === 'Voucher'
                      ? 'Quản lý Voucher'
                      : 'Phạm vi áp dụng'}
                  </h3>
                </div>

                {/* 1. Chi nhánh */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Building className="w-4 h-4 text-[#1A73E8]" />
                      Chi nhánh áp dụng
                    </label>

                    {/* Button tick chọn 1 trong 2: Áp dụng tất cả chi nhánh vs Chọn từng chi nhánh */}
                    <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setFormBranchScope('all')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          formBranchScope === 'all'
                            ? 'bg-[#1A73E8] text-white shadow-xs'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Áp dụng tất cả chi nhánh
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormBranchScope('specific')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          formBranchScope === 'specific'
                            ? 'bg-[#1A73E8] text-white shadow-xs'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Chọn từng chi nhánh
                      </button>
                    </div>
                  </div>

                  {/* Khi tick vào "chọn từng chi nhánh", hiển thị field "Chi nhánh áp dụng:": cho phép chọn nhiều */}
                  {formBranchScope === 'specific' && (
                    <div className="pt-2 animate-fadeIn">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        Chi nhánh áp dụng: <span className="text-gray-400 font-normal">(cho phép chọn nhiều)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BRANCH_OPTIONS.map((br) => {
                          const isChecked = formSelectedBranches.includes(br);
                          return (
                            <button
                              key={br}
                              type="button"
                              onClick={() => {
                                setFormSelectedBranches((prev) =>
                                  isChecked ? prev.filter((b) => b !== br) : [...prev, br]
                                );
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-50 text-[#1A73E8] border-[#1A73E8] font-semibold shadow-2xs'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                                  isChecked
                                    ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                                    : 'border-gray-400 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              {br}
                            </button>
                          );
                        })}
                      </div>
                      {formSelectedBranches.length === 0 && (
                        <p className="text-[11px] text-amber-600 mt-1.5">
                          * Vui lòng chọn ít nhất một chi nhánh áp dụng.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Khi field "Loại" = "Khách cũ giới thiệu Khách mới": 2 khu vực riêng biệt, cùng dòng */}
                {formCategory === 'Khách cũ giới thiệu Khách mới' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Khu vực 1: Quản lý Mã giới thiệu */}
                    <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 flex flex-col justify-between space-y-4">
                      {/* Dòng 1: Tổng Mã giới thiệu */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng Mã giới thiệu
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formVoucherTotalCount.toLocaleString('vi-VN')}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-bold outline-none cursor-not-allowed select-none"
                        />
                      </div>

                      {/* Dòng 2: Nút Xem Danh sách Mã giới thiệu & Tạo Mã giới thiệu */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsViewVoucherListModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#1A73E8]" />
                          <span>Xem Danh sách Mã giới thiệu</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenGenerateVoucher}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tạo Mã giới thiệu</span>
                        </button>
                      </div>
                    </div>

                    {/* Khu vực 2: Khu vực riêng gồm "Tổng số đơn người mới hoàn thành" và "Xem Lịch sử Giới thiệu" */}
                    <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 flex flex-col justify-between space-y-4">
                      {/* Dòng 1 (cùng dòng với field "Tổng Mã giới thiệu"): Tổng số đơn người mới hoàn thành */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng số đơn người mới hoàn thành
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formReferralCompletedOrdersCount.toLocaleString('vi-VN')}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-bold outline-none cursor-not-allowed select-none"
                        />
                      </div>

                      {/* Dòng 2 (cùng dòng với "Xem danh sách Mã giới thiệu"): Nút Xem Lịch sử Giới thiệu */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsReferralHistoryModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <History className="w-4 h-4 text-emerald-600" />
                          <span>Xem Lịch sử Giới thiệu</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Khi field "Loại" = Voucher */}
                {formCategory === 'Voucher' && (
                  <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4">
                    {/* Dòng 1: Read-only fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1. Tổng số Voucher hiện có */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng số Voucher hiện có
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formVoucherTotalCount.toLocaleString('vi-VN')}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-bold outline-none cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 2. Tổng số Voucher dành cho Khách hàng mới */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng số Voucher dành cho Khách hàng mới
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formVoucherNewCustomerCount.toLocaleString('vi-VN')}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-bold outline-none cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 3. Tổng số Voucher dành cho Khách hàng hiện hữu */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng số Voucher dành cho Khách hàng hiện hữu
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formVoucherExistingCustomerCount.toLocaleString('vi-VN')}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-bold outline-none cursor-not-allowed select-none"
                        />
                      </div>
                    </div>

                    {/* Dòng 2: có 2 nút */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsViewVoucherListModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-[#1A73E8]" />
                        <span>Xem danh sách Voucher</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenGenerateVoucher}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tạo Voucher</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Màu sắc biển số xe (ẩn khi Loại là Voucher hoặc Khách cũ giới thiệu Khách mới) */}
                {formCategory !== 'Voucher' && formCategory !== 'Khách cũ giới thiệu Khách mới' && (
                  <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <Car className="w-4 h-4 text-amber-600" />
                        Màu sắc biển số xe
                      </label>

                      {/* Button tick chọn 1 trong 2 */}
                      <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setFormPlateColorScope('all')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formPlateColorScope === 'all'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Áp dụng tất cả màu sắc biển số xe
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormPlateColorScope('specific')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formPlateColorScope === 'specific'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Chọn từng màu biển số xe
                        </button>
                      </div>
                    </div>

                    {/* Khi tick vào "chọn từng màu biển số xe", hiển thị field: Trắng, Vàng và Xanh. Cho phép tick hết */}
                    {formPlateColorScope === 'specific' && (
                      <div className="pt-2 animate-fadeIn">
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          Màu biển số xe áp dụng: <span className="text-gray-400 font-normal">(cho phép chọn nhiều hoặc tất cả)</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {PLATE_COLOR_OPTIONS.map((color) => {
                            const isChecked = formSelectedPlateColors.includes(color);
                            const colorVisual =
                              color === 'Trắng'
                                ? 'border-gray-300 bg-white text-gray-800 ring-gray-200'
                                : color === 'Vàng'
                                ? 'border-amber-300 bg-amber-50 text-amber-800 ring-amber-200'
                                : 'border-blue-300 bg-blue-50 text-blue-800 ring-blue-200';

                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => {
                                  setFormSelectedPlateColors((prev) =>
                                    isChecked ? prev.filter((c) => c !== color) : [...prev, color]
                                  );
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${colorVisual} ${
                                  isChecked
                                    ? 'ring-2 ring-offset-1 border-[#1A73E8] shadow-2xs font-bold'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                                    isChecked
                                      ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                                      : 'border-gray-400 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>Biển số {color}</span>
                              </button>
                            );
                          })}
                        </div>
                        {formSelectedPlateColors.length === 0 && (
                          <p className="text-[11px] text-amber-600 mt-1.5">
                            * Vui lòng chọn ít nhất một màu biển số xe.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Khách hàng (Đối tượng áp dụng & Giới hạn số lượng - ẩn khi Loại là Voucher hoặc Khách cũ giới thiệu Khách mới) */}
                {formCategory !== 'Voucher' && formCategory !== 'Khách cũ giới thiệu Khách mới' && (
                  <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Users className="w-4 h-4 text-purple-600" />
                      Đối tượng áp dụng
                    </label>
                  </div>

                  {/* 4 nút lựa chọn đối tượng áp dụng kèm phụ đề */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* Nút 1: Khách hàng mới */}
                    <button
                      type="button"
                      onClick={() => setFormCustomerScope('new_customer')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formCustomerScope === 'new_customer'
                          ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-xs'
                          : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold">Khách hàng mới</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            formCustomerScope === 'new_customer'
                              ? 'border-white bg-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {formCustomerScope === 'new_customer' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] leading-tight ${
                          formCustomerScope === 'new_customer' ? 'text-blue-100 font-normal' : 'text-gray-500'
                        }`}
                      >
                        Chỉ áp dụng cho khách hàng chưa có hồ sơ trong hệ thống
                      </span>
                    </button>

                    {/* Nút 2: Khách hàng mới và Khách hàng Hiện hữu */}
                    <button
                      type="button"
                      onClick={() => setFormCustomerScope('all_with_new')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formCustomerScope === 'all_with_new'
                          ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-xs'
                          : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold">Khách hàng mới và Khách hàng Hiện hữu</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            formCustomerScope === 'all_with_new'
                              ? 'border-white bg-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {formCustomerScope === 'all_with_new' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] leading-tight ${
                          formCustomerScope === 'all_with_new' ? 'text-blue-100 font-normal' : 'text-gray-500'
                        }`}
                      >
                        Áp dụng công khai cho toàn bộ người dùng
                      </span>
                    </button>

                    {/* Nút 3: Khách hàng hiện hữu */}
                    <button
                      type="button"
                      onClick={() => setFormCustomerScope('all')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formCustomerScope === 'all' || formCustomerScope === 'all_existing'
                          ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-xs'
                          : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold">Khách hàng hiện hữu</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            formCustomerScope === 'all' || formCustomerScope === 'all_existing'
                              ? 'border-white bg-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {(formCustomerScope === 'all' || formCustomerScope === 'all_existing') && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] leading-tight ${
                          formCustomerScope === 'all' || formCustomerScope === 'all_existing'
                            ? 'text-blue-100 font-normal'
                            : 'text-gray-500'
                        }`}
                      >
                        Chỉ áp dụng cho khách hàng đã có hồ sơ trong hệ thống
                      </span>
                    </button>

                    {/* Nút 4: Nhóm Khách hàng / Khách hàng chỉ định */}
                    <button
                      type="button"
                      onClick={() => setFormCustomerScope('specific')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formCustomerScope === 'specific'
                          ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-xs'
                          : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold">Nhóm Khách hàng / Khách hàng chỉ định</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            formCustomerScope === 'specific'
                              ? 'border-white bg-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {formCustomerScope === 'specific' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] leading-tight ${
                          formCustomerScope === 'specific' ? 'text-blue-100 font-normal' : 'text-gray-500'
                        }`}
                      >
                        Chỉ áp dụng với Nhóm hoặc Khách cụ thể có ở bảng dưới
                      </span>
                    </button>
                  </div>

                  {/* Khi tick vào "Nhóm Khách hàng / Khách hàng chỉ định": */}
                  {formCustomerScope === 'specific' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      {/* Field "Nhóm khách hàng áp dụng:": cho phép chọn nhiều, nhấn nút Áp dụng sẽ tự động điền danh sách vào Bảng */}
                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                        <div className="text-xs font-semibold text-gray-700">
                          Nhóm khách hàng áp dụng:{' '}
                          <span className="text-gray-400 font-normal">
                            (cho phép chọn nhiều, Danh sách dưới được hiển thị từ Module Nhóm Khách hàng)
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {CUSTOMER_GROUP_OPTIONS.map((grp) => {
                            const isChecked = formSelectedCustomerGroups.includes(grp);
                            return (
                              <button
                                key={grp}
                                type="button"
                                onClick={() => {
                                  setFormSelectedCustomerGroups((prev) =>
                                    isChecked ? prev.filter((g) => g !== grp) : [...prev, grp]
                                  );
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-purple-50 text-purple-700 border-purple-300 font-semibold'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                                    isChecked
                                      ? 'bg-purple-600 border-purple-600 text-white'
                                      : 'border-gray-400 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                {grp}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            onClick={handleApplyCustomerGroups}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer ml-auto"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Thêm vào danh sách
                          </button>
                        </div>
                      </div>

                      {/* Customer Table: STT, Mã Khách hàng, Tên khách hàng, Địa chỉ, Số điện thoại, Email, Mã số thuế */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
                        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-800">
                            Danh sách khách hàng áp dụng ({formTargetCustomers.length})
                          </span>
                          <button
                            type="button"
                            onClick={handleAddCustomerRow}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Thêm dòng
                          </button>
                        </div>

                        <div className="overflow-x-auto max-h-72">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="sticky top-0 bg-gray-100 text-gray-700 border-b border-gray-200 font-bold z-10">
                              <tr>
                                <th className="py-2.5 px-3 text-center w-12">STT</th>
                                <th className="py-2.5 px-3 min-w-[120px]">Mã Khách hàng</th>
                                <th className="py-2.5 px-3 min-w-[160px]">Tên khách hàng</th>
                                <th className="py-2.5 px-3 min-w-[200px]">Địa chỉ</th>
                                <th className="py-2.5 px-3 min-w-[120px]">Số điện thoại</th>
                                <th className="py-2.5 px-3 min-w-[160px]">Email</th>
                                <th className="py-2.5 px-3 min-w-[120px]">Mã số thuế</th>
                                <th className="py-2.5 px-2 text-center w-12">Xóa</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {formTargetCustomers.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="py-8 text-center text-gray-400">
                                    Chưa có khách hàng nào trong bảng. Chọn nhóm và bấm "Áp dụng" hoặc nhấn "+ Thêm dòng".
                                  </td>
                                </tr>
                              ) : (
                                formTargetCustomers.map((cust, idx) => (
                                  <tr key={cust.id} className="hover:bg-blue-50/20">
                                    <td className="py-2 px-3 text-center text-gray-500 font-medium">
                                      {idx + 1}
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="text"
                                        value={cust.customerCode}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, customerCode: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-mono font-medium"
                                        placeholder="Mã KH"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="text"
                                        value={cust.customerName}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, customerName: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-medium"
                                        placeholder="Tên khách hàng"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="text"
                                        value={cust.address}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, address: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                        placeholder="Địa chỉ"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="text"
                                        value={cust.phone}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, phone: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                        placeholder="SĐT"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="email"
                                        value={cust.email}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, email: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                        placeholder="Email"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2">
                                      <input
                                        type="text"
                                        value={cust.taxCode}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setFormTargetCustomers((prev) =>
                                            prev.map((c) =>
                                              c.id === cust.id ? { ...c, taxCode: v } : c
                                            )
                                          );
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-mono"
                                        placeholder="MST"
                                      />
                                    </td>
                                    <td className="py-1.5 px-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveCustomerRow(cust.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                        title="Xóa dòng"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Giới hạn số lượng */}
                  <div className="pt-2 border-t border-gray-200/80 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-indigo-600" />
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Giới hạn số lượng
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1. Tổng lượt chiết khấu tối đa (lượt) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Tổng lượt chiết khấu tối đa (lượt)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formMaxUsageTotal}
                          onChange={(e) => setFormMaxUsageTotal(e.target.value)}
                          placeholder="Để trống nếu không giới hạn..."
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-medium"
                        />
                      </div>

                      {/* 2. Lượt dùng tối đa trên mỗi khách hàng */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Lượt dùng tối đa trên mỗi khách hàng
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formMaxUsagePerCustomer}
                          onChange={(e) => setFormMaxUsagePerCustomer(e.target.value)}
                          placeholder="Để trống nếu không giới hạn..."
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-medium"
                        />
                      </div>

                      {/* 3. Lượt dùng tối đa trên mỗi Biển số xe */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Lượt dùng tối đa trên mỗi Biển số xe
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formMaxUsagePerPlate}
                          onChange={(e) => setFormMaxUsagePerPlate(e.target.value)}
                          placeholder="Để trống nếu không giới hạn..."
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-medium"
                        />
                      </div>
                    </div>

                    {/* Diễn giải */}
                    <div className="pt-1">
                      <div className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#1A73E8]" />
                        <span>Diễn giải:</span>
                      </div>
                      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-blue-950 leading-relaxed font-medium">
                        {getUsageLimitExplanation(
                          formMaxUsageTotal,
                          formMaxUsagePerCustomer,
                          formMaxUsagePerPlate,
                          formCustomerScope,
                          formSelectedCustomerGroups,
                          formTargetCustomers.length
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* ================================================================= */}
              {/* KHU VỰC 3: THIẾT LẬP CHIẾT KHẤU */}
              {/* ================================================================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    {formCategory === 'Voucher' ? 'Thiết lập Voucher' : 'Thiết lập chiết khấu'}
                  </h3>
                </div>

                {formCategory === 'Khách cũ giới thiệu Khách mới' ? (
                  <div className="space-y-6">
                    {/* Khu vực 1: Ưu đãi cho Người mới (Người được giới thiệu) */}
                    <div className="p-5 rounded-2xl border-2 border-blue-200 bg-white shadow-xs space-y-5">
                      <div className="flex items-start justify-between pb-3.5 border-b border-blue-100 flex-wrap gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs mt-0.5">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Ưu đãi cho Người mới (Người được giới thiệu)
                              </h4>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1A73E8] border border-blue-200">
                                Người được giới thiệu
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              Giảm giá khi đặt đơn đầu tiên có kèm mã giới thiệu
                            </p>
                          </div>
                        </div>
                      </div>

                      {renderDiscountSetupFields(
                        formDiscountMethod,
                        setFormDiscountMethod,
                        formOrderDiscountType,
                        setFormOrderDiscountType,
                        formOrderPercent,
                        setFormOrderPercent,
                        formOrderMaxDiscountAmount,
                        setFormOrderMaxDiscountAmount,
                        formOrderFixedAmount,
                        setFormOrderFixedAmount,
                        formOrderMinOrderValue,
                        setFormOrderMinOrderValue,
                        formProductDiscountType,
                        setFormProductDiscountType,
                        formProductItems,
                        setFormProductItems,
                        'new_cust',
                        'blue'
                      )}
                    </div>

                    {/* Cấu hình Gửi Mã quà tặng cho người giới thiệu */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-4 shadow-2xs">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formSendReferrerGiftCode}
                            onChange={(e) => setFormSendReferrerGiftCode(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-gray-900 tracking-wide uppercase flex items-center gap-1.5">
                              <Gift className="w-4 h-4 text-emerald-600" />
                              Gửi Mã quà tặng cho người giới thiệu
                            </span>
                            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                              Điều kiện: Khi người được giới thiệu hoàn thành thanh toán
                            </p>
                          </div>
                        </label>

                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            formSendReferrerGiftCode
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {formSendReferrerGiftCode ? 'Đang kích hoạt tặng mã' : 'Không gửi'}
                        </span>
                      </div>

                      {/* Khi tick chọn vào "Gửi Mã quà tặng cho người giới thiệu" thì hiển thị các field này */}
                      {formSendReferrerGiftCode && (
                        <div className="pt-3.5 border-t border-emerald-100 space-y-4 animate-fadeIn">
                          {/* Trên 1 dòng: Tiền tố mã tự tạo, Hậu tố hệ thống tự tạo, và vùng hiển thị rõ sau field Hậu tố hệ thống tự tạo */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                            {/* 1. Tiền tố mã tự tạo: tự input */}
                            <div className="md:col-span-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Tiền tố mã tự tạo <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formReferrerCodePrefix}
                                onChange={(e) => setFormReferrerCodePrefix(e.target.value)}
                                placeholder="Nhập tiền tố (VD: QT-)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-medium outline-none focus:border-emerald-600 bg-white shadow-2xs h-[38px]"
                              />
                            </div>

                            {/* 2. Hậu tố hệ thống tự tạo: list (STT tăng dần, Số điện thoại, Email) */}
                            <div className="md:col-span-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Hậu tố hệ thống tự tạo <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formReferrerCodeSuffixType}
                                onChange={(e) =>
                                  setFormReferrerCodeSuffixType(
                                    e.target.value as 'STT tăng dần' | 'Số điện thoại' | 'Email'
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium outline-none focus:border-emerald-600 bg-white cursor-pointer shadow-2xs h-[38px]"
                              >
                                <option value="STT tăng dần">STT tăng dần</option>
                                <option value="Số điện thoại">Số điện thoại</option>
                                <option value="Email">Email</option>
                              </select>
                            </div>

                            {/* 3. Vùng hiển thị rõ phần Tiền tố mã tự tạo và Hậu tố hệ thống tự tạo, sau field Hậu tố hệ thống tự tạo */}
                            <div className="md:col-span-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Định dạng Mã quà tặng mẫu:
                              </label>
                              <div className="h-[38px] px-3 bg-white rounded-lg border border-emerald-300 flex items-center justify-between gap-2 shadow-2xs overflow-hidden">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-mono font-bold text-xs text-emerald-800 tracking-wider truncate">
                                    {formReferrerCodePrefix || 'QT-'}
                                    {formReferrerCodeSuffixType === 'Số điện thoại'
                                      ? '0901234567'
                                      : formReferrerCodeSuffixType === 'Email'
                                      ? 'an.nguyen'
                                      : '001'}
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0 border border-emerald-200">
                                  Mã mẫu
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dòng 2: field "Thời gian hiệu lực (ngày)" ở trước field "Tự động gửi mã thưởng qua các kênh:" & Nút "Xem trước Nội dung gửi" */}
                          <div className="flex items-center justify-between flex-wrap gap-4 pt-3.5 border-t border-emerald-100">
                            <div className="flex items-center gap-4 flex-wrap">
                              {/* Field "Thời gian hiệu lực (ngày)" ở TRƯỚC */}
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                  Thời gian hiệu lực: <span className="text-red-500">*</span>
                                </label>
                                <div className="relative w-28">
                                  <input
                                    type="number"
                                    min="1"
                                    value={formReferrerValidityDays}
                                    onChange={(e) => setFormReferrerValidityDays(e.target.value)}
                                    placeholder="VD: 30"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold outline-none focus:border-emerald-600 bg-white shadow-2xs pr-8 text-center"
                                  />
                                  <span className="absolute right-2.5 top-1.5 text-xs text-gray-400 font-medium pointer-events-none">
                                    ngày
                                  </span>
                                </div>
                              </div>

                              <div className="hidden sm:block w-px h-6 bg-emerald-200" />

                              {/* Field "Tự động gửi mã thưởng qua các kênh:" ở SAU */}
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                  Tự động gửi mã thưởng qua các kênh:
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {(['SMS', 'Zalo OA', 'Email'] as const).map((ch) => {
                                    const isChecked = formReferrerSendChannels.includes(ch);
                                    return (
                                      <label
                                        key={ch}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors select-none ${
                                          isChecked
                                            ? 'bg-white border-emerald-500 text-emerald-800 shadow-2xs font-semibold ring-1 ring-emerald-200'
                                            : 'bg-white/70 border-gray-200 text-gray-600 hover:bg-white'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setFormReferrerSendChannels((prev) => [...prev, ch]);
                                            } else {
                                              setFormReferrerSendChannels((prev) => prev.filter((c) => c !== ch));
                                            }
                                          }}
                                          className="w-3.5 h-3.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <span>{ch}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Nút Xem trước Nội dung gửi */}
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewChannelTab(
                                  (formReferrerSendChannels[0] as any) || 'SMS'
                                );
                                setIsPreviewMessageModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Xem trước Nội dung gửi
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tick chọn vào "Gửi Mã quà tặng cho người giới thiệu" thì sẽ hiển thị khu vực "Ưu đãi cho Khách hiện hữu (Người giới thiệu)" */}
                    {formSendReferrerGiftCode && (
                      <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-white shadow-xs space-y-5 animate-fadeIn">
                        <div className="flex items-start justify-between pb-3.5 border-b border-emerald-100 flex-wrap gap-2">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs mt-0.5">
                              <Ticket className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                  Ưu đãi cho Khách hiện hữu (Người giới thiệu)
                                </h4>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  Người giới thiệu
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 font-medium">
                                Tự động sinh mã voucher tặng ngay sau khi đơn người mới hoàn tất
                              </p>
                            </div>
                          </div>
                        </div>

                        {renderDiscountSetupFields(
                          referrerDiscountMethod,
                          setReferrerDiscountMethod,
                          referrerOrderDiscountType,
                          setReferrerOrderDiscountType,
                          referrerOrderPercent,
                          setReferrerOrderPercent,
                          referrerOrderMaxDiscountAmount,
                          setReferrerOrderMaxDiscountAmount,
                          referrerOrderFixedAmount,
                          setReferrerOrderFixedAmount,
                          referrerOrderMinOrderValue,
                          setReferrerOrderMinOrderValue,
                          referrerProductDiscountType,
                          setReferrerProductDiscountType,
                          referrerProductItems,
                          setReferrerProductItems,
                          'referrer',
                          'emerald'
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* 1. Chọn 1 trong 2: Chiết khấu theo đơn vs Chiết khấu theo sản phẩm */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Hình thức áp dụng: <span className="text-red-500">*</span>
                  </label>
                  <div className="inline-flex items-center p-1.5 bg-gray-100 rounded-xl border border-gray-200 gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFormDiscountMethod('order')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formDiscountMethod === 'order'
                          ? 'bg-[#1A73E8] text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-200/60'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      Chiết khấu theo đơn (Áp dụng trên tổng giá trị RO)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormDiscountMethod('product')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formDiscountMethod === 'product'
                          ? 'bg-[#1A73E8] text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-200/60'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Chiết khấu theo sản phẩm
                    </button>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* TRƯỜNG HỢP A: Chiết khấu theo đơn */}
                {/* ================================================================= */}
                {formDiscountMethod === 'order' && (
                  <div className="p-5 bg-blue-50/40 rounded-xl border border-blue-100 space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Kiểu chiết khấu đơn hàng:
                      </label>
                      <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setFormOrderDiscountType('percentage')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formOrderDiscountType === 'percentage'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Percent className="w-3.5 h-3.5" />
                          Theo tỉ lệ phần trăm (%)
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormOrderDiscountType('fixed_amount')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formOrderDiscountType === 'fixed_amount'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          Theo Số tiền cố định
                        </button>
                      </div>
                    </div>

                    {/* Khi tick vào "Theo tỉ lệ phần trăm (%)" */}
                    {formOrderDiscountType === 'percentage' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 animate-fadeIn">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Số phần trăm (%) giảm giá: <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={formOrderPercent}
                              onChange={(e) => setFormOrderPercent(e.target.value)}
                              placeholder="VD: 10"
                              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] font-semibold bg-white"
                            />
                            <span className="absolute right-3.5 top-2.5 text-gray-400 font-bold text-sm pointer-events-none">
                              %
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <label className="block text-xs font-semibold text-gray-700">
                              Số tiền giảm giá tối đa (VNĐ):
                            </label>
                            <span
                              className="inline-flex items-center text-gray-400 hover:text-blue-600 cursor-pointer"
                              title="Để trống, nếu không giới hạn"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                            <span className="text-[11px] text-gray-500 italic">
                              (Để trống, nếu không giới hạn)
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="10000"
                              value={formOrderMaxDiscountAmount}
                              onChange={(e) => setFormOrderMaxDiscountAmount(e.target.value)}
                              placeholder="Để trống nếu không giới hạn tối đa"
                              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-medium"
                            />
                            <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                              VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Khi tick vào "Theo số tiền cố định" */}
                    {formOrderDiscountType === 'fixed_amount' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 animate-fadeIn">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Số tiền giảm giá (VNĐ): <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="10000"
                              value={formOrderFixedAmount}
                              onChange={(e) => setFormOrderFixedAmount(e.target.value)}
                              placeholder="VD: 200000"
                              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-semibold"
                            />
                            <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                              VNĐ
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Giá trị đơn hàng tối thiểu (VNĐ):
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="50000"
                              value={formOrderMinOrderValue}
                              onChange={(e) => setFormOrderMinOrderValue(e.target.value)}
                              placeholder="VD: 1000000"
                              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white font-medium"
                            />
                            <span className="absolute right-3.5 top-2.5 text-gray-400 text-xs font-semibold pointer-events-none">
                              VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================================================================= */}
                {/* TRƯỜNG HỢP B: Chiết khấu theo sản phẩm */}
                {/* ================================================================= */}
                {formDiscountMethod === 'product' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Kiểu chiết khấu: dạng button (Chiết khấu theo tỉ lệ phần trăm (%), Chiết khấu theo số tiền cố định), chỉ chọn 1 */}
                    <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                          Kiểu chiết khấu sản phẩm:
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Chọn cách thức tính chiết khấu cho bảng hàng hóa vật tư bên dưới
                        </div>
                      </div>

                      <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200 gap-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            setFormProductDiscountType('percentage');
                            // Re-calculate all rows with percentage
                            setFormProductItems((prev) =>
                              prev.map((r) => calculateProductRow(r, 'percentage', 'discountPercent', r.discountPercent || 10))
                            );
                          }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formProductDiscountType === 'percentage'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Percent className="w-3.5 h-3.5" />
                          Chiết khấu theo tỉ lệ phần trăm (%)
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFormProductDiscountType('fixed_amount');
                            // Re-calculate all rows with fixed amount
                            setFormProductItems((prev) =>
                              prev.map((r) => calculateProductRow(r, 'fixed_amount', 'fixedDiscountAmount', r.fixedDiscountAmount || 20000))
                            );
                          }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            formProductDiscountType === 'fixed_amount'
                              ? 'bg-[#1A73E8] text-white shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          Chiết khấu theo số tiền cố định
                        </button>
                      </div>
                    </div>

                    {/* Bảng hàng hóa vật tư: STT, Mã Hàng hóa vật tư, Tên Hàng hóa vật tư, Đơn vị tính, Thuế VAT, Giá bán (chưa thuế), Giá bán (có thuế), CK theo tỉ lệ % (nhập), Số tiền giảm giá cố định, Giá bán mới (chưa thuế), Giá bán mới (có thuế), Số lượng mua tối thiểu (có biểu tượng) */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#1A73E8]" />
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                            Bảng Hàng hóa vật tư áp dụng ({formProductItems.length} mục)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quick pick from catalog */}
                          <select
                            onChange={(e) => {
                              const found = SAMPLE_GARAGE_CATALOG.find((c) => c.itemCode === e.target.value);
                              if (found) handleAddProductRow(found);
                              e.target.value = '';
                            }}
                            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 outline-none cursor-pointer"
                          >
                            <option value="">+ Chọn nhanh từ kho vật tư mẫu...</option>
                            {SAMPLE_GARAGE_CATALOG.map((cat) => (
                              <option key={cat.itemCode} value={cat.itemCode}>
                                {cat.itemCode} - {cat.itemName} ({formatCurrency(cat.priceAfterVat)})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleAddProductRow()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Thêm dòng
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="sticky top-0 bg-gray-100/90 text-gray-700 border-b border-gray-200 font-bold z-10 whitespace-nowrap">
                            <tr>
                              <th className="py-2.5 px-3 text-center w-10">STT</th>
                              <th className="py-2.5 px-3 min-w-[110px]">Mã Hàng hóa vật tư</th>
                              <th className="py-2.5 px-3 min-w-[170px]">Tên Hàng hóa vật tư</th>
                              <th className="py-2.5 px-2 w-16">Đơn vị tính</th>
                              <th className="py-2.5 px-2 w-20 text-center">Thuế VAT (%)</th>
                              <th className="py-2.5 px-3 min-w-[110px] text-right">Giá bán (chưa thuế)</th>
                              <th className="py-2.5 px-3 min-w-[110px] text-right">Giá bán (có thuế)</th>
                              <th className="py-2.5 px-3 min-w-[100px] text-center bg-blue-50/50">
                                CK theo tỉ lệ %
                              </th>
                              <th className="py-2.5 px-3 min-w-[120px] text-right bg-blue-50/50">
                                Số tiền giảm giá cố định
                              </th>
                              <th className="py-2.5 px-3 min-w-[110px] text-right text-emerald-700">
                                Giá bán mới (chưa thuế)
                              </th>
                              <th className="py-2.5 px-3 min-w-[110px] text-right text-emerald-700 font-extrabold">
                                Giá bán mới (có thuế)
                              </th>
                              <th className="py-2.5 px-3 min-w-[150px]">
                                <div className="flex items-center gap-1.5 relative">
                                  <span>Số lượng mua tối thiểu</span>
                                  <button
                                    ref={minBuyQtyBtnRef}
                                    type="button"
                                    onClick={() => {
                                      if (!showMinBuyQtyInfo) {
                                        handleMinBuyQtyEnter();
                                      } else {
                                        setShowMinBuyQtyInfo(false);
                                      }
                                    }}
                                    onMouseEnter={handleMinBuyQtyEnter}
                                    onMouseLeave={() => setShowMinBuyQtyInfo(false)}
                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                                    title={"Để trống: Không ràng buộc (Đơn hàng bao nhiêu tiền cũng được giảm giá).\nNếu nhập vào: Phải đạt số lượng tổng tiền này mới được áp dụng Chiết khấu."}
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Tooltip hiển thị gọn gàng, rõ ràng trong vùng popover */}
                                  {showMinBuyQtyInfo && minBuyQtyPos && (
                                    <div
                                      style={{
                                        position: 'fixed',
                                        top: `${minBuyQtyPos.top}px`,
                                        left: `${minBuyQtyPos.left}px`,
                                        zIndex: 99999,
                                      }}
                                      onMouseEnter={() => setShowMinBuyQtyInfo(true)}
                                      onMouseLeave={() => setShowMinBuyQtyInfo(false)}
                                      className="w-80 p-3 bg-gray-900 text-white rounded-xl shadow-2xl text-xs border border-gray-700 animate-fadeIn pointer-events-auto select-none"
                                    >
                                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-800">
                                        <div className="font-semibold text-blue-300 flex items-center gap-1.5 text-xs">
                                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                          Quy tắc số lượng mua tối thiểu
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setShowMinBuyQtyInfo(false)}
                                          className="text-gray-400 hover:text-white text-xs px-1 cursor-pointer"
                                          title="Đóng"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <div className="leading-relaxed space-y-2 text-gray-200">
                                        <div className="bg-gray-800/90 p-2.5 rounded-lg border border-gray-700/60">
                                          <div className="text-gray-100 text-xs">
                                            <span className="font-semibold text-amber-300">Để trống:</span> Không ràng buộc (Đơn hàng bao nhiêu tiền cũng được giảm giá).
                                          </div>
                                        </div>
                                        <div className="bg-gray-800/90 p-2.5 rounded-lg border border-gray-700/60">
                                          <div className="text-gray-100 text-xs">
                                            <span className="font-semibold text-emerald-300">Nếu nhập vào:</span> Phải đạt số lượng tổng tiền này mới được áp dụng Chiết khấu.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </th>
                              <th className="py-2.5 px-2 text-center w-10">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {formProductItems.length === 0 ? (
                              <tr>
                                <td colSpan={13} className="py-8 text-center text-gray-400">
                                  Chưa có mặt hàng nào trong bảng. Chọn nhanh từ danh mục mẫu hoặc bấm "+ Thêm dòng".
                                </td>
                              </tr>
                            ) : (
                              formProductItems.map((prod, idx) => (
                                <tr key={prod.id} className="hover:bg-blue-50/20">
                                  <td className="py-2 px-2 text-center text-gray-500 font-medium">
                                    {idx + 1}
                                  </td>

                                  {/* Mã Hàng hóa vật tư */}
                                  <td className="py-1.5 px-2">
                                    <input
                                      type="text"
                                      value={prod.itemCode}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id ? { ...p, itemCode: v } : p
                                          )
                                        );
                                      }}
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-mono font-medium"
                                      placeholder="Mã VT"
                                    />
                                  </td>

                                  {/* Tên Hàng hóa vật tư */}
                                  <td className="py-1.5 px-2">
                                    <input
                                      type="text"
                                      value={prod.itemName}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id ? { ...p, itemName: v } : p
                                          )
                                        );
                                      }}
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-medium"
                                      placeholder="Tên vật tư"
                                    />
                                  </td>

                                  {/* Đơn vị tính */}
                                  <td className="py-1.5 px-2">
                                    <input
                                      type="text"
                                      value={prod.unit}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) => (p.id === prod.id ? { ...p, unit: v } : p))
                                        );
                                      }}
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center"
                                      placeholder="ĐVT"
                                    />
                                  </td>

                                  {/* Thuế VAT */}
                                  <td className="py-1.5 px-2">
                                    <select
                                      value={prod.vat}
                                      onChange={(e) => {
                                        const v = parseFloat(e.target.value) || 0;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id
                                              ? calculateProductRow(p, formProductDiscountType, 'vat', v)
                                              : p
                                          )
                                        );
                                      }}
                                      className="w-full px-1 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center bg-white cursor-pointer"
                                    >
                                      <option value={0}>0%</option>
                                      <option value={5}>5%</option>
                                      <option value={8}>8%</option>
                                      <option value={10}>10%</option>
                                    </select>
                                  </td>

                                  {/* Giá bán (chưa thuế) */}
                                  <td className="py-1.5 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="5000"
                                      value={prod.priceBeforeVat}
                                      onChange={(e) => {
                                        const v = parseFloat(e.target.value) || 0;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id
                                              ? calculateProductRow(p, formProductDiscountType, 'priceBeforeVat', v)
                                              : p
                                          )
                                        );
                                      }}
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-right font-medium"
                                    />
                                  </td>

                                  {/* Giá bán (có thuế) */}
                                  <td className="py-2 px-3 text-right font-semibold text-gray-800">
                                    {formatCurrency(prod.priceAfterVat)}
                                  </td>

                                  {/* CK theo tỉ lệ % (nhập) */}
                                  <td className={`py-1.5 px-2 ${formProductDiscountType === "percentage" ? "bg-blue-50/30" : "bg-gray-100/60"}`}>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.5"
                                      readOnly={formProductDiscountType === "fixed_amount"}
                                      value={formProductDiscountType === "fixed_amount" ? "" : prod.discountPercent}
                                      onChange={(e) => {
                                        if (formProductDiscountType === "fixed_amount") return;
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id
                                              ? calculateProductRow(p, "percentage", "discountPercent", v)
                                              : p
                                          )
                                        );
                                      }}
                                      className={`w-full px-2 py-1 border rounded text-xs outline-none text-center font-bold ${
                                        formProductDiscountType === "fixed_amount"
                                          ? "bg-gray-100 text-transparent border-gray-200 cursor-not-allowed select-none placeholder:text-transparent"
                                          : "bg-white border-blue-200 text-[#1A73E8] focus:border-[#1A73E8]"
                                      }`}
                                      placeholder={formProductDiscountType === "fixed_amount" ? "" : "%"}
                                    />
                                  </td>

                                  {/* Số tiền giảm giá cố định */}
                                  <td className={`py-1.5 px-2 ${formProductDiscountType === "fixed_amount" ? "bg-blue-50/30" : "bg-gray-100/60"}`}>
                                    <input
                                      type="number"
                                      min="0"
                                      step="1000"
                                      readOnly={formProductDiscountType === "percentage"}
                                      value={formProductDiscountType === "percentage" ? "" : prod.fixedDiscountAmount}
                                      onChange={(e) => {
                                        if (formProductDiscountType === "percentage") return;
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id
                                              ? calculateProductRow(p, "fixed_amount", "fixedDiscountAmount", v)
                                              : p
                                          )
                                        );
                                      }}
                                      className={`w-full px-2 py-1 border rounded text-xs outline-none text-right font-semibold ${
                                        formProductDiscountType === "percentage"
                                          ? "bg-gray-100 text-transparent border-gray-200 cursor-not-allowed select-none placeholder:text-transparent"
                                          : "bg-white border-blue-200 text-gray-800 focus:border-[#1A73E8]"
                                      }`}
                                      placeholder={formProductDiscountType === "percentage" ? "" : "Số tiền giảm"}
                                    />
                                  </td>

                                  {/* Giá bán mới (chưa thuế) */}
                                  <td className="py-2 px-3 text-right text-gray-700 font-medium">
                                    {formatCurrency(prod.newPriceBeforeVat)}
                                  </td>

                                  {/* Giá bán mới (có thuế) */}
                                  <td className="py-2 px-3 text-right text-emerald-600 font-bold">
                                    {formatCurrency(prod.newPriceAfterVat)}
                                  </td>

                                  {/* Số lượng mua tối thiểu */}
                                  <td className="py-1.5 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      value={prod.minBuyQuantity}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setFormProductItems((prev) =>
                                          prev.map((p) =>
                                            p.id === prod.id ? { ...p, minBuyQuantity: v } : p
                                          )
                                        );
                                      }}
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-center"
                                      placeholder="Để trống nếu K.buộc"
                                    />
                                  </td>

                                  {/* Thao tác xóa */}
                                  <td className="py-1.5 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveProductRow(prod.id)}
                                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                      title="Xóa dòng"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>

              {/* ================================================================= */}
              {/* KHU VỰC: TÀI LIỆU */}
              {/* ================================================================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Tài liệu
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDocumentRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm dòng
                  </button>
                </div>

                {/* Bảng danh sách Tài liệu */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <div className="overflow-x-auto min-h-[160px] max-h-96">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-gray-100/90 text-gray-700 border-b border-gray-200 font-bold z-10 whitespace-nowrap">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12">STT</th>
                          <th 
                            className="py-2.5 px-3 text-center min-w-[145px]"
                            title="Đã có sẵn hợp đồng (trong Module Bán hàng)"
                          >
                            <div className="relative group inline-flex items-center justify-center gap-1 cursor-help">
                              <span>Có hợp đồng</span>
                              <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              {/* Tooltip khi rê chuột vào cột Có hợp đồng - hiển thị xuống bên dưới để thấy được */}
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 z-50 hidden group-hover:flex flex-col items-center pointer-events-none transition-all drop-shadow-xl">
                                <div className="w-2.5 h-2.5 bg-gray-900 transform rotate-45 border-l border-t border-gray-700 -mb-1.5 z-10"></div>
                                <div className="whitespace-nowrap px-3.5 py-1.5 bg-gray-900 text-white text-[11px] font-normal rounded-lg shadow-2xl border border-gray-700 leading-normal text-center">
                                  Đã có sẵn hợp đồng (trong Module Bán hàng)
                                </div>
                              </div>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 min-w-[170px]">Tên tài liệu</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Mô tả</th>
                          <th className="py-2.5 px-3 min-w-[180px]">Nhà cung cấp</th>
                          <th className="py-2.5 px-3 min-w-[180px]">Số hợp đồng</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Mô tả</th>
                          <th className="py-2.5 px-3 min-w-[135px]">Ngày hiệu lực</th>
                          <th className="py-2.5 px-3 min-w-[135px]">Ngày hết hiệu lực</th>
                          <th className="py-2.5 px-3 text-center min-w-[110px]">Còn hiệu lực</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Link</th>
                          <th className="py-2.5 px-3 min-w-[180px]">File tải lên</th>
                          <th className="py-2.5 px-3 text-center min-w-[160px]">Hồ sơ chi tiết</th>
                          <th className="py-2.5 px-2 text-center w-12">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {formDocuments.length === 0 ? (
                          <tr>
                            <td colSpan={14} className="py-6 text-center text-gray-400 italic">
                              Chưa có tài liệu nào. Nhấn "+ Thêm dòng" để thêm tài liệu mới.
                            </td>
                          </tr>
                        ) : (
                          formDocuments.map((doc, idx) => {
                            const availableSuppliers = Array.from(
                              new Set(SALES_CONTRACT_CATALOG.map((c) => c.supplierName))
                            );
                            const contractsForCurrentSupplier = SALES_CONTRACT_CATALOG.filter(
                              (c) => c.supplierName === doc.supplier
                            );

                            return (
                              <tr key={doc.id} className="hover:bg-blue-50/20 transition-colors">
                                {/* STT */}
                                <td className="py-2 px-3 text-center font-bold text-gray-500">
                                  {idx + 1}
                                </td>

                                {/* Có hợp đồng: dạng tick/untick */}
                                <td className="py-2 px-3 text-center">
                                  <label
                                    className="inline-flex items-center justify-center cursor-pointer"
                                    title="Tick nếu đã có hợp đồng sẵn trong Module Bán hàng"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={doc.hasContract}
                                      onChange={(e) => handleToggleHasContract(doc.id, e.target.checked)}
                                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8] cursor-pointer"
                                    />
                                  </label>
                                </td>

                                {/* Tên tài liệu */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={doc.documentName}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, documentName: v } : d
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none font-medium"
                                    placeholder="Nhập tên tài liệu"
                                  />
                                </td>

                                {/* Mô tả (1) */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={doc.documentDescription}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, documentDescription: v } : d
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                    placeholder="Mô tả tài liệu"
                                  />
                                </td>

                                {/* Nhà cung cấp: khi tick là dạng list, khi un-tick thì disable */}
                                <td className="py-1.5 px-2">
                                  {doc.hasContract ? (
                                    <select
                                      value={doc.supplier}
                                      onChange={(e) => handleSupplierChange(doc.id, e.target.value)}
                                      className="w-full px-2 py-1 border border-blue-200 rounded text-xs bg-white text-gray-800 font-medium focus:border-[#1A73E8] focus:ring-1 focus:ring-blue-100 outline-none cursor-pointer"
                                    >
                                      <option value="">-- Chọn Nhà cung cấp --</option>
                                      {availableSuppliers.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      disabled
                                      value=""
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-100 text-gray-400 cursor-not-allowed outline-none select-none"
                                      placeholder="—"
                                      title="Vui lòng tick 'Có hợp đồng' để chọn Nhà cung cấp"
                                    />
                                  )}
                                </td>

                                {/* Số hợp đồng: khi tick là dạng list theo NCC, khi un-tick thì disable */}
                                <td className="py-1.5 px-2">
                                  {doc.hasContract ? (
                                    <select
                                      value={doc.contractNumber}
                                      disabled={!doc.supplier}
                                      onChange={(e) =>
                                        handleContractNumberChange(doc.id, e.target.value, doc.supplier)
                                      }
                                      className={`w-full px-2 py-1 border rounded text-xs font-mono font-medium outline-none ${
                                        !doc.supplier
                                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                          : 'border-blue-200 bg-white text-gray-800 focus:border-[#1A73E8] focus:ring-1 focus:ring-blue-100 cursor-pointer'
                                      }`}
                                    >
                                      {!doc.supplier ? (
                                        <option value="">-- Chọn NCC trước --</option>
                                      ) : (
                                        <>
                                          <option value="">-- Chọn Số hợp đồng --</option>
                                          {contractsForCurrentSupplier.map((c) => (
                                            <option key={c.contractNumber} value={c.contractNumber}>
                                              {c.contractNumber} - {c.contractTitle}
                                            </option>
                                          ))}
                                        </>
                                      )}
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      disabled
                                      value=""
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-100 text-gray-400 cursor-not-allowed outline-none font-mono select-none"
                                      placeholder="—"
                                      title="Vui lòng tick 'Có hợp đồng' để chọn Số hợp đồng"
                                    />
                                  )}
                                </td>

                                {/* Mô tả (2): ở vị trí sau cột Số hợp đồng, disable khi un-tick Có hợp đồng */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    disabled={!doc.hasContract}
                                    value={doc.hasContract ? doc.contractDescription : ''}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, contractDescription: v } : d
                                        )
                                      );
                                    }}
                                    className={`w-full px-2 py-1 border rounded text-xs outline-none ${
                                      !doc.hasContract
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed select-none'
                                        : 'border-gray-200 bg-white text-gray-800 focus:border-[#1A73E8]'
                                    }`}
                                    placeholder={doc.hasContract ? 'Mô tả hợp đồng' : '—'}
                                    title={!doc.hasContract ? "Vui lòng tick 'Có hợp đồng' để nhập mô tả hợp đồng" : undefined}
                                  />
                                </td>

                                {/* Ngày hiệu lực: tự động có dữ liệu theo Số hợp đồng khi tick */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="date"
                                    value={doc.effectiveDate}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, effectiveDate: v } : d
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                  />
                                </td>

                                {/* Ngày hết hiệu lực: tự động có dữ liệu theo Số hợp đồng khi tick */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="date"
                                    value={doc.expirationDate}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, expirationDate: v } : d
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none"
                                  />
                                </td>

                                {/* Còn hiệu lực: tự động có dữ liệu theo Số hợp đồng khi tick */}
                                <td className="py-2 px-3 text-center">
                                  <label className="inline-flex items-center justify-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={doc.isValid}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFormDocuments((prev) =>
                                          prev.map((d) =>
                                            d.id === doc.id ? { ...d, isValid: checked } : d
                                          )
                                        );
                                      }}
                                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8] cursor-pointer"
                                    />
                                  </label>
                                </td>

                                {/* Link: tự động có dữ liệu theo Số hợp đồng khi tick */}
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={doc.link}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFormDocuments((prev) =>
                                        prev.map((d) =>
                                          d.id === doc.id ? { ...d, link: v } : d
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:border-[#1A73E8] outline-none text-blue-600 font-mono"
                                    placeholder="https://..."
                                  />
                                </td>

                                {/* File tải lên: tự động có dữ liệu theo Số hợp đồng khi tick */}
                                <td className="py-1.5 px-2">
                                  <label className="flex items-center gap-1.5 px-2 py-1 border border-gray-200 hover:border-[#1A73E8] rounded text-xs cursor-pointer bg-gray-50/80 hover:bg-blue-50/30 text-gray-700 transition-colors">
                                    <Upload className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                                    <span
                                      className="truncate max-w-[120px] text-gray-600 font-medium"
                                      title={doc.uploadedFile || 'Tải file lên'}
                                    >
                                      {doc.uploadedFile || 'Chọn tệp...'}
                                    </span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setFormDocuments((prev) =>
                                            prev.map((d) =>
                                              d.id === doc.id
                                                ? { ...d, uploadedFile: file.name }
                                                : d
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </label>
                                </td>

                                {/* Hồ sơ chi tiết: dạng nút "Hồ sơ hợp đồng". Khi tick thì hiển thị/active, khi un-tick thì disable */}
                                <td className="py-1.5 px-2 text-center">
                                  {doc.hasContract ? (
                                    <button
                                      type="button"
                                      onClick={() => setViewingContractProfileDoc(doc)}
                                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 hover:border-blue-300 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-2xs whitespace-nowrap active:scale-95"
                                      title="Xem chi tiết hồ sơ hợp đồng từ Module Bán hàng"
                                    >
                                      <FileText className="w-3.5 h-3.5 shrink-0" />
                                      <span>Hồ sơ hợp đồng</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-xs font-medium cursor-not-allowed opacity-60 whitespace-nowrap"
                                      title="Vui lòng tick 'Có hợp đồng' để xem hồ sơ hợp đồng"
                                    >
                                      <FileText className="w-3.5 h-3.5 shrink-0" />
                                      <span>Hồ sơ hợp đồng</span>
                                    </button>
                                  )}
                                </td>

                                {/* Thao tác xóa */}
                                <td className="py-1.5 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDocumentRow(doc.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                    title="Xóa dòng"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
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

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDiscount(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveDiscount}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingDiscount ? 'Cập nhật chương trình' : 'Lưu chương trình'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XEM CHI TIẾT CHÍNH SÁCH */}
      {/* ========================================================================= */}
      {viewingDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-fadeIn border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Chi tiết chương trình: {viewingDiscount.code}
                  </h3>
                  <p className="text-xs text-gray-500">{viewingDiscount.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDiscount(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-4 space-y-4 text-xs">
              {/* Khu vực 1 Info */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                <div className="font-bold text-gray-800 uppercase tracking-wide text-[11px] text-[#1A73E8]">
                  Thông tin chung
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-500">Mã chương trình: </span>
                    <span className="font-bold text-gray-800">{viewingDiscount.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại: </span>
                    <span className="font-semibold text-gray-800">
                      {viewingDiscount.category || 'Chiết khấu'}
                    </span>
                  </div>
                  {viewingDiscount.description && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Mô tả chung: </span>
                      <span className="font-medium text-gray-800">{viewingDiscount.description}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Ngày hiệu lực: </span>
                    <span className="font-medium text-gray-800">{viewingDiscount.startDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày hết hiệu lực: </span>
                    <span className="font-medium text-gray-800">{viewingDiscount.endDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái: </span>
                    <span>{getStatusBadge(viewingDiscount.status)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Số lượng RO: </span>
                    <span className="font-bold text-gray-900">{viewingDiscount.roCount ?? 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cộng dồn ưu đãi: </span>
                    <span className="font-semibold text-gray-800">
                      {viewingDiscount.stackable === 'disallow' || viewingDiscount.allowStacking === false
                        ? 'Không cho phép cộng dồn'
                        : 'Cho phép cộng dồn'}
                    </span>
                    {viewingDiscount.category === 'Chiết khấu' ? (
                      <span className="text-[11px] text-gray-500 ml-1.5 italic">
                        ({viewingDiscount.stackable === 'disallow' || viewingDiscount.allowStacking === false
                          ? 'Không áp dụng chung với Voucher'
                          : 'Áp dụng chung với Voucher'})
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 ml-1.5 italic">
                        ({viewingDiscount.stackable === 'disallow' || viewingDiscount.allowStacking === false
                          ? 'Không áp dụng chung với Chương trình Chiết khấu'
                          : 'Áp dụng chung với Chương trình Chiết khấu'})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày tạo: </span>
                    <span className="text-gray-700">{viewingDiscount.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Khu vực 2 Info */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                <div className="font-bold text-gray-800 uppercase tracking-wide text-[11px] text-emerald-700">
                  {viewingDiscount.category === 'Khách cũ giới thiệu Khách mới'
                    ? 'Quản lý Mã giới thiệu'
                    : viewingDiscount.category === 'Voucher'
                    ? 'Quản lý Voucher'
                    : 'Phạm vi áp dụng'}
                </div>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-gray-500">Chi nhánh: </span>
                    <span className="font-medium text-gray-800">
                      {viewingDiscount.branchScope === 'all'
                        ? 'Áp dụng tất cả chi nhánh'
                        : viewingDiscount.selectedBranches?.join(', ') || 'Chưa chọn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Màu biển số xe: </span>
                    <span className="font-medium text-gray-800">
                      {viewingDiscount.plateColorScope === 'all'
                        ? 'Áp dụng tất cả màu biển số xe'
                        : viewingDiscount.selectedPlateColors?.map((c) => `Biển số ${c}`).join(', ') || 'Chưa chọn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Khách hàng: </span>
                    <span className="font-medium text-gray-800">
                      {viewingDiscount.customerScope === 'new_customer'
                        ? 'Khách hàng mới'
                        : viewingDiscount.customerScope === 'all_with_new'
                        ? 'Khách hàng mới và Khách hàng Hiện hữu'
                        : viewingDiscount.customerScope === 'all' || viewingDiscount.customerScope === 'all_existing'
                        ? 'Khách hàng hiện hữu'
                        : `${viewingDiscount.targetCustomers?.length || 0} khách hàng chỉ định (${viewingDiscount.selectedCustomerGroups?.join(', ') || 'Tự chọn'})`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200/60 mt-2 space-y-1">
                    <span className="text-gray-500 font-semibold text-[11px]">Giới hạn số lượng: </span>
                    <span className="text-gray-800 leading-relaxed font-medium">
                      {getUsageLimitExplanation(
                        viewingDiscount.maxUsageTotal,
                        viewingDiscount.maxUsagePerCustomer,
                        viewingDiscount.maxUsagePerPlate,
                        viewingDiscount.customerScope,
                        viewingDiscount.selectedCustomerGroups,
                        viewingDiscount.targetCustomers?.length
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Khu vực 3 Info */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                <div className="font-bold text-gray-800 uppercase tracking-wide text-[11px] text-indigo-700">
                  {viewingDiscount.category === 'Voucher' ? 'Thiết lập Voucher' : 'Thiết lập chiết khấu'}
                </div>
                {viewingDiscount.discountMethod === 'order' ? (
                  <div className="space-y-1.5">
                    <div className="font-semibold text-gray-800">
                      Chiết khấu theo đơn (Áp dụng trên tổng giá trị RO)
                    </div>
                    <div>
                      <span className="text-gray-500">Kiểu chiết khấu: </span>
                      <span className="font-medium text-gray-800">
                        {viewingDiscount.orderDiscountType === 'percentage'
                          ? `Theo tỉ lệ phần trăm: ${viewingDiscount.orderPercent}% ${
                              viewingDiscount.orderMaxDiscountAmount
                                ? `(Tối đa ${formatCurrency(viewingDiscount.orderMaxDiscountAmount)})`
                                : '(Không giới hạn tối đa)'
                            }`
                          : `Theo số tiền cố định: ${formatCurrency(viewingDiscount.orderFixedAmount)} ${
                              viewingDiscount.orderMinOrderValue
                                ? `(Đơn tối thiểu ${formatCurrency(viewingDiscount.orderMinOrderValue)})`
                                : ''
                            }`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="font-semibold text-gray-800">
                      Chiết khấu theo sản phẩm ({viewingDiscount.productItems?.length || 0} hàng hóa vật tư)
                    </div>
                    <div className="text-gray-500">
                      Kiểu: {viewingDiscount.productDiscountType === 'percentage' ? 'Theo tỉ lệ %' : 'Theo số tiền cố định'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingDiscount;
                  setViewingDiscount(null);
                  handleOpenEditModal(toEdit);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setViewingDiscount(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-fadeIn border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Xác nhận xóa chính sách</h3>
            <p className="text-xs text-gray-500 mb-5">
              Bạn có chắc chắn muốn xóa {selectedRows.length} chính sách chiết khấu đã chọn?
              Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HỒ SƠ HỢP ĐỒNG (Module Bán hàng) */}
      {/* ========================================================================= */}
      {viewingContractProfileDoc && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col font-sans overflow-auto animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 bg-white shrink-0">
            <h1 className="text-base font-normal text-gray-900 tracking-tight">Hồ sơ hợp đồng</h1>
            <button
              type="button"
              onClick={() => setViewingContractProfileDoc(null)}
              className="w-7 h-7 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 bg-white flex-1 overflow-auto">
            {/* Table Box */}
            <div className="border border-[#CBD5E1] rounded-md bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#EDF2F7] text-gray-700 border-b border-[#CBD5E1] select-none">
                    <tr>
                      <th className="w-10 min-w-[40px] border-r border-[#CBD5E1] py-2 px-2 text-center font-normal"></th>
                      <th className="w-12 min-w-[48px] border-r border-[#CBD5E1] py-2 px-2 text-center font-semibold text-gray-800">
                        #
                      </th>
                      <th className="w-48 min-w-[170px] border-r border-[#CBD5E1] py-2 px-3 font-semibold text-gray-800">
                        Loại giấy tờ
                      </th>
                      <th className="min-w-[220px] border-r border-[#CBD5E1] py-2 px-3 font-semibold text-gray-800">
                        Mô tả
                      </th>
                      <th className="w-36 min-w-[140px] border-r border-[#CBD5E1] py-2 px-3 font-semibold text-gray-800">
                        Ngày hiệu lực
                      </th>
                      <th className="w-36 min-w-[140px] border-r border-[#CBD5E1] py-2 px-3 font-semibold text-gray-800">
                        Ngày hết hạn
                      </th>
                      <th className="w-28 min-w-[110px] border-r border-[#CBD5E1] py-2 px-3 text-center font-semibold text-gray-800">
                        Còn hiệu lực
                      </th>
                      <th className="w-44 min-w-[160px] border-r border-[#CBD5E1] py-2 px-3 font-semibold text-gray-800">
                        Link
                      </th>
                      <th className="w-48 min-w-[180px] py-2 px-3 font-semibold text-gray-800">
                        File tải lên
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E1] bg-white">
                    {/* Existing rows */}
                    {(viewingContractProfileDoc.contractFiles || []).map((row, idx) => (
                      <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="w-10 border-r border-[#CBD5E1] py-1 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveContractFileRow(row.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Xóa dòng"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="w-12 border-r border-[#CBD5E1] py-1 px-2 text-center text-gray-700 font-medium">
                          {idx + 1}
                        </td>
                        <td className="w-48 border-r border-[#CBD5E1] py-1 px-2">
                          <input
                            type="text"
                            value={row.docType}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'docType', e.target.value)}
                            placeholder="Nhập loại giấy tờ..."
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none font-medium text-gray-800"
                          />
                        </td>
                        <td className="border-r border-[#CBD5E1] py-1 px-2">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'description', e.target.value)}
                            placeholder="Nhập mô tả..."
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-gray-800"
                          />
                        </td>
                        <td className="w-36 border-r border-[#CBD5E1] py-1 px-2">
                          <input
                            type="date"
                            value={row.effectiveDate}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'effectiveDate', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-gray-700"
                          />
                        </td>
                        <td className="w-36 border-r border-[#CBD5E1] py-1 px-2">
                          <input
                            type="date"
                            value={row.expirationDate}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'expirationDate', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-gray-700"
                          />
                        </td>
                        <td className="w-28 border-r border-[#CBD5E1] py-1 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.isValid}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'isValid', e.target.checked)}
                            className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8] cursor-pointer"
                          />
                        </td>
                        <td className="w-44 border-r border-[#CBD5E1] py-1 px-2">
                          <input
                            type="text"
                            value={row.link}
                            onChange={(e) => handleUpdateContractFileRow(row.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-blue-600 font-mono"
                          />
                        </td>
                        <td className="w-48 py-1 px-2">
                          <label className="flex items-center gap-1.5 px-2 py-1 border border-gray-200 hover:border-[#1A73E8] rounded text-xs cursor-pointer bg-gray-50/80 hover:bg-blue-50/30 text-gray-700 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                            <span className="truncate max-w-[120px] text-gray-600 font-medium" title={row.uploadedFile || 'Chọn tệp...'}>
                              {row.uploadedFile || 'Chọn tệp...'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpdateContractFileRow(row.id, 'uploadedFile', file.name);
                              }}
                            />
                          </label>
                        </td>
                      </tr>
                    ))}

                    {/* Special Row: + Bấm vào đây để thêm dòng mới */}
                    <tr className="hover:bg-gray-50/60 transition-colors group">
                      <td className="w-10 border-r border-[#CBD5E1] py-2 px-2 text-center"></td>
                      <td className="w-12 border-r border-[#CBD5E1] py-2 px-2 text-center"></td>
                      <td className="w-48 border-r border-[#CBD5E1] py-2 px-3"></td>
                      <td
                        onClick={handleAddContractFileRow}
                        className="border-r border-[#CBD5E1] py-2 px-3 text-gray-500 group-hover:text-[#1A73E8] italic text-xs cursor-pointer select-none flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0 text-gray-500 group-hover:text-[#1A73E8]" />
                        <span>Bấm vào đây để thêm dòng mới</span>
                      </td>
                      <td className="w-36 border-r border-[#CBD5E1] py-2 px-3"></td>
                      <td className="w-36 border-r border-[#CBD5E1] py-2 px-3"></td>
                      <td className="w-28 border-r border-[#CBD5E1] py-2 px-3 text-center"></td>
                      <td className="w-44 border-r border-[#CBD5E1] py-2 px-3"></td>
                      <td className="w-48 py-2 px-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-[#F8FAFC] border-t border-[#CBD5E1] px-4 py-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddContractFileRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-xs font-normal transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-gray-600" />
                  <span>Thêm dòng (F2)</span>
                </button>

                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Trợ giúp"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xem danh sách Voucher (FULL MÀN HÌNH) */}
      {isViewVoucherListModalOpen && (
        <div className="fixed inset-0 z-[60] bg-[#F4F6F9] flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Sticky Header */}
          <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsViewVoucherListModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">
                    {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Danh sách Mã giới thiệu' : 'Danh sách Voucher'}
                  </h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                    {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Quản lý Mã giới thiệu' : 'Quản lý Voucher'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {formCategory === 'Khách cũ giới thiệu Khách mới'
                    ? 'Xem và quản lý toàn bộ các mã giới thiệu phát hành trong chương trình'
                    : 'Xem và quản lý toàn bộ các mã Voucher phát hành trong chương trình'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsViewVoucherListModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* 1. THÔNG TIN CHƯƠNG TRÌNH / CHIẾN DỊCH & THỐNG KÊ SỐ LƯỢNG VOUCHER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Thông tin: Tên chương trình / chiến dịch, Cộng dồn ưu đãi, Ngày bắt đầu, Ngày kết thúc */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
                  <Tag className="w-4 h-4 text-[#1A73E8]" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Thông tin chương trình / chiến dịch
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Tên chương trình / chiến dịch */}
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-1">Tên chương trình / chiến dịch:</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {formName.trim() ? formName : '(Chưa đặt tên chương trình)'}
                    </span>
                    {formCode && (
                      <span className="ml-2 font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                        {formCode}
                      </span>
                    )}
                  </div>

                  {/* Cộng dồn ưu đãi */}
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-1">Cộng dồn ưu đãi:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-xs border ${
                      formStackable === 'allow'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      {formStackable === 'allow' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Cho phép Cộng dồn với Chương trình Chiết khấu
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5 text-gray-500" />
                          Không cho phép Cộng dồn với Chương trình Chiết khấu
                        </>
                      )}
                    </span>
                  </div>

                  {/* Ngày hiệu lực */}
                  <div>
                    <span className="text-gray-500 block mb-1">Ngày hiệu lực:</span>
                    <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                      <Calendar className="w-3.5 h-3.5 text-[#1A73E8]" />
                      <span>{formStartDate ? formStartDate.split('-').reverse().join('/') : '--/--/----'}</span>
                    </div>
                  </div>

                  {/* Ngày hết hiệu lực */}
                  <div>
                    <span className="text-gray-500 block mb-1">Ngày hết hiệu lực:</span>
                    <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{formEndDate ? formEndDate.split('-').reverse().join('/') : '--/--/----'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thống kê: Voucher / Mã giới thiệu */}
              {formCategory === 'Khách cũ giới thiệu Khách mới' ? (
                <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-xl border border-blue-200 p-5 shadow-xs bg-gradient-to-br from-blue-50/50 via-white to-slate-50 gap-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#1A73E8]" />
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Thống kê Mã giới thiệu
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#1A73E8] border border-blue-200">
                      Hợp lệ
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                        Tổng Mã giới thiệu
                      </span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-3xl font-black text-[#1A73E8]">
                          {formVoucherTotalCount.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          mã giới thiệu
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold shadow-2xs">
                      <Ticket className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Bổ sung phần: Cách thức tạo Mã giới thiệu */}
                  <div className="pt-3 pb-1 border-t border-blue-100/80">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                      Cách thức tạo Mã giới thiệu:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <label className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                        referralCodeMethod === 'phone'
                          ? 'bg-blue-50/90 border-[#1A73E8] text-[#1A73E8] font-bold shadow-2xs ring-1 ring-[#1A73E8]/30'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="referralCodeMethodRadio"
                          value="phone"
                          checked={referralCodeMethod === 'phone'}
                          onChange={() => setReferralCodeMethod('phone')}
                          className="w-3.5 h-3.5 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                        />
                        <span className="truncate font-medium">Số điện thoại</span>
                      </label>

                      <label className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                        referralCodeMethod === 'email'
                          ? 'bg-blue-50/90 border-[#1A73E8] text-[#1A73E8] font-bold shadow-2xs ring-1 ring-[#1A73E8]/30'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="referralCodeMethodRadio"
                          value="email"
                          checked={referralCodeMethod === 'email'}
                          onChange={() => setReferralCodeMethod('email')}
                          className="w-3.5 h-3.5 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                        />
                        <span className="truncate font-medium">Email</span>
                      </label>

                      <label className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                        referralCodeMethod === 'customer_code'
                          ? 'bg-blue-50/90 border-[#1A73E8] text-[#1A73E8] font-bold shadow-2xs ring-1 ring-[#1A73E8]/30'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="referralCodeMethodRadio"
                          value="customer_code"
                          checked={referralCodeMethod === 'customer_code'}
                          onChange={() => setReferralCodeMethod('customer_code')}
                          className="w-3.5 h-3.5 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                        />
                        <span className="truncate font-medium">Mã Khách hàng</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Mã áp dụng cho người được giới thiệu</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Sẵn sàng sử dụng
                    </span>
                  </div>
                </div>
              ) : (
                /* Thống kê Voucher: Tổng số Voucher hiện có = Tổng số voucher dành cho Khách hàng mới + Tổng số Voucher dành cho khách hàng hiện hữu */
                <div className="lg:col-span-5 flex flex-col gap-2 bg-slate-50/80 p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                  {/* 1. Tổng số Voucher hiện có */}
                  <div className="bg-white rounded-xl border-2 border-blue-400 p-3.5 shadow-xs flex items-center justify-between bg-gradient-to-r from-blue-50/40 to-white">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                          Tổng số Voucher hiện có
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-[#1A73E8] rounded border border-blue-200">
                          = (1) + (2)
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-[#1A73E8]">
                          {formVoucherTotalCount.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          (= {formVoucherNewCustomerCount.toLocaleString('vi-VN')} + {formVoucherExistingCustomerCount.toLocaleString('vi-VN')})
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold shadow-2xs">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Dấu = trực quan */}
                  <div className="relative flex items-center justify-center -my-1 z-10">
                    <div className="bg-white border-2 border-blue-400 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-2xs">
                      =
                    </div>
                  </div>

                  {/* 2. Tổng số voucher dành cho Khách hàng mới */}
                  <div className="bg-white rounded-xl border border-blue-200 p-3 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block">
                        (1) Tổng số voucher dành cho Khách hàng mới
                      </span>
                      <span className="text-xl font-black text-blue-600 mt-0.5 block">
                        {formVoucherNewCustomerCount.toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Dấu + trực quan */}
                  <div className="relative flex items-center justify-center -my-1 z-10">
                    <div className="bg-white border-2 border-emerald-400 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-2xs">
                      +
                    </div>
                  </div>

                  {/* 3. Tổng số Voucher dành cho khách hàng hiện hữu */}
                  <div className="bg-white rounded-xl border border-emerald-200 p-3 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block">
                        (2) Tổng số Voucher dành cho khách hàng hiện hữu
                      </span>
                      <span className="text-xl font-black text-emerald-600 mt-0.5 block">
                        {formVoucherExistingCustomerCount.toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. DÒNG CHUYÊN SEARCH / FILTER CÁC GIÁ TRỊ BẢNG */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[280px] flex-wrap">
                {/* Search input */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={voucherSearchTerm}
                    onChange={(e) => setVoucherSearchTerm(e.target.value)}
                    placeholder={
                      formCategory === 'Khách cũ giới thiệu Khách mới'
                        ? 'Tìm theo Mã giới thiệu, Mã KH, Tên KH, SĐT, Email, MST, Địa chỉ...'
                        : 'Tìm theo Mã voucher, Mã KH, Tên KH, SĐT, Email, MST, Địa chỉ...'
                    }
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A73E8] bg-white font-medium"
                  />
                  {voucherSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setVoucherSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Đối tượng */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Đối tượng:</span>
                  <select
                    value={voucherTargetFilter}
                    onChange={(e) => setVoucherTargetFilter(e.target.value as any)}
                    className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
                  >
                    <option value="all">Tất cả đối tượng</option>
                    <option value="new_customer">Khách hàng mới</option>
                    <option value="existing_customer">Khách hàng hiện hữu</option>
                  </select>
                </div>

                {/* Filter Xe trong Garage */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Xe trong Garage:</span>
                  <select
                    value={voucherGarageFilter}
                    onChange={(e) => setVoucherGarageFilter(e.target.value as any)}
                    className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
                  >
                    <option value="all">Tất cả</option>
                    <option value="Đang có">Đang có</option>
                    <option value="Không có">Không có</option>
                  </select>
                </div>

                {/* Filter Công nợ */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Công nợ:</span>
                  <select
                    value={voucherDebtFilter}
                    onChange={(e) => setVoucherDebtFilter(e.target.value as any)}
                    className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-[#1A73E8] bg-white cursor-pointer"
                  >
                    <option value="all">Tất cả</option>
                    <option value="with_debt">Có công nợ</option>
                    <option value="no_debt">Không nợ (0 đ)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Tạo Voucher / Tạo Mã giới thiệu */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenGenerateVoucher}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Tạo Mã giới thiệu' : 'Tạo Voucher'}</span>
                </button>
              </div>
            </div>

            {/* 3. BẢNG CHI TIẾT (READ-ONLY) */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[calc(100vh-380px)]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F8FAFC] text-gray-700 font-bold border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3 text-center w-12 border-r border-gray-200/80">STT</th>
                      <th className="py-3 px-3 min-w-[140px] border-r border-gray-200/80">
                        {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Mã giới thiệu hợp lệ' : 'Mã Voucher'}
                      </th>
                      <th className="py-3 px-3 min-w-[130px] border-r border-gray-200/80">Mã khách hàng</th>
                      <th className="py-3 px-3 min-w-[170px] border-r border-gray-200/80">Tên Khách hàng</th>
                      <th className="py-3 px-3 min-w-[200px] border-r border-gray-200/80">Địa chỉ</th>
                      <th className="py-3 px-3 min-w-[120px] border-r border-gray-200/80">SĐT</th>
                      <th className="py-3 px-3 min-w-[160px] border-r border-gray-200/80">Email</th>
                      <th className="py-3 px-3 min-w-[120px] border-r border-gray-200/80">MST</th>
                      <th className="py-3 px-3 min-w-[130px] text-right border-r border-gray-200/80">Công nợ</th>
                      <th className="py-3 px-3 min-w-[140px] text-center border-r border-gray-200/80">Xe trong Garage</th>
                      <th className="py-3 px-2 text-center w-14">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVouchers.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-gray-400">
                          {formCategory === 'Khách cũ giới thiệu Khách mới' ? (
                            <>Không tìm thấy mã giới thiệu nào phù hợp. Nhấn <strong>"Tạo Mã giới thiệu"</strong> để bổ sung.</>
                          ) : (
                            <>Không tìm thấy mã Voucher nào phù hợp. Nhấn <strong>"Tạo Voucher"</strong> để bổ sung.</>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredVouchers.map((v, idx) => {
                        const validReferralCode =
                          formCategory === 'Khách cũ giới thiệu Khách mới'
                            ? referralCodeMethod === 'phone'
                              ? v.phone?.trim() || v.code
                              : referralCodeMethod === 'email'
                              ? v.email?.trim() || v.code
                              : v.customerCode?.trim() || v.code
                            : v.code;
                        return (
                          <tr key={v.id} className="hover:bg-blue-50/20 transition-colors">
                            {/* STT */}
                            <td className="py-2.5 px-3 text-center text-gray-500 font-medium border-r border-gray-100">
                              {idx + 1}
                            </td>

                            {/* Mã Voucher / Mã giới thiệu hợp lệ */}
                            <td className="py-2.5 px-3 border-r border-gray-100">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-bold text-[#1A73E8]">
                                  {validReferralCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(validReferralCode);
                                    setVoucherCopiedId(v.id);
                                    setTimeout(() => setVoucherCopiedId(null), 1500);
                                  }}
                                  className="p-1 text-gray-400 hover:text-[#1A73E8] rounded transition-colors cursor-pointer"
                                  title="Sao chép mã"
                                >
                                  {voucherCopiedId === v.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                          {/* Mã khách hàng */}
                          <td className="py-2.5 px-3 border-r border-gray-100 font-mono font-medium text-gray-800">
                            {v.customerCode || '-'}
                          </td>

                          {/* Tên Khách hàng */}
                          <td className="py-2.5 px-3 border-r border-gray-100 font-medium text-gray-900">
                            {v.customerName || '-'}
                          </td>

                          {/* Địa chỉ */}
                          <td className="py-2.5 px-3 border-r border-gray-100 text-gray-700">
                            {v.address || '-'}
                          </td>

                          {/* SĐT */}
                          <td className="py-2.5 px-3 border-r border-gray-100 font-medium text-gray-800">
                            {v.phone || '-'}
                          </td>

                          {/* Email */}
                          <td className="py-2.5 px-3 border-r border-gray-100 text-gray-700">
                            {v.email || '-'}
                          </td>

                          {/* MST */}
                          <td className="py-2.5 px-3 border-r border-gray-100 font-mono text-gray-700">
                            {v.taxCode || '-'}
                          </td>

                          {/* Công nợ */}
                          <td className="py-2.5 px-3 border-r border-gray-100 text-right font-semibold text-gray-800">
                            {(typeof v.debt === 'number' ? v.debt : (parseFloat(String(v.debt || '0')) || 0)).toLocaleString('vi-VN')} đ
                          </td>

                          {/* Xe trong Garage (Đang có, Không có) */}
                          <td className="py-2.5 px-3 border-r border-gray-100 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                v.hasCarInGarage === 'Đang có'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {v.hasCarInGarage || 'Không có'}
                            </span>
                          </td>

                          {/* Xóa */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteVoucher(v.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title={formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Xóa mã giới thiệu' : 'Xóa voucher'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Hiển thị <strong>{filteredVouchers.length}</strong> / <strong>{formVouchersList.length}</strong> {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'mã giới thiệu' : 'voucher'}
                </span>
                <span className="text-[11px] text-gray-400 italic">
                  * Dữ liệu danh sách {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Mã giới thiệu' : 'Voucher'} ở chế độ chỉ đọc (read-only)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tạo Voucher (Full màn hình) */}
      {isGenerateVoucherModalOpen && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="h-16 px-6 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {formCategory === 'Khách cũ giới thiệu Khách mới' ? 'Tạo Mã giới thiệu' : 'Tạo Voucher'}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                    Giao diện toàn màn hình
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  {formCategory === 'Khách cũ giới thiệu Khách mới'
                    ? 'Cấu hình nhóm khách hàng và danh sách khách hàng được cấp mã giới thiệu'
                    : 'Cấu hình đối tượng áp dụng và số lượng mã Voucher cần phát hành'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGenerateVoucherModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/60">
            {/* KHU VỰC: Đối tượng áp dụng Voucher (chỉ hiển thị khi KHÔNG PHẢI là 'Khách cũ giới thiệu Khách mới') */}
            {formCategory !== 'Khách cũ giới thiệu Khách mới' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Đối tượng áp dụng Voucher <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tick chọn "Dành cho Khách hàng mới" */}
                  <label
                    onClick={() => setGenVoucherTargetType('new_customer')}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      genVoucherTargetType === 'new_customer'
                        ? 'border-[#1A73E8] bg-blue-50/30 shadow-2xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="genVoucherTargetChoice"
                      checked={genVoucherTargetType === 'new_customer'}
                      onChange={() => setGenVoucherTargetType('new_customer')}
                      className="mt-0.5 w-4 h-4 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                    />
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-gray-900 block">
                        Dành cho Khách hàng mới
                      </span>
                      <p className="text-xs text-gray-500">
                        Phát hành số lượng mã Voucher dự phòng cho khách hàng mới đến garage.
                      </p>
                    </div>
                  </label>

                  {/* Tick chọn "Dành cho khách hàng hiện hữu" */}
                  <label
                    onClick={() => setGenVoucherTargetType('existing_customer')}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      genVoucherTargetType === 'existing_customer'
                        ? 'border-[#1A73E8] bg-blue-50/30 shadow-2xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="genVoucherTargetChoice"
                      checked={genVoucherTargetType === 'existing_customer'}
                      onChange={() => setGenVoucherTargetType('existing_customer')}
                      className="mt-0.5 w-4 h-4 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                    />
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-gray-900 block">
                        Dành cho khách hàng hiện hữu
                      </span>
                      <p className="text-xs text-gray-500">
                        Gán trực tiếp mã Voucher cho các khách hàng đã có trong danh sách của garage.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* KHI CHỌN: Dành cho Khách hàng mới (chỉ với Voucher thông thường) */}
            {formCategory !== 'Khách cũ giới thiệu Khách mới' && genVoucherTargetType === 'new_customer' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="max-w-md space-y-2">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Số lượng Voucher cần tạo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={genVoucherQty}
                        onChange={(e) => setGenVoucherQty(e.target.value)}
                        placeholder="Nhập số lượng Voucher cần tạo..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-[#1A73E8] bg-white shadow-2xs"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                        mã Voucher
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dòng thông báo số lượng Voucher sắp tạo */}
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold flex-shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Bạn sắp tạo Mã Voucher có số lượng:{' '}
                      <span className="text-blue-700 font-bold text-base px-1.5 py-0.5 bg-white border border-blue-200 rounded-md">
                        {genVoucherQty || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HIỂN THỊ PHẦN 1 VÀ PHẦN 2: Khi là 'Khách cũ giới thiệu Khách mới' hoặc khi genVoucherTargetType === 'existing_customer' */}
            {(formCategory === 'Khách cũ giới thiệu Khách mới' || genVoucherTargetType === 'existing_customer') && (
              <div className="space-y-6">
                {/* PHẦN 1: Nhóm khách hàng áp dụng */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-gray-100">
                    <div>
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#1A73E8]" />
                        Phần 1: Nhóm khách hàng áp dụng
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        (cho phép chọn nhiều, Danh sách dưới được hiển thị từ Module Nhóm Khách hàng)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddGroupsToExistingCustList}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm vào Danh sách</span>
                    </button>
                  </div>

                  {/* Danh sách nhóm khách hàng dạng checkbox */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    {CUSTOMER_GROUP_OPTIONS.map((group) => {
                      const isSelected = genSelectedCustomerGroups.includes(group);
                      return (
                        <label
                          key={group}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#1A73E8] bg-blue-50/40 text-blue-900 font-semibold'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setGenSelectedCustomerGroups((prev) =>
                                isSelected ? prev.filter((g) => g !== group) : [...prev, group]
                              );
                            }}
                            className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8] cursor-pointer"
                          />
                          <span className="text-xs">{group}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* PHẦN 2: Danh sách khách hàng hiện hữu */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-0">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2 bg-gray-50/60">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-emerald-600" />
                        Phần 2: Danh sách khách hàng hiện hữu
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {genExistingCustRows.length} khách hàng
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddRowToExistingCustList}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm dòng</span>
                    </button>
                  </div>

                  {/* Bảng chi tiết: STT, Mã khách hàng, Tên Khách hàng, Địa chỉ, SĐT, Email, MST, Công nợ, Xe trong Garage (Đang có, Không có), Xóa */}
                  <div className="overflow-x-auto max-h-[420px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#F8FAFC] text-gray-700 font-bold border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12 border-r border-gray-200/80">STT</th>
                          <th className="py-2.5 px-3 min-w-[130px] border-r border-gray-200/80">Mã khách hàng</th>
                          <th className="py-2.5 px-3 min-w-[170px] border-r border-gray-200/80">Tên Khách hàng</th>
                          <th className="py-2.5 px-3 min-w-[200px] border-r border-gray-200/80">Địa chỉ</th>
                          <th className="py-2.5 px-3 min-w-[120px] border-r border-gray-200/80">SĐT</th>
                          <th className="py-2.5 px-3 min-w-[160px] border-r border-gray-200/80">Email</th>
                          <th className="py-2.5 px-3 min-w-[120px] border-r border-gray-200/80">MST</th>
                          <th className="py-2.5 px-3 min-w-[130px] text-right border-r border-gray-200/80">Công nợ</th>
                          <th className="py-2.5 px-3 min-w-[140px] text-center border-r border-gray-200/80">Xe trong Garage</th>
                          <th className="py-2.5 px-2 text-center w-14">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {genExistingCustRows.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-12 text-center text-gray-400">
                              Chưa có khách hàng nào trong danh sách. Vui lòng chọn Nhóm khách hàng ở <strong>Phần 1</strong> rồi nhấn <strong>"Thêm vào Danh sách"</strong>, hoặc nhấn <strong>"+ Thêm dòng"</strong>.
                            </td>
                          </tr>
                        ) : (
                          genExistingCustRows.map((row, idx) => (
                            <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                              <td className="py-2 px-3 text-center text-gray-500 font-medium border-r border-gray-100">
                                {idx + 1}
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="text"
                                  value={row.customerCode}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'customerCode', e.target.value)}
                                  placeholder="Mã KH..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none font-mono font-medium text-gray-800"
                                />
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="text"
                                  value={row.customerName}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'customerName', e.target.value)}
                                  placeholder="Tên khách hàng..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none font-medium text-gray-800"
                                />
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="text"
                                  value={row.address}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'address', e.target.value)}
                                  placeholder="Địa chỉ..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-gray-700"
                                />
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="text"
                                  value={row.phone}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'phone', e.target.value)}
                                  placeholder="SĐT..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none font-medium text-gray-800"
                                />
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="email"
                                  value={row.email}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'email', e.target.value)}
                                  placeholder="Email..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none text-gray-700"
                                />
                              </td>
                              <td className="py-1 px-2 border-r border-gray-100">
                                <input
                                  type="text"
                                  value={row.taxCode}
                                  onChange={(e) => handleUpdateGenExistingRow(row.id, 'taxCode', e.target.value)}
                                  placeholder="MST..."
                                  className="w-full px-2 py-1 text-xs border border-transparent hover:border-gray-200 focus:border-[#1A73E8] rounded outline-none font-mono text-gray-700"
                                />
                              </td>
                              <td className="py-2.5 px-3 border-r border-gray-100 text-right font-semibold text-gray-800">
                                {(typeof row.debt === 'number' ? row.debt : (parseFloat(String(row.debt || '0')) || 0)).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-2.5 px-3 border-r border-gray-100 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                    row.hasCarInGarage === 'Đang có'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-gray-100 text-gray-600 border-gray-300'
                                  }`}
                                >
                                  {row.hasCarInGarage || 'Không có'}
                                </span>
                              </td>
                              <td className="py-1 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRowFromExistingCustList(row.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Xóa dòng"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PHẦN 3: Dòng chữ thông báo số lượng */}
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold flex-shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {formCategory === 'Khách cũ giới thiệu Khách mới'
                        ? 'Bạn sắp tạo Mã giới thiệu có số lượng: '
                        : 'Bạn sắp tạo Mã Voucher có số lượng: '}
                      <span className="text-blue-700 font-bold text-base px-1.5 py-0.5 bg-white border border-blue-200 rounded-md">
                        {genExistingCustRows.length}
                      </span>{' '}
                      khách hàng.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-16 px-6 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
            <div className="text-xs text-gray-500">
              {formCategory === 'Khách cũ giới thiệu Khách mới'
                ? `Dự kiến tạo: ${genExistingCustRows.length} mã giới thiệu tương ứng ${genExistingCustRows.length} khách hàng`
                : genVoucherTargetType === 'existing_customer'
                ? `Dự kiến tạo: ${genExistingCustRows.length} mã Voucher tương ứng ${genExistingCustRows.length} khách hàng hiện hữu`
                : null}
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={handleConfirmGenerateVouchers}
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận Tạo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULL-SCREEN XEM DANH SÁCH LỆNH SỬA CHỮA (RO) - KHỚP ẢNH ĐÍNH KÈM */}
      {/* ========================================================================= */}
      {viewingRODiscount && (
        <div className="fixed inset-0 z-[70] bg-[#F5F7FA] flex flex-col font-sans overflow-hidden animate-fadeIn">
          {/* Top Header with Back / Title and Dismiss */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewingRODiscount(null)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Quay lại Quản lý chiết khấu"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Danh sách Lệnh sửa chữa (RO)</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Chính sách: {viewingRODiscount.code} - {viewingRODiscount.name}
                  </span>
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewingRODiscount(null)}
              className="w-7 h-7 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Bar exactly like image_aeaea30f.png */}
          <div className="bg-white px-6 py-3.5 border-b border-gray-200 shadow-2xs flex flex-wrap items-end justify-between gap-4 shrink-0">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Filter 1: Biển số và số RO */}
              <div className="w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Biển số và số RO
                </label>
                <input
                  type="text"
                  placeholder="Tìm biển số, số RO"
                  value={roSearchPlate}
                  onChange={(e) => {
                    setRoSearchPlate(e.target.value);
                    setRoCurrentPage(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Filter 2: Khách hàng */}
              <div className="w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Khách hàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm mã, tên, điện thoại"
                    value={roSearchCustomer}
                    onChange={(e) => {
                      setRoSearchCustomer(e.target.value);
                      setRoCurrentPage(1);
                    }}
                    className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 3: Cố vấn */}
              <div className="w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cố vấn
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm mã, tên"
                    value={roSearchAdvisor}
                    onChange={(e) => {
                      setRoSearchAdvisor(e.target.value);
                      setRoCurrentPage(1);
                    }}
                    className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Button Lọc */}
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#E2E8F0] hover:bg-slate-300 text-gray-700 rounded text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              >
                <Filter className="w-3.5 h-3.5 text-gray-600" />
                <span>Lọc</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8FAFC] text-gray-700 border-b border-gray-200 sticky top-0 z-10 select-none">
                <tr className="divide-x divide-gray-200">
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap w-12 text-center">
                    STT
                  </th>
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap min-w-[130px]">
                    <div className="flex items-center gap-1">
                      <span>Biển số xe</span>
                      <Pin className="w-3.5 h-3.5 text-amber-700 rotate-45 shrink-0" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[110px]">
                    Số RO
                  </th>
                  <th className="py-2.5 px-3 font-semibold min-w-[170px]">
                    Thông tin xe
                  </th>
                  <th className="py-2.5 px-3 font-semibold min-w-[260px]">
                    Khách hàng
                  </th>
                  <th className="py-2.5 px-3 font-semibold min-w-[110px]">
                    Cố vấn
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[140px]">
                    Ngày nhận xe
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[140px]">
                    Ngày hẹn giao
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[140px]">
                    Ngày giao thực tế
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[120px]">
                    Giai đoạn
                  </th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[110px] text-center">
                    Trạng thái
                  </th>
                  <th className="py-2.5 px-3 min-w-[20px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(() => {
                  const filteredROList = SAMPLE_REPAIR_ORDERS.filter((ro) => {
                    if (roSearchPlate.trim()) {
                      const q = roSearchPlate.toLowerCase().trim();
                      const match =
                        ro.plateNumber.toLowerCase().includes(q) ||
                        ro.roNumber.toLowerCase().includes(q);
                      if (!match) return false;
                    }
                    if (roSearchCustomer.trim()) {
                      const q = roSearchCustomer.toLowerCase().trim();
                      const match =
                        ro.customerName.toLowerCase().includes(q) ||
                        (ro.customerPhone && ro.customerPhone.includes(q));
                      if (!match) return false;
                    }
                    if (roSearchAdvisor.trim()) {
                      const q = roSearchAdvisor.toLowerCase().trim();
                      const match = ro.advisor.toLowerCase().includes(q);
                      if (!match) return false;
                    }
                    return true;
                  });

                  const paginatedROList = filteredROList.slice(
                    (roCurrentPage - 1) * roPageSize,
                    roCurrentPage * roPageSize
                  );

                  if (paginatedROList.length === 0) {
                    return (
                      <tr>
                        <td colSpan={12} className="py-12 text-center text-gray-400">
                          Không tìm thấy Lệnh sửa chữa (RO) nào phù hợp.
                        </td>
                      </tr>
                    );
                  }

                  return paginatedROList.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-blue-50/20 divide-x divide-gray-200 transition-colors">
                      {/* STT */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap text-center text-gray-500 font-medium">
                        {(roCurrentPage - 1) * roPageSize + idx + 1}
                      </td>

                      {/* Biển số xe */}
                      <td className="py-2.5 px-4 align-middle whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-[#0284C7] text-white font-bold text-xs rounded tracking-wider shadow-2xs inline-block">
                          {row.plateNumber}
                        </span>
                      </td>

                      {/* Số RO */}
                      <td className="py-2.5 px-3 align-middle text-gray-800 font-medium whitespace-nowrap">
                        {row.roNumber}
                      </td>

                      {/* Thông tin xe */}
                      <td className="py-2.5 px-3 align-middle">
                        <div className="font-medium text-gray-900 leading-tight">
                          {row.carInfo}
                        </div>
                        {row.carSubInfo && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {row.carSubInfo}
                          </div>
                        )}
                      </td>

                      {/* Khách hàng */}
                      <td className="py-2.5 px-3 align-middle">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-gray-900 font-medium leading-tight">
                            {row.customerName}
                          </span>
                          {row.hasInsurance && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-green-200 shrink-0">
                              Bảo hiểm
                            </span>
                          )}
                        </div>
                        {row.customerPhone && (
                          <div className="text-[#0284C7] font-medium text-xs mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#0284C7] shrink-0" />
                            <span>{row.customerPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* Cố vấn */}
                      <td className="py-2.5 px-3 align-middle text-gray-700 whitespace-nowrap">
                        {row.advisor}
                      </td>

                      {/* Ngày nhận xe */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap text-gray-800">
                        <div>{row.receivedDate}</div>
                        {row.receivedKm && (
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {row.receivedKm}
                          </div>
                        )}
                      </td>

                      {/* Ngày hẹn giao */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap text-gray-800">
                        {row.estDeliveryDate || ''}
                      </td>

                      {/* Ngày giao thực tế */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap text-gray-800">
                        {row.actualDeliveryDate || ''}
                      </td>

                      {/* Giai đoạn */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                        {row.stage === 'Tiếp nhận' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                            <ClipboardList className="w-3.5 h-3.5 text-[#EA580C]" />
                            Tiếp nhận
                          </span>
                        )}
                        {row.stage === 'Lệnh sửa c...' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                            <Wrench className="w-3.5 h-3.5 text-[#2563EB]" />
                            Lệnh sửa c...
                          </span>
                        )}
                        {row.stage === 'Quyết toán' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                            <DollarSign className="w-3.5 h-3.5 text-[#DC2626]" />
                            Quyết toán
                          </span>
                        )}
                        {row.stage === 'Nghiệm thu' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFEFF] text-[#0E7490] border border-[#A5F3FC]">
                            <CheckSquare className="w-3.5 h-3.5 text-[#0891B2]" />
                            Nghiệm thu
                          </span>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-2.5 px-3 align-middle whitespace-nowrap text-center">
                        {row.status === 'Mới' && (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 text-center min-w-[68px]">
                            Mới
                          </span>
                        )}
                        {row.status === 'Đang sửa' && (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-white text-[#2563EB] border border-[#93C5FD] text-center min-w-[68px]">
                            Đang sửa
                          </span>
                        )}
                        {row.status === 'Đã bàn giao' && (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-white text-[#16A34A] border border-[#86EFAC] text-center min-w-[68px]">
                            Đã bàn giao
                          </span>
                        )}
                        {row.status === 'Huỷ' && (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-white text-[#DC2626] border border-[#FCA5A5] text-center min-w-[68px]">
                            Huỷ
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3"></td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination matching image_aeaea30f.png */}
          <div className="h-12 px-6 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 shrink-0 select-none">
            {/* Left: Số dòng */}
            <div className="flex items-center gap-2">
              <span>Số dòng:</span>
              <select
                value={roPageSize}
                onChange={(e) => {
                  setRoPageSize(Number(e.target.value));
                  setRoCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={20}>20 Dòng</option>
                <option value={50}>50 Dòng</option>
                <option value={100}>100 Dòng</option>
              </select>
            </div>

            {/* Center: Pagination controls */}
            {(() => {
              const filteredROList = SAMPLE_REPAIR_ORDERS.filter((ro) => {
                if (roSearchPlate.trim()) {
                  const q = roSearchPlate.toLowerCase().trim();
                  const match =
                    ro.plateNumber.toLowerCase().includes(q) ||
                    ro.roNumber.toLowerCase().includes(q);
                  if (!match) return false;
                }
                if (roSearchCustomer.trim()) {
                  const q = roSearchCustomer.toLowerCase().trim();
                  const match =
                    ro.customerName.toLowerCase().includes(q) ||
                    (ro.customerPhone && ro.customerPhone.includes(q));
                  if (!match) return false;
                }
                if (roSearchAdvisor.trim()) {
                  const q = roSearchAdvisor.toLowerCase().trim();
                  const match = ro.advisor.toLowerCase().includes(q);
                  if (!match) return false;
                }
                return true;
              });

              const totalPages = Math.ceil(filteredROList.length / roPageSize) || 1;
              const startIdx = (roCurrentPage - 1) * roPageSize + 1;
              const endIdx = Math.min(roCurrentPage * roPageSize, filteredROList.length);

              return (
                <>
                  <div className="flex items-center gap-1.5">
                    {/* First Page |< */}
                    <button
                      type="button"
                      disabled={roCurrentPage === 1}
                      onClick={() => setRoCurrentPage(1)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        roCurrentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 cursor-pointer font-bold'
                      }`}
                      title="Trang đầu"
                    >
                      |&lt;
                    </button>

                    {/* Prev Page < */}
                    <button
                      type="button"
                      disabled={roCurrentPage === 1}
                      onClick={() => setRoCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        roCurrentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 cursor-pointer font-bold'
                      }`}
                      title="Trang trước"
                    >
                      &lt;
                    </button>

                    {/* Page numbers: 1, 2, 3 */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setRoCurrentPage(pageNum)}
                        className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors cursor-pointer ${
                          roCurrentPage === pageNum
                            ? 'border border-[#1A73E8] text-[#1A73E8] bg-blue-50/50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Page > */}
                    <button
                      type="button"
                      disabled={roCurrentPage === totalPages}
                      onClick={() => setRoCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        roCurrentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 cursor-pointer font-bold'
                      }`}
                      title="Trang tiếp"
                    >
                      &gt;
                    </button>

                    {/* Last Page >| */}
                    <button
                      type="button"
                      disabled={roCurrentPage === totalPages}
                      onClick={() => setRoCurrentPage(totalPages)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        roCurrentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 cursor-pointer font-bold'
                      }`}
                      title="Trang cuối"
                    >
                      &gt;|
                    </button>
                  </div>

                  {/* Right: Hiển thị 1–20 / 45 kết quả */}
                  <div className="text-gray-600">
                    Hiển thị <span className="font-semibold">{startIdx}–{endIdx}</span> / <span className="font-semibold">{filteredROList.length}</span> kết quả
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal Thông báo Chạy chiến dịch */}
      {/* Modal Full-Screen Chạy chiến dịch */}
      {campaignModalDiscount && (
        <CampaignExecutionFullScreenModal
          discount={campaignModalDiscount}
          onClose={handleCloseCampaignModal}
          onRunCampaign={(postData) => {
            const targetId = campaignModalDiscount.id;
            setDiscounts((prev) =>
              prev.map((d) =>
                d.id === targetId
                  ? { ...d, campaignRunCount: (d.campaignRunCount ?? 0) + 1 }
                  : d
              )
            );
          }}
        />
      )}

      {/* Modal Thông báo khi Trạng thái = Khóa */}
      {lockedCampaignDiscount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
          onClick={() => setLockedCampaignDiscount(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/40 border-b border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Thông báo
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {lockedCampaignDiscount.code} - {lockedCampaignDiscount.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockedCampaignDiscount(null)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/80 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
                  <div className="text-sm font-bold text-amber-950 leading-snug">
                    &quot;Tính năng đang tạm khóa&quot; do Trạng thái chiến dịch đang bị Khóa.
                  </div>
                </div>
                <div className="text-sm text-gray-700 pl-5.5 leading-relaxed">
                  Để thực thi &quot;Chạy chiến dịch&quot; cần thay đổi trạng thái = <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">Mở khóa</strong>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setLockedCampaignDiscount(null)}
                className="px-6 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XEM LỊCH SỬ GIỚI THIỆU (FULL MÀN HÌNH THEO CHUẨN GIAO DIỆN) */}
      {/* ========================================================================= */}
      {isReferralHistoryModalOpen && (
        <div className="fixed inset-0 z-[70] bg-[#F4F6F9] flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Sticky Header */}
          <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReferralHistoryModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Lịch sử Giới thiệu khách hàng
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {referralHistoryList.length} đơn hoàn thành
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Theo dõi danh sách đơn hàng người mới hoàn thành và mã thưởng tự sinh cho Người giới thiệu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReferralHistoryModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4 text-gray-500" />
                <span>Đóng</span>
              </button>
            </div>
          </div>

          {/* Body cuộn nội dung */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* 4 Thẻ Thống kê hàng đầu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Đơn người mới hoàn tất */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Đơn người mới hoàn tất</div>
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {referralCompletedOrdersCount} <span className="text-sm font-semibold text-gray-500">đơn</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Lệnh RO đã nghiệm thu hoàn tất</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Mã thưởng đã tự sinh */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Mã thưởng đã tự sinh</div>
                  <div className="text-2xl font-black text-emerald-600 tracking-tight">
                    {referralGeneratedCodesCount} <span className="text-sm font-semibold text-emerald-600/80">mã</span>
                  </div>
                  <div className="text-[11px] text-emerald-600/70 mt-0.5">Tự động cấp cho Người giới thiệu</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Tổng tiền người mới đã mua */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Tổng tiền người mới đã mua</div>
                  <div className="text-2xl font-black text-[#1A73E8] tracking-tight">
                    {referralTotalPurchasedAmount.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-[#1A73E8]/80">đ</span>
                  </div>
                  <div className="text-[11px] text-blue-500/70 mt-0.5">Tổng giá trị đơn hàng kích hoạt</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4: Mã thưởng đã sử dụng */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Mã thưởng đã sử dụng</div>
                  <div className="text-2xl font-black text-purple-600 tracking-tight">
                    {referralUsedRewardsCount} <span className="text-sm font-semibold text-purple-600/70">/ {referralGeneratedCodesCount}</span>
                  </div>
                  <div className="text-[11px] text-purple-500/70 mt-0.5">Khách cũ quay lại dùng voucher</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Bảng Dữ liệu Lịch sử Giới thiệu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col">
              {/* Toolbar bộ lọc & tìm kiếm */}
              <div className="p-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={referralHistorySearch}
                    onChange={(e) => setReferralHistorySearch(e.target.value)}
                    placeholder="Tìm theo người giới thiệu, người mới, số đơn (RO), mã thưởng..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A73E8] shadow-2xs"
                  />
                  {referralHistorySearch && (
                    <button
                      type="button"
                      onClick={() => setReferralHistorySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Trạng thái mã:</span>
                  <select
                    value={referralCodeStatusFilter}
                    onChange={(e) => setReferralCodeStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-[#1A73E8] bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Chưa sử dụng">Chưa sử dụng</option>
                    <option value="Đã sử dụng">Đã sử dụng</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F8FAFC] text-gray-700 font-bold border-b border-gray-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-4 border-r border-gray-200/80">Thời gian</th>
                      <th className="py-3 px-4 min-w-[200px] border-r border-gray-200/80">Người giới thiệu (Khách hiện hữu)</th>
                      <th className="py-3 px-4 min-w-[180px] border-r border-gray-200/80">Người mới được giới thiệu</th>
                      <th className="py-3 px-4 min-w-[190px] border-r border-gray-200/80">Đơn hàng kích hoạt</th>
                      <th className="py-3 px-4 min-w-[180px] border-r border-gray-200/80">Mã thưởng TỰ ĐỘNG SINH</th>
                      <th className="py-3 px-4 min-w-[120px] text-right border-r border-gray-200/80">Trị giá thưởng</th>
                      <th className="py-3 px-4 min-w-[110px] text-center border-r border-gray-200/80">Hạn dùng</th>
                      <th className="py-3 px-4 min-w-[120px] text-center border-r border-gray-200/80">Trạng thái mã</th>
                      <th className="py-3 px-4 text-center min-w-[100px]">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReferralHistory.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          Không tìm thấy bản ghi nào trong lịch sử giới thiệu.
                        </td>
                      </tr>
                    ) : (
                      filteredReferralHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                          {/* 1. Thời gian */}
                          <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap border-r border-gray-100">
                            {item.completedDate}
                          </td>

                          {/* 2. Người giới thiệu (Khách hiện hữu) - Hiển thị ĐẦU TIÊN */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="font-bold text-gray-900 text-sm">{item.referrerName}</div>
                            <div className="text-[11px] text-[#1A73E8] font-mono mt-0.5 font-medium">
                              {item.referrerPhone} • {item.referrerCode}
                            </div>
                          </td>

                          {/* 3. Người mới được giới thiệu */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">{item.newCustomerName}</div>
                            <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                              {item.newCustomerPhone}
                            </div>
                          </td>

                          {/* 4. Đơn hàng kích hoạt - có đầy đủ số tiền RO */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="font-mono font-bold text-gray-900 text-sm">
                              {item.orderCode}
                            </div>
                            <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                              {item.orderValue.toLocaleString('vi-VN')} đ ({item.orderStatus || 'Hoàn thành'})
                            </div>
                          </td>

                          {/* 5. Mã thưởng TỰ ĐỘNG SINH */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-xs">
                              <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{item.rewardCode || item.referralCode}</span>
                            </div>
                          </td>

                          {/* 6. Trị giá thưởng */}
                          <td className="py-3 px-4 text-right font-bold text-emerald-600 text-sm border-r border-gray-100 whitespace-nowrap">
                            {(item.rewardValue || 200000).toLocaleString('vi-VN')} đ
                          </td>

                          {/* 7. Hạn dùng */}
                          <td className="py-3 px-4 text-center text-gray-600 font-medium border-r border-gray-100 whitespace-nowrap">
                            {item.rewardExpiryDate || '23/11/2026'}
                          </td>

                          {/* 8. Trạng thái mã */}
                          <td className="py-3 px-4 text-center border-r border-gray-100 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              (item.rewardCodeStatus || 'Chưa sử dụng') === 'Chưa sử dụng'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {item.rewardCodeStatus || 'Chưa sử dụng'}
                            </span>
                          </td>

                          {/* 9. Thao tác: Chép mã */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const codeToCopy = item.rewardCode || item.referralCode || '';
                                navigator.clipboard.writeText(codeToCopy);
                                setCopiedRewardCode(item.id);
                                setTimeout(() => setCopiedRewardCode(null), 2000);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                copiedRewardCode === item.id
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 shadow-2xs'
                              }`}
                            >
                              {copiedRewardCode === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                                  <span>Chép mã</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div>
                  Hiển thị <span className="font-bold text-gray-800">{filteredReferralHistory.length}</span> / <span className="font-bold text-gray-800">{referralHistoryList.length}</span> bản ghi
                </div>
                <div className="text-[11px] text-gray-400">
                  Dữ liệu đồng bộ tự động theo thời gian thực từ phân hệ Lệnh sửa chữa (RO)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XEM TRƯỚC NỘI DUNG GỬI CHO NGƯỜI GIỚI THIỆU (FULL MÀN HÌNH & CÓ NÚT SỬA) */}
      {/* ========================================================================= */}
      {isPreviewMessageModalOpen && (
        <div className="fixed inset-0 z-[70] bg-[#F4F6F9] flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Sticky Header */}
          <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewMessageModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A73E8] to-blue-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Xem trước Nội dung gửi Mã quà tặng cho Người giới thiệu
                  </h2>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                    Toàn màn hình
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tự động gửi ngay cho người giới thiệu khi đơn của khách mới hoàn tất thanh toán
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Nút Sửa */}
              <button
                type="button"
                onClick={() => setIsEditingPreviewTemplate(!isEditingPreviewTemplate)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isEditingPreviewTemplate
                    ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                }`}
                title={isEditingPreviewTemplate ? 'Bấm để hoàn tất và xem trước' : 'Chỉnh sửa nội dung mẫu tin nhắn'}
              >
                <SquarePen className="w-4 h-4" />
                <span>{isEditingPreviewTemplate ? 'Đang Sửa (Bấm để xem kết quả)' : 'Sửa'}</span>
              </button>

              {/* Nút Đóng */}
              <button
                type="button"
                onClick={() => setIsPreviewMessageModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>

          {/* Sub Header: Channels Navigation & Status */}
          <div className="px-6 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
            {/* Channel Tabs */}
            <div className="flex items-center gap-2">
              {(['SMS', 'Zalo OA', 'Email'] as const).map((ch) => {
                const isSelected = previewChannelTab === ch;
                const isConfigured = formReferrerSendChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setPreviewChannelTab(ch)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? ch === 'SMS'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : ch === 'Zalo OA'
                          ? 'bg-[#0068FF] text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200/80'
                    }`}
                  >
                    {ch === 'SMS' && <Smartphone className="w-4 h-4" />}
                    {ch === 'Zalo OA' && <MessageSquare className="w-4 h-4" />}
                    {ch === 'Email' && <Mail className="w-4 h-4" />}
                    <span>{ch}</span>
                    {isConfigured && (
                      <span
                        className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}
                        title="Được chọn gửi tự động"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Config & Status Information */}
            <div className="flex items-center gap-3">
              {formReferrerSendChannels.includes(previewChannelTab) ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kênh <strong>{previewChannelTab}</strong> đang được chọn để gửi tự động
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Kênh <strong>{previewChannelTab}</strong> chưa được tick chọn trong danh sách gửi
                </span>
              )}

              {/* Toggle Sửa Quick Button */}
              {!isEditingPreviewTemplate ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPreviewTemplate(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                  Sửa mẫu {previewChannelTab}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingPreviewTemplate(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Xem kết quả mẫu {previewChannelTab}
                </button>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#F4F6F9]">
            {(() => {
              const sampleCode = `${formReferrerCodePrefix || 'QT-'}${
                formReferrerCodeSuffixType === 'Số điện thoại'
                  ? '0901234567'
                  : formReferrerCodeSuffixType === 'Email'
                  ? 'an.nguyen'
                  : '001'
              }`;
              const sampleReward =
                referrerDiscountMethod === 'order'
                  ? referrerOrderDiscountType === 'percentage'
                    ? `Giảm ${referrerOrderPercent || 10}% giá trị đơn hàng (tối đa ${
                        referrerOrderMaxDiscountAmount
                          ? `${parseInt(referrerOrderMaxDiscountAmount, 10).toLocaleString('vi-VN')} đ`
                          : 'không giới hạn'
                      })`
                    : `Giảm ${parseInt(
                        referrerOrderFixedAmount || '200000',
                        10
                      ).toLocaleString('vi-VN')} đ (Đơn từ ${parseInt(
                        referrerOrderMinOrderValue || '1000000',
                        10
                      ).toLocaleString('vi-VN')} đ)`
                  : 'Ưu đãi theo danh mục phụ tùng & vật tư bảo dưỡng';
              const sampleDays = formReferrerValidityDays || '30';

              const replacePlaceholders = (text: string) => {
                if (!text) return '';
                return text
                  .replace(/\{TEN_NGUOI_GIOI_THIEU\}/g, 'Nguyễn Văn An')
                  .replace(/\{TEN_NGUOI_DUOC_GT\}/g, 'Trần Đình Trọng')
                  .replace(/\{MA_DON_HANG\}/g, 'RO-2026-0042')
                  .replace(/\{MA_QUA_TANG\}/g, sampleCode)
                  .replace(/\{GIA_TRI_UU_DAI\}/g, sampleReward)
                  .replace(/\{HAN_DUNG_NGAY\}/g, `${sampleDays} ngày`)
                  .replace(/\{HOTLINE\}/g, '1900 8899');
              };

              const dynamicVariables = [
                { tag: '{TEN_NGUOI_GIOI_THIEU}', label: 'Tên người giới thiệu', sample: 'Nguyễn Văn An' },
                { tag: '{TEN_NGUOI_DUOC_GT}', label: 'Tên khách mới', sample: 'Trần Đình Trọng' },
                { tag: '{MA_DON_HANG}', label: 'Mã đơn hàng', sample: 'RO-2026-0042' },
                { tag: '{MA_QUA_TANG}', label: 'Mã quà tặng sinh tự động', sample: sampleCode },
                { tag: '{GIA_TRI_UU_DAI}', label: 'Giá trị ưu đãi', sample: sampleReward },
                { tag: '{HAN_DUNG_NGAY}', label: 'Hạn dùng (ngày)', sample: `${sampleDays} ngày` },
                { tag: '{HOTLINE}', label: 'Hotline Garage', sample: '1900 8899' },
              ];

              // Render device simulator
              const renderSimulator = () => (
                <div className="w-full max-w-xl mx-auto">
                  {/* 1. SMS SIMULATION */}
                  {previewChannelTab === 'SMS' && (
                    <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden">
                      {/* Phone Speaker & Camera Notch */}
                      <div className="bg-gray-900 px-6 py-2.5 flex items-center justify-between text-white text-[11px]">
                        <span className="font-semibold">14:30</span>
                        <div className="w-20 h-3.5 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gray-800" />
                        </div>
                        <span className="font-semibold">5G • 100%</span>
                      </div>

                      {/* SMS Header */}
                      <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              GARAGE DUMUC
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                            <div className="text-[10px] text-gray-400">SMS Brandname viễn thông</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Tin nhắn đã duyệt
                        </span>
                      </div>

                      {/* SMS Message Bubble */}
                      <div className="p-6 bg-slate-100/70 min-h-[300px] flex flex-col justify-start space-y-3">
                        <div className="text-center">
                          <span className="text-[10px] bg-gray-200/80 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                            Hôm nay 14:30
                          </span>
                        </div>

                        <div className="max-w-[92%] bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm border border-gray-200 text-xs text-gray-800 leading-relaxed space-y-2.5">
                          <p className="whitespace-pre-wrap">{replacePlaceholders(smsTemplateText)}</p>
                          <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 text-center font-mono font-bold text-blue-700 text-sm tracking-wider">
                            {sampleCode}
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-400 px-2 flex items-center justify-between">
                          <span>Độ dài: ~{smsTemplateText.length} ký tự (1 SMS tiêu chuẩn)</span>
                          <span>Đầu số gửi: GARAGE DUMUC</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. ZALO OA SIMULATION */}
                  {previewChannelTab === 'Zalo OA' && (
                    <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden">
                      {/* Phone Bar */}
                      <div className="bg-[#0068FF] px-6 py-2.5 flex items-center justify-between text-white text-[11px]">
                        <span className="font-semibold">14:30</span>
                        <div className="w-20 h-3.5 bg-blue-900/40 rounded-full" />
                        <span className="font-semibold">5G • 100%</span>
                      </div>

                      {/* Zalo Header */}
                      <div className="px-5 py-3.5 bg-[#0068FF] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-white text-[#0068FF] font-black text-xs flex items-center justify-center shadow-xs">
                            DM
                          </div>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1">
                              Garage Du Mục Official
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                            </div>
                            <div className="text-[10px] text-blue-100">Zalo Notification Service (ZNS)</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded text-white font-medium">
                          ZNS Verified
                        </span>
                      </div>

                      {/* Zalo Body Card */}
                      <div className="p-6 bg-slate-100/70 min-h-[300px]">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                          <div className="text-center pb-3 border-b border-gray-100">
                            <span className="inline-block p-2.5 bg-emerald-100 text-emerald-700 rounded-full mb-1.5 shadow-2xs">
                              <Gift className="w-5 h-5" />
                            </span>
                            <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                              {replacePlaceholders(zaloTemplate.title)}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {replacePlaceholders(zaloTemplate.subtitle)}
                            </p>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-gray-100">
                              <span className="text-gray-500">Khách hàng nhận:</span>
                              <span className="font-semibold text-gray-800">Nguyễn Văn An</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-100">
                              <span className="text-gray-500">Mã quà tặng:</span>
                              <span className="font-mono font-bold text-[#0068FF] text-sm">{sampleCode}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-100">
                              <span className="text-gray-500">Ưu đãi áp dụng:</span>
                              <span className="font-semibold text-emerald-700 text-right max-w-[260px]">
                                {sampleReward}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-100">
                              <span className="text-gray-500">Thời hạn sử dụng:</span>
                              <span className="font-semibold text-gray-800">{sampleDays} ngày kể từ hôm nay</span>
                            </div>
                          </div>

                          {zaloTemplate.note && (
                            <p className="text-[10px] text-gray-400 italic text-center">
                              {replacePlaceholders(zaloTemplate.note)}
                            </p>
                          )}

                          <div className="space-y-2 pt-1">
                            <button
                              type="button"
                              className="w-full py-2.5 bg-[#0068FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                            >
                              {replacePlaceholders(zaloTemplate.ctaText)}
                            </button>
                            <button
                              type="button"
                              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl transition-colors"
                            >
                              {replacePlaceholders(zaloTemplate.secondaryCtaText)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. EMAIL SIMULATION */}
                  {previewChannelTab === 'Email' && (
                    <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-xl overflow-hidden">
                      {/* Email Header */}
                      <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-600 space-y-1.5">
                        <div>
                          <span className="text-gray-400">Từ:</span>{' '}
                          <span className="font-semibold text-gray-800">
                            Garage Du Mục &lt;cskh@dumuc.com.vn&gt;
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Đến:</span>{' '}
                          <span className="text-gray-800">Nguyễn Văn An &lt;an.nguyen@example.com&gt;</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tiêu đề:</span>{' '}
                          <span className="font-bold text-gray-900">
                            {replacePlaceholders(emailTemplate.subject)}
                          </span>
                        </div>
                      </div>

                      {/* Email Body */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <div className="font-black text-sm text-[#1A73E8] tracking-wider">
                            GARAGE DU MỤC
                          </div>
                          <span className="text-[11px] text-gray-500">
                            Mã CT: {formCode || 'GT-2026-101'}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
                          <p className="font-bold text-gray-900">
                            {replacePlaceholders(emailTemplate.greeting)}
                          </p>
                          <p className="whitespace-pre-wrap">
                            {replacePlaceholders(emailTemplate.intro)}
                          </p>
                          <p className="whitespace-pre-wrap">
                            {replacePlaceholders(emailTemplate.orderNote)}
                          </p>
                        </div>

                        {/* Coupon Box */}
                        <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 text-center space-y-2.5">
                          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                            {replacePlaceholders(emailTemplate.boxTitle)}
                          </span>
                          <div className="inline-block px-6 py-2.5 bg-white rounded-xl border border-emerald-300 font-mono font-black text-lg text-emerald-700 tracking-widest shadow-xs">
                            {sampleCode}
                          </div>
                          <div className="text-xs font-semibold text-gray-800">
                            {sampleReward}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Thời hạn sử dụng: {sampleDays} ngày kể từ ngày nhận email
                          </div>
                        </div>

                        <div className="pt-3 text-[11px] text-gray-500 border-t border-gray-100 flex items-center justify-between">
                          <span>{replacePlaceholders(emailTemplate.footerNote)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );

              return (
                <div className="space-y-6">
                  {/* Dynamic Variable Chips Toolbar */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                          Biến động tự động điền (Bấm vào thẻ để sao chép tag):
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-500 italic">
                        Hệ thống sẽ tự động thay thế bằng dữ liệu thực tế khi gửi
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dynamicVariables.map((v) => (
                        <button
                          key={v.tag}
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(v.tag);
                            if (isEditingPreviewTemplate) {
                              if (previewChannelTab === 'SMS') {
                                setSmsTemplateText((prev) => `${prev} ${v.tag}`);
                              }
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-medium text-gray-700 hover:text-blue-700 transition-colors cursor-pointer group"
                          title={`Bấm để chép: ${v.tag} (Ví dụ: ${v.sample})`}
                        >
                          <code className="font-mono text-[11px] font-bold text-blue-600 bg-white px-1.5 py-0.5 rounded border border-gray-200 group-hover:border-blue-300">
                            {v.tag}
                          </code>
                          <span className="text-[11px] text-gray-500 group-hover:text-blue-700">
                            : {v.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Display: Toggle between Editing Mode and Viewing Mode */}
                  {isEditingPreviewTemplate ? (
                    /* 2-Column Split: Left = Edit Form, Right = Live Simulator */
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                      {/* Left: Edit Form */}
                      <div className="xl:col-span-6 bg-white rounded-2xl border border-amber-300 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <SquarePen className="w-4 h-4 text-amber-600" />
                            <h3 className="text-sm font-bold text-gray-900">
                              Chỉnh sửa Mẫu tin nhắn {previewChannelTab}
                            </h3>
                          </div>

                          {/* Reset button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (previewChannelTab === 'SMS') {
                                setSmsTemplateText(
                                  'Cam on Quy khach {TEN_NGUOI_GIOI_THIEU} da gioi thieu khach hang {TEN_NGUOI_DUOC_GT} den Garage Du Muc! Don hang {MA_DON_HANG} da hoan tat thanh toan. Garage xin tang Quy khach Ma qua tang tri an: {MA_QUA_TANG} ({GIA_TRI_UU_DAI}). Thoi han su dung: {HAN_DUNG_NGAY} ngay. Hotline: 1900 8899. Tran trong!'
                                );
                              } else if (previewChannelTab === 'Zalo OA') {
                                setZaloTemplate({
                                  title: 'TẶNG MÃ QUÀ TẶNG TRI ÂN NGƯỜI GIỚI THIỆU',
                                  subtitle: 'Người bạn được giới thiệu ({TEN_NGUOI_DUOC_GT}) đã hoàn tất đơn hàng {MA_DON_HANG}',
                                  ctaText: 'Đặt hẹn & Áp dụng mã ngay',
                                  secondaryCtaText: 'Lưu mã vào Ví Zalo',
                                  note: 'Áp dụng cho mọi dịch vụ bảo dưỡng và sửa chữa tại hệ thống Garage Du Mục',
                                });
                              } else {
                                setEmailTemplate({
                                  subject: '🎁 [Garage Du Mục] Cảm ơn Quý khách {TEN_NGUOI_GIOI_THIEU} - Tặng Mã quà tặng tri ân giới thiệu bạn bè',
                                  greeting: 'Kính gửi Quý khách {TEN_NGUOI_GIOI_THIEU},',
                                  intro: 'Garage Du Mục xin gửi lời cảm ơn chân thành tới Quý khách vì đã tin tưởng giới thiệu người bạn {TEN_NGUOI_DUOC_GT} sử dụng dịch vụ tại garage của chúng tôi.',
                                  orderNote: 'Đơn hàng sửa chữa/bảo dưỡng {MA_DON_HANG} của bạn Quý khách đã hoàn tất thanh toán thành công. Chúng tôi xin trân trọng gửi tặng Quý khách phần quà tri ân đặc biệt:',
                                  boxTitle: 'MÃ QUÀ TẶNG TRI ÂN KHÁCH HÀNG',
                                  footerNote: 'Hotline hỗ trợ: 1900 8899 • Hệ thống Garage Du Mục toàn quốc',
                                });
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            title="Khôi phục nội dung mẫu ban đầu"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Khôi phục gốc
                          </button>
                        </div>

                        {/* SMS Form Fields */}
                        {previewChannelTab === 'SMS' && (
                          <div className="space-y-4 text-xs">
                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Tên định danh Brandname SMS:
                              </label>
                              <input
                                type="text"
                                readOnly
                                value="GARAGE DUMUC"
                                className="w-full px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold text-gray-800 outline-none cursor-not-allowed select-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-gray-700">
                                  Nội dung tin nhắn SMS: <span className="text-red-500">*</span>
                                </label>
                                <span className="text-[11px] font-mono text-gray-500">
                                  {smsTemplateText.length} ký tự
                                </span>
                              </div>
                              <textarea
                                rows={6}
                                value={smsTemplateText}
                                onChange={(e) => setSmsTemplateText(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-amber-300 focus:border-amber-500 rounded-xl outline-none font-sans text-xs leading-relaxed"
                                placeholder="Nhập nội dung tin nhắn SMS gửi cho người giới thiệu..."
                              />
                              <p className="text-[11px] text-gray-500 mt-1">
                                Gợi ý: Với SMS viễn thông Brandname, nên dùng tiếng Việt không dấu để tối ưu 160 ký tự/tin.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Zalo OA Form Fields */}
                        {previewChannelTab === 'Zalo OA' && (
                          <div className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Tiêu đề thông báo ZNS:
                              </label>
                              <input
                                type="text"
                                value={zaloTemplate.title}
                                onChange={(e) => setZaloTemplate({ ...zaloTemplate, title: e.target.value })}
                                className="w-full px-3.5 py-2 border border-amber-300 focus:border-amber-500 rounded-lg font-bold outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Dòng phụ / Lý do tặng:
                              </label>
                              <input
                                type="text"
                                value={zaloTemplate.subtitle}
                                onChange={(e) => setZaloTemplate({ ...zaloTemplate, subtitle: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                  Nút chính:
                                </label>
                                <input
                                  type="text"
                                  value={zaloTemplate.ctaText}
                                  onChange={(e) => setZaloTemplate({ ...zaloTemplate, ctaText: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                  Nút phụ:
                                </label>
                                <input
                                  type="text"
                                  value={zaloTemplate.secondaryCtaText}
                                  onChange={(e) => setZaloTemplate({ ...zaloTemplate, secondaryCtaText: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Ghi chú chân thông báo:
                              </label>
                              <input
                                type="text"
                                value={zaloTemplate.note}
                                onChange={(e) => setZaloTemplate({ ...zaloTemplate, note: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Email Form Fields */}
                        {previewChannelTab === 'Email' && (
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Tiêu đề thư (Subject):
                              </label>
                              <input
                                type="text"
                                value={emailTemplate.subject}
                                onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                                className="w-full px-3.5 py-2 border border-amber-300 focus:border-amber-500 rounded-lg font-bold outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Lời chào:
                              </label>
                              <input
                                type="text"
                                value={emailTemplate.greeting}
                                onChange={(e) => setEmailTemplate({ ...emailTemplate, greeting: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Lời cảm ơn giới thiệu:
                              </label>
                              <textarea
                                rows={2}
                                value={emailTemplate.intro}
                                onChange={(e) => setEmailTemplate({ ...emailTemplate, intro: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                Thông báo hoàn tất đơn hàng:
                              </label>
                              <textarea
                                rows={2}
                                value={emailTemplate.orderNote}
                                onChange={(e) => setEmailTemplate({ ...emailTemplate, orderNote: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                  Tiêu đề khung Voucher:
                                </label>
                                <input
                                  type="text"
                                  value={emailTemplate.boxTitle}
                                  onChange={(e) => setEmailTemplate({ ...emailTemplate, boxTitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                  Chân thư:
                                </label>
                                <input
                                  type="text"
                                  value={emailTemplate.footerNote}
                                  onChange={(e) => setEmailTemplate({ ...emailTemplate, footerNote: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-lg outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setIsEditingPreviewTemplate(false)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Hoàn tất sửa & Xem kết quả</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Live Preview reflecting edits */}
                      <div className="xl:col-span-6 space-y-3">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span>Mô phỏng hiển thị thời gian thực ({previewChannelTab})</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Tự động cập nhật theo nội dung bên trái</span>
                        </div>
                        {renderSimulator()}
                      </div>
                    </div>
                  ) : (
                    /* Viewing Mode: Full Simulator with Edit Invitation Card */
                    <div className="space-y-5">
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                          <Info className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-xs text-amber-900">
                            Đang xem trước nội dung gửi thực tế qua kênh <strong>{previewChannelTab}</strong>. Nhấn nút <strong>Sửa</strong> để thay đổi lời văn hoặc tiêu đề mẫu.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingPreviewTemplate(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <SquarePen className="w-3.5 h-3.5" />
                          <span>Sửa nội dung {previewChannelTab}</span>
                        </button>
                      </div>

                      {renderSimulator()}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Sticky Footer */}
          <div className="h-16 px-6 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-20">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Nội dung gửi sẽ tự động gắn mã quà tặng và thông tin khách hàng khi đơn người mới hoàn tất thanh toán.</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Nút Sửa ở Footer */}
              <button
                type="button"
                onClick={() => setIsEditingPreviewTemplate(!isEditingPreviewTemplate)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isEditingPreviewTemplate
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <SquarePen className="w-4 h-4" />
                <span>{isEditingPreviewTemplate ? 'Hoàn tất sửa & Xem trước' : 'Sửa'}</span>
              </button>

              {/* Nút Đóng */}
              <button
                type="button"
                onClick={() => setIsPreviewMessageModalOpen(false)}
                className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
