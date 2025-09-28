import type { User, PurchaseRequest, DashboardStats } from '../types';

// 관리자 비밀번호 (실제 운영환경에서는 보안 강화 필요)
const ADMIN_PASSWORD = 'admin123';

export class AdminService {
  // 관리자 인증
  static authenticateAdmin(password: string): boolean {
    return password === ADMIN_PASSWORD;
  }

  // 사용자 데이터 관리
  static getUsers(): User[] {
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [];
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);

    if (existingIndex >= 0) {
      // 기존 사용자 업데이트
      users[existingIndex] = {
        ...users[existingIndex],
        ...user,
        lastActive: new Date().toISOString(),
      };
    } else {
      // 새 사용자 추가
      const newUser: User = {
        ...user,
        id: `user_${Date.now()}`,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalPurchaseRequests: 0,
      };
      users.push(newUser);
    }

    localStorage.setItem('adminUsers', JSON.stringify(users));
  }

  // 구매 요청 데이터 관리
  static getPurchaseRequests(): PurchaseRequest[] {
    const savedRequests = localStorage.getItem('purchaseRequests');
    if (savedRequests) {
      return JSON.parse(savedRequests);
    }
    return [];
  }

  static savePurchaseRequest(request: Omit<PurchaseRequest, 'id' | 'requestDate'>): string {
    const requests = this.getPurchaseRequests();
    const newRequest: PurchaseRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
    };

    requests.push(newRequest);
    localStorage.setItem('purchaseRequests', JSON.stringify(requests));

    // 사용자의 구매 요청 수 업데이트
    this.updateUserRequestCount(request.userEmail);

    return newRequest.id;
  }

  static updatePurchaseRequest(requestId: string, updates: Partial<PurchaseRequest>): boolean {
    const requests = this.getPurchaseRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex >= 0) {
      requests[requestIndex] = {
        ...requests[requestIndex],
        ...updates,
      };

      if (updates.status === 'completed' && !requests[requestIndex].completedDate) {
        requests[requestIndex].completedDate = new Date().toISOString();
      }

      localStorage.setItem('purchaseRequests', JSON.stringify(requests));
      return true;
    }

    return false;
  }

  // 사용자의 구매 요청 수 업데이트
  private static updateUserRequestCount(userEmail: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex >= 0) {
      const requests = this.getPurchaseRequests();
      const userRequestCount = requests.filter(r => r.userEmail === userEmail).length;

      users[userIndex].totalPurchaseRequests = userRequestCount;
      localStorage.setItem('adminUsers', JSON.stringify(users));
    }
  }

  // 대시보드 통계 생성
  static getDashboardStats(): DashboardStats {
    const users = this.getUsers();
    const requests = this.getPurchaseRequests();

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    return {
      totalUsers: users.length,
      totalPurchaseRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      todayRequests: requests.filter(r => r.requestDate.startsWith(today)).length,
      monthlyRequests: requests.filter(r => r.requestDate.startsWith(thisMonth)).length,
    };
  }

  // 데모 데이터 생성 (개발용)
  static generateDemoData(): void {
    // 데모 사용자 생성
    const demoUsers: User[] = [
      {
        email: 'user1@example.com',
        id: 'user_1',
        joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        totalPurchaseRequests: 2,
      },
      {
        email: 'user2@example.com',
        id: 'user_2',
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        lastActive: new Date().toISOString(), // 오늘
        totalPurchaseRequests: 1,
      },
    ];

    // 데모 구매 요청 생성
    const demoPurchaseRequests: PurchaseRequest[] = [
      {
        id: 'req_demo_1',
        userId: 'user_1',
        userEmail: 'user1@example.com',
        product: {
          name: '애플 에어팟 프로 2세대',
          category: '이어폰',
          description: '최신 노이즈 캔슬링 기술이 적용된 프리미엄 무선 이어폰',
          price: '359,000원',
          imageUrl: '',
          link: 'https://example.com/airpods-pro',
          rating: '별점 4.8/5 (리뷰 2,341개)',
        },
        status: 'pending',
        requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      },
      {
        id: 'req_demo_2',
        userId: 'user_2',
        userEmail: 'user2@example.com',
        product: {
          name: '삼성 갤럭시 S24 Ultra',
          category: '스마트폰',
          description: 'AI 기능이 강화된 프리미엄 스마트폰',
          price: '1,698,400원',
          imageUrl: '',
          link: 'https://example.com/galaxy-s24-ultra',
          rating: '별점 4.9/5 (리뷰 1,892개)',
        },
        status: 'completed',
        requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        completedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
        adminNotes: '정상적으로 주문 완료되었습니다.',
      },
      {
        id: 'req_demo_3',
        userId: 'user_1',
        userEmail: 'user1@example.com',
        product: {
          name: 'LG 그램 17인치 노트북',
          category: '노트북',
          description: '가벼우면서도 고성능을 자랑하는 17인치 노트북',
          price: '2,190,000원',
          imageUrl: '',
          link: 'https://example.com/lg-gram-17',
          rating: '별점 4.7/5 (리뷰 567개)',
        },
        status: 'processing',
        requestDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
        adminNotes: '재고 확인 중입니다.',
      },
    ];

    // 기존 데이터가 없을 때만 데모 데이터 저장
    if (this.getUsers().length === 0) {
      localStorage.setItem('adminUsers', JSON.stringify(demoUsers));
    }

    if (this.getPurchaseRequests().length === 0) {
      localStorage.setItem('purchaseRequests', JSON.stringify(demoPurchaseRequests));
    }
  }

  // 데이터 초기화 (개발용)
  static clearAllData(): void {
    localStorage.removeItem('adminUsers');
    localStorage.removeItem('purchaseRequests');
  }

  // 데이터 내보내기 (백업용)
  static exportData(): string {
    const data = {
      users: this.getUsers(),
      purchaseRequests: this.getPurchaseRequests(),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  // 데이터 가져오기 (복원용)
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.users && Array.isArray(data.users)) {
        localStorage.setItem('adminUsers', JSON.stringify(data.users));
      }

      if (data.purchaseRequests && Array.isArray(data.purchaseRequests)) {
        localStorage.setItem('purchaseRequests', JSON.stringify(data.purchaseRequests));
      }

      return true;
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      return false;
    }
  }
}