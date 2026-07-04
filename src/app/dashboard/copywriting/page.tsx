"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ToneOfVoice = "Professional" | "Bold" | "Casual" | "Empathetic" | "Humorous";

interface CopywritingOutput {
  headline: string;
  subheadline: string;
}

export default function AICopywritingPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [businessName, setBusinessName] = useState<string>("");
  const [productKeywords, setProductKeywords] = useState<string>("");
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoice>("Professional");

  const [generatedHeadline, setGeneratedHeadline] = useState<string>("");
  const [generatedSubheadline, setGeneratedSubheadline] = useState<string>("");
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
    if (!businessName || !productKeywords) {
      alert("Please fill in Business Name and Product Description Keywords.");
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setGeneratedHeadline("");
    setGeneratedSubheadline("");

    const userEmail = userProfile?.email || "";
    const userPrompt = `Generate a marketing headline and subheadline for a business named "${businessName}" selling "${productKeywords}". The tone of voice should be ${toneOfVoice}.`;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, userPrompt, targetAiModule: "copywriting" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || "An error occurred while fetching the response.");
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Assuming the AI returns a structured response with headline and subheadline
      const parsedResponse: { headline: string; subheadline: string } = JSON.parse(aiResponse);

      simulateTypewriterEffect(parsedResponse.headline, setGeneratedHeadline, 40);
      await new Promise((resolve) => setTimeout(resolve, parsedResponse.headline.length * 40 + 500));
      simulateTypewriterEffect(parsedResponse.subheadline, setGeneratedSubheadline, 25);
      await new Promise((resolve) => setTimeout(resolve, parsedResponse.subheadline.length * 25 + 500));

    } catch (error: any) {
      setApiError("An unexpected error occurred: " + error.message);
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

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING AI COPYWRITING SUITE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">NexusDeploy</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
            Secure Node: {userProfile?.email}
          </span>
          <button
            onClick={() => {
              supabase.auth.signOut();
              router.push("/auth");
            }}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Disconnect
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Generated Copywriting Suite
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Harness the power of AI to instantly generate compelling headlines and subheadlines for your storefront.
          </p>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">Input Parameters</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="business-name" className="block text-xs font-semibold text-slate-400 mb-2">
                Business Name
              </label>
              <input
                type="text"
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., NexusDeploy, SuperPage, MyTech"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="product-keywords" className="block text-xs font-semibold text-slate-400 mb-2">
                Product/Service Description Keywords (comma-separated)
              </label>
              <textarea
                id="product-keywords"
                value={productKeywords}
                onChange={(e) => setProductKeywords(e.target.value)}
                placeholder="e.g., AI integration, website builder, SEO optimization, instant store"
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
              ></textarea>
            </div>
            <div>
              <label htmlFor="tone-of-voice" className="block text-xs font-semibold text-slate-400 mb-2">
                Tone of Voice
              </label>
              <select
                id="tone-of-voice"
                value={toneOfVoice}
                onChange={(e) => setToneOfVoice(e.target.value as ToneOfVoice)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none pr-8 transition-colors"
              >
                <option value="Professional" className="bg-slate-900 text-white">Professional</option>
                <option value="Bold" className="bg-slate-900 text-white">Bold</option>
                <option value="Casual" className="bg-slate-900 text-white">Casual</option>
                <option value="Empathetic" className="bg-slate-900 text-white">Empathetic</option>
                <option value="Humorous" className="bg-slate-900 text-white">Humorous</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerateMarketingAssets}
            disabled={isGenerating || !businessName || !productKeywords}
            className={`w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
              ${isGenerating ? "bg-slate-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"}
            `}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-r-transparent rounded-full"></span>
                Generating...
              </>
            ) : (
              "Generate Marketing Assets"
            )}
          </button>
          {apiError && <p className="text-red-500 text-xs mt-2">{apiError}</p>}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">AI-Generated Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Generated Headline
              </label>
              <p className="min-h-[30px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white break-words">
                {generatedHeadline || "Your headline will appear here after generation."}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Generated Subheadline
              </label>
              <p className="min-h-[70px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white break-words">
                {generatedSubheadline || "Your subheadline will appear here after generation."}
              </p>
            </div>
          </div>
          <button
            onClick={handleApplyToStorefront}
            disabled={!generatedHeadline || !generatedSubheadline}
            className={`w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
              ${!generatedHeadline || !generatedSubheadline ? "bg-slate-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"}
            `}
          >
            Apply to Storefront Canvas
          </button>
        </section>

        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. AI generation is for premium-tier subscribers.</p>
        </div>
      </main>
    </div>
  );
}
