"use client";

// Start: Core React and Framework Lifecycle Imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
// End: Core React and Framework Lifecycle Imports

type ToneOfVoice = "Professional" | "Bold" | "Casual" | "Empathetic" | "Humorous";

export default function AICopywritingPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [businessName, setBusinessName] = useState<string>(" ");
  const [productKeywords, setProductKeywords] = useState<string>(" ");
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoice>("Professional");

  const [generatedHeadline, setGeneratedHeadline] = useState<string>(" ");
  const [generatedSubheadline, setGeneratedSubheadline] = useState<string>(" ");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const simulateTypewriterEffect = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, delay: number = 20) => {
    let i = 0;
    setter("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setter((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, delay);
  };

  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
      }
      setIsDataLoading(false);
    };
    verifyUserSession();
  }, [router]);

  const handleGenerateMarketingAssets = async () => {
    if (!businessName.trim() || !productKeywords.trim()) {
      alert("Please fill in Business Name and Product Description Keywords.");
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setGeneratedHeadline("");
    setGeneratedSubheadline("");

    const userEmail = userProfile?.email || "";
    // Structuring explicit constraint instructions to enforce clean format output mapping
    const userPrompt = `Generate a marketing headline and subheadline for a business named "${businessName}" selling "${productKeywords}". The tone of voice should be ${toneOfVoice}. Return the output strictly as a raw serialized JSON object containing only keys "headline" and "subheadline". Do not wrap it inside markdown blocks or backticks.`;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userPrompt, targetAiModule: "default-groq" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upstream AI platform routing gateway disconnection.");
      }

      const data = await response.json();
      const aiResponse = data.responseText || "";

      let headlineText = `Welcome to ${businessName}`;
      let subheadlineText = `Premium solutions for ${productKeywords}.`;

      // Start: Safe Hobby Grade Serialization Sanitizer Protection Shield
      try {
        const cleanJsonString = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedPayload = JSON.parse(cleanJsonString);
        if (parsedPayload.headline) headlineText = parsedPayload.headline;
        if (parsedPayload.subheadline) subheadlineText = parsedPayload.subheadline;
      } catch {
        // Fallback protection: If the AI output fails JSON encoding, split text context by lines
        const textLines = aiResponse.split("\n").filter((line: string) => line.trim().length > 0);
        if (textLines.length > 0) headlineText = textLines[0].replace(/headline:/i, "").trim();
        if (textLines.length > 1) subheadlineText = textLines.slice(1).join(" ").replace(/subheadline:/i, "").trim();
      }
      // End: Safe Hobby Grade Serialization Sanitizer Protection Shield

      simulateTypewriterEffect(headlineText, setGeneratedHeadline, 30);
      await new Promise((resolve) => setTimeout(resolve, headlineText.length * 30 + 400));
      simulateTypewriterEffect(subheadlineText, setGeneratedSubheadline, 15);

    } catch (error: any) {
      setApiError(error.message || "An unexpected system processing anomaly was encountered.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStorefront = () => {
    if (generatedHeadline && generatedSubheadline) {
      alert(`Applied to storefront canvas:\nHeadline: "${generatedHeadline}"\nSubheadline: "${generatedSubheadline}"`);
    } else {
      alert("Please generate marketing assets first.");
    }
  };

  if (isDataLoading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs">LOADING AI COPYWRITING SUITE...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">NexusDeploy</span>
        </div>
        <Link href="/dashboard" className="text-xs bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-900 transition-all">Back to Dashboard</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">AI-Generated Copywriting Suite</h2>
          <p className="mt-2 text-xs text-slate-400">Powered dynamically via premium gemma openrouter framework linkages.</p>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Input Parameters</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="business-name" className="block text-[11px] font-semibold text-slate-400 mb-1">Business Name</label>
              <input id="business-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" placeholder="e.g., Gourmet Node Burgers" />
            </div>
            <div>
              <label htmlFor="keywords" className="block text-[11px] font-semibold text-slate-400 mb-1">Product Description Keywords</label>
              <textarea id="keywords" value={productKeywords} onChange={(e) => setProductKeywords(e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed" placeholder="e.g., premium grilled beef, signature spicy sauce, toasted buns" />
            </div>
            <div>
              <label htmlFor="tone" className="block text-[11px] font-semibold text-slate-400 mb-1">Tone of Voice</label>
              <select id="tone" value={toneOfVoice} onChange={(e) => setToneOfVoice(e.target.value as ToneOfVoice)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none">
                <option value="Professional">Professional</option>
                <option value="Bold">Bold</option>
                <option value="Casual">Casual</option>
                <option value="Empathetic">Empathetic</option>
                <option value="Humorous">Humorous</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerateMarketingAssets} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all disabled:opacity-50">
            {isGenerating ? "Compiling Neural Content Tokens..." : "Generate Marketing Assets"}
          </button>
          {apiError && <p className="text-red-400 font-mono text-[10px] mt-2">{apiError}</p>}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI-Generated Content Output</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Generated Headline</label>
              <p className="min-h-[40px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white leading-relaxed">{generatedHeadline || "Awaiting target submission signal..."}</p>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Generated Subheadline</label>
              <p className="min-h-[70px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white leading-relaxed">{generatedSubheadline || "Awaiting target submission signal..."}</p>
            </div>
          </div>
          <button onClick={handleApplyToStorefront} disabled={!generatedHeadline} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all disabled:opacity-50">
            Apply to Storefront Canvas
          </button>
        </section>
      </main>
    </div>
  );
}