import React from 'react';

const FilterBar = ({ label, options, value, onChange }) => {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
          {label}:
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
