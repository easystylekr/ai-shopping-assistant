import { ReactNode } from "react";

export interface Product {
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  link: string;
  rating: string;
}

export interface Message {
  id: number;
  role: 'user' | 'ai' | 'system';
  content: string;
  product?: Product; // A single recommended product
  sources?: { uri: string; title: string; }[];
}

export interface User {
  email: string;
  id?: string;
  joinDate?: string;
  lastActive?: string;
  totalPurchaseRequests?: number;
}

// 구매 대행 요청 인터페이스
export interface PurchaseRequest {
  id: string;
  userId: string;
  userEmail: string;
  product: Product;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestDate: string;
  completedDate?: string;
  notes?: string;
  adminNotes?: string;
}

// 관리자 사용자 인터페이스
export interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// 대시보드 통계 인터페이스
export interface DashboardStats {
  totalUsers: number;
  totalPurchaseRequests: number;
  pendingRequests: number;
  completedRequests: number;
  todayRequests: number;
  monthlyRequests: number;
}