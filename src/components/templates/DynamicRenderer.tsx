"use client";

// Start: Core React Framework Dependency Imports
import React, { useState } from "react";
// End: Core React Framework Dependency Imports

// Start: Component Local Type Definitions
export interface ProductItem {
  id: string;
  name: string;
  price: number;
}

export interface CustomerOrder {
  id: string;
  clientName: string;
  product: ProductItem;
  timestamp: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// Start: Component Properties Architectural Definition
interface DynamicRendererProps {
  layoutData: {
    heroSection?: {
      headline: string;
      subheadline: string;
      ctaText: string;
    };
    whatsappFormSection?: {
      promptTitle: string;
      buttonText: string;
      targetNumber: string;
    };
    themeAccent?: 'blue' | 'purple' | 'emerald';
    featuresSection?: Array<{ title: string; description: string; }>;
    portfolioSection?: Array<{ id: string; title: string; description: string; imageUrl: string; }>;
    testimonialsSection?: Array<{ id: string; clientName: string; feedback: string; clientTitle: string; }>;
    products?: ProductItem[]; // New: Products for order simulator
    customHtmlSection?: { id: string; content: string; }; // New: Custom HTML/CSS/JS injected from sandbox
    customLayoutSections?: Array<{ // New: Custom layout structures injected from palette
      id: string;
      type: string; // e.g., "multiColumnText", "featureCardGrid"
      columnCount?: number; // For multiColumnText
      columns?: Array<{ title: string; content: string }>; // For multiColumnText
      items?: Array<{ id: string; title: string; description: string; icon?: string }>; // For featureCardGrid
      [key: string]: any; // Allows for flexible future properties
    }>;
  };
  onNewOrder: (order: CustomerOrder) => void; // Callback to push new orders to parent state
}
// End: Component Properties Architectural Definition

// Start: Theme Accent Class Mapping
const themeAccentClasses = {
  blue: {
    heroButton: "bg-blue-600 hover:bg-blue-500 shadow-blue-950",
    whatsappButton: "bg-blue-600 hover:bg-blue-500 shadow-blue-950",
    borderColor: "border-blue-800",
  },
  purple: {
    heroButton: "bg-purple-600 hover:bg-purple-500 shadow-purple-950",
    whatsappButton: "bg-purple-600 hover:bg-purple-500 shadow-purple-950",
    borderColor: "border-purple-800",
  },
  emerald: {
    heroButton: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950",
    whatsappButton: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950",
    borderColor: "border-emerald-800",
  },
};
// End: Theme Accent Class Mapping

// Start: Core Engine Visual Builder JSON Parser Component
export default function DynamicRenderer({ layoutData, onNewOrder }: DynamicRendererProps) {
  const [activeTab, setActiveTab] = useState("Home");

  // Safe fallback assignment if JSON schema elements are missing or empty
  const hero = layoutData?.heroSection;
  const whatsappForm = layoutData?.whatsappFormSection;
  const themeAccent = layoutData?.themeAccent || 'blue';
  const currentTheme = themeAccentClasses[themeAccent];
  const portfolio = layoutData?.portfolioSection;
  const testimonials = layoutData?.testimonialsSection;
  const products = layoutData?.products || []; // Products for the order simulator
  const customHtml = layoutData?.customHtmlSection; // Custom HTML/CSS/JS content
  const customLayouts = layoutData?.customLayoutSections; // Custom structural layouts

  // Start: Order Simulator State
  const [simulatorClientName, setSimulatorClientName] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(products[0] || null);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  // End: Order Simulator State

  // Start: Dynamic Target WhatsApp Direct Action Link Trigger
  const handleWhatsAppRedirection = () => {
    if (!whatsappForm?.targetNumber) return;
    const computedMessage = encodeURIComponent(`Hi, I am interested in your products advertised on the Nexus site node!`);
    window.open(`https://wa.me/${whatsappForm.targetNumber}?text=${computedMessage}`, "_blank");
  };
  // End: Dynamic Target WhatsApp Direct Action Link Trigger

  // Start: Handle Order Submission (Simulator)
  const handleSimulatorOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorClientName || !selectedProduct) {
      setOrderMessage("Please enter client name and select a product.");
      return;
    }

    const newOrder: CustomerOrder = {
      id: `order-${Date.now()}`,
      clientName: simulatorClientName,
      product: selectedProduct,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    onNewOrder(newOrder); // Send order to parent
    setOrderMessage(`Order for ${simulatorClientName} (${selectedProduct.name}) submitted!`);
    setSimulatorClientName(''); // Clear form
    // setSelectedProduct(products[0] || null); // Reset product selection

    setTimeout(() => setOrderMessage(null), 3000); // Clear message
  };
  // End: Handle Order Submission (Simulator)


  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">

      {/* Start: Structural Intermediary Preview Floating Badge */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">
          LIVE CLIENT PREVIEW CANVAS (MOBILE + DESKTOP ADAPTIVE)
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      {/* End: Structural Intermediary Preview Floating Badge */}

      {/* Start: Premium Vercel/Linear-inspired Multi-Page Navigation Tab Bar */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-start space-x-4">
            {["Home", "Showcase Gallery", "Client Wall"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-500"
                    : "text-slate-400 hover:text-white hover:border-b-2 hover:border-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>
      {/* End: Premium Vercel/Linear-inspired Multi-Page Navigation Tab Bar */}

      {/* Start: Home Tab Content */}
      {activeTab === "Home" && (
        <>
          {/* Start: Dynamic Parsed Hero Layout Section Component */}
          {hero && (
            <section className="px-6 py-12 sm:py-20 text-center bg-gradient-to-b from-slate-900/50 to-slate-950">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                {hero.headline || "Untitled Instant Headline Node"}
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                {hero.subheadline || "No dynamic subheadline data mapped inside the layout JSON stream."}
              </p>
              <div className="mt-8">
                <button className={`w-full sm:w-auto text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md ${currentTheme.heroButton}`}>
                  {hero.ctaText || "Explore Node"}
                </button>
              </div>
            </section>
          )}
          {/* End: Dynamic Parsed Hero Layout Section Component */}

          {/* Start: Dynamic Parsed WhatsApp Lead Form Section Component */}
          {whatsappForm && (
            <section className="p-6 sm:p-10 border-t border-slate-900 bg-slate-900/10">
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {whatsappForm.promptTitle || "Submit Instant Order Request"}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Frictionless direct checkout pipeline routed to: +{whatsappForm.targetNumber}
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppRedirection}
                  className={`w-full text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${currentTheme.whatsappButton}`}
                >
                  <span className="text-sm">💬</span>
                  {whatsappForm.buttonText || "Initialize WhatsApp Chat"}
                </button>
              </div>
            </section>
          )}
          {/* End: Dynamic Parsed WhatsApp Lead Form Section Component */}

          {/* Start: Dynamic Parsed Features Grid Section Component */}
          {layoutData.featuresSection && layoutData.featuresSection.length > 0 && (
            <section className="px-6 py-12 sm:py-20 bg-slate-900/10 border-t border-slate-900">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-12">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {layoutData.featuresSection.map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-slate-900 border ${currentTheme.borderColor} rounded-2xl p-6 shadow-xl space-y-3 transition-colors hover:border-blue-500`}
                    >
                      <h3 className="text-base font-bold text-white">
                        {feature.title || "Untitled Feature"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feature.description || "No description provided for this feature."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {/* End: Dynamic Parsed Features Grid Section Component */}

          {/* Start: Interactive Customer Order Simulator Form */}
          {products.length > 0 && (
            <section className="p-6 sm:p-10 border-t border-slate-900 bg-slate-900/10">
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight text-center">
                  Interactive Customer Order Simulator
                </h3>
                {orderMessage && (
                  <div className="p-3 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded-lg animate-fadeInUp">
                    {orderMessage}
                  </div>
                )}
                <form onSubmit={handleSimulatorOrderSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="client-name" className="block text-xs font-semibold text-slate-400 mb-2">
                      Client Name
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      value={simulatorClientName}
                      onChange={(e) => setSimulatorClientName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-select" className="block text-xs font-semibold text-slate-400 mb-2">
                      Select Product
                    </label>
                    <select
                      id="product-select"
                      value={selectedProduct?.id || ''}
                      onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        setSelectedProduct(product || null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none pr-8 transition-colors"
                      required
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id} className="bg-slate-900 text-white">
                          {product.name} (RM {product.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Submit Order
                  </button>
                </form>
              </div>
            </section>
          )}
          {/* End: Interactive Customer Order Simulator Form */}

          {/* Start: Dynamic Parsed Custom HTML/CSS/JS Section */}
          {customHtml && (
            <section className="p-6 sm:p-10 border-t border-slate-900 bg-slate-900/10">
              <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-4">
                  Custom Injected Content
                </h3>
                {/* DANGER: dangerouslySetInnerHTML is used here to render user-provided HTML.
                    The input is sanitized in ComponentLibrary.tsx before being passed here
                    to mitigate XSS risks. Exercise extreme caution with this feature. */}
                <div 
                  className="prose prose-invert text-slate-300 text-xs sm:text-sm" // Tailwind Prose for basic styling
                  dangerouslySetInnerHTML={{ __html: customHtml.content }}
                />
              </div>
            </section>
          )}
          {/* End: Dynamic Parsed Custom HTML/CSS/JS Section */}

          {/* Start: Dynamic Parsed Custom Layout Sections */}
          {customLayouts && customLayouts.length > 0 && (
            <section className="px-6 py-12 sm:py-20 bg-slate-900/10 border-t border-slate-900">
              <div className="max-w-6xl mx-auto space-y-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center">Custom Layouts</h2>
                {customLayouts.map((layout) => (
                  <div key={layout.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    {/* Render Multi-Column Text Layout */}
                    {layout.type === "multiColumnText" && layout.columns && (
                      <div className={`grid grid-cols-1 md:grid-cols-${layout.columnCount || 2} gap-6`}>
                        {layout.columns.map((col, idx) => (
                          <div key={idx} className="space-y-2">
                            <h3 className="text-lg font-bold text-white">{col.title}</h3>
                            {/* DANGER: dangerouslySetInnerHTML used for user-provided layout content.
                                Ensure sanitization happens at input stage (ComponentLibrary.tsx). */}
                            <div className="text-sm text-slate-400 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: col.content }} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Feature Card Grid Layout */}
                    {layout.type === "featureCardGrid" && layout.items && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {layout.items.map((item) => (
                          <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg text-center space-y-3">
                            {item.icon && <div className="text-3xl mb-2">{item.icon}</div>}
                            <h3 className="text-md font-semibold text-white">{item.title}</h3>
                            <p className="text-slate-400 text-sm">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Add more custom layout types here as needed */}
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* End: Dynamic Parsed Custom Layout Sections */}
        </>
      )}
      {/* End: Home Tab Content */}

      {/* Start: Showcase Gallery Tab Content */}
      {activeTab === "Showcase Gallery" && (
        <section className="px-6 py-12 sm:py-20 bg-slate-900/10 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-12">
              Showcase Gallery
            </h2>
            {portfolio && portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-slate-900 border ${currentTheme.borderColor} rounded-2xl p-4 shadow-xl group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    {item.imageUrl && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 border border-slate-800">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                      </div>
                    )}
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors relative z-20">
                      {item.title || "Untitled Showcase Item"}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 relative z-20">
                      {item.description || "No description provided for this showcase item."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No showcase items added yet.</p>
            )}
          </div>
        </section>
      )}
      {/* End: Showcase Gallery Tab Content */}

      {/* Start: Client Wall Tab Content */}
      {activeTab === "Client Wall" && (
        <section className="px-6 py-12 sm:py-20 bg-slate-900/10 border-t border-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-12">
              Client Wall
            </h2>
            {testimonials && testimonials.length > 0 ? (
              <div className="space-y-6">
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-slate-900 border ${currentTheme.borderColor} rounded-2xl p-6 shadow-xl space-y-3 transition-colors hover:border-blue-500`}
                  >
                    <p className="text-sm italic text-slate-300 leading-relaxed">
                      &ldquo;{item.feedback || "No feedback provided."}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-800 mt-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {item.clientName ? item.clientName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{item.clientName || "Anonymous Client"}</h4>
                        <p className="text-[10px] text-slate-500">{item.clientTitle || "Satisfied Customer"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No client testimonials added yet.</p>
            )}
          </div>
        </section>
      )}
      {/* End: Client Wall Tab Content */}

    </div>
  );
}
// End: Core Engine Visual Builder JSON Parser Component
