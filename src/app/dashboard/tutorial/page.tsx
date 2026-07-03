"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // For navigation back to dashboard

// Start: Component Local Type Definitions
interface TutorialStep {
  id: string;
  title: string;
  description: string;
}
// End: Component Local Type Definitions

// Start: Nexus Engine Official User Tutorial & Design Academy Page
export default function TutorialPage() {
  // State to track completion of each tutorial step
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    // Initialize state from localStorage to persist completion status
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexusTutorialCompletedSteps");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Persist completed steps to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nexusTutorialCompletedSteps", JSON.stringify(completedSteps));
    }
  }, [completedSteps]);

  // Define tutorial steps with unique IDs
  const tutorialSteps: TutorialStep[] = [
    {
      id: "step1",
      title: "Step 1: One-Click Blueprint Selection",
      description: "Start your design journey by choosing a pre-built template from the Template Grid. Each blueprint provides a solid foundation for your site. Click on a template thumbnail to load it into the Live Visual Blueprint Parser.",
    },
    {
      id: "step2",
      title: "Step 2: WYSIWYG Layout Text Tweaking",
      description: "Customize your site's content directly. Use the 'Content Configurator' panel to modify headlines, subheadlines, and other textual elements in real-time. Observe your changes instantly in the Live Visual Blueprint Parser.",
    },
    {
      id: "step3",
      title: "Step 3: HTML/CSS/JS Component Injection via Sandbox",
      description: "Enhance your site with premium pre-built components. Explore the 'Component Library & Live Sandbox' to preview, view code snippets, and inject interactive elements like CTA buttons or chat widgets directly into your blueprint.",
    },
    {
      id: "step4",
      title: "Step 4: Subdomain Flight Verification Checks",
      description: "Prepare for deployment. Utilize the 'Subdomain Checker' to find and verify an available subdomain for your site. This is a crucial pre-flight check before going live.",
    },
  ];

  // Calculate overall progress for the header bar
  const totalSteps = tutorialSteps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  /**
   * Toggles the completion status of a specific tutorial step.
   * @param stepId The unique identifier of the step to toggle.
   */
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Start: Top Navigation Shell - Simplified for Tutorial */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Engine</span>
        </div>
        <Link href="/dashboard" className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors">
          Back to Dashboard
        </Link>
      </nav>
      {/* End: Top Navigation Shell */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Nexus Engine Official User Tutorial & Design Academy
          </h1>
          <p className="text-slate-400 text-md max-w-2xl mx-auto">
            Embark on your journey to master the Nexus Engine. Follow these steps to build, customize, and deploy your powerful merchant storefronts.
          </p>

          {/* Start: Glowing Success Milestone Progress Tracking Header Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 mt-6 relative overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-700 ease-out shadow-lg
                ${progressPercentage > 0 ? "opacity-100" : "opacity-0"}
              `}
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Optional: Glowing effect */}
              <div className="absolute inset-0 rounded-full animate-pulse-light opacity-50" style={{ boxShadow: `0 0 8px #10b981, 0 0 12px #2563eb` }}></div>
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
              {completedCount} / {totalSteps} Steps Completed ({progressPercentage.toFixed(0)}%)
            </span>
          </div>
          {/* End: Glowing Success Milestone Progress Tracking Header Bar */}
        </header>

        {/* Start: Interactive Step-by-Step Walkthrough Guide Matrix */}
        <section className="space-y-6">
          {tutorialSteps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-slate-900 border ${completedSteps[step.id] ? "border-emerald-700" : "border-slate-800"} rounded-2xl p-6 shadow-xl space-y-3 transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${completedSteps[step.id] ? "text-emerald-300" : "text-white"}`}>
                  {step.title}
                </h3>
                <input
                  type="checkbox"
                  checked={completedSteps[step.id] || false}
                  onChange={() => toggleStepCompletion(step.id)}
                  className="form-checkbox h-6 w-6 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <p className={`text-slate-400 ${completedSteps[step.id] ? "line-through text-slate-500" : ""}`}>
                {step.description}
              </p>
            </div>
          ))}
        </section>
        {/* End: Interactive Step-by-Step Walkthrough Guide Matrix */}
      </main>
    </div>
  );
}
// End: Nexus Engine Official User Tutorial & Design Academy Page
