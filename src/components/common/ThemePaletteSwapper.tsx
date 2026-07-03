"use client";

import React from "react";

// Start: Component Local Type Definitions
type ThemeAccentType = 'blue' | 'purple' | 'emerald' | 'vercel-midnight' | 'linear-purple' | 'supabase-emerald';

interface ThemePaletteSwapperProps {
  currentThemeAccent: ThemeAccentType;
  onThemeAccentChange: (accent: ThemeAccentType) => void;
}

interface ThemeOption {
  id: ThemeAccentType;
  name: string;
  className: string; // Tailwind class for visual representation
}
// End: Component Local Type Definitions

// Start: ThemePaletteSwapper Component
const ThemePaletteSwapper: React.FC<ThemePaletteSwapperProps> = ({
  currentThemeAccent,
  onThemeAccentChange,
}) => {
  // Define available theme options with representative Tailwind classes
  const themeOptions: ThemeOption[] = [
    { id: 'blue', name: 'Ocean Blue', className: 'bg-blue-600 ring-blue-500' },
    { id: 'purple', name: 'Royal Purple', className: 'bg-purple-600 ring-purple-500' },
    { id: 'emerald', name: 'Forest Emerald', className: 'bg-emerald-600 ring-emerald-500' },
    { id: 'vercel-midnight', name: 'Vercel Midnight', className: 'bg-slate-800 ring-slate-600' }, // Mapping to a subdued blue/gray look
    { id: 'linear-purple', name: 'Linear Purple', className: 'bg-indigo-600 ring-indigo-500' }, // A distinct purple from Royal
    { id: 'supabase-emerald', name: 'Supabase Emerald', className: 'bg-green-600 ring-green-500' }, // A distinct emerald from Forest
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Theme Palette Swapper</h3>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <p className="text-sm text-slate-400">
          Instantly transform the visual aesthetics of your live blueprint canvas by selecting a premium color palette.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeAccentChange(theme.id)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                ${currentThemeAccent === theme.id
                  ? 'border-blue-500 ring-2 ring-offset-2 ring-offset-slate-900'
                  : 'border-slate-700 hover:border-slate-600'
                } bg-slate-800 hover:bg-slate-700
              `}
            >
              <span className={`w-4 h-4 rounded-full ${theme.className}`}></span>
              <span className="text-xs font-semibold text-white">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePaletteSwapper;
// End: ThemePaletteSwapper Component
