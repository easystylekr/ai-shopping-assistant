import React, { useState, useEffect } from 'react';
import type { User, PurchaseRequest, DashboardStats } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'requests'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPurchaseRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    todayRequests: 0,
    monthlyRequests: 0,
  });

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // 사용자 데이터 로드
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
      const userData = JSON.parse(savedUsers);
      setUsers(userData);
      updateStats(userData, purchaseRequests);
    }

    // 구매 요청 데이터 로드
    const savedRequests = localStorage.getItem('purchaseRequests');
    if (savedRequests) {
      const requestData = JSON.parse(savedRequests);
      setPurchaseRequests(requestData);
      updateStats(users, requestData);
    }
  };

  const updateStats = (userData: User[], requestData: PurchaseRequest[]) => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const newStats: DashboardStats = {
      totalUsers: userData.length,
      totalPurchaseRequests: requestData.length,
      pendingRequests: requestData.filter(r => r.status === 'pending').length,
      completedRequests: requestData.filter(r => r.status === 'completed').length,
      todayRequests: requestData.filter(r => r.requestDate.startsWith(today)).length,
      monthlyRequests: requestData.filter(r => r.requestDate.startsWith(thisMonth)).length,
    };

    setStats(newStats);
  };

  const updateRequestStatus = (requestId: string, newStatus: PurchaseRequest['status'], adminNotes?: string) => {
    const updatedRequests = purchaseRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus,
          adminNotes: adminNotes || request.adminNotes,
          completedDate: newStatus === 'completed' ? new Date().toISOString() : request.completedDate,
        };
      }
      return request;
    });

    setPurchaseRequests(updatedRequests);
    localStorage.setItem('purchaseRequests', JSON.stringify(updatedRequests));
    updateStats(users, updatedRequests);
  };

  const getStatusColor = (status: PurchaseRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PurchaseRequest['status']) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'processing': return '처리중';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🛠️ 관리자 대시보드</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'dashboard', name: '📊 대시보드', icon: '📊' },
              { id: 'users', name: '👥 사용자 관리', icon: '👥' },
              { id: 'requests', name: '🛒 구매 요청 관리', icon: '🛒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 대시보드 탭 */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">📊 시스템 현황</h3>

              {/* 통계 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: '전체 사용자', value: stats.totalUsers, color: 'bg-blue-500', icon: '👥' },
                  { label: '전체 요청', value: stats.totalPurchaseRequests, color: 'bg-green-500', icon: '📦' },
                  { label: '대기중', value: stats.pendingRequests, color: 'bg-yellow-500', icon: '⏳' },
                  { label: '완료', value: stats.completedRequests, color: 'bg-emerald-500', icon: '✅' },
                  { label: '오늘 요청', value: stats.todayRequests, color: 'bg-purple-500', icon: '📅' },
                  { label: '이번달', value: stats.monthlyRequests, color: 'bg-indigo-500', icon: '📊' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow border">
                    <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white text-sm mb-2`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* 최근 활동 */}
              <div className="bg-white rounded-lg shadow border p-6">
                <h4 className="text-lg font-semibold mb-4">🕒 최근 구매 요청</h4>
                <div className="space-y-3">
                  {purchaseRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">{request.product.name}</div>
                          <div className="text-sm text-gray-600">{request.userEmail}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(request.requestDate).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 사용자 관리 탭 */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">👥 사용자 관리</h3>

              <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가입일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        마지막 활동
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        구매 요청 수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={user.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joinDate ? new Date(user.joinDate).toLocaleDateString('ko-KR') : '정보 없음'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive ? new Date(user.lastActive).toLocaleDateString('ko-KR') : '정보 없음'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchaseRequests.filter(r => r.userEmail === user.email).length}건
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    등록된 사용자가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 구매 요청 관리 탭 */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">🛒 구매 요청 관리</h3>

              <div className="space-y-4">
                {purchaseRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg shadow border p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{request.product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{request.userEmail}</p>
                        <p className="text-sm text-gray-500">
                          요청일: {new Date(request.requestDate).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <select
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request.id, e.target.value as PurchaseRequest['status'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">대기중</option>
                          <option value="processing">처리중</option>
                          <option value="completed">완료</option>
                          <option value="cancelled">취소</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">상품 정보</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>카테고리:</strong> {request.product.category}</p>
                          <p><strong>가격:</strong> {request.product.price}</p>
                          <p><strong>평점:</strong> {request.product.rating}</p>
                          <p><strong>구매 링크:</strong>
                            <a href={request.product.link} target="_blank" rel="noopener noreferrer"
                               className="text-blue-500 hover:underline ml-1">
                              링크 열기 →
                            </a>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">추천 이유</h5>
                        <p className="text-sm text-gray-600">{request.product.description}</p>
                      </div>
                    </div>

                    {request.adminNotes && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-700 mb-2">관리자 메모</h5>
                        <p className="text-sm text-gray-600">{request.adminNotes}</p>
                      </div>
                    )}

                    <div className="border-t pt-4 mt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="관리자 메모 추가..."
                          className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              updateRequestStatus(request.id, request.status, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {purchaseRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    구매 요청이 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;