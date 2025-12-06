import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, ImageIcon, RefreshCw, Undo2, Redo2, Rotate3D, MousePointerClick, Images } from 'lucide-react';

interface CanvasProps {
  currentImage: string | null;
  referenceImages: string[];
  isLoading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
  // 360 Props
  is360Mode: boolean;
  frames360: string[];
  onToggle360: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  currentImage, 
  referenceImages,
  isLoading, 
  onImageUpload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  is360Mode,
  frames360,
  onToggle360
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current360FrameIndex, setCurrent360FrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Reset 360 index when mode changes
  useEffect(() => {
    if (is360Mode) setCurrent360FrameIndex(0);
  }, [is360Mode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onImageUpload(fakeEvent);
    }
  };

  // 360 Interaction Logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360Mode || frames360.length === 0) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !is360Mode || frames360.length === 0) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const delta = clientX - startX;
    
    // Sensitivity: change frame every 20px
    if (Math.abs(delta) > 20) {
      const direction = delta > 0 ? -1 : 1; // Drag left to rotate right
      setCurrent360FrameIndex(prev => {
        let next = prev + direction;
        if (next >= frames360.length) next = 0;
        if (next < 0) next = frames360.length - 1;
        return next;
      });
      setStartX(clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-4 md:p-8 select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-20 flex gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 shadow-xl">
        {!is360Mode && (
          <>
            <button 
              onClick={onUndo} 
              disabled={!canUndo || isLoading}
              className="p-2 hover:bg-slate-700 rounded text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onRedo} 
              disabled={!canRedo || isLoading}
              className="p-2 hover:bg-slate-700 rounded text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Redo"
            >
              <Redo2 className="w-5 h-5" />
            </button>
            <div className="w-px bg-slate-700 mx-1"></div>
            <button 
              onClick={onReset} 
              disabled={!currentImage || isLoading}
              className="p-2 hover:bg-red-900/50 hover:text-red-400 rounded text-slate-200 disabled:opacity-30 transition-colors"
              title="Reset to Original"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
             <div className="w-px bg-slate-700 mx-1"></div>
          </>
        )}
        
        {/* 360 Toggle Button */}
        <button 
          onClick={onToggle360} 
          disabled={!currentImage || isLoading}
          className={`p-2 rounded text-slate-200 disabled:opacity-30 transition-all flex items-center gap-2 px-3 font-medium
            ${is360Mode 
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
              : 'hover:bg-slate-700'
            }`}
          title="Toggle 360 View"
        >
          <Rotate3D className={`w-5 h-5 ${is360Mode ? 'animate-spin-slow' : ''}`} />
          <span className="hidden md:inline">{is360Mode ? 'Exit 360' : '360 View'}</span>
        </button>
      </div>

      {currentImage ? (
        <div 
          className={`relative w-full h-full flex flex-col items-center justify-center group ${is360Mode ? 'cursor-ew-resize' : ''}`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="relative shadow-2xl rounded-xl overflow-hidden max-w-5xl max-h-[80vh] border border-slate-800 bg-slate-900 w-full flex items-center justify-center">
            {/* Display Image: Either the current editor image OR the active 360 frame */}
            <img 
              src={is360Mode && frames360.length > 0 ? frames360[current360FrameIndex] : currentImage} 
              alt="Ertiga Modification" 
              className={`max-w-full max-h-[75vh] object-contain transition-all duration-500 
                ${isLoading ? 'blur-sm scale-[0.99] opacity-80' : 'blur-0 scale-100 opacity-100'}
                ${is360Mode ? 'pointer-events-none' : ''} 
              `}
              draggable={false}
            />
            
            {/* 360 Indicator Overlay */}
            {is360Mode && frames360.length > 0 && !isLoading && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-80">
                <div className="flex gap-1 mb-1">
                   {frames360.map((_, idx) => (
                     <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === current360FrameIndex ? 'bg-amber-500' : 'bg-slate-600'}`}
                      />
                   ))}
                </div>
                <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 text-xs text-white">
                  <MousePointerClick className="w-3 h-3" />
                  <span>Drag to rotate</span>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10 text-center p-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
                <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-amber-500/30 shadow-xl max-w-xs">
                  <h3 className="text-amber-500 font-bold text-sm mb-1">
                    {is360Mode ? "Generating 360° Views..." : "AI is installing parts..."}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    {is360Mode 
                      ? "Creating multiple angles. This takes a few seconds." 
                      : "Please wait while we modify the vehicle."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Re-upload button */}
            {!is360Mode && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-amber-600 text-white p-2 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                title="Add/Change Photos"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Reference Thumbnails */}
          {!is360Mode && referenceImages.length > 0 && (
            <div className="mt-4 flex gap-2 p-2 bg-slate-900/50 backdrop-blur rounded-lg border border-slate-800">
               <span className="text-xs text-slate-500 absolute -top-6 left-2 font-medium">References:</span>
               {referenceImages.map((img, idx) => (
                 <img 
                   key={idx} 
                   src={img} 
                   alt={`Ref ${idx}`} 
                   className="w-12 h-12 object-cover rounded border border-slate-700 opacity-60 hover:opacity-100 transition-opacity"
                 />
               ))}
               <div className="text-[10px] text-slate-500 max-w-[100px] leading-tight flex items-center">
                 AI uses these for detail context
               </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty State / Upload Area */
        <div 
          className="w-full max-w-xl p-12 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-amber-900/20 relative">
            <Upload className="w-10 h-10 text-amber-500" />
            <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              MAX 4
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Upload your Ertiga</h2>
          <p className="text-slate-400 mb-6 max-w-sm">
            Upload up to 4 photos for maximum detail. Drag & drop here.
            <br/><span className="text-xs opacity-60">(Front, Side, Rear angles recommended)</span>
          </p>
          <button className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2">
            <Images className="w-4 h-4" />
            Select Photos
          </button>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/*"
        multiple
        className="hidden" 
      />
    </div>
  );
};

export default Canvas;