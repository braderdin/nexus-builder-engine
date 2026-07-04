"use client";

// Start: Core React and Next.js Architecture Imports
import { useState } from "react";
import { useRouter } from "next/navigation"; // FIXED: Standard Next.js App Router import
import Link from "next/link";
// End: Core React and Next.js Architecture Imports

interface DocumentationModule {
  id: string;
  title: string;
  badge: string;
  description: string;
  codeSnippet: string;
  videoPlaceholder: string;
}

export default function DashboardTutorialPage() {
  const router = useRouter();
  const [activeModuleId, setActiveModuleId] = useState<string>("getting-started");

  // Start: Hardened Production Learning Modules Data Matrix
  const learningModules: DocumentationModule[] = [
    {
      id: "getting-started",
      title: "🚀 Getting Started Node",
      badge: "Core Architecture",
      description: "Initialize your SaaS visual layout build sequence. Every deployed merchant Tap-Store begins by selecting an optimized production blueprint from the main workspace grid framework.",
      codeSnippet: `// Initializing target engine context schema\nconst activeTemplate = PREBUILT_TEMPLATES[0];\nsetActivePreviewJson(activeTemplate.layout_data);`,
      videoPlaceholder: "Flipped Frame Pipeline: Walkthrough Core Builder HUD"
    },
    {
      id: "whatsapp-ingestion",
      title: "💬 Configuring WhatsApp Lead Ingestion",
      badge: "Conversion Engine",
      description: "Route your customer orders directly into encrypted mobile message streams. Ensure your target numbers strictly follow the international E.164 sanitization standard format.",
      codeSnippet: `// Standardizing Malaysian country code routing prefix\nconst phoneRegex = /^\\+?[1-9]\\d{1,14}$/;\nconst E164_Formatted = "60123456789";`,
      videoPlaceholder: "Frictionless Checkout Mappings: Mapped Forms Tutorial"
    },
    {
      id: "flux-ai-engine",
      title: "✨ Flux-1 AI Asset Generation Engine",
      badge: "Artificial Intelligence",
      description: "Generate pixel-perfect marketing banners and high-fidelity product imagery directly on the edge network via Cloudflare Worker AI tokens without paying for premium graphic suites.",
      codeSnippet: `// Triggering neural text-to-image array stream\nconst response = await fetch("/api/ai/image", {\n  method: "POST",\n  body: JSON.stringify({ prompt: imagePrompt })\n});`,
      videoPlaceholder: "Neural Token Compiling: Generating Creative Assets Visual"
    },
    {
      id: "cname-domain",
      title: "🌐 CNAME Domain Mapping Architecture",
      badge: "Infrastructure Infrastructure",
      description: "Establish premium business identity. Map custom root properties by setting up pointing records targeting our proxy satelite endpoints to auto-provision instant secure SSL layer protections.",
      codeSnippet: `# Registrar DNS Configuration Target Values\nType: A      | Host: @   | Value: 76.76.21.21\nType: CNAME  | Host: www | Value: proxy.superpage.link`,
      videoPlaceholder: "Edge Routing Logic: Establishing Custom CNAME Ingestions"
    }
  ];
  // End: Hardened Production Learning Modules Data Matrix

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between">
      {/* Start: Vercel-inspired Minimalist Sticky Header Menu */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-sm text-white">Nexus Academy Docs</span>
        </div>
        <button 
          onClick={() => router.push("/dashboard")}
          className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-all shadow-md"
        >
          ← Return to Console
        </button>
      </nav>
      {/* End: Vercel-inspired Minimalist Sticky Header Menu */}

      {/* Start: Core Dual Panel Grid Component Frame */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 sm:py-12">
        
        {/* Left Side Panel: Sticky Sidebar Links List */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-4">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold mb-2">
              Navigation Index
            </h4>
            <nav className="flex flex-col gap-1">
              {learningModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModuleId(module.id)}
                  className={`w-full text-left text-xs font-medium px-3 py-2.5 rounded-xl transition-all ${
                    activeModuleId === module.id
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  {module.title.split(" ")[0]} {module.title.substring(module.title.indexOf(" ") + 1)}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Side Panel: Interactive Learning Module Hub Details */}
        <main className="lg:col-span-3 space-y-6">
          {learningModules.filter(m => m.id === activeModuleId).map((activeModule) => (
            <section key={activeModule.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeInUp">
              
              {/* Heading Meta Group */}
              <div className="space-y-2">
                <div className="inline-flex text-[9px] font-mono bg-blue-950/40 border border-blue-900 text-blue-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                  {activeModule.badge}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {activeModule.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {activeModule.description}
                </p>
              </div>

              {/* High-Fidelity Code Block Viewport */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Engine Integration Syntax Schema</h5>
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-blue-300 overflow-x-auto shadow-inner leading-relaxed">
                  <pre><code>{activeModule.codeSnippet}</code></pre>
                </div>
              </div>

              {/* Interactive Video Media Placeholder Card */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Instruction Broadcast Simulator</h5>
                <div className="bg-slate-950/80 border border-slate-800 border-dashed rounded-xl h-44 sm:h-52 flex flex-col justify-center items-center gap-3 p-4 text-center group hover:border-blue-500/40 transition-colors duration-300">
                  <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 group-hover:bg-blue-600/10 group-hover:border-blue-500 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-all duration-300 shadow-md">
                    ▶️
                  </div>
                  <span className="text-xs text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                    {activeModule.videoPlaceholder}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    Simulated Dynamic Node Broadcast
                  </span>
                </div>
              </div>

            </section>
          ))}
        </main>
      </div>
      {/* End: Core Dual Panel Grid Component Frame */}

      {/* Start: Monorepo Fixed Footer Layout */}
      <footer className="border-t border-slate-900 bg-slate-950/40 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          2026 Nexus Educational Monorepo Cluster Node.
        </p>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
          Status: <span className="text-emerald-500 font-bold">Documentation Grid Persistent</span>
        </div>
      </footer>
      {/* End: Monorepo Fixed Footer Layout */}
    </div>
  );
}