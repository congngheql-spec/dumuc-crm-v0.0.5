import React, { useState } from 'react';
import { ChevronDown, Trash2, Printer, Plus, HelpCircle, Paperclip, Calendar } from 'lucide-react';

export const QuoteTab: React.FC = () => {
  const [rows, setRows] = useState([
    { id: 1, code: 'NHOT003', name: 'Nhớt Mobil 20W-50', desc: 'Nhớt Mobil 20W-50', unit: 'Lít', qty: 7.5, stock: 47.6, price: 170000, total: 1275000, discountPercent: '', discountAmount: 0 },
    { id: 2, code: 'DV_NHANCONG', name: 'Công thợ', desc: 'Công thợ bảo dưỡng', unit: 'Công', qty: 1, stock: 0, price: 150000, total: 150000, discountPercent: '', discountAmount: 0 },
    { id: 3, code: 'NUOCLM004', name: 'Nước làm mát động cơ màu đỏ LLC 20% 4L RED JCAP', desc: 'Nước làm mát động cơ màu đỏ LLC 20% 4L RED JCAP', unit: 'Lít', qty: 1, stock: 21, price: 110000, total: 110000, discountPercent: '', discountAmount: 0 },
    { id: 4, code: 'LOCNHOT', name: 'Lọc nhớt', desc: 'Lọc nhớt', unit: 'Cái', qty: 1, stock: 0, price: 150000, total: 150000, discountPercent: '', discountAmount: 0 },
  ]);

  const totalQty = rows.reduce((sum, row) => sum + row.qty, 0);
  const totalAmount = rows.reduce((sum, row) => sum + row.total, 0);
  const totalDiscount = rows.reduce((sum, row) => sum + row.discountAmount, 0);
  const totalTax = 0;
  const finalTotal = totalAmount - totalDiscount + totalTax;

  const [activeBottomTab, setActiveBottomTab] = useState('Hình ảnh');

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Form */}
      <div className="bg-white border border-gray-200 rounded-md p-4 grid grid-cols-12 gap-4">
        <div className="col-span-9 grid grid-cols-5 gap-4">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số RO</label>
            <input type="text" placeholder="RO-..." className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 bg-gray-50" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xe</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                <option value="">Biển số xe</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hiệu xe (nhãn xe)</label>
            <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 bg-gray-50" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe (Số loại)</label>
            <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 bg-gray-50" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số KM hiện tại</label>
            <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500" />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận xe</label>
            <div className="relative">
              <input type="text" defaultValue="12/03/2026 16:01" className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500" />
              <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giao xe ước tính</label>
            <div className="relative">
              <input type="text" placeholder="DD/MM/YYYY hh:mm" className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500" />
              <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị bảo hiểm</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu của khách hàng</label>
          <textarea 
            placeholder="Nhập yêu cầu của khách..." 
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 h-[104px] resize-none"
          ></textarea>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-md flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center border-r border-gray-200">#</th>
                <th className="px-4 py-3 w-48 border-r border-gray-200">Vật tư <span className="text-red-500">*</span></th>
                <th className="px-4 py-3 w-64 border-r border-gray-200">Tên vật tư</th>
                <th className="px-4 py-3 w-64 border-r border-gray-200">Diễn giải <span className="text-red-500">*</span></th>
                <th className="px-4 py-3 w-24 border-r border-gray-200">ĐVT <span className="text-red-500">*</span></th>
                <th className="px-4 py-3 w-24 border-r border-gray-200 text-right">Số lượng</th>
                <th className="px-4 py-3 w-24 border-r border-gray-200 text-right">Tồn kho</th>
                <th className="px-4 py-3 w-32 border-r border-gray-200 text-right">Đơn giá</th>
                <th className="px-4 py-3 w-32 border-r border-gray-200 text-right">Thành tiền</th>
                <th className="px-4 py-3 w-32 border-r border-gray-200 text-center">Gia công</th>
                <th className="px-4 py-3 w-20 border-r border-gray-200 text-right">% CK</th>
                <th className="px-4 py-3 w-32 text-right">Tiền CK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center border-r border-gray-200 text-gray-500">
                    {index === rows.length - 1 ? (
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="relative">
                      <select className="w-full bg-transparent outline-none appearance-none pr-6 text-gray-700">
                        <option>{row.code}</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-700">{row.name}</td>
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-700">{row.desc}</td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="relative">
                      <select className="w-full bg-transparent outline-none appearance-none pr-6 text-gray-700">
                        <option>{row.unit}</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-700">{row.qty}</td>
                  <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-700">{row.stock}</td>
                  <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-700">{row.price.toLocaleString()}</td>
                  <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-700">{row.total.toLocaleString()}</td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors text-xs">Tạo đề xuất nhanh</button>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-700">{row.discountPercent}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.discountAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <button className="text-sm hover:text-gray-900 transition-colors">Thêm dòng (F2)</button>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          
          <div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Paperclip className="w-4 h-4" />
              Tải file lên
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Giảm giá khác (nếu có):</span>
            <input type="text" placeholder="Nhập số tiền giảm" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500 w-48" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm">
            <div>Tổng SL <span className="font-bold text-gray-900 ml-1">{totalQty}</span></div>
            <div>Tổng thành tiền <span className="font-bold text-gray-900 ml-1">{totalAmount.toLocaleString()}</span></div>
            <div>Tổng CK <span className="font-bold text-gray-900 ml-1">{totalDiscount}</span></div>
            <div>Tổng thuế <span className="font-bold text-gray-900 ml-1">{totalTax}</span></div>
            <div>Tổng thanh toán <span className="font-bold text-gray-900 ml-1">{finalTotal.toLocaleString()}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <Printer className="w-4 h-4" />
              In
            </button>
            <div className="flex">
              <button className="px-4 py-2 border border-blue-300 rounded-l bg-white text-blue-600 hover:bg-blue-50 transition-colors text-sm">
                Tạo đề xuất
              </button>
              <button className="px-2 py-2 border border-l-0 border-blue-300 rounded-r bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bg-white border border-gray-200 rounded-md flex flex-col min-h-[150px]">
        <div className="flex border-b border-gray-200 px-4">
          {['Hình ảnh', 'Tài liệu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveBottomTab(tab)}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeBottomTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4 flex-1">
          {activeBottomTab === 'Hình ảnh' && (
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-4">Tiếp nhận</h4>
              <button className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )}
          {activeBottomTab === 'Tài liệu' && (
            <div className="text-gray-500 text-sm">Chưa có tài liệu</div>
          )}
        </div>
      </div>
    </div>
  );
};
