import React from 'react';
import { ArrowRight, BarChart3, TrendingUp, CheckCircle2, Sparkles, PenTool, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tone, TONE_CONFIG, CTR_DATA, MAX_ITEMS, AdCopy } from './constants';

interface WriterStageProps {
  writerResult: { insight_applied: string, copies: AdCopy[] };
  selectedTone: Tone;
  showCtrPanel: boolean;
  setShowCtrPanel: (b: boolean) => void;
  generateDesign: (id: number) => void;
  updateCopy: (id: number, fields: Partial<AdCopy>) => void;
  regenerateCopy: (id: number) => void;
  isLoading?: boolean;
  loadingCopyId?: number | null;
}

export const WriterStage: React.FC<WriterStageProps> = ({ 
  writerResult, selectedTone, showCtrPanel, setShowCtrPanel, generateDesign,
  updateCopy, regenerateCopy, isLoading, loadingCopyId
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);

  // Limit to 4 copies
  const filteredCopies = (writerResult?.copies || []).slice(0, MAX_ITEMS);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">내러티브 제안 (Narrative Proposal)</h2>
          </div>
          <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            {filteredCopies.length}개의 최적화된 후크 발견 (4개 제한)
          </p>
        </div>
        
        <button 
          onClick={() => setShowCtrPanel(!showCtrPanel)}
          className={cn(
            "group flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[12px] font-black transition-all border shadow-lg shadow-zinc-100 uppercase tracking-widest",
            showCtrPanel 
              ? "bg-zinc-900 text-white border-zinc-900 scale-105" 
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
          )}
        >
          <BarChart3 className={cn("w-4 h-4 transition-transform", showCtrPanel ? "text-indigo-400" : "text-slate-400 group-hover:scale-110")} />
          CTR 성과 시뮬레이션
        </button>
      </div>

      {/* CTR AI Simulation Panel (same as before) */}
      {showCtrPanel && (
        <Card className="p-8 border-slate-200 bg-white/80 backdrop-blur-2xl rounded-[32px] animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-indigo-100/50 border-t-indigo-500">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">AI 성과 지수 (Performance Index)</h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-2xl">
                페르소나 기반 엔진이 각 연령대 및 관심사 그룹별 반응을 시뮬레이션합니다.
                <span className="block mt-1 text-slate-400 text-[11px] font-bold">캘리브레이션: GPT-4o Persona Simulation v2.1</span>
              </p>
            </div>
            <div className="flex-shrink-0 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">엔진 가동 중</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {Object.entries(CTR_DATA).map(([tone, targets]) => (
              <div key={tone} className="space-y-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-slate-200 group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-bold text-slate-800 uppercase tracking-widest">{tone}</p>
                </div>
                {targets.map(t => (
                  <div key={t.target} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400 uppercase tracking-tighter">{t.target}</span>
                      <span className="text-zinc-900 tracking-tight">{t.ctr}% CTR <span className="opacity-30 text-[9px]">SIM</span></span>
                    </div>
                    <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden p-[2px]">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000 group-hover:translate-x-0", t.color)} 
                        style={{ width: `${(t.ctr / 7) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Narrative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {filteredCopies.map((copy: any) => {
          const toneKey = copy.tone as Tone;
          const cfg = TONE_CONFIG[toneKey] || TONE_CONFIG['감성'];
          const isEditing = editingId === copy.id;

          return (
            <Card key={copy.id} className="group p-8 border-slate-100 bg-white/60 backdrop-blur-xl rounded-[40px] hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 transition-all flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full translate-x-12 translate-y-[-12px] group-hover:bg-indigo-50/50 transition-colors z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border transition-colors", cfg.bg, cfg.color, cfg.border)}>
                    {copy.tone} 스타일
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => regenerateCopy(copy.id)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-zinc-900 hover:border-zinc-300 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setEditingId(isEditing ? null : copy.id)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all border",
                        isEditing ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:text-zinc-900 hover:border-zinc-300"
                      )}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <input 
                        className="w-full text-[18px] font-bold text-slate-900 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500 px-1 py-1"
                        value={copy.headline}
                        onChange={e => updateCopy(copy.id, { headline: e.target.value })}
                        placeholder="헤드라인 입력"
                      />
                      <input 
                        className="w-full text-[13px] font-bold text-slate-500 bg-transparent border-b border-indigo-100 focus:outline-none focus:border-indigo-400 px-1 py-1"
                        value={copy.subheadline}
                        onChange={e => updateCopy(copy.id, { subheadline: e.target.value })}
                        placeholder="서브헤드라인 입력"
                      />
                      <textarea 
                        className="w-full text-[14px] text-slate-600 bg-transparent border border-indigo-50 rounded-xl focus:outline-none focus:border-indigo-300 p-3 h-24 resize-none leading-relaxed"
                        value={copy.body}
                        onChange={e => updateCopy(copy.id, { body: e.target.value })}
                        placeholder="본문 내용을 입력하세요..."
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-[20px] font-bold text-slate-900 leading-tight transition-colors group-hover:text-indigo-900">
                        "{copy.headline}"
                      </h3>
                      <p className="text-[14px] text-slate-500 font-bold leading-none tracking-tight">
                        {copy.subheadline}
                      </p>
                      <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                        {copy.body}
                      </p>
                    </>
                  )}
                </div>

                <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 max-w-[60%]">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold overflow-hidden text-ellipsis whitespace-nowrap leading-tight">
                      {copy.visual_direction}
                    </span>
                  </div>
                  
                  <Button 
                    className={cn(
                      "h-12 px-8 rounded-2xl text-[12px] font-bold gap-3 shadow-xl shadow-zinc-100 transform active:scale-95 transition-all group/btn",
                      isLoading && loadingCopyId === copy.id 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    )}
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      generateDesign(copy.id);
                    }}
                  >
                    {isLoading && loadingCopyId === copy.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        비주얼 생성하기
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
