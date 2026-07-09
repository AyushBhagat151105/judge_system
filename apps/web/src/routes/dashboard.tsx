import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useEvaluationStore, type Evaluation, type EvaluationReport } from "@/lib/use-evaluation-store";
import { useEvaluationStream } from "@/lib/use-evaluation-stream";
import { useEvaluationHistory, useEvaluationDetail, useDeleteEvaluation, evaluationKeys } from "@/hooks/use-evaluations";

// Modular Dashboard Components
import { PaywallModal } from "@/components/dashboard/paywall-modal";
import { LogTerminal } from "@/components/dashboard/log-terminal";
import { HistorySidebar } from "@/components/dashboard/history-sidebar";
import { EvaluationConsole } from "@/components/dashboard/evaluation-console";
import { ReportView } from "@/components/dashboard/report-view";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  
  const { 
    setHistory, 
    selectedEvaluation, setSelectedEvaluation,
  } = useEvaluationStore();

  const {
    status,
    currentReport,
    error: streamError,
    logs,
    startEvaluation,
    abort
  } = useEvaluationStream();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"console" | "history" | "report">("console");

  // Auto-switch tabs to show status logs when evaluation begins
  useEffect(() => {
    if (status === "analyzing" || status === "synthesizing") {
      setActiveMobileTab("console");
    }
  }, [status]);

  // Auto-switch tabs to show report when evaluation completes or details are loaded
  useEffect(() => {
    if (status === "completed" || selectedEvaluation) {
      setActiveMobileTab("report");
    }
  }, [status, selectedEvaluation]);

  const { data: historyData, isLoading: historyLoading } = useEvaluationHistory(session);

  useEffect(() => {
    if (historyData) {
      setHistory(historyData);
    } else {
      setHistory([]);
    }
  }, [historyData, setHistory]);

  const { data: evaluationDetail } = useEvaluationDetail(selectedId);

  useEffect(() => {
    if (evaluationDetail) {
      setSelectedEvaluation(evaluationDetail);
    }
  }, [evaluationDetail, setSelectedEvaluation]);

  const deleteMutation = useDeleteEvaluation((deletedId) => {
    if (selectedEvaluation?.id === deletedId) {
      setSelectedEvaluation(null);
      setSelectedId(null);
    }
  });

  const handleStartSubmit = (prompt: string) => {
    setSelectedEvaluation(null);
    setSelectedId(null);
    startEvaluation(prompt);
  };

  // Sync completed evaluation to history if logged in
  useEffect(() => {
    if (status === "completed" && session) {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.all });
    }
  }, [status, session, queryClient]);

  // Determine active display data (streamed or selected history item)
  const displayReport = selectedEvaluation?.report || (currentReport as EvaluationReport);

  return (
    <div className="bg-amber-50 dark:bg-zinc-950 min-h-full p-4 md:p-6 text-black dark:text-white relative transition-colors duration-200">
      {/* Paywall Modal overlay if limits hit */}
      <PaywallModal />

      {/* Mobile Tab Switcher: Only visible below lg */}
      <div className="lg:hidden grid grid-cols-3 border-4 border-black mb-6 bg-white dark:bg-zinc-900 shadow-neobrutalist shrink-0">
        <button
          onClick={() => setActiveMobileTab("console")}
          className={`py-3 text-xs font-black uppercase border-r-4 border-black cursor-pointer transition-colors ${
            activeMobileTab === "console"
              ? "bg-neo-yellow text-black"
              : "bg-white dark:bg-zinc-900 text-black dark:text-white"
          }`}
        >
          ⚖️ Console
        </button>
        <button
          onClick={() => setActiveMobileTab("history")}
          className={`py-3 text-xs font-black uppercase border-r-4 border-black cursor-pointer transition-colors ${
            activeMobileTab === "history"
              ? "bg-neo-cyan text-black"
              : "bg-white dark:bg-zinc-900 text-black dark:text-white"
          }`}
        >
          📚 History
        </button>
        <button
          onClick={() => setActiveMobileTab("report")}
          className={`py-3 text-xs font-black uppercase cursor-pointer transition-colors ${
            activeMobileTab === "report"
              ? "bg-neo-pink text-black"
              : "bg-white dark:bg-zinc-900 text-black dark:text-white"
          }`}
        >
          👑 Report
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Prompt input, Logs & History - visible if not on report tab on mobile */}
        <div className={`lg:col-span-4 space-y-6 ${activeMobileTab !== "report" ? "" : "hidden lg:block"}`}>
          {/* Console / Log view on mobile - activeMobileTab === "console" */}
          <div className={activeMobileTab === "console" ? "space-y-6" : "hidden lg:block lg:space-y-6"}>
            <EvaluationConsole 
              status={status} 
              onSubmit={handleStartSubmit} 
              onAbort={abort} 
            />

            <LogTerminal 
              status={status} 
              logs={logs} 
              streamError={streamError} 
            />
          </div>

          {/* History view - activeMobileTab === "history" */}
          <div className={activeMobileTab === "history" ? "block" : "hidden lg:block"}>
            <HistorySidebar 
              session={session}
              historyLoading={historyLoading}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </div>
        </div>

        {/* Right Column: Coordinated Panel Analysis / Reports - visible if on report tab on mobile */}
        <div className={`lg:col-span-8 ${activeMobileTab === "report" ? "block" : "hidden lg:block"}`}>
          <ReportView report={displayReport} />
        </div>
      </div>
    </div>
  );

}
