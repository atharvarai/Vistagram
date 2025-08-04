import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { formatDate } from '../services/api';
import Navbar from './Navbar';

interface PublicPostData {
  id: number;
  username: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  shares_count: number;
  created_at: string;
}

const PublicPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PublicPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_BASE_URL}/posts/${postId}/public`);
        setPost(response.data);
      } catch (error: any) {
        console.error('Failed to fetch post:', error);
        setError('Post not found or has been removed');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showUserInfo={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showUserInfo={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-3">Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showUserInfo={false} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center px-4 py-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {post.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-900">{post.username}</p>
              <p className="text-xs text-gray-500">{formatDate(post.created_at, 'long')}</p>
            </div>
          </div>

          {/* Post Image */}
          <div className="relative">
            <img
              src={`${config.API_BASE_URL.replace('/api/v1', '')}${post.image_url}`}
              alt={post.caption || 'Post image'}
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Vistagram';
              }}
            />
          </div>

          {/* Post Actions */}
          <div className="px-4 py-3">
            <div className="flex items-center space-x-4 mb-3">
              <button 
                className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200"
                style={{ border: 'none', background: 'none', outline: 'none' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                style={{ border: 'none', background: 'none', outline: 'none' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>

            {/* Likes Count */}
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900">{post.likes_count} likes</p>
            </div>

            {/* Post Caption */}
            {post.caption && (
              <div className="mb-3">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{post.username}</span> {post.caption}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="object-contain"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Join Vistagram</h2>
            <p className="text-gray-700 text-sm mb-4">Discover amazing places and share your own experiences!</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border text-white rounded-lg hover:bg-blue-100 font-medium transition-colors duration-200"
            >
              <span className="text-blue-500">Explore More Posts</span>
              <svg className="w-5 h-5 ml-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPost; 