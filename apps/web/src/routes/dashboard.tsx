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
    <div className="bg-amber-50 dark:bg-zinc-950 min-h-full p-6 text-black dark:text-white relative transition-colors duration-200">
      {/* Paywall Modal overlay if limits hit */}
      <PaywallModal />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prompt input, Logs & History */}
        <div className="lg:col-span-4 space-y-6">
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

          <HistorySidebar 
            session={session}
            historyLoading={historyLoading}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </div>

        {/* Right Column: Coordinated Panel Analysis / Reports */}
        <div className="lg:col-span-8">
          <ReportView report={displayReport} />
        </div>
      </div>
    </div>
  );
}
