import React, { createContext, useState, useContext } from 'react';

export const MOCK_CS_DATA = [
  {
    id: '1',
    ro: 'RO-2024-001',
    date: '26/02/2024',
    type: 'Tại cửa hàng',
    status: 'Hoàn thành',
    paymentStatus: 'Đã thanh toán',
    customerId: 'KH001',
    customerName: 'Nguyễn Văn A',
    isCompany: 'Không',
    phone: '0901234567',
    total: '1.500.000',
    paid: '1.500.000',
    remaining: '0',
    note: 'Khách quen'
  },
  {
    id: '2',
    ro: 'RO-2024-002',
    date: '26/02/2024',
    type: 'Online',
    status: 'Đang xử lý',
    paymentStatus: 'Chưa thanh toán',
    customerId: 'KH002',
    customerName: 'Shopee_User_01',
    isCompany: 'Không',
    phone: '0988777666',
    total: '850.000',
    paid: '0',
    remaining: '850.000',
    note: 'Đơn từ sàn'
  },
  {
    id: '3',
    ro: 'RO-2024-003',
    date: '25/02/2024',
    type: 'Thanh lý',
    status: 'Đã hủy',
    paymentStatus: '-',
    customerId: 'KH003',
    customerName: 'Công ty X',
    isCompany: 'Có',
    phone: '028333444',
    total: '10.000.000',
    paid: '2.000.000',
    remaining: '8.000.000',
    note: 'Hàng lỗi móp'
  }
];

export const MOCK_PO_DATA = [
  {
    id: '1',
    poCode: 'PO001',
    prCode: 'PR001',
    status: 'Mới',
    viaWarehouse: true,
    warehouseCode: 'KHO01',
    warehouseName: 'Kho Chính',
    createdAt: '20/02/2024',
    proposalType: 'Mua mới',
    ro: 'RO-123',
    plate: '51G-12345',
    total: '5.000.000',
    receiverName: 'Nguyễn Văn A',
    receiverPhone: '0901234567',
    receiverAddress: '123 Lê Lợi, Q1',
    receiveNote: 'Giao giờ hành chính',
    supplierCode: 'NCC01',
    supplierName: 'Công ty Phụ tùng A',
    importedQty: '0',
    unimportedQty: '10',
    description: 'Nhập phụ tùng bảo dưỡng',
    isOnline: true,
  },
  {
    id: '2',
    poCode: 'PO002',
    prCode: 'PR002',
    status: 'Lập đơn hàng',
    viaWarehouse: false,
    warehouseCode: '',
    warehouseName: '',
    createdAt: '21/02/2024',
    proposalType: 'Bổ sung',
    ro: 'RO-456',
    plate: '51H-67890',
    total: '12.000.000',
    receiverName: 'Trần Thị B',
    receiverPhone: '0987654321',
    receiverAddress: '456 Nguyễn Huệ, Q1',
    receiveNote: 'Gọi trước khi giao',
    supplierCode: 'NCC02',
    supplierName: 'Đại lý Michelin',
    importedQty: '5',
    unimportedQty: '15',
    description: 'Nhập lốp xe',
    isOnline: false,
  },
  {
    id: '3',
    poCode: 'PO003',
    prCode: 'PR003',
    status: 'Đã nhập hàng',
    viaWarehouse: true,
    warehouseCode: 'KHO02',
    warehouseName: 'Kho Phụ',
    createdAt: '22/02/2024',
    proposalType: 'Mua mới',
    ro: 'RO-789',
    plate: '51K-11223',
    total: '8.500.000',
    receiverName: 'Lê Văn C',
    receiverPhone: '0912345678',
    receiverAddress: '789 Trần Hưng Đạo, Q5',
    receiveNote: '',
    supplierCode: 'NCC03',
    supplierName: 'Phụ tùng Bosch',
    importedQty: '20',
    unimportedQty: '0',
    description: 'Nhập bình ắc quy',
    isOnline: true,
  },
  {
    id: '4',
    poCode: 'PO004',
    prCode: 'PR004',
    status: 'Mới',
    viaWarehouse: true,
    warehouseCode: 'KHO01',
    warehouseName: 'Kho Chính',
    createdAt: '23/02/2024',
    proposalType: 'Mua mới',
    ro: 'RO-101',
    plate: '51F-99887',
    total: '3.200.000',
    receiverName: 'Phạm Thị D',
    receiverPhone: '0933445566',
    receiverAddress: '101 Võ Văn Kiệt, Q1',
    receiveNote: 'Giao gấp',
    supplierCode: 'NCC01',
    supplierName: 'Công ty Phụ tùng A',
    importedQty: '0',
    unimportedQty: '5',
    description: 'Nhập lọc gió',
    isOnline: false,
  },
  {
    id: '5',
    poCode: 'PO005',
    prCode: 'PR005',
    status: 'Lập đơn hàng',
    viaWarehouse: false,
    warehouseCode: '',
    warehouseName: '',
    createdAt: '24/02/2024',
    proposalType: 'Bổ sung',
    ro: 'RO-202',
    plate: '51C-55443',
    total: '15.000.000',
    receiverName: 'Hoàng Văn E',
    receiverPhone: '0977889900',
    receiverAddress: '202 Nguyễn Văn Cừ, Q5',
    receiveNote: '',
    supplierCode: 'NCC04',
    supplierName: 'Nhớt Castrol VN',
    importedQty: '10',
    unimportedQty: '40',
    description: 'Nhập nhớt động cơ',
    isOnline: true,
  }
];

export const OrderContext = createContext<any>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commercialSales, setCommercialSales] = useState(MOCK_CS_DATA);
  const [purchaseOrders, setPurchaseOrders] = useState(MOCK_PO_DATA);
  const [cart, setCart] = useState<{ productId: number; quantity: number }[]>([]);

  const addCommercialSale = (sale: any) => {
    setCommercialSales(prev => [sale, ...prev]);
  };

  const addPurchaseOrder = (po: any) => {
    setPurchaseOrders(prev => [po, ...prev]);
  };

  const addToCart = (productId: number, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <OrderContext.Provider value={{ 
      commercialSales, 
      purchaseOrders, 
      addCommercialSale, 
      addPurchaseOrder,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
