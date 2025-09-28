import React, { memo, useCallback } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPurchaseRequest: (product: Product) => void;
}

const StarRating: React.FC<{ ratingText: string }> = memo(({ ratingText }) => {
  const ratingMatch = ratingText.match(/(\d\.\d)\/5/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  const totalStars = 5;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          let fillPercent = '0%';
          if (rating >= starValue) {
            fillPercent = '100%';
          } else if (rating > index && rating < starValue) {
            fillPercent = `${(rating - index) * 100}%`;
          }

          return (
            <div key={index} className="relative w-4 h-4">
              <svg className="w-full h-full text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: fillPercent }}>
                <svg className="w-4 h-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      <span className="text-gray-600 text-sm font-medium">{ratingText}</span>
    </div>
  );
});


const ProductCard: React.FC<ProductCardProps> = memo(({ product, onPurchaseRequest }) => {
  const handlePurchaseRequest = useCallback(() => {
    onPurchaseRequest(product);
  }, [product, onPurchaseRequest]);

  return (
    <div className="card hover-lift overflow-hidden flex flex-col h-full animate-scale-in">
      {/* 상품 이미지 */}
      <div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">이미지 로딩 중...</span>
          </div>
        )}

        {/* 카테고리 배지 */}
        <div className="absolute top-2 md:top-3 left-2 md:left-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-md border border-white/20">
            {product.category}
          </span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4 md:p-6 flex flex-col flex-grow space-y-3 md:space-y-4">
        {/* 상품명 */}
        <h3 className="font-bold text-gray-900 text-lg md:text-xl leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* 평점 */}
        {product.rating && (
          <div className="flex items-center justify-between">
            <StarRating ratingText={product.rating} />
          </div>
        )}

        {/* 가격 */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl md:text-3xl font-bold gradient-text">{product.price}</span>
          <span className="text-xs md:text-sm text-gray-500 line-through">정가 대비 할인</span>
        </div>

        {/* AI 추천 이유 */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-3 md:p-4 rounded-xl border border-primary-200 flex-grow">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h4 className="font-bold text-xs md:text-sm text-primary-800">AI 맞춤 추천 이유</h4>
          </div>
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* 구매 요청 버튼 */}
        <div className="pt-2">
          <button
            onClick={handlePurchaseRequest}
            className="btn-primary hover-lift w-full py-3 md:py-4 text-sm md:text-base font-bold relative overflow-hidden group touch-target"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">구매 대행 요청</span>
              <span className="sm:hidden">구매 요청</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* 추가 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>무료 배송</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>당일 처리</span>
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;