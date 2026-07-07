import { X, AlertTriangle, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEvaluationStore } from "@/lib/use-evaluation-store";

export function PaywallModal() {
  const { paywallReached, setPaywallReached } = useEvaluationStore();

  if (!paywallReached) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neo-pink border-4 border-black p-8 shadow-neobrutalist max-w-md w-full relative">
        <button 
          onClick={() => setPaywallReached(false)}
          className="absolute top-4 right-4 bg-white dark:bg-zinc-900 border-2 border-black p-1 hover-neobrutalist cursor-pointer text-black dark:text-white"
        >
          <X className="size-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="size-10 text-black fill-neo-yellow shrink-0" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">Limit Reached!</h2>
        </div>
        <p className="font-bold text-sm mb-6 border-l-4 border-black pl-3 text-black/80">
          You've used your free evaluation. To save your evaluation history and run unlimited analysis, please continue by signing in.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={async () => {
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
                setPaywallReached(false);
              } catch (err: any) {
                toast.error(err.message || "Failed to authenticate with Google");
              }
            }}
            className="w-full bg-white text-black border-2 border-black font-black py-3 px-4 shadow-neobrutalist hover-neobrutalist cursor-pointer flex items-center justify-center gap-3"
          >
            <svg className="size-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google
          </button>
          <button 
            onClick={() => setPaywallReached(false)}
            className="w-full bg-white dark:bg-zinc-900 text-black dark:text-white border-2 border-black font-black py-3 px-4 shadow-neobrutalist hover-neobrutalist cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
