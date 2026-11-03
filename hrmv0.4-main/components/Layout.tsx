import React, { useState } from 'react';
import { Search, List, ChevronDown, Bell, User, Users, Store, Wrench, Tag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView = 'categories', onNavigate }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
          <div className="text-green-600 font-black text-2xl tracking-widest text-center flex items-center justify-center">
            DUMUC
          </div>
        </div>

        {/* Sidebar Search */}
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm tính năng, danh mục, báo cáo" 
              className="w-full bg-gray-100 border border-transparent rounded-md py-2 pl-3 pr-8 text-sm outline-none focus:bg-white focus:border-blue-500 transition-colors" 
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          <div 
            onClick={() => onNavigate?.('employee_list')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'employee_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'employee_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <Users className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Danh sách Nhân sự</span>
          </div>
          <div 
            onClick={() => onNavigate?.('labor_list')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'labor_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'labor_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Hồ sơ Hợp đồng</span>
          </div>
          <div 
            onClick={() => onNavigate?.('department_list')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'department_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'department_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Phòng ban / Bộ phận</span>
          </div>
          <div 
            onClick={() => onNavigate?.('position_list')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'position_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'position_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Chức vụ / Vị trí</span>
          </div>
          <div 
            onClick={() => onNavigate?.('salary_grade_list')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_grade_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'salary_grade_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Thang bảng Lương</span>
          </div>
          <div 
            onClick={() => onNavigate?.('contract_type_list')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'contract_type_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'contract_type_list' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Loại hợp đồng</span>
          </div>
          <div 
            onClick={() => onNavigate?.('salary_rule_group')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_rule_group' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'salary_rule_group' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Nhóm quy tắc Lương</span>
          </div>
          <div 
            onClick={() => onNavigate?.('salary_structure')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_structure' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'salary_structure' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Cấu trúc Lương</span>
          </div>
          <div 
            onClick={() => onNavigate?.('insurance_tax_params')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'insurance_tax_params' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'insurance_tax_params' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Tham số BHXH & Thuế</span>
          </div>
          <div 
            onClick={() => onNavigate?.('payroll_period')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'payroll_period' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'payroll_period' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Kỳ tính Lương</span>
          </div>
          <div 
            onClick={() => onNavigate?.('payroll_table')}
            className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'payroll_table' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {currentView === 'payroll_table' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <span className="text-[13px] font-medium">Bảng lương</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex-1 flex items-center">
            {currentView === 'repair_service' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Dịch vụ sửa chữa</h1>
            )}
            {currentView === 'employee_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Danh sách Nhân sự</h1>
            )}
            {currentView === 'labor_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Hồ sơ Hợp đồng</h1>
            )}
            {currentView === 'department_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Bộ phận</h1>
            )}
            {currentView === 'position_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Chức vụ/ Vị trí</h1>
            )}
            {currentView === 'salary_grade_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Cấu trúc Thang bảng lương</h1>
            )}
            {currentView === 'contract_type_list' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Quản lý loại hợp đồng</h1>
            )}
            {currentView === 'salary_rule_group' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Nhóm quy tắc Lương</h1>
            )}
            {currentView === 'salary_structure' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Cấu trúc Lương</h1>
            )}
            {currentView === 'insurance_tax_params' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Tham số BHXH & Thuế</h1>
            )}
            {currentView === 'payroll_period' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Kỳ tính lương</h1>
            )}
            {currentView === 'payroll_table' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Bảng lương</h1>
            )}
            
            {['employee_list', 'labor_list', 'department_list', 'position_list', 'salary_grade_list', 'contract_type_list', 'salary_rule_group', 'salary_structure', 'insurance_tax_params', 'payroll_period', 'payroll_table'].includes(currentView) ? (
              <div className="flex-1 flex justify-end gap-3 mr-6 items-center">
                <button className="bg-[#1A4B9F] text-white px-4 py-1.5 rounded-[4px] text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4 fill-white" />
                  Bán hàng
                </button>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Tra cứu phụ tùng" 
                    className="w-full border border-gray-300 rounded-full py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="relative w-[280px]">
                  <select className="w-full border border-gray-300 rounded-full py-1.5 pl-3 pr-8 text-sm outline-none appearance-none bg-white text-gray-700">
                    <option>[2026] - CTY TNHH SA...</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className={`relative w-[400px] ${currentView === 'repair_service' ? '' : 'mx-auto'}`}>
                <input 
                  type="text" 
                  placeholder="Tìm biển số xe" 
                  className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 transition-colors" 
                />
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <User className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">Chủ xưởng</div>
                <div className="text-xs text-gray-500">Chào buổi chiều</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};
