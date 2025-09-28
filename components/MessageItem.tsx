import React from 'react';
import type { Message, Product } from '../types';
import ProductCard from './ProductCard';

interface MessageItemProps {
  message: Message;
  onPurchaseRequest: (product: Product) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onPurchaseRequest }) => {
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="text-center my-4">
        <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{message.content}</span>
      </div>
    );
  }

  // If the AI message contains a product, show a special card-based response
  if (isAI && message.product) {
    return (
      <div className="flex my-4 justify-start">
        <div className="flex items-end max-w-xl flex-row">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold mr-3 shrink-0">
            AI
          </div>
          <div className="rounded-xl p-4 w-full bg-white text-gray-800 shadow-sm">
            <p className="text-base mb-4">고객님을 위해 최종적으로 선택한 상품입니다.</p>
            <ProductCard product={message.product} onPurchaseRequest={onPurchaseRequest} />
          </div>
        </div>
      </div>
    );
  }

  // Default message display for user and non-product AI messages
  return (
    <div className={`flex my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end max-w-xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
           <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold mr-3 shrink-0">
             AI
           </div>
        )}
        <div className={`rounded-xl p-4 w-full ${isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
          <p className="text-base whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;