// User types
export interface User {
  id: number
  email: string
  full_name?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// Validation types
export interface Validation {
  id: number
  user_id: number
  validation_type: string
  source: string
  status: 'success' | 'failed' | 'partial'
  results: Record<string, any>
  error_details?: Record<string, any>
  execution_time?: number
  created_at: string
}

export interface ValidationListResponse {
  total: number
  page: number
  page_size: number
  items: Validation[]
}

// Analytics types
export interface DashboardMetrics {
  total_validations: number
  successful_validations: number
  failed_validations: number
  success_rate: number
  average_execution_time: number
  validations_today: number
  validations_this_week: number
  validations_this_month: number
}

export interface TrendDataPoint {
  date: string
  total: number
  successful: number
  failed: number
}

export interface TrendData {
  period: string
  data: TrendDataPoint[]
}

export interface ErrorPattern {
  error_type: string
  count: number
  percentage: number
  example_message: string
}

export interface ErrorAnalysis {
  total_errors: number
  patterns: ErrorPattern[]
}

