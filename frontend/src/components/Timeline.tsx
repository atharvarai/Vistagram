import React, { useState, useEffect } from 'react';
import { Post as PostType, postsAPI } from '../services/api';
import Post from './Post';
import CreatePost from './CreatePost';

const Timeline: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const fetchPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await postsAPI.getTimeline(pageNum, 20);
      
      if (append) {
        setPosts(prev => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }
      
      setHasMore(response.posts.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  const handlePostUpdate = () => {
    fetchPosts();
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Something went wrong</h3>
            <p className="text-slate-600 mb-8">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Discover Amazing Places
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore and share your travel experiences with the world
          </p>
        </div>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Post
        </button>
      </div>

      {/* Posts Grid */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">Loading posts...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
            />
          ))}

          {hasMore && (
            <div className="text-center pt-12">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600 mr-3"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Load More Posts
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center pt-12">
              <div className="inline-flex items-center px-6 py-4 bg-slate-100 rounded-2xl">
                <svg className="w-6 h-6 text-slate-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-slate-600 font-medium">You've reached the end</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showCreatePost && (
        <CreatePost
          onPostCreated={handlePostCreated}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </div>
  );
};

export default Timeline; 