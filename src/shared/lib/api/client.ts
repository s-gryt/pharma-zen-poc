/**
 * HTTP API client
 * 
 * Centralized HTTP client with interceptors, error handling,
 * and authentication token management.
 * 
 * @fileoverview HTTP client configuration and utilities
 */

import { ApiResponse, ApiError } from './types';

/**
 * HTTP methods supported by the API client
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request configuration options
 */
interface RequestConfig {
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, string | number | boolean>;
  readonly signal?: AbortSignal;
}

/**
 * API client class providing HTTP request methods
 * with built-in error handling and authentication
 */
class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add query parameters
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers = {
      ...this.defaultHeaders,
      ...config?.headers,
    };

    const requestInit: RequestInit = {
      method,
      headers,
      signal: config?.signal,
    };

    // Add request body for non-GET requests
    if (data && method !== 'GET') {
      requestInit.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), requestInit);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const result: ApiResponse<T> = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiClientError(error.message);
      }
      throw new ApiClientError('An unexpected error occurred');
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    try {
      const errorData: ApiError = await response.json();
      throw new ApiClientError(errorData.message, response.status, errorData);
    } catch {
      // If JSON parsing fails, use status text
      throw new ApiClientError(
        response.statusText || 'Request failed',
        response.status
      );
    }
  }

  /**
   * GET request method
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST request method
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * PUT request method
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * DELETE request method
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  /**
   * PATCH request method
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }
}

/**
 * Custom error class for API client errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient();

/**
 * Request timeout utility
 */
export const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};