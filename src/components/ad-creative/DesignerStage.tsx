import React from 'react';
import { HexColorPicker } from "react-colorful";
import { Download, MessageSquare, Send, Image as ImageIcon, Sparkles, AlertCircle, Info, RefreshCw, PenTool, FlipHorizontal, RotateCcw, RotateCw, CheckCircle2, X, FlipVertical, Plus, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter, Palette, Check, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MediaFormat, MEDIA_OPTIONS, MAX_ITEMS, AdCut, ExtraText } from './constants';

interface DesignerStageProps {
  designResult: { copy_id: number, tone: string, headline: string, cuts: AdCut[] };
  mediaFormat: MediaFormat;
  generatedImages: Record<number, string>;
  generatingCutId: number | null;
  generateCutImage: (id: number, prompt: string, referenceImageUrl?: string) => void;
  handleDownloadImage: (e: React.MouseEvent, id: number) => void;
  feedbackCutId: number | null;
  setFeedbackCutId: (id: number | null) => void;
  feedbackText: string;
  setFeedbackText: (t: string) => void;
  handleFeedbackSubmit: (id: number) => void;
  updateCut: (id: number, fields: Partial<AdCut>) => void;
  regenerateCut: (id: number) => void;
}

// --- Sub-components & Handlers for Interactive Controls ---

interface FloatingControlsProps {
  type: 'logo' | 'headline' | 'subtext' | 'cta' | 'extra';
  cut: AdCut;
  updateCut: (id: number, fields: any) => void;
  localUpdate: (fields: any) => void;
  onClose: () => void;
  elementId?: string;
  isSidebar?: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({ type, cut, updateCut, localUpdate, onClose, elementId, isSidebar }) => {
  const isLogo = type === 'logo';
  const isCta = type === 'cta';
  const isExtra = type === 'extra';

  const fontFamilies = [
    { name: 'Pretendard', value: 'Pretendard, system-ui' },
    { name: 'Gmarket Sans', value: 'GmarketSansBold, sans-serif' },
    { name: 'Noto Sans KR', value: 'Noto Sans KR, sans-serif' },
    { name: '맑은 고딕', value: 'Malgun Gothic, sans-serif' },
    { name: '나눔스퀘어', value: 'NanumSquare, sans-serif' }
  ];

  const updateStyle = (key: string, value: any) => {
    const currentVal = getStyleValue(key);
    if (currentVal === value) return;

    let updated: any = {};
    if (isExtra) {
      const extraId = elementId?.split('-').pop() || elementId;
      const extras = cut.extra_texts?.map(et => et.id === extraId ? { ...et, [key]: value } : et) || [];
      updated = { extra_texts: extras };
    } else if (type === 'headline') {
      updated = { text_overlay: { ...cut.text_overlay, [key]: value } };
    } else if (type === 'subtext') {
      const subKey = key.includes('font_') ? `sub_${key}` : (key === 'rotate' || key === 'flip_h' || key === 'flip_v' || key === 'z_index' ? `sub_${key}` : key);
      updated = { text_overlay: { ...cut.text_overlay, [subKey]: value } };
    } else if (isCta) {
      const ctaKey = key.startsWith('cta_') ? key : `cta_${key}`;
      updated = { [ctaKey]: value };
    } else if (isLogo) {
      const logoKey = key.startsWith('logo_') ? key : `logo_${key}`;
      updated = { [logoKey]: value };
    }
    
    localUpdate(updated);
    updateCut(cut.cut_id, updated);
  };

  const getStyleValue = (key: string) => {
    if (isExtra) {
      const extraId = elementId?.split('-').pop() || elementId;
      const extra = cut.extra_texts?.find(et => et.id === extraId) as any;
      if (!extra) return undefined;
      const val = extra[key];
      if (val !== undefined) return val;
      // Defaults for extra
      if (key === 'font_size') return 100;
      if (key === 'scale_x' || key === 'scale_y') return 100;
      if (key === 'rotate') return 0;
      if (key.includes('pos_')) return 50;
      return undefined;
    } else if (type === 'headline') {
      const val = (cut.text_overlay as any)?.[key];
      if (val !== undefined) return val;
      if (key === 'font_size') return 100;
      if (key === 'scale_x' || key === 'scale_y') return 100;
      if (key === 'rotate') return 0;
      return 0;
    } else if (type === 'subtext') {
      const subKey = key.includes('font_') ? `sub_${key}` : (key === 'rotate' || key === 'flip_h' || key === 'flip_v' || key === 'z_index' ? `sub_${key}` : key);
      const val = (cut.text_overlay as any)?.[subKey];
      if (val !== undefined) return val;
      if (key === 'font_size') return 80;
      if (key === 'scale_x' || key === 'scale_y') return 100;
      if (key === 'rotate') return 0;
      return 0;
    } else if (isCta) {
      const ctaKey = key.startsWith('cta_') ? key : `cta_${key}`;
      const val = (cut as any)?.[ctaKey];
      if (val !== undefined) return val;
      if (key.includes('size')) return 100;
      if (key.includes('scale')) return 100;
      if (key.includes('rotate')) return 0;
      return 0;
    } else if (isLogo) {
      const logoKey = key.startsWith('logo_') ? key : `logo_${key}`;
      const val = (cut as any)?.[logoKey];
      if (val !== undefined) return val;
      // Special defaults for logo position
      if (key === 'pos_x') return cut.logo_position?.includes('left') ? 10 : 90;
      if (key === 'pos_y') return cut.logo_position?.includes('top') ? 10 : 90;
      if (key === 'size') return 100;
      if (key.includes('rotate')) return 0;
      return 0;
    }
    return undefined;
  };

  const colors = [
    '#ffffff', '#f1f5f9', '#94a3b8', '#475569', '#1e293b', '#000000',
    '#f43f5e', '#fb7185', '#be123c', '#f97316', '#fb923c', '#ea580c',
    '#f59e0b', '#fbbf24', '#d97706', '#10b981', '#34d399', '#047857',
    '#0ea5e9', '#38bdf8', '#0369a1', '#6366f1', '#818cf8', '#4338ca',
    '#8b5cf6', '#a78bfa', '#6d28d9', '#d946ef', '#f472b6', '#a21caf'
  ];

  return (
    <div 
      className={cn(
        "flex flex-col items-stretch gap-6",
        isSidebar ? "w-full" : "bg-white/95 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.18)] px-7 py-6 rounded-[40px] border border-white/20 whitespace-nowrap animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5 sm:scale-100 scale-[0.8] origin-top"
      )}
      style={!isSidebar ? { minWidth: '400px' } : {}}
      onClick={e => e.stopPropagation()}
    >
      {/* Content Input Section */}
      {(!isLogo) && (
        <div className="flex flex-col gap-2 w-full">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Content Text</span>
          <textarea 
            className="w-full min-h-[100px] p-5 bg-slate-50 border border-slate-100 rounded-[24px] text-[14px] font-medium text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all resize-none shadow-inner leading-relaxed"
            value={isCta ? (cut.cta_text || '') : isExtra ? (cut.extra_texts?.find(et => et.id === (elementId?.split('-').pop() || elementId))?.content || '') : type === 'headline' ? (cut.headline || '') : (cut.subheadline || '')}
            onChange={(e) => {
              if (isCta) updateStyle('text', e.target.value);
              else if (isExtra) updateStyle('content', e.target.value);
              else if (type === 'headline') {
                localUpdate({ headline: e.target.value });
                updateCut(cut.cut_id, { headline: e.target.value });
              } else {
                localUpdate({ subheadline: e.target.value });
                updateCut(cut.cut_id, { subheadline: e.target.value });
              }
            }}
            placeholder="광고 문구를 입력하세요..."
          />
        </div>
      )}

      {!isLogo && (
        <div className="flex items-center gap-4 w-full">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Typography</span>
                <div className="flex items-center gap-2">
                  <select 
                    className="h-10 px-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all cursor-pointer flex-1"
                    value={getStyleValue('font_family') || 'Pretendard, system-ui'}
                    onChange={(e) => updateStyle('font_family', e.target.value)}
                  >
                    {fontFamilies.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                  <div className="flex gap-1">
                    {[
                      { icon: Bold, key: 'font_weight', val: 'bold', active: getStyleValue('font_weight') === 'bold' },
                      { icon: Italic, key: 'font_style', val: 'italic', active: getStyleValue('font_style') === 'italic' },
                      { icon: RotateCw, key: 'rotate', val: (getStyleValue('rotate') || 0) + 15, rotateBtn: true },
                    ].map((btn, i) => (
                      <button 
                        key={i}
                        onClick={() => !btn.rotateBtn ? updateStyle(btn.key, btn.active ? 'normal' : btn.val) : updateStyle(btn.key, btn.val)}
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border",
                          btn.active ? "bg-rose-500 text-white border-rose-500 shadow-md" : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        <btn.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Precise Controls Section */}
          <div className="flex flex-col gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[32px]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Transform & Size</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 ml-1">Size</span>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                    value={Math.round(Number(getStyleValue('font_size') ?? getStyleValue('size') ?? 100))}
                    onChange={(e) => updateStyle(isLogo ? 'logo_size' : isCta ? 'cta_size' : 'font_size', parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold">%</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 ml-1">Rotation</span>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                    value={Math.round(Number(getStyleValue('rotate') ?? 0))}
                    onChange={(e) => updateStyle('rotate', parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold">°</span>
                </div>
              </div>

              {!isLogo && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 ml-1">Width (%)</span>
                    <input 
                      type="number"
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                      value={Math.round(Number(getStyleValue('scale_x') ?? 100))}
                      onChange={(e) => updateStyle('scale_x', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 ml-1">Height (%)</span>
                    <input 
                      type="number"
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                      value={Math.round(Number(getStyleValue('scale_y') ?? 100))}
                      onChange={(e) => updateStyle('scale_y', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 ml-1">Pos X (%)</span>
                <input 
                  type="number"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                  value={Math.round(Number(getStyleValue('pos_x') ?? 0))}
                  onChange={(e) => updateStyle('pos_x', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 ml-1">Pos Y (%)</span>
                <input 
                  type="number"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                  value={Math.round(Number(getStyleValue('pos_y') ?? 0))}
                  onChange={(e) => updateStyle('pos_y', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Colors */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Color Palette</span>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {colors.map(c => (
              <button 
                key={c}
                className={cn(
                  "w-6 h-6 rounded-full border border-slate-100 transition-all hover:scale-125 shadow-sm",
                  getStyleValue('font_color') === c && "ring-2 ring-rose-500 ring-offset-2 scale-110"
                )}
                style={{ backgroundColor: c }}
                onClick={(e) => { e.stopPropagation(); updateStyle('font_color', c); }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 p-5 bg-slate-50 border border-slate-100 rounded-[32px] shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Palette</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md border border-slate-200 shadow-sm" style={{ backgroundColor: getStyleValue('font_color') || '#ffffff' }} />
                <span className="text-[10px] font-mono font-bold text-slate-500">{getStyleValue('font_color') || '#ffffff'}</span>
              </div>
            </div>
            
            <style>{`
              .react-colorful { width: 100% !important; height: 160px !important; border-radius: 20px; }
              .react-colorful__pointer { width: 20px; height: 20px; border-radius: 50%; }
              .react-colorful__saturation { border-bottom: none; border-radius: 16px 16px 0 0; }
              .react-colorful__hue { height: 12px !important; border-radius: 0 0 16px 16px !important; margin-top: 4px; }
            `}</style>
            <HexColorPicker 
              color={getStyleValue('font_color') || '#ffffff'} 
              onChange={(color) => updateStyle('font_color', color)} 
            />
          </div>
        </div>

        <div className="w-px h-12 bg-slate-100/80" />

        {/* Z-index & Actions */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Order & Action</span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-2xl border-slate-100 hover:bg-slate-50"
              onClick={() => updateStyle('z_index', 50)}
              title="맨 앞으로"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-2xl border-slate-100 hover:bg-slate-50"
              onClick={() => updateStyle('z_index', 10)}
              title="맨 뒤로"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-slate-100 mx-1" />

            {isExtra && (
              <Button 
                variant="outline" 
                size="icon" 
                className="w-10 h-10 rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50"
                onClick={() => {
                  const extras = cut.extra_texts?.filter(et => et.id !== (elementId?.split('-').pop() || elementId)) || [];
                  localUpdate({ extra_texts: extras });
                  updateCut(cut.cut_id, { extra_texts: extras });
                  onClose();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-2xl border-slate-200 bg-zinc-900 text-white hover:bg-black shadow-lg"
              onClick={onClose}
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResizeHandlesProps {
  elementId: string;
  size: number;
  scaleX?: number;
  scaleY?: number;
  rotate: number;
  onMouseDown: (e: React.MouseEvent, id: string, mode: 'move' | 'resize' | 'rotate', val: number, val2?: number, dir?: string) => void;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ elementId, size, scaleX = 100, scaleY = 100, rotate, onMouseDown }) => {
  const positions = [
    { pos: 'top-left', cursor: 'nw-resize', class: '-left-1.5 -top-1.5' },
    { pos: 'top-center', cursor: 'n-resize', class: 'left-1/2 -top-1.5 -translate-x-1/2' },
    { pos: 'top-right', cursor: 'ne-resize', class: '-right-1.5 -top-1.5' },
    { pos: 'center-left', cursor: 'w-resize', class: '-left-1.5 top-1/2 -translate-y-1/2' },
    { pos: 'center-right', cursor: 'e-resize', class: '-right-1.5 top-1/2 -translate-y-1/2' },
    { pos: 'bottom-left', cursor: 'sw-resize', class: '-left-1.5 -bottom-1.5' },
    { pos: 'bottom-center', cursor: 's-resize', class: 'left-1/2 -bottom-1.5 -translate-x-1/2' },
    { pos: 'bottom-right', cursor: 'se-resize', class: '-right-1.5 -bottom-1.5' },
  ];

  const counterStyle = {
    transform: `scale(${100 / scaleX}, ${100 / scaleY})`
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute -inset-[2px] border-2 border-dashed border-blue-400 z-20 rounded-sm"
        style={{ borderWidth: `${2 / (scaleX/100)}px ${2 / (scaleY/100)}px` }} 
      />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center group pointer-events-auto">
        <div 
          className="w-7 h-7 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-30 hover:bg-blue-50 hover:border-blue-400 transition-all text-slate-500 hover:text-blue-500 scale-90 active:scale-100"
          style={counterStyle}
          onMouseDown={(e) => onMouseDown(e, elementId, 'rotate', rotate)}
        >
          <RotateCcw className="w-4 h-4" />
        </div>
        <div className="w-[1.5px] h-6 bg-blue-300" />
      </div>

      {positions.map(p => (
        <div 
          key={p.pos}
          className={cn("absolute w-3.5 h-3.5 bg-white border border-blue-400 rounded-full shadow-sm z-30 pointer-events-auto", p.class)}
          style={{ ...counterStyle, cursor: p.cursor }}
          onMouseDown={(e) => {
            const isHorizontal = p.pos.includes('center-left') || p.pos.includes('center-right');
            const isVertical = p.pos.includes('top-center') || p.pos.includes('bottom-center');
            if (isHorizontal || isVertical) onMouseDown(e, elementId, 'resize', scaleX, scaleY, p.pos);
            else onMouseDown(e, elementId, 'resize', size, 0, p.pos);
          }}
        />
      ))}
    </div>
  );
};

export const DesignerStage: React.FC<DesignerStageProps> = ({
  designResult, mediaFormat, generatedImages, generatingCutId,
  generateCutImage, handleDownloadImage, feedbackCutId, setFeedbackCutId,
  feedbackText, setFeedbackText, handleFeedbackSubmit, updateCut, regenerateCut
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
  
  // Local Cuts State for Performance (Lag fixing)
  const [localCuts, setLocalCuts] = React.useState<AdCut[]>([]);

  // Sync with prop only when necessary (e.g. initial load or post-generation)
  // Use a ref to track the last synced cuts to avoid infinite loops from parent ref changes
  const lastPropCutsRef = React.useRef<string>('');

  React.useEffect(() => {
    if (designResult?.cuts) {
      const cutsJson = JSON.stringify(designResult.cuts);
      if (cutsJson !== lastPropCutsRef.current) {
        setLocalCuts(designResult.cuts);
        lastPropCutsRef.current = cutsJson;
      }
    }
  }, [designResult?.cuts]);

  // Drag and Resize State
  const [dragState, setDragState] = React.useState<{
    mode: 'move' | 'resize' | 'rotate' | null;
    elementId: string | null;
    startX: number;
    startY: number;
    initialVal: number;
    initialVal2?: number;
    resizeDir?: string;
  }>({ mode: null, elementId: null, startX: 0, startY: 0, initialVal: 0 });

  const containerRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const currentMedia = MEDIA_OPTIONS.find(m => m.id === mediaFormat);
  const ratioValue = currentMedia ? currentMedia.w / currentMedia.h : 1;

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, elementId: string, mode: 'move' | 'resize' | 'rotate', initialVal: number, initialVal2?: number, resizeDir?: string) => {
    e.stopPropagation();
    
    // Normalize touch and mouse coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    if (selectedElementId !== elementId) {
      setSelectedElementId(elementId);
    }

    setDragState({
      mode,
      elementId,
      startX: clientX,
      startY: clientY,
      initialVal,
      initialVal2,
      resizeDir
    });
  };

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent, currentCut: AdCut) => {
    const { mode, elementId } = dragState;
    if (!mode || !elementId) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const container = containerRefs.current[currentCut.cut_id];
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const dx = ((clientX - dragState.startX) / rect.width) * 100;
    const dy = ((clientY - dragState.startY) / rect.height) * 100;
    
    const elementParts = elementId.split('-');
    const cutId = parseInt(elementParts[0]);
    const type = elementParts[1];

    // Helper to update locally for instant 60fps feedback
    const updateLocal = (fields: Partial<AdCut>) => {
      setLocalCuts(prev => prev.map(c => c.cut_id === cutId ? { ...c, ...fields } : c));
    };

    if (mode === 'move') {
      const newX = Math.max(-50, Math.min(150, (dragState.initialVal || 0) + dx));
      const newY = Math.max(-50, Math.min(150, (dragState.initialVal2 || 0) + dy));
      const isExtra = elementId.includes('-extra-');
      const extraId = isExtra ? elementId.split('-extra-')[1] : null;

      if (isExtra) {
        const newExtras = currentCut.extra_texts?.map((x: any) => x.id === extraId ? { ...x, pos_x: newX, pos_y: newY } : x);
        updateLocal({ extra_texts: newExtras });
      } else if (type === 'logo') updateLocal({ logo_pos_x: newX, logo_pos_y: newY });
      else if (type === 'cta') updateLocal({ cta_pos_x: newX, cta_pos_y: newY });
      else if (type === 'headline') updateLocal({ text_overlay: { ...currentCut.text_overlay, pos_x: newX, pos_y: newY } } as any);
      else if (type === 'subtext') updateLocal({ text_overlay: { ...currentCut.text_overlay, sub_pos_x: newX, sub_pos_y: newY } } as any);
    } else if (mode === 'resize') {
      const isExtra = elementId.includes('-extra-');
      const extraId = isExtra ? elementId.split('-extra-')[1] : null;
      
      const isVertical = dragState.resizeDir === 'top-center' || dragState.resizeDir === 'bottom-center';
      const isHorizontal = dragState.resizeDir === 'center-left' || dragState.resizeDir === 'center-right';

      if (isVertical) {
        const delta = dragState.resizeDir === 'top-center' ? -dy : dy;
        const newScaleY = Math.max(20, Math.min(800, (dragState.initialVal2 || 100) + delta * 2));
        if (isExtra) {
          const newExtras = currentCut.extra_texts?.map((x: any) => x.id === extraId ? { ...x, scale_y: newScaleY } : x);
          updateLocal({ extra_texts: newExtras });
        } else if (type === 'headline') updateLocal({ text_overlay: { ...currentCut.text_overlay, scale_y: newScaleY } } as any);
        else if (type === 'subtext') updateLocal({ text_overlay: { ...currentCut.text_overlay, sub_scale_y: newScaleY } } as any);
        else if (type === 'cta') updateLocal({ cta_scale_y: newScaleY });
      } else if (isHorizontal) {
        const delta = dragState.resizeDir === 'center-left' ? -dx : dx;
        const newScaleX = Math.max(20, Math.min(800, (dragState.initialVal || 100) + delta * 2));
        if (isExtra) {
          const newExtras = currentCut.extra_texts?.map((x: any) => x.id === extraId ? { ...x, scale_x: newScaleX } : x);
          updateLocal({ extra_texts: newExtras });
        } else if (type === 'headline') updateLocal({ text_overlay: { ...currentCut.text_overlay, scale_x: newScaleX } } as any);
        else if (type === 'subtext') updateLocal({ text_overlay: { ...currentCut.text_overlay, sub_scale_x: newScaleX } } as any);
        else if (type === 'cta') updateLocal({ cta_scale_x: newScaleX });
      } else {
        const d = Math.max(Math.abs(dx), Math.abs(dy)) * (dx + dy > 0 ? 1 : -1);
        const newSize = Math.max(10, Math.min(600, dragState.initialVal + d * 2));
        if (isExtra) {
          const newExtras = currentCut.extra_texts?.map((x: any) => x.id === extraId ? { ...x, font_size: newSize } : x);
          updateLocal({ extra_texts: newExtras });
        } else if (type === 'logo') updateLocal({ logo_size: newSize });
        else if (type === 'cta') updateLocal({ cta_size: newSize });
        else if (type === 'headline') updateLocal({ text_overlay: { ...currentCut.text_overlay, font_size: newSize } } as any);
        else if (type === 'subtext') updateLocal({ text_overlay: { ...currentCut.text_overlay, sub_font_size: newSize } } as any);
      }
    } else if (mode === 'rotate') {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      const startAngle = Math.atan2(dragState.startY - centerY, dragState.startX - centerX) * (180 / Math.PI);
      const newRotate = (dragState.initialVal + (angle - startAngle)) % 360;
      const isExtra = elementId.includes('-extra-');
      const extraId = isExtra ? elementId.split('-extra-')[1] : null;

      if (isExtra) {
        const newExtras = currentCut.extra_texts?.map((x: any) => x.id === extraId ? { ...x, rotate: newRotate } : x);
        updateLocal({ extra_texts: newExtras });
      } else if (type === 'logo') updateLocal({ logo_rotate: newRotate });
      else if (type === 'cta') updateLocal({ cta_rotate: newRotate });
      else if (type === 'headline') updateLocal({ text_overlay: { ...currentCut.text_overlay, rotate: newRotate } } as any);
      else if (type === 'subtext') updateLocal({ text_overlay: { ...currentCut.text_overlay, sub_rotate: newRotate } } as any);
    }
  };

  const handleMouseUp = () => {
    if (!dragState.mode || !dragState.elementId) {
      setDragState({ mode: null, elementId: null, startX: 0, startY: 0, initialVal: 0 });
      return;
    }

    // Sync to parent on mouse up
    const elementParts = dragState.elementId.split('-');
    const cutId = parseInt(elementParts[0]);
    const finalCut = localCuts.find(c => c.cut_id === cutId);
    if (finalCut) {
      updateCut(cutId, finalCut);
    }

    setDragState({ mode: null, elementId: null, startX: 0, startY: 0, initialVal: 0 });
  };

  const getAspectRatioStyle = (id: MediaFormat) => {
    const opt = MEDIA_OPTIONS.find(m => m.id === id);
    if (!opt) return { aspectRatio: '16 / 9' };
    return { aspectRatio: `${opt.w} / ${opt.h}` };
  };

  // Limit to 4 cuts
  const filteredCuts = (localCuts || []).slice(0, MAX_ITEMS);

  // Add Text Feature
  const addExtraText = (cutId: number) => {
    const cut = localCuts.find(c => c.cut_id === cutId);
    if (!cut) return;
    
    const newId = `extra-${Date.now()}`;
    const newExtra: ExtraText = {
      id: newId,
      content: '텍스트를 입력하세요',
      pos_x: 50,
      pos_y: 50,
      font_size: 100,
      font_color: '#ffffff',
      font_weight: 'bold',
      rotate: 0,
      scale_x: 100,
      scale_y: 100,
      z_index: 30
    };
    
    const newExtras = [...(cut.extra_texts || []), newExtra];
    const updatedCut = { ...cut, extra_texts: newExtras };
    
    // Update local for instant UI change
    setLocalCuts(prev => prev.map(c => c.cut_id === cutId ? updatedCut : c));
    // Sync to parent
    updateCut(cutId, updatedCut);
    // Select the new text element immediately
    setSelectedElementId(`${cutId}-extra-${newId}`);
  };

  // Sync helpers for Right Panel
  const selectedCutId = selectedElementId ? parseInt(selectedElementId.split('-')[0]) : null;
  const selectedCut = localCuts.find(c => c.cut_id === selectedCutId);
  const selectedElementType = selectedElementId && selectedCut ? (
    selectedElementId.includes('-logo') ? 'logo' :
    selectedElementId.includes('-headline') ? 'headline' :
    selectedElementId.includes('-subtext') ? 'subtext' :
    selectedElementId.includes('-cta') ? 'cta' :
    selectedElementId.includes('-extra-') ? 'extra' : null
  ) : null;

  return (
    <div className="flex gap-8 relative items-start animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Left: Main Content (Header + Grid) */}
      <div className="flex-1 space-y-8 pb-20 no-scrollbar">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">비주얼 시나리오 보드 (Visual Storyboards)</h2>
            </div>
            <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              {filteredCuts.length}개의 컨셉 프레임 제안 (4개 제한)
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">활성 포맷</span>
              <span className="text-[12px] font-bold text-slate-700">{currentMedia?.label} ({currentMedia?.ratio})</span>
            </div>
          </div>
        </div>

      <div className={cn(
        "grid gap-8", 
        ratioValue > 1.9 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}>
        {filteredCuts.map((cut: any) => {
          const isGenerating = generatingCutId === cut.cut_id;
          const isDone = !!generatedImages[cut.cut_id];
          const isFeedbackOpen = feedbackCutId === cut.cut_id;
          const isEditing = editingId === cut.cut_id;

          return (
            <Card key={cut.cut_id} className="group p-8 border-slate-100 bg-white/60 backdrop-blur-xl rounded-[40px] hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-50 transition-all flex flex-col relative overflow-hidden h-full">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border bg-slate-50 text-slate-400 border-slate-200">
                      컨셉 프레임 #{cut.cut_id}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{cut.role} ({cut.ratio})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isDone && (
                      <>
                        <button 
                          onClick={(e) => handleDownloadImage(e, cut.cut_id)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-all shadow-sm"
                          title="이미지 다운로드"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFeedbackCutId(isFeedbackOpen ? null : cut.cut_id); }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm",
                            isFeedbackOpen ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-100 hover:text-indigo-600 hover:border-indigo-300"
                          )}
                          title="수정 요청 (피드백)"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => regenerateCut(cut.cut_id)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-all shadow-sm"
                      title="다시 생성"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setEditingId(isEditing ? null : cut.cut_id)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm",
                        isEditing ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:text-zinc-900 hover:border-zinc-300"
                      )}
                      title="배너 커스텀"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Frame (Image & Edit) */}
                <div className="flex flex-col gap-8 flex-1">
                  <div 
                    className={cn(
                      "relative bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden transition-all duration-500 cursor-pointer flex items-center justify-center shadow-xl shadow-slate-100/50 w-full mx-auto max-w-full",
                      isDone ? "hover:shadow-2xl hover:border-rose-200" : "hover:bg-slate-100 hover:border-slate-300"
                    )}
                    style={{ ...getAspectRatioStyle(mediaFormat), maxHeight: '400px' }}
                    onClick={() => !isDone && !isGenerating && generateCutImage(cut.cut_id, cut.prompt_en, cut.reference_image_url)}
                  >
                    {isDone ? (
                      <>
                        <img 
                          src={generatedImages[cut.cut_id]} 
                          alt={cut.prompt_ko} 
                          className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none select-none" 
                        />
                        {/* Banner Overlay Simulation */}
                          <div 
                            ref={el => { containerRefs.current[cut.cut_id] = el; }}
                            className="absolute inset-0 z-10"
                            onClick={(e) => {
                              if (e.target === e.currentTarget) {
                                setSelectedElementId(null);
                              }
                            }}
                            onMouseMove={(e) => handleMouseMove(e, cut)}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchMove={(e) => handleMouseMove(e, cut)}
                            onTouchEnd={handleMouseUp}
                          >
                          {/* Shadow Overlay for Readability */}
                          {cut.text_overlay?.bg_shadow !== 'none' && (
                            <div className={cn(
                              "absolute inset-0 z-[-1] pointer-events-none",
                              cut.text_overlay?.position?.includes('top') ? "bg-gradient-to-b from-black/50 to-transparent h-1/2" : 
                              cut.text_overlay?.position?.includes('center') ? "bg-black/20" : "bg-gradient-to-t from-black/60 to-transparent h-1/2"
                            )} />
                          )}

                            {/* Logo Element (Fixed Structure) */}
                            {cut.show_logo && cut.logo_render !== false && (
                              <div 
                                className="absolute pointer-events-none z-20"
                                style={{ 
                                  left: `${cut.logo_pos_x ?? (cut.logo_position?.includes('left') ? 10 : 90)}%`,
                                  top: `${cut.logo_pos_y ?? (cut.logo_position?.includes('top') ? 10 : 90)}%`,
                                  zIndex: cut.logo_z_index || 20
                                }}
                              >
                                <div 
                                  className={cn(
                                    "pointer-events-auto cursor-move transition-all duration-200 w-fit select-none relative",
                                    !cut.custom_logo_url && selectedElementId !== `${cut.cut_id}-logo` && "bg-white/20 rounded-xl border border-white/20 text-[10px] font-black text-white/60 tracking-widest uppercase shadow-xl w-24 h-10 flex items-center justify-center",
                                    cut.custom_logo_url && selectedElementId !== `${cut.cut_id}-logo` && "hover:ring-1 hover:ring-white/30 rounded-lg p-1",
                                    selectedElementId === `${cut.cut_id}-logo` && "ring-2 ring-rose-500 ring-offset-4 ring-offset-transparent rounded-xl bg-white/10"
                                  )}
                                  onMouseDown={(e) => handleMouseDown(e, `${cut.cut_id}-logo`, 'move', cut.logo_pos_x ?? (cut.logo_position?.includes('left') ? 10 : 90), cut.logo_pos_y ?? (cut.logo_position?.includes('top') ? 10 : 90))}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ 
                                    transform: `
                                      translate(-50%, -50%)
                                      scale(${(cut.logo_size || 100) / 100})
                                      rotate(${cut.logo_rotate || 0}deg)
                                    `
                                  }}
                                >
                                  <div 
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ transform: `scaleX(${cut.logo_flip_h ? -1 : 1}) scaleY(${cut.logo_flip_v ? -1 : 1})` }}
                                  >
                                    {cut.custom_logo_url ? (
                                      <img src={cut.custom_logo_url} className="w-auto h-12 object-contain drop-shadow-xl pointer-events-none" alt="Custom Logo" />
                                    ) : (
                                      "LOGO"
                                    )}
                                  </div>
                                  {selectedElementId === `${cut.cut_id}-logo` && (
                                    <ResizeHandles 
                                      elementId={`${cut.cut_id}-logo`} 
                                      size={cut.logo_size || 100} 
                                      rotate={cut.logo_rotate || 0}
                                      onMouseDown={handleMouseDown} 
                                    />
                                  )}
                                </div>
                                

                              </div>
                            )}

                            {/* Text Content Container (Now Free Positioned) */}
                            <div 
                              className="absolute inset-0 pointer-events-none z-10"
                            >
                              {/* Headline */}
                              {/* Headline Element (Fixed Structure) */}
                              <div 
                                className="absolute pointer-events-none z-30"
                                style={{ 
                                  left: `${cut.text_overlay?.pos_x ?? 50}%`,
                                  top: `${cut.text_overlay?.pos_y ?? 40}%`,
                                }}
                              >
                                <div 
                                  onMouseDown={(e) => handleMouseDown(e, `${cut.cut_id}-headline`, 'move', cut.text_overlay?.pos_x || 50, cut.text_overlay?.pos_y || 40)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={cn(
                                    "pointer-events-auto cursor-move transition-all duration-200 w-fit select-none relative",
                                    selectedElementId === `${cut.cut_id}-headline` && "ring-2 ring-rose-500 ring-offset-4 ring-offset-transparent rounded-xl p-2 bg-white/10",
                                    selectedElementId !== `${cut.cut_id}-headline` && "hover:ring-1 hover:ring-white/30 rounded-lg p-1"
                                  )}
                                  style={{ 
                                    transform: `
                                      translate(-50%, -50%)
                                      scaleX(${(cut.text_overlay?.scale_x || 100) / 100})
                                      scaleY(${(cut.text_overlay?.scale_y || 100) / 100})
                                      scale(${(cut.text_overlay?.font_size || 100) / 100})
                                      rotate(${cut.text_overlay?.rotate || 0}deg)
                                    `
                                  }}
                                >
                                  <div 
                                    style={{ transform: `scaleX(${cut.text_overlay?.flip_h ? -1 : 1}) scaleY(${cut.text_overlay?.flip_v ? -1 : 1})` }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {selectedElementId === `${cut.cut_id}-headline` ? (
                                      <input 
                                        autoFocus
                                        className="bg-transparent border-none text-center outline-none w-full tracking-tighter drop-shadow-2xl"
                                        style={{ 
                                          color: cut.text_overlay?.font_color || '#ffffff', 
                                          fontSize: mediaFormat.includes('16_9') ? '32px' : '28px',
                                          fontFamily: cut.text_overlay?.font_family || 'Pretendard, system-ui',
                                          fontWeight: cut.text_overlay?.font_weight || 'black',
                                          fontStyle: cut.text_overlay?.font_style || 'normal'
                                        }}
                                        value={cut.headline}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => updateCut(cut.cut_id, { headline: e.target.value })}
                                      />
                                    ) : (
                                      <h3 
                                        className={cn(
                                          "leading-[1.1] tracking-tighter drop-shadow-2xl break-keep text-center",
                                          mediaFormat.includes('16_9') ? "text-[32px]" : "text-[28px]"
                                        )}
                                        style={{ 
                                          color: cut.text_overlay?.font_color || '#ffffff',
                                          fontFamily: cut.text_overlay?.font_family || 'Pretendard, system-ui',
                                          fontWeight: (cut.text_overlay?.font_weight as any) || 'black',
                                          fontStyle: cut.text_overlay?.font_style || 'normal'
                                        }}
                                      >
                                        {cut.headline}
                                      </h3>
                                    )}
                                  </div>
                                  {selectedElementId === `${cut.cut_id}-headline` && (
                                    <ResizeHandles 
                                      elementId={`${cut.cut_id}-headline`} 
                                      size={cut.text_overlay?.font_size || 100} 
                                      scaleX={cut.text_overlay?.scale_x || 100}
                                      scaleY={cut.text_overlay?.scale_y || 100}
                                      rotate={cut.text_overlay?.rotate || 0}
                                      onMouseDown={handleMouseDown} 
                                    />
                                  )}
                                </div>

                              </div>

                              {/* Subtext Element (Fixed Structure) */}
                              <div 
                                className="absolute pointer-events-none z-20"
                                style={{ 
                                  left: `${cut.text_overlay?.sub_pos_x ?? cut.text_overlay?.pos_x ?? 50}%`,
                                  top: `${cut.text_overlay?.sub_pos_y ?? ((cut.text_overlay?.pos_y ?? 40) + 12)}%`,
                                }}
                              >
                                <div 
                                  onMouseDown={(e) => handleMouseDown(e, `${cut.cut_id}-subtext`, 'move', cut.text_overlay?.sub_pos_x ?? cut.text_overlay?.pos_x ?? 50, cut.text_overlay?.sub_pos_y ?? ((cut.text_overlay?.pos_y ?? 40) + 12))}
                                  onClick={(e) => e.stopPropagation()}
                                  className={cn(
                                    "pointer-events-auto cursor-move transition-all duration-200 w-fit select-none relative space-y-2",
                                    selectedElementId === `${cut.cut_id}-subtext` && "ring-2 ring-rose-500 ring-offset-4 ring-offset-transparent rounded-xl p-2 bg-white/10",
                                    selectedElementId !== `${cut.cut_id}-subtext` && "hover:ring-1 hover:ring-white/30 rounded-lg p-1"
                                  )}
                                  style={{ 
                                    transform: `
                                      translate(-50%, -50%)
                                      scaleX(${(cut.text_overlay?.sub_scale_x || 100) / 100})
                                      scaleY(${(cut.text_overlay?.sub_scale_y || 100) / 100})
                                      scale(${(cut.text_overlay?.sub_font_size || 100) / 100})
                                      rotate(${cut.text_overlay?.sub_rotate || 0}deg)
                                    `
                                  }}
                                >
                                  <div 
                                    style={{ transform: `scaleX(${cut.text_overlay?.sub_flip_h ? -1 : 1}) scaleY(${cut.text_overlay?.sub_flip_v ? -1 : 1})` }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {selectedElementId === `${cut.cut_id}-subtext` ? (
                                      <textarea 
                                        autoFocus
                                        className="bg-transparent border-none text-center outline-none w-full leading-snug drop-shadow-lg opacity-90 resize-none h-auto min-w-[200px]"
                                        style={{ 
                                          color: cut.text_overlay?.sub_font_color || '#ffffff', 
                                          fontSize: '14px',
                                          fontFamily: cut.text_overlay?.sub_font_family || 'Pretendard, system-ui',
                                          fontWeight: (cut.text_overlay?.sub_font_weight as any) || 'medium',
                                          fontStyle: cut.text_overlay?.sub_font_style || 'normal'
                                        }}
                                        value={cut.subheadline}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => updateCut(cut.cut_id, { subheadline: e.target.value })}
                                      />
                                    ) : cut.subheadline && (
                                      <p className="text-[14px] leading-snug drop-shadow-lg break-keep opacity-90 text-center"
                                         style={{ 
                                           color: cut.text_overlay?.sub_font_color || '#ffffff',
                                           fontFamily: cut.text_overlay?.sub_font_family || 'Pretendard, system-ui',
                                           fontWeight: (cut.text_overlay?.sub_font_weight as any) || 'medium',
                                           fontStyle: cut.text_overlay?.sub_font_style || 'normal'
                                         }}>
                                        {cut.subheadline}
                                      </p>
                                    )}
                                  </div>
                                  {selectedElementId === `${cut.cut_id}-subtext` && (
                                    <ResizeHandles 
                                      elementId={`${cut.cut_id}-subtext`} 
                                      size={cut.text_overlay?.sub_font_size || 100} 
                                      scaleX={cut.text_overlay?.sub_scale_x || 100}
                                      scaleY={cut.text_overlay?.sub_scale_y || 100}
                                      rotate={cut.text_overlay?.sub_rotate || 0}
                                      onMouseDown={handleMouseDown} 
                                    />
                                  )}
                                </div>

                              </div>

                              {/* CTA Element (Fixed Structure) */}
                              {cut.cta_text && (
                                <div 
                                  className="absolute pointer-events-none z-40"
                                  style={{ 
                                    left: `${cut.cta_pos_x ?? 50}%`,
                                    top: `${cut.cta_pos_y ?? 85}%`,
                                  }}
                                >
                                  <div 
                                    onMouseDown={(e) => handleMouseDown(e, `${cut.cut_id}-cta`, 'move', cut.cta_pos_x || 50, cut.cta_pos_y || 85)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                      "pointer-events-auto cursor-move transition-all duration-200 w-fit select-none relative",
                                      selectedElementId === `${cut.cut_id}-cta` && "ring-2 ring-rose-500 ring-offset-4 ring-offset-transparent rounded-3xl p-2 bg-white/10",
                                      selectedElementId !== `${cut.cut_id}-cta` && "hover:ring-1 hover:ring-white/30 rounded-3xl p-1"
                                    )}
                                    style={{ 
                                      transform: `
                                        translate(-50%, -50%)
                                        scaleX(${(cut.cta_scale_x || 100) / 100})
                                        scaleY(${(cut.cta_scale_y || 100) / 100})
                                        scale(${(cut.cta_size || 100) / 100})
                                        rotate(${cut.cta_rotate || 0}deg)
                                      `
                                    }}
                                  >
                                    <div 
                                      style={{ transform: `scaleX(${cut.cta_flip_h ? -1 : 1}) scaleY(${cut.cta_flip_v ? -1 : 1})` }}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      {selectedElementId === `${cut.cut_id}-cta` ? (
                                        <input 
                                          autoFocus
                                          className="inline-flex items-center px-6 py-2.5 text-white rounded-full text-[13px] shadow-2xl shadow-rose-500/40 text-center outline-none border-none"
                                          style={{ 
                                            backgroundColor: cut.cta_color || '#f43f5e',
                                            fontFamily: cut.cta_font_family || 'Pretendard, system-ui',
                                            fontWeight: (cut.cta_font_weight as any) || 'black',
                                            fontStyle: cut.cta_font_style || 'normal'
                                          }}
                                          value={cut.cta_text}
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onChange={e => updateCut(cut.cut_id, { cta_text: e.target.value })}
                                        />
                                      ) : (
                                        <div className="inline-flex items-center px-6 py-2.5 text-white rounded-full text-[13px] shadow-2xl shadow-rose-500/40"
                                             style={{ 
                                               backgroundColor: cut.cta_color || '#f43f5e',
                                               fontFamily: cut.cta_font_family || 'Pretendard, system-ui',
                                               fontWeight: (cut.cta_font_weight as any) || 'black',
                                               fontStyle: cut.cta_font_style || 'normal'
                                             }}>
                                          {cut.cta_text}
                                        </div>
                                      )}
                                    </div>
                                    {selectedElementId === `${cut.cut_id}-cta` && (
                                      <ResizeHandles 
                                        elementId={`${cut.cut_id}-cta`} 
                                        size={cut.cta_size || 100} 
                                        scaleX={cut.cta_scale_x || 100}
                                        scaleY={cut.cta_scale_y || 100}
                                        rotate={cut.cta_rotate || 0}
                                        onMouseDown={handleMouseDown} 
                                      />
                                    )}
                                  </div>

                                </div>
                              )}

                              {/* Extra Texts (Fixed Structure) */}
                              {cut.extra_texts?.map((et: ExtraText) => (
                                <div 
                                  key={et.id}
                                  className="absolute pointer-events-none z-30"
                                  style={{ 
                                    left: `${et.pos_x}%`,
                                    top: `${et.pos_y}%`,
                                  }}
                                >
                                  <div 
                                    onMouseDown={(e) => handleMouseDown(e, `${cut.cut_id}-extra-${et.id}`, 'move', et.pos_x, et.pos_y)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                      "pointer-events-auto cursor-move transition-all duration-200 w-fit select-none relative",
                                      selectedElementId === `${cut.cut_id}-extra-${et.id}` && "ring-2 ring-blue-500 ring-offset-4 ring-offset-transparent rounded-xl p-2 bg-white/10",
                                      selectedElementId !== `${cut.cut_id}-extra-${et.id}` && "hover:ring-1 hover:ring-white/30 rounded-lg p-1"
                                    )}
                                    style={{ 
                                      transform: `
                                        translate(-50%, -50%)
                                        scaleX(${(et.scale_x || 100) / 100})
                                        scaleY(${(et.scale_y || 100) / 100})
                                        scale(${et.font_size / 100})
                                        rotate(${et.rotate || 0}deg)
                                      `
                                    }}
                                  >
                                    <div 
                                      style={{ transform: `scaleX(${et.flip_h ? -1 : 1}) scaleY(${et.flip_v ? -1 : 1})` }}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      {selectedElementId === `${cut.cut_id}-extra-${et.id}` ? (
                                        <textarea 
                                          autoFocus
                                          className="bg-transparent border-none text-center outline-none w-full leading-tight drop-shadow-2xl resize-none h-auto min-w-[150px]"
                                          style={{ 
                                            color: et.font_color, 
                                            fontSize: '24px',
                                            fontFamily: et.font_family || 'Pretendard, system-ui',
                                            fontWeight: (et.font_weight as any) || 'bold',
                                            fontStyle: et.font_style || 'normal'
                                          }}
                                          value={et.content}
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onChange={e => {
                                            const newExtras = cut.extra_texts?.map((x: ExtraText) => x.id === et.id ? { ...x, content: e.target.value } : x);
                                            updateCut(cut.cut_id, { extra_texts: newExtras });
                                          }}
                                        />
                                      ) : (
                                        <div 
                                          className="text-[24px] leading-tight drop-shadow-2xl break-keep text-center"
                                          style={{ 
                                            color: et.font_color,
                                            fontFamily: et.font_family || 'Pretendard, system-ui',
                                            fontWeight: (et.font_weight as any) || 'bold',
                                            fontStyle: et.font_style || 'normal'
                                          }}
                                        >
                                          {et.content}
                                        </div>
                                      )}
                                    </div>
                                    {selectedElementId === `${cut.cut_id}-extra-${et.id}` && (
                                      <ResizeHandles 
                                        elementId={`${cut.cut_id}-extra-${et.id}`} 
                                        size={et.font_size} 
                                        scaleX={et.scale_x || 100}
                                        scaleY={et.scale_y || 100}
                                        rotate={et.rotate || 0}
                                        onMouseDown={handleMouseDown} 
                                      />
                                    )}
                                  </div>

                                </div>
                              ))}

                            </div>
                        </div>
                      </>
                    ) : isGenerating ? (
                      <div className="flex flex-col items-center gap-6 z-10 relative">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
                          <Sparkles className="w-6 h-6 text-rose-500 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[14px] font-black text-rose-600 uppercase tracking-[0.2em] animate-pulse">AI 시각화 분석 중</span>
                          <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 animate-progress" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="w-full h-full flex flex-col items-center justify-center gap-6 z-10 relative group transition-all duration-500"
                        onClick={() => {
                          if (!isGenerating) {
                            regenerateCut(cut.cut_id);
                          }
                        }}
                      >
                        <div className={cn(
                          "w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-2xl transition-all border border-slate-100",
                          isGenerating ? "animate-pulse scale-90" : "group-hover:scale-110 group-hover:rotate-6"
                        )}>
                          {isGenerating ? (
                            <div className="flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
                              <Sparkles className="w-6 h-6 text-rose-500 animate-bounce" />
                            </div>
                          ) : (
                            <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-rose-400 transition-colors" />
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn(
                            "text-[14px] font-black uppercase tracking-widest transition-colors",
                            isGenerating ? "text-rose-500" : "text-slate-900"
                          )}>
                            {isGenerating ? "AI 드로잉 시작..." : "비주얼 생성하기"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-tight">
                            {isGenerating ? "가이드라인을 기반으로 이미지를 생성 중입니다" : "클릭 시 AI가 가이드를 기반으로 드로잉을 시작합니다"}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Info & Edit Area */}
                  <div className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">메인 헤드라인</span>
                            <input 
                              className="w-full px-4 py-2 text-[14px] font-black text-slate-900 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-rose-300 shadow-sm"
                              value={cut.headline || ''}
                              onChange={e => updateCut(cut.cut_id, { headline: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">서브 카피</span>
                            <input 
                              className="w-full px-4 py-2 text-[12px] font-bold text-slate-600 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-rose-300 shadow-sm"
                              value={cut.subheadline || ''}
                              onChange={e => updateCut(cut.cut_id, { subheadline: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CTA 문구</span>
                              <input 
                                className="w-full px-4 py-2 text-[12px] font-bold text-rose-500 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-rose-300 shadow-sm"
                                value={cut.cta_text || ''}
                                onChange={e => updateCut(cut.cut_id, { cta_text: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">로고 이미지 커스텀</span>
                              <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                  <div className="flex items-center justify-center h-10 px-4 bg-white border border-slate-100 rounded-xl hover:border-rose-300 transition-all text-[11px] font-bold text-slate-500 gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    {cut.custom_logo_url ? "로고 변경" : "사진 첨부 (로고/제품)"}
                                  </div>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          updateCut(cut.cut_id, { custom_logo_url: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                {cut.custom_logo_url && (
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 text-slate-400 hover:text-rose-500 rounded-xl"
                                    onClick={() => updateCut(cut.cut_id, { custom_logo_url: undefined })}
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">로고 표시</span>
                              <div className="flex items-center h-10 px-4 bg-white border border-slate-100 rounded-xl">
                                <input 
                                  type="checkbox"
                                  className="w-4 h-4 accent-rose-500"
                                  checked={cut.show_logo}
                                  onChange={e => updateCut(cut.cut_id, { show_logo: e.target.checked })}
                                />
                                <span className="ml-2 text-[11px] font-bold text-slate-400">표시함</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">상세 본문 추가</span>
                            <textarea 
                              className="w-full px-4 py-2 text-[12px] font-medium text-slate-600 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-rose-300 shadow-sm h-16 resize-none"
                              placeholder="더 많은 문구를 넣고 싶다면 여기 입력하세요..."
                              value={cut.body_text || ''}
                              onChange={e => updateCut(cut.cut_id, { body_text: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">메인 카피 크기 ({cut.text_overlay?.font_size || 100}%)</span>
                              <input 
                                type="range" min="50" max="250" step="5"
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                value={cut.text_overlay?.font_size || 100}
                                onChange={e => updateCut(cut.cut_id, { text_overlay: { ...cut.text_overlay, font_size: parseInt(e.target.value) } } as any)}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">서브 카피 크기 ({cut.text_overlay?.sub_font_size || 100}%)</span>
                              <input 
                                type="range" min="50" max="250" step="5"
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                value={cut.text_overlay?.sub_font_size || 100}
                                onChange={e => updateCut(cut.cut_id, { text_overlay: { ...cut.text_overlay, sub_font_size: parseInt(e.target.value) } } as any)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CTA 버튼 크기 ({cut.cta_size || 100}%)</span>
                              <input 
                                type="range" min="50" max="200" step="5"
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                value={cut.cta_size || 100}
                                onChange={e => updateCut(cut.cut_id, { cta_size: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">로고 크기</span>
                                <span className="text-[9px] font-bold text-slate-400 mr-2">{cut.logo_size || 100}%</span>
                              </div>
                              <input 
                                type="range" min="30" max="300" step="10"
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                                value={cut.logo_size || 100}
                                onChange={e => updateCut(cut.cut_id, { logo_size: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button 
                              size="sm"
                              className="w-full h-11 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl shadow-sm gap-3 mt-2 font-bold text-[12px] transition-all active:scale-[0.98]"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newId = Math.random().toString(36).substr(2, 9);
                                updateCut(cut.cut_id, { 
                                  extra_texts: [...(cut.extra_texts || []), {
                                    id: newId,
                                    content: '새 텍스트',
                                    pos_x: 50,
                                    pos_y: 50,
                                    font_size: 100,
                                    scale_x: 100,
                                    scale_y: 100,
                                    font_color: '#ffffff',
                                    rotate: 0
                                  }]
                                });
                                setSelectedElementId(`${cut.cut_id}-extra-${newId}`);
                              }}
                            >
                              <Plus className="w-4 h-4 text-rose-500" />
                              새로운 텍스트 레이어 추가
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">텍스트 배치</span>
                              <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-slate-100 rounded-xl">
                                {['top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                                  <button 
                                    key={pos}
                                    className={cn(
                                      "h-8 rounded-md transition-all",
                                      cut.text_overlay?.position === pos ? "bg-rose-500 shadow-lg" : "hover:bg-slate-50 border border-slate-50"
                                    )}
                                    onClick={() => updateCut(cut.cut_id, { text_overlay: { ...cut.text_overlay, position: pos } } as any)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">로고 배치 & 크기</span>
                                <span className="text-[9px] font-bold text-slate-400 mr-2">{cut.logo_size || 100}%</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-slate-100 rounded-xl h-[78px]">
                                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                                  <button 
                                    key={pos}
                                    className={cn(
                                      "h-7 rounded-md transition-all",
                                      cut.logo_position === pos ? "bg-zinc-900 shadow-lg" : "hover:bg-slate-50 border border-slate-50"
                                    )}
                                    onClick={() => updateCut(cut.cut_id, { logo_position: pos })}
                                  />
                                ))}
                              </div>
                              <input 
                                type="range" min="30" max="300" step="10"
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                                value={cut.logo_size || 100}
                                onChange={e => updateCut(cut.cut_id, { logo_size: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">AI 이미지 프롬프트 (EN)</span>
                              <div className="flex gap-2">
                                <label className="cursor-pointer">
                                  <div className={cn(
                                    "flex items-center justify-center h-6 px-2 rounded-lg border text-[9px] font-bold gap-1.5 transition-all",
                                    cut.reference_image_url ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 shadow-sm"
                                  )}>
                                    <ImageIcon className="w-2.5 h-2.5" />
                                    {cut.reference_image_url ? "참고 이미지 변경됨" : "사진 참고 (Style Reference)"}
                                  </div>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          updateCut(cut.cut_id, { reference_image_url: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-6 text-[9px] gap-1.5 px-2 rounded-lg border-rose-200 text-rose-500 hover:bg-rose-50"
                                  onClick={() => {
                                    // Prompt Magic Optimization Simulation
                                    const optimized = `Masterpiece, high quality, professional commercial photography, advertising shot, cinematic lighting, ${cut.prompt_en}, 8k resolution, highly detailed`;
                                    updateCut(cut.cut_id, { prompt_en: optimized });
                                  }}
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  매직 프롬프트
                                </Button>
                              </div>
                            </div>
                            <div className="relative">
                              <textarea 
                                className={cn(
                                  "w-full p-4 text-[11px] text-slate-500 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-rose-300 resize-none h-24 shadow-sm transition-all",
                                  cut.reference_image_url && "pr-24"
                                )}
                                placeholder="생성하고 싶은 이미지의 스타일을 영문으로 입력하세요..."
                                value={cut.prompt_en}
                                onChange={e => updateCut(cut.cut_id, { prompt_en: e.target.value })}
                              />
                              {cut.reference_image_url && (
                                <div className="absolute right-3 top-3 group/thumb">
                                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-lg ring-4 ring-indigo-50/50">
                                    <img src={cut.reference_image_url} className="w-full h-full object-cover" alt="Reference" />
                                    <button 
                                      className="absolute top-1 right-1 w-5 h-5 bg-zinc-900/80 rounded-full flex items-center justify-center text-white p-1 hover:bg-rose-500 transition-all opacity-0 group-hover/thumb:opacity-100 scale-75 group-hover/thumb:scale-100"
                                      onClick={() => updateCut(cut.cut_id, { reference_image_url: undefined })}
                                    >
                                      <RefreshCw className="w-full h-full" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-5">
                        <div className="space-y-2">
                          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">장면 해설 (Scene Insight)</h4>
                          <p className="text-[15px] text-slate-700 font-medium leading-relaxed break-keep">
                            {cut.prompt_ko}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="px-4 py-2 bg-white border border-slate-50 rounded-2xl text-[13px] font-bold text-slate-800 shadow-sm">
                            <span className="text-slate-300 mr-2 uppercase text-[9px] tracking-widest">Text</span>
                            {cut.text_overlay?.content}
                          </div>
                          <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl text-[13px] font-bold text-rose-600 shadow-sm">
                            <span className="text-rose-200 mr-2 uppercase text-[9px] tracking-widest">CTA</span>
                            {cut.cta_text}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feedback Form */}
                    {isFeedbackOpen && (
                      <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[32px] animate-in fade-in slide-in-from-top-2">
                        <div className="relative">
                          <Input 
                            value={feedbackText} 
                            onChange={e => setFeedbackText(e.target.value)}
                            placeholder="이미지 수정사항을 피드백으로 주세요..." 
                            className="h-12 text-[12px] rounded-2xl border-indigo-200 bg-white shadow-inner font-medium pr-14 focus:ring-indigo-500/20 focus:border-indigo-400" 
                            onKeyDown={(e) => e.key === 'Enter' && handleFeedbackSubmit(cut.cut_id)}
                          />
                          <Button 
                            size="sm" 
                            className="h-10 w-10 p-0 absolute right-1 top-1 bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-lg transition-all" 
                            onClick={() => handleFeedbackSubmit(cut.cut_id)}
                          >
                            <Send className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>

      {/* Right: Editor Sidebar Panel */}
      <div className="w-[420px] flex-shrink-0 animate-in slide-in-from-right-10 duration-700 sticky top-0 self-start">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-[48px] shadow-[0_48px_100px_-32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
          {/* Header */}
          <div className="p-8 border-b border-slate-100/50 bg-white/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 tracking-tight leading-none mb-1">AD EDITOR</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">요소 속성 정밀 편집</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {selectedElementType && selectedCut ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50/50 border border-slate-100 rounded-[24px]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                    {selectedElementType === 'logo' ? <ImageIcon className="w-5 h-5" /> : <PenTool className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wide">
                      {selectedElementType === 'logo' ? 'Brand Logo' :
                       selectedElementType === 'headline' ? 'Main Headline' :
                       selectedElementType === 'subtext' ? 'Sub Text' :
                       selectedElementType === 'cta' ? 'Call to Action' : 'Extra Layer'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold">Element ID: {selectedElementId}</p>
                  </div>
                </div>

                <FloatingControls 
                  isSidebar
                  type={selectedElementType as any}
                  cut={selectedCut}
                  updateCut={updateCut}
                  localUpdate={(fields: any) => setLocalCuts(prev => prev.map(c => c.cut_id === selectedCut.cut_id ? { ...c, ...fields } : c))}
                  onClose={() => setSelectedElementId(null)}
                  elementId={selectedElementId || undefined}
                />

                <div className="mt-12 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Editing Pro Tip</span>
                  </div>
                  <p className="text-[12px] text-indigo-900/70 font-medium leading-relaxed">
                    캔버스에서 요소를 직접 드래그하여 위치를 조정하거나 리사이즈 핸들을 당겨 크기를 조절할 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-rose-50 rounded-[40px] scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                  <PenTool className="w-10 h-10 text-slate-200 group-hover:text-rose-400 transition-colors relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-[15px] font-bold text-slate-800">편집할 요소를 선택하세요</h4>
                  <p className="text-[13px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    캔버스의 텍스트나 로고를 클릭하면 상세 편집 도구가 활성화됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


