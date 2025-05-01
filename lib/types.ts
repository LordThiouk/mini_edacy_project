export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ProductData {
  name: string
  description: string
  price: number
  stock: number
  category: string
}
