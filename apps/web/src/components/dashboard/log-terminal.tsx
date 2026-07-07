import type { StreamStatus } from "@/lib/use-evaluation-stream";

interface LogTerminalProps {
  status: StreamStatus;
  logs: string[];
  streamError: string | null;
}

export function LogTerminal({ status, logs, streamError }: LogTerminalProps) {
  if (status === "idle") return null;
  if (logs.length === 0) return null;

  return (
    <div className="bg-black text-neo-mint border-neobrutalist p-4 shadow-neobrutalist font-mono text-xxs space-y-1.5 max-h-48 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-neo-mint/30 pb-1 mb-2">
        <span className="font-bold text-white tracking-widest text-xs">LOG TERMINAL</span>
        <span className="bg-neo-mint text-black px-1 text-[9px] uppercase font-black">
          {status}
        </span>
      </div>
      {logs.map((log, index) => (
        <div key={index} className="leading-tight">
          <span className="text-gray-500">[{index + 1}]</span> {log}
        </div>
      ))}
      {status === "error" && streamError && (
        <div className="text-neo-pink font-bold border-t border-neo-pink/30 pt-1.5 mt-2">
          ERROR: {streamError}
        </div>
      )}
    </div>
  );
}
