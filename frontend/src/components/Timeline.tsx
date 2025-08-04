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
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="max-w-2xl mx-auto px-4">
      {/* Create Post Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full bg-white rounded-xl p-4 flex justify-center items-center space-x-3 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 shadow-sm transform hover:scale-[1.02]"
          style={{ border: 'none', outline: 'none' }}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-gray-700 font-medium">Create a new post</span>
        </button>
      </div>

      {/* Posts Feed */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading posts...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
            />
          ))}

          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Load More
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center pt-6">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm font-medium">You've reached the end</p>
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