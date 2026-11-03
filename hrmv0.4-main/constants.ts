export const COLORS = {
  headerText: '#052E15',
  bgMain: '#F2FBF5',
  borderPrimary: '#14A64A',
  borderSecondary: '#BCE3CD',
  actionText: '#3B6E4B',
  white: '#FFFFFF',
};

export const MOCK_BRANDS = ['Toyota', 'Honda', 'Ford', 'Bosch', 'Denso', 'Hyundai', 'Kia'];
export const MOCK_ORIGINS = ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Đức', 'Trung Quốc'];
export const MOCK_WARRANTY = ['Không bảo hành', '3 tháng', '6 tháng', '12 tháng', '24 tháng'];
export const MOCK_UNITS = ['Cái', 'Bộ', 'Chiếc', 'Hộp', 'Lít'];
export const MOCK_VAT = ['8%', '10%', 'Không chịu thuế'];
export const MOCK_CATEGORIES = ['Hệ thống phanh', 'Hệ thống treo', 'Động cơ', 'Thân vỏ', 'Điện'];

export const MOCK_SUPPLIERS = [
  { id: 1, name: 'Vinaparts', address: '123 Lê Lợi, Q1, HCM', mst: '0102030405', orders: '1,250', phone: '0901234567', contactPerson: 'Nguyễn Văn A', registrationDate: '12/05/2021', rating: 4.8 },
  { id: 2, name: 'Michelin VN', address: '456 Nguyễn Huệ, Q1, HCM', mst: '0506070809', orders: '890', phone: '0987654321', contactPerson: 'Trần Thị B', registrationDate: '08/10/2022', rating: 4.5 },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Lốp Michelin Pilot Sport 4',
    sku: 'MIC-PS4-2024',
    price: 4500000,
    originalPrice: 5000000,
    stock: 15,
    location: 'Quận 7, TP.HCM',
    position: 'Trước/Sau',
    compatible: 'Đa dạng',
    material: 'Cao su tổng hợp cao cấp',
    warning: 'Cần cân bằng động sau khi lắp đặt.',
    supplierId: 2,
    category: 'Lốp',
    image: 'https://picsum.photos/seed/tire1/200/200'
  },
  {
    id: 2,
    name: 'Má phanh Brembo Ceramic',
    sku: 'BRM-BP-09',
    price: 2100000,
    originalPrice: null,
    stock: 8,
    location: 'Quận 7, TP.HCM',
    position: 'Trước',
    compatible: 'Sedan, SUV',
    material: 'Gốm Ceramic',
    warning: 'Kiểm tra đĩa phanh trước khi thay thế.',
    supplierId: 1,
    category: 'Phụ tùng',
    image: 'https://picsum.photos/seed/brake1/200/200'
  },
  {
    id: 3,
    name: 'Dầu nhớt Castrol EDGE 5W-30',
    sku: 'CAS-EDGE-5W30',
    price: 1200000,
    originalPrice: 1500000,
    stock: 50,
    location: 'Quận 1, TP.HCM',
    position: 'Động cơ',
    compatible: 'Đa dạng',
    material: 'Dầu tổng hợp',
    warning: 'Thay thế mỗi 10.000km.',
    supplierId: 1,
    category: 'Hóa chất',
    image: 'https://picsum.photos/seed/oil1/200/200'
  },
  {
    id: 4,
    name: 'Máy chẩn đoán đa năng Autel',
    sku: 'AUT-MS906',
    price: 15000000,
    originalPrice: 16500000,
    stock: 2,
    location: 'Quận 3, TP.HCM',
    position: 'Thiết bị',
    compatible: 'OBDII',
    material: 'Nhựa ABS',
    warning: 'Cập nhật phần mềm định kỳ.',
    supplierId: 1,
    category: 'Thiết bị',
    image: 'https://picsum.photos/seed/tool1/200/200'
  },
  {
    id: 5,
    name: 'Lọc gió động cơ K&N',
    sku: 'KN-33-3005',
    price: 1800000,
    originalPrice: null,
    stock: 20,
    location: 'Quận 5, TP.HCM',
    position: 'Động cơ',
    compatible: 'Honda Civic, CRV',
    material: 'Vải cotton tẩm dầu',
    warning: 'Vệ sinh sau mỗi 5.000km.',
    supplierId: 1,
    category: 'Phụ tùng',
    image: 'https://picsum.photos/seed/filter1/200/200'
  },
  {
    id: 6,
    name: 'Dung dịch vệ sinh kim phun',
    sku: 'LIQ-INJ-CLN',
    price: 350000,
    originalPrice: 400000,
    stock: 100,
    location: 'Quận 1, TP.HCM',
    position: 'Nhiên liệu',
    compatible: 'Động cơ xăng',
    material: 'Dung dịch',
    warning: 'Tránh tiếp xúc trực tiếp với da.',
    supplierId: 2,
    category: 'Hóa chất',
    image: 'https://picsum.photos/seed/cleaner1/200/200'
  }
];
