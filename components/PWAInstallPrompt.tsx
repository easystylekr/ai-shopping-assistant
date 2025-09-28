import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isOffline, isUpdateAvailable, installApp, updateApp, dismissInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOfflineStatus, setShowOfflineStatus] = useState(false);

  // Show install prompt if app is installable and not dismissed recently
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show prompt if never dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        // Delay showing prompt for better UX
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  // Show offline status
  useEffect(() => {
    if (isOffline) {
      setShowOfflineStatus(true);
      const timer = setTimeout(() => {
        setShowOfflineStatus(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowOfflineStatus(false);
    }
  }, [isOffline]);

  const handleInstall = async () => {
    try {
      await installApp();
      setShowPrompt(false);
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleDismiss = () => {
    dismissInstall();
    setShowPrompt(false);
  };

  const handleUpdate = () => {
    updateApp();
  };

  return (
    <>
      {/* Install Prompt */}
      {showPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 md:top-6 md:left-auto md:right-6 md:max-w-sm animate-slide-in-down">
          <div className="mobile-card p-4 shadow-lg border border-primary-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  앱 설치하기
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  AI 쇼핑 어시스턴트를 홈 화면에 추가하여 더 빠르고 편리하게 이용하세요.
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={handleInstall}
                    className="mobile-btn mobile-btn-primary text-xs px-3 py-1.5 flex-1"
                  >
                    설치하기
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="mobile-btn mobile-btn-secondary text-xs px-3 py-1.5"
                  >
                    나중에
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 mobile-touch-target text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Prompt */}
      {isUpdateAvailable && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:max-w-sm animate-slide-in-up">
          <div className="mobile-card p-4 shadow-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  새 업데이트가 사용 가능합니다
                </p>
                <button
                  onClick={handleUpdate}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  지금 업데이트
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status */}
      {showOfflineStatus && (
        <div className="fixed top-4 left-4 right-4 z-40 md:top-20 md:left-auto md:right-6 md:max-w-sm animate-slide-in-down">
          <div className="mobile-card p-3 shadow-lg border border-orange-200 bg-orange-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v4m0 12v4m8-10h-4M6 12H2" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-orange-900">
                  오프라인 모드 - 일부 기능이 제한됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Features Info (only show on first visit) */}
      {isInstalled && !localStorage.getItem('pwa-features-shown') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="mobile-card p-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                앱 설치 완료!
              </h3>

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>오프라인에서도 사용 가능</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>빠른 로딩 속도</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>네이티브 앱 경험</span>
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('pwa-features-shown', 'true');
                  // Force re-render by setting a dummy state
                  setShowPrompt(false);
                }}
                className="mobile-btn mobile-btn-primary w-full"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;