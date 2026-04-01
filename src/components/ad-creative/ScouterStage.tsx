import React from 'react';
import { TrendingUp, AlertTriangle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ScouterStageProps {
  scoutResult: any;
  generateNarrative: () => void;
  loading: boolean;
  onSelectPhrase?: (phrase: string) => void;
}

export const ScouterStage: React.FC<ScouterStageProps> = ({ scoutResult, generateNarrative, loading, onSelectPhrase }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Hero Insight Card */}
      <section className="relative group perspective-1000">
        <div className="absolute inset-0 bg-zinc-900 rounded-[40px] transform transition-transform group-hover:scale-[1.01] shadow-2xl shadow-zinc-300 z-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] transition-all group-hover:bg-indigo-500/20" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] transition-all group-hover:bg-rose-500/20" />
        </div>
        
        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-indigo-500 rounded-full" />
              <div className="bg-white/10 text-white/80 border border-white/20 px-3 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full">
                핵심 통찰 (Core Insight)
              </div>
            </div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-white leading-tight tracking-tight">
              "{scoutResult.insight}"
            </h2>
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-[11px] tracking-wide font-bold uppercase overflow-hidden">
              <TrendingUp className="w-4 h-4" /> 
              시장 트렌드 검증 완료
            </div>
          </div>
          
          <Button 
            className="h-16 px-10 bg-white text-zinc-900 hover:bg-zinc-100 rounded-[28px] font-bold text-[15px] gap-4 shadow-xl transition-all hover:scale-105 active:scale-95 group/btn" 
            onClick={generateNarrative}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                내러티브 생성하기
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keywords */}
        <Card className="lg:col-span-2 p-8 border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[13px] font-bold text-slate-800 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              실시간 트렌드 키워드
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {scoutResult.trending_keywords?.map((kw: string, idx: number) => (
              <span 
                key={kw} 
                className="px-5 py-2.5 bg-slate-50 text-slate-800 rounded-2xl text-[14px] font-bold border border-slate-200/50 transition-all hover:bg-zinc-900 hover:text-white hover:scale-105 hover:-rotate-1 cursor-default"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                #{kw}
              </span>
            ))}
          </div>
        </Card>

        {/* Tired Phrases */}
        <Card className="p-8 border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-[13px] font-bold text-slate-800 tracking-wider flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              광고 피로도 (Fatigue)
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">클릭하여 커스텀 카피로 채택</p>
          </div>
          <div className="space-y-3">
            {scoutResult.tired_phrases?.map((p: string) => (
              <button 
                key={p} 
                onClick={() => onSelectPhrase?.(p)}
                className="w-full flex items-center gap-3 group p-2 hover:bg-slate-50 rounded-xl transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center transition-colors group-hover:bg-rose-100">
                  <X className="w-3.5 h-3.5 text-rose-500 group-hover:hidden" />
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 hidden group-hover:block" />
                </div>
                <span className="text-[13px] text-slate-600 font-semibold group-hover:text-zinc-900 transition-colors text-left flex-1">{p}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Context */}
      {scoutResult.content_trends?.length > 0 && (
        <Card className="p-8 border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] shadow-sm">
          <h3 className="text-[13px] font-bold text-slate-400 tracking-widest uppercase mb-6 px-1">크리에이티브 레퍼런스</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoutResult.content_trends?.map((t: any) => (
              <div key={t.title} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-[24px] transition-all hover:border-zinc-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-slate-100 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 translate-y-[-8px] z-0 group-hover:bg-indigo-50 transition-colors" />
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:bg-zinc-900 group-hover:text-white transition-all z-10 shrink-0">
                  {t.type}
                </div>
                <div className="z-10 overflow-hidden">
                  <h4 className="text-[16px] font-bold text-slate-800 mb-1 leading-tight truncate">{t.title}</h4>
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {t.keywords?.map((k: string) => (
                      <span key={k} className="text-[11px] font-bold text-slate-400 whitespace-nowrap">#{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
