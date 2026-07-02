"use client";

// Start: React State and UI Lifecycle Imports
import { useState } from "react";
// End: React State and UI Lifecycle Imports

// Start: Component External Interface Properties
interface ImageGeneratorProps {
  currentUserEmail: string;
}
// End: Component External Interface Properties

// Start: Main Flux-1-Schnell Image Generator Component
export default function ImageGenerator({ currentUserEmail }: ImageGeneratorProps) {
  const [imagePrompt, setImagePrompt] = useState<string>(" ");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // Start: API Transmission Pipeline Handler
  const handleImageGenerationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorNotification(null);

    try {
      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUserEmail,
          imagePrompt: imagePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to compile image asset buffer.");
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (apiError: any) {
      setErrorNotification(apiError.message || "Network storage transmission fault.");
    } finally {
      setIsGenerating(false);
    }
  };
  // End: API Transmission Pipeline Handler

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row gap-6">
      
      {/* Start: Left Panel - Input Controls Form Box */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cloudflare Workers AI Studio</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Model Blueprint: flux-1-schnell (Instant Production Text-to-Image)</p>
          </div>
        </div>

        <form onSubmit={handleImageGenerationSubmit} className="space-y-3">
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the product image or web banner you want to generate (e.g., 'A premium minimalist gourmet burger on a dark rustic plate, hyper-realistic, 8k resolution')..."
            className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
            disabled={isGenerating}
          />
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-blue-950/50 uppercase tracking-wider"
            disabled={isGenerating}
          >
            {isGenerating ? "Compiling Neural Tokens..." : "Generate Image with AI"}
          </button>
        </form>

        {errorNotification && (
          <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-[11px] rounded-xl font-medium">
            {errorNotification}
          </div>
        )}
      </div>
      {/* End: Left Panel - Input Controls Form Box */}

      {/* Start: Right Panel - Live Image Canvas Viewport */}
      <div className="w-full lg:w-72 flex flex-col items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-4 min-h-[220px] relative overflow-hidden group">
        {isGenerating ? (
          <div className="text-center space-y-3">
            <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase animate-pulse">
              FLUX RENDERING ENGINE ACTIVE...
            </p>
          </div>
        ) : generatedImageUrl ? (
          <div className="w-full h-full flex flex-col justify-between space-y-3">
            <img
              src={generatedImageUrl}
              alt="AI Generated Asset Output"
              className="w-full h-auto rounded-lg shadow-md object-cover max-h-[180px]"
            />
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-1 rounded text-center block uppercase">
              Asset Persisted to Cloudflare R2
            </span>
          </div>
        ) : (
          <div className="text-center text-slate-600 space-y-2">
            <div className="text-2xl opacity-40">🖼️</div>
            <p className="text-[10px] font-mono tracking-wider uppercase">
              Awaiting Prompt Generation Signal
            </p>
          </div>
        )}
      </div>
      {/* End: Right Panel - Live Image Canvas Viewport */}

    </div>
  );
}
// End: Main Flux-1-Schnell Image Generator Component