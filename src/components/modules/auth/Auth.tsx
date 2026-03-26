import * as React from "react";
import { supabase, isSupabaseConfigured, supabaseUrl, hasPrefixIssue, hasKeyIssue, isServiceRoleKey } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Shield, Mail, Lock, ArrowRight, AlertTriangle, RefreshCw, Key } from "lucide-react";

export function Auth() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = React.useState(false);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    setError(null);
    setSuccess(null);
    try {
      // 1. Try client-side check first
      let clientOk = false;
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/health`, { method: 'GET', cache: 'no-store' });
        clientOk = res.ok;
      } catch (e) {
        clientOk = false;
      }

      // 2. Try server-side check
      const serverRes = await fetch("/api/diagnostics/supabase");
      const serverData = await serverRes.json();

      if (clientOk && serverData.status === "ok") {
        setSuccess("Perfect! Both your browser and the server can reach Supabase.");
      } else if (!clientOk && serverData.status === "ok") {
        setError("AD-BLOCKER DETECTED: Your browser is blocking the connection to Supabase, but our server can reach it. This confirms that an ad-blocker, VPN, or browser extension on your phone is 'cutting the wire' to the database. Please disable ad-blocking for this site or try Incognito mode.");
      } else if (serverData.httpStatus === 401 || serverData.httpStatus === 403) {
        setError("INVALID API KEY: The server reached Supabase, but was rejected with a 401/403 error. This means your NEXT_PUBLIC_SUPABASE_ANON_KEY is incorrect. Double-check that you copied the 'anon' key, not the 'service_role' key.");
      } else if (serverData.status !== "ok") {
        setError(`The server cannot reach Supabase: ${serverData.message || serverData.error}. This means the URL in your Secrets is likely incorrect.`);
      }
    } catch (err: any) {
      setError(`Diagnostic failed: ${err.message}. Please check your internet connection.`);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Please set your environment variables in the Settings menu.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSuccess("Success! Please check your email for a confirmation link to complete your registration.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth error details:", err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("networkerror")) {
        setError("Connection failed. This usually means your Supabase URL is incorrect, the project is paused, or you have a network issue. Please verify your NEXT_PUBLIC_SUPABASE_URL in Settings > Secrets.");
      } else if (msg.toLowerCase().includes("invalid api key") || msg.toLowerCase().includes("api key not found")) {
        setError("Invalid API key. Please ensure you are using the 'anon' public key from your Supabase Project Settings > API, and NOT the 'service_role' key.");
      } else if (msg.includes("localhost")) {
        setError("Your Supabase URL seems to point to localhost, which won't work in this environment. Please use your project's public Supabase URL.");
      } else {
        setError(msg || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-900 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Calm Finance • Manage your money with peace of mind.
          </p>
          {!isSupabaseConfigured ? (
            <div className="mt-4 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200 backdrop-blur-sm">
              <div className="flex items-center gap-2 font-bold text-amber-500">
                <AlertTriangle className="h-5 w-5" />
                <span>Configuration Required</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                The app cannot connect to your database. Please add these <strong>Secrets</strong> in the AI Studio settings (gear icon):
              </p>
              <ul className="space-y-1.5 font-mono text-[10px] text-amber-400/80">
                <li className="flex justify-between border-b border-amber-500/10 pb-1">
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className={hasPrefixIssue ? "text-red-500 font-bold" : "text-amber-600"}>
                    {hasPrefixIssue ? "Misnamed!" : "Missing"}
                  </span>
                </li>
                <li className="flex justify-between border-b border-amber-500/10 pb-1">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span className={hasPrefixIssue ? "text-red-500 font-bold" : "text-amber-600"}>
                    {hasPrefixIssue ? "Misnamed!" : "Missing"}
                  </span>
                </li>
              </ul>
              {hasPrefixIssue && (
                <p className="text-[10px] text-red-400 font-bold bg-red-400/10 p-2 rounded">
                  Warning: You must include the "NEXT_PUBLIC_" prefix in your secret names for them to be visible in the browser.
                </p>
              )}
              {hasKeyIssue && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-[10px] text-red-400">
                  <Key className="h-3 w-3 shrink-0 mt-0.5" />
                  <p>
                    <strong>Key Issue Detected:</strong> Your <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> looks like a <strong>service_role</strong> key. You MUST use the <strong>anon</strong> public key for client-side authentication.
                  </p>
                </div>
              )}
              <p className="text-[10px] italic opacity-70">
                * After adding them, the app will restart automatically.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-emerald-500/80">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected to Supabase</span>
            </div>
          )}
        </div>

        <Card className="space-y-6 bg-base-800/50 backdrop-blur-xl border-base-700">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-base-900 border border-base-700 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-base-900 border border-base-700 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="space-y-2">
                <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                  {error}
                </p>
                {error.includes("Connection failed") && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-text-muted bg-base-900/50 p-2 rounded border border-base-700 font-mono">
                      <p>Debug Info:</p>
                      <p>URL: {supabaseUrl.includes("placeholder") ? "Not Configured" : `${supabaseUrl.substring(0, 15)}...`}</p>
                      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (Masked)" : "Not Set"}</p>
                    </div>
                    <p className="text-[10px] text-amber-400/70 italic">
                      Tip: If you use an ad-blocker or VPN, try disabling it for this site.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={checkConnection}
                      disabled={isCheckingConnection}
                      className="w-full text-[10px] h-8 gap-2"
                    >
                      <RefreshCw className={`h-3 w-3 ${isCheckingConnection ? "animate-spin" : ""}`} />
                      Run Diagnostic
                    </Button>
                  </div>
                )}
              </div>
            )}

            {success && (
              <p className="text-xs text-emerald-400 bg-emerald-400/10 p-2 rounded border border-emerald-400/20">
                {success}
              </p>
            )}

            <Button type="submit" className="w-full gap-2" loading={loading}>
              {isSignUp ? "Sign Up" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-base-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-base-800 px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 border-base-700 hover:bg-base-700"
            onClick={handleGoogleLogin}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <p className="text-center text-sm text-text-muted">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
