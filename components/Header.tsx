import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="glass border-b border-white/20 w-full px-6 py-4 flex justify-between items-center z-10 shrink-0 animate-slide-in-up">
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">AI Shopping Assistant</h1>
          <p className="text-xs text-gray-600 mt-0.5">당신만을 위한 똑똑한 쇼핑 파트너</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="status-online w-2 h-2 rounded-full animate-pulse-soft"></div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block">{user.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary hover-lift text-sm"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="btn-primary hover-lift text-sm"
          >
            로그인 / 회원가입
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
