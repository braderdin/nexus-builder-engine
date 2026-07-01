"use client";

// Start: React UI State Lifecycle Imports
import { useState } from "react";
// End: React UI State Lifecycle Imports

// Start: Client Structural Interface Definitions
interface AiConsoleProps {
  currentUserEmail: string;
}

interface ChatMessageLog {
  sender: "user" | "nexus-ai";
  text: string;
}
// End: Client Structural Interface Definitions

// Start: Main Artificial Intelligence Prompt Interface View
export default function AiConsole({ currentUserEmail }: AiConsoleProps) {
  // Start: Component Realtime Interaction States
  const [userQuery, setUserQuery] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessageLog[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // End: Component Realtime Interaction States

  // Start: Transmission Form Pipeline Handler
  const executePromptTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isProcessing) return;

    setErrorMessage(null);
    setIsProcessing(true);
    const capturedQuery = userQuery;
    setUserQuery("");

    // Update state directly for optimal visual UX response
    setChatLog((prev) => [...prev, { sender: "user", text: capturedQuery }]);

    try {
      // Start: Dynamic Fetch Request Execution to Rate Limited Endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUserEmail, userPrompt: capturedQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unresolved system fault has occurred.");
      }

      setChatLog((prev) => [...prev, { sender: "nexus-ai", text: data.responseText }]);
      // End: Dynamic Fetch Request Execution to Rate Limited Endpoint
    } catch (networkOrRateLimitError: any) {
      setErrorMessage(networkOrRateLimitError.message || "Network processing anomaly encountered.");
    } finally {
      setIsProcessing(false);
    }
  };
  // End: Transmission Form Pipeline Handler

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px] shadow-2xl">
      {/* Start: Console Identity Header Layout */}
      <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">Nexus AI Prompt Console</h4>
      </div>
      {/* End: Console Identity Header Layout */}

      {/* Start: Reactive Message Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
        {chatLog.length === 0 && (
          <div className="text-center text-xs text-slate-500 mt-20 font-mono">
            ENGINE IDLE. ENTER PROMPT ARCHITECTURE REQUIREMENTS BELOW.
          </div>
        )}
        {chatLog.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] text-xs px-4 py-3 rounded-xl leading-relaxed ${
              message.sender === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none font-mono"
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 text-[10px] text-slate-500 font-mono px-4 py-2 rounded-xl animate-pulse">
              STREAMING TOKENS FROM CENTRAL NODE...
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-[11px] rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
      </div>
      {/* End: Reactive Message Stream Container */}

      {/* Start: Interaction Submission Form Box */}
      <form onSubmit={executePromptTransmission} className="flex gap-2">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask AI for design layout advice or bug checking ideas..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isProcessing}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 rounded-xl transition-colors disabled:opacity-50 shadow-md shadow-blue-950"
          disabled={isProcessing}
        >
          Execute
        </button>
      </form>
      {/* End: Interaction Submission Form Box */}
    </div>
  );
}
// End: Main Artificial Intelligence Prompt Interface View