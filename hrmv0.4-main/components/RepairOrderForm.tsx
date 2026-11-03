import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { InspectionTab } from './InspectionTab';
import { QuoteTab } from './QuoteTab';

interface RepairOrderFormProps {
  onClose: () => void;
}

const STAGES = [
  'Tiếp nhận',
  'Chẩn đoán',
  'Báo giá',
  'Yêu cầu vật tư',
  'Lệnh sửa chữa',
  'Nghiệm thu',
  'Quyết toán',
  'Bàn giao'
];

export const RepairOrderForm: React.FC<RepairOrderFormProps> = ({ onClose }) => {
  const [activeStage, setActiveStage] = useState('Tiếp nhận');
  const [activeTab, setActiveTab] = useState('Kiểm tra');
  const [triggerValidation, setTriggerValidation] = useState(false);

  const handleSave = () => {
    if (activeTab === 'Kiểm tra') {
      setTriggerValidation(true);
      // Reset trigger after a short delay so it can be triggered again
      setTimeout(() => setTriggerValidation(false), 100);
    } else {
      // Handle save for other tabs
      console.log('Saving...');
    }
  };

  const handleValidationComplete = (isValid: boolean) => {
    if (isValid) {
      console.log('Form is valid, saving...');
      // Proceed with save
      onClose();
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7FA] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-800">Dịch vụ sửa chữa</h1>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
              <span>Kiểm tra</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
              <span>Bảo hiểm</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
              <span>Sửa chữa lưu động</span>
            </label>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stages Pipeline */}
      <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-6 shrink-0 overflow-x-auto">
        {STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className={`flex items-center gap-2 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeStage === stage 
                ? 'border-blue-600 text-blue-600 font-medium' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {stage}
            <CheckCircle2 className={`w-4 h-4 ${activeStage === stage ? 'text-blue-600' : 'text-gray-400'}`} />
          </button>
        ))}
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeStage === 'Báo giá' ? (
          <QuoteTab />
        ) : (
          <>
            <div className="flex gap-4 items-start">
              {/* Left Column */}
              <div className="w-[300px] flex flex-col gap-4 shrink-0">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số RO</label>
                <input 
                  type="text" 
                  placeholder="Tạo tự động" 
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận xe</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="12/03/2026 16:01"
                      className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500"
                    />
                    <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giao xe ước tính</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="DD/MM/YYYY hh:mm"
                      className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500"
                    />
                    <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm dịch vụ <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                    <option value="">Chọn nhóm dịch vụ</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Vehicle Info) */}
          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full border-2 border-gray-800 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                    <option value="">Chọn xe</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiệu xe (nhãn hiệu)</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe (số loại)</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số khung</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số máy</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu xe</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dung tích</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
                <input type="text" placeholder="Tự động điền" disabled className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số KM hiện tại</label>
                <input type="text" placeholder="Nhập số KM hiện tại" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          {/* Bottom Left Column */}
          <div className="flex-[2] bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                    <option value="">Chọn khách hàng</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                    <option value="">Chọn tài xế</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị bảo hiểm</label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-500">
                    <option value="">Chọn đơn vị bảo hiểm</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn đăng kiểm</label>
                <div className="relative">
                  <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500" />
                  <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn BHTN</label>
                <div className="relative">
                  <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500" />
                  <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn BHVC</label>
                <div className="relative">
                  <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500" />
                  <Calendar className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea 
                placeholder="Nhập ghi chú" 
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 min-h-[80px] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Bottom Right Column */}
          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col h-[270px]">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cố vấn</label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 appearance-none text-gray-800">
                  <option value="LÊ XUÂN NGUYÊN">LÊ XUÂN NGUYÊN</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu của khách hàng</label>
              <textarea 
                placeholder="Nhập yêu cầu của khách hàng" 
                className="w-full flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-h-[200px] flex flex-col">
          <div className="flex border-b border-gray-200 px-4">
            {['Hình ảnh', 'Tài liệu', 'Kiểm tra'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 p-4 bg-gray-50/50">
            {activeTab === 'Kiểm tra' && (
              <InspectionTab 
                triggerValidation={triggerValidation} 
                onValidationComplete={handleValidationComplete} 
              />
            )}
            {activeTab === 'Hình ảnh' && <div className="text-gray-500 text-center py-8">Nội dung Hình ảnh</div>}
            {activeTab === 'Tài liệu' && <div className="text-gray-500 text-center py-8">Nội dung Tài liệu</div>}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-3 shrink-0">
        <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          Đóng
        </button>
        {activeStage === 'Báo giá' ? (
          <>
            <button className="px-6 py-2 text-sm font-medium text-white bg-gray-300 rounded-md cursor-not-allowed">
              Ghi sổ
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white bg-gray-300 rounded-md cursor-not-allowed">
              Ghi sổ & Đóng
            </button>
          </>
        ) : (
          <>
            <button className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Nhập lại
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors">
              Lưu nháp
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
              Ghi sổ
            </button>
          </>
        )}
      </div>
    </div>
  );
};
