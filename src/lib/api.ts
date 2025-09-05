import axios, { AxiosInstance } from 'axios';
import {
  BearerResponse,
  LoginRequest,
  PromotionRead,
  PromotionCreate,
  PromotionUpdate,
  StaticFileType
} from '@/types';

const API_BASE_URL = 'https://api.komandor-stock.ru/promo_api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
    // Also set a cookie for middleware
    document.cookie = `access_token=${token}; path=/; max-age=${24 * 60 * 60}`; // 1 day
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    // Clear the cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // Authentication
  async login(credentials: Omit<LoginRequest, 'grant_type'>): Promise<BearerResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');

    const response = await this.client.post<BearerResponse>('/auth/jwt/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.setToken(response.data.access_token);
    return response.data;
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Promotions
  async getPromotions(options?: {
    include_inactive?: boolean;
    parent_id?: string;
  }): Promise<PromotionRead[]> {
    const params = new URLSearchParams();
    if (options?.include_inactive) {
      params.append('include_inactive', 'true');
    }
    if (options?.parent_id) {
      params.append('parent_id', options.parent_id);
    }

    const response = await this.client.get<PromotionRead[]>(`/promotions?${params}`);
    return response.data;
  }

  async createPromotion(promotion: PromotionCreate): Promise<PromotionRead> {
    const response = await this.client.post<PromotionRead[]>('/promotions', [promotion]);
    return response.data[0];
  }

  async updatePromotion(promotion: PromotionUpdate): Promise<PromotionRead> {
    const response = await this.client.put<PromotionRead>('/promotions', promotion);
    return response.data;
  }

  async deletePromotion(promotionId: string): Promise<void> {
    await this.client.delete(`/promotions/${promotionId}`);
  }

  // File management
  async uploadFile(
    file: File,
    promotionId: string,
    fileType: StaticFileType,
    caption?: string,
    order?: number
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('promotion_id', promotionId);
    formData.append('file_type', fileType);
    if (caption) formData.append('caption', caption);
    if (order !== undefined) formData.append('order', order.toString());

    await this.client.post('/static/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateFile(
    fileId: string,
    file: File | null,
    promotionId: string,
    fileType: StaticFileType,
    caption?: string,
    order?: number
  ): Promise<void> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('promotion_id', promotionId);
    formData.append('file_type', fileType);
    if (caption) formData.append('caption', caption);
    if (order !== undefined) formData.append('order', order.toString());

    await this.client.put('/static/update/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteFile(filePathOrId: string): Promise<void> {
    // Extract file ID from file_path if it's a full path
    let fileId = filePathOrId;
    if (filePathOrId.includes('/')) {
      // Extract UUID from file path (last part after last slash)
      const parts = filePathOrId.split('/');
      const fileName = parts[parts.length - 1];
      // Remove file extension to get UUID
      fileId = fileName.split('.')[0];
    }

    await this.client.delete(`/static/files/${fileId}`);
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    await this.client.delete('/static', {
      data: { file_ids: fileIds }
    });
  }

  getFileUrl(promotionId: string, fileType: StaticFileType, fileName: string): string {
    return `${API_BASE_URL}/static/${promotionId}/${fileType}/${fileName}`;
  }

  // Helper function to build file URL from file_path
  buildFileUrl(filePath: string): string {
    // If file_path already contains full URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    // If file_path starts with 'static/', prepend API base URL
    if (filePath.startsWith('static/')) {
      return `${API_BASE_URL}/${filePath}`;
    }
    // If file_path is just a relative path, prepend API base URL
    return `${API_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }
}

export const apiClient = new ApiClient();