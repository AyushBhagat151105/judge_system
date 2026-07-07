import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Evaluation } from "@/lib/use-evaluation-store";
import { toast } from "sonner";
import { useEvaluationStore } from "@/lib/use-evaluation-store";

export const evaluationKeys = {
  all: ["history"] as const,
  lists: () => [...evaluationKeys.all, "list"] as const,
  list: (userId: string | undefined) => [...evaluationKeys.lists(), userId] as const,
  details: () => [...evaluationKeys.all, "detail"] as const,
  detail: (id: string | null) => [...evaluationKeys.details(), id] as const,
};

export function useEvaluationHistory(session: any) {
  return useQuery({
    queryKey: evaluationKeys.list(session?.user?.id),
    queryFn: async () => {
      const res = await api.get("/api/v1/chat/history");
      return (res.data.history || []) as Evaluation[];
    },
    enabled: !!session,
  });
}

export function useEvaluationDetail(selectedId: string | null) {
  return useQuery({
    queryKey: evaluationKeys.detail(selectedId),
    queryFn: async () => {
      if (!selectedId) return null;
      const res = await api.get(`/api/v1/chat/evaluation/${selectedId}`);
      return res.data.evaluation as Evaluation;
    },
    enabled: !!selectedId,
  });
}

export function useDeleteEvaluation(onDeleteSuccess?: (deletedId: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/chat/evaluation/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      toast.success("Evaluation deleted successfully");
      queryClient.invalidateQueries({ queryKey: evaluationKeys.all });
      if (onDeleteSuccess) {
        onDeleteSuccess(deletedId);
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to delete evaluation";
      toast.error(message);
    },
  });
}
