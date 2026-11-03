import React, { useState } from 'react';
import { Plus, Trash2, Search, Filter, X, Inbox, Calendar, HelpCircle, Printer } from 'lucide-react';
import { useOrderContext } from '../context/OrderContext';

export const CommercialSales: React.FC = () => {
  const { commercialSales: MOCK_DATA } = useOrderContext();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [data, setData] = useState(MOCK_DATA);
  const [selectedRecord, setSelectedRecord] = useState<typeof MOCK_DATA[0] | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(data.map(item => item.id));
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

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Bán hàng thương mại</h1>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Thêm
          </button>
          <button 
            disabled={selectedRows.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Xóa
          </button>
        </div>
        
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Tìm RO, khách hàng" 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 flex items-end gap-4 border-b border-gray-200">
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Số RO</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Đối tượng</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white">
              <option value="">Tất cả</option>
              <option value="khach_le">Khách lẻ</option>
              <option value="cong_ty">Công ty</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Phân loại</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1A73E8] bg-white">
              <option value="">Tất cả</option>
              <option value="tai_cua_hang">Tại cửa hàng</option>
              <option value="online">Online</option>
              <option value="thanh_ly">Thanh lý</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-0.5">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Lọc
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors">
            <X className="w-4 h-4" /> Xóa lọc
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        {data.length === 0 ? (
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
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                  />
                </th>
                <th className="px-4 py-3 border-b border-gray-200">Số RO</th>
                <th className="px-4 py-3 border-b border-gray-200">Ngày</th>
                <th className="px-4 py-3 border-b border-gray-200">Phân loại</th>
                <th className="px-4 py-3 border-b border-gray-200">Trạng thái</th>
                <th className="px-4 py-3 border-b border-gray-200">TT Thanh toán</th>
                <th className="px-4 py-3 border-b border-gray-200">Khách hàng</th>
                <th className="px-4 py-3 border-b border-gray-200">Tên khách hàng</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Là công ty</th>
                <th className="px-4 py-3 border-b border-gray-200">Số ĐT</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Tổng tiền</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Đã thanh toán</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Còn lại</th>
                <th className="px-4 py-3 border-b border-gray-200">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setSelectedRecord(row)}>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-[#1A73E8] rounded border-gray-300 focus:ring-[#1A73E8]"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1A73E8] hover:underline">{row.ro}</td>
                  <td className="px-4 py-3 text-gray-600">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      row.type === 'Tại cửa hàng' ? 'bg-green-100 text-green-700' :
                      row.type === 'Online' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{row.status}</td>
                  <td className="px-4 py-3 text-gray-600">{row.paymentStatus}</td>
                  <td className="px-4 py-3 text-gray-600">{row.customerId}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.customerName}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.isCompany}</td>
                  <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{row.total}</td>
                  <td className="px-4 py-3 text-right text-green-600">{row.paid}</td>
                  <td className="px-4 py-3 text-right text-red-600">{row.remaining}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]" title={row.note}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Detail */}
      <div className="h-48 border-t border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <p className="text-gray-400 text-sm font-medium">Chọn một dòng bên trên</p>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#F4F6F8] w-[95vw] h-[95vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-bold text-gray-800">Bán hàng thương mại</h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="saleType" className="w-4 h-4 text-blue-600" checked={selectedRecord.type !== 'Thanh lý'} readOnly />
                    <span className="text-sm text-gray-700">Bán hàng</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="saleType" className="w-4 h-4 text-blue-600" checked={selectedRecord.type === 'Thanh lý'} readOnly />
                    <span className="text-sm text-gray-700">Thanh lý</span>
                  </label>
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-1 text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Top Section */}
              <div className="flex gap-4">
                {/* Left: Ghi chú */}
                <div className="flex-1 bg-white border border-gray-200 rounded-md p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="Nhập ghi chú" defaultValue={selectedRecord.note}></textarea>
                </div>
                
                {/* Right: Info */}
                <div className="w-[400px] bg-white border border-gray-200 rounded-md p-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số RO</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50" readOnly value={selectedRecord.ro} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày CT</label>
                    <div className="relative">
                      <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm" defaultValue={`${selectedRecord.date} 08:56`} />
                      <Calendar className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500">
                      <option value={selectedRecord.customerId}>{selectedRecord.customerId} - {selectedRecord.customerName}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Middle Section: Tabs & Table */}
              <div className="bg-white border border-gray-200 rounded-md flex flex-col min-h-[400px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Chi tiết</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Hóa đơn VAT</button>
                </div>
                
                {/* Table */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap min-w-[1200px]">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 border-r border-gray-200 text-center w-10">#</th>
                        <th className="px-3 py-2 border-r border-gray-200">Vật tư <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200">Tên vật tư</th>
                        <th className="px-3 py-2 border-r border-gray-200">Diễn giải <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200">ĐVT <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">Số lượng</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">Đơn giá</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">Thành tiền</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">% CK</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">Tiền CK</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">Thành tiền trước VAT</th>
                        <th className="px-3 py-2 border-r border-gray-200 text-right">% VAT</th>
                        <th className="px-3 py-2 text-right">Tiền VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample Row based on record */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 border-r border-gray-200 text-center text-gray-500">1</td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent" defaultValue="VT001" /></td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent" defaultValue={selectedRecord.type === 'Thanh lý' ? 'Lốp xe cũ' : 'Nhớt Castrol'} /></td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent" defaultValue="Bán lẻ" /></td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent" defaultValue={selectedRecord.type === 'Thanh lý' ? 'Cái' : 'Chai'} /></td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent text-right" defaultValue="1" /></td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent text-right" defaultValue={selectedRecord.total} /></td>
                        <td className="px-3 py-2 border-r border-gray-200 text-right">{selectedRecord.total}</td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent text-right" defaultValue="0" /></td>
                        <td className="px-3 py-2 border-r border-gray-200 text-right">0</td>
                        <td className="px-3 py-2 border-r border-gray-200 text-right">{selectedRecord.total}</td>
                        <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full outline-none bg-transparent text-right" defaultValue="10" /></td>
                        <td className="px-3 py-2 text-right">...</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-2">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                      Thêm dòng (F2) <HelpCircle className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Bottom Section inside table card */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Giảm giá khác (nếu có):</span>
                    <input type="text" placeholder="Nhập số tiền giảm" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 w-40" />
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Printer className="w-4 h-4" /> In
                  </button>
                </div>
                
                {/* Summary Row */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 grid grid-cols-5 gap-4 text-sm">
                  <div><span className="text-gray-500">Tổng SL</span> <span className="font-bold ml-2">1</span></div>
                  <div><span className="text-gray-500">Tổng tiền hàng</span> <span className="font-bold ml-2">{selectedRecord.total}</span></div>
                  <div><span className="text-gray-500">Tổng CK</span> <span className="font-bold ml-2">0</span></div>
                  <div><span className="text-gray-500">Tổng thuế</span> <span className="font-bold ml-2">...</span></div>
                  <div><span className="text-gray-500">Tổng thanh toán</span> <span className="font-bold ml-2">{selectedRecord.total}</span></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-center gap-3">
              <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Đóng</button>
              <button className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md transition-colors">Nhập lại</button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-[#008080] hover:bg-teal-700 rounded-md transition-colors">Lưu nháp</button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-[#1A73E8] hover:bg-blue-700 rounded-md transition-colors">Ghi sổ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
