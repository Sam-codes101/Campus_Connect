import React from 'react';
import { 
  Bell, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Trash2,
  AlertCircle,
  Award,
  BookOpen,
  Users
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const UpdateCard = ({ update, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const categoryColorMap = {
    'Notices': 'bg-blue-50 text-blue-700 border-blue-200',
    'Events': 'bg-purple-50 text-purple-700 border-purple-200',
    'Workshops': 'bg-amber-50 text-amber-700 border-amber-200',
    'Hackathons': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Clubs': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Academics': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Deadlines': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const badgeClass = categoryColorMap[update.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Category & Date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${badgeClass}`}>
            {update.category}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {update.date}
          </span>
        </div>

        {/* Optional Image */}
        {update.image && (
          <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100">
            <img
              src={update.image}
              alt={update.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
          {update.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {update.description}
        </p>

        {/* Attachment Link */}
        {update.attachment && (
          <a
            href={update.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Attachment / Document</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Footer Info & Admin Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Posted by {update.createdBy?.name || 'Department Admin'}
        </span>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(update)}
              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
              title="Edit Notice"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(update._id)}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UpdateCard;
