// Start: Core Framework and Routing Navigation Imports
import Link from "next/link";
// End: Core Framework and Routing Navigation Imports

// Start: Corporate Enterprise Public Landing Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* Start: Tech Stack Background Grid Ray Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      {/* End: Tech Stack Background Grid Ray Effect */}

      {/* Start: Public Header Navigation Menu */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white text-sm sm:text-base">Nexus Engine</span>
        </div>
        <Link 
          href="/auth" 
          className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold px-4 py-2 rounded-xl transition-all shadow-md"
        >
          Console Node
        </Link>
      </header>
      {/* End: Public Header Navigation Menu */}

      {/* Start: Main Hero Centerpiece Content Matrix */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 text-center py-20 sm:py-32 my-auto relative z-10 space-y-6 sm:space-y-8">
        
        {/* Marketing Badge Hook */}
        <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/60 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-blue-400 uppercase mx-auto animate-pulse">
          ⚡ Multi-Provider AI Infrastructure Mesh Active
        </div>

        {/* Master Corporate Catchphrase Headline */}
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
          Deploys High-Converting Stores <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">At Edge Speed.</span>
        </h1>

        {/* Informative Value Proposition Paragraph */}
        <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          An enterprise-grade SaaS visual website builder engine powered by ultra-low latency AI cores. Generate marketing assets, audit JSON layouts, and launch nodes instantly under zero-cost tier configurations.
        </p>

        {/* Core Direct Interactive Call To Action Form Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-950/40 uppercase tracking-wider text-center"
          >
            Launch Builder Engine
          </Link>
          <a
            href="https://github.com/braderdin/nexus-builder-engine"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs px-8 py-4 rounded-xl transition-colors text-center"
          >
            Review Architecture Documentation
          </a>
        </div>

        {/* Core Platform Engine Features Display Grid (Mobile & Desktop Adaptive) */}
        <div className="pt-16 sm:pt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-900">
          <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-2">
            <div className="text-sm">🎨</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Flux-1 Asset Suite</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Direct edge text-to-image generator saving product photo storage costs.</p>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-2">
            <div className="text-sm">🛡️</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Zod Hardened Core</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Persistent RLS guards and input sanitization preventing persistent XSS vectors.</p>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-2">
            <div className="text-sm">💬</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">WhatsApp Form Pipeline</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Frictionless transactional checkout sheets mapped directly to client mobile lines.</p>
          </div>
        </div>

      </main>
      {/* End: Main Hero Centerpiece Content Matrix */}

      {/* Start: Public Dashboard Footer Disclaimer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 sm:px-6 py-6 relative z-10">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            © 2026 Nexus Engine Monorepo Cluster Node. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <span className="text-emerald-500 font-bold">● Free-Tier Ledger Online</span>
          </div>
        </div>
      </footer>
      {/* End: Public Dashboard Footer Disclaimer */}

    </div>
  );
}
// End: Corporate Enterprise Public Landing Page Component