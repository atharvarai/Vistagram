import React, { useState } from 'react';
import { Post as PostType, postsAPI, formatDate } from '../services/api';
import config from '../config';

interface PostProps {
  post: PostType;
  onPostUpdate: () => void;
}

const Post: React.FC<PostProps> = ({ post, onPostUpdate }) => {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [sharesCount, setSharesCount] = useState(post.shares_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.likePost(post.id);
      setLiked(response.liked);
      setLikesCount(prev => response.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.sharePost(post.id);
      setSharesCount(prev => prev + 1);
      
      if (response.share_url) {
        try {
          await navigator.clipboard.writeText(response.share_url);
          alert('Share link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
      }
    } catch (error) {
      console.error('Failed to share post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-8 max-w-lg mx-auto">
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
          <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
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
            onClick={handleLike}
            disabled={loading}
            className={`p-2 transition-all duration-200 ${
              liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            style={{ border: 'none', background: 'none', outline: 'none' }}
          >
            <svg
              className="w-6 h-6"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={liked ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button
            onClick={handleShare}
            disabled={loading}
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
          <p className="text-sm font-semibold text-gray-900">{likesCount} likes</p>
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
  );
};

export default Post; 