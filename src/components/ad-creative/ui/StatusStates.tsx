import React from 'react';
import { Search, Sparkles, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EmptyState: React.FC<{ title: string, desc?: string; icon?: 'search' | 'sparkles' | 'layout' }> = ({ title, desc, icon = 'search' }) => {
  const Icon = icon === 'search' ? Search : icon === 'sparkles' ? Sparkles : Layout;
  
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-8 group cursor-pointer">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[40px] group-hover:blur-[60px] transition-all duration-700 animate-pulse" />
        <div className="w-24 h-24 bg-white border border-slate-100 rounded-[30%] flex items-center justify-center relative z-10 shadow-2xl shadow-indigo-100 transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
          <Icon className="w-10 h-10 text-slate-300 group-hover:text-zinc-900 transition-colors" />
        </div>
        <div className="absolute top-[-10px] right-[-10px] w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20">
          <Sparkles className="w-3 h-3 text-white animate-spin-slow" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-[20px] font-black text-slate-900 mb-2 tracking-tight uppercase">{title}</h3>
        {desc && <p className="text-[14px] text-slate-400 max-w-md font-medium leading-relaxed">{desc}</p>}
        {/* Subtle decorative dot grid */}
        <div className="mt-8 grid grid-cols-4 gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="w-0.5 h-0.5 bg-zinc-900 rounded-full" />
           ))}
        </div>
      </div>
    </div>
  );
};

export const LoadingState: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="relative mb-10">
        <div className="w-20 h-20 border-[6px] border-slate-50 border-t-zinc-900 rounded-full animate-spin shadow-xl shadow-zinc-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-[16px] font-black text-slate-800 uppercase tracking-widest animate-pulse">{title}</h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-2">AI Agents are collaborating...</p>
      </div>
    </div>
  );
};
