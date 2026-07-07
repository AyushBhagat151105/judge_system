import { useState } from "react";
import { X, RefreshCw } from "lucide-react";
import type { StreamStatus } from "@/lib/use-evaluation-stream";

interface EvaluationConsoleProps {
  status: StreamStatus;
  onSubmit: (prompt: string) => void;
  onAbort: () => void;
}

export function EvaluationConsole({ status, onSubmit, onAbort }: EvaluationConsoleProps) {
  const [promptInput, setPromptInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onSubmit(promptInput);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-5 shadow-neobrutalist">
      <h2 className="text-lg font-black uppercase mb-4 flex items-center gap-2 border-b-2 border-black pb-2 text-black dark:text-white">
        ⚖️ Startup Evaluator Console
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-black dark:text-zinc-300">
            Business Prompt / Concept
          </label>
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe your startup concept, market model, competitive advantage..."
            rows={5}
            disabled={status === "analyzing" || status === "synthesizing"}
            className="w-full border-neobrutalist p-3 rounded-none bg-amber-50/30 dark:bg-zinc-800/30 text-xs font-bold focus:outline-none focus:bg-white dark:focus:bg-zinc-800 resize-none text-black dark:text-white disabled:opacity-50"
          />
        </div>

        {status === "analyzing" || status === "synthesizing" ? (
          <div className="flex gap-2">
            <div className="flex-1 bg-neo-pink border-2 border-black font-black text-xs py-3 px-4 flex items-center justify-center gap-2 text-black">
              <RefreshCw className="size-4 animate-spin" />
              Running Panels...
            </div>
            <button
              type="button"
              onClick={onAbort}
              className="bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black hover-neobrutalist p-3 cursor-pointer shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-neo-yellow text-black border-2 border-black font-black py-3 px-4 shadow-neobrutalist hover-neobrutalist cursor-pointer flex items-center justify-center gap-2 text-xs uppercase"
          >
            Evaluate Startup Concept
          </button>
        )}
      </form>
    </div>
  );
}
