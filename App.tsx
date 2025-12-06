import React, { useState } from 'react';
import Controls from './components/Controls';
import Canvas from './components/Canvas';
import { ModificationOption, SelectedModification } from './types';
import { modifyCarImage, generate360Views } from './services/geminiService';
import { Wrench, CheckCircle2, X, Type } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  
  // History stack for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  
  // 360 State
  const [is360Mode, setIs360Mode] = useState<boolean>(false);
  const [frames360, setFrames360] = useState<string[]>([]);
  
  // Mod tracking
  const [installedParts, setInstalledParts] = useState<SelectedModification[]>([]);
  const [pendingMods, setPendingMods] = useState<SelectedModification[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Input Modal State
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [currentModForInput, setCurrentModForInput] = useState<ModificationOption | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Helper to get current image from history
  const currentImage = currentHistoryIndex >= 0 ? history[currentHistoryIndex] : null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers: Promise<string>[] = [];
      const maxFiles = Math.min(files.length, 4);

      // Read up to 4 files
      for (let i = 0; i < maxFiles; i++) {
        readers.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(files[i]);
        }));
      }

      Promise.all(readers).then((images) => {
        const mainImage = images[0];
        const references = images.slice(1);

        setOriginalImage(mainImage);
        setReferenceImages(references);
        
        // Reset state
        setHistory([mainImage]);
        setCurrentHistoryIndex(0);
        setError(null);
        setFrames360([]);
        setIs360Mode(false);
        setInstalledParts([]);
        setPendingMods([]);
      });
    }
  };

  /**
   * Toggles a modification in the pending list.
   */
  const handleToggleMod = (mod: ModificationOption) => {
    if (!currentImage) return;

    // Check if already pending
    const existingIndex = pendingMods.findIndex(p => p.id === mod.id);
    if (existingIndex >= 0) {
      // Remove it
      setPendingMods(prev => prev.filter(p => p.id !== mod.id));
      return;
    }

    // Limit to 8
    if (pendingMods.length >= 8) {
      // Optional: add toast notification here
      return;
    }

    if (mod.requiresInput) {
      setCurrentModForInput(mod);
      setInputValue("");
      setIsInputModalOpen(true);
    } else {
      setPendingMods(prev => [...prev, mod]);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentModForInput && inputValue.trim()) {
      setPendingMods(prev => [...prev, { ...currentModForInput, customInput: inputValue.trim() }]);
      setIsInputModalOpen(false);
      setCurrentModForInput(null);
    }
  };

  /**
   * Processes all pending modifications in a single batch.
   */
  const processPendingModifications = async () => {
    if (!currentImage || pendingMods.length === 0) return;

    setIsLoading(true);
    setError(null);
    setFrames360([]); // Invalidate previous 360 frames

    // Combine all prompts into a structured list
    const combinedPrompt = pendingMods.map((mod, index) => {
       let desc = mod.promptDescription;
       if (mod.customInput) {
         desc = desc.replace('[INPUT]', mod.customInput);
       }
       return `${index + 1}. ${desc}`;
    }).join('\n');

    try {
      // Pass the combined prompt to the service
      const modifiedImageBase64 = await modifyCarImage(currentImage, combinedPrompt, referenceImages);
      
      // Update history
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(modifiedImageBase64);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
      
      // Move pending to installed
      setInstalledParts(prev => [...prev, ...pendingMods]);
      setPendingMods([]); // Clear pending

    } catch (err: any) {
      console.error(err);
      setError("Failed to apply modifications. Please try again or select fewer parts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle360 = async () => {
    if (!currentImage) return;

    if (!is360Mode) {
      if (frames360.length === 0) {
        setIsLoading(true);
        setError(null);
        try {
          const generatedFrames = await generate360Views(currentImage);
          setFrames360(generatedFrames);
          setIs360Mode(true);
        } catch (err) {
          console.error(err);
          setError("Failed to generate 360 view. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIs360Mode(true);
      }
    } else {
      setIs360Mode(false);
    }
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      setFrames360([]);
      // Note: Reverting 'installedParts' accurately is complex with batches. 
      // For visual simplicity, we might just pop the last batch or clear visuals if needed.
      // But keeping the visual list is often preferred even if we undo the image.
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
      setFrames360([]);
    }
  };

  const handleReset = () => {
    if (originalImage) {
      const newHistory = [...history, originalImage];
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
      setFrames360([]);
      setIs360Mode(false);
      setInstalledParts([]);
      setPendingMods([]);
    }
  };

  const removeInstalledPart = (index: number) => {
    setInstalledParts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-700 rounded-lg shadow-lg">
            <Wrench className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ErtigaMod<span className="text-amber-500">Pro</span>
            </h1>
            <p className="text-xs text-slate-500 tracking-wider">VIRTUAL TUNING STUDIO 2020</p>
          </div>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg shadow-xl text-sm animate-bounce z-50">
            {error}
          </div>
        )}

        <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
           <span>Powered by Gemini 2.5 Flash Image</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden relative">
        
        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Canvas Area */}
          <Canvas 
            currentImage={currentImage}
            referenceImages={referenceImages}
            isLoading={isLoading}
            onImageUpload={handleImageUpload}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={currentHistoryIndex > 0}
            canRedo={currentHistoryIndex < history.length - 1}
            onReset={handleReset}
            is360Mode={is360Mode}
            frames360={frames360}
            onToggle360={handleToggle360}
          />

          {/* Installed Parts Bottom Panel */}
          {installedParts.length > 0 && (
            <div className="bg-slate-900 border-t border-slate-800 p-3 z-20 overflow-x-auto">
              <div className="flex items-center gap-3 px-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-2">
                  Installed:
                </span>
                <div className="flex gap-2">
                  {installedParts.map((part, idx) => (
                    <div 
                      key={`${part.id}-${idx}`} 
                      className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-300 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <CheckCircle2 className="w-3 h-3 text-amber-500" />
                      <span>{part.name}</span>
                      <button 
                        onClick={() => removeInstalledPart(idx)}
                        className="ml-1 hover:text-red-400 transition-colors"
                        title="Remove from list (Visual only)"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <Controls 
          onToggleMod={handleToggleMod} 
          onProcess={processPendingModifications}
          pendingMods={pendingMods}
          isLoading={isLoading || !currentImage || is360Mode} 
        />
      </main>

      {/* Input Modal */}
      {isInputModalOpen && currentModForInput && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Type className="w-5 h-5 text-amber-500" />
              {currentModForInput.name}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Enter the custom text or details for this modification.
            </p>
            
            <form onSubmit={handleInputSubmit}>
              <input
                type="text"
                autoFocus
                placeholder="e.g. B 1234 XYZ"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setIsInputModalOpen(false); setCurrentModForInput(null); }}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;