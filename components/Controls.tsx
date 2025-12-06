import React, { useState } from 'react';
import { MODIFICATION_OPTIONS } from '../constants';
import { ModCategory, ModificationOption, SelectedModification } from '../types';
import { ChevronRight, Layers, PenTool, Zap, Check } from 'lucide-react';

interface ControlsProps {
  onToggleMod: (mod: ModificationOption) => void;
  onProcess: () => void;
  pendingMods: SelectedModification[];
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onToggleMod, onProcess, pendingMods, isLoading }) => {
  const [activeCategory, setActiveCategory] = useState<ModCategory>(ModCategory.WHEELS);

  const categories = Object.values(ModCategory);
  
  const filteredOptions = MODIFICATION_OPTIONS.filter(opt => opt.category === activeCategory);

  // Helper to check if a mod is selected
  const isSelected = (id: string) => pendingMods.some(p => p.id === id);

  return (
    <div className="flex flex-col h-full bg-slate-800 border-l border-slate-700 w-full md:w-80 relative">
      
      {/* Overlay when disabled (e.g. 360 mode) */}
      {isLoading && (
         <div className="absolute inset-0 bg-slate-900/50 z-10 cursor-not-allowed flex items-center justify-center"></div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto md:flex-wrap bg-slate-900 border-b border-slate-700">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex-1 text-center
              ${activeCategory === cat 
                ? 'bg-slate-800 text-amber-500 border-b-2 border-amber-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Options Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24"> {/* Added padding bottom for fixed button */}
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
             Available Parts
           </h3>
           <span className="text-xs text-amber-500 font-medium">
             {pendingMods.length}/8 Selected
           </span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {filteredOptions.map((option) => {
            const selected = isSelected(option.id);
            return (
              <button
                key={option.id}
                onClick={() => !isLoading && onToggleMod(option)}
                disabled={isLoading}
                className={`group flex items-center p-3 rounded-lg border transition-all text-left relative overflow-hidden
                  ${selected 
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-900/20' 
                    : 'bg-slate-750 border-slate-700 hover:bg-slate-700 hover:border-slate-500'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Selection Indicator */}
                {selected && (
                  <div className="absolute top-0 right-0 p-1 bg-amber-500 rounded-bl-lg">
                    <Check className="w-3 h-3 text-slate-900 stroke-[3]" />
                  </div>
                )}

                <div className={`p-2 rounded-full mr-3 transition-colors ${selected ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-slate-400 group-hover:text-amber-500'}`}>
                  {option.icon || <PenTool className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${selected ? 'text-amber-400' : 'text-slate-200'}`}>
                    {option.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                     {option.promptDescription.slice(0, 30)}...
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Process Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700 shadow-lg z-20">
        <button
          onClick={onProcess}
          disabled={pendingMods.length === 0 || isLoading}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
            ${pendingMods.length > 0 && !isLoading
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-900/30' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Zap className={`w-5 h-5 ${pendingMods.length > 0 ? 'fill-current' : ''}`} />
              <span>
                {pendingMods.length === 0 ? 'Select Parts' : `Process Modifikasi (${pendingMods.length})`}
              </span>
            </>
          )}
        </button>
        
        {pendingMods.length === 0 && (
          <p className="text-center text-[10px] text-slate-500 mt-2">
            Select up to 8 parts, then click Process.
          </p>
        )}
      </div>
    </div>
  );
};

export default Controls;