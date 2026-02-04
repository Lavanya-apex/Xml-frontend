// import axios from 'axios'
// import type {
//   User,
//   LoginRequest,
//   RegisterRequest,
//   TokenResponse,
//   Validation,
//   ValidationListResponse,
//   DashboardMetrics,
//   TrendData,
//   ErrorAnalysis,
// } from '../types'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// // Create axios instance
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // Response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = localStorage.getItem('refresh_token')
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
//             refresh_token: refreshToken,
//           })

//           const { access_token, refresh_token } = response.data
//           localStorage.setItem('access_token', access_token)
//           localStorage.setItem('refresh_token', refresh_token)

//           originalRequest.headers.Authorization = `Bearer ${access_token}`
//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         // Clear tokens and redirect to login
//         localStorage.removeItem('access_token')
//         localStorage.removeItem('refresh_token')
//         window.location.href = '/login'
//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

// // Auth API
// export const authAPI = {
//   login: async (credentials: LoginRequest): Promise<TokenResponse> => {
//     const formData = new FormData()
//     formData.append('username', credentials.email)
//     formData.append('password', credentials.password)
    
//     const response = await api.post('/api/v1/auth/login', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     return response.data
//   },

//   register: async (data: RegisterRequest): Promise<User> => {
//     const response = await api.post('/api/v1/auth/register', data)
//     return response.data
//   },

//   getCurrentUser: async (): Promise<User> => {
//     const response = await api.get('/api/v1/users/me')
//     return response.data
//   },
// }

// // Validation API
// // export const validationAPI = {
// //   validateFile: async (
// //     file: File,
// //     requiredElements?: string[],
// //     elementTypes?: Record<string, string>
// //   ): Promise<Validation> => {
// //     const formData = new FormData()
// //     formData.append('file', file)
// //     if (requiredElements) {
// //       formData.append('required_elements', JSON.stringify(requiredElements))
// //     }
// //     if (elementTypes) {
// //       formData.append('element_types', JSON.stringify(elementTypes))
// //     }

// //     const response = await api.post('/api/v1/validations/file', formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     })
// //     return response.data
// //   },

//   // validateURL: async (
//   //   url: string,
//   //   requiredElements?: string[],
//   //   elementTypes?: Record<string, string>
//   // ): Promise<Validation> => {
//   //   const response = await api.post('/api/v1/validations/url', {
//   //     url,
//   //     required_elements: requiredElements,
//   //     element_types: elementTypes,
//   //   })
//   //   return response.data
//   // },

//   // validateExcelBatch: async (file: File): Promise<Validation> => {
//   //   const formData = new FormData()
//   //   formData.append('file', file)

//   //   const response = await api.post('/api/v1/validations/excel-batch', formData, {
//   //     headers: { 'Content-Type': 'multipart/form-data' },
//   //   })
//   //   return response.data
//   // },
 
//     // validateURL: async (
//     //   url: string,
//     //   requiredElements?: string[],
//     //   elementTypes?: Record<string, string>
//     // ): Promise<Validation> => {
//     //   const response = await api.post('/api/v1/validations/url', {
//     //     url, // This will now send "C:/Users/..." as a plain string
//     //     required_elements: requiredElements,
//     //     element_types: elementTypes,
//     //   })
//     //   return response.data
//     // },
//   // Validation API
// export const validationAPI = {
//   validateFile: async (
//     file: File,
//     requiredElements?: string[],
//     elementTypes?: Record<string, string>
//   ): Promise<Validation> => {
//     const formData = new FormData()
//     formData.append('file', file)
//     if (requiredElements) {
//       formData.append('required_elements', JSON.stringify(requiredElements))
//     }
//     if (elementTypes) {
//       formData.append('element_types', JSON.stringify(elementTypes))
//     }

//     const response = await api.post('/api/v1/validations/file', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     return response.data
//   },

//   // FIX: Remove 'export const' from here. Use property syntax.
//   validateURL: async (
//     url: string,
//     requiredElements?: string[],
//     elementTypes?: Record<string, string>
//   ): Promise<Validation> => {
//     const response = await api.post('/api/v1/validations/url', {
//       url: url,
//       required_elements: requiredElements,
//       element_types: elementTypes,
//     });
//     return response.data;
//   },

//   getValidations: async (
//     page: number = 1,
//     pageSize: number = 50,
//     statusFilter?: string,
//     validationType?: string
//   ): Promise<ValidationListResponse> => {
//     const params: any = { page, page_size: pageSize }
//     if (statusFilter) params.status_filter = statusFilter
//     if (validationType) params.validation_type = validationType

//     const response = await api.get('/api/v1/validations/', { params })
//     return response.data
//   },
//   getValidations: async (
//     page: number = 1,
//     pageSize: number = 50,
//     statusFilter?: string,
//     validationType?: string
//   ): Promise<ValidationListResponse> => {
//     const params: any = { page, page_size: pageSize }
//     if (statusFilter) params.status_filter = statusFilter
//     if (validationType) params.validation_type = validationType

//     const response = await api.get('/api/v1/validations/', { params })
//     return response.data
//   },

//   getValidation: async (id: number): Promise<Validation> => {
//     const response = await api.get(`/api/v1/validations/${id}`)
//     return response.data
//   },

//   deleteValidation: async (id: number): Promise<void> => {
//     await api.delete(`/api/v1/validations/${id}`)
//   },
// }

// // Analytics API
// export const analyticsAPI = {
//   getDashboardMetrics: async (): Promise<DashboardMetrics> => {
//     const response = await api.get('/api/v1/analytics/dashboard')
//     return response.data
//   },

//   getTrends: async (period: string = '7days'): Promise<TrendData> => {
//     const response = await api.get('/api/v1/analytics/trends', {
//       params: { period },
//     })
//     return response.data
//   },

//   getErrorAnalysis: async (): Promise<ErrorAnalysis> => {
//     const response = await api.get('/api/v1/analytics/errors')
//     return response.data
//   },
// }

// // User API
// export const userAPI = {
//   updateProfile: async (data: { full_name?: string; email?: string }): Promise<User> => {
//     const response = await api.put('/api/v1/users/me', data)
//     return response.data
//   },

//   changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
//     await api.put('/api/v1/users/me/password', {
//       current_password: currentPassword,
//       new_password: newPassword,
//     })
//   },
// }




import axios from 'axios'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  Validation,
  ValidationListResponse,
  DashboardMetrics,
  TrendData,
  ErrorAnalysis,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// 1. Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3. Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token, refresh_token } = response.data
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// 4. Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response = await api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/api/v1/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/v1/users/me')
    return response.data
  },
}

// 5. Validation API
// Ensure this is NOT inside another object or function
export const validationAPI = {
  validateFile: async (file: File, elements?: string[], types?: Record<string, string>): Promise<Validation> => {
    const formData = new FormData()
    formData.append('file', file)
    if (elements) formData.append('required_elements', JSON.stringify(elements))
    if (types) formData.append('element_types', JSON.stringify(types))
    const response = await api.post('/api/v1/validations/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  validateURL: async (url: string, elements?: string[], types?: Record<string, string>): Promise<Validation> => {
    const response = await api.post('/api/v1/validations/url', {
      url,
      required_elements: elements,
      element_types: types,
    })
    return response.data
  },

  getValidations: async (page = 1, pageSize = 50): Promise<ValidationListResponse> => {
    const response = await api.get('/api/v1/validations/', { params: { page, page_size: pageSize } })
    return response.data
  },

  getValidation: async (id: number): Promise<Validation> => {
    const response = await api.get(`/api/v1/validations/${id}`)
    return response.data
  },

  deleteValidation: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/validations/${id}`)
  },
}

// 6. Analytics API
export const analyticsAPI = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/api/v1/analytics/dashboard')
    return response.data
  },
  getTrends: async (period: string = '7days'): Promise<TrendData[]> => {
    const response = await api.get('/api/v1/analytics/trends', { params: { period } })
    return response.data
  },
  getErrorAnalysis: async (): Promise<ErrorAnalysis[]> => {
    const response = await api.get('/api/v1/analytics/errors')
    return response.data
  },
}


// 7. User API
export const userAPI = {
  updateProfile: async (data: { full_name?: string; email?: string }): Promise<User> => {
    const response = await api.put('/api/v1/users/me', data)
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/api/v1/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}
