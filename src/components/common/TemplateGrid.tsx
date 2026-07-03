"use client";

import React from "react";

// Start: Component Local Type Definitions
interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
  layout_data: Record<string, any>;
}

interface TemplateGridProps {
  templates: WebTemplate[];
  selectedTemplateFilter: string;
  setSelectedTemplateFilter: (val: string) => void;
  setActivePreviewJson: (layout: Record<string, any>) => void;
  setSelectedThemeAccent: (accent: "blue" | "purple" | "emerald") => void;
  setIsFeaturesSectionEnabled: (val: boolean) => void;
  handleDeployBlueprintAction: (template: WebTemplate) => void;
  isDeploying: boolean;
  isSubdomainValidAndAvailable: boolean;
}
// End: Component Local Type Definitions

// Start: Prebuilt Template Core Grid Selection Component
const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  selectedTemplateFilter,
  setSelectedTemplateFilter,
  setActivePreviewJson,
  setSelectedThemeAccent,
  setIsFeaturesSectionEnabled,
  handleDeployBlueprintAction,
  isDeploying,
  isSubdomainValidAndAvailable,
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Select Production Blueprint</h3>
          <p className="text-xs text-slate-400">Deploy lightning-fast templates packed with pre-wired WhatsApp web hooks.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {["All", "E-Commerce", "Service Business", "Dynamic SaaS"].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setSelectedTemplateFilter(tabName)}
              className={`text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedTemplateFilter === tabName ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              if (template.layout_data) {
                setActivePreviewJson(template.layout_data);
                setSelectedThemeAccent(template.layout_data.themeAccent || "blue");
                setIsFeaturesSectionEnabled(!!template.layout_data.featuresSection && template.layout_data.featuresSection.length > 0);
              }
            }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-blue-500 cursor-pointer transition-all group relative overflow-hidden shadow-xl"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-950 text-blue-400 px-2.5 py-1 rounded-md border border-slate-800">
                  {template.category}
                </span>
                {template.isPremium && (
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-950/60 text-amber-400 px-2.5 py-1 rounded-md border border-amber-800">
                    Premium
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {template.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {template.description}
              </p>
            </div>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeployBlueprintAction(template);
                }}
                className="w-full font-semibold text-xs py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white transition-all"
                disabled={isDeploying || !isSubdomainValidAndAvailable}
              >
                {isDeploying ? "Deploying Node..." : "Deploy Blueprint"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplateGrid;