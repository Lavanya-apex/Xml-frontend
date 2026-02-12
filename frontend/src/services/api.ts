import axios from 'axios'
import type { User, LoginRequest, RegisterRequest, TokenResponse, Validation, DashboardMetrics } from '../types'

// Since your .env has http://localhost:8000/api/v1, we use it directly
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // If sending FormData, remove Content-Type header so axios can set it with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token') 
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH API ====================
export const authAPI = {
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await api.post('/users/', {
      username: data.username,
      email: data.email,
      name: data.name || '',
      password: data.password,
    })
    return response.data.data
  },

  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post('/users/login', {
      username: credentials.username,
      password: credentials.password,
    })
    return response.data.data 
  },

  getCurrentUser: async (passedToken?: string): Promise<User> => {
    const config = passedToken 
      ? { headers: { Authorization: `Bearer ${passedToken}` } }
      : {}
    
    const response = await api.get('/users/iam', config)
    return response.data.data.user
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/users/logout')
    } finally {
      localStorage.removeItem('access_token')
    }
  },
}

// ==================== VALIDATION API ====================
export const validationAPI = {
  validateFile: async (file: File): Promise<Validation> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/validate/', formData)
    return response.data.data
  },

  validateURL: async (url: string): Promise<Validation> => {
    const response = await api.post('/validate/url', { url })
    return response.data.data
  },

  validatePath: async (filePath: string): Promise<Validation> => {
    const response = await api.post('/validate/validate-path', { file_path: filePath })
    return response.data.data
  },

  getValidations: async (page = 1, pageSize = 50): Promise<Validation[]> => {
    const response = await api.get('/validate/', {
      params: { page, page_size: pageSize },
    })
    return response.data.data
  },

  deleteValidation: async (id: number): Promise<void> => {
    await api.delete(`/validate/${id}`)
  },
}

// ==================== XSD API ====================
export const xsdAPI = {
  /**
   * Uploads an XSD file.
   * Based on your Swagger: POST /api/v1/xsd/upload
   */
  uploadXSD: async (file: File, xsdName?: string): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    // If xsdName is provided, add it as a query parameter as per your Swagger image
    const url = xsdName ? `/xsd/upload?xsd_name=${encodeURIComponent(xsdName)}` : '/xsd/upload'
    
    const response = await api.post(url, formData)
    return response.data.data
  },

  /**
   * Retrieves all available XSD schemas.
   * Based on your Swagger: GET /api/v1/xsd/
   */
  getAllXSD: async (): Promise<any[]> => {
    const response = await api.get('/xsd/')
    return response.data.data
  },

  /**
   * Validates an XML file against a specific XSD.
   * Can validate against:
   * - xsdId: Use a previously uploaded XSD schema
   * - xsdFile: Use an XSD file directly
   * Supports format conversion:
   * - inputFormat: 'xml' | 'json' | 'yaml' (format of input file)
   * - outputFormat: 'xml' | 'json' | 'yaml' (desired format of validated output)
   * Based on your Swagger: POST /api/v1/xsd/validate
   */
  validateXMLWithXSD: async (
    xmlFile: File, 
    xsdIdOrFile: number | File,
    inputFormat: string = 'xml',
    outputFormat: string = 'xml'
  ): Promise<any> => {
    const formData = new FormData()
    formData.append('file', xmlFile)
    formData.append('input_format', inputFormat)
    formData.append('output_format', outputFormat)
    
    if (typeof xsdIdOrFile === 'number') {
      // Using existing XSD by ID
      formData.append('xsd_id', xsdIdOrFile.toString())
    } else {
      // Using new XSD file directly
      formData.append('xsd_file', xsdIdOrFile)
    }
    
    const response = await api.post('/xsd/validate', formData)
    return response.data.data
  },
}

// ==================== ANALYTICS API ====================
export const analyticsAPI = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await api.get('/validate/stats');
      const data = response.data?.data;
      return {
        total_validations: data?.totalValidations || 0,
        successful_validations: data?.successful || 0,
        failed_validations: data?.failed || 0,
        success_rate: data?.totalValidations ? (data.successful / data.totalValidations * 100) : 0,
        // Keep the conversion if your backend sends ms
        average_execution_time: (data?.avgTimeMs || 0) / 1000, 
        validations_today: data?.today || 0,
        validations_this_week: data?.last7Days?.reduce((sum: number, d: any) => sum + d.total, 0) || 0,
        validations_this_month: data?.totalValidations || 0,
      };
    } catch (error) {
      console.error("Dashboard fetch failed", error);
      return { total_validations: 0, successful_validations: 0, failed_validations: 0, success_rate: 0, average_execution_time: 0, validations_today: 0, validations_this_week: 0, validations_this_month: 0 };
    }
  },

  getTrends: async () => {
    try {
      const response = await api.get('/validate/stats');
      // Wrap in a data object so trends?.data works in your component
      return { data: response.data?.data?.last7Days || [] };
    } catch (error) {
      return { data: [] };
    }
  }
}

// ==================== USER API ====================
export const userAPI = {
  updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await api.put('/users/me', data)
    return response.data.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}

