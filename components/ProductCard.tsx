import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPurchaseRequest: (product: Product) => void;
}

const StarRating: React.FC<{ ratingText: string }> = ({ ratingText }) => {
  const ratingMatch = ratingText.match(/(\d\.\d)\/5/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  const totalStars = 5;
  
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        let fillPercent = '0%';
        if (rating >= starValue) {
          fillPercent = '100%';
        } else if (rating > index && rating < starValue) {
          fillPercent = `${(rating - index) * 100}%`;
        }
        
        return (
          <div key={index} className="relative w-5 h-5">
            <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: fillPercent }}>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </div>
          </div>
        );
      })}
       <span className="text-gray-600 text-sm ml-2">{ratingText}</span>
    </div>
  );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchaseRequest }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mb-2 px-2.5 py-0.5 rounded-full self-start">{product.category}</span>
        <h3 className="font-bold text-gray-800 text-lg mb-2 truncate">{product.name}</h3>
        
        <div className="mb-3">
          {product.rating && <StarRating ratingText={product.rating} />}
        </div>

        <div className="mb-4">
          <p className="font-semibold text-gray-800 text-2xl">{product.price}</p>
        </div>

        <div className="bg-indigo-50 p-3 rounded-lg mb-4 flex-grow">
          <h4 className="font-semibold text-sm text-indigo-800 mb-1">AI 추천 이유</h4>
          <p className="text-gray-700 text-sm">{product.description}</p>
        </div>

        <button
          onClick={() => onPurchaseRequest(product)}
          className="w-full mt-auto bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          구매 요청
        </button>
      </div>
    </div>
  );
};

export default ProductCard;