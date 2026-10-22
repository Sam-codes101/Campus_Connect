import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fileToBase64 } from '../utils/fileHelpers';
import { 
  Users, 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Link as LinkIcon,
  Upload
} from 'lucide-react';

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Post Form
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState('General');
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'
  const [showImageInput, setShowImageInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  const categories = ['All', 'General', 'Academics', 'Clubs', 'Events', 'Opportunities', 'Help'];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await API.get('/posts', { params });
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      setImageName(file.name);
      const base64 = await fileToBase64(file);
      setImage(base64);
      setShowImageInput(true);
    } catch (err) {
      setError(err.message || 'Error processing selected image');
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      const res = await API.post('/posts', {
        content: content.trim(),
        image: image || undefined,
        category,
      });

      setPosts([res.data.data, ...posts]);
      setContent('');
      handleRemoveImage();
      setShowImageInput(false);
      setCategory('General');
      setSuccessMsg('🎉 Your post has been published to the community feed!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error publishing post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to like posts');
      return;
    }

    try {
      const res = await API.post(`/posts/${postId}/like`);
      const { likes } = res.data.data;
      setPosts(
        posts.map((p) =>
          p._id === postId ? { ...p, likes } : p
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentPost = async (postId, text) => {
    if (!isAuthenticated) {
      alert('Please sign in to leave comments');
      return;
    }

    try {
      const res = await API.post(`/posts/${postId}/comments`, { text });
      setPosts(
        posts.map((p) =>
          p._id === postId ? res.data.data : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      setSuccessMsg('Post deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-emerald-600" />
          <span>Student Community Feed</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share technical queries, hackathon partner requests, campus events, and study advice.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Post Creator Box */}
      {isAuthenticated ? (
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">Post to student community feed</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on campus? Share a question, study resource, or hackathon idea..."
              className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none transition"
            />

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Image Preview Box if attached */}
            {image && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-72 flex items-center justify-center group">
                <img
                  src={image}
                  alt="Post preview"
                  className="w-full h-full max-h-72 object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition shadow-sm"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
                {imageName && (
                  <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] truncate max-w-xs">
                    {imageName}
                  </span>
                )}
              </div>
            )}

            {/* Optional URL input mode */}
            {showImageInput && !image && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowImageInput(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {/* File picker button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Upload image from computer"
                >
                  <Upload className="w-3.5 h-3.5 text-brand-600" />
                  <span>Upload Photo</span>
                </button>

                {/* Paste URL option */}
                {!image && !showImageInput && (
                  <button
                    type="button"
                    onClick={() => setShowImageInput(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    title="Paste web link"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Or link</span>
                  </button>
                )}

                {/* Category selector */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      Tag: {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Posting...' : 'Publish Post'}</span>
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="bg-brand-50/70 border border-brand-200 rounded-3xl p-5 text-center text-xs text-brand-800">
          Want to share a question or join the campus feed?{' '}
          <a href="/login" className="font-bold underline text-brand-700">
            Sign in with your student account
          </a>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <LoadingSpinner text="Loading campus feed..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No posts in this category"
          description="Be the first to share an update or question with your campus mates."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
