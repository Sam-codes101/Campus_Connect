import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  User, 
  Trash2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ResourceCard = ({ resource, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const isOwner = user && resource.uploadedBy && (resource.uploadedBy._id === user._id || resource.uploadedBy === user._id);
  const canDelete = isOwner || isAdmin;

  const typeColorMap = {
    'Notes': 'bg-blue-50 text-blue-700 border-blue-200',
    'PYQs': 'bg-amber-50 text-amber-700 border-amber-200',
    'Lab Files': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Assignments': 'bg-purple-50 text-purple-700 border-purple-200',
    'Study Material': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const badgeClass = typeColorMap[resource.type] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${badgeClass}`}>
            {resource.type}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {resource.semester}
          </span>
        </div>

        {/* Title & Subject */}
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {resource.title}
          </h3>
          <p className="text-xs font-medium text-brand-700 mt-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{resource.subject}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{resource.branch}</span>
          </p>
        </div>

        {/* Description */}
        {resource.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700 truncate">
              {resource.uploadedBy?.name || 'CSE Student'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white rounded-xl text-xs font-semibold transition-all duration-150"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View / Download</span>
          </a>

          {canDelete && (
            <button
              onClick={() => onDelete(resource._id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
