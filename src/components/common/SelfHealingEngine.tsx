"use client";

import React, { useState } from "react";

interface SelfHealingEngineProps {
  currentUserEmail: string;
  onRepairedJsonInject: (json: Record<string, any>) => void;
}

const SelfHealingEngine: React.FC<SelfHealingEngineProps> = ({ currentUserEmail, onRepairedJsonInject }) => {
  const [brokenJsonInput, setBrokenJsonInput] = useState<string>('{\n  "heroSection": {\n    "headline": "Missing closing quotation mark due to token cut\n  }\n}');
  const [errorLogInput, setErrorLogInput] = useState<string>("SyntaxError: Unexpected end of JSON input at line 4");
  const [repairedJsonResult, setRepairedJsonResult] = useState<any>(null);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [healingError, setHealingError] = useState<string | null>(null);

  const handleSelfHealingExecute = async () => {
    setIsHealing(true);
    setHealingError(null);
    setRepairedJsonResult(null);
    
    try {
      let payloadLayout = {};
      try {
        payloadLayout = JSON.parse(brokenJsonInput);
      } catch {
        payloadLayout = { rawMalformedDataString: brokenJsonInput };
      }

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUserEmail,
          invalidJsonLayout: payloadLayout,
          errorLog: errorLogInput,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Execution anomaly on healing core node.");
      
      setRepairedJsonResult(data.repairedLayout);
    } catch (err: any) {
      setHealingError(err.message || "Unknown schema resolution error.");
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-300">Gemini Self-Healing AI Engine Core</h4>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">Broken JSON Input</label>
            <textarea 
              value={brokenJsonInput}
              onChange={(e) => setBrokenJsonInput(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-red-400 focus:outline-none focus:border-red-700 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">Compilation Error Log</label>
            <textarea 
              value={errorLogInput}
              onChange={(e) => setErrorLogInput(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-700 transition-colors resize-none"
            />
          </div>
        </div>
        <button
          onClick={handleSelfHealingExecute}
          disabled={isHealing}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isHealing ? "Healing Core Active..." : "Execute Self-Healing Repair"}
        </button>
        {healingError && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-xl font-medium">
            {healingError}
          </div>
        )}
        {repairedJsonResult && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 block">✓ Repaired Clean Layout Payload</label>
            <pre className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-48 shadow-inner">
              {JSON.stringify(repairedJsonResult, null, 2)}
            </pre>
            <button
              onClick={() => onRepairedJsonInject(repairedJsonResult)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline transition-colors block mt-2"
            >
              Inject into Live Visual Blueprint Parser →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfHealingEngine;
