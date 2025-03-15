import axios, { AxiosInstance, AxiosResponse } from 'axios'

interface ApiConfig {
  baseURL: string
}

export interface ApiResponse<T> {
  data: T
  status: number
}

export class ApiError extends Error {
  constructor(
    public message: string,
    // eslint-disable-next-line no-unused-vars
    public status?: number,
    // eslint-disable-next-line no-unused-vars
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private client: AxiosInstance

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      validateStatus: () => true,
      // Removed default Content-Type header
    })
  }

  async get<T>(
    path: string,
    token?: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

      const response: AxiosResponse<T> = await this.client.get(path, {
        params,
        headers,
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T, D>(path: string, token?: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

      // Only set Content-Type for non-FormData requests
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      const response: AxiosResponse<T> = await this.client.post(path, data, {
        headers,
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T, D>(path: string, token?: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

      // Only set Content-Type for non-FormData requests
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      const response: AxiosResponse<T> = await this.client.put(path, data, {
        headers,
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async patch<T, D>(path: string, token?: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

      // Only set Content-Type for non-FormData requests
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      const response: AxiosResponse<T> = await this.client.patch(path, data, {
        headers,
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T, D>(path: string, token?: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

      // Only set Content-Type for non-FormData requests
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      const response: AxiosResponse<T> = await this.client.delete(path, {
        headers,
        data, // Axios puts this in the request body for DELETE
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return new ApiError(
        error.response?.data?.message || error.message,
        error.response?.status,
        error.code,
      )
    }
    return new ApiError('An unexpected error occurred')
  }
}

export const api = new ApiClient({
  baseURL: 'http://127.0.0.1:5000/api',
})
