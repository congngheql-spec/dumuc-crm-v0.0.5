import React, { useState } from 'react';
import { Search, List, ChevronDown, Bell, User, Store, Wrench } from 'lucide-react';

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
            className={`hidden items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'commercial_sales' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
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
            className={`hidden items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'marketplace' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'marketplace' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <Store className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Quản lý sàn</span>
          </div>
          <div 
            onClick={() => onNavigate?.('online_ordering')}
            className={`hidden items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'online_ordering' || currentView === 'supplier_homepage' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
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
            className={`hidden items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'purchase_orders' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
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
            className={`hidden items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'registration_approval' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'registration_approval' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Xét duyệt Đăng ký sàn</span>
          </div>
          <div 
            onClick={() => onNavigate?.('potential_customers')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'potential_customers' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'potential_customers' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium">Khách hàng tiềm năng</span>
          </div>
          <div className="flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Lịch hẹn Khách đặt</span>
          </div>
          <div 
            onClick={() => onNavigate?.('customers')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'customers' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'customers' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">Khách hàng</span>
          </div>
          <div 
            onClick={() => onNavigate?.('discount_management')}
            className={`flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors ${currentView === 'discount_management' ? 'bg-[#EBF5FF] text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {currentView === 'discount_management' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
            )}
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-medium">Quản lý chiết khấu</span>
          </div>
          <div className="flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Lịch hẹn Garage mời</span>
          </div>
          <div className="flex items-center px-3 py-2.5 rounded-md relative cursor-pointer transition-colors text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-medium">Đánh giá chất lượng dịch vụ</span>
          </div>
        </nav>

        {/* Version Footer */}
        <div className="px-6 py-3 border-t border-gray-200 text-base font-bold text-red-600">
          v.0.1.6
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
            {currentView === 'discount_management' && (
              <h1 className="text-xl font-bold text-gray-800 mr-8">Quản lý chiết khấu</h1>
            )}
            <div className={`relative w-[400px] ${currentView === 'repair_service' || currentView === 'customers' || currentView === 'discount_management' ? '' : 'mx-auto'}`}>
              <input 
                type="text" 
                placeholder="Tìm biển số xe" 
                className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 transition-colors" 
              />
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
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
