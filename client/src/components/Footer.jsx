import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Campus Connect</span>
            <span className="text-slate-400 text-xs">— Centralized College Platform</span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by 4 CSE Students • Mini Project 2026
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <span>Academic Hub</span>
            <span>Lost & Found</span>
            <span>Community</span>
            <span>Updates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
