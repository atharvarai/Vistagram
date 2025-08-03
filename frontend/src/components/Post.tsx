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
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
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
          <p className="text-sm text-slate-500">{formatDate(post.created_at)}</p>
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

      {/* Post Actions */}
      <div className="p-8">
        <div className="flex items-center space-x-8 mb-6">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-3 transition-all duration-200 ${
              liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all duration-200 ${
              liked ? 'bg-red-50' : 'hover:bg-slate-50'
            }`}>
              <svg
                className="w-7 h-7"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">{likesCount}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={loading}
            className="flex items-center space-x-3 text-slate-500 hover:text-blue-500 transition-all duration-200"
          >
            <div className="p-2 rounded-xl hover:bg-slate-50 transition-all duration-200">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">{sharesCount}</span>
          </button>
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
  );
};

export default Post; 