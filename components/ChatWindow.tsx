import React, { useEffect, useRef } from 'react';
import type { Message, Product } from '../types';
import MessageItem from './MessageItem';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onPurchaseRequest: (product: Product) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onPurchaseRequest }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onPurchaseRequest={onPurchaseRequest} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 max-w-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatWindow;