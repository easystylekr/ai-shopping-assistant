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
}