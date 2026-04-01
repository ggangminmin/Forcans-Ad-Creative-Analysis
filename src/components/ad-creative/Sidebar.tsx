import React from 'react';
import { Search, CheckCircle2, Monitor, Smartphone, Layout, PenTool, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Stage, Tone, MediaFormat, TONE_CONFIG, MEDIA_OPTIONS } from './constants';

interface SidebarProps {
  stage: Stage;
  setStage: (s: Stage) => void;
  category: string;
  setCategory: (c: string) => void;
  productName: string;
  setProductName: (p: string) => void;
  customCopy: string;
  setCustomCopy: (cc: string) => void;
  selectedTone: Tone;
  setSelectedTone: (t: Tone) => void;
  mediaFormat: MediaFormat;
  setMediaFormat: (m: MediaFormat) => void;
  scoutResult: any;
  writerResult: any;
  designResult: any;
  loading: boolean;
  loadingStage: Stage | null;
  startAnalysis: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stage, setStage, category, setCategory, productName, setProductName,
  customCopy, setCustomCopy, selectedTone, setSelectedTone,
  mediaFormat, setMediaFormat, scoutResult, writerResult, designResult,
  loading, loadingStage, startAnalysis
}) => {
  const canStart = category.trim() !== '' && productName.trim() !== '';

  return (
    <aside className="w-[300px] h-full bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all shrink-0">
      <div className="p-6 shrink-0 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-slate-900 tracking-tight leading-none mb-1">광고 소재 제안</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="px-6 py-8 space-y-8">
          {/* Main Info */}
          <div className="space-y-5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">필수 정보 (Required)</label>
            
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-900 ml-1">제품명 (Product Name)</span>
              <Input 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)}
                className="h-11 text-[13px] border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-zinc-500/10 focus:border-zinc-300 transition-all px-4 font-medium" 
                placeholder="Ex. 딥클렌징 오일" 
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-900 ml-1">카테고리 (Category)</span>
              <div className="relative group">
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 text-[13px] border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-zinc-500/10 focus:border-zinc-300 transition-all pr-10 pl-4 font-medium" 
                  placeholder="Ex. 스킨케어" 
                />
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-300 group-focus-within:text-zinc-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Optional Info */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">추가 정보 (Optional)</label>
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-900 ml-1">핵심 카피 / 훅 (Hook)</span>
              <textarea 
                value={customCopy}
                onChange={(e) => setCustomCopy(e.target.value)}
                className="w-full h-24 p-4 text-[13px] border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-zinc-500/10 focus:border-zinc-300 transition-all font-medium resize-none placeholder:text-slate-300"
                placeholder="직접 강조하고 싶은 문구나 혜택을 적어주세요."
              />
            </div>
          </div>

          {/* Media Format */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">광고 비율 (Ratio)</label>
            <div className="grid grid-cols-2 gap-2">
              {MEDIA_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isSelected = mediaFormat === opt.id;
                return (
                  <button 
                    key={opt.id} 
                    onClick={() => setMediaFormat(opt.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl transition-all border group relative overflow-hidden",
                      isSelected 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-[1.02]" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mb-2", isSelected ? "text-zinc-300" : "text-slate-400 group-hover:text-zinc-500")} />
                    <span className="text-[10px] font-bold tracking-tight">{opt.label}</span>
                    <span className={cn("text-[8px] opacity-60 mt-0.5", isSelected ? "text-zinc-400" : "text-slate-400")}>{opt.ratio}</span>
                    {isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">스타일 톤 (Tone)</label>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(TONE_CONFIG) as Tone[]).map(tone => {
                const isSelected = selectedTone === tone;
                return (
                  <button 
                    key={tone} 
                    onClick={() => setSelectedTone(tone)}
                    className={cn(
                      "group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[12px] font-semibold transition-all border",
                      isSelected 
                        ? "bg-slate-50 text-zinc-900 border-slate-200 shadow-inner" 
                        : "bg-white text-slate-500 border-transparent hover:bg-slate-50/50"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125",
                        isSelected ? "ring-4 ring-zinc-100" : ""
                      )} 
                      style={{ background: tone === '감성' ? '#fb7185' : tone === '대담' ? '#f97316' : tone === '유머' ? '#10b981' : '#8b5cf6' }} 
                    />
                    {tone}
                    {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-zinc-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col gap-2">
              {[
                { id: 'scouter', label: '시장 트렌드 분석 (Scouter)', result: scoutResult, icon: Search },
                { id: 'writer', label: '카피라이팅 (Writer)', result: writerResult, icon: PenTool },
                { id: 'designer', label: '비주얼 디렉팅 (Designer)', result: designResult, icon: ImageIcon },
              ].map((item, idx) => {
                const isCurrent = stage === item.id;
                const isDone = item.result;
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => { if (isDone) setStage(item.id as Stage); }}
                    disabled={!isDone && !isCurrent}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[13px] font-bold transition-all border-2",
                      isCurrent 
                        ? "bg-zinc-50 border-zinc-900 text-zinc-900" 
                        : isDone 
                          ? "bg-white border-transparent text-slate-600 hover:bg-slate-50" 
                          : "bg-transparent border-transparent text-slate-300 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                      isCurrent ? "bg-zinc-900 text-white" : isDone ? "bg-slate-100 text-slate-600" : "bg-slate-50 text-slate-300"
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] uppercase tracking-tighter opacity-50 mb-1">Step 0{idx + 1}</span>
                      <span className="break-keep text-left">{item.label}</span>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
            
            <Button 
              className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[24px] font-bold text-[14px] gap-3 shadow-xl shadow-zinc-200 transition-all hover:translate-y-[-2px] active:scale-95 disabled:opacity-30 disabled:translate-y-0 disabled:cursor-not-allowed"
              onClick={startAnalysis} 
              disabled={loading || !canStart}
            >
              {loading && loadingStage === 'scouter' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Layout className="w-5 h-5" />
              )}
              {scoutResult ? 'RE-ANALYZE' : 'START ANALYSIS'}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
