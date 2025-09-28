import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="glass border-b border-white/20 w-full px-3 md:px-6 py-3 md:py-4 flex justify-between items-center z-10 shrink-0 animate-slide-in-up safe-area-top">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white p-1.5 md:p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold gradient-text">
            <span className="hidden sm:inline">AI Shopping Assistant</span>
            <span className="sm:hidden">AI 쇼핑</span>
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 hidden md:block">당신만을 위한 똑똑한 쇼핑 파트너</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="status-online w-2 h-2 rounded-full animate-pulse-soft"></div>
                <span className="text-xs md:text-sm text-gray-700 font-medium hidden sm:block truncate max-w-24 md:max-w-32">{user.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary hover-lift text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 touch-target"
            >
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="btn-primary hover-lift text-xs md:text-sm px-3 md:px-4 py-2 touch-target"
          >
            <span className="hidden sm:inline">로그인 / 회원가입</span>
            <span className="sm:hidden">로그인</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
