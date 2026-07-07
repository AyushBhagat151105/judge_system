import { HelpCircle, RefreshCw, Trash2 } from "lucide-react";
import { useEvaluationStore } from "@/lib/use-evaluation-store";

interface HistorySidebarProps {
  session: any;
  historyLoading: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export function HistorySidebar({
  session,
  historyLoading,
  selectedId,
  setSelectedId,
  onDelete,
}: HistorySidebarProps) {
  const { history, selectedEvaluation } = useEvaluationStore();

  const getVerdictStyle = (verdict?: string) => {
    switch (verdict) {
      case "APPROVED":
        return "bg-neo-mint text-black";
      case "NEEDS_REVISION":
        return "bg-neo-orange text-black";
      case "REJECTED":
        return "bg-neo-pink text-black";
      default:
        return "bg-white dark:bg-zinc-900 text-black dark:text-white";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-5 shadow-neobrutalist">
      <h2 className="text-lg font-black uppercase mb-4 border-b-2 border-black pb-2 flex items-center justify-between">
        <span>📚 Past Evaluations</span>
        {session && (
          <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-xxs font-bold">
            {history.length} Saved
          </span>
        )}
      </h2>

      {!session ? (
        <div className="bg-neo-cyan/20 border-2 border-black p-4 text-xs font-bold text-black dark:text-zinc-200">
          <HelpCircle className="size-6 text-black dark:text-white mb-2" />
          Sign in to save your history and sync evaluations across devices. Currently running in Guest mode.
        </div>
      ) : historyLoading ? (
        <div className="text-xs font-bold flex items-center gap-2 justify-center py-6">
          <RefreshCw className="size-4 animate-spin text-black dark:text-white" />
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="text-xs font-bold text-center text-black/60 dark:text-zinc-400 py-6 border-2 border-dashed border-black/30 dark:border-zinc-700">
          No past evaluations found. Submit a concept to get started.
        </div>
      ) : (
        <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`border-2 border-black p-3 hover:bg-amber-50 dark:hover:bg-zinc-800 cursor-pointer transition-all flex justify-between items-center ${
                selectedId === item.id || selectedEvaluation?.id === item.id
                  ? "bg-neo-yellow/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white dark:bg-zinc-900"
              }`}
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-xs uppercase truncate text-black dark:text-white">{item.businessName}</h4>
                <p className="text-10px font-bold text-black/60 dark:text-zinc-400 truncate">{item.tagline}</p>
                <div className="flex gap-2 items-center mt-2">
                  <span className={`text-[9px] font-black uppercase px-1 border border-black ${getVerdictStyle(item.verdict)}`}>
                    {item.verdict}
                  </span>
                  <span className="text-[9px] font-bold text-black/50 dark:text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this evaluation?")) {
                    onDelete(item.id);
                  }
                }}
                className="text-black dark:text-white hover:text-red-600 dark:hover:text-red-400 p-1 bg-transparent border-0 cursor-pointer shrink-0 ml-2"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
