"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// StatCard component for consistent styling
interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, colorClass = "text-white" }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
    <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
    <p className={`text-2xl sm:text-3xl font-extrabold ${colorClass}`}>
      {value}
      {unit && <span className="text-base font-medium text-slate-500 ml-1">{unit}</span>}
    </p>
  </div>
);

export default function AnalyticsPage() {
  const [visits, setVisits] = useState<number>(0);
  const [latency, setLatency] = useState<number>(0);
  const [keyStates, setKeyStates] = useState<boolean[]>(Array(24).fill(false));
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleLogRef = useRef<HTMLDivElement>(null);

  // Effect for Real-Time Traffic HUD
  useEffect(() => {
    const trafficInterval = setInterval(() => {
      setVisits((prev) => prev + Math.floor(Math.random() * 5) + 1); // Simulate new visits
      setLatency(parseFloat((Math.random() * 100 + 50).toFixed(2))); // Simulate latency between 50-150ms
    }, 2000); // Update every 2 seconds

    return () => clearInterval(trafficInterval);
  }, []);

  // Effect for Live Key Rotator Telemetry Grid
  useEffect(() => {
    const keyInterval = setInterval(() => {
      setKeyStates((prevStates) => {
        const newStates = [...prevStates];
        // Randomly toggle a few keys
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          const randomIndex = Math.floor(Math.random() * newStates.length);
          newStates[randomIndex] = !newStates[randomIndex];
        }
        return newStates;
      });
    }, 500); // Update every 0.5 seconds

    return () => clearInterval(keyInterval);
  }, []);

  // Effect for Mock Streaming Console Log Viewport
  useEffect(() => {
    const logMessages = [
      "INFO: Request processed successfully. (200 OK)",
      "DEBUG: Cache hit for asset: /static/image.png",
      "WARN: High latency detected on API endpoint /api/data. (120ms)",
      "INFO: User session refreshed for user@example.com",
      "DEBUG: Database query executed in 15ms.",
      "ERROR: Failed to connect to external service. Retrying...",
      "INFO: New deployment initiated by admin.",
      "DEBUG: WebSocket connection established.",
      "WARN: Disk usage approaching 80%.",
      "INFO: Analytics event logged: 'page_view'",
    ];

    const logInterval = setInterval(() => {
      const newMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      setConsoleLogs((prevLogs) => {
        const newLogs = [...prevLogs, `[${new Date().toLocaleTimeString()}] ${newMessage}`];
        return newLogs.slice(-20); // Keep only the last 20 logs
      });
    }, 1000); // Add a new log every second

    return () => clearInterval(logInterval);
  }, []);

  // Scroll to bottom of console logs
  useEffect(() => {
    if (consoleLogRef.current) {
      consoleLogRef.current.scrollTop = consoleLogRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Analytics</span>
        </div>
        <Link href="/dashboard" className="text-xs bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors">Back to Dashboard</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        {/* Real-Time Traffic HUD */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Real-Time Traffic HUD</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Visits" value={visits.toLocaleString()} colorClass="text-emerald-400" />
            <StatCard title="Average Latency" value={latency.toFixed(2)} unit="ms" colorClass="text-yellow-400" />
          </div>
        </section>

        {/* Live Key Rotator Telemetry Grid */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Key Rotator Telemetry Grid</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-4">
              {keyStates.map((isActive, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-1000 ease-in-out
                    ${isActive
                      ? "bg-emerald-600 shadow-emerald-500/50 animate-pulse-slow"
                      : "bg-slate-700 border border-slate-600 text-slate-500"
                    }`}
                  style={{ boxShadow: isActive ? '0 0 8px rgba(16, 185, 129, 0.7)' : 'none' }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Streaming Console Log Viewport */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Streaming Console Log</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-96 overflow-y-auto font-mono text-xs text-slate-300 relative">
            <div ref={consoleLogRef} className="absolute inset-0 p-6">
              {consoleLogs.map((log, index) => (
                <p key={index} className="mb-1 last:mb-0 whitespace-pre-wrap">
                  {log.startsWith('[') ? (
                    <>
                      <span className="text-slate-500">{log.substring(0, log.indexOf(']') + 1)}</span>
                      {log.includes('ERROR:') && <span className="text-red-400">{log.substring(log.indexOf(']') + 1)}</span>}
                      {log.includes('WARN:') && <span className="text-yellow-400">{log.substring(log.indexOf(']') + 1)}</span>}
                      {log.includes('INFO:') && <span className="text-blue-400">{log.substring(log.indexOf(']') + 1)}</span>}
                      {log.includes('DEBUG:') && <span className="text-purple-400">{log.substring(log.indexOf(']') + 1)}</span>}
                      {!log.includes('ERROR:') && !log.includes('WARN:') && !log.includes('INFO:') && !log.includes('DEBUG:') && <span>{log.substring(log.indexOf(']') + 1)}</span>}
                    </>
                  ) : log}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
