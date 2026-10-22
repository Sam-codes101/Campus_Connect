import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle, 
  Trash2, 
  Tag, 
  Clock,
  Sparkles
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LostFoundCard = ({ item, onToggleStatus, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const isOwner = user && item.postedBy && (item.postedBy._id === user._id || item.postedBy === user._id);
  const canModify = isOwner || isAdmin;

  const isResolved = item.status === 'Resolved';
  const isLost = item.type === 'Lost';

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between group ${
      isResolved ? 'border-slate-200 bg-slate-50/60 opacity-90' : 'border-slate-200 hover:shadow-md'
    }`}>
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
              isLost 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {item.type} Item
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              {item.category}
            </span>
          </div>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isResolved 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isResolved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            {item.status}
          </span>
        </div>

        {/* Optional Image */}
        {item.image && (
          <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className={`font-bold text-slate-900 leading-snug ${isResolved ? 'line-through text-slate-500' : ''}`}>
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Details list */}
        <div className="space-y-1.5 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate"><strong>Location:</strong> {item.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span><strong>Date:</strong> {item.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium truncate"><strong>Contact:</strong> {item.contact}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          By {item.postedBy?.name || 'Student'}
        </span>

        <div className="flex items-center gap-2">
          {canModify && (
            <button
              onClick={() => onToggleStatus(item._id, isResolved ? 'Active' : 'Resolved')}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                isResolved
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isResolved ? 'Reopen' : 'Mark Resolved'}</span>
            </button>
          )}

          {canModify && (
            <button
              onClick={() => onDelete(item._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LostFoundCard;
