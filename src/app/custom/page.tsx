'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Type, 
  Image as ImageIcon, 
  RotateCcw, 
  ShoppingCart,
  Trash2,
  Sun,
  Move,
  Layout,
  ChevronLeft,
  Undo2,
  Redo2,
  Plus,
  Grid,
  Copy,
  AlertCircle,
  CheckCircle2,
  MousePointer2,
  Maximize,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const ISO_RATIO = 1 / 1.4142; // Standard A4 ratio

const SIZES = [
  { id: 'A4', name: 'A4 Standard', dimensions: '21 x 29.7 cm', ratio: ISO_RATIO, visualScale: 1, minWidth: 2400 },
  { id: 'A5', name: 'A5 Medium', dimensions: '14.8 x 21 cm', ratio: ISO_RATIO, visualScale: 0.8, minWidth: 1800 },
  { id: 'A6', name: 'A6 Small', dimensions: '10.5 x 14.8 cm', ratio: ISO_RATIO, visualScale: 0.6, minWidth: 1200 },
];

const FONTS = [
  { name: 'Space Grotesk', class: 'font-sans' },
  { name: 'Playfair Display', class: 'font-serif' },
  { name: 'Mono', class: 'font-mono' },
];

interface ImageState {
  url: string;
  id: string;
  transform: { scale: number; rotate: number; x: number; y: number };
  resolution: { width: number; height: number };
}

interface EditorState {
  images: ImageState[];
  sizeId: string;
  isBorderless: boolean;
  layoutMode: 'one-paper' | 'separate';
  adjustments: { brightness: number; contrast: number; saturation: number };
  text: string;
  fontName: string;
  fontSize: number;
}

export default function CustomPosterBuilder() {
  const [images, setImages] = useState<ImageState[]>([]);
  const [size, setSize] = useState(SIZES[0]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [layoutMode, setLayoutMode] = useState<'one-paper' | 'separate'>('one-paper');
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [font, setFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(24);
  const [textPos, setTextPos] = useState({ x: 50, y: 80 });
  const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [isBorderless, setIsBorderless] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [viewMode, setViewMode] = useState<'canvas' | 'room'>('canvas');
  const [isSaving, setIsSaving] = useState(false);
  const [showResWarning, setShowResWarning] = useState(false);
  
  // Undo/Redo System
  const [history, setHistory] = useState<EditorState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { addToCart } = useCart();

  const getCurrentState = (): EditorState => ({
    images: JSON.parse(JSON.stringify(images)),
    sizeId: size.id,
    isBorderless,
    layoutMode,
    adjustments: { ...adjustments },
    text,
    fontName: font.name,
    fontSize
  });

  const saveToHistory = useCallback(() => {
    const newState = getCurrentState();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newState].slice(-30);
    });
    setHistoryIndex(prev => prev + 1);
  }, [images, size, isBorderless, layoutMode, adjustments, text, font, fontSize, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      applyState(prevState);
      setHistoryIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      applyState(nextState);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const applyState = (state: EditorState) => {
    setImages(state.images);
    const newSize = SIZES.find(s => s.id === state.sizeId) || SIZES[0];
    setSize(newSize);
    setIsBorderless(state.isBorderless);
    setLayoutMode(state.layoutMode);
    setAdjustments(state.adjustments);
    setText(state.text);
    const newFont = FONTS.find(f => f.name === state.fontName) || FONTS[0];
    setFont(newFont);
    setFontSize(state.fontSize);
  };

  const checkResolution = (imgWidth: number) => {
    if (imgWidth < size.minWidth) {
      setShowResWarning(true);
      const suggestion = SIZES.find(s => imgWidth >= s.minWidth) || SIZES[SIZES.length - 1];
      toast(
        <div className="flex flex-col gap-1">
          <p className="font-bold flex items-center gap-2 text-sm"><Sparkles size={14} className="text-amber-500" /> Resolution Intelligence</p>
          <p className="text-[11px] leading-tight">For professional-grade clarity, we suggest <b>{suggestion.id}</b> size for this photo.</p>
          <button 
            onClick={() => {
              setSize(suggestion);
              toast.dismiss('res-warning');
            }}
            className="mt-2 text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Optimize to {suggestion.id}
          </button>
        </div>,
        { duration: 8000, id: 'res-warning' }
      );
    } else {
      setShowResWarning(false);
    }
  };

  const getSlotRatio = (paperRatio: number, count: number, idx: number) => {
    if (layoutMode === 'separate' || count <= 1) return paperRatio;
    if (count === 2) return paperRatio * 2; // Stacked
    if (count === 3) return idx === 0 ? paperRatio * 2 : paperRatio;
    return paperRatio; // 2x2 grid
  };

  const autoFitImage = useCallback((idx: number, currentImages: ImageState[], resetPos = false) => {
    const img = currentImages[idx];
    if (!img) return;
    
    const slotRatio = getSlotRatio(size.ratio, currentImages.length, idx);
    const imgRatio = img.resolution.width / img.resolution.height;
    
    let newScale = 0.95; // Default safety margin to prevent any edge cutting
    
    if (imgRatio > slotRatio) {
      // Wider than slot
      newScale = (slotRatio / imgRatio) * 0.95;
    } else {
      // Taller than slot
      newScale = 0.95;
    }
    
    if (isBorderless) newScale /= 0.95;

    setImages(prev => prev.map((im, i) => i === idx ? { 
      ...im, 
      transform: { 
        ...im.transform, 
        scale: newScale,
        ...(resetPos ? { x: 0, y: 0, rotate: 0 } : {})
      } 
    } : im));
  }, [size.ratio, layoutMode, isBorderless]);

  // Recalculate fit when layout parameters change
  useEffect(() => {
    if (images.length > 0) {
      const updatedImages = images.map((img, idx) => {
        const slotRatio = getSlotRatio(size.ratio, images.length, idx);
        const imgRatio = img.resolution.width / img.resolution.height;
        let newScale = 0.95;
        if (imgRatio > slotRatio) {
          newScale = (slotRatio / imgRatio) * 0.95;
        } else {
          newScale = 0.95;
        }
        if (isBorderless) newScale /= 0.95;
        return {
          ...img,
          transform: {
            ...img.transform,
            scale: newScale,
            x: 0, // Reset position to ensure no cut
            y: 0
          }
        };
      });
      setImages(updatedImages);
    }
  }, [size.id, layoutMode, isBorderless]);

  const onDrop = (acceptedFiles: File[]) => {
    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const filesToProcess = acceptedFiles.slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const newImg: ImageState = {
            url: reader.result as string,
            id: Math.random().toString(36).substr(2, 9),
            transform: { scale: 1, rotate: 0, x: 0, y: 0 },
            resolution: { width: img.width, height: img.height }
          };
          
          setImages(prev => {
            const updated = [...prev, newImg].slice(0, 4);
            const newIdx = updated.length - 1;
            // Immediate fit
            const slotRatio = getSlotRatio(size.ratio, updated.length, newIdx);
            const imgRatio = newImg.resolution.width / newImg.resolution.height;
            let newScale = 0.95;
            if (imgRatio > slotRatio) newScale = (slotRatio / imgRatio) * 0.95;
            if (isBorderless) newScale /= 0.95;
            updated[newIdx].transform.scale = newScale;
            return updated;
          });
          
          setSelectedImageIdx(images.length);
          checkResolution(img.width);
          saveToHistory();
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIdx === index) setSelectedImageIdx(null);
    saveToHistory();
  };

  const updateTransform = (idx: number, newTransform: Partial<ImageState['transform']>) => {
    setImages(prev => prev.map((img, i) => i === idx ? { ...img, transform: { ...img.transform, ...newTransform } } : img));
  };

  const handleTransformEnd = () => {
    saveToHistory();
  };

  const calculateTotalPrice = () => {
    const basePrice = 299;
    const borderlessPrice = isBorderless ? 9 : 0;
    const perPosterPrice = basePrice + borderlessPrice;
    return layoutMode === 'separate' ? perPosterPrice * (images.length || 1) : perPosterPrice;
  };

  const handleAddToCart = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSaving(true);
    try {
      const designData = {
        images,
        layoutMode,
        text,
        textColor,
        font: font.name,
        fontSize,
        textPos,
        adjustments,
        size: size.id,
        isBorderless,
        totalPrice: calculateTotalPrice(),
        printSpecs: {
          dpi: 300,
          colorProfile: 'CMYK',
          margin: isBorderless ? '0mm' : '5mm',
          paper: 'Premium Luster Photo Paper'
        }
      };

      const { data, error } = await supabase
        .from('custom_designs')
        .insert([{
          design_data: designData,
          preview_url: images[0].url,
          size: size.id
        }])
        .select()
        .single();

      if (error) throw error;

      addToCart({
        id: `custom-${data.id}`,
        name: `Wallified Custom ${size.id}`,
        price: calculateTotalPrice(),
        image_url: images[0].url,
        quantity: 1,
        size: size.id,
        is_custom: true,
        design_id: data.id,
        is_borderless: isBorderless
      });

      toast.success('Added to Wallified cart!');
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getGridClass = (count: number) => {
    if (layoutMode === 'separate') return 'flex flex-col gap-4 w-full h-full';
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-1 grid-rows-2 gap-4';
    if (count === 3) return 'grid-cols-2 grid-rows-2 gap-4 [&>*:first-child]:col-span-2';
    return 'grid-cols-2 grid-rows-2 gap-4';
  };

  const resetAll = () => {
    const updatedImages = images.map((img, idx) => {
      const slotRatio = getSlotRatio(size.ratio, images.length, idx);
      const imgRatio = img.resolution.width / img.resolution.height;
      let newScale = 0.95;
      if (imgRatio > slotRatio) newScale = (slotRatio / imgRatio) * 0.95;
      if (isBorderless) newScale /= 0.95;
      return { ...img, transform: { scale: newScale, rotate: 0, x: 0, y: 0 } };
    });
    setImages(updatedImages);
    setAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
    setText('');
    saveToHistory();
    toast.success('Reset to professional defaults');
  };

  const currentTransform = selectedImageIdx !== null ? images[selectedImageIdx]?.transform : { scale: 1, x: 0, y: 0, rotate: 0 };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row overflow-hidden font-sans">
      <aside className="w-full lg:w-[420px] bg-white border-r border-gray-100 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Studio<span className="text-red-500">.</span>Wallified</h1>
          </div>
          <div className="flex gap-1">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-20"><Undo2 size={18} /></button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-20"><Redo2 size={18} /></button>
          </div>
        </div>

        <div className="flex bg-gray-50/50">
          {[
            { id: 'image', icon: ImageIcon, label: 'Photos' },
            { id: 'layout', icon: Layout, label: 'Canvas' },
            { id: 'transform', icon: Move, label: 'Position' },
            { id: 'adjust', icon: Sun, label: 'Tones' },
            { id: 'text', icon: Type, label: 'Text' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative ${
                activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[8px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-2 right-2 h-1 bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'image' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div 
                  {...getRootProps()} 
                  className={`aspect-[16/10] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group ${
                    isDragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black hover:bg-gray-50/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-gray-400 group-hover:text-black" />
                  </div>
                  <p className="font-black uppercase tracking-widest text-[10px]">Import Photos ({images.length}/4)</p>
                  <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-tighter">Drag & Drop or Click to Browse</p>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img, idx) => (
                      <div 
                        key={img.id} 
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative aspect-square rounded-2xl overflow-hidden group shadow-sm cursor-pointer border-2 transition-all ${
                          selectedImageIdx === idx ? 'border-black ring-4 ring-black/5 scale-[1.02]' : 'border-transparent'
                        }`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt={`Upload ${idx}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                            className="p-2 bg-white text-black rounded-xl hover:scale-110 transition-transform"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[8px] text-white font-bold">#{idx + 1}</div>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <button {...getRootProps()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all bg-gray-50/30">
                        <Plus size={24} />
                      </button>
                    )}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Layout Arrangement</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setLayoutMode('one-paper'); saveToHistory(); }}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          layoutMode === 'one-paper' ? 'border-black bg-black text-white' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <Grid size={18} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Multi-Grid</span>
                      </button>
                      <button
                        onClick={() => { setLayoutMode('separate'); saveToHistory(); }}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          layoutMode === 'separate' ? 'border-black bg-black text-white' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <Copy size={18} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Solo Set</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'layout' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Print Size</label>
                  <div className="space-y-2">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSize(s);
                          images.forEach((imgState) => checkResolution(imgState.resolution.width));
                          saveToHistory();
                        }}
                        className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group ${
                          size.id === s.id ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-black uppercase tracking-tighter text-base">{s.id}</p>
                          <p className={`text-[9px] uppercase tracking-widest font-bold ${size.id === s.id ? 'text-gray-400' : 'text-gray-400'}`}>{s.dimensions}</p>
                        </div>
                        <div className={`w-8 h-10 border-2 rounded-md transition-all ${size.id === s.id ? 'border-white bg-white/10' : 'border-black group-hover:scale-110'}`} style={{ aspectRatio: s.ratio }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Edge Treatment</label>
                  <button
                    onClick={() => { setIsBorderless(!isBorderless); saveToHistory(); }}
                    className={`w-full p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 relative overflow-hidden group ${
                      isBorderless ? 'border-red-500 bg-red-50/40' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full relative z-10">
                      <div className="text-left">
                        <p className="font-black uppercase tracking-tighter text-lg italic">Borderless</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Full Bleed • No White Margins</p>
                      </div>
                      <div className={`w-14 h-7 rounded-full relative transition-colors ${isBorderless ? 'bg-red-500' : 'bg-gray-200'}`}>
                        <motion.div animate={{ x: isBorderless ? 28 : 4 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-gray-100 relative z-10">
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1"><Sparkles size={10}/> Premium Choice</span>
                      <span className="font-black text-red-500 text-sm">+ ₹9</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'transform' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {selectedImageIdx === null ? (
                  <div className="text-center py-16 text-gray-300">
                    <MousePointer2 size={48} className="mx-auto mb-6 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Select a photo on the canvas to edit</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scale / Zoom</label>
                        <span className="text-[10px] font-black text-black bg-gray-100 px-2 py-1 rounded">{(currentTransform.scale * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="3" 
                        step="0.01" 
                        value={currentTransform.scale} 
                        onChange={(e) => updateTransform(selectedImageIdx, { scale: parseFloat(e.target.value)})} 
                        onMouseUp={handleTransformEnd}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                      />
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manual Rotation</label>
                        <span className="text-[10px] font-black text-black bg-gray-100 px-2 py-1 rounded">{currentTransform.rotate}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="-180" 
                        max="180" 
                        value={currentTransform.rotate} 
                        onChange={(e) => updateTransform(selectedImageIdx, { rotate: parseInt(e.target.value)})} 
                        onMouseUp={handleTransformEnd}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => { autoFitImage(selectedImageIdx, images, true); saveToHistory(); }}
                        className="flex-1 py-4 rounded-2xl border border-gray-100 text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCcw size={14} />
                        Auto-Fit Photo
                      </button>
                    </div>
                  </>
                )}
                
                <button 
                  onClick={resetAll}
                  className="w-full py-4 rounded-2xl bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                >
                  <Maximize size={14} />
                  Reset Entire Design
                </button>
              </motion.div>
            )}

            {activeTab === 'adjust' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {['brightness', 'contrast', 'saturation'].map((adj) => (
                  <div key={adj} className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{adj}</span>
                      <span className="text-[10px] font-black text-black bg-gray-100 px-2 py-1 rounded">{(adjustments as any)[adj]}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={(adjustments as any)[adj]} 
                      onChange={(e) => setAdjustments({...adjustments, [adj]: parseInt(e.target.value)})} 
                      onMouseUp={handleTransformEnd}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'text' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Poster Overlay</label>
                  <input 
                    type="text" 
                    value={text}
                    onChange={(e) => { setText(e.target.value); saveToHistory(); }}
                    placeholder="E.g. SUMMER 2024"
                    className="w-full px-5 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-2 focus:ring-black font-black uppercase tracking-widest text-xs"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Typography Style</label>
                  <div className="grid grid-cols-1 gap-2">
                    {FONTS.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => { setFont(f); saveToHistory(); }}
                        className={`p-5 rounded-2xl border text-left transition-all ${
                          font.name === f.name ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`text-xl ${f.class}`}>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Text Scale</label>
                    <span className="text-[10px] font-black text-black bg-gray-100 px-2 py-1 rounded">{fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="140" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))} 
                    onMouseUp={handleTransformEnd}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-gray-50 bg-white">
          <div className="flex justify-between mb-5 items-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Value</span>
              <span className="text-2xl font-black italic">₹{calculateTotalPrice()}</span>
            </div>
            <div className="px-3 py-1 bg-green-50 rounded-lg">
              <span className="text-[9px] font-black uppercase text-green-600 tracking-widest">Ships in 48h</span>
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={images.length === 0 || isSaving}
            className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-black/30 disabled:opacity-30"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                  <ShoppingCart size={16} />
                  Confirm Design
                </>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col relative bg-[#f1f1f1] p-6 lg:p-12 overflow-hidden">
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
          <button onClick={() => window.history.back()} className="p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"><ChevronLeft size={20} /></button>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-1.5 flex gap-1 border border-white">
            {['canvas', 'room'].map((mode) => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-8 py-3 rounded-[1.25rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                  viewMode === mode ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
                }`}
              >
                {mode === 'canvas' ? 'The Lab' : 'The Room'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center relative overflow-y-auto pt-24 pb-16 custom-scrollbar">
          <AnimatePresence mode="wait">
            {viewMode === 'canvas' ? (
                <div className="flex flex-col items-center gap-10 w-full h-full justify-center">
                  <div className="relative flex items-center justify-center w-full h-full max-h-[78vh]">
                    {layoutMode === 'separate' ? (
                      <div className="flex flex-wrap justify-center gap-16 w-full px-10 items-center overflow-y-auto max-h-full py-12 scroll-smooth">
                        {images.map((img, idx) => (
                          <motion.div
                            key={img.id}
                            onClick={() => setSelectedImageIdx(idx)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative shadow-[0_60px_120px_-20px_rgba(0,0,0,0.25)] bg-white overflow-hidden transition-all duration-700 flex-shrink-0 cursor-crosshair ${
                              !isBorderless ? 'p-10' : 'p-0'
                            } ${selectedImageIdx === idx ? 'ring-4 ring-black ring-offset-8 scale-[1.02]' : ''}`}
                            style={{
                              height: '72vh',
                              aspectRatio: size.ratio,
                            }}
                          >
                            <div className="w-full h-full relative overflow-hidden bg-white">
                              <motion.div
                                drag
                                dragMomentum={false}
                                onDrag={(e, info) => {
                                  updateTransform(idx, { 
                                    x: img.transform.x + info.delta.x,
                                    y: img.transform.y + info.delta.y
                                  });
                                }}
                                onDragEnd={handleTransformEnd}
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  x: img.transform.x,
                                  y: img.transform.y,
                                  scale: img.transform.scale,
                                  rotate: img.transform.rotate,
                                }}
                              >
                                <img 
                                  src={img.url} 
                                  className="w-full h-full pointer-events-none transition-all object-contain"
                                  style={{
                                    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                                  }}
                                />
                              </motion.div>
                              {text && idx === 0 && (
                                <div className={`absolute pointer-events-none text-center ${font.class}`} style={{ left: `${textPos.x}%`, top: `${textPos.y}%`, fontSize: `${fontSize}px`, color: textColor, transform: 'translate(-50%, -50%)', textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                  {text}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        key="canvas"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] bg-white overflow-hidden transition-all duration-700 ${!isBorderless ? 'p-12' : 'p-0'}`}
                        style={{
                          height: '78vh',
                          aspectRatio: size.ratio,
                        }}
                      >
                        <div className={`w-full h-full relative grid ${getGridClass(images.length)} overflow-hidden bg-white`}>
                          {images.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-100 pointer-events-none">
                              <ImageIcon size={160} className="mb-6 opacity-30" />
                              <p className="font-black text-8xl uppercase tracking-tighter italic opacity-30">WALLIFIED</p>
                            </div>
                          ) : (
                            images.map((img, idx) => (
                              <div 
                                key={img.id} 
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(idx); }}
                                className={`relative w-full h-full overflow-hidden cursor-crosshair transition-all ${selectedImageIdx === idx ? 'z-10 bg-gray-50/10' : 'hover:bg-gray-50/5'}`}
                              >
                                {selectedImageIdx === idx && <div className="absolute inset-0 border-[3px] border-black z-20 pointer-events-none opacity-20" />}
                                <motion.div
                                  drag
                                  dragMomentum={false}
                                  onDrag={(e, info) => {
                                    updateTransform(idx, { 
                                      x: img.transform.x + info.delta.x,
                                      y: img.transform.y + info.delta.y
                                    });
                                  }}
                                  onDragEnd={handleTransformEnd}
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    x: img.transform.x,
                                    y: img.transform.y,
                                    scale: img.transform.scale,
                                    rotate: img.transform.rotate,
                                  }}
                                >
                                  <img 
                                    src={img.url} 
                                    className="w-full h-full pointer-events-none transition-all object-contain"
                                    style={{
                                      filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                                    }}
                                  />
                                </motion.div>
                              </div>
                            ))
                          )}
                          {text && (
                            <div className={`absolute pointer-events-none text-center z-20 ${font.class}`} style={{ left: `${textPos.x}%`, top: `${textPos.y}%`, fontSize: `${fontSize}px`, color: textColor, transform: 'translate(-50%, -50%)', textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                              {text}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="bg-zinc-900 backdrop-blur text-white text-[9px] font-black uppercase tracking-[0.25em] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      Studio Intelligence: Perfectly Centered — {size.id} Format — High Precision
                    </div>
                  </div>
                </div>
            ) : (
              <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full flex items-center justify-center min-h-[640px]">
                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=2670&auto=format&fit=crop" alt="Room Mockup" className="absolute inset-0 w-full h-full object-cover rounded-[4rem] shadow-inner" />
                <div className="absolute inset-0 bg-black/20 rounded-[4rem]" />
                
                <div className="relative z-10 flex gap-10 items-end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative shadow-[0_80px_120px_-30px_rgba(0,0,0,0.5)] overflow-hidden border-[15px] border-zinc-950 transition-all duration-700 bg-white ${!isBorderless ? 'p-6' : 'p-0'}`}
                    style={{
                      height: `${50 * size.visualScale}vh`,
                      aspectRatio: size.ratio,
                      transform: 'perspective(1500px) rotateY(-10deg) rotateX(3deg)',
                    }}
                  >
                      <div className={`w-full h-full relative grid ${getGridClass(images.length)} overflow-hidden bg-white`}>
                        {images.map((img) => (
                          <div key={img.id} className="relative w-full h-full overflow-hidden">
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                transform: `translate(${img.transform.x * (50/78)}px, ${img.transform.y * (50/78)}px) scale(${img.transform.scale}) rotate(${img.transform.rotate}deg)`,
                              }}
                            >
                              <img 
                                src={img.url} 
                                className="w-full h-full object-contain" 
                                style={{ 
                                  filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                  Virtual Preview • 1:1 Aesthetic Ratio
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white flex gap-10 z-10 items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">Print Health</span>
            <div className="flex items-center gap-2">
               {showResWarning ? <AlertCircle size={14} className="text-amber-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
               <span className="text-[10px] font-black uppercase tracking-tighter">{showResWarning ? 'Resolution Alert' : 'Perfect Resolution'}</span>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">Active Format</span>
            <span className="text-[10px] font-black uppercase tracking-tighter italic">{size.id} Series</span>
          </div>
          <div className="w-px h-12 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">Focus Photo</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{selectedImageIdx !== null ? `Layer #${selectedImageIdx + 1}` : 'None Selected'}</span>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d4;
        }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
}
