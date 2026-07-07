import { create } from "zustand";

export interface EvaluationReport {
  businessName: string;
  tagline: string;
  executiveSummary: string;
  innovationRating: {
    score: number;
    rationale: string;
  };
  technicalFeasibility: {
    score: number;
    summary: string;
    challenges: string[];
    recommendedStack: string[];
    timeToMVP: string;
    searchQueriesPerformed?: string[];
    packageRecommendations?: Array<{ name: string; purpose: string }>;
  };
  marketViability: {
    score: number;
    summary: string;
    opportunities: string[];
    targetAudience: string[];
    monetizationModels: string[];
    financialProjections: {
      fundingNeeds: string;
      breakEvenTime: string;
    };
    searchQueriesPerformed?: string[];
    marketTrends?: string[];
  };
  riskAssessment: {
    score: number;
    summary: string;
    mitigationStrategies: string[];
    competitorAnalysis?: string[];
    regulatoryConcerns?: string[];
    searchQueriesPerformed?: string[];
    competitorList?: Array<{ name: string; url?: string; moat: string }>;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  finalVerdict: "APPROVED" | "NEEDS_REVISION" | "REJECTED";
  confidenceScore: number;
  actionableRecommendations: string[];
}

export interface Evaluation {
  id: string;
  prompt: string;
  report: EvaluationReport;
  createdAt: string;
}

interface EvaluationStore {
  history: Array<{
    id: string;
    prompt: string;
    businessName: string;
    tagline: string;
    verdict: string;
    confidence: number;
    createdAt: string;
  }>;
  selectedEvaluation: Evaluation | null;
  paywallReached: boolean;
  freeCountLeft: number;
  setHistory: (history: any[]) => void;
  setSelectedEvaluation: (evalItem: Evaluation | null) => void;
  setPaywallReached: (reached: boolean) => void;
  setFreeCountLeft: (count: number) => void;
}

export const useEvaluationStore = create<EvaluationStore>((set) => ({
  history: [],
  selectedEvaluation: null,
  paywallReached: false,
  freeCountLeft: 1,
  setHistory: (history) => set({ history }),
  setSelectedEvaluation: (selectedEvaluation) => set({ selectedEvaluation }),
  setPaywallReached: (paywallReached) => set({ paywallReached }),
  setFreeCountLeft: (freeCountLeft) => set({ freeCountLeft }),
}));
