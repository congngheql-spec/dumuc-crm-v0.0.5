import React from 'react';

interface CategoryListProps {
  onSelectSpareParts: () => void;
  onSelectOmnichannel: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelectSpareParts, onSelectOmnichannel }) => {
  const categories = [
    {
      title: 'Đối tượng',
      items: [
        { name: 'Khách hàng' },
        { name: 'Nhà cung cấp' },
        { name: 'Nhóm khách hàng' },
        { name: 'Đơn vị bảo hiểm' },
        { name: 'Khách hàng tiềm năng' },
      ],
    },
    {
      title: 'Vật tư hàng hóa',
      items: [
        { name: 'Vật tư, hàng hóa', onClick: onSelectSpareParts },
        { name: 'Loại vật tư' },
        { name: 'Kho' },
        { name: 'Nhóm vật tư, hàng hóa' },
        { name: 'Đơn vị tính' },
        { name: 'Lô' },
      ],
    },
    {
      title: 'Gara',
      items: [
        { name: 'Xe' },
        { name: 'Tài xế' },
        { name: 'Hiệu xe' },
        { name: 'Loại xe' },
        { name: 'Dòng xe' },
      ],
    },
    {
      title: 'Tài khoản',
      items: [
        { name: 'Hệ thống tài khoản' },
      ],
    },
    {
      title: 'HRM',
      items: [
        { name: 'Nhân sự' },
        { name: 'Phòng ban bộ phận' },
      ],
    },
    {
      title: 'Tài sản',
      items: [
        { name: 'Loại TSCĐ, CCDC' },
        { name: 'Tài sản cố định, công cụ dụng cụ' },
        { name: 'Kiểu tăng / giảm tài sản' },
        { name: 'Hệ số phân bổ khấu hao' },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { name: 'Người dùng' },
        { name: 'Nhóm người dùng' },
        { name: 'Phương thức thanh toán' },
        { name: 'Cấu hình tài liệu' },
        { name: 'Tài liệu công ty' },
        { name: 'Danh mục thuế' },
        { name: 'Đăng ký sàn', onClick: onSelectOmnichannel },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Danh mục</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col">
            <h2 className="text-base font-bold text-gray-800 mb-4">{category.title}</h2>
            <ul className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <button
                    onClick={item.onClick}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
