import React, { useState } from 'react';
import { Plus, Trash2, Filter, X, ChevronDown, MoreHorizontal, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { RepairOrderForm } from './RepairOrderForm';

interface RepairOrder {
  id: string;
  roNumber: string;
  licensePlate: string;
  stage: string;
  status: string;
  paymentStatus: string;
  receiveDate: string;
  estDeliveryDate: string;
  actualDeliveryDate: string;
  serviceGroup: string;
}

const MOCK_DATA: RepairOrder[] = [
  { id: '1', roNumber: '2603-000002', licensePlate: '51H 78905', stage: 'Báo giá', status: 'Mới tạo', paymentStatus: '', receiveDate: '05/03/2026 14:56', estDeliveryDate: '', actualDeliveryDate: '', serviceGroup: 'Bảo dưỡng' },
  { id: '2', roNumber: '2603-01-31T17:00:00.000Z', licensePlate: '51H 78905', stage: 'Báo giá', status: 'Đang báo giá', paymentStatus: '', receiveDate: '03/03/2026 10:53', estDeliveryDate: '', actualDeliveryDate: '', serviceGroup: 'Bảo dưỡng' },
  { id: '3', roNumber: '2602-01-31T17:00:00.000Z', licensePlate: '51L 07811', stage: 'Bàn giao', status: 'Đã bàn giao', paymentStatus: 'Chưa thanh toán', receiveDate: '28/02/2026 11:35', estDeliveryDate: '', actualDeliveryDate: '28/02/2026 11:46', serviceGroup: 'Rửa xe' },
  { id: '4', roNumber: '2601-000047', licensePlate: '51A 95825', stage: 'Bàn giao', status: 'Đã bàn giao', paymentStatus: 'Chưa thanh toán', receiveDate: '26/01/2026 16:30', estDeliveryDate: '26/01/2026 17:00', actualDeliveryDate: '26/01/2026 17:00', serviceGroup: 'Chăm sóc xe' },
  { id: '5', roNumber: '2601-000085', licensePlate: '51L 07811', stage: 'Bàn giao', status: 'Đã bàn giao', paymentStatus: 'Đã thanh toán', receiveDate: '26/01/2026 16:00', estDeliveryDate: '26/01/2026 17:00', actualDeliveryDate: '26/01/2026 17:10', serviceGroup: 'Chăm sóc xe' },
  { id: '6', roNumber: '2601-000084', licensePlate: '51E 31822', stage: 'Quyết toán', status: 'Chờ quyết toán', paymentStatus: 'Đã thanh toán', receiveDate: '26/01/2026 13:15', estDeliveryDate: '26/01/2026 15:00', actualDeliveryDate: '', serviceGroup: 'Sửa chữa' },
  { id: '7', roNumber: '2601-000086', licensePlate: '60K 45650', stage: 'Bàn giao', status: 'Đã bàn giao', paymentStatus: 'Chưa thanh toán', receiveDate: '26/01/2026 10:00', estDeliveryDate: '26/01/2026 11:00', actualDeliveryDate: '26/01/2026 11:00', serviceGroup: 'Lốp' },
  { id: '8', roNumber: '2601-000083', licensePlate: '70A 28624', stage: 'Bàn giao', status: 'Đã bàn giao', paymentStatus: 'Đã thanh toán', receiveDate: '26/01/2026 08:30', estDeliveryDate: '26/01/2026 09:00', actualDeliveryDate: '26/01/2026 09:10', serviceGroup: 'Chăm sóc xe' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Mới tạo': return 'bg-red-50 text-red-600 border-red-200';
    case 'Đang báo giá': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'Đã bàn giao': return 'bg-green-50 text-green-600 border-green-200';
    case 'Chờ quyết toán': return 'bg-teal-50 text-teal-600 border-teal-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const getPaymentStatusColor = (status: string) => {
  if (status === 'Chưa thanh toán') return 'text-red-500';
  if (status === 'Đã thanh toán') return 'text-teal-600';
  return 'text-gray-600';
};

export const RepairService: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === MOCK_DATA.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(MOCK_DATA.map(d => d.id)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] relative">
      {isCreating && <RepairOrderForm onClose={() => setIsCreating(false)} />}
      
      {/* Action Bar */}
      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          Nhập excel
        </button>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-400 px-4 py-1.5 rounded text-sm font-medium cursor-not-allowed">
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-end gap-4">
        <div className="flex-1 max-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Số RO</label>
          <input 
            type="text" 
            placeholder="Nhập số RO" 
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Xe</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
              <option value="">Chọn xe</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Giai đoạn</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
              <option value="">Chọn giai đoạn</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Kỹ thuật viên</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
              <option value="">Chọn kỹ thuật viên</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-5 h-5" />
        </button>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors ml-2">
          <Filter className="w-4 h-4" />
          Lọc
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Xóa lọc
        </button>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white border-b border-gray-200">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10 border-r border-gray-200">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedRows.size === MOCK_DATA.length && MOCK_DATA.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Số RO
                      <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                    </div>
                    <div className="flex flex-col ml-2">
                      <span className="text-[10px] leading-none text-orange-500">▲</span>
                      <span className="text-[10px] leading-none text-gray-400">▼</span>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Biển số</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Giai đoạn</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Trạng thái</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Trạng thái thanh toán</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Ngày nhận</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Ngày giao ước tính</th>
                <th className="px-4 py-3 font-medium border-r border-gray-200">Ngày giao thực tế</th>
                <th className="px-4 py-3 font-medium">Nhóm dịch vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-r border-gray-200">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedRows.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-blue-600">{row.roNumber}</td>
                  <td className="px-4 py-3 border-r border-gray-200">{row.licensePlate}</td>
                  <td className="px-4 py-3 border-r border-gray-200">{row.stage}</td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                      {row.status}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </span>
                  </td>
                  <td className={`px-4 py-3 border-r border-gray-200 ${getPaymentStatusColor(row.paymentStatus)}`}>
                    {row.paymentStatus}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">{row.receiveDate}</td>
                  <td className="px-4 py-3 border-r border-gray-200">{row.estDeliveryDate}</td>
                  <td className="px-4 py-3 border-r border-gray-200">{row.actualDeliveryDate}</td>
                  <td className="px-4 py-3">{row.serviceGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Details Panel Placeholder */}
        <div className="h-[200px] bg-white flex flex-col items-center justify-center text-gray-500 border-t-4 border-blue-500 rounded-t-xl mx-4 mt-[-10px] relative z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="w-12 h-1 bg-gray-300 rounded-full absolute top-2"></div>
          <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-sm">Chọn một dòng bên trên</p>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1 pr-8 bg-white focus:outline-none focus:border-blue-500">
              <option>20 Dòng</option>
              <option>50 Dòng</option>
              <option>100 Dòng</option>
            </select>
            <ChevronDown className="absolute right-2 top-1.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EBF5FF] text-blue-600 font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">4</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">5</button>
          <span className="px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">28</button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>

        <div>
          Hiển thị 1 - 20 / 554 kết quả
        </div>
      </div>
    </div>
  );
};
