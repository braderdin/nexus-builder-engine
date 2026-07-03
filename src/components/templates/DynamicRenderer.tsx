"use client";

// Start: Core React Framework Dependency Imports
import React from "react";
// End: Core React Framework Dependency Imports

// Start: Component Properties Architectural Definition
interface DynamicRendererProps {
  layoutData: {
    heroSection?: {
      headline: string;
      subheadline: string;
      ctaText: string;
    };
    whatsappFormSection?: {
      promptTitle: string;
      buttonText: string;
      targetNumber: string;
    };
    themeAccent?: 'blue' | 'purple' | 'emerald'; // New: Theme accent color
    featuresSection?: Array<{ title: string; description: string; }>; // New: Features section
  };
}
// End: Component Properties Architectural Definition

// Start: Theme Accent Class Mapping
const themeAccentClasses = {
  blue: {
    heroButton: "bg-blue-600 hover:bg-blue-500 shadow-blue-950",
    whatsappButton: "bg-blue-600 hover:bg-blue-500 shadow-blue-950",
    borderColor: "border-blue-800",
  },
  purple: {
    heroButton: "bg-purple-600 hover:bg-purple-500 shadow-purple-950",
    whatsappButton: "bg-purple-600 hover:bg-purple-500 shadow-purple-950",
    borderColor: "border-purple-800",
  },
  emerald: {
    heroButton: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950",
    whatsappButton: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950",
    borderColor: "border-emerald-800",
  },
};
// End: Theme Accent Class Mapping

// Start: Core Engine Visual Builder JSON Parser Component
export default function DynamicRenderer({ layoutData }: DynamicRendererProps) {
  // Safe fallback assignment if JSON schema elements are missing or empty
  const hero = layoutData?.heroSection;
  const whatsappForm = layoutData?.whatsappFormSection;
  const themeAccent = layoutData?.themeAccent || 'blue'; // Default theme accent
  const currentTheme = themeAccentClasses[themeAccent];

  // Start: Dynamic Target WhatsApp Direct Action Link Trigger
  const handleWhatsAppRedirection = () => {
    if (!whatsappForm?.targetNumber) return;
    const computedMessage = encodeURIComponent(`Hi, I am interested in your products advertised on the Nexus site node!`);
    window.open(`https://wa.me/${whatsappForm.targetNumber}?text=${computedMessage}`, "_blank");
  };
  // End: Dynamic Target WhatsApp Direct Action Link Trigger

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
      
      {/* Start: Structural Intermediary Preview Floating Badge */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">
          LIVE CLIENT PREVIEW CANVAS (MOBILE + DESKTOP ADAPTIVE)
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      {/* End: Structural Intermediary Preview Floating Badge */}

      {/* Start: Dynamic Parsed Hero Layout Section Component */}
      {hero && (
        <section className="px-6 py-12 sm:py-20 text-center bg-gradient-to-b from-slate-900/50 to-slate-950">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            {hero.headline || "Untitled Instant Headline Node"}
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            {hero.subheadline || "No dynamic subheadline data mapped inside the layout JSON stream."}
          </p>
          <div className="mt-8">
            <button className={`w-full sm:w-auto text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md ${currentTheme.heroButton}`}>
              {hero.ctaText || "Explore Node"}
            </button>
          </div>
        </section>
      )}
      {/* End: Dynamic Parsed Hero Layout Section Component */}

      {/* Start: Dynamic Parsed WhatsApp Lead Form Section Component */}
      {whatsappForm && (
        <section className="p-6 sm:p-10 border-t border-slate-900 bg-slate-900/10">
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {whatsappForm.promptTitle || "Submit Instant Order Request"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Frictionless direct checkout pipeline routed to: +{whatsappForm.targetNumber}
              </p>
            </div>
            <button
              onClick={handleWhatsAppRedirection}
              className={`w-full text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${currentTheme.whatsappButton}`}
            >
              <span className="text-sm">💬</span>
              {whatsappForm.buttonText || "Initialize WhatsApp Chat"}
            </button>
          </div>
        </section>
      )}
      {/* End: Dynamic Parsed WhatsApp Lead Form Section Component */}

      {/* Start: Dynamic Parsed Features Grid Section Component */}
      {layoutData.featuresSection && layoutData.featuresSection.length > 0 && (
        <section className="px-6 py-12 sm:py-20 bg-slate-900/10 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layoutData.featuresSection.map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-slate-900 border ${currentTheme.borderColor} rounded-2xl p-6 shadow-xl space-y-3 transition-colors hover:border-blue-500`}
                >
                  <h3 className="text-base font-bold text-white">
                    {feature.title || "Untitled Feature"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description || "No description provided for this feature."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* End: Dynamic Parsed Features Grid Section Component */}

    </div>
  );
}
// End: Core Engine Visual Builder JSON Parser Component
