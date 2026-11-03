import React, { useState } from 'react';
import { Star, ThumbsUp, MoreVertical, ArrowLeft, Filter } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  attributes: { label: string; value: string }[];
  content: string;
  images?: string[];
  likes: number;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  onBack: () => void;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'nguyenvanhung_gara',
    userAvatar: 'https://picsum.photos/seed/user1/50/50',
    rating: 5,
    date: '2024-02-28 10:15',
    attributes: [
      { label: 'Độ bền', value: 'Tốt' },
      { label: 'Đúng mô tả', value: 'Chuẩn' },
      { label: 'Giao hàng', value: 'Nhanh' }
    ],
    content: 'Lốp Michelin đi rất êm, bám đường tốt. Shop đóng gói kỹ, giao hàng nhanh trong ngày. Sẽ ủng hộ tiếp cho gara của mình.',
    images: [
      'https://picsum.photos/seed/tire_review1/100/100',
      'https://picsum.photos/seed/tire_review2/100/100'
    ],
    likes: 12
  },
  {
    id: '2',
    userName: 'autocare_saigon',
    userAvatar: 'https://picsum.photos/seed/user2/50/50',
    rating: 4,
    date: '2024-02-25 14:30',
    attributes: [
      { label: 'Chất lượng', value: 'Ổn' },
      { label: 'Giá cả', value: 'Hợp lý' }
    ],
    content: 'Hàng chính hãng, check code ok. Tuy nhiên giao hàng hơi chậm hơn dự kiến 1 chút do kẹt biên. Sản phẩm tốt, đáng tiền.',
    images: [
      'https://picsum.photos/seed/oil_review1/100/100'
    ],
    likes: 5
  },
  {
    id: '3',
    userName: 'gara_thanh_dat',
    userAvatar: 'https://picsum.photos/seed/user3/50/50',
    rating: 5,
    date: '2024-02-20 09:12',
    attributes: [
      { label: 'Tư vấn', value: 'Nhiệt tình' }
    ],
    content: 'Đã mua nhiều lần ở đây, chưa bao giờ thất vọng. Má phanh Brembo lắp vào khách rất ưng. Cảm ơn shop.',
    likes: 8
  }
];

const FILTERS = [
  { label: 'Tất cả', count: null },
  { label: '5 Sao', count: 711 },
  { label: '4 Sao', count: 50 },
  { label: '3 Sao', count: 25 },
  { label: '2 Sao', count: 4 },
  { label: '1 Sao', count: 21 },
  { label: 'Có Bình Luận', count: 316 },
  { label: 'Có Hình Ảnh / Video', count: 133 },
];

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName, onBack }) => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-gray-900 text-lg uppercase">ĐÁNH GIÁ SẢN PHẨM</h1>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-600 truncate">{productName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="bg-white rounded-sm shadow-sm p-8 mb-4">
          {/* Summary Section */}
          <div className="flex items-start gap-12 border-b border-gray-100 pb-8 mb-8 bg-[#FFFBF8] border border-[#F9EDE5] rounded p-8">
            <div className="text-center px-4">
              <div className="text-[#EE4D2D] text-5xl font-medium mb-2">
                4.8 <span className="text-3xl text-[#EE4D2D]/60">trên 5</span>
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[#EE4D2D] text-[#EE4D2D]" />
                ))}
              </div>
            </div>
            
            <div className="flex-1 flex flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`px-4 py-2 border rounded-sm text-sm transition-colors ${
                    activeFilter === filter.label
                      ? 'border-[#EE4D2D] text-[#EE4D2D] font-medium'
                      : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {filter.label} {filter.count !== null && `(${filter.count})`}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs text-gray-800 font-medium mb-1">{review.userName}</div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-[#EE4D2D] text-[#EE4D2D]' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">{review.date}</div>
                    
                    {review.attributes.length > 0 && (
                      <div className="space-y-1 mb-4">
                        {review.attributes.map((attr, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            <span className="text-gray-400">{attr.label}:</span> {attr.value}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-800 leading-relaxed mb-4">
                      {review.content}
                    </div>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="w-20 h-20 border border-gray-200 cursor-pointer hover:opacity-90">
                            <img src={img} alt="Review" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-[#EE4D2D]">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.likes > 0 ? review.likes : 'Hữu ích?'}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
