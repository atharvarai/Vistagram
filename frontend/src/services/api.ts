import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility function for date formatting
export const formatDate = (dateString: string, format: 'short' | 'long' = 'short') => {
  const date = new Date(dateString);
  const now = new Date();
  
  if (format === 'short') {
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Post {
  id: number;
  username: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  shares_count: number;
  created_at: string;
  is_liked: boolean;
}

export interface TimelineResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getTimeline: async (page: number = 1, perPage: number = 20): Promise<TimelineResponse> => {
    const response = await api.get(`/posts/timeline?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  createPost: async (image: File, caption?: string): Promise<Post> => {
    const formData = new FormData();
    formData.append('image', image);
    if (caption) {
      formData.append('caption', caption);
    }
    
    const response = await api.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  likePost: async (postId: number): Promise<{ liked: boolean }> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  sharePost: async (postId: number): Promise<{ shared: boolean; share_url?: string }> => {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data;
  },

  updatePost: async (postId: number, caption: string): Promise<Post> => {
    const response = await api.put(`/posts/${postId}`, { caption });
    return response.data;
  },

  deletePost: async (postId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
};

export default api; 