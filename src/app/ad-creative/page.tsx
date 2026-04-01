'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ad-creative/Sidebar';
import { ScouterStage } from '@/components/ad-creative/ScouterStage';
import { WriterStage } from '@/components/ad-creative/WriterStage';
import { DesignerStage } from '@/components/ad-creative/DesignerStage';
import { EmptyState, LoadingState } from '@/components/ad-creative/ui/StatusStates';
import { Stage, Tone, MediaFormat, MEDIA_OPTIONS, AdCopy, AdCut } from '@/components/ad-creative/constants';
import { MOCK_SCOUT_RESULT, MOCK_WRITER_RESULT, MOCK_DESIGN_RESULT } from '@/components/ad-creative/mockData';

export default function AdCreativePage() {
  const [stage, setStage] = useState<Stage>('scouter');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<Stage | null>(null);
  const [category, setCategory] = useState('뷰티/스킨케어');
  const [productName, setProductName] = useState('');
  const [customCopy, setCustomCopy] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('감성');
  const [mediaFormat, setMediaFormat] = useState<MediaFormat>('naver_16_9');
  const [scoutResult, setScoutResult] = useState<any>(null);
  const [writerResult, setWriterResult] = useState<{ insight_applied: string, copies: AdCopy[] } | null>(null);
  const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null);
  const [designResult, setDesignResult] = useState<{ copy_id: number, tone: string, headline: string, cuts: AdCut[] } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [generatingCutId, setGeneratingCutId] = useState<number | null>(null);
  const [feedbackCutId, setFeedbackCutId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showCtrPanel, setShowCtrPanel] = useState(false);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const startAnalysis = async () => {
    setLoading(true); setLoadingStage('scouter'); setStage('scouter');
    try {
      const res = await fetch('/api/agents/scouter', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ category, productName, customCopy }) 
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScoutResult(data);
    } catch { await delay(1500); setScoutResult(MOCK_SCOUT_RESULT); }
    finally { setLoading(false); setLoadingStage(null); }
  };

  const generateNarrative = async () => {
    setLoading(true); setLoadingStage('writer');
    try {
      const res = await fetch('/api/agents/writer', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ category, productName, customCopy, tone: selectedTone, scoutData: scoutResult }) 
      });
      const data = await res.json();
      setWriterResult(data);
    } catch { await delay(1500); setWriterResult(MOCK_WRITER_RESULT); }
    finally { setStage('writer'); setLoading(false); setLoadingStage(null); }
  };

  const generateDesign = async (copyId: number) => {
    setSelectedCopyId(copyId);
    setLoading(true); setLoadingStage('designer');
    try {
      const res = await fetch('/api/agents/designer', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ category, productName, writerResult, selectedCopyId: copyId, mediaFormat }) 
      });
      const data = await res.json();
      setDesignResult(data);
    } catch { await delay(1500); setDesignResult(MOCK_DESIGN_RESULT); }
    finally { setStage('designer'); setLoading(false); setLoadingStage(null); setGeneratedImages({}); }
  };

  const generateCutImage = async (cutId: number, promptEn: string, referenceImageUrl?: string) => {
    if (generatedImages[cutId] || generatingCutId === cutId) return;
    setGeneratingCutId(cutId);
    try {
      const opt = MEDIA_OPTIONS.find(m => m.id === mediaFormat);
      const sizeHint = opt ? `${opt.ratio} pixel dimensions` : '16:9';
      const res = await fetch('/api/generate-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptEn, 
          aspectHint: sizeHint,
          referenceImageUrl // Add reference image
        })
      });
      const data = await res.json();
      if (data.image) setGeneratedImages(prev => ({ ...prev, [cutId]: data.image }));
    } catch { /* keep placeholder */ }
    finally { setGeneratingCutId(null); }
  };

  const updateCopy = (id: number, fields: Partial<AdCopy>) => {
    if (!writerResult) return;
    setWriterResult({ ...writerResult, copies: writerResult.copies.map(c => c.id === id ? { ...c, ...fields } : c) });
  };

  const regenerateCopy = async (id: number) => {
    setLoading(true); setLoadingStage('writer');
    await new Promise(r => setTimeout(r, 1500));
    const randomHeadlines = [
      "혁신적인 기술이 선사하는 새로운 경험",
      "당신의 일상을 바꾸는 단 하나의 선택",
      "전문가가 추천하는 가장 신뢰할 수 있는 브랜드",
      "압도적인 성능으로 완성하는 완벽한 퀄리티"
    ];
    const newHeadline = randomHeadlines[Math.floor(Math.random() * randomHeadlines.length)];
    updateCopy(id, { headline: newHeadline });
    setLoading(false); setLoadingStage(null);
  };

  const updateCut = (id: number, fields: Partial<AdCut>) => {
    if (!designResult) return;
    setDesignResult({ ...designResult, cuts: designResult.cuts.map(c => c.cut_id === id ? { ...c, ...fields } : c) });
  };

  const regenerateCut = async (id: number) => {
    const cut = designResult?.cuts.find(c => c.cut_id === id);
    if (cut) generateCutImage(id, cut.prompt_en, cut.reference_image_url);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-pretendard">
      <Sidebar 
        stage={stage} setStage={setStage} 
        category={category} setCategory={setCategory}
        productName={productName} setProductName={setProductName}
        customCopy={customCopy} setCustomCopy={setCustomCopy}
        selectedTone={selectedTone} setSelectedTone={setSelectedTone}
        mediaFormat={mediaFormat} setMediaFormat={setMediaFormat}
        scoutResult={scoutResult} writerResult={writerResult} designResult={designResult}
        loading={loading} loadingStage={loadingStage} startAnalysis={startAnalysis}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-[1240px] mx-auto px-6 py-12 md:px-12">
          {stage === 'scouter' && (
            !scoutResult && !loading ? (
              <EmptyState title="Ready for Analysis" desc="Enter a category and let our agents scout the market trends for you." />
            ) : loadingStage === 'scouter' ? (
              <LoadingState title="Scouting Market Trends" />
            ) : (
              <ScouterStage 
                scoutResult={scoutResult} 
                generateNarrative={generateNarrative} 
                loading={loading}
                onSelectPhrase={(phrase) => {
                  setCustomCopy(prev => prev ? `${prev}, ${phrase}` : phrase);
                }}
              />
            )
          )}

          {stage === 'writer' && (
            loadingStage === 'writer' ? <LoadingState title="Generating Narrative" /> :
            !writerResult ? <EmptyState title="No Narratives" desc="Run scouter analysis first to get trend-based ad copies." icon="layout" /> : (
              <WriterStage 
                writerResult={writerResult} selectedTone={selectedTone} 
                showCtrPanel={showCtrPanel} setShowCtrPanel={setShowCtrPanel}
                generateDesign={generateDesign} 
                updateCopy={updateCopy}
                regenerateCopy={regenerateCopy}
                isLoading={loading}
                loadingCopyId={selectedCopyId}
              />
            )
          )}

          {stage === 'designer' && (
            loadingStage === 'designer' ? <LoadingState title="Directing Visuals" /> :
            !designResult ? <EmptyState title="No Visuals" desc="Select a copy to generate a visual storyboard." icon="sparkles" /> : (
              <DesignerStage 
                designResult={designResult} mediaFormat={mediaFormat}
                generatedImages={generatedImages} generatingCutId={generatingCutId}
                generateCutImage={generateCutImage} 
                handleDownloadImage={(e, id) => { e.stopPropagation(); }}
                feedbackCutId={feedbackCutId} setFeedbackCutId={setFeedbackCutId}
                feedbackText={feedbackText} setFeedbackText={setFeedbackText}
                handleFeedbackSubmit={(id) => { setFeedbackCutId(null); }}
                updateCut={updateCut}
                regenerateCut={regenerateCut}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}
