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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar showUserInfo={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar showUserInfo={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-8">{error}</p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar showUserInfo={false} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center p-8">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {post.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-6 flex-1">
              <p className="text-lg font-semibold text-slate-900">{post.username}</p>
              <p className="text-sm text-slate-500">{formatDate(post.created_at, 'long')}</p>
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
                target.src = 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Vistagram';
              }}
            />
          </div>

          {/* Post Stats */}
          <div className="p-8">
            <div className="flex items-center space-x-8 mb-6">
              <div className="flex items-center space-x-3 text-slate-500">
                <div className="p-2 rounded-xl bg-slate-50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold">{post.likes_count}</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-500">
                <div className="p-2 rounded-xl bg-slate-50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold">{post.shares_count}</span>
              </div>
            </div>

            {/* Post Caption */}
            {post.caption && (
              <div className="mb-2">
                <p className="text-base text-slate-900 leading-relaxed">
                  <span className="font-bold">{post.username}</span> {post.caption}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Join Vistagram</h2>
            <p className="text-slate-600 text-lg mb-8">Discover amazing places and share your own experiences!</p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore More Posts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPost; 