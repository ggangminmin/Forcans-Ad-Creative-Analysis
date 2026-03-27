import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Search, PenTool, Palette } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center shadow-2xl shadow-purple-200 animate-in zoom-in-0 duration-700">
        <Sparkles className="text-white w-8 h-8" />
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-tight animate-in slide-in-from-bottom-4 duration-700 delay-75">
        AI Ad Creative <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">SaaS Agent Hub</span>
      </h1>
      
      <p className="text-slate-500 text-lg mb-10 max-w-xl font-medium animate-in slide-in-from-bottom-4 duration-700 delay-150">
        최신 트렌드 분석부터 감성 카피라이팅, 시각화 시안까지. <br/>
        광고 마케팅의 모든 과정을 에이전트 협업으로 자동화합니다.
      </p>
      
      <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
        <Link href="/ad-creative">
          <Button size="lg" className="rounded-full h-16 px-12 bg-slate-900 hover:bg-slate-800 text-xl font-bold gap-3 shadow-2xl shadow-slate-200 transition-all hover:scale-105 active:scale-95 group">
            POC 체험하기
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl animate-in slide-in-from-bottom-8 duration-1000 delay-500">
        <FeatureItem 
          icon={<Search className="w-5 h-5 text-purple-600" />}
          title="Scouter Agent" 
          desc="인기 검색어 및 SNS 피고 문구 패턴 분석" 
        />
        <FeatureItem 
          icon={<PenTool className="w-5 h-5 text-indigo-600" />}
          title="Writer Agent" 
          desc="스토리 구조를 가진 감성 톤 카피 설계" 
        />
        <FeatureItem 
          icon={<Palette className="w-5 h-5 text-pink-600" />}
          title="Designer Agent" 
          desc="9컷 이미지 시안 및 레이아웃 가이드" 
        />
      </div>

      <footer className="mt-24 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
        <span>Powered by Antigravity Agentic Coding</span>
      </footer>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-extrabold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-400 font-bold leading-relaxed">{desc}</p>
    </div>
  );
}