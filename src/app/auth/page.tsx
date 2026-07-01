"use client";

// Start: Core React and Next.js Architecture Imports
import { useState } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Architecture Imports

// Start: Third-Party SDK and Validation Schema Dependency Imports
import { supabase } from "@/lib/supabase/client";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { z } from "zod";
// End: Third-Party SDK and Validation Schema Dependency Imports

// Start: Authentication Interface Component
export default function AuthenticationPage() {
  const router = useRouter();
  
  // Start: Component Local State Matrix
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [email, setEmail] = useState<string>( "");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>( "");
  const [uiErrorMessage, setUiErrorMessage] = useState<string | null>(null);
  const [isExecutionLoading, setIsExecutionLoading] = useState<boolean>(false);
  // End: Component Local State Matrix

  // Start: External Google OAuth Pipeline Handler
  const handleGoogleOAuthExecution = async () => {
    try {
      setIsExecutionLoading(true);
      setUiErrorMessage(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setUiErrorMessage(error.message || "An error occurred during Google authentication initialization.");
      setIsExecutionLoading(false);
    }
  };
  // End: External Google OAuth Pipeline Handler

  // Start: Manual Credentials Authentication Pipeline Handler
  const handleManualAuthFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecutionLoading(true);
    setUiErrorMessage(null);

    try {
      if (isLoginView) {
        // Start: Client Side Zod Schema Structural Pre-flight Verification
        loginSchema.parse({ email, password });
        // End: Client Side Zod Schema Structural Pre-flight Verification

        // Start: Supabase Native Login Pipeline Execution
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // End: Supabase Native Login Pipeline Execution
        
        router.push("/dashboard");
      } else {
        // Start: Client Side Zod Schema Structural Pre-flight Verification
        registerSchema.parse({ username, email, password, requireTwoFactor: true });
        // End: Client Side Zod Schema Structural Pre-flight Verification

        // Start: Supabase Native Registration Pipeline Execution
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_username: username },
          },
        });
        if (error) throw error;
        // End: Supabase Native Registration Pipeline Execution

        alert("Registration initiated successfully. Please verify your email client or check initial 2FA constraints.");
        setIsLoginView(true);
      }
    } catch (validationOrApiError: any) {
      if (validationOrApiError instanceof z.ZodError) {
        setUiErrorMessage(validationOrApiError.errors[0].message);
      } else {
        setUiErrorMessage(validationOrApiError.message || "Authentication gateway execution failure.");
      }
    } finally {
      setIsExecutionLoading(false);
    }
  };
  // End: Manual Credentials Authentication Pipeline Handler

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Start: Branding and Context Headers */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Nexus Engine</h1>
          <p className="text-sm text-slate-400">
            {isLoginView ? "Welcome back. Access your core workspace." : "Initialize a secure developer account."}
          </p>
        </div>
        {/* End: Branding and Context Headers */}

        {/* Start: Error Output Banner Container */}
        {uiErrorMessage && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-400 text-xs rounded-lg font-medium">
            {uiErrorMessage}
          </div>
        )}
        {/* End: Error Output Banner Container */}

        {/* Start: Main Interaction Authentication Form */}
        <form onSubmit={handleManualAuthFormSubmission} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="braderdin_dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isExecutionLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nexus.webflowai@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isExecutionLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isExecutionLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl py-3 transition-colors shadow-lg shadow-blue-950/50 disabled:opacity-50"
            disabled={isExecutionLoading}
          >
            {isExecutionLoading ? "Processing..." : isLoginView ? "Sign In Securely" : "Create Enterprise Account"}
          </button>
        </form>
        {/* End: Main Interaction Authentication Form */}

        {/* Start: Structural Intermediary Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-xs uppercase tracking-widest text-slate-500 font-bold">OR</span>
        </div>
        {/* End: Structural Intermediary Divider */}

        {/* Start: Identity Provider Social Sign-In Operations */}
        <button
          onClick={handleGoogleOAuthExecution}
          className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-medium text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          disabled={isExecutionLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google Cloud Identity
        </button>
        {/* End: Identity Provider Social Sign-In Operations */}

        {/* Start: View Switching Control Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setUiErrorMessage(null);
            }}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors focus:outline-none"
            disabled={isExecutionLoading}
          >
            {isLoginView ? "Don't have an account? Sign up now" : "Already registered? Return to logging in"}
          </button>
        </div>
        {/* End: View Switching Control Link */}

      </div>
    </div>
  );
}