"use client";

import React from "react";

// Start: Component Local Type Definitions
interface ContentConfiguratorProps {
  activePreviewJson: Record<string, any>;
  onUpdateHeroHeadline: (headline: string) => void;
  onUpdateHeroSubheadline: (subheadline: string) => void;
  onUpdateWhatsappTargetNumber: (targetNumber: string) => void;
  onUpdateWhatsappButtonText: (buttonText: string) => void;
}
// End: Component Local Type Definitions

// Start: Live Content & Routing Configurator Component
const ContentConfigurator: React.FC<ContentConfiguratorProps> = ({
  activePreviewJson,
  onUpdateHeroHeadline,
  onUpdateHeroSubheadline,
  onUpdateWhatsappTargetNumber,
  onUpdateWhatsappButtonText,
}) => {
  return (
    <div className="space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Content Configurator</h4>
      
      <div className="space-y-3">
        <label htmlFor="hero-headline" className="block text-xs font-semibold text-slate-300">Hero Headline</label>
        <input
          id="hero-headline"
          type="text"
          value={activePreviewJson.heroSection?.headline || ""}
          onChange={(e) => onUpdateHeroHeadline(e.target.value)}
          placeholder="Enter your main hero headline"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="hero-subheadline" className="block text-xs font-semibold text-slate-300">Hero Subheadline</label>
        <textarea
          id="hero-subheadline"
          value={activePreviewJson.heroSection?.subheadline || ""}
          onChange={(e) => onUpdateHeroSubheadline(e.target.value)}
          placeholder="Enter your hero subheadline"
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="whatsapp-number" className="block text-xs font-semibold text-slate-300">WhatsApp Target Number</label>
        <input
          id="whatsapp-number"
          type="text"
          value={activePreviewJson.whatsappFormSection?.targetNumber || ""}
          onChange={(e) => onUpdateWhatsappTargetNumber(e.target.value)}
          placeholder="e.g., 60123456789 (include country code)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="whatsapp-button-text" className="block text-xs font-semibold text-slate-300">WhatsApp Button Text</label>
        <input
          id="whatsapp-button-text"
          type="text"
          value={activePreviewJson.whatsappFormSection?.buttonText || ""}
          onChange={(e) => onUpdateWhatsappButtonText(e.target.value)}
          placeholder="e.g., Send Merchant Order via WhatsApp"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default ContentConfigurator;
// End: Live Content & Routing Configurator Component
