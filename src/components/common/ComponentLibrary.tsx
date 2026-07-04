"use client";

import React, { useState } from "react";
import { sanitizeUserTextInput } from "@/lib/validations/fileUpload";

// Start: Component Local Type Definitions
interface ComponentLibraryProps {
  activePreviewJson: Record<string, any>;
  setActivePreviewJson: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

interface LibraryComponent {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  snippet: string;
  injectLogic: (currentJson: Record<string, any>) => Record<string, any>;
}

interface LibraryLayout {
  id: string;
  name: string;
  description: string;
  configOptionsRender?: (config: { numColumns: number; setNumColumns: React.Dispatch<React.SetStateAction<number>> }) => React.ReactNode;
  preview: React.ReactNode;
  injectLogic: (currentJson: Record<string, any>, config: Record<string, any>) => Record<string, any>;
}
// End: Component Local Type Definitions

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ activePreviewJson, setActivePreviewJson }) => {
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);
  const [customHtmlInput, setCustomHtmlInput] = useState<string>("");
  const [numColumnsForLayout, setNumColumnsForLayout] = useState<number>(2);

  const handleInject = (injectLogic: (currentJson: Record<string, any>) => Record<string, any>) => {
    setActivePreviewJson((prevJson) => injectLogic(prevJson));
    alert("Component injected! Please observe changes in your live preview canvas.");
  };

  const handleCustomHtmlInject = () => {
    const sanitizedHtml = sanitizeUserTextInput(customHtmlInput);
    setActivePreviewJson((prevJson) => ({
      ...prevJson,
      customHtmlSection: {
        id: `custom-html-${Date.now()}`,
        content: sanitizedHtml,
      },
    }));
    alert("Custom HTML/CSS/JS injected! Check the live preview.");
    setCustomHtmlInput("");
  };

  const libraryComponents: LibraryComponent[] = [
    {
      id: "cta-button-glowing",
      name: "Glowing Animated CTA Button",
      description: "A prominent call-to-action button with a subtle glowing animation, designed for high conversion.",
      preview: (
        <button className="relative px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold overflow-hidden group">
          <span className="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-300 ease-out group-hover:w-full"></span>
          <span className="relative z-10">Get Started Now</span>
          <span className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-blue-400 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"></span>
        </button>
      ),
      snippet: `<button class="relative px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold overflow-hidden group">...</button>`,
      injectLogic: (currentJson) => ({
        ...currentJson,
        glowingCtaButtonSection: { text: "Get Started Now", link: "#", style: "glowing-animated-button" },
      }),
    }
  ];

  const layoutLibrary: LibraryLayout[] = [
    {
      id: "layout-multi-column-text",
      name: "Multi-Column Text Block",
      description: "A flexible layout for presenting content in multiple columns, ideal for comparisons or dual narratives.",
      configOptionsRender: ({ numColumns, setNumColumns }) => (
        <div className="flex items-center gap-2">
          <label htmlFor="layout-num-cols" className="text-xs text-slate-400">Columns:</label>
          <select
            id="layout-num-cols"
            className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white"
            value={numColumns}
            onChange={(e) => setNumColumns(parseInt(e.target.value, 10))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      ),
      preview: (
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="bg-slate-700/50 p-3 rounded-md min-h-[60px]">Text Column 1</div>
          <div className="bg-slate-700/50 p-3 rounded-md min-h-[60px]">Text Column 2</div>
        </div>
      ),
      injectLogic: (currentJson, config) => {
        const actualNumColumns = config?.numColumns || 2;
        const columns = Array.from({ length: actualNumColumns }).map((_, i) => ({
          title: `Column ${i + 1} Headline`,
          content: `This is the content for column ${i + 1}. You can edit it from the canvas panel.`
        }));
        return {
          ...currentJson,
          customLayoutSections: [...((currentJson.customLayoutSections as Array<any>) || []), {
            id: `layout-mc-${Date.now()}`,
            type: "multiColumnText",
            columns: columns,
            columnCount: actualNumColumns,
          }],
        };
      },
    }
  ];

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Component Library & Live Sandbox</h3>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
        {libraryComponents.map((component) => (
          <div key={component.id} className="space-y-4 border-b border-slate-800 last:border-b-0 pb-6">
            <h5 className="text-lg font-bold text-white">{component.name}</h5>
            <p className="text-slate-400 text-sm">{component.description}</p>
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 flex justify-center items-center min-h-[120px]">
              {component.preview}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setExpandedSnippet(expandedSnippet === component.id ? null : component.id)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs transition-colors">
                {expandedSnippet === component.id ? "Hide Code Snippet" : "View Code Snippet"}
              </button>
              <button onClick={() => handleInject(component.injectLogic)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors">
                Inject to Blueprint Canvas
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-800 mt-6">
        <h5 className="text-lg font-bold text-white">Custom HTML/CSS/JS Sandbox Deck</h5>
        <textarea className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y" placeholder="Paste your custom layout structures..." value={customHtmlInput} onChange={(e) => setCustomHtmlInput(e.target.value)}></textarea>
        <button onClick={handleCustomHtmlInject} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors">Inject Custom Layout to Canvas</button>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-800 mt-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Interactive Visual Layout Palette Canvas Engine</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
          {layoutLibrary.map((layout) => (
            <div key={layout.id} className="space-y-4 border-b border-slate-800 last:border-b-0 pb-6">
              <h5 className="text-lg font-bold text-white">{layout.name}</h5>
              <p className="text-slate-400 text-sm">{layout.description}</p>
              {/* FIXED: Removed missing reference to setMarketplaceItems to prevent browser crash execution */}
              {layout.configOptionsRender && layout.configOptionsRender({ numColumns: numColumnsForLayout, setNumColumns: numColumnsForLayout })}
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 flex justify-center items-center min-h-[100px]">
                {layout.preview}
              </div>
              <button
                onClick={() => {
                  setActivePreviewJson((prev) => layout.injectLogic(prev, { numColumns: numColumnsForLayout }));
                  alert("Structural layout architecture successfully injected to your live blueprint context!");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                Inject Layout to Canvas
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComponentLibrary;