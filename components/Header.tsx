import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="bg-white shadow-md w-full p-4 flex justify-between items-center z-10 shrink-0">
      <div className="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-xl font-bold text-gray-800">AI Shopping Assistant</h1>
      </div>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm hidden sm:block">{user.email}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            로그인 / 회원가입
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
