import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Trash2, 
  Send, 
  Calendar,
  Tag
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const PostCard = ({ post, onLike, onComment, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const isAuthor = user && post.author && (post.author._id === user._id || post.author === user._id);
  const canDelete = isAuthor || isAdmin;
  const hasLiked = user && post.likes?.some((id) => (typeof id === 'string' ? id : id._id) === user._id);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    await onComment(post._id, commentText);
    setCommentText('');
    setSubmittingComment(false);
  };

  const categoryColorMap = {
    'General': 'bg-slate-100 text-slate-700',
    'Academics': 'bg-blue-50 text-blue-700',
    'Clubs': 'bg-purple-50 text-purple-700',
    'Events': 'bg-amber-50 text-amber-700',
    'Opportunities': 'bg-emerald-50 text-emerald-700',
    'Help': 'bg-rose-50 text-rose-700',
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Post Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={post.author?.name || 'Student'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {post.author?.name || 'CSE Student'}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>{post.author?.branch || 'CSE'} • {post.author?.year || '3rd Year'}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
          }`}>
            {post.category}
          </span>

          {canDelete && (
            <button
              onClick={() => onDelete(post._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
        {post.content}
      </p>

      {/* Post Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden max-h-96 bg-slate-50 border border-slate-100">
          <img
            src={post.image}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Action Buttons: Like & Comment */}
      <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            hasLiked
              ? 'text-rose-600 bg-rose-50 font-bold'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
          <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <MessageCircle className="w-4 h-4 text-slate-500" />
          <span>{post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-3 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
            {post.comments?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Be the first to comment!</p>
            ) : (
              post.comments?.map((comment, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <img
                    src={comment.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={comment.user?.name || 'Student'}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{comment.user?.name || 'Student'}</span>
                      <span className="text-[10px] text-slate-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
