import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  X,
  MapPin,
  Building2,
  Phone,
  Mail,
  Users,
  Eye,
  SquarePen,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  EXISTING_CUSTOMERS_IN_MODULE,
  ExistingCustomerRecord,
} from './PotentialCustomersModule';
import { CustomerCDPModal } from './CustomerCDPModal';

const CUSTOMER_GROUPS = [
  'Khách hàng VIP / Đại lý',
  'Khách hàng Thân thiết',
  'Khách hàng Doanh nghiệp',
  'Khách hàng Thường',
];

export const CustomersModule: React.FC = () => {
  const [customers, setCustomers] = useState<ExistingCustomerRecord[]>(
    EXISTING_CUSTOMERS_IN_MODULE
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter inputs
  const [searchInput, setSearchInput] = useState('');
  const [taxCodeInput, setTaxCodeInput] = useState('');
  const [groupInput, setGroupInput] = useState('Tất cả');

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    taxCode: '',
    group: 'Tất cả',
  });

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [cdpCustomer, setCdpCustomer] =
    useState<ExistingCustomerRecord | null>(null);
  const [viewingCustomer, setViewingCustomer] =
    useState<ExistingCustomerRecord | null>(null);
  const [editingCustomer, setEditingCustomer] =
    useState<ExistingCustomerRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [sharedEmailModal, setSharedEmailModal] = useState<string | null>(null);

  // Form state for Add / Edit
  const [formData, setFormData] = useState<Omit<ExistingCustomerRecord, 'id'>>({
    customerCode: '',
    customerName: '',
    companyName: '',
    phone: '',
    email: '',
    taxCode: '',
    address: '',
    customerGroup: 'Khách hàng Thường',
    createdAt: '',
  });
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Count how many customers share each email (normalized lowercase)
  const emailCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach((c) => {
      const normalized = c.email.trim().toLowerCase();
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    });
    return counts;
  }, [customers]);

  // Filtered customers
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((c) => {
      if (appliedFilters.search.trim()) {
        const q = appliedFilters.search.trim().toLowerCase();
        const matchCode = c.customerCode.toLowerCase().includes(q);
        const matchName = c.customerName.toLowerCase().includes(q);
        const matchCompany = c.companyName.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchAddress = c.address.toLowerCase().includes(q);
        if (
          !matchCode &&
          !matchName &&
          !matchCompany &&
          !matchPhone &&
          !matchEmail &&
          !matchAddress
        ) {
          return false;
        }
      }

      if (appliedFilters.taxCode.trim()) {
        const taxQ = appliedFilters.taxCode.trim().toLowerCase();
        if (!c.taxCode.toLowerCase().includes(taxQ)) {
          return false;
        }
      }

      if (
        appliedFilters.group !== 'Tất cả' &&
        c.customerGroup !== appliedFilters.group
      ) {
        return false;
      }

      return true;
    });
  }, [customers, appliedFilters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchInput,
      taxCode: taxCodeInput,
      group: groupInput,
    });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setTaxCodeInput('');
    setGroupInput('Tất cả');
    setAppliedFilters({
      search: '',
      taxCode: '',
      group: 'Tất cả',
    });
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedCustomers.map((c) => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getGroupBadgeStyle = (group: string) => {
    switch (group) {
      case 'Khách hàng VIP / Đại lý':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Khách hàng Thân thiết':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Khách hàng Doanh nghiệp':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Khách hàng Thường':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const nextNum = String(customers.length + 130).padStart(3, '0');

    setFormData({
      customerCode: `KH-${yyyy}-${nextNum}`,
      customerName: '',
      companyName: '',
      phone: '',
      email: '',
      taxCode: '',
      address: '',
      customerGroup: 'Khách hàng Doanh nghiệp',
      createdAt: `${dd}/${mm}/${yyyy}`,
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer: ExistingCustomerRecord) => {
    setFormData({
      customerCode: customer.customerCode,
      customerName: customer.customerName,
      companyName: customer.companyName,
      phone: customer.phone,
      email: customer.email,
      taxCode: customer.taxCode,
      address: customer.address,
      customerGroup: customer.customerGroup,
      createdAt: customer.createdAt,
    });
    setFormError('');
    setEditingCustomer(customer);
  };

  // Save Add / Edit
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setFormError('Vui lòng nhập đầy đủ Họ và tên và Số điện thoại.');
      return;
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...formData, id: c.id } : c
        )
      );
      setEditingCustomer(null);
    } else {
      const newCustomer: ExistingCustomerRecord = {
        ...formData,
        id: `cust-${Date.now()}`,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    setCustomers((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
    setSelectedRows([]);
    setIsDeleteConfirmOpen(false);
  };

  // Export Excel (CSV with UTF-8 BOM)
  const handleExportExcel = () => {
    const headers = [
      'STT',
      'Mã KH',
      'Họ và tên',
      'Tên Công ty / Garage',
      'Số điện thoại',
      'Email',
      'Mã số thuế',
      'Nhóm khách hàng',
      'Địa chỉ',
      'Ngày tạo',
    ];
    const rows = filteredCustomers.map((c, idx) => [
      idx + 1,
      `"${c.customerCode}"`,
      `"${c.customerName}"`,
      `"${c.companyName}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.taxCode}"`,
      `"${c.customerGroup}"`,
      `"${c.address}"`,
      `"${c.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
      '\n'
    );
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh_sach_khach_hang.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Excel / CSV
  const handleImportExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length <= 1) return;

      const imported: ExistingCustomerRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i]
          .split(',')
          .map((col) => col.replace(/^"|"$/g, '').trim());
        if (cols.length >= 5) {
          const today = new Date().toLocaleDateString('vi-VN');
          imported.push({
            id: `cust-imp-${Date.now()}-${i}`,
            customerCode: cols[1] || `KH-2024-${customers.length + i + 100}`,
            customerName: cols[2] || 'Khách hàng mới',
            companyName: cols[3] || '',
            phone: cols[4] || '',
            email: cols[5] || '',
            taxCode: cols[6] || '',
            customerGroup: cols[7] || 'Khách hàng Thường',
            address: cols[8] || '',
            createdAt: cols[9] || today,
          });
        }
      }
      if (imported.length > 0) {
        setCustomers((prev) => [...imported, ...prev]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6 flex flex-col gap-5 font-sans">
      {/* Hidden File Input for Excel Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleImportExcelChange}
      />

      {/* Top Action & Filter Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        {/* Top Row: Action Buttons + Total Count Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>

            <button
              type="button"
              disabled={selectedRows.length === 0}
              onClick={() => setIsDeleteConfirmOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedRows.length > 0
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-500" />
              Nhập Excel
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Xuất Excel
            </button>
          </div>

          <div className="px-3.5 py-1.5 bg-blue-50 text-[#1A73E8] border border-blue-200 rounded-full text-xs font-semibold">
            Tổng số: {filteredCustomers.length} khách hàng
          </div>
        </div>

        {/* Bottom Row: Filter Controls */}
        <div className="pt-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              TÌM KIẾM NHANH
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Mã KH, Họ tên, Công ty, SĐT, Email, Địa chỉ..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setAppliedFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] transition-colors"
              />
            </div>
          </div>

          <div className="w-full sm:w-[220px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              MÃ SỐ THUẾ (MST)
            </label>
            <input
              type="text"
              placeholder="Nhập mã số thuế..."
              value={taxCodeInput}
              onChange={(e) => {
                setTaxCodeInput(e.target.value);
                setAppliedFilters((prev) => ({
                  ...prev,
                  taxCode: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] transition-colors"
            />
          </div>

          <div className="w-full sm:w-[220px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              NHÓM KHÁCH HÀNG
            </label>
            <select
              value={groupInput}
              onChange={(e) => {
                setGroupInput(e.target.value);
                setAppliedFilters((prev) => ({
                  ...prev,
                  group: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white cursor-pointer transition-colors"
            >
              <option value="Tất cả">Tất cả nhóm khách hàng</option>
              {CUSTOMER_GROUPS.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyFilter}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              Lọc
            </button>
            <button
              type="button"
              onClick={handleClearFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedCustomers.length > 0 &&
                      paginatedCustomers.every((c) =>
                        selectedRows.includes(c.id)
                      )
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 whitespace-nowrap">MÃ KH</th>
                <th className="py-3.5 px-4 min-w-[200px]">HỌ VÀ TÊN</th>
                <th className="py-3.5 px-4 min-w-[210px]">
                  TÊN CÔNG TY / GARAGE
                </th>
                <th className="py-3.5 px-4 whitespace-nowrap">SỐ ĐIỆN THOẠI</th>
                <th className="py-3.5 px-4 min-w-[210px]">EMAIL</th>
                <th className="py-3.5 px-4 whitespace-nowrap">MÃ SỐ THUẾ</th>
                <th className="py-3.5 px-4 whitespace-nowrap">NGÀY TẠO</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, index) => {
                  const normalizedEmail = customer.email.trim().toLowerCase();
                  const sharedCount = normalizedEmail
                    ? emailCounts[normalizedEmail] || 0
                    : 0;

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(customer.id)}
                          onChange={() => handleSelectRow(customer.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-3 text-center text-gray-500 align-middle">
                        {startIndex + index + 1}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setCdpCustomer(customer)}
                          className="font-bold text-[#1A73E8] hover:underline cursor-pointer"
                          title="Nhấn để mở Hồ sơ CDP Khách hàng 360 độ"
                        >
                          {customer.customerCode}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-gray-900">
                          {customer.customerName}
                        </div>
                        {customer.address && (
                          <div
                            className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 max-w-[210px]"
                            title={customer.address}
                          >
                            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                            <span className="truncate">{customer.address}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-start gap-2 text-gray-700 max-w-[230px]">
                          <Building2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            {customer.companyName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Mail className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                          <span className="truncate max-w-[210px]" title={customer.email}>
                            {customer.email}
                          </span>
                        </div>
                        {sharedCount > 1 && (
                          <button
                            type="button"
                            onClick={() => setSharedEmailModal(customer.email)}
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Nhấn để xem danh sách khách hàng dùng chung email này"
                          >
                            <Users className="w-3 h-3 shrink-0" />
                            <span>Dùng chung ({sharedCount} KH)</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-mono">
                          {customer.taxCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-gray-600">
                        {customer.createdAt}
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingCustomer(customer)}
                            className="p-1.5 text-[#1A73E8] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(customer)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 border-t border-gray-200 bg-white flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-700 bg-white outline-none focus:border-[#1A73E8] cursor-pointer"
            >
              <option value={10}>10 dòng / trang</option>
              <option value={20}>20 dòng / trang</option>
              <option value={50}>50 dòng / trang</option>
              <option value={100}>100 dòng / trang</option>
            </select>
            <span>
              Hiển thị{' '}
              <span className="font-semibold text-gray-800">
                {filteredCustomers.length === 0 ? 0 : startIndex + 1} -{' '}
                {Math.min(startIndex + pageSize, filteredCustomers.length)}
              </span>{' '}
              trong tổng số{' '}
              <span className="font-semibold text-gray-800">
                {filteredCustomers.length}
              </span>{' '}
              khách hàng
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  page === safeCurrentPage
                    ? 'bg-[#1A73E8] text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* View Customer Details Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#1A73E8] text-white text-xs font-bold rounded-md">
                  {viewingCustomer.customerCode}
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Thông tin chi tiết Khách hàng
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Họ và tên</div>
                <div className="font-bold text-gray-900">
                  {viewingCustomer.customerName}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Tên Công ty / Garage
                </div>
                <div className="font-semibold text-gray-800">
                  {viewingCustomer.companyName}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
                <div className="font-bold text-emerald-700">
                  {viewingCustomer.phone}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="font-semibold text-[#1A73E8] break-all">
                  {viewingCustomer.email}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Mã số thuế</div>
                <div className="font-mono font-semibold text-gray-800">
                  {viewingCustomer.taxCode}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Nhóm khách hàng & Ngày tạo
                </div>
                <div className="font-semibold text-gray-800">
                  {viewingCustomer.customerGroup} ({viewingCustomer.createdAt})
                </div>
              </div>
              <div className="col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
                <div className="font-medium text-gray-800">
                  {viewingCustomer.address}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = viewingCustomer;
                  setViewingCustomer(null);
                  handleOpenEditModal(target);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <SquarePen className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCustomer
                  ? `Chỉnh sửa Khách hàng (${editingCustomer.customerCode})`
                  : 'Thêm mới Khách hàng'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mã Khách hàng
                  </label>
                  <input
                    type="text"
                    value={formData.customerCode}
                    onChange={(e) =>
                      setFormData({ ...formData, customerCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nhóm khách hàng
                  </label>
                  <select
                    value={formData.customerGroup}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerGroup: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8] bg-white"
                  >
                    {CUSTOMER_GROUPS.map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên..."
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tên Công ty / Garage
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên công ty hoặc garage..."
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập số điện thoại..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email (Cho phép dùng chung nhiều KH)
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email..."
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập mã số thuế..."
                    value={formData.taxCode}
                    onChange={(e) =>
                      setFormData({ ...formData, taxCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày tạo
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.createdAt}
                    onChange={(e) =>
                      setFormData({ ...formData, createdAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ chi tiết..."
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Xác nhận xóa khách hàng
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Bạn có chắc chắn muốn xóa{' '}
              <span className="font-bold text-red-600">
                {selectedRows.length}
              </span>{' '}
              khách hàng đã chọn không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Email Records Modal */}
      {sharedEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Danh sách Khách hàng dùng chung Email
                  </h3>
                  <p className="text-xs text-amber-700 font-medium">
                    Email: {sharedEmailModal}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSharedEmailModal(null)}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {customers
                .filter(
                  (c) =>
                    c.email.trim().toLowerCase() ===
                    sharedEmailModal.trim().toLowerCase()
                )
                .map((c, i) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-600 text-white text-xs font-bold rounded">
                          #{i + 1}
                        </span>
                        <span className="font-bold text-[#1A73E8] text-sm">
                          {c.customerCode}
                        </span>
                        <span className="font-bold text-gray-900 text-sm">
                          {c.customerName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {c.companyName} • SĐT:{' '}
                        <span className="font-semibold text-gray-800">
                          {c.phone}
                        </span>{' '}
                        • MST:{' '}
                        <span className="font-mono font-semibold text-gray-800">
                          {c.taxCode}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{c.address}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSharedEmailModal(null);
                        setViewingCustomer(c);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 rounded-lg shrink-0 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSharedEmailModal(null)}
                className="px-5 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Customer 360 CDP Modal */}
      {cdpCustomer && (
        <CustomerCDPModal
          customer={cdpCustomer}
          onClose={() => setCdpCustomer(null)}
        />
      )}
    </div>
  );
};
