"use client";

// Start: Core React Framework Dependency Imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
// End: Core React Framework Dependency Imports

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
}

export default function TutorialPage() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexusTutorialCompletedSteps");
      if (saved) {
        try {
          setCompletedSteps(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse tutorial storage keys:", e);
        }
      }
    }
  }, []);

  const onToggleStepCompletion = (stepId: string) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      if (typeof window !== "undefined") {
        localStorage.setItem("nexusTutorialCompletedSteps", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const tutorialSteps: TutorialStep[] = [
    {
      id: "step1",
      title: "Step 1: One-Click Blueprint Selection",
      description: "Initiate your design by choosing a pre-built template from the 'Template Grid' on the Dashboard. This action loads it into the Live Visual Blueprint Parser.",
    },
    {
      id: "step2",
      title: "Step 2: WYSIWYG Layout Text Tweaking",
      description: "Customize your site's content interactively. Modify headlines and subheadlines in the 'Content Configurator' panel.",
    },
    {
      id: "step3",
      title: "Step 3: Component Injection via Library",
      description: "Enhance your site using the 'Component Library & Live Sandbox'. Inject custom HTML/CSS/JS snippets or pre-built UI components directly into your blueprint.",
    },
    {
      id: "step4",
      title: "Step 4: Subdomain Flight Verification",
      description: "Prepare for deployment by using the 'Subdomain Checker'. Enter and verify an available subdomain for your site.",
    },
    {
      id: "step5",
      title: "Step 5: Utilize the Layout Arranger",
      description: "Reorder and toggle visibility of different sections using the 'Layout Section Arranger'. Experiment with different arrangements.",
    },
    {
      id: "step6",
      title: "Step 6: Experiment with Visual Modifiers",
      description: "Enhance the visual appeal of your site. Toggle the 'Ambient Mesh Grid Lines' and 'Glowing Container Blur Overlay' within the 'Visual Modifiers' section.",
    },
    {
      id: "step7",
      title: "Step 7: Deploy Your Blueprint",
      description: "With your site configured and validated, click the 'Deploy Blueprint' button in the 'Template Grid'. Successful deployment completes your tutorial journey!",
    }
  ];

  const totalSteps = tutorialSteps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Engine</span>
        </div>
        <Link href="/dashboard" className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors">
          Back to Dashboard
        </Link>
      </nav>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Nexus Engine Official User Tutorial & Design Academy
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Embark on your journey to master the Nexus Engine. Follow these steps to build, customize, and deploy your powerful merchant storefronts.
          </p>
          
          <div className="w-full bg-slate-800 rounded-full h-6 mt-6 relative overflow-hidden flex items-center justify-center">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-700 ease-out absolute left-0 top-0"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <span className="relative z-10 text-xs font-bold text-white">
              {completedCount} / {totalSteps} Steps Completed ({progressPercentage.toFixed(0)}%)
            </span>
          </div>
        </header>

        <section className="space-y-6">
          {tutorialSteps.map((step) => (
            <div
              key={step.id}
              className={`bg-slate-900 border ${completedSteps[step.id] ? "border-emerald-700" : "border-slate-800"} rounded-2xl p-6 shadow-xl space-y-3 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold ${completedSteps[step.id] ? "text-emerald-300" : "text-white"}`}>
                  {step.title}
                </h3>
                <input
                  type="checkbox"
                  checked={completedSteps[step.id] || false}
                  onChange={() => onToggleStepCompletion(step.id)}
                  className="h-5 w-6 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <p className={`text-sm text-slate-400 ${completedSteps[step.id] ? "line-through text-slate-500" : ""}`}>
                {step.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}