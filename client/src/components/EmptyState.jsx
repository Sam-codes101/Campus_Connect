import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records matching your criteria yet.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
