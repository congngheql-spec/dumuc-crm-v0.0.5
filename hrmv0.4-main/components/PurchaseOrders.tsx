import React, { useState } from 'react';
import { Plus, Trash2, Filter, X, FileSearch, Inbox, Calendar, HelpCircle, ChevronDown } from 'lucide-react';
import { useOrderContext } from '../context/OrderContext';

const MOCK_DATA = [
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

export const PurchaseOrders: React.FC = () => {
  const { purchaseOrders } = useOrderContext();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterPo, setFilterPo] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterRo, setFilterRo] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<typeof MOCK_DATA[0] | null>(null);
  
  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    online: false,
    po: '',
    supplier: '',
    ro: ''
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

  const handleApplyFilter = () => {
    setAppliedFilters({
      online: filterOnline,
      po: filterPo,
      supplier: filterSupplier,
      ro: filterRo
    });
  };

  const handleClearFilter = () => {
    setFilterOnline(false);
    setFilterPo('');
    setFilterSupplier('');
    setFilterRo('');
    setAppliedFilters({
      online: false,
      po: '',
      supplier: '',
      ro: ''
    });
  };

  const filteredData = purchaseOrders.filter((item: any) => {
    if (appliedFilters.online && !item.isOnline) return false;
    if (appliedFilters.po && !item.poCode.toLowerCase().includes(appliedFilters.po.toLowerCase())) return false;
    if (appliedFilters.supplier && !item.supplierCode.toLowerCase().includes(appliedFilters.supplier.toLowerCase()) && !item.supplierName.toLowerCase().includes(appliedFilters.supplier.toLowerCase())) return false;
    if (appliedFilters.ro && !item.ro.toLowerCase().includes(appliedFilters.ro.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mới':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-red-200 bg-red-50 text-red-600">Mới</span>;
      case 'Lập đơn hàng':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-400 bg-yellow-50 text-yellow-600">Lập đơn hàng</span>;
      case 'Đã nhập hàng':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-green-200 bg-green-50 text-green-600">Đã nhập hàng</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Đơn đặt hàng</h1>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 flex items-center gap-2 bg-gray-50 border-b border-gray-200">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Thêm
        </button>
        <button 
          disabled
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 flex items-end gap-4 border-b border-gray-200">
        <div className="flex-1 flex items-center gap-4">
          <div className="space-y-1.5 flex-1 max-w-[200px]">
            <input 
              type="text" 
              placeholder="Mã PO" 
              value={filterPo}
              onChange={(e) => setFilterPo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
            />
          </div>
          <div className="space-y-1.5 flex-1 max-w-[200px]">
            <input 
              type="text" 
              placeholder="Nhà cung cấp" 
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
            />
          </div>
          <div className="space-y-1.5 flex-1 max-w-[200px]">
            <input 
              type="text" 
              placeholder="RO" 
              value={filterRo}
              onChange={(e) => setFilterRo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" 
            />
          </div>
          <div className="flex items-center gap-2 h-[38px] px-2">
            <input 
              type="checkbox" 
              id="online-filter"
              checked={filterOnline}
              onChange={(e) => setFilterOnline(e.target.checked)}
              className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8] cursor-pointer"
            />
            <label htmlFor="online-filter" className="text-sm font-medium text-gray-700 cursor-pointer">Đặt hàng online</label>
          </div>
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
                <th className="px-4 py-3 w-10 text-center border-b border-gray-200">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                  />
                </th>
                <th className="px-4 py-3 border-b border-gray-200">Mã PO</th>
                <th className="px-4 py-3 border-b border-gray-200">Mã PR</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái PO</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Qua kho</th>
                <th className="px-4 py-3 border-b border-gray-200">Kho nhập</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên kho nhập</th>
                <th className="px-4 py-3 border-b border-gray-200">Ngày tạo</th>
                <th className="px-4 py-3 border-b border-gray-200">Loại đề xuất</th>
                <th className="px-4 py-3 border-b border-gray-200">RO</th>
                <th className="px-4 py-3 border-b border-gray-200">Biển số</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Tổng tiền</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên người nhận</th>
                <th className="px-4 py-3 border-b border-gray-200">SĐT người nhận</th>
                <th className="px-4 py-3 border-b border-gray-200">Địa chỉ nhận</th>
                <th className="px-4 py-3 border-b border-gray-200">Ghi chú nhận hàng</th>
                <th className="px-4 py-3 border-b border-gray-200">Nhà cung cấp</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên nhà cung cấp</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">SL đã nhập</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">SL chưa nhập</th>
                <th className="px-4 py-3 border-b border-gray-200">Diễn giải</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setSelectedRecord(row)}>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1A73E8] hover:underline">{row.poCode}</td>
                  <td className="px-4 py-3 text-gray-600">{row.prCode}</td>
                  <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={row.viaWarehouse} readOnly className="w-4 h-4 text-gray-400 rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.warehouseCode}</td>
                  <td className="px-4 py-3 text-gray-800">{row.warehouseName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.createdAt}</td>
                  <td className="px-4 py-3 text-gray-600">{row.proposalType}</td>
                  <td className="px-4 py-3 font-medium text-[#1A73E8] cursor-pointer hover:underline">{row.ro}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.plate}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{row.total}</td>
                  <td className="px-4 py-3 text-gray-800">{row.receiverName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.receiverPhone}</td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]" title={row.receiverAddress}>{row.receiverAddress}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]" title={row.receiveNote}>{row.receiveNote}</td>
                  <td className="px-4 py-3 text-gray-600">{row.supplierCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.supplierName}</td>
                  <td className="px-4 py-3 text-right text-green-600">{row.importedQty}</td>
                  <td className="px-4 py-3 text-right text-red-600">{row.unimportedQty}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]" title={row.description}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Detail */}
      <div className="h-48 border-t border-gray-200 bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] text-gray-400 space-y-2">
        <FileSearch className="w-8 h-8 opacity-50" />
        <p className="text-sm font-medium">Chọn một dòng bên trên để xem chi tiết</p>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#F4F6F8] w-[95vw] h-[95vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold text-gray-800">Đơn đặt hàng</h2>
                <span className="px-6 py-1 rounded-full text-sm font-medium border border-red-200 bg-red-50 text-red-600">
                  {selectedRecord.status}
                </span>
                <div className="flex items-center gap-4 ml-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="viaWarehouse" className="w-4 h-4 text-blue-600" checked={selectedRecord.viaWarehouse} readOnly />
                    <span className="text-sm text-gray-700">Qua kho</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="viaWarehouse" className="w-4 h-4 text-blue-600" checked={!selectedRecord.viaWarehouse} readOnly />
                    <span className="text-sm text-gray-700">Không qua kho</span>
                  </label>
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-1 text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Top Section */}
              <div className="flex gap-4">
                {/* Left Column */}
                <div className="w-[60%] space-y-4">
                  <div className="bg-white border border-gray-200 rounded-md p-4 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phiếu đề xuất</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                          <option>48</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại đề xuất</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                          <option>{selectedRecord.proposalType}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">RO</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                          <option>{selectedRecord.ro}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                            <option>{selectedRecord.supplierName}</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kho nhập <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                            <option>{selectedRecord.warehouseName || 'Chọn kho'}</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hợp đồng</label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 appearance-none bg-gray-50 text-gray-400" disabled>
                            <option>Chọn hợp đồng</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                      <textarea className="w-full h-20 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="Nhập ghi chú" defaultValue="Mua keo lua,Cuppen,keo giấy"></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="w-[40%] bg-white border border-gray-200 rounded-md p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã PO</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm" defaultValue={selectedRecord.poCode} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm" defaultValue={selectedRecord.createdAt} />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section: Tabs & Table */}
              <div className="bg-white border border-gray-200 rounded-md flex flex-col min-h-[400px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Chi tiết</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Thông tin nhận hàng</button>
                </div>
                
                {/* Table */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap min-w-[1200px]">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 border-r border-gray-200 text-center w-10">#</th>
                        <th className="px-3 py-2 border-r border-gray-200">Vật tư <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200">Tên vật tư</th>
                        <th className="px-3 py-2 border-r border-gray-200">Mã quốc tế</th>
                        <th className="px-3 py-2 border-r border-gray-200">Diễn giải <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200">ĐVT <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200">Số lượng</th>
                        <th className="px-3 py-2 border-r border-gray-200">Đơn giá</th>
                        <th className="px-3 py-2 border-r border-gray-200">Tiền hàng</th>
                        <th className="px-3 py-2 border-r border-gray-200">Ghi chú</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dashed border-gray-200">
                        <td className="px-3 py-2 border-r border-gray-200 text-center text-gray-500">1</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>KEOA500</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-500">Keo A500</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">Keo A500</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>Chai</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">3</td>
                        <td className="px-3 py-2 border-r border-gray-200">0</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2"></td>
                      </tr>
                      <tr className="border-b border-dashed border-gray-200">
                        <td className="px-3 py-2 border-r border-gray-200 text-center text-gray-500">2</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>CP</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-500">Cupen</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">Cupen</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>Cái</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">2</td>
                        <td className="px-3 py-2 border-r border-gray-200">0</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2"></td>
                      </tr>
                      <tr className="border-b border-dashed border-gray-200">
                        <td className="px-3 py-2 border-r border-gray-200 text-center text-gray-500">3</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>BANGKEO</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-500">Băng keo</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">Băng keo</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>Cuộn</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">3</td>
                        <td className="px-3 py-2 border-r border-gray-200">0</td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2 border-r border-gray-200"></td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-2 flex items-center justify-between bg-gray-50/50">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                      Thêm dòng (F2) <HelpCircle className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 bg-white rounded-md hover:bg-blue-50 transition-colors">
                      Đồng bộ vật tư
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-center gap-3">
              <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Đóng</button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-[#1A73E8] hover:bg-blue-700 rounded-md transition-colors">Lưu</button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-[#1A73E8] hover:bg-blue-700 rounded-md transition-colors">Lưu & Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
