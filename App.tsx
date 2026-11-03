import React, { useState } from 'react';
import { COLORS } from './constants';
import { Header } from './components/Header';
import { ProductTypeSelector } from './components/ProductTypeSelector';
import { MainForm } from './components/MainForm';
import { TabsSection } from './components/TabsSection';
import { ActionFooter } from './components/ActionFooter';
import { ProductType } from './types';
import { Layout } from './components/Layout';
import { CategoryList } from './components/CategoryList';
import { OmnichannelConfig } from './components/OmnichannelConfig';
import { MarketplaceManagement } from './components/MarketplaceManagement';
import { OnlineOrdering } from './components/OnlineOrdering';
import { SupplierHomepage } from './components/SupplierHomepage';
import { CommercialSales } from './components/CommercialSales';
import { PurchaseOrders } from './components/PurchaseOrders';
import { RepairService } from './components/RepairService';
import {
  EventsModule,
  HistoryItem,
  TaskItem,
  ActivityItem,
} from './components/EventsModule';
import {
  PotentialCustomersModule,
  PotentialCustomerItem,
  MOCK_POTENTIAL_CUSTOMERS,
} from './components/PotentialCustomersModule';
import { CustomersModule } from './components/CustomersModule';
import {
  CustomerBookingsModule,
  CustomerBookingRecord,
  INITIAL_CUSTOMER_BOOKINGS,
  BookingNoteItem,
  BookingTaskItem,
  BookingActivityItem,
  INITIAL_BOOKING_INTERNAL_NOTES,
  INITIAL_BOOKING_TASKS,
} from './components/CustomerBookingsModule';
import {
  DiscountManagementModule,
  INITIAL_DISCOUNTS,
  DiscountRecord,
} from './components/DiscountManagementModule';
import { RegistrationApprovalModule } from './components/RegistrationApprovalModule';
import { EmployeeList } from './hrmv0.4-main/components/EmployeeList';
import { LaborList } from './hrmv0.4-main/components/LaborList';
import { DepartmentList } from './hrmv0.4-main/components/DepartmentList';
import { PositionList } from './hrmv0.4-main/components/PositionList';
import { SalaryGradeList } from './hrmv0.4-main/components/SalaryGradeList';
import { ContractTypeList } from './hrmv0.4-main/components/ContractTypeList';
import { SalaryRuleGroupList } from './hrmv0.4-main/components/SalaryRuleGroupList';
import { SalaryStructureList, INITIAL_STRUCTURES } from './hrmv0.4-main/components/SalaryStructureList';
import { InsuranceTaxParams } from './hrmv0.4-main/components/InsuranceTaxParams';
import { PayrollPeriodList, PayrollPeriod, INITIAL_PAYROLL_PERIODS } from './hrmv0.4-main/components/PayrollPeriodList';
import { PayrollTableList, PayrollTableRecord, INITIAL_PAYROLL_TABLES } from './hrmv0.4-main/components/PayrollTableList';
import { OrderProvider } from './context/OrderContext';

const App: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>(ProductType.SPARE_PART);
  const [currentView, setCurrentView] = useState<'categories' | 'spare_parts' | 'omnichannel' | 'online_ordering' | 'commercial_sales' | 'purchase_orders' | 'supplier_homepage' | 'marketplace' | 'repair_service' | 'events' | 'potential_customers' | 'customer_bookings' | 'customers' | 'discount_management' | 'registration_approval' | 'employee_list' | 'labor_list' | 'department_list' | 'position_list' | 'salary_grade_list' | 'contract_type_list' | 'salary_rule_group' | 'salary_structure' | 'insurance_tax_params' | 'payroll_period' | 'payroll_table'>('categories');
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [potentialCustomers, setPotentialCustomers] = useState<
    PotentialCustomerItem[]
  >(MOCK_POTENTIAL_CUSTOMERS);
  const [guestHistory, setGuestHistory] = useState<Record<string, HistoryItem[]>>({});
  const [guestTasks, setGuestTasks] = useState<Record<string, TaskItem[]>>({});
  const [guestActivityHistory, setGuestActivityHistory] = useState<
    Record<string, ActivityItem[]>
  >({});
  const [customerBookings, setCustomerBookings] = useState<CustomerBookingRecord[]>(
    INITIAL_CUSTOMER_BOOKINGS
  );
  const [bookingInternalNotes, setBookingInternalNotes] = useState<
    Record<string, BookingNoteItem[]>
  >(INITIAL_BOOKING_INTERNAL_NOTES);
  const [bookingTasks, setBookingTasks] = useState<
    Record<string, BookingTaskItem[]>
  >(INITIAL_BOOKING_TASKS);
  const [bookingActivities, setBookingActivities] = useState<
    Record<string, BookingActivityItem[]>
  >({});
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(INITIAL_DISCOUNTS);

  // Shared Salary Structures State between Cấu trúc Lương and Hồ sơ hợp đồng
  const [salaryStructures, setSalaryStructures] = useState(INITIAL_STRUCTURES);

  // Shared Payroll States between Kỳ tính lương and Bảng lương
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>(INITIAL_PAYROLL_PERIODS);
  // Bảng lương: 1 record phù hợp với kỳ tính lương T10/2025 (T10_2025)
  const [payrollTables, setPayrollTables] = useState<PayrollTableRecord[]>(INITIAL_PAYROLL_TABLES);

  const handleCreateCustomerBooking = (
    bookingData: Omit<CustomerBookingRecord, 'id' | 'bookingCode'> & {
      id?: string;
    }
  ) => {
    setCustomerBookings((prev) => {
      const nextNum = String(prev.length + 1).padStart(2, '0');
      const newRecord: CustomerBookingRecord = {
        ...bookingData,
        id: bookingData.id || `cb-${Date.now()}`,
        bookingCode: `LH-241027-${nextNum}`,
      };
      return [newRecord, ...prev];
    });
  };

  return (
    <OrderProvider>
      <Layout currentView={currentView} onNavigate={(view) => setCurrentView(view as any)}>
        {currentView === 'categories' ? (
          <CategoryList 
            onSelectSpareParts={() => setCurrentView('spare_parts')} 
            onSelectOmnichannel={() => setCurrentView('omnichannel')}
          />
        ) : currentView === 'omnichannel' ? (
          <OmnichannelConfig onBack={() => setCurrentView('categories')} />
        ) : currentView === 'online_ordering' ? (
          <OnlineOrdering onNavigateToSupplier={(id) => {
            setSelectedSupplierId(id);
            setCurrentView('supplier_homepage');
          }} />
        ) : currentView === 'supplier_homepage' && selectedSupplierId ? (
          <SupplierHomepage supplierId={selectedSupplierId} onBack={() => setCurrentView('online_ordering')} />
        ) : currentView === 'commercial_sales' ? (
          <CommercialSales />
        ) : currentView === 'purchase_orders' ? (
          <PurchaseOrders />
        ) : currentView === 'marketplace' ? (
          <MarketplaceManagement />
        ) : currentView === 'repair_service' ? (
          <RepairService />
        ) : currentView === 'employee_list' ? (
          <EmployeeList />
        ) : currentView === 'labor_list' ? (
          <LaborList salaryStructures={salaryStructures} />
        ) : currentView === 'department_list' ? (
          <DepartmentList />
        ) : currentView === 'position_list' ? (
          <PositionList />
        ) : currentView === 'salary_grade_list' ? (
          <SalaryGradeList />
        ) : currentView === 'contract_type_list' ? (
          <ContractTypeList />
        ) : currentView === 'salary_rule_group' ? (
          <SalaryRuleGroupList />
        ) : currentView === 'salary_structure' ? (
          <SalaryStructureList structures={salaryStructures} setStructures={setSalaryStructures} />
        ) : currentView === 'insurance_tax_params' ? (
          <InsuranceTaxParams />
        ) : currentView === 'payroll_period' ? (
          <PayrollPeriodList 
            periods={payrollPeriods}
            setPeriods={setPayrollPeriods}
            payrollTables={payrollTables}
            setPayrollTables={setPayrollTables}
            onNavigateToPayrollTable={() => setCurrentView('payroll_table')}
          />
        ) : currentView === 'payroll_table' ? (
          <PayrollTableList 
            payrollTables={payrollTables}
            setPayrollTables={setPayrollTables}
            payrollPeriods={payrollPeriods}
            onNavigateToPeriod={() => setCurrentView('payroll_period')}
          />
        ) : currentView === 'events' ? (
          <EventsModule />
        ) : currentView === 'potential_customers' ? (
          <PotentialCustomersModule
            onCreateCustomerBooking={handleCreateCustomerBooking}
            bookingCounts={bookingCounts}
            setBookingCounts={setBookingCounts}
            customerBookings={customerBookings}
            setCustomerBookings={setCustomerBookings}
            discounts={discounts}
            events={potentialCustomers}
            setEvents={setPotentialCustomers}
            guestHistory={guestHistory}
            setGuestHistory={setGuestHistory}
            guestTasks={guestTasks}
            setGuestTasks={setGuestTasks}
            guestActivityHistory={guestActivityHistory}
            setGuestActivityHistory={setGuestActivityHistory}
            bookingInternalNotes={bookingInternalNotes}
            setBookingInternalNotes={setBookingInternalNotes}
            bookingTasks={bookingTasks}
            setBookingTasks={setBookingTasks}
            bookingActivities={bookingActivities}
            setBookingActivities={setBookingActivities}
          />
        ) : currentView === 'customer_bookings' ? (
          <CustomerBookingsModule
            bookings={customerBookings}
            setBookings={setCustomerBookings}
            discounts={discounts}
            bookingInternalNotes={bookingInternalNotes}
            setBookingInternalNotes={setBookingInternalNotes}
            bookingTasks={bookingTasks}
            setBookingTasks={setBookingTasks}
            bookingActivities={bookingActivities}
            setBookingActivities={setBookingActivities}
            guestHistory={guestHistory}
            setGuestHistory={setGuestHistory}
            guestTasks={guestTasks}
            setGuestTasks={setGuestTasks}
            guestActivityHistory={guestActivityHistory}
            setGuestActivityHistory={setGuestActivityHistory}
          />
        ) : currentView === 'customers' ? (
          <CustomersModule />
        ) : currentView === 'discount_management' ? (
          <DiscountManagementModule
            discounts={discounts}
            setDiscounts={setDiscounts}
          />
        ) : currentView === 'registration_approval' ? (
          <RegistrationApprovalModule />
        ) : (
          <div className="min-h-full font-sans bg-[#F2FBF5] text-gray-800 flex flex-col">
            <Header />
            
            <main className="flex-1 max-w-[1440px] w-full mx-auto px-8 py-8 animate-fadeIn">
              {/* Product Type Selection */}
              <ProductTypeSelector selected={productType} onChange={setProductType} />

              {/* Main Form Area */}
              <MainForm productType={productType} />

              {/* Detailed Tabs Area */}
              <TabsSection productType={productType} />
            </main>

            <ActionFooter onBack={() => setCurrentView('categories')} />
            
            {/* Global CSS for custom animations if needed */}
            <style>{`
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                  animation: fadeIn 0.4s ease-out forwards;
              }
            `}</style>
          </div>
        )}
      </Layout>
    </OrderProvider>
  );
};

export default App;