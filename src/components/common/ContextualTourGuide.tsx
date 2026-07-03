"use client";

import React from "react";

// Start: Component Local Type Definitions
interface TourStep {
  id: string;
  title: string;
  instruction: string;
}

interface ContextualTourGuideProps {
  tourStep: number;
  onAdvanceStep: () => void;
  onSkipTour: () => void;
}
// End: Component Local Type Definitions

// Start: ContextualTourGuide Component
const ContextualTourGuide: React.FC<ContextualTourGuideProps> = ({ tourStep, onAdvanceStep, onSkipTour }) => {
  const steps: TourStep[] = [
    {
      id: "step-template",
      title: "Step 1: Choose Your Blueprint",
      instruction: "Select a pre-built template from the 'Template Grid' below. Each blueprint sets the foundation for your site. Click a template to see it live!",
    },
    {
      id: "step-configure-text",
      title: "Step 2: Configure Your Content",
      instruction: "Use the 'Content Configurator' on the left to tweak headlines, subheadlines, and other textual elements. Watch your changes appear in the live preview.",
    },
    {
      id: "step-inject-layouts",
      title: "Step 3: Inject Custom HTML & Layouts",
      instruction: "Visit the 'Component Library & Live Sandbox' to add advanced features or entire custom sections like multi-column layouts to your blueprint.",
    },
    {
      id: "step-deploy",
      title: "Step 4: Verify & Deploy",
      instruction: "Once satisfied, use the 'Subdomain Checker' to find an available address, then hit 'Deploy Blueprint' in the Template Grid to launch your site!",
    },
  ];

  if (tourStep >= steps.length) {
    return null; // Tour completed or skipped
  }

  const currentStepData = steps[tourStep];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-5 space-y-4 animate-fadeInUp">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight">{currentStepData.title}</h4>
        <button onClick={onSkipTour} className="text-xs text-slate-500 hover:text-white transition-colors">
          Skip Tour
        </button>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{currentStepData.instruction}</p>
      <div className="flex gap-3">
        <button
          onClick={onAdvanceStep}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors"
        >
          {tourStep === steps.length - 1 ? "Finish Tour" : "Next Step"}
        </button>
      </div>
      <div className="text-[10px] text-slate-500 text-center">
        Step {tourStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default ContextualTourGuide;
// End: ContextualTourGuide Component
