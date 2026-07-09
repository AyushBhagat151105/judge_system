import { useState, useRef } from "react";
import { useEvaluationStore, type EvaluationReport } from "./use-evaluation-store";
import { toast } from "sonner";
import { env } from "@judge_system/env/web";

function parsePartialJson(jsonStr: string) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    let cleaned = jsonStr.trim();
    if (!cleaned.startsWith("{")) return null;

    let stack: string[] = [];
    let inQuote = false;
    let escaped = false;
    let result = "";

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (inQuote) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inQuote = false;
        }
      } else if (char === '"') {
        inQuote = true;
      } else if (char === "{") {
        stack.push("}");
      } else if (char === "[") {
        stack.push("]");
      } else if (char === "}") {
        if (stack[stack.length - 1] === "}") {
          stack.pop();
        }
      } else if (char === "]") {
        if (stack[stack.length - 1] === "]") {
          stack.pop();
        }
      }
      result += char;
    }

    if (inQuote) {
      result += '"';
    }

    while (stack.length > 0) {
      result += stack.pop();
    }

    try {
      return JSON.parse(result);
    } catch {
      return null;
    }
  }
}

export type StreamStatus = "idle" | "analyzing" | "synthesizing" | "completed" | "error";

export function useEvaluationStream() {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [currentReport, setCurrentReport] = useState<Partial<EvaluationReport> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { setPaywallReached } = useEvaluationStore();

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus("idle");
    }
  };

  const startEvaluation = async (prompt: string) => {
    abort();
    setStatus("analyzing");
    setCurrentReport(null);
    setError(null);
    setLogs(["[Panel] Activating AI Analyst Sub-Panels...", "[Panel] Analyzing Technical Feasibility...", "[Panel] Evaluating Market Viability...", "[Panel] Scanning Risk & Competitive Moats..."]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${env.VITE_SERVER_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [prompt],
        }),
        signal: abortController.signal,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 402 || response.status === 403) {
          setPaywallReached(true);
          setStatus("idle");
          try {
            const errObj = await response.json();
            toast.error(errObj?.message || "Free evaluation limit reached. Please sign in for unlimited evaluations.");
          } catch {
            toast.error("Free evaluation limit reached. Please sign in for unlimited evaluations.");
          }
          return;
        }
        const errText = await response.text();
        throw new Error(errText || `Server returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable.");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedJson = "";

      setStatus("synthesizing");
      setLogs((prev) => [...prev, "[Lead Judge] Analyst reports successfully retrieved.", "[Lead Judge] Starting synthesis & structuring evaluation report..."]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") continue;

          try {
            const chunk = JSON.parse(dataStr);

            if (chunk.type === "RUN_ERROR") {
              throw new Error(chunk.error?.message || "An error occurred during evaluation.");
            }

            if (chunk.type === "CUSTOM" && chunk.name === "structured-output.complete") {
              const finalObject = chunk.value.object as EvaluationReport;
              setCurrentReport(finalObject);
              setStatus("completed");
              setLogs((prev) => [...prev, "[Lead Judge] Synthesis complete.", "[Panel] Evaluation successfully saved to history."]);
              toast.success("Evaluation complete! Your report is ready.");
              return;
            }

            if (chunk.type === "TEXT_MESSAGE_CONTENT" && chunk.delta) {
              accumulatedJson += chunk.delta;
              const parsed = parsePartialJson(accumulatedJson);
              if (parsed) {
                setCurrentReport(parsed);
              }
            }
          } catch (e: any) {
            console.error("Error parsing stream line:", e, "Line content:", dataStr);
          }
        }
      }

      setStatus("completed");
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
      setStatus("error");
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Failed to complete evaluation.");
    } finally {
      abortControllerRef.current = null;
    }
  };

  return {
    status,
    currentReport,
    error,
    logs,
    startEvaluation,
    abort,
  };
}
