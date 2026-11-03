import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Eye,
  EyeOff,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Car,
  Plus,
  FileText,
  Phone,
  MessageSquare,
  Star,
  Package,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Clock,
  CreditCard,
  UserCheck,
  Building2,
  Sparkles,
  History,
  Receipt,
  Calendar,
  ChevronRight,
  Check,
} from 'lucide-react';
import { ExistingCustomerRecord } from './PotentialCustomersModule';

interface CustomerCDPModalProps {
  customer: ExistingCustomerRecord;
  onClose: () => void;
}

type RbacMode = 'owner' | 'advisor_tech';
type WorkshopStage =
  | 'Đang khám xe'
  | 'Chờ phụ tùng'
  | 'Đang sửa chữa'
  | 'Chờ nghiệm thu & Giao xe';

interface SupplierComparisonItem {
  supplierName: string;
  importPrice: number;
  slaOnTimeRate: number;
  defectRate: number;
  lastImportDate: string;
}

interface ReplacedPartItem {
  partCode: string;
  partName: string;
  quantity: number;
  sellingPrice: number;
  importCost: number;
  isWarrantyDefect?: boolean;
  defectNote?: string;
  supplier360: {
    supplierCode: string;
    supplierName: string;
    poNumber: string;
    batchCode: string;
    importDate: string;
    warrantyRemaining: string;
    slaOnTimePercent: number;
    slaDefectPercent: number;
    averageMarketImportCost: number;
    comparisonSuppliers: SupplierComparisonItem[];
  };
}

interface RepairOrderRecord {
  roCode: string;
  date: string;
  plate: string;
  odo: number;
  symptoms: string;
  advisorName: string;
  technicianName: string;
  totalRevenue: number;
  totalCost: number;
  isInheritedFromPreviousOwner?: boolean;
  previousOwnerNote?: string;
  inspectionPhotos: {
    id: string;
    label: string;
    zone: string;
    timestamp: string;
    status: 'Đạt chuẩn' | 'Cần theo dõi' | 'Đã khắc phục';
  }[];
  replacedParts: ReplacedPartItem[];
}

interface VehicleCardItem {
  id: string;
  plate: string;
  vin: string;
  modelYear: string;
  currentOdo: number;
  inspectionExpiry: string;
  hullInsuranceExpiry: string;
  isInsuranceExpiringSoon: boolean;
  isTransferredOwnership: boolean;
  previousOwnerSummary?: string;
  nextMaintenanceDate: string;
  nextMaintenanceOdo: number;
}

interface UpsellQuoteItem {
  id: string;
  plate: string;
  discoveredDate: string;
  discoveredRo: string;
  itemName: string;
  conditionNote: string;
  quotedAmount: number;
  recommendedTiming: string;
  technicianReporter: string;
  addedToNewRo?: boolean;
}

interface LedgerInvoiceItem {
  invoiceCode: string;
  roCode: string;
  date: string;
  plate: string;
  totalAmount: number;
  customerPaid: number;
  insuranceCoPay: number;
  accumulatedDebt: number;
  isOverdue?: boolean;
  status: 'Đã tất toán' | 'Còn công nợ' | 'Quá hạn thanh toán';
}

interface CrmLogItem {
  id: string;
  plate: string;
  roCode: string;
  type: 'Call 3 ngày' | 'Call 7 ngày' | 'Zalo ZNS tự động' | 'Đánh giá dịch vụ';
  timestamp: string;
  staff: string;
  rating?: number;
  summary: string;
  customerFeedback: string;
}

const WORKSHOP_STAGES: WorkshopStage[] = [
  'Đang khám xe',
  'Chờ phụ tùng',
  'Đang sửa chữa',
  'Chờ nghiệm thu & Giao xe',
];

const formatVND = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN')}đ`;
};

const maskPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return '0909***888';
  return `${digits.slice(0, 4)}***${digits.slice(-3)}`;
};

const normalizePlate = (plate: string): string => {
  return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
};

export const CustomerCDPModal: React.FC<CustomerCDPModalProps> = ({
  customer,
  onClose,
}) => {
  // RBAC Toggle: 'owner' (100% Full) vs 'advisor_tech' (RBAC Masking)
  const [rbacMode, setRbacMode] = useState<RbacMode>('owner');

  // Real-time Workshop Single Source of Truth State
  const [workshopStage, setWorkshopStage] =
    useState<WorkshopStage>('Chờ phụ tùng');
  const [partsWaitOverdueResolved, setPartsWaitOverdueResolved] =
    useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState<
    string | null
  >(null);

  // Financial State (updated in real-time when "Kế toán vừa thu tiền" is clicked)
  const [currentReceivableDebt, setCurrentReceivableDebt] =
    useState<number>(18500000);
  const [overdueDebt, setOverdueDebt] = useState<number>(6200000);
  const [lifetimeRevenue, setLifetimeRevenue] = useState<number>(186400000);
  const [grossMarginPercent] = useState<number>(38.4);
  const [prepaidCardBalance] = useState<number>(12500000);
  const [remainingMaintenancePackages] = useState<string>(
    'Còn 3/4 kỳ Bảo dưỡng Toàn diện (Gói Gold 40.000km)'
  );

  // Selected Vehicle Filter (null = All vehicles)
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState<
    string | null
  >(null);

  // Tier 3 Active Tab
  const [activeTier3Tab, setActiveTier3Tab] = useState<
    'ro_timeline' | 'financial_ledger' | 'crm_zalo'
  >('ro_timeline');

  // Supplier 360 Drawer / Modal State
  const [selectedPartForSupplier360, setSelectedPartForSupplier360] = useState<{
    part: ReplacedPartItem;
    roCode: string;
    plate: string;
  } | null>(null);
  const [claimedPartCodes, setClaimedPartCodes] = useState<string[]>([]);

  // Initial Vehicles belonging to Customer
  const vehicles = useMemo<VehicleCardItem[]>(() => {
    const seed = customer.customerCode.slice(-2);
    return [
      {
        id: 'veh-1',
        plate: '51G12345',
        vin: `WDD2050401R${seed}8921`,
        modelYear: 'Mercedes-Benz C200 Exclusive • 2021',
        currentOdo: 48200,
        inspectionExpiry: '15/11/2027',
        hullInsuranceExpiry: '18/11/2026',
        isInsuranceExpiringSoon: true,
        isTransferredOwnership: false,
        nextMaintenanceDate: '12/12/2026',
        nextMaintenanceOdo: 50000,
      },
      {
        id: 'veh-2',
        plate: '51K88921',
        vin: `JM7KF2W7A00${seed}4410`,
        modelYear: 'Mazda CX-5 2.5L Signature • 2020',
        currentOdo: 73600,
        inspectionExpiry: '20/05/2027',
        hullInsuranceExpiry: '10/08/2027',
        isInsuranceExpiringSoon: false,
        isTransferredOwnership: true,
        previousOwnerSummary:
          'Mua lại từ chủ cũ (Trần Minh Quân) ngày 10/01/2025 ở mức ODO 52.000km. Kế thừa 4 hồ sơ kỹ thuật theo số VIN, đã khóa toàn bộ hóa đơn & công nợ chủ cũ.',
        nextMaintenanceDate: '05/01/2027',
        nextMaintenanceOdo: 75000,
      },
      {
        id: 'veh-3',
        plate: '30H66543',
        vin: `MPBUMFF50MX${seed}7732`,
        modelYear: 'Ford Ranger Wildtrak 2.0L Bi-Turbo • 2022',
        currentOdo: 61400,
        inspectionExpiry: '02/09/2027',
        hullInsuranceExpiry: '22/11/2026',
        isInsuranceExpiringSoon: true,
        isTransferredOwnership: false,
        nextMaintenanceDate: '28/12/2026',
        nextMaintenanceOdo: 65000,
      },
    ];
  }, [customer.customerCode]);

  // Upsell Deferred Items State
  const [upsellItems, setUpsellItems] = useState<UpsellQuoteItem[]>([
    {
      id: 'up-1',
      plate: '51G12345',
      discoveredDate: '14/09/2026',
      discoveredRo: 'RO-2026-0892',
      itemName: 'Má phanh sau mòn 80% + Đĩa phanh sau có gờ',
      conditionNote:
        'Báo giá 2.400.000đ - Hẹn 2.000km nữa thay (Khách tạm hoãn do bận công tác)',
      quotedAmount: 2400000,
      recommendedTiming: 'Hẹn ở ODO 50.000km (còn ~1.800km)',
      technicianReporter: 'KTV trưởng: Lê Văn Tùng',
    },
    {
      id: 'up-2',
      plate: '51G12345',
      discoveredDate: '14/09/2026',
      discoveredRo: 'RO-2026-0892',
      itemName: 'Cao su chân máy thủy lực bên phụ bắt đầu xẹp',
      conditionNote:
        'Báo giá 4.850.000đ - Hẹn kỳ bảo dưỡng 50.000km kiểm tra thay thế',
      quotedAmount: 4850000,
      recommendedTiming: 'Hẹn kỳ bảo dưỡng 12/12/2026',
      technicianReporter: 'KTV trưởng: Lê Văn Tùng',
    },
    {
      id: 'up-3',
      plate: '51K88921',
      discoveredDate: '02/10/2026',
      discoveredRo: 'RO-2026-0941',
      itemName: 'Vệ sinh họng ga, kim phun & thay lọc gió điều hòa than hoạt tính',
      conditionNote:
        'Báo giá 1.650.000đ - Khách hẹn lần thay dầu 75.000km làm luôn',
      quotedAmount: 1650000,
      recommendedTiming: 'Hẹn ở ODO 75.000km (còn ~1.400km)',
      technicianReporter: 'KTV: Nguyễn Hữu Phước',
    },
    {
      id: 'up-4',
      plate: '30H66543',
      discoveredDate: '25/08/2026',
      discoveredRo: 'RO-2026-0775',
      itemName: 'Cặp lốp trước Bridgestone mòn tới vạch TWI + Cân bằng động',
      conditionNote:
        'Báo giá 6.900.000đ - Tài xế báo chờ trình duyệt chi phí đội xe',
      quotedAmount: 6900000,
      recommendedTiming: 'Khuyến nghị thay sớm trước mùa mưa',
      technicianReporter: 'KTV: Trần Quốc Bảo',
    },
  ]);

  // Repair Orders (RO) Timeline State
  const [repairOrders, setRepairOrders] = useState<RepairOrderRecord[]>([
    {
      roCode: 'RO-2026-0988',
      date: '28/10/2026',
      plate: '51G12345',
      odo: 48200,
      symptoms:
        'Đèn Check Engine sáng, tiếng kêu lộc cộc gầm trước khi qua gờ giảm tốc, điều hòa mát chậm buổi trưa',
      advisorName: 'CVDV: Đặng Minh Khôi',
      technicianName: 'KTV: Lê Văn Tùng (Bậc 4/4)',
      totalRevenue: 19450000,
      totalCost: 11600000,
      inspectionPhotos: [
        {
          id: 'img-1',
          label: 'Càng A trước dưới bên lái nứt cao su trụ',
          zone: 'Gầm trước trái',
          timestamp: '28/10/2026 08:45',
          status: 'Đã khắc phục',
        },
        {
          id: 'img-2',
          label: 'Van hằng nhiệt kẹt mở làm máy lâu nóng (Mã lỗi P0128)',
          zone: 'Khoang động cơ M264',
          timestamp: '28/10/2026 09:10',
          status: 'Cần theo dõi',
        },
        {
          id: 'img-3',
          label: 'Phụ tùng cũ đóng gói đặt vào cốp sau theo đúng yêu cầu KH',
          zone: 'Cốp xe nghiệm thu',
          timestamp: '28/10/2026 15:20',
          status: 'Đạt chuẩn',
        },
      ],
      replacedParts: [
        {
          partCode: 'PT-MB-2052000615',
          partName: 'Cụm van hằng nhiệt điện tử Mercedes M264 (Chính hãng)',
          quantity: 1,
          sellingPrice: 6850000,
          importCost: 4450000,
          isWarrantyDefect: true,
          defectNote:
            'Phát hiện rò rỉ nước làm mát nhẹ tại gioăng cảm biến sau 14 ngày lắp đặt (Đang mở ticket bảo hành)',
          supplier360: {
            supplierCode: 'NCC-GERMAN-01',
            supplierName: 'Công ty TNHH Phụ tùng Đức Á Châu (EuroParts VN)',
            poNumber: 'PO-2026-1042',
            batchCode: 'LOT-DE-2026Q3-88',
            importDate: '05/10/2026',
            warrantyRemaining: 'Còn 11 tháng 16 ngày (Bảo hành 12 tháng / 20.000km)',
            slaOnTimePercent: 96.4,
            slaDefectPercent: 1.8,
            averageMarketImportCost: 4180000,
            comparisonSuppliers: [
              {
                supplierName: 'Công ty TNHH Phụ tùng Đức Á Châu (Đơn hiện tại)',
                importPrice: 4450000,
                slaOnTimeRate: 96.4,
                defectRate: 1.8,
                lastImportDate: '05/10/2026',
              },
              {
                supplierName: 'AutoParts Hoàng Gia Sài Gòn',
                importPrice: 4100000,
                slaOnTimeRate: 88.0,
                defectRate: 3.4,
                lastImportDate: '12/08/2026',
              },
              {
                supplierName: 'Liên Việt Mercedes OEM Distribution',
                importPrice: 4260000,
                slaOnTimeRate: 94.2,
                defectRate: 1.2,
                lastImportDate: '19/09/2026',
              },
            ],
          },
        },
        {
          partCode: 'PT-LMF-3881201',
          partName: 'Càng A cong dưới trước trái Lemförder (Đức)',
          quantity: 1,
          sellingPrice: 5400000,
          importCost: 3250000,
          isWarrantyDefect: false,
          supplier360: {
            supplierCode: 'NCC-ZF-VN02',
            supplierName: 'Nhà phân phối ZF / Lemförder Chính thức Miền Nam',
            poNumber: 'PO-2026-0998',
            batchCode: 'LOT-ZF-2609-14',
            importDate: '28/09/2026',
            warrantyRemaining: 'Còn 11 tháng (Bảo hành 12 tháng)',
            slaOnTimePercent: 98.5,
            slaDefectPercent: 0.4,
            averageMarketImportCost: 3480000,
            comparisonSuppliers: [
              {
                supplierName: 'ZF / Lemförder Chính thức Miền Nam (Đơn hiện tại)',
                importPrice: 3250000,
                slaOnTimeRate: 98.5,
                defectRate: 0.4,
                lastImportDate: '28/09/2026',
              },
              {
                supplierName: 'Phụ tùng Gầm Máy Tân Phú',
                importPrice: 3520000,
                slaOnTimeRate: 91.0,
                defectRate: 1.9,
                lastImportDate: '04/08/2026',
              },
              {
                supplierName: 'Đức Á Châu (EuroParts VN)',
                importPrice: 3440000,
                slaOnTimeRate: 96.4,
                defectRate: 1.1,
                lastImportDate: '15/07/2026',
              },
            ],
          },
        },
        {
          partCode: 'PT-MOBIL1-0W40',
          partName: 'Dầu động cơ tổng hợp Mobil 1 0W-40 (6.5 Lít) + Lọc dầu',
          quantity: 1,
          sellingPrice: 3200000,
          importCost: 1920000,
          isWarrantyDefect: false,
          supplier360: {
            supplierCode: 'NCC-LUBE-05',
            supplierName: 'Công ty CP Dầu nhờn & Hóa chất Nam Việt',
            poNumber: 'PO-2026-0911',
            batchCode: 'LOT-M1-US-551',
            importDate: '10/09/2026',
            warrantyRemaining: 'Theo kỳ bảo dưỡng 10.000km',
            slaOnTimePercent: 99.1,
            slaDefectPercent: 0.1,
            averageMarketImportCost: 2050000,
            comparisonSuppliers: [
              {
                supplierName: 'Dầu nhờn Nam Việt (Đơn hiện tại)',
                importPrice: 1920000,
                slaOnTimeRate: 99.1,
                defectRate: 0.1,
                lastImportDate: '10/09/2026',
              },
              {
                supplierName: 'Phân phối Nhớt Quốc Tế Á Đông',
                importPrice: 2080000,
                slaOnTimeRate: 95.0,
                defectRate: 0.2,
                lastImportDate: '01/08/2026',
              },
            ],
          },
        },
      ],
    },
    {
      roCode: 'RO-2026-0941',
      date: '02/10/2026',
      plate: '51K88921',
      odo: 73600,
      symptoms:
        'Bảo dưỡng định kỳ 70.000km, thay dầu hộp số tự động tuần hoàn và xử lý tiếng rít dây curoa tổng buổi sáng',
      advisorName: 'CVDV: Nguyễn Thanh Tâm',
      technicianName: 'KTV: Nguyễn Hữu Phước',
      totalRevenue: 8900000,
      totalCost: 5100000,
      inspectionPhotos: [
        {
          id: 'img-4',
          label: 'Dây curoa tổng rạn nứt bề mặt rãnh cao su',
          zone: 'Khoang máy Mazda SkyActiv',
          timestamp: '02/10/2026 10:15',
          status: 'Đã khắc phục',
        },
        {
          id: 'img-5',
          label: 'Mẫu dầu số ATF FZ cũ đen sẫm trước khi thay tuần hoàn',
          zone: 'Hộp số tự động 6AT',
          timestamp: '02/10/2026 11:05',
          status: 'Đạt chuẩn',
        },
      ],
      replacedParts: [
        {
          partCode: 'PT-MZ-PE0115909A',
          partName: 'Bộ dây curoa tổng & Bi tăng tổng Mazda CX-5 SkyActiv',
          quantity: 1,
          sellingPrice: 3650000,
          importCost: 2150000,
          isWarrantyDefect: false,
          supplier360: {
            supplierCode: 'NCC-JP-04',
            supplierName: 'Phụ tùng Nhật Bản Chính Hãng Koyo-Mitsuboshi VN',
            poNumber: 'PO-2026-0872',
            batchCode: 'LOT-JP-2608-09',
            importDate: '22/08/2026',
            warrantyRemaining: 'Còn 10 tháng 20 ngày (Bảo hành 12 tháng)',
            slaOnTimePercent: 97.2,
            slaDefectPercent: 0.6,
            averageMarketImportCost: 2290000,
            comparisonSuppliers: [
              {
                supplierName: 'Koyo-Mitsuboshi VN (Đơn hiện tại)',
                importPrice: 2150000,
                slaOnTimeRate: 97.2,
                defectRate: 0.6,
                lastImportDate: '22/08/2026',
              },
              {
                supplierName: 'Kho Phụ tùng Nhật Hàn Quận 5',
                importPrice: 2340000,
                slaOnTimeRate: 92.5,
                defectRate: 1.5,
                lastImportDate: '11/07/2026',
              },
            ],
          },
        },
      ],
    },
    {
      roCode: 'RO-2024-0412 (Chủ cũ)',
      date: '18/06/2024',
      plate: '51K88921',
      odo: 44500,
      symptoms:
        'Bảo dưỡng mốc 40.000km, thay cụm bơm xăng & lọc xăng trong bình, cân chỉnh góc đặt bánh xe Hunter 3D',
      advisorName: 'CVDV: Đặng Minh Khôi',
      technicianName: 'KTV: Lê Văn Tùng',
      totalRevenue: 7400000,
      totalCost: 4300000,
      isInheritedFromPreviousOwner: true,
      previousOwnerNote:
        'Hồ sơ kỹ thuật kế thừa theo số VIN (JM7KF2W7A00...4410) từ chủ xe trước. Toàn bộ giá tiền, chiết khấu và công nợ của chủ cũ đã được hệ thống khóa bảo mật.',
      inspectionPhotos: [
        {
          id: 'img-6',
          label: 'Lọc xăng trong bình bẩn nghẹt ở mốc 44.500km',
          zone: 'Hệ thống nhiên liệu',
          timestamp: '18/06/2024 14:10',
          status: 'Đã khắc phục',
        },
      ],
      replacedParts: [
        {
          partCode: 'PT-MZ-PE011335X',
          partName: 'Lọc nhiên liệu chính hãng Mazda CX-5 (Hồ sơ kỹ thuật VIN)',
          quantity: 1,
          sellingPrice: 2450000,
          importCost: 1480000,
          isWarrantyDefect: false,
          supplier360: {
            supplierCode: 'NCC-JP-04',
            supplierName: 'Phụ tùng Nhật Bản Chính Hãng Koyo-Mitsuboshi VN',
            poNumber: 'PO-2024-0318',
            batchCode: 'LOT-JP-2405-19',
            importDate: '01/06/2024',
            warrantyRemaining: 'Đã hết hạn bảo hành (Thay từ 06/2024)',
            slaOnTimePercent: 97.2,
            slaDefectPercent: 0.6,
            averageMarketImportCost: 1550000,
            comparisonSuppliers: [
              {
                supplierName: 'Koyo-Mitsuboshi VN',
                importPrice: 1480000,
                slaOnTimeRate: 97.2,
                defectRate: 0.6,
                lastImportDate: '01/06/2024',
              },
            ],
          },
        },
      ],
    },
  ]);

  // Financial Ledger State
  const [ledgerInvoices, setLedgerInvoices] = useState<LedgerInvoiceItem[]>([
    {
      invoiceCode: 'INV-2026-0988',
      roCode: 'RO-2026-0988',
      date: '28/10/2026',
      plate: '51G12345',
      totalAmount: 19450000,
      customerPaid: 7150000,
      insuranceCoPay: 0,
      accumulatedDebt: 12300000,
      isOverdue: false,
      status: 'Còn công nợ',
    },
    {
      invoiceCode: 'INV-2026-0941',
      roCode: 'RO-2026-0941',
      date: '02/10/2026',
      plate: '51K88921',
      totalAmount: 8900000,
      customerPaid: 8900000,
      insuranceCoPay: 0,
      accumulatedDebt: 0,
      isOverdue: false,
      status: 'Đã tất toán',
    },
    {
      invoiceCode: 'INV-2026-0775',
      roCode: 'RO-2026-0775',
      date: '25/08/2026',
      plate: '30H66543',
      totalAmount: 24200000,
      customerPaid: 6000000,
      insuranceCoPay: 12000000,
      accumulatedDebt: 6200000,
      isOverdue: true,
      status: 'Quá hạn thanh toán',
    },
  ]);

  // CRM & Zalo Logs
  const crmLogs = useMemo<CrmLogItem[]>(
    () => [
      {
        id: 'crm-1',
        plate: '51G12345',
        roCode: 'RO-2026-0988',
        type: 'Call 3 ngày',
        timestamp: '29/10/2026 09:30',
        staff: 'CSKH: Trần Ngọc Mai',
        rating: 4,
        summary: 'Gọi hỏi thăm sau sửa chữa gầm & thay van hằng nhiệt (3 ngày)',
        customerFeedback:
          'Gầm xe đã hết hoàn toàn tiếng kêu lộc cộc, rất êm. Tuy nhiên khách báo thấy có vài giọt nước làm mát dưới gầm vị trí van hằng nhiệt mới thay, yêu cầu xưởng kiểm tra bảo hành ngay.',
      },
      {
        id: 'crm-2',
        plate: '51K88921',
        roCode: 'RO-2026-0941',
        type: 'Call 7 ngày',
        timestamp: '09/10/2026 14:15',
        staff: 'CSKH: Trần Ngọc Mai',
        rating: 5,
        summary: 'Chăm sóc sau bảo dưỡng 70.000km & thay dầu số tuần hoàn (7 ngày)',
        customerFeedback:
          'Khách đánh giá 5 sao. Hộp số chuyển số mượt, hết tiếng rít dây curoa buổi sáng. Khách hài lòng vì thợ bỏ đầy đủ phụ tùng cũ vào thùng carton trong cốp xe.',
      },
      {
        id: 'crm-3',
        plate: '51G12345',
        roCode: 'RO-2026-0988',
        type: 'Zalo ZNS tự động',
        timestamp: '28/10/2026 16:05',
        staff: 'Hệ thống Zalo OA Автоматик',
        summary:
          'Gửi biên bản nghiệm thu điện tử, hóa đơn GTGT & lịch nhắc bảo dưỡng mốc 50.000km',
        customerFeedback: 'Đã nhận và xem tin nhắn Zalo ZNS (16:07).',
      },
    ],
    []
  );

  // Filtered items by selected vehicle
  const filteredUpsellItems = useMemo(() => {
    if (!selectedVehiclePlate) return upsellItems;
    return upsellItems.filter((item) => item.plate === selectedVehiclePlate);
  }, [upsellItems, selectedVehiclePlate]);

  const filteredRepairOrders = useMemo(() => {
    if (!selectedVehiclePlate) return repairOrders;
    return repairOrders.filter((ro) => ro.plate === selectedVehiclePlate);
  }, [repairOrders, selectedVehiclePlate]);

  const filteredLedgerInvoices = useMemo(() => {
    if (!selectedVehiclePlate) return ledgerInvoices;
    return ledgerInvoices.filter((inv) => inv.plate === selectedVehiclePlate);
  }, [ledgerInvoices, selectedVehiclePlate]);

  const filteredCrmLogs = useMemo(() => {
    if (!selectedVehiclePlate) return crmLogs;
    return crmLogs.filter((log) => log.plate === selectedVehiclePlate);
  }, [crmLogs, selectedVehiclePlate]);

  // Real-time Action 1: "Kho xác nhận hàng về"
  const handleWarehouseConfirmPartsArrived = () => {
    setWorkshopStage('Đang sửa chữa');
    setPartsWaitOverdueResolved(true);
    setRealtimeNotification(
      'Đồng bộ thời gian thực: Kho phụ tùng vừa xác nhận hàng về -> Trạng thái xe 51G12345 tự động chuyển từ "Chờ phụ tùng" sang "Đang sửa chữa".'
    );
  };

  // Real-time Action 2: "Kế toán vừa thu tiền"
  const handleAccountantConfirmPayment = () => {
    if (currentReceivableDebt === 0) {
      setRealtimeNotification(
        'Khách hàng đã tất toán toàn bộ công nợ phải thu hiện tại (0đ).'
      );
      return;
    }
    const collectedAmount = currentReceivableDebt;
    setCurrentReceivableDebt(0);
    setOverdueDebt(0);
    setLifetimeRevenue((prev) => prev + collectedAmount);
    setLedgerInvoices((prev) =>
      prev.map((inv) => ({
        ...inv,
        customerPaid: inv.totalAmount - inv.insuranceCoPay,
        accumulatedDebt: 0,
        isOverdue: false,
        status: 'Đã tất toán',
      }))
    );
    setRealtimeNotification(
      `Đồng bộ thời gian thực: Kế toán vừa xác nhận thu ${formatVND(collectedAmount)} -> Công nợ phải thu & Nợ quá hạn đã tự động tất toán về 0đ!`
    );
  };

  // Action: Add Upsell Item to New RO
  const handleAddUpsellToNewRo = (item: UpsellQuoteItem) => {
    if (item.addedToNewRo) return;
    setUpsellItems((prev) =>
      prev.map((u) => (u.id === item.id ? { ...u, addedToNewRo: true } : u))
    );

    const newRoCode = `RO-2026-${1000 + repairOrders.length + 1}`;
    const newRo: RepairOrderRecord = {
      roCode: newRoCode,
      date: '29/10/2026 (Mới khởi tạo từ Upsell)',
      plate: item.plate,
      odo:
        vehicles.find((v) => v.plate === item.plate)?.currentOdo || 48200,
      symptoms: `[Upsell từ ${item.discoveredRo}] ${item.itemName}`,
      advisorName: 'CVDV: Đặng Minh Khôi',
      technicianName: item.technicianReporter,
      totalRevenue: item.quotedAmount,
      totalCost: Math.round(item.quotedAmount * 0.6),
      inspectionPhotos: [
        {
          id: `img-upsell-${Date.now()}`,
          label: `Hạng mục chuyển từ báo giá chờ: ${item.itemName}`,
          zone: 'Khu vực tiếp nhận nhanh',
          timestamp: '29/10/2026',
          status: 'Cần theo dõi',
        },
      ],
      replacedParts: [],
    };
    setRepairOrders((prev) => [newRo, ...prev]);
    setRealtimeNotification(
      `Đã đưa hạng mục "${item.itemName}" (${formatVND(item.quotedAmount)}) vào Lệnh sửa chữa mới ${newRoCode}!`
    );
  };

  // Action: Create Supplier Warranty Claim
  const handleCreateSupplierClaim = (partCode: string, supplierName: string) => {
    if (!claimedPartCodes.includes(partCode)) {
      setClaimedPartCodes((prev) => [...prev, partCode]);
    }
    setRealtimeNotification(
      `Đã khởi tạo Yêu cầu bắt đền / Bảo hành mã phụ tùng ${partCode} gửi sang ${supplierName}!`
    );
  };

  const displayPhone =
    rbacMode === 'owner'
      ? customer.phone
      : maskPhoneNumber(customer.phone || '0909123888');

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-screen h-screen overflow-hidden font-sans text-slate-900">
      {/* ===================================================================== */}
      {/* STICKY HEADER: HỒ SƠ CDP KHÁCH HÀNG 360 ĐỘ + RBAC TOGGLE              */}
      {/* ===================================================================== */}
      <div className="px-6 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Hồ sơ CDP Khách hàng 360 độ
              </h1>
              <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                · {customer.customerCode}
              </span>
              <span className="text-xs text-blue-300 whitespace-nowrap hidden md:inline">
                · Kim tự tháp ngược (Progressive Disclosure)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Single Source of Truth · Tách bạch Pháp nhân / Người lái / Bảo hiểm · Truy vết Phụ tùng &amp; Nhà cung cấp 2 chiều
            </p>
          </div>
        </div>

        {/* RBAC Toggle Switch */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setRbacMode('owner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                rbacMode === 'owner'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Góc nhìn Chủ Garage (100% Full)
            </button>
            <button
              type="button"
              onClick={() => setRbacMode('advisor_tech')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                rbacMode === 'advisor_tech'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              Góc nhìn Cố vấn / Thợ (RBAC Masking)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Đóng Hồ sơ CDP"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {realtimeNotification && (
        <div className="px-6 py-2 bg-emerald-950 text-emerald-200 border-b border-emerald-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{realtimeNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setRealtimeNotification(null)}
            className="text-emerald-300 hover:text-white text-xs underline ml-4 cursor-pointer whitespace-nowrap"
          >
            Đóng thông báo
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN SCROLLABLE WORKSPACE (3 VISUAL TIERS)                            */}
      {/* ===================================================================== */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* =================================================================== */}
        {/* TẦNG 1: NHÌN ĐẦU TIÊN (0 - 3 GIÂY) — TỔNG QUAN, DÒNG TIỀN & CẢNH BÁO */}
        {/* =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                01. TẦNG 1 (0 – 3 GIÂY) — TỔNG QUAN ĐỊNH DANH, DÒNG TIỀN &amp; CẢNH BÁO NÓNG
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                Above the fold — Không cần cuộn chuột
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              Chế độ phân quyền:{' '}
              <span
                className={
                  rbacMode === 'owner'
                    ? 'font-bold text-emerald-700'
                    : 'font-bold text-amber-700'
                }
              >
                {rbacMode === 'owner'
                  ? 'Full quyền Chủ Garage (Hiển thị Giá vốn, Lãi gộp, SĐT gốc)'
                  : 'Cố vấn / Thợ (Đã che SĐT, ẩn Giá vốn, Lãi gộp & Công nợ nhạy cảm)'}
              </span>
            </div>
          </div>

          {/* 4-Column Grid for Tier 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* BLOCK 1: Định danh, Phân hạng & Tách bạch 3 vai trò (3 cols) */}
            <div className="xl:col-span-3 bg-slate-50/70 rounded-lg border border-slate-200 p-3.5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {customer.customerName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                      <span className="font-bold text-blue-700">
                        {customer.customerCode}
                      </span>
                      <span>·</span>
                      <span>MST: {customer.taxCode || '0314567890'}</span>
                    </div>
                  </div>
                </div>

                {/* Standardized Phone with RBAC awareness */}
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200 text-xs">
                  <span className="text-slate-500">SĐT chuẩn hóa:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {displayPhone}
                  </span>
                </div>

                {/* Classification Tiers */}
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Phân hạng: </span>
                  <span className="font-bold text-blue-700">VIP</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <span className="font-medium text-slate-700">Đội xe công ty</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <span className="font-medium text-slate-700">Bảo hiểm liên kết</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <span className="text-slate-500">Khách lẻ</span>
                </div>
              </div>

              {/* Tách bạch 3 vai trò rõ ràng */}
              <div className="pt-2.5 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-700 text-[11px]">
                  Tách bạch 3 vai trò độc lập:
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 shrink-0">
                      [1] Chủ sở hữu / Pháp nhân:
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {customer.companyName || customer.customerName}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-t border-slate-100 pt-1">
                    <span className="text-slate-500 shrink-0">
                      [2] Người lái / Tài xế giao xe:
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      Anh Nguyễn Văn Hùng (Tài xế đội xe)
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-t border-slate-100 pt-1">
                    <span className="text-slate-500 shrink-0">
                      [3] Người thanh toán / Bảo hiểm:
                    </span>
                    <span className="font-semibold text-blue-700 text-right">
                      Kế toán Công ty &amp; BH PVI Nam Sài Gòn
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 2: Trạng thái tức thời tại xưởng (Real-time Single Source of Truth) (3 cols) */}
            <div className="xl:col-span-3 bg-slate-50/70 rounded-lg border border-slate-200 p-3.5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Trạng thái tức thời tại xưởng
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Có 1 xe trong xưởng
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">
                      Biển số: 51G12345
                    </span>
                    <span className="font-mono text-blue-700 font-semibold">
                      RO-2026-0988
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Mercedes-Benz C200 · Cầu nâng số 03 · KTV Lê Văn Tùng
                  </div>
                </div>

                {/* 4-Step Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-600">
                    Tiến độ trực quan (Single Source of Truth):
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {WORKSHOP_STAGES.map((stage, idx) => {
                      const currentIdx = WORKSHOP_STAGES.indexOf(workshopStage);
                      const isDone = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => setWorkshopStage(stage)}
                          className={`p-2 rounded border text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : isDone
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-[10px] opacity-80 font-mono">
                            Bước {idx + 1}/4
                          </div>
                          <div className="text-xs truncate">{stage}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real-time Simulation Buttons */}
              <div className="pt-2.5 border-t border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600">
                  Mô phỏng đồng bộ thời gian thực (Real-time Sync):
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleWarehouseConfirmPartsArrived}
                    className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Kho xác nhận hàng về</span>
                    <span className="text-[11px] font-normal text-blue-600">
                      → Sang Đang sửa
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAccountantConfirmPayment}
                    className="w-full py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Kế toán vừa thu tiền</span>
                    <span className="text-[11px] font-normal text-emerald-700">
                      → Trừ công nợ ngay
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* BLOCK 3: Bộ chỉ số Tài chính sinh tồn (Financial KPIs) (3 cols) */}
            <div className="xl:col-span-3 bg-slate-50/70 rounded-lg border border-slate-200 p-3.5 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Bộ chỉ số Tài chính sinh tồn
                </span>
                {rbacMode === 'advisor_tech' && (
                  <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Đã ẩn nhạy cảm
                  </span>
                )}
              </div>

              {/* KPI 1: Tổng doanh thu tích lũy (LTV) & Biên lợi nhuận gộp (%) */}
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Tổng doanh thu tích lũy (LTV) &amp; Lãi gộp
                </div>
                {rbacMode === 'owner' ? (
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      {formatVND(lifetimeRevenue)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono tabular-nums">
                      Lãi gộp: {grossMarginPercent}%
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 py-1 px-2 bg-slate-100 rounded text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Đã ẩn Doanh thu LTV &amp; Biên lợi nhuận gộp (RBAC)
                  </div>
                )}
              </div>

              {/* KPI 2: Công nợ phải thu hiện tại & Nợ quá hạn */}
              <div
                className={`p-2.5 rounded border ${
                  rbacMode === 'owner' && overdueDebt > 0
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600">
                    Công nợ phải thu hiện tại
                  </span>
                  {rbacMode === 'owner' && overdueDebt > 0 && (
                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Có nợ quá hạn!
                    </span>
                  )}
                </div>

                {rbacMode === 'owner' ? (
                  <div className="mt-1 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-600">Tổng phải thu:</span>
                      <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        {formatVND(currentReceivableDebt)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-red-200/70">
                      <span className="text-xs font-bold text-red-700">
                        Nợ quá hạn (&gt;30 ngày):
                      </span>
                      <span
                        className={`text-sm font-bold font-mono tabular-nums ${
                          overdueDebt > 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatVND(overdueDebt)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 py-1 px-2 bg-slate-100 rounded text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Đã ẩn Công nợ nhạy cảm (Chỉ Kế toán / Chủ Garage xem)
                  </div>
                )}
              </div>

              {/* KPI 3: Số dư thẻ trả trước / Gói bảo dưỡng định kỳ */}
              <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Số dư thẻ trả trước:</span>
                  <span className="font-mono font-bold text-blue-700 tabular-nums">
                    {formatVND(prepaidCardBalance)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-medium">
                  {remainingMaintenancePackages}
                </div>
              </div>
            </div>

            {/* BLOCK 4: Hộp Cảnh báo đỏ & Ghi chú đặc biệt (Exception-Driven UI) (3 cols) */}
            <div className="xl:col-span-3 bg-red-50/70 rounded-lg border border-red-200 p-3.5 flex flex-col justify-between space-y-2.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Cảnh báo đỏ &amp; Ngoại lệ (Exception UI)
                  </span>
                </div>

                {/* Exception 1: Khiếu nại / Bảo hành chưa xử lý xong */}
                <div className="bg-white p-2.5 rounded border border-red-200 space-y-1">
                  <div className="text-xs font-bold text-red-700">
                    1. Bảo hành chưa xử lý xong (RO-2026-0988)
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Cụm van hằng nhiệt <span className="font-mono font-semibold">PT-MB-2052000615</span> trên xe 51G12345 bị rỉ nước làm mát nhẹ sau 14 ngày thay. Cần kiểm tra &amp; yêu cầu bảo hành sang NCC.
                  </p>
                </div>

                {/* Exception 2: Xe chờ phụ tùng quá 48h */}
                <div
                  className={`p-2.5 rounded border space-y-1 ${
                    partsWaitOverdueResolved
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-red-200'
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      partsWaitOverdueResolved
                        ? 'text-emerald-800'
                        : 'text-red-700'
                    }`}
                  >
                    {partsWaitOverdueResolved
                      ? '2. Phụ tùng chờ đã về kho (Đã giải quyết)'
                      : '2. Xe 51G12345 chờ phụ tùng quá 48h (52 giờ)'}
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {partsWaitOverdueResolved
                      ? 'Kho đã xác nhận hàng về, xe đã chuyển sang Đang sửa chữa.'
                      : 'Đang chờ gioăng van hằng nhiệt từ NCC Đức Á Châu. Cố vấn cần thông báo tiến độ cho tài xế.'}
                  </p>
                </div>
              </div>

              {/* Ghi chú tính cách / thói quen khách hàng */}
              <div className="bg-amber-50 p-2.5 rounded border border-amber-300 space-y-1">
                <div className="text-xs font-bold text-amber-900">
                  Ghi chú tính cách / Thói quen bắt buộc lưu ý:
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  &ldquo;Khách rất kỹ tính, bắt buộc giữ lại toàn bộ phụ tùng cũ bỏ vào cốp xe, bọc ghế &amp; vô lăng sạch sẽ trước khi giao xe. Không gọi điện trong khung giờ 12h00 – 13h30.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* TẦNG 2: NHÌN TIẾP THEO (3 - 15 GIÂY) — TÀI SẢN XE & MỎ VÀNG UPSELL  */}
        {/* =================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* CỘT TRÁI: DANH MỤC XE QUẢN LÝ (VEHICLE-CENTRIC GARAGE) (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    02A. TẦNG 2 (CỘT TRÁI) — DANH MỤC XE QUẢN LÝ (VEHICLE-CENTRIC GARAGE)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click vào từng thẻ xe để lọc toàn bộ dữ liệu ở Tầng 2 và Tầng 3 theo đúng chiếc xe đó
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVehiclePlate && (
                    <button
                      type="button"
                      onClick={() => setSelectedVehiclePlate(null)}
                      className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      Đang lọc: {selectedVehiclePlate} (Bấm xem tất cả {vehicles.length} xe)
                    </button>
                  )}
                </div>
              </div>

              {/* Vehicle Cards List */}
              <div className="space-y-2.5">
                {vehicles.map((veh) => {
                  const isSelected = selectedVehiclePlate === veh.plate;
                  return (
                    <div
                      key={veh.id}
                      onClick={() =>
                        setSelectedVehiclePlate(
                          isSelected ? null : veh.plate
                        )
                      }
                      className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500'
                          : 'bg-slate-50/50 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-300 tabular-nums">
                              {normalizePlate(veh.plate)}
                            </span>
                            <span className="text-sm font-bold text-slate-800">
                              {veh.modelYear}
                            </span>
                            {isSelected && (
                              <span className="text-xs font-bold text-blue-700">
                                · Đang chọn lọc dữ liệu
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono tabular-nums">
                            Số khung (VIN): <span className="font-semibold text-slate-700">{veh.vin}</span>
                            <span className="mx-2">·</span>
                            ODO hiện tại: <span className="font-bold text-slate-900">{veh.currentOdo.toLocaleString('vi-VN')} km</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1 text-xs">
                          <div className="text-slate-600 font-mono tabular-nums">
                            Hạn đăng kiểm: <span className="font-semibold text-slate-800">{veh.inspectionExpiry}</span>
                          </div>
                          <div
                            className={`font-mono tabular-nums ${
                              veh.isInsuranceExpiringSoon
                                ? 'text-amber-700 font-bold'
                                : 'text-slate-600'
                            }`}
                          >
                            BH thân vỏ: {veh.hullInsuranceExpiry}{' '}
                            {veh.isInsuranceExpiringSoon && (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 ml-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Sắp hết hạn &lt;30 ngày
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ownership Transfer Badge & Summary */}
                      {veh.isTransferredOwnership && (
                        <div className="mt-2.5 p-2.5 rounded bg-amber-50/90 border border-amber-200 text-xs space-y-1">
                          <div className="font-bold text-amber-900 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>
                              Xe đổi chủ - Kế thừa bệnh án theo VIN ({veh.vin})
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-900 leading-snug">
                            {veh.previousOwnerSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Tổng cộng: <strong className="text-slate-800">{vehicles.length} xe</strong> thuộc hồ sơ khách hàng
              </span>
              <span>
                {selectedVehiclePlate
                  ? `Đang lọc theo biển số ${selectedVehiclePlate}`
                  : 'Đang hiển thị dữ liệu tổng hợp của tất cả các xe'}
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: MỎ VÀNG UPSELL (HẠNG MỤC BÁO GIÁ CHỜ LÀM) & LỊCH NHẮC TỰ ĐỘNG (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-slate-900">
                  02B. TẦNG 2 (CỘT PHẢI) — MỎ VÀNG UPSELL &amp; LỊCH NHẮC TỰ ĐỘNG
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Các hạng mục kỹ thuật viên đã phát hiện ở lần vào xưởng trước nhưng khách tạm hoãn chưa làm
                </p>
              </div>

              {/* Deferred Upsell Items */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filteredUpsellItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {item.plate}
                          </span>
                          <span>·</span>
                          <span>Phát hiện tại {item.discoveredRo} ({item.discoveredDate})</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {item.itemName}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-700 tabular-nums whitespace-nowrap">
                        {formatVND(item.quotedAmount)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {item.conditionNote}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/80">
                      <span className="text-[11px] text-slate-500">
                        {item.recommendedTiming} · {item.technicianReporter}
                      </span>

                      <button
                        type="button"
                        disabled={item.addedToNewRo}
                        onClick={() => handleAddUpsellToNewRo(item)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          item.addedToNewRo
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {item.addedToNewRo
                          ? '✓ Đã đưa vào Lệnh sửa chữa (RO) mới'
                          : '[+ Đưa vào Lệnh sửa chữa (RO) mới]'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dự báo ngày và mức ODO đến kỳ bảo dưỡng tiếp theo */}
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1.5">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Dự báo ngày &amp; mức ODO đến kỳ bảo dưỡng tiếp theo (AI &amp; ODO Tracking):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {vehicles
                  .filter(
                    (v) =>
                      !selectedVehiclePlate || v.plate === selectedVehiclePlate
                  )
                  .map((v) => (
                    <div
                      key={v.id}
                      className="bg-white p-2 rounded border border-blue-100 font-mono tabular-nums"
                    >
                      <div className="font-bold text-slate-900">{v.plate}</div>
                      <div className="text-[11px] text-slate-600">
                        Dự kiến: <strong className="text-blue-700">{v.nextMaintenanceDate}</strong>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Mốc ODO: <strong>{v.nextMaintenanceOdo.toLocaleString('vi-VN')} km</strong>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* TẦNG 3: NHÌN SAU CÙNG (TRA CỨU SÂU) — LỊCH SỬ & TRUY VẾT 2 CHIỀU   */}
        {/* =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Tabs Header */}
          <div className="px-4 pt-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xs font-bold text-slate-900">
                03. TẦNG 3 (TRA CỨU SÂU) — LỊCH SỬ SỬA CHỮA, TRUY VẾT PHỤ TÙNG 2 CHIỀU &amp; SỔ CÁI
              </span>
              {selectedVehiclePlate && (
                <span className="text-xs font-mono font-bold text-blue-700">
                  · Đang lọc theo xe {selectedVehiclePlate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTier3Tab('ro_timeline')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTier3Tab === 'ro_timeline'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Tab 1: Timeline Lịch sử sửa chữa (RO) &amp; Truy vết Phụ tùng 2 chiều ({filteredRepairOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTier3Tab('financial_ledger')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTier3Tab === 'financial_ledger'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Tab 2: Sổ cái Công nợ &amp; Hóa đơn ({filteredLedgerInvoices.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTier3Tab('crm_zalo')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTier3Tab === 'crm_zalo'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Tab 3: Nhật ký CSKH (CRM &amp; Zalo Logs) ({filteredCrmLogs.length})
              </button>
            </div>
          </div>

          {/* TAB 1 CONTENT: TIMELINE LỊCH SỬ SỬA CHỮA (RO) & TRUY VẾT PHỤ TÙNG 2 CHIỀU */}
          {activeTier3Tab === 'ro_timeline' && (
            <div className="p-4 space-y-4">
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <Package className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Hướng dẫn Truy vết Phụ tùng 2 chiều (Bi-directional Traceability):</strong> Nhấn trực tiếp vào bất kỳ <strong>Mã phụ tùng</strong> nào bên dưới để mở ngăn <strong>Nhà cung cấp 360 (Supplier 360)</strong>, đối chiếu giá nhập chéo giữa các NCC và tạo yêu cầu bảo hành.
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredRepairOrders.map((ro) => (
                  <div
                    key={ro.roCode}
                    className={`rounded-xl border p-4 space-y-3 ${
                      ro.isInheritedFromPreviousOwner
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* RO Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-700">
                            {ro.roCode}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            Biển số: {ro.plate}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="font-mono text-xs text-slate-600 tabular-nums">
                            Ngày: {ro.date}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                            ODO: {ro.odo.toLocaleString('vi-VN')} km
                          </span>
                          {ro.isInheritedFromPreviousOwner && (
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                              Xe đổi chủ - Kế thừa bệnh án theo VIN (Đã khóa tài chính chủ cũ)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-700">
                          <strong>Triệu chứng / Yêu cầu:</strong> {ro.symptoms}
                        </div>
                        <div className="text-xs text-slate-500">
                          {ro.advisorName} · {ro.technicianName}
                        </div>
                      </div>

                      {/* RO Financial Summary (Respects RBAC & Ownership Inheritance Lock) */}
                      <div className="text-right font-mono tabular-nums text-xs">
                        {ro.isInheritedFromPreviousOwner ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded border border-amber-300 font-sans font-semibold">
                            <Lock className="w-3.5 h-3.5" />
                            Đã khóa dữ liệu tài chính của chủ xe cũ
                          </div>
                        ) : rbacMode === 'owner' ? (
                          <div className="space-y-0.5">
                            <div>
                              Doanh thu RO:{' '}
                              <strong className="text-slate-900">
                                {formatVND(ro.totalRevenue)}
                              </strong>
                            </div>
                            <div className="text-emerald-700">
                              Giá vốn: {formatVND(ro.totalCost)} · Lãi gộp:{' '}
                              <strong>
                                {formatVND(ro.totalRevenue - ro.totalCost)} (
                                {Math.round(
                                  ((ro.totalRevenue - ro.totalCost) /
                                    ro.totalRevenue) *
                                    100
                                )}
                                %)
                              </strong>
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded font-sans">
                            <Lock className="w-3.5 h-3.5" />
                            Đã ẩn Giá vốn &amp; Lãi gộp (Chế độ Cố vấn/Thợ)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hình ảnh nghiệm thu kỹ thuật */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-700">
                        Biên bản &amp; Hình ảnh nghiệm thu kỹ thuật ({ro.inspectionPhotos.length} mốc):
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {ro.inspectionPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-800">
                                {photo.label}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Khu vực: {photo.zone} · {photo.timestamp}
                              </div>
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                                photo.status === 'Đạt chuẩn'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : photo.status === 'Đã khắc phục'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {photo.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách phụ tùng đã thay (Click Mã phụ tùng -> Mở Supplier 360) */}
                    {ro.replacedParts.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-slate-700">
                          Danh sách phụ tùng đã thay (Click vào Mã phụ tùng để mở Nhà cung cấp 360):
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                <th className="py-2 px-3">MÃ PHỤ TÙNG (CLICK TRUY VẾT)</th>
                                <th className="py-2 px-3">TÊN PHỤ TÙNG</th>
                                <th className="py-2 px-3 text-right">SL</th>
                                <th className="py-2 px-3 text-right">ĐƠN GIÁ BÁN</th>
                                {rbacMode === 'owner' && !ro.isInheritedFromPreviousOwner && (
                                  <th className="py-2 px-3 text-right">GIÁ VỐN NHẬP</th>
                                )}
                                <th className="py-2 px-3">NHÀ CUNG CẤP &amp; LÔ PO</th>
                                <th className="py-2 px-3">TRẠNG THÁI BẢO HÀNH</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {ro.replacedParts.map((part) => {
                                const isClaimed = claimedPartCodes.includes(
                                  part.partCode
                                );
                                return (
                                  <tr
                                    key={part.partCode}
                                    className={
                                      part.isWarrantyDefect
                                        ? 'bg-red-50/70 hover:bg-red-100/60'
                                        : 'hover:bg-blue-50/40'
                                    }
                                  >
                                    <td className="py-2.5 px-3 font-mono">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedPartForSupplier360({
                                            part,
                                            roCode: ro.roCode,
                                            plate: ro.plate,
                                          })
                                        }
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                                          part.isWarrantyDefect
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                        }`}
                                        title="Nhấn để mở Nhà cung cấp 360 (Supplier 360)"
                                      >
                                        <span>{part.partCode}</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                    <td className="py-2.5 px-3 font-medium text-slate-900">
                                      <div>{part.partName}</div>
                                      {part.defectNote && (
                                        <div className="text-[11px] text-red-700 font-semibold mt-0.5">
                                          ⚠️ {part.defectNote}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                                      {part.quantity}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800 tabular-nums">
                                      {ro.isInheritedFromPreviousOwner
                                        ? 'Đã khóa (Chủ cũ)'
                                        : formatVND(part.sellingPrice)}
                                    </td>
                                    {rbacMode === 'owner' &&
                                      !ro.isInheritedFromPreviousOwner && (
                                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                                          {formatVND(part.importCost)}
                                        </td>
                                      )}
                                    <td className="py-2.5 px-3 text-slate-700">
                                      <div className="font-semibold">
                                        {part.supplier360.supplierName}
                                      </div>
                                      <div className="text-[11px] text-slate-500 font-mono">
                                        {part.supplier360.poNumber} · {part.supplier360.batchCode}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {isClaimed ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          Đã gửi yêu cầu bắt đền sang NCC
                                        </span>
                                      ) : part.isWarrantyDefect ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setSelectedPartForSupplier360({
                                              part,
                                              roCode: ro.roCode,
                                              plate: ro.plate,
                                            })
                                          }
                                          className="text-red-700 font-bold underline cursor-pointer"
                                        >
                                          Đang lỗi bảo hành — Bấm truy vết NCC 360
                                        </button>
                                      ) : (
                                        <span className="text-slate-600">
                                          {part.supplier360.warrantyRemaining}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: SỔ CÁI CÔNG NỢ & HÓA ĐƠN (FINANCIAL LEDGER) */}
          {activeTier3Tab === 'financial_ledger' && (
            <div className="p-4 space-y-3">
              {rbacMode === 'advisor_tech' ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Sổ cái Công nợ nhạy cảm đang được bảo mật theo phân quyền (RBAC Masking)
                  </h4>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto">
                    Bạn đang ở <strong>Góc nhìn Cố vấn / Thợ</strong>. Để xem chi tiết đối soát công nợ, chiết khấu và dòng tiền bảo hiểm đồng chi trả, vui lòng chuyển nút gạt trên thanh Header sang <strong>Góc nhìn Chủ Garage (100% Full)</strong>.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-2.5 px-3">MÃ HÓA ĐƠN</th>
                        <th className="py-2.5 px-3">MÃ RO</th>
                        <th className="py-2.5 px-3">NGÀY LẬP</th>
                        <th className="py-2.5 px-3">BIỂN SỐ XE</th>
                        <th className="py-2.5 px-3 text-right">TỔNG PHÁT SINH</th>
                        <th className="py-2.5 px-3 text-right">KHÁCH ĐÃ TRẢ</th>
                        <th className="py-2.5 px-3 text-right">
                          BẢO HIỂM ĐỒNG CHI TRẢ / KHẤU TRỪ
                        </th>
                        <th className="py-2.5 px-3 text-right">CÔNG NỢ LŨY KẾ</th>
                        <th className="py-2.5 px-3">TRẠNG THÁI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                      {filteredLedgerInvoices.map((inv) => (
                        <tr
                          key={inv.invoiceCode}
                          className={
                            inv.isOverdue ? 'bg-red-50/70' : 'hover:bg-slate-50'
                          }
                        >
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {inv.invoiceCode}
                          </td>
                          <td className="py-2.5 px-3 text-blue-700 font-semibold">
                            {inv.roCode}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {inv.date}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {inv.plate}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                            {formatVND(inv.totalAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">
                            {formatVND(inv.customerPaid)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-blue-700 font-semibold">
                            {formatVND(inv.insuranceCoPay)}
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-bold ${
                              inv.accumulatedDebt > 0
                                ? 'text-red-600'
                                : 'text-slate-500'
                            }`}
                          >
                            {formatVND(inv.accumulatedDebt)}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <span
                              className={`font-semibold ${
                                inv.status === 'Đã tất toán'
                                  ? 'text-emerald-700'
                                  : inv.status === 'Quá hạn thanh toán'
                                  ? 'text-red-700 font-bold'
                                  : 'text-amber-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3 CONTENT: NHẬT KÝ CSKH (CRM & ZALO LOGS) */}
          {activeTier3Tab === 'crm_zalo' && (
            <div className="p-4 space-y-3">
              {filteredCrmLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700">
                        [{log.type}]
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        Xe {log.plate}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-600">
                        {log.roCode}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500">{log.staff}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      {log.rating && (
                        <span className="font-sans font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          Đánh giá: {log.rating}/5 sao
                        </span>
                      )}
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {log.summary}
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    <strong>Phản hồi của khách:</strong> {log.customerFeedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ===================================================================== */}
      {/* SUPPLIER 360 DRAWER / MODAL (BI-DIRECTIONAL TRACEABILITY)             */}
      {/* ===================================================================== */}
      {selectedPartForSupplier360 && (() => {
        const { part, roCode, plate } = selectedPartForSupplier360;
        const s360 = part.supplier360;
        const diffPercent =
          ((part.importCost - s360.averageMarketImportCost) /
            s360.averageMarketImportCost) *
          100;
        const isHigher = diffPercent > 0;
        const absPercent = Math.abs(diffPercent).toFixed(1);
        const isAlreadyClaimed = claimedPartCodes.includes(part.partCode);

        return (
          <div
            className="fixed inset-0 z-60 bg-black/50 flex items-center justify-end"
            onClick={() => setSelectedPartForSupplier360(null)}
          >
            <div
              className="w-full max-w-2xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold">
                      Nhà cung cấp 360 (Supplier 360) &amp; Truy vết Phụ tùng 2 chiều
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Mã phụ tùng: {part.partCode} · Lắp trên xe {plate} ({roCode})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPartForSupplier360(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Part Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono font-bold text-blue-700 text-sm">
                        {part.partCode}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {part.partName}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                      Giá bán KH: {formatVND(part.sellingPrice)}
                    </span>
                  </div>
                  {part.defectNote && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-800 font-semibold">
                      ⚠️ Ghi nhận lỗi bảo hành: {part.defectNote}
                    </div>
                  )}
                </div>

                {/* Supplier Origin & SLA Metrics */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    1. Nguồn gốc Lô hàng (PO) &amp; Điểm uy tín SLA Nhà cung cấp
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <div className="text-slate-500">Nhà cung cấp (Supplier):</div>
                      <div className="font-bold text-slate-900 text-sm">
                        {s360.supplierName}
                      </div>
                      <div className="font-mono text-slate-500">
                        Mã NCC: {s360.supplierCode}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 font-mono tabular-nums">
                      <div className="text-slate-500 font-sans">
                        Đơn nhập (PO) &amp; Lô hàng:
                      </div>
                      <div className="font-bold text-blue-700 text-sm">
                        {s360.poNumber} · {s360.batchCode}
                      </div>
                      <div className="text-slate-600">
                        Ngày nhập kho: {s360.importDate}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <div className="text-slate-500">Thời hạn bảo hành còn lại:</div>
                      <div className="font-bold text-emerald-700">
                        {s360.warrantyRemaining}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 font-mono tabular-nums">
                      <div className="text-slate-500 font-sans">
                        Điểm uy tín SLA của NCC:
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Giao đúng hẹn:</span>
                        <strong className="text-emerald-700">
                          {s360.slaOnTimePercent}%
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tỷ lệ hàng lỗi:</span>
                        <strong className="text-red-600">
                          {s360.slaDefectPercent}%
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Import Cost & Cross-Supplier Comparison */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Giá vốn nhập &amp; Chỉ báo so sánh chéo Nhà cung cấp (Cross-Supplier Comparison)
                  </h4>

                  {rbacMode === 'advisor_tech' ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5">
                      <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                      <div>
                        <div className="font-bold">
                          Đã ẩn Giá vốn nhập &amp; So sánh giá NCC (Chế độ Cố vấn / Thợ)
                        </div>
                        <div className="text-[11px] mt-0.5">
                          Chuyển sang &ldquo;Góc nhìn Chủ Garage (100% Full)&rdquo; trên thanh Header để xem Giá vốn nhập và bảng so sánh giá chéo các Nhà cung cấp.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 font-mono tabular-nums">
                        <div>
                          <div className="text-slate-500 font-sans">
                            Giá vốn nhập lô này ({s360.poNumber}):
                          </div>
                          <div className="text-lg font-bold text-slate-900">
                            {formatVND(part.importCost)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Giá nhập TB các NCC khác: {formatVND(s360.averageMarketImportCost)}
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-lg border ${
                            isHigher
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}
                        >
                          <div className="text-[11px] font-sans font-semibold">
                            Chỉ báo so sánh chéo NCC:
                          </div>
                          <div className="text-sm font-bold flex items-center gap-1 mt-0.5">
                            {isHigher ? (
                              <>
                                <ArrowUpRight className="w-4 h-4 text-red-600" />
                                <span>
                                  Cao hơn +{absPercent}% so với TB các NCC khác
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                                <span>
                                  Thấp hơn -{absPercent}% so với TB các NCC khác
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Comparison Table across Suppliers */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                              <th className="py-2 px-3">NHÀ CUNG CẤP TỪNG NHẬP</th>
                              <th className="py-2 px-3 text-right">GIÁ VỐN NHẬP</th>
                              <th className="py-2 px-3 text-right">SLA ĐÚNG HẸN</th>
                              <th className="py-2 px-3 text-right">% HÀNG LỖI</th>
                              <th className="py-2 px-3">NGÀY NHẬP GẦN NHẤT</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                            {s360.comparisonSuppliers.map((sup, i) => (
                              <tr key={i} className={i === 0 ? 'bg-blue-50/50 font-semibold' : ''}>
                                <td className="py-2 px-3 font-sans text-slate-900">
                                  {sup.supplierName}
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-slate-900">
                                  {formatVND(sup.importPrice)}
                                </td>
                                <td className="py-2 px-3 text-right text-emerald-700">
                                  {sup.slaOnTimeRate}%
                                </td>
                                <td className="py-2 px-3 text-right text-red-600">
                                  {sup.defectRate}%
                                </td>
                                <td className="py-2 px-3 text-slate-600">
                                  {sup.lastImportDate}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer: Action Button */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleCreateSupplierClaim(part.partCode, s360.supplierName)
                  }
                  disabled={isAlreadyClaimed}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isAlreadyClaimed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                  }`}
                >
                  {isAlreadyClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Đã khởi tạo Yêu cầu bắt đền / Bảo hành sang {s360.supplierName}
                    </>
                  ) : (
                    <span>[Tạo yêu cầu bắt đền/Bảo hành sang NCC]</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPartForSupplier360(null)}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
