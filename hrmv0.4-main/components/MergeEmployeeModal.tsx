import React, { useState } from 'react';
import { X, AlertCircle, Calendar, Download, CheckCircle2, Award, FileText } from 'lucide-react';
import { MOCK_EMPLOYEES } from './EmployeeList';

interface MergeEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCccds: string[];
  onMergeComplete: () => void;
}

export const MergeEmployeeModal: React.FC<MergeEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedCccds, 
  onMergeComplete 
}) => {
  const [rootCccd, setRootCccd] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'documents'>('personal');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRootCccd('');
      setActiveTab('personal');
      setShowConfirm(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || selectedCccds.length !== 2) return null;

  const emp1 = MOCK_EMPLOYEES.find(e => e.cccd === selectedCccds[0]);
  const emp2 = MOCK_EMPLOYEES.find(e => e.cccd === selectedCccds[1]);

  if (!emp1 || !emp2) return null;

  const isProfile1Selected = rootCccd === emp1.cccd;
  const isProfile2Selected = rootCccd === emp2.cccd;

  const tickedProfileName = isProfile1Selected 
    ? 'Hồ sơ 1' 
    : isProfile2Selected 
      ? 'Hồ sơ 2' 
      : 'được tick';

  const untickedProfileName = isProfile1Selected 
    ? 'Hồ sơ 2' 
    : isProfile2Selected 
      ? 'Hồ sơ 1' 
      : 'không được tick';

  const handleMergeClick = () => {
    if (!rootCccd) return;
    setShowConfirm(true);
  };

  const handleConfirmMerge = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onMergeComplete();
  };

  const renderEmployeeProfileForm = (
    emp: typeof emp1, 
    profileTitle: string
  ) => {
    const isSelected = rootCccd === emp.cccd;

    return (
      <div 
        className={`flex-1 flex flex-col bg-white rounded-lg border transition-all duration-200 shadow-sm overflow-hidden ${
          isSelected 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Record Selection Header */}
        <div 
          onClick={() => setRootCccd(emp.cccd)}
          className={`px-5 py-3.5 border-b cursor-pointer transition-colors flex items-center justify-between ${
            isSelected 
              ? 'bg-blue-50/90 border-blue-200' 
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="rootProfile" 
              checked={isSelected}
              onChange={() => setRootCccd(emp.cccd)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px] text-gray-800">
                  {profileTitle}
                </span>
                {isSelected ? (
                  <span className="bg-blue-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> HỒ SƠ GỐC
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs italic">
                    (Nhấp chọn làm gốc)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Họ tên: <span className="text-gray-900 font-bold">{emp.name}</span> | CCCD: <span className="text-gray-900">{emp.cccd}</span>
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold">
            {isSelected ? (
              <span className="text-blue-700 bg-blue-100/80 px-2 py-1 rounded">Sẽ giữ lại</span>
            ) : (
              <span className="text-gray-400">Sẽ gộp & xóa</span>
            )}
          </div>
        </div>

        {/* Form Body - Identical layout to "Thêm" Modal */}
        <div className="flex-1 overflow-y-auto p-5 text-[13px] space-y-5 bg-[#F9FAFB]/50">
          
          {activeTab === 'personal' && (
            <>
              {/* Thông tin định danh */}
              <div className="bg-white p-5 rounded-md shadow-xs border border-gray-200">
                <h3 className="text-blue-600 font-semibold mb-4 text-[14px] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block"></span>
                  Thông tin định danh
                </h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1 text-xs">
                      Tên nhân sự <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={emp.name} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-900 font-medium" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Giới tính</label>
                    <input 
                      type="text" 
                      value={emp.gender} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Ngày sinh</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={emp.dob} 
                        readOnly 
                        className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Nơi sinh</label>
                    <input 
                      type="text" 
                      value={emp.address.includes('TP.HCM') ? 'TP. Hồ Chí Minh' : 'Hà Nội'} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Quốc tịch</label>
                    <input 
                      type="text" 
                      value={emp.nationality} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="bg-white p-5 rounded-md shadow-xs border border-gray-200">
                <h3 className="text-blue-600 font-semibold mb-4 text-[14px] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block"></span>
                  Thông tin liên hệ
                </h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">
                      Điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={emp.phone} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Email</label>
                    <input 
                      type="text" 
                      value={emp.email} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                    />
                  </div>
                </div>
              </div>

              {/* CCCD */}
              <div className="bg-white p-5 rounded-md shadow-xs border border-gray-200">
                <h3 className="text-blue-600 font-semibold mb-4 text-[14px] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block"></span>
                  CCCD
                </h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Số CCCD</label>
                    <input 
                      type="text" 
                      value={emp.cccd} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 font-bold text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Ngày cấp CCCD</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value="10/05/2021" 
                        readOnly 
                        className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Nơi cấp CCCD</label>
                    <input 
                      type="text" 
                      value="Cục Cảnh sát Quản lý hành chính về trật tự xã hội" 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Hộ khẩu thường trú</label>
                    <textarea 
                      rows={2} 
                      value={emp.address} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800 resize-none text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">Chỗ ở hiện nay</label>
                    <textarea 
                      rows={2} 
                      value={emp.address} 
                      readOnly 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800 resize-none text-[13px]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white p-5 rounded-md shadow-xs border border-gray-200">
              <h3 className="text-blue-600 font-semibold mb-4 text-[14px] flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Trình độ học vấn & Kỹ năng
              </h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Trình độ Học vấn cao nhất</label>
                  <input 
                    type="text" 
                    value="Đại học" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Năm tốt nghiệp</label>
                  <input 
                    type="text" 
                    value="2016" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Chuyên ngành đào tạo</label>
                  <input 
                    type="text" 
                    value="Kỹ thuật Cơ khí Ô tô" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Trường/Trung tâm đào tạo</label>
                  <input 
                    type="text" 
                    value="Đại học Bách Khoa TP.HCM" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Số năm kinh nghiệm</label>
                  <input 
                    type="text" 
                    value="5 năm" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Chứng chỉ hành nghề</label>
                  <input 
                    type="text" 
                    value="Chứng chỉ KTV Cấp 2" 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-xs">Kinh nghiệm trước đây</label>
                  <textarea 
                    rows={3} 
                    value={`Có kinh nghiệm 5 năm làm việc trong hệ thống dịch vụ kỹ thuật sửa chữa ô tô và cố vấn kỹ thuật.`} 
                    readOnly 
                    className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 text-gray-800 resize-none text-[13px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white p-5 rounded-md shadow-xs border border-gray-200">
              <h3 className="text-blue-600 font-semibold mb-4 text-[14px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Danh mục Văn bằng / Chứng chỉ / CV
              </h3>
              
              <div className="border border-blue-200 rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-[#EBF5FF]">
                    <tr>
                      <th className="p-2.5 border-r border-b border-blue-200 w-10 text-center text-gray-700 font-medium">#</th>
                      <th className="p-2.5 border-r border-b border-blue-200 text-gray-700 font-medium w-[110px]">Loại</th>
                      <th className="p-2.5 border-r border-b border-blue-200 text-gray-700 font-medium">Mô tả loại</th>
                      <th className="p-2.5 border-r border-b border-blue-200 text-gray-700 font-medium">Trường/Trung tâm</th>
                      <th className="p-2.5 border-r border-b border-blue-200 text-gray-700 font-medium w-[90px]">Ngày cấp</th>
                      <th className="p-2.5 border-b border-blue-200 text-center w-12">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dashed border-gray-200 hover:bg-gray-50">
                      <td className="p-2.5 border-r border-dashed border-gray-200 text-center">1</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200 font-medium text-blue-700">Văn bằng</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">Bằng Kỹ sư Cơ khí</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">ĐH Bách Khoa</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">15/06/2016</td>
                      <td className="p-2.5 text-center">
                        <button className="text-blue-600 hover:text-blue-800" title="Tải về">
                          <Download className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-dashed border-gray-200 hover:bg-gray-50">
                      <td className="p-2.5 border-r border-dashed border-gray-200 text-center">2</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200 font-medium text-blue-700">Chứng chỉ</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">Chẩn đoán hệ thống điện ô tô</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">Trung tâm Kỹ thuật</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">20/12/2020</td>
                      <td className="p-2.5 text-center">
                        <button className="text-blue-600 hover:text-blue-800" title="Tải về">
                          <Download className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2.5 border-r border-dashed border-gray-200 text-center">3</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200 font-medium text-blue-700">CCCD</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">Bản sao CCCD gắn chip</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">Cục CS QLHC</td>
                      <td className="p-2.5 border-r border-dashed border-gray-200">10/05/2021</td>
                      <td className="p-2.5 text-center">
                        <button className="text-blue-600 hover:text-blue-800" title="Tải về">
                          <Download className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <>
      {/* Full-screen Merge Container */}
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F4F6F8] animate-fadeIn overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-gray-800">Gộp Hồ sơ Nhân sự</h2>
            <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
              Chế độ so sánh 2 hồ sơ
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guidance Alert Banner */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-start justify-between shrink-0">
          <div className="flex items-start gap-3 text-[13px] text-gray-800">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-blue-900">
                Vui lòng chọn hồ sơ 1 hoặc hồ sơ 2 làm gốc.
              </p>
              <p className="text-gray-700">
                {rootCccd ? (
                  <>
                    <strong className="text-blue-700">{tickedProfileName}</strong>: sẽ được giữ lại toàn bộ dữ liệu.
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-600">Hồ sơ &#123;được tick&#125;</span>: sẽ được giữ lại toàn bộ dữ liệu.
                  </>
                )}
              </p>
              <p className="text-gray-700">
                {rootCccd ? (
                  <>
                    <strong className="text-red-600">{untickedProfileName}</strong>: sẽ xóa. Trước khi xóa: Danh mục Tài liệu trong <strong className="text-red-600">{untickedProfileName}</strong> : sẽ được hệ thống tự động sao chép qua <strong className="text-blue-700">{tickedProfileName}</strong>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-600">Hồ sơ &#123;không được tick&#125;</span>: sẽ xóa. Trước khi xóa: Danh mục Tài liệu trong <span className="font-medium text-gray-600">Hồ sơ &#123;không được tick&#125;</span> : sẽ được hệ thống tự động sao chép qua <span className="font-medium text-gray-600">Hồ sơ &#123;được tick&#125;</span>
                  </>
                )}
              </p>
            </div>
          </div>
          {rootCccd ? (
            <span className="text-xs bg-green-100 text-green-700 border border-green-300 font-semibold px-2.5 py-1 rounded-full shrink-0">
              Đã chọn: {tickedProfileName} ({MOCK_EMPLOYEES.find(e => e.cccd === rootCccd)?.name})
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-2.5 py-1 rounded-full shrink-0 animate-pulse">
              Chưa chọn hồ sơ gốc
            </span>
          )}
        </div>

        {/* Shared Tabs Navigation */}
        <div className="flex items-center justify-between px-6 pt-2 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-t-md border-b-2 transition-colors ${
                activeTab === 'personal' 
                  ? 'text-gray-900 bg-[#FFF3C4] border-transparent shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-t-md border-b-2 transition-colors ${
                activeTab === 'skills' 
                  ? 'text-gray-900 bg-[#FFF3C4] border-transparent shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
              }`}
            >
              Trình độ & Kỹ năng
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-t-md border-b-2 transition-colors ${
                activeTab === 'documents' 
                  ? 'text-gray-900 bg-[#FFF3C4] border-transparent shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
              }`}
            >
              Danh mục Tài liệu
            </button>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            So sánh song song 2 bên: <span className="font-semibold text-gray-700">Hồ sơ 1</span> và <span className="font-semibold text-gray-700">Hồ sơ 2</span>
          </div>
        </div>

        {/* Main Content: 2 Columns Side-by-Side (Full Width) */}
        <div className="flex-1 p-4 overflow-hidden flex gap-4 min-h-0">
          {/* Left Column: Hồ sơ 1 */}
          {renderEmployeeProfileForm(emp1, 'Hồ sơ 1')}

          {/* Right Column: Hồ sơ 2 */}
          {renderEmployeeProfileForm(emp2, 'Hồ sơ 2')}
        </div>

        {/* Bottom Actions Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white shrink-0 shadow-lg">
          <div className="text-xs text-gray-500">
            {rootCccd ? (
              <span>
                Hồ sơ sẽ giữ lại: <strong>{MOCK_EMPLOYEES.find(e => e.cccd === rootCccd)?.name}</strong> ({rootCccd})
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                * Vui lòng chọn 1 trong 2 hồ sơ ở trên làm hồ sơ gốc để tiếp tục.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="px-5 py-2 border border-gray-300 bg-white rounded text-gray-700 font-medium hover:bg-gray-100 transition-colors text-[13px]"
            >
              Đóng
            </button>
            <button 
              onClick={handleMergeClick}
              disabled={!rootCccd}
              className={`px-5 py-2 text-white rounded font-medium transition-colors text-[13px] flex items-center gap-2 ${
                !rootCccd 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Xác nhận gộp
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl w-[440px] p-6 animate-fadeIn">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận gộp hồ sơ</h3>
                <p className="text-gray-500 text-xs mt-0.5">Thao tác này sẽ cập nhật dữ liệu nhân sự</p>
              </div>
            </div>
            <p className="text-gray-600 text-[13px] mb-6 leading-relaxed bg-gray-50 p-3 rounded border border-gray-200">
              Hồ sơ được chọn (<strong className="text-blue-700">{MOCK_EMPLOYEES.find(e => e.cccd === rootCccd)?.name}</strong>) sẽ được giữ lại làm gốc. Hồ sơ còn lại sẽ được gộp vào và sau đó sẽ bị xóa. Bạn có chắc chắn muốn thực hiện?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[13px]"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmMerge}
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors text-[13px]"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl w-[400px] p-6 animate-fadeIn text-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Đã gộp thành công</h3>
            <p className="text-gray-600 text-[13px] mb-6">
              Hai hồ sơ nhân sự đã được gộp thành công vào hồ sơ gốc <strong>{MOCK_EMPLOYEES.find(e => e.cccd === rootCccd)?.name}</strong>.
            </p>
            <button 
              onClick={handleSuccessClose}
              className="px-5 py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors text-[13px] w-full shadow-sm"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </>
  );
};
