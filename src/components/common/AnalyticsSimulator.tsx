"use client";

// Start: Core React Framework Dependency Imports
import React, { useState, useEffect, useCallback } from "react";
// End: Core React Framework Dependency Imports

// Start: Component Properties Architectural Definition
interface AnalyticsSimulatorProps {
  layoutData: Record<string, any>;
}
// End: Component Properties Architectural Definition

// Start: Analytics Simulator Core Component
const AnalyticsSimulator: React.FC<AnalyticsSimulatorProps> = ({ layoutData }) => {
  const [latency, setLatency] = useState({
    singapore: 0,
    usEast: 0,
    euWest: 0,
  });
  const [coreWebVitals, setCoreWebVitals] = useState({
    performance: 0,
    lcp: 0,
    ttfb: 0,
    cls: 0,
  });

  // Start: Dynamic Metric Calculation Logic
  const calculateMetrics = useCallback(() => {
    // Estimate layout data size as a proxy for complexity/payload size
    const layoutDataSize = JSON.stringify(layoutData).length;

    // Latency Simulation (ms) - Base latency + fluctuation + slight penalty for larger layout
    const baseLatency = {
      singapore: 30, // Faster
      usEast: 120,
      euWest: 180, // Slower
    };

    setLatency({
      singapore: Math.max(0, baseLatency.singapore + Math.floor(Math.random() * 20 - 10) + Math.floor(layoutDataSize / 500)),
      usEast: Math.max(0, baseLatency.usEast + Math.floor(Math.random() * 30 - 15) + Math.floor(layoutDataSize / 300)),
      euWest: Math.max(0, baseLatency.euWest + Math.floor(Math.random() * 40 - 20) + Math.floor(layoutDataSize / 200)),
    });

    // Core Web Vitals Simulation
    // Performance: Higher is better (0-100). Penalty for larger layout.
    const performanceScore = Math.max(
      60,
      100 - Math.floor(layoutDataSize / 1000) - Math.floor(Math.random() * 5)
    );

    // LCP (Largest Contentful Paint): Lower is better (ms). Penalty for larger layout.
    const lcpScore = Math.min(
      5000,
      Math.max(
        800,
        1200 + Math.floor(layoutDataSize / 100) + Math.floor(Math.random() * 200)
      )
    );

    // TTFB (Time to First Byte): Lower is better (ms). Penalty for larger layout.
    const ttfbScore = Math.min(
      1000,
      Math.max(
        50,
        150 + Math.floor(layoutDataSize / 200) + Math.floor(Math.random() * 50)
      )
    );

    // CLS (Cumulative Layout Shift): Lower is better (0-1). Penalty for larger layout.
    const clsScore = Math.min(
      0.5,
      Math.max(
        0,
        0.02 + layoutDataSize / 20000 + Math.random() * 0.05
      )
    );

    setCoreWebVitals({
      performance: performanceScore,
      lcp: lcpScore,
      ttfb: ttfbScore,
      cls: parseFloat(clsScore.toFixed(2)), // Keep 2 decimal places
    });
  }, [layoutData]);
  // End: Dynamic Metric Calculation Logic

  // Start: Metric Update Lifecycle
  useEffect(() => {
    calculateMetrics(); // Initial calculation on component mount or layoutData change

    const interval = setInterval(calculateMetrics, 3000); // Update metrics every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [calculateMetrics]);
  // End: Metric Update Lifecycle

  // Start: Dynamic Score Color Utility
  const getScoreColor = (score: number, metricType: 'performance' | 'lcp' | 'ttfb' | 'cls') => {
    if (metricType === 'performance') {
      if (score >= 90) return 'text-emerald-400';
      if (score >= 70) return 'text-yellow-400';
      return 'text-red-400';
    } else if (metricType === 'lcp') { // lower is better
      if (score <= 1500) return 'text-emerald-400';
      if (score <= 2500) return 'text-yellow-400';
      return 'text-red-400';
    } else if (metricType === 'ttfb') { // lower is better
      if (score <= 300) return 'text-emerald-400';
      if (score <= 600) return 'text-yellow-400';
      return 'text-red-400';
    } else if (metricType === 'cls') { // lower is better
      if (score <= 0.1) return 'text-emerald-400';
      if (score <= 0.25) return 'text-yellow-400';
      return 'text-red-400';
    }
    return 'text-slate-400';
  };
  // End: Dynamic Score Color Utility

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-slate-300">Analytics Simulator</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Start: Edge Network Latency Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Edge Network Latency</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">🇸🇬 Singapore Node</span>
              <span className="text-blue-400 font-mono">{latency.singapore} ms</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">🇺🇸 US-East Node</span>
              <span className="text-blue-400 font-mono">{latency.usEast} ms</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">🇪🇺 EU-West Node</span>
              <span className="text-blue-400 font-mono">{latency.euWest} ms</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
            Simulated round-trip time from global edge nodes. Reflects network conditions and payload size.
          </p>
        </div>
        {/* End: Edge Network Latency Panel */}

        {/* Start: Core Web Vitals Optimization Index Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Web Vitals</h5>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">Performance</span>
              <span className={`text-xl font-bold ${getScoreColor(coreWebVitals.performance, 'performance')}`}>{coreWebVitals.performance}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">LCP</span>
              <span className={`text-xl font-bold ${getScoreColor(coreWebVitals.lcp, 'lcp')}`}>{coreWebVitals.lcp} ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">TTFB</span>
              <span className={`text-xl font-bold ${getScoreColor(coreWebVitals.ttfb, 'ttfb')}`}>{coreWebVitals.ttfb} ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">CLS</span>
              <span className={`text-xl font-bold ${getScoreColor(coreWebVitals.cls, 'cls')}`}>{coreWebVitals.cls}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
            Real-time simulation of critical user experience metrics, adapting to content changes.
          </p>
        </div>
        {/* End: Core Web Vitals Optimization Index Panel */}
      </div>
    </div>
  );
};

export default AnalyticsSimulator;
// End: Analytics Simulator Core Component
