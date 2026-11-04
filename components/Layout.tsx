import React, { useState } from 'react';
import { Search, List, ChevronDown, Bell, User, Users, Store, Wrench, Tag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView = 'categories', onNavigate }) => {
  const crmViews = [
    'potential_customers',
    'customer_bookings',
    'customers',
    'discount_management'
  ];
  const isCrmActive = crmViews.includes(currentView);
  const [isCrmOpen, setIsCrmOpen] = useState(true);

  const hrmViews = [
    'employee_list',
    'labor_list',
    'department_list',
    'position_list',
    'salary_grade_list',
    'contract_type_list',
    'salary_rule_group',
    'salary_structure',
    'insurance_tax_params',
    'payroll_period',
    'payroll_table'
  ];
  const isHrmActive = hrmViews.includes(currentView);
  const [isHrmOpen, setIsHrmOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200">
          <div className="text-[#14A64A] font-bold text-2xl italic tracking-tighter flex items-center">
            DU MỤC
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
            onClick={() => onNavigate?.('repair_service')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'repair_service' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'repair_service' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <Wrench className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Dịch vụ sửa chữa</span>
          </div>
          <div 
            onClick={() => onNavigate?.('commercial_sales')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'commercial_sales' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'commercial_sales' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Bán hàng thương mại</span>
          </div>
          <div 
            onClick={() => onNavigate?.('categories')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'categories' || currentView === 'spare_parts' || currentView === 'omnichannel' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {(currentView === 'categories' || currentView === 'spare_parts' || currentView === 'omnichannel') && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <List className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Danh mục</span>
          </div>
          <div 
            onClick={() => onNavigate?.('marketplace')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'marketplace' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'marketplace' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <Store className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Quản lý sàn</span>
          </div>
          <div 
            onClick={() => onNavigate?.('online_ordering')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'online_ordering' || currentView === 'supplier_homepage' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {(currentView === 'online_ordering' || currentView === 'supplier_homepage') && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">Đặt hàng online</span>
          </div>
          <div 
            onClick={() => onNavigate?.('purchase_orders')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'purchase_orders' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'purchase_orders' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm font-medium">Đơn đặt hàng</span>
          </div>
          <div 
            onClick={() => onNavigate?.('events')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'events' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'events' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Sự kiện</span>
          </div>
          <div 
            onClick={() => onNavigate?.('registration_approval')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'registration_approval' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'registration_approval' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Xét duyệt Đăng ký sàn</span>
          </div>
          {/* CRM Modules */}
          <div>
            <div 
              onClick={() => setIsCrmOpen(!isCrmOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${isCrmActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium">CRM</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCrmOpen ? 'rotate-180' : ''}`} />
            </div>
            {isCrmOpen && (
              <div className="mt-1 space-y-1">
                <div 
                  onClick={() => onNavigate?.('potential_customers')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'potential_customers' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'potential_customers' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Khách hàng quan tâm</span>
                </div>
                <div className="flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors text-gray-600 hover:bg-gray-100">
                  <span className="text-sm font-medium">Mời Khách quay lại</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('customer_bookings')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'customer_bookings' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'customer_bookings' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Lịch hẹn Khách đặt</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('customers')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'customers' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'customers' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Khách hàng</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('discount_management')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'discount_management' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'discount_management' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Quản lý chiết khấu</span>
                </div>
                <div className="flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors text-gray-600 hover:bg-gray-100">
                  <span className="text-sm font-medium">Đánh giá chất lượng dịch vụ</span>
                </div>
              </div>
            )}
          </div>

          {/* HRM Modules */}
          <div>
            <div 
              onClick={() => setIsHrmOpen(!isHrmOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${isHrmActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">HRM</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHrmOpen ? 'rotate-180' : ''}`} />
            </div>
            {isHrmOpen && (
              <div className="mt-1 space-y-1">
                <div 
                  onClick={() => onNavigate?.('employee_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'employee_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'employee_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Danh sách Nhân sự</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('labor_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'labor_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'labor_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Hồ sơ Hợp đồng</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('department_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'department_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'department_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Phòng ban / Bộ phận</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('position_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'position_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'position_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Chức vụ / Vị trí</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('salary_grade_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_grade_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'salary_grade_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Thang bảng Lương</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('contract_type_list')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'contract_type_list' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'contract_type_list' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Loại hợp đồng</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('salary_rule_group')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_rule_group' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'salary_rule_group' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Nhóm quy tắc Lương</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('salary_structure')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'salary_structure' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'salary_structure' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Cấu trúc Lương</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('insurance_tax_params')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'insurance_tax_params' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'insurance_tax_params' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Tham số BHXH & Thuế</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('payroll_period')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'payroll_period' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'payroll_period' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Kỳ tính Lương</span>
                </div>
                <div 
                  onClick={() => onNavigate?.('payroll_table')}
                  className={`flex items-center pl-11 pr-3 py-2 rounded-md relative cursor-pointer transition-colors ${currentView === 'payroll_table' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {currentView === 'payroll_table' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                  )}
                  <span className="text-sm font-medium">Bảng lương</span>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Version Footer */}
        <div className="px-6 py-3 border-t border-gray-200 text-base font-bold text-red-600">
          v.0.1.8
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-10">
          <div className="flex-1 flex items-center">
            {currentView === 'repair_service' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Dịch vụ sửa chữa</h1>
            )}
            {currentView === 'customers' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Khách hàng</h1>
            )}
            {currentView === 'customer_bookings' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Lịch hẹn Khách đặt</h1>
            )}
            {currentView === 'discount_management' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Quản lý chiết khấu</h1>
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
              <div className={`relative w-[400px] ${currentView === 'repair_service' || currentView === 'customers' || currentView === 'customer_bookings' || currentView === 'discount_management' ? '' : 'mx-auto'}`}>
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
