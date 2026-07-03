"use client";

import React, { useState } from "react";

// Start: Component Local Type Definitions
interface ComponentLibraryProps {
  activePreviewJson: Record<string, any>;
  setActivePreviewJson: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

interface LibraryComponent {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode; // For the live rendering window
  snippet: string; // Raw HTML/CSS/JS snippet to display
  injectLogic: (currentJson: Record<string, any>) => Record<string, any>; // Function to merge/add data to activePreviewJson
}
// End: Component Local Type Definitions

// Start: ComponentLibrary Module
const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ activePreviewJson, setActivePreviewJson }) => {
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);

  /**
   * Handles injecting a selected component's data into the active preview JSON.
   * This allows the DynamicRenderer to reflect the added component.
   * @param injectLogic A function that takes the current JSON and returns the updated JSON.
   */
  const handleInject = (injectLogic: (currentJson: Record<string, any>) => Record<string, any>) => {
    setActivePreviewJson((prevJson) => injectLogic(prevJson));
    alert("Component injected! Please observe changes in your live preview canvas."); // User feedback for successful injection
  };

  // Define the collection of library components
  const libraryComponents: LibraryComponent[] = [
    {
      id: "cta-button-glowing",
      name: "Glowing Animated CTA Button",
      description: "A prominent call-to-action button with a subtle glowing animation, designed for high conversion.",
      preview: (
        <button className="relative px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold overflow-hidden group">
          <span className="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-300 ease-out group-hover:w-full"></span>
          <span className="relative z-10">Get Started Now</span>
          {/* Subtle pulse effect for visual emphasis */}
          <span className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-blue-400 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"></span>
        </button>
      ),
      snippet: `<button class="relative px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold overflow-hidden group">
  <span class="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-300 ease-out group-hover:w-full"></span>
  <span class="relative z-10">Get Started Now</span>
  <span class="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-blue-400 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"></span>
</button>`,
      injectLogic: (currentJson) => ({
        ...currentJson,
        // Add a new section for the glowing CTA button
        glowingCtaButtonSection: {
          text: "Get Started Now",
          link: "#",
          style: "glowing-animated-button", // Identifier for DynamicRenderer
        },
      }),
    },
    {
      id: "whatsapp-chat-widget",
      name: "Floating WhatsApp Chat Widget",
      description: "A persistent, floating WhatsApp icon for direct customer communication and instant support.",
      preview: (
        <div className="flex items-center justify-center p-4">
          <div className="bg-emerald-500 p-3 rounded-full shadow-lg cursor-pointer">
            {/* WhatsApp icon SVG */}
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.284 16.883c-.099.32-.57.514-.805.626-1.571.745-3.329.98-5.02.66-.401-.075-.807-.168-1.198-.321l-.226-.094-1.282.472.335-1.248-.066-.217c-.246-.777-.373-1.6-.373-2.43 0-4.085 3.107-7.414 7.217-7.414 3.993 0 7.243 3.25 7.243 7.244 0 4.091-3.11 7.42-7.219 7.42-.803 0-1.58-.124-2.316-.367zm-3.376-2.508l-.105-.06c-.34-.199-.738-.277-1.144-.293-1.077-.042-2.022.693-2.368 1.637-.215.597-.134 1.258.17 1.776l.053.088-.574 2.138 2.213-.518.069.043c.427.266.915.421 1.416.488 1.332.176 2.529-.272 3.472-1.173.856-.814 1.408-1.928 1.547-3.14.077-.665-.015-1.33-.243-1.933-.298-.79-1.03-1.393-1.897-1.488-1.039-.115-2.062.298-2.684.992l-.06.076z" /></svg>
          </div>
        </div>
      ),
      snippet: `<a href="https://wa.me/60123456789?text=Hello,%20I'm%20interested%20in%20your%20services!" target="_blank" class="fixed bottom-6 right-6 bg-emerald-500 p-3 rounded-full shadow-lg cursor-pointer z-50">
  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.284 16.883c-.099.32-.57.514-.805.626-1.571.745-3.329.98-5.02.66-.401-.075-.807-.168-1.198-.321l-.226-.094-1.282.472.335-1.248-.066-.217c-.246-.777-.373-1.6-.373-2.43 0-4.085 3.107-7.414 7.217-7.414 3.993 0 7.243 3.25 7.243 7.244 0 4.091-3.11 7.42-7.219 7.42-.803 0-1.58-.124-2.316-.367zm-3.376-2.508l-.105-.06c-.34-.199-.738-.277-1.144-.293-1.077-.042-2.022.693-2.368 1.637-.215.597-.134 1.258.17 1.776l.053.088-.574 2.138 2.213-.518.069.043c.427.266.915.421 1.416.488 1.332.176 2.529-.272 3.472-1.173.856-.814 1.408-1.928 1.547-3.14.077-.665-.015-1.33-.243-1.933-.298-.79-1.03-1.393-1.897-1.488-1.039-.115-2.062.298-2.684.992l-.06.076z" />
  </svg>
</a>`,
      injectLogic: (currentJson) => ({
        ...currentJson,
        // Integrate WhatsApp widget with dynamic phone number if available from form section
        whatsappFloatingWidget: {
          phoneNumber: currentJson?.whatsappFormSection?.targetNumber || "60123456789",
          message: "Hello, I'm interested in your services!",
          position: "bottom-right", // Fixed position
        },
      }),
    },
    {
      id: "premium-grid-showcase-card",
      name: "Premium Grid Showcase Card",
      description: "A stylish, responsive card ideal for showcasing products, services, or portfolio items in a grid layout.",
      preview: (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg text-center space-y-3 max-w-xs mx-auto">
          <img src="https://via.placeholder.com/150/0f172a/e2e8f0?text=Showcase+Item" alt="Showcase item" className="w-full h-32 object-cover rounded-md mb-2" />
          <h5 className="text-md font-semibold text-white">Showcase Item Title</h5>
          <p className="text-slate-400 text-sm">Brief description of the item or service, highlighting its key features.</p>
          <button className="text-blue-400 hover:text-blue-300 text-xs font-medium mt-2">Learn More →</button>
        </div>
      ),
      snippet: `<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg text-center space-y-3 max-w-xs mx-auto">
  <img src="https://via.placeholder.com/150/0f172a/e2e8f0?text=Showcase+Item" alt="Showcase item" class="w-full h-32 object-cover rounded-md mb-2" />
  <h5 class="text-md font-semibold text-white">Showcase Item Title</h5>
  <p class="text-slate-400 text-sm">Brief description of the item or service, highlighting its key features.</p>
  <button class="text-blue-400 hover:text-blue-300 text-xs font-medium mt-2">Learn More &rarr;</button>
</div>`,
      injectLogic: (currentJson) => {
        const newItem = {
          id: `showcase-${Date.now()}`,
          title: "New Showcase Item",
          description: "A newly added item from the component library, ready for customization.",
          imageUrl: "https://via.placeholder.com/150/0f172a/e2e8f0?text=Showcase+Item",
        };
        return {
          ...currentJson,
          // Append to existing portfolioSection or create a new one
          portfolioSection: [...((currentJson.portfolioSection as Array<any>) || []), newItem],
        };
      },
    },
  ];

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Component Library & Live Sandbox</h3>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
        {libraryComponents.map((component) => (
          <div key={component.id} className="space-y-4 border-b border-slate-800 last:border-b-0 pb-6">
            <h5 className="text-lg font-bold text-white">{component.name}</h5>
            <p className="text-slate-400 text-sm">{component.description}</p>

            {/* Live Responsive Rendering Window */}
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 flex justify-center items-center min-h-[120px]">
              {component.preview}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setExpandedSnippet(expandedSnippet === component.id ? null : component.id)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                {expandedSnippet === component.id ? "Hide Code Snippet" : "View Code Snippet"}
              </button>
              <button
                onClick={() => handleInject(component.injectLogic)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                Inject to Blueprint Canvas
              </button>
            </div>

            {/* Raw Snippet Sheet (Expandable) */}
            {expandedSnippet === component.id && (
              <div className="bg-slate-800 p-4 rounded-lg overflow-x-auto font-mono text-xs text-slate-300 mt-4">
                <pre><code>{component.snippet}</code></pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentLibrary;
// End: ComponentLibrary Module
