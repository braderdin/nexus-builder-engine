"use client";

import { useState, useEffect, useMemo } from "react";

// Strict production TypeScript types for layout controls
type GlassmorphicBlurLevel = 0 | 5 | 10 | 15 | 20 | 25; // Blur in pixels
type PaddingInterval = 'p-0' | 'p-4' | 'p-8' | 'p-12' | 'p-16' | 'p-20'; // Tailwind padding classes
type NeonShadowColor = 'shadow-blue-500/50' | 'shadow-purple-500/50' | 'shadow-emerald-500/50' | 'shadow-rose-500/50'; // Tailwind shadow color classes
type NeonShadowSpread = 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl' | 'shadow-inner' | 'shadow-none'; // Tailwind shadow spread classes

interface LayoutControls {
  glassmorphicBlur: GlassmorphicBlurLevel;
  paddingInterval: PaddingInterval;
  neonShadowColor: NeonShadowColor;
  neonShadowSpread: NeonShadowSpread;
  neonShadowEnabled: boolean;
}

// New interface for saved studio layouts
interface SavedStudioLayout {
  id: string;
  name: string;
  controls: LayoutControls;
  activeBlueprintId: string;
  timestamp: string; // ISO string for sorting and display
}

// Blueprint definition for predefined sections
interface SectionBlueprint {
  id: string;
  name: string;
  description: string;
  // `getHtml` generates the raw HTML string for the code sheet
  getHtml: (computedInlineStyles: string, currentPaddingClass: PaddingInterval, currentShadowClasses: string) => string;
  // `Component` is the React component for live preview
  Component: React.FC<{ computedCssProperties: React.CSSProperties, currentPaddingClass: PaddingInterval, currentShadowClasses: string }>;
}

// Micro-onboarding guide step definition
interface OnboardingStep {
  title: string;
  description: string;
  targetId?: string; // Optional ID for highlighting specific elements during the tour
}

// --- Prebuilt Blueprints Data ---
const PREBUILT_BLUEPRINTS: SectionBlueprint[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    description: "A striking hero section with a compelling headline and call-to-action.",
    getHtml: (computedInlineStyles, currentPaddingClass, currentShadowClasses) => `
<div style="${computedInlineStyles}" class="relative bg-gradient-to-br from-slate-900 to-slate-800 ${currentPaddingClass} rounded-2xl text-center overflow-hidden ${currentShadowClasses} border border-slate-700">
  <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/20 via-slate-800/20 to-purple-900/20"></div>
  <div class="relative z-10 space-y-4">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white leading-tight">Craft Your Vision</h1>
    <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">Design, build, and deploy stunning web sections with unparalleled control and flexibility.</p>
    <button class="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
      Start Building Now
    </button>
  </div>
</div>`,
    Component: ({ computedCssProperties, currentPaddingClass, currentShadowClasses }) => (
      <div style={computedCssProperties} className={`relative bg-gradient-to-br from-slate-900 to-slate-800 ${currentPaddingClass} rounded-2xl text-center overflow-hidden ${currentShadowClasses} border border-slate-700`}>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/20 via-slate-800/20 to-purple-900/20"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">Craft Your Vision</h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">Design, build, and deploy stunning web sections with unparalleled control and flexibility.</p>
          <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
            Start Building Now
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "features-grid-section",
    name: "Features Grid",
    description: "A dynamic grid to highlight key features or services of your product.",
    getHtml: (computedInlineStyles, currentPaddingClass, currentShadowClasses) => `
<div style="${computedInlineStyles}" class="relative bg-gradient-to-br from-slate-900 to-slate-800 ${currentPaddingClass} rounded-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden ${currentShadowClasses} border border-slate-700">
  <div class="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/20 via-slate-800/20 to-green-900/20"></div>
  <div class="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
    <h3 class="text-xl font-bold text-white">Feature One</h3>
    <p class="text-slate-400 text-sm">Description for your first compelling feature or service offering.</p>
  </div>
  <div class="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
    <h3 class="text-xl font-bold text-white">Feature Two</h3>
    <p class="text-slate-400 text-sm">Dive deeper into the benefits of your second outstanding feature.</p>
  </div>
  <div class="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
    <h3 class="text-xl font-bold text-white">Feature Three</h3>
    <p class="text-slate-400 text-sm">Showcase the power of your third value proposition to users.</p>
  </div>
</div>`,
    Component: ({ computedCssProperties, currentPaddingClass, currentShadowClasses }) => (
      <div style={computedCssProperties} className={`relative bg-gradient-to-br from-slate-900 to-slate-800 ${currentPaddingClass} rounded-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden ${currentShadowClasses} border border-slate-700`}>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/20 via-slate-800/20 to-green-900/20"></div>
        <div className="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
          <h3 className="text-xl font-bold text-white">Feature One</h3>
          <p className="text-slate-400 text-sm">Description for your first compelling feature or service offering.</p>
        </div>
        <div className="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
          <h3 className="text-xl font-bold text-white">Feature Two</h3>
          <p className="text-slate-400 text-sm">Dive deeper into the benefits of your second outstanding feature.</p>
        </div>
        <div className="relative z-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
          <h3 className="text-xl font-bold text-white">Feature Three</h3>
          <p className="text-slate-400 text-sm">Showcase the power of your third value proposition to users.</p>
        </div>
      </div>
    ),
  },
];

// --- Onboarding Steps Data ---
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Nexus Visual Canvas!",
    description: "This advanced studio empowers you to design and customize dynamic web sections with precise control.",
  },
  {
    title: "1. Select a Core Blueprint",
    description: "Choose a pre-defined section blueprint from the selector below to begin your customization journey.",
    targetId: "blueprint-selector",
  },
  {
    title: "2. Adjust Layout Parameters",
    description: "Manipulate advanced parameters like glassmorphic blur, padding, and glowing neon shadow borders using the controls in the left sidebar.",
    targetId: "layout-controls",
  },
  {
    title: "3. See Your Changes Live",
    description: "The 'Live Preview Viewport' on the right instantly reflects your design choices, allowing for real-time iteration.",
    targetId: "live-preview",
  },
  {
    title: "4. Export Your Code",
    description: "Expand the 'Raw Code Sheet' to inspect and copy the generated HTML and inline CSS, ready for integration into your project.",
    targetId: "code-sheet-toggle",
  },
  {
    title: "5. Local Snapshot Preservation",
    description: "Utilize the 'Save Studio Layout' button to store your current design configuration locally in your browser. Access and manage all your saved layouts in the 'Saved Masterpiece Ledger Hub'.",
    targetId: "save-layout-button", // Targeting the new save button
  },
  {
    title: "Congratulations, You're Ready!",
    description: "You've completed the design academy wizard. Start crafting your unique web experiences. Happy designing!",
  },
];

// Basic Toast Component for notifications
const Toast = ({ message, show }: { message: string | null; show: boolean }) => {
  if (!show || !message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 text-white rounded-lg shadow-xl transition-opacity duration-300 ease-out opacity-100">
      {message}
    </div>
  );
};


// Main component for the Studios page
export default function StudiosPage() {
  const [controls, setControls] = useState<LayoutControls>({
    glassmorphicBlur: 10,
    paddingInterval: 'p-12',
    neonShadowColor: 'shadow-blue-500/50',
    neonShadowSpread: 'shadow-xl',
    neonShadowEnabled: true,
  });
  const [activeBlueprint, setActiveBlueprint] = useState<SectionBlueprint>(PREBUILT_BLUEPRINTS[0]);
  const [showCodeSheet, setShowCodeSheet] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  // State for layout persistence
  const [savedLayouts, setSavedLayouts] = useState<SavedStudioLayout[]>([]);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [layoutName, setLayoutName] = useState<string>('');

  // State for toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Client-side hook for localStorage synchronization (load on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is available for client-side operations
      const storedLayouts = localStorage.getItem('savedStudioLayouts');
      if (storedLayouts) {
        try {
          setSavedLayouts(JSON.parse(storedLayouts));
        } catch (error) {
          console.error("Failed to parse saved layouts from localStorage:", error);
          // Optionally clear invalid data if parsing fails
          localStorage.removeItem('savedStudioLayouts');
        }
      }
    }
  }, []); // Empty dependency array means this runs once on component mount

  // Client-side hook for localStorage synchronization (save on change)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedStudioLayouts', JSON.stringify(savedLayouts));
    }
  }, [savedLayouts]); // Runs whenever savedLayouts state changes

  // Effect for displaying toast notifications
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage(null);
      }, 3000); // Toast disappears after 3 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or if showToast changes
  }, [showToast]);

  // Computed CSS properties for the live preview
  const computedCssProperties: React.CSSProperties = useMemo(() => {
    const styles: React.CSSProperties = {
      position: 'relative', // Ensure relative for blur overlay
    };

    if (controls.glassmorphicBlur > 0) {
      styles.backdropFilter = `blur(${controls.glassmorphicBlur}px)`;
    } else {
      styles.backdropFilter = 'none';
    }

    return styles;
  }, [controls.glassmorphicBlur]);

  // Generate inline style string for the raw code sheet
  const computedInlineStyles: string = useMemo(() => {
    return Object.entries(computedCssProperties)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase(); // Convert camelCase to kebab-case
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  }, [computedCssProperties]);

  // Combine Tailwind shadow classes dynamically
  const currentShadowClasses = useMemo(() => {
    return controls.neonShadowEnabled ? `${controls.neonShadowSpread} ${controls.neonShadowColor}` : 'shadow-none';
  }, [controls.neonShadowEnabled, controls.neonShadowSpread, controls.neonShadowColor]);

  // Handler for saving the current layout configuration
  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      setToastMessage('Layout name cannot be empty!');
      setShowToast(true);
      return;
    }

    const newLayout: SavedStudioLayout = {
      id: window.crypto.randomUUID(), // Generate a unique ID for the layout
      name: layoutName.trim(),
      controls: controls,
      activeBlueprintId: activeBlueprint.id,
      timestamp: new Date().toISOString(), // Record current timestamp
    };

    setSavedLayouts((prev) => [...prev, newLayout]); // Add new layout to state
    setLayoutName(''); // Clear the input field
    setShowSaveModal(false); // Close the save modal
    setToastMessage('Layout Matrix Captured Successfully!');
    setShowToast(true);

    if (onboardingStep === 5) { // If user is on 'Local Snapshot Preservation' step
      handleAdvanceTour();
    }
  };

  // Handler for loading a saved layout configuration
  const handleLoadLayout = (layout: SavedStudioLayout) => {
    setControls(layout.controls); // Apply saved controls
    const blueprintToLoad = PREBUILT_BLUEPRINTS.find(b => b.id === layout.activeBlueprintId);
    if (blueprintToLoad) {
      setActiveBlueprint(blueprintToLoad); // Set the active blueprint
    } else {
      console.warn("Blueprint not found for loaded layout:", layout.activeBlueprintId);
      // Fallback to default blueprint if the saved one is not found
      setActiveBlueprint(PREBUILT_BLUEPRINTS[0]);
    }
    setToastMessage(`Layout "${layout.name}" loaded successfully.`);
    setShowToast(true);
  };

  // Handler for deleting a saved layout configuration
  const handleDeleteLayout = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) { // Confirmation dialog
      setSavedLayouts((prev) => prev.filter(layout => layout.id !== id)); // Remove layout from state
      setToastMessage(`Layout "${name}" deleted.`);
      setShowToast(true);
    }
  };

  // Handler for updating layout controls
  const handleControlChange = <K extends keyof LayoutControls>(key: K, value: LayoutControls[K]) => {
    setControls((prev) => ({ ...prev, [key]: value }));
    // Advance tour step if relevant control is changed
    if (onboardingStep === 2) { // If user is on 'Adjust Layout Parameters' step
      handleAdvanceTour();
    }
  };

  // Handler for selecting a blueprint
  const handleBlueprintSelect = (blueprint: SectionBlueprint) => {
    setActiveBlueprint(blueprint);
    if (onboardingStep === 1) { // If user is on 'Select a Core Blueprint' step
      handleAdvanceTour();
    }
  };

  // Handler for advancing the tour guide
  const handleAdvanceTour = () => {
    setOnboardingStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  };

  // Handler for skipping the tour
  const handleSkipTour = () => {
    setOnboardingStep(ONBOARDING_STEPS.length - 1); // Go to the last step (or beyond) to effectively hide it
  };

  const currentOnboardingInfo = ONBOARDING_STEPS[onboardingStep];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Nexus Visual Canvas Customizer Studio - Main Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar: Control Deck & Onboarding Wizard */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-6">Nexus Studio Control Deck</h2>

          {/* Blueprint Selector */}
          <div className="mb-8" id="blueprint-selector">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">Blueprint Selector</h3>
            <div className="space-y-3">
              {PREBUILT_BLUEPRINTS.map((blueprint) => (
                <button
                  key={blueprint.id}
                  onClick={() => handleBlueprintSelect(blueprint)}
                  className={`block w-full text-left p-3 rounded-lg text-sm transition-colors duration-200
                    ${activeBlueprint.id === blueprint.id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  <span className="font-semibold">{blueprint.name}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{blueprint.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Parameters Control Panel */}
          <div className="flex-grow mb-8" id="layout-controls">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">Layout Parameters</h3>

            {/* Glassmorphic Background Blur */}
            <div className="mb-5">
              <label htmlFor="blur-level" className="block text-sm font-medium text-slate-300 mb-2">
                Glassmorphic Blur Opacity ({controls.glassmorphicBlur}px)
              </label>
              <input
                type="range"
                id="blur-level"
                min="0"
                max="25"
                step="5"
                value={controls.glassmorphicBlur}
                onChange={(e) => handleControlChange("glassmorphicBlur", parseInt(e.target.value) as GlassmorphicBlurLevel)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Custom Padding Spacing Intervals */}
            <div className="mb-5">
              <label htmlFor="padding-interval" className="block text-sm font-medium text-slate-300 mb-2">
                Custom Padding Spacing
              </label>
              <select
                id="padding-interval"
                value={controls.paddingInterval}
                onChange={(e) => handleControlChange("paddingInterval", e.target.value as PaddingInterval)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="p-0">None</option>
                <option value="p-4">Small (16px)</option>
                <option value="p-8">Medium (32px)</option>
                <option value="p-12">Large (48px)</option>
                <option value="p-16">X-Large (64px)</option>
                <option value="p-20">XX-Large (80px)</option>
              </select>
            </div>

            {/* Glowing Neon Shadow Borders */}
            <div className="mb-5">
              <label htmlFor="neon-shadow-toggle" className="flex items-center cursor-pointer mb-2">
                <input
                  type="checkbox"
                  id="neon-shadow-toggle"
                  checked={controls.neonShadowEnabled}
                  onChange={(e) => handleControlChange("neonShadowEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-300">Enable Neon Shadow</span>
              </label>

              {controls.neonShadowEnabled && (
                <div className="space-y-4 mt-3">
                  <div>
                    <label htmlFor="shadow-color" className="block text-sm font-medium text-slate-300 mb-2">
                      Shadow Color
                    </label>
                    <select
                      id="shadow-color"
                      value={controls.neonShadowColor}
                      onChange={(e) => handleControlChange("neonShadowColor", e.target.value as NeonShadowColor)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="shadow-blue-500/50">Blue</option>
                      <option value="shadow-purple-500/50">Purple</option>
                      <option value="shadow-emerald-500/50">Emerald</option>
                      <option value="shadow-rose-500/50">Rose</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="shadow-spread" className="block text-sm font-medium text-slate-300 mb-2">
                      Shadow Spread
                    </label>
                    <select
                      id="shadow-spread"
                      value={controls.neonShadowSpread}
                      onChange={(e) => handleControlChange("neonShadowSpread", e.target.value as NeonShadowSpread)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="shadow-none">None</option>
                      <option value="shadow-md">Small</option>
                      <option value="shadow-lg">Medium</option>
                      <option value="shadow-xl">Large</option>
                      <option value="shadow-2xl">X-Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Studio Layout Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center space-x-2"
              id="save-layout-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span>Save Studio Layout</span>
            </button>

            {/* Save Layout Modal */}
            {showSaveModal && (
              <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-40 p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md shadow-2xl">
                  <h4 className="text-lg font-bold text-white mb-4">Name Your Masterpiece</h4>
                  <input
                    type="text"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    placeholder="e.g., 'My Hero Section v1'"
                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:ring-blue-500 focus:border-blue-500 mb-4"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveLayout}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Layout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Masterpiece Ledger Hub */}
          <div className="mb-8" id="saved-layouts-ledger">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">Saved Masterpiece Ledger Hub</h3>
            {savedLayouts.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No layouts saved yet. Start designing and save your first masterpiece!</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Added max-h and overflow for scrollable list */}
                {savedLayouts.map((layout) => (
                  <div key={layout.id} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg">
                    <div className="flex-grow mr-2">
                      <button
                        onClick={() => handleLoadLayout(layout)}
                        className="block text-left text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                      >
                        {layout.name}
                      </button>
                      <p className="text-xs text-slate-500">
                        {new Date(layout.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteLayout(layout.id, layout.name)}
                      className="text-slate-500 hover:text-rose-500 transition-colors p-1 rounded-full"
                      title="Delete Layout"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contextual Micro-Onboarding Layout Design Academy Wizard */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky bottom-0">
            <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-3">Design Academy Wizard</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">{currentOnboardingInfo.title}</h4>
              <p className="text-sm text-slate-400">{currentOnboardingInfo.description}</p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSkipTour}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Skip Tour
              </button>
              {onboardingStep < ONBOARDING_STEPS.length - 1 && (
                <button
                  onClick={handleAdvanceTour}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Step ({onboardingStep + 1}/{ONBOARDING_STEPS.length - 1})
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Content: Live Preview & Raw Code Sheet */}
        <main className="flex-grow flex flex-col p-6 bg-slate-950 overflow-y-auto">
          {/* Live Responsive Preview Layout Display Viewport */}
          <section className="flex-grow bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-60"></div>
            <div className="relative z-10 w-full max-w-4xl h-auto min-h-[300px] flex items-center justify-center p-4" id="live-preview">
              {/* This is where the selected blueprint component will be rendered */}
              <activeBlueprint.Component
                computedCssProperties={computedCssProperties}
                currentPaddingClass={controls.paddingInterval}
                currentShadowClasses={currentShadowClasses}
              />
            </div>
          </section>

          {/* Expandable Raw Code Sheet */}
          <div className="mt-6" id="code-sheet-toggle">
            <button
              onClick={() => setShowCodeSheet(!showCodeSheet)}
              className="w-full flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg text-white font-medium hover:bg-slate-700 transition-colors"
            >
              <span>Raw Code Sheet (HTML & CSS)</span>
              <span>{showCodeSheet ? "▲ Collapse" : "▼ Expand"}</span>
            </button>
            {showCodeSheet && (
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 mt-2 text-sm text-slate-300 overflow-x-auto">
                <code>
{activeBlueprint.getHtml(computedInlineStyles, controls.paddingInterval, currentShadowClasses)}
                </code>
              </pre>
            )}
          </div>
        </main>
      </div>
      {/* Toast Notification for user feedback */}
      <Toast message={toastMessage} show={showToast} />
    </div>
  );
}
