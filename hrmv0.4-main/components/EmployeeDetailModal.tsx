import React, { useState } from 'react';
import { X, Calendar, HelpCircle, Download, AlertTriangle, Plus, Trash2, Clock, ShieldCheck, Info } from 'lucide-react';
import { MOCK_EMPLOYEES } from './EmployeeList';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CertificateRow {
  id: string;
  type: string;
  description: string;
  institution: string;
  issueDate: string;
  expirationDate: string;
  link: string;
  file: string;
}

export interface SkillQualificationRow {
  id: string;
  highestEducation: string;
  graduationYear: string;
  major: string;
  institution: string;
  experienceYears: string;
  previousExperience: string;
  createdAt: string;
  createdBy: string;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'salary'>('personal');
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);

  const DEFAULT_CREATOR = 'Admin (Hệ thống)';

  const getSystemTimestamp = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  const [skillRows, setSkillRows] = useState<SkillQualificationRow[]>([
    {
      id: '1',
      highestEducation: 'Đại học',
      graduationYear: '2019',
      major: 'Kỹ thuật Cơ khí Động lực',
      institution: 'Đại học Bách Khoa TP.HCM',
      experienceYears: '5',
      previousExperience: 'Kỹ thuật viên trưởng tại Garage Tân Phát (2019 - 2024)',
      createdAt: '20/09/2026 09:30',
      createdBy: DEFAULT_CREATOR,
    }
  ]);
  
  const [cccd, setCccd] = useState('');
  const [cccdError, setCccdError] = useState<{isError: boolean, message: string}>({isError: false, message: ''});

  React.useEffect(() => {
    if (isOpen) {
      setCccd('');
      setCccdError({isError: false, message: ''});
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'F2') {
        e.preventDefault();
        if (activeTab === 'skills') {
          addSkillRow();
        } else if (activeTab === 'salary') {
          addCertificateRow();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, onClose]);

  const handleCccdChange = (value: string) => {
    setCccd(value);
    if (!value) {
      setCccdError({isError: false, message: ''});
      return;
    }
    const duplicate = MOCK_EMPLOYEES.find(emp => emp.cccd === value);
    if (duplicate) {
      setCccdError({
        isError: true,
        message: `Số CCCD bị trùng với nhân sự: ${duplicate.name}`
      });
    } else {
      setCccdError({isError: false, message: ''});
    }
  };

  const addCertificateRow = () => {
    setCertificates(prev => [...prev, {
      id: Date.now().toString(),
      type: '',
      description: '',
      institution: '',
      issueDate: '',
      expirationDate: '',
      link: '',
      file: ''
    }]);
  };

  const updateCertificateRow = (id: string, field: keyof CertificateRow, value: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addSkillRow = () => {
    setSkillRows(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        highestEducation: '',
        graduationYear: '',
        major: '',
        institution: '',
        experienceYears: '',
        previousExperience: '',
        createdAt: getSystemTimestamp(),
        createdBy: DEFAULT_CREATOR,
      }
    ]);
  };

  const updateSkillRow = (id: string, field: keyof SkillQualificationRow, value: string) => {
    setSkillRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const deleteSkillRow = (id: string) => {
    setSkillRows(prev => prev.filter(row => row.id !== id));
  };

  const handleDownloadFile = (cert: CertificateRow) => {
    if (!cert.file) return;
    const blob = new Blob([`Tài liệu: ${cert.file}\nLoại: ${cert.type}\nMô tả: ${cert.description}\nĐơn vị cấp: ${cert.institution}\nNgày cấp: ${cert.issueDate}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cert.file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F8FAFC] overflow-hidden animate-fadeIn">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-8 py-3.5 border-b border-gray-200 bg-white shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-bold text-gray-800">Thêm mới / Chi tiết nhân sự</h2>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
            Toàn màn hình
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          title="Đóng (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-8 pt-3 bg-white border-b border-gray-200 shrink-0">
        <button 
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'personal' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Thông tin cá nhân
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'skills' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Trình độ & Kỹ năng
        </button>
        <button 
          onClick={() => setActiveTab('salary')}
          className={`px-4 py-2 text-[14px] font-medium rounded-t-md border-b-2 ${activeTab === 'salary' ? 'text-gray-900 bg-[#FFF3C4] border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent transition-colors'}`}
        >
          Danh mục Tài liệu
        </button>
      </div>

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto p-8 text-[14px]">
          
          {activeTab === 'personal' && (
            <>
              <div className="flex gap-6 items-start">
                
                {/* Column 1: Identity Info */}
                <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <h3 className="text-blue-600 font-medium mb-6">Thông tin định danh</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Tên nhân sự <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Nhập tên nhân sự" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Giới tính</label>
                      <select defaultValue="" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white appearance-none">
                        <option value="" disabled className="text-gray-400">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Ngày sinh</label>
                      <div className="relative">
                        <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Nơi sinh</label>
                      <input type="text" placeholder="Nhập nơi sinh" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Quốc tịch</label>
                      <input type="text" placeholder="Nhập quốc tịch" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Column 2: Contact Info */}
                <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <h3 className="text-blue-600 font-medium mb-6">Thông tin liên hệ</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Điện thoại <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Nhập số điện thoại" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1.5">Email</label>
                      <input type="text" placeholder="Nhập email" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Section: CCCD */}
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mt-6">
                <h3 className="text-blue-600 font-medium mb-6">CCCD</h3>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Số CCCD</label>
                    <input 
                      type="text" 
                      placeholder="Nhập số CCCD" 
                      className={`w-full border ${cccdError.isError ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded px-3 py-2 outline-none transition-colors`} 
                      value={cccd}
                      onChange={(e) => handleCccdChange(e.target.value)}
                    />
                    {cccdError.isError && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-[13px]">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{cccdError.message}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Ngày cấp CCCD</label>
                    <div className="relative">
                      <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Nơi cấp CCCD</label>
                    <input type="text" placeholder="Nhập nơi cấp CCCD" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                  <div></div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Hộ khẩu thường trú</label>
                    <textarea rows={3} placeholder="Nhập địa chỉ" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Chỗ ở hiện nay</label>
                    <textarea rows={3} placeholder="Nhập địa chỉ" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 'salary' && (
            <div className="flex-1 overflow-y-auto p-6 bg-[#F4F6F8]">
              {/* Danh mục Văn bằng / Chứng chỉ / CV */}
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-blue-600 font-medium mb-6 text-[15px]">Danh mục Văn bằng / Chứng chỉ / CV</h3>
                
                <div className="border border-blue-200 rounded-md overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#EBF5FF]">
                      <tr>
                        <th className="p-3 border-r border-b border-blue-200 w-12 text-center text-gray-700 font-medium text-[13px]">#</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[140px]">Loại</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[150px]">Mô tả loại</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[200px]">Trường/ Trung tâm đào tạo</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">Ngày cấp</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[160px]">Ngày hết hạn (nếu có)</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">Link</th>
                        <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[120px]">File tải lên</th>
                        <th className="p-3 border-b border-blue-200 bg-[#EBF5FF] text-[13px] w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert, index) => (
                        <tr key={cert.id} className="border-b border-dashed border-gray-200 hover:bg-gray-50/50">
                          <td className="p-3 border-r border-dashed border-gray-200 text-center text-[13px]">{index + 1}</td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <select 
                              value={cert.type}
                              onChange={(e) => updateCertificateRow(cert.id, 'type', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 bg-white text-[13px]"
                            >
                              <option value="">Chọn loại</option>
                              <option value="Văn bằng">Văn bằng</option>
                              <option value="Chứng chỉ">Chứng chỉ</option>
                              <option value="CV">CV</option>
                              <option value="Giấy khám sức khỏe">Giấy khám sức khỏe</option>
                              <option value="CCCD">CCCD</option>
                              <option value="GPLX">GPLX</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <input 
                              type="text" 
                              value={cert.description}
                              onChange={(e) => updateCertificateRow(cert.id, 'description', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                              placeholder="Mô tả" 
                            />
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <input 
                              type="text" 
                              value={cert.institution}
                              onChange={(e) => updateCertificateRow(cert.id, 'institution', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                              placeholder="Trường/Trung tâm" 
                            />
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <input 
                              type="text" 
                              value={cert.issueDate}
                              onChange={(e) => updateCertificateRow(cert.id, 'issueDate', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                              placeholder="DD/MM/YYYY" 
                            />
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <input 
                              type="text" 
                              value={cert.expirationDate}
                              onChange={(e) => updateCertificateRow(cert.id, 'expirationDate', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                              placeholder="DD/MM/YYYY" 
                            />
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <input 
                              type="text" 
                              value={cert.link}
                              onChange={(e) => updateCertificateRow(cert.id, 'link', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-[13px]" 
                              placeholder="Link" 
                            />
                          </td>
                          <td className="p-2 border-r border-dashed border-gray-200">
                            <label className="text-blue-600 hover:text-blue-700 text-[13px] font-medium w-full text-left cursor-pointer block truncate" title={cert.file || "Chọn file..."}>
                              {cert.file ? cert.file : 'Chọn file...'}
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateCertificateRow(cert.id, 'file', file.name);
                                  }
                                }} 
                              />
                            </label>
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                title="Tải về"
                                onClick={() => handleDownloadFile(cert)}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setCertificates(certificates.filter(c => c.id !== cert.id))}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Xóa"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="p-3 border-r border-b border-dashed border-gray-200"></td>
                        <td colSpan={8} className="p-3 border-b border-dashed border-gray-200 text-gray-500 italic bg-white text-[13px] cursor-pointer hover:bg-gray-50" onClick={addCertificateRow}>
                          Bấm vào đây để thêm dòng mới
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 flex items-center gap-1.5 bg-white text-gray-700 font-medium text-[13px] cursor-pointer hover:text-blue-600" onClick={addCertificateRow}>
                    Thêm dòng (F2) 
                    <div className="w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">?</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'skills' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-blue-600 font-medium text-[15px] flex items-center gap-2">
                      Danh sách Trình độ học vấn & Kỹ năng
                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                        {skillRows.length} dòng
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>
                        Hệ thống tự động ghi nhận <strong className="text-gray-700">Ngày tạo</strong> và <strong className="text-gray-700">Người tạo</strong> cho từng dòng khi được thêm vào bảng.
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSkillRow}
                    className="bg-[#1A4B9F] text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm dòng
                  </button>
                </div>

                <div className="border border-blue-200 rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1250px]">
                      <thead className="bg-[#EBF5FF]">
                        <tr>
                          <th className="p-3 border-r border-b border-blue-200 w-12 text-center text-gray-700 font-medium text-[13px] whitespace-nowrap">STT</th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[200px] whitespace-nowrap">
                            Trình độ Học vấn cao nhất
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[130px] whitespace-nowrap">
                            Năm tốt nghiệp
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[190px] whitespace-nowrap">
                            Chuyên ngành đào tạo
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[220px] whitespace-nowrap">
                            Trường / Trung tâm đào tạo
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[140px] whitespace-nowrap">
                            Số năm kinh nghiệm
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] min-w-[250px] whitespace-nowrap">
                            Kinh nghiệm trước đây
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[160px] whitespace-nowrap bg-blue-50/70">
                            <div className="flex items-center gap-1">
                              <span>Ngày tạo</span>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-normal leading-none">(Tự động)</span>
                            </div>
                          </th>
                          <th className="p-3 border-r border-b border-blue-200 text-gray-700 font-medium text-[13px] w-[170px] whitespace-nowrap bg-blue-50/70">
                            <div className="flex items-center gap-1">
                              <span>Người tạo</span>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-normal leading-none">(Tự động)</span>
                            </div>
                          </th>
                          <th className="p-3 border-b border-blue-200 w-16 text-center text-gray-700 font-medium text-[13px] whitespace-nowrap">
                            Xóa
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillRows.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-8 text-center text-gray-500 text-[13px]">
                              Chưa có dữ liệu trình độ & kỹ năng. Nhấn nút <strong className="text-blue-600">"Thêm dòng"</strong> để bắt đầu.
                            </td>
                          </tr>
                        ) : (
                          skillRows.map((row, index) => (
                            <tr key={row.id} className="border-b border-dashed border-gray-200 hover:bg-gray-50/70 transition-colors">
                              <td className="p-3 border-r border-dashed border-gray-200 text-center text-[13px] font-semibold text-gray-600 bg-gray-50/30">
                                {index + 1}
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <select
                                  value={row.highestEducation}
                                  onChange={(e) => updateSkillRow(row.id, 'highestEducation', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white text-[13px] cursor-pointer hover:border-gray-400"
                                >
                                  <option value="">-- Chọn trình độ --</option>
                                  <option value="Sau Đại học">Sau Đại học (Thạc sĩ, Tiến sĩ)</option>
                                  <option value="Đại học">Đại học</option>
                                  <option value="Cao đẳng">Cao đẳng</option>
                                  <option value="Trung cấp">Trung cấp</option>
                                  <option value="THPT">THPT (12/12)</option>
                                  <option value="THCS">THCS</option>
                                  <option value="Sơ cấp nghề / Chứng chỉ nghề">Sơ cấp nghề / Chứng chỉ nghề</option>
                                  <option value="Khác">Khác</option>
                                </select>
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.graduationYear}
                                  onChange={(e) => updateSkillRow(row.id, 'graduationYear', e.target.value)}
                                  placeholder="YYYY"
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-[13px] text-center"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.major}
                                  onChange={(e) => updateSkillRow(row.id, 'major', e.target.value)}
                                  placeholder="Nhập chuyên ngành..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px]"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.institution}
                                  onChange={(e) => updateSkillRow(row.id, 'institution', e.target.value)}
                                  placeholder="Tên trường / trung tâm đào tạo..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px]"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <input
                                  type="text"
                                  value={row.experienceYears}
                                  onChange={(e) => updateSkillRow(row.id, 'experienceYears', e.target.value)}
                                  placeholder="VD: 3 hoặc 5 năm"
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-[13px] text-center"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200">
                                <textarea
                                  rows={1}
                                  value={row.previousExperience}
                                  onChange={(e) => updateSkillRow(row.id, 'previousExperience', e.target.value)}
                                  placeholder="Mô tả công việc, vị trí hoặc nơi làm việc trước đây..."
                                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-[13px] resize-y min-h-[34px] leading-snug"
                                />
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200 bg-gray-50/40">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 text-[12px] select-none font-mono" title="Ngày tạo được hệ thống tự động ghi nhận">
                                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>{row.createdAt}</span>
                                </div>
                              </td>
                              <td className="p-2 border-r border-dashed border-gray-200 bg-gray-50/40">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/60 border border-blue-200/80 rounded text-blue-900 text-[12px] select-none font-medium truncate" title="Người tạo được hệ thống tự động ghi nhận">
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{row.createdBy}</span>
                                </div>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => deleteSkillRow(row.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Xóa dòng này"
                                >
                                  <Trash2 className="w-4 h-4 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}

                        <tr>
                          <td className="p-3 border-r border-b border-dashed border-gray-200 text-center text-blue-500">
                            <Plus className="w-3.5 h-3.5 mx-auto" />
                          </td>
                          <td
                            colSpan={9}
                            className="p-3 border-b border-dashed border-gray-200 text-blue-600 italic bg-white text-[13px] cursor-pointer hover:bg-blue-50/50 hover:text-blue-800 transition-colors select-none font-medium"
                            onClick={addSkillRow}
                          >
                            + Bấm vào đây để thêm dòng mới
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-white border-t border-blue-100">
                    <button
                      type="button"
                      onClick={addSkillRow}
                      className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Thêm dòng (F2)
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      <span>Hệ thống tự động ghi nhận <strong className="text-gray-700">Ngày tạo</strong> và <strong className="text-gray-700">Người tạo</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-3.5 border-t border-gray-200 bg-white shrink-0 shadow-xs">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[14px]">
            Đóng
          </button>
          <button 
            onClick={onClose} 
            disabled={cccdError.isError}
            className={`px-5 py-2 text-white rounded font-medium transition-colors text-[14px] ${cccdError.isError ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700 shadow-xs'}`}
          >
            Ghi nhận
          </button>
        </div>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideUp {
            animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
