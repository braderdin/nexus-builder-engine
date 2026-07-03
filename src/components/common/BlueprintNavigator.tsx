"use client";

import React, { useState } from "react";

// Start: Component Local Type Definitions
interface BlueprintNavigatorProps {
  activePreviewJson: Record<string, any>;
  setActivePreviewJson: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isPortfolioSectionEnabled: boolean;
  setIsPortfolioSectionEnabled: (val: boolean) => void;
  isTestimonialsSectionEnabled: boolean;
  setIsTestimonialsSectionEnabled: (val: boolean) => void;
}
// End: Component Local Type Definitions

// Start: Vercel-Style App Router Blueprint Navigator Component
const BlueprintNavigator: React.FC<BlueprintNavigatorProps> = ({
  activePreviewJson,
  setActivePreviewJson,
  isPortfolioSectionEnabled,
  setIsPortfolioSectionEnabled,
  isTestimonialsSectionEnabled,
  setIsTestimonialsSectionEnabled,
}) => {
  const [newPortfolio, setNewPortfolio] = useState({ title: "", description: "", imageUrl: "" });
  const [newTestimonial, setNewTestimonial] = useState({ clientName: "", feedback: "", clientTitle: "" });

  return (
    <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Blueprint Workspace Navigator</h4>

      {/* Start: Portfolio Section Sub-Controller */}
      <div className="space-y-4 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Enable Showcase Gallery (Portfolio)</span>
          <label htmlFor="portfolio-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="portfolio-toggle"
              className="sr-only peer"
              checked={isPortfolioSectionEnabled}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsPortfolioSectionEnabled(isChecked);
                setActivePreviewJson((prev) => ({
                  ...prev,
                  portfolioSection: isChecked ? (prev.portfolioSection || []) : undefined,
                }));
              }}
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {isPortfolioSectionEnabled && (
          <div className="space-y-3 pt-2">
            {(activePreviewJson.portfolioSection as Array<any>)?.map((item, index) => (
              <div key={item.id || index} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => {
                    const updated = [...(activePreviewJson.portfolioSection || [])];
                    updated[index] = { ...updated[index], title: e.target.value };
                    setActivePreviewJson((prev) => ({ ...prev, portfolioSection: updated }));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  placeholder="Item Title"
                />
                <button
                  onClick={() => {
                    const updated = (activePreviewJson.portfolioSection || []).filter((_, i) => i !== index);
                    setActivePreviewJson((prev) => ({ ...prev, portfolioSection: updated }));
                  }}
                  className="w-full bg-red-950/40 text-red-400 border border-red-900/40 py-1 rounded-lg text-[11px]"
                >
                  Remove Item
                </button>
              </div>
            ))}
            <div className="bg-slate-950 p-3 rounded-xl border border-dashed border-slate-800 space-y-2">
              <input
                type="text"
                placeholder="New Item Title"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <button
                onClick={() => {
                  if (!newPortfolio.title) return;
                  setActivePreviewJson((prev) => ({
                    ...prev,
                    portfolioSection: [...(prev.portfolioSection || []), { ...newPortfolio, id: `p-${Date.now()}` }],
                  }));
                  setNewPortfolio({ title: "", description: "", imageUrl: "" });
                }}
                className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold"
              >
                Add Portfolio Item
              </button>
            </div>
          </div>
        )}
      </div>
      {/* End: Portfolio Section Sub-Controller */}

      {/* Start: Testimonials Section Sub-Controller */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Enable Client Wall (Testimonials)</span>
          <label htmlFor="testimonials-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="testimonials-toggle"
              className="sr-only peer"
              checked={isTestimonialsSectionEnabled}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsTestimonialsSectionEnabled(isChecked);
                setActivePreviewJson((prev) => ({
                  ...prev,
                  testimonialsSection: isChecked ? (prev.testimonialsSection || []) : undefined,
                }));
              }}
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {isTestimonialsSectionEnabled && (
          <div className="space-y-3 pt-2">
            {(activePreviewJson.testimonialsSection as Array<any>)?.map((item, index) => (
              <div key={item.id || index} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <input
                  type="text"
                  value={item.clientName || ""}
                  onChange={(e) => {
                    const updated = [...(activePreviewJson.testimonialsSection || [])];
                    updated[index] = { ...updated[index], clientName: e.target.value };
                    setActivePreviewJson((prev) => ({ ...prev, testimonialsSection: updated }));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  placeholder="Client Name"
                />
                <button
                  onClick={() => {
                    const updated = (activePreviewJson.testimonialsSection || []).filter((_, i) => i !== index);
                    setActivePreviewJson((prev) => ({ ...prev, testimonialsSection: updated }));
                  }}
                  className="w-full bg-red-950/40 text-red-400 border border-red-900/40 py-1 rounded-lg text-[11px]"
                >
                  Remove Testimonial
                </button>
              </div>
            ))}
            <div className="bg-slate-950 p-3 rounded-xl border border-dashed border-slate-800 space-y-2">
              <input
                type="text"
                placeholder="Client Name"
                value={newTestimonial.clientName}
                onChange={(e) => setNewTestimonial((t) => ({ ...p, clientName: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <button
                onClick={() => {
                  if (!newTestimonial.clientName) return;
                  setActivePreviewJson((prev) => ({
                    ...prev,
                    testimonialsSection: [...(prev.testimonialsSection || []), { ...newTestimonial, id: `t-${Date.now()}` }],
                  }));
                  setNewTestimonial({ clientName: "", feedback: "", clientTitle: "" });
                }}
                className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold"
              >
                Add Testimonial Node
              </button>
            </div>
          </div>
        )}
      </div>
      {/* End: Testimonials Section Sub-Controller */}
    </div>
  );
};

export default BlueprintNavigator;