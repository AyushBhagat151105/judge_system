import { useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import type { EvaluationReport } from "@/lib/use-evaluation-store";

interface ReportViewProps {
  report: EvaluationReport | null;
}

type TabType = "lead" | "tech" | "market" | "risk";

export function ReportView({ report }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("lead");

  if (!report) {
    return (
      <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-12 shadow-neobrutalist text-center flex flex-col items-center justify-center min-h-[30rem]">
        <div className="bg-neo-yellow border-2 border-black p-4 shadow-neobrutalist mb-6 rotate-[-1deg]">
          <Sparkles className="size-12 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2 text-black dark:text-white">
          Startup Judge Workspace
        </h2>
        <p className="font-bold text-sm text-black/60 dark:text-zinc-400 max-w-md mb-6 leading-relaxed">
          Submit your startup concept on the left to start a comprehensive coordinated panel evaluation. Our AI analysts will inspect tech feasibility, market viability, risk profiles, and generate a final verdict.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-lg">
          <span className="border-2 border-black bg-neo-mint/30 dark:bg-neo-mint/20 px-3 py-1.5 text-xs font-bold text-black dark:text-white">
            💡 Try SaaS idea
          </span>
          <span className="border-2 border-black bg-neo-pink/30 dark:bg-neo-pink/20 px-3 py-1.5 text-xs font-bold text-black dark:text-white">
            💡 Try AI platform
          </span>
          <span className="border-2 border-black bg-neo-cyan/30 dark:bg-neo-cyan/20 px-3 py-1.5 text-xs font-bold text-black dark:text-white">
            💡 Try e-commerce idea
          </span>
        </div>
      </div>
    );
  }

  const getVerdictStyle = (verdict?: string) => {
    switch (verdict) {
      case "APPROVED":
        return "bg-neo-mint text-black";
      case "NEEDS_REVISION":
        return "bg-neo-orange text-black";
      case "REJECTED":
        return "bg-neo-pink text-black";
      default:
        return "bg-white dark:bg-zinc-800 text-black dark:text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-6 shadow-neobrutalist flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white">
              {report.businessName || "Analyzing Name..."}
            </h1>
            {report.finalVerdict && (
              <span className={`border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${getVerdictStyle(report.finalVerdict)}`}>
                {report.finalVerdict}
              </span>
            )}
          </div>
          <p className="font-bold text-sm text-black/70 dark:text-zinc-300 mt-1 border-l-4 border-black pl-3 italic">
            {report.tagline || "Evaluating tagline..."}
          </p>
        </div>

        {report.confidenceScore && (
          <div className="bg-neo-yellow border-neobrutalist p-3 shadow-neobrutalist text-center shrink-0 w-full md:w-auto">
            <span className="block text-[9px] font-black uppercase tracking-wider text-black/60">
              AI Confidence
            </span>
            <span className="text-3xl font-black text-black">{report.confidenceScore}/10</span>
          </div>
        )}
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-none snap-x snap-mandatory flex-nowrap -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { id: "lead", label: "👑 Lead Judge & SWOT", color: "bg-neo-yellow" },
          { id: "tech", label: "💻 Technical Feasibility", color: "bg-neo-cyan" },
          { id: "market", label: "📈 Market Viability", color: "bg-neo-pink" },
          { id: "risk", label: "🛡️ Risk & Competitors", color: "bg-neo-mint" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`border-neobrutalist px-4 py-2 text-xs font-black uppercase cursor-pointer select-none transition-all whitespace-nowrap snap-align-start ${
              activeTab === tab.id
                ? `${tab.color} text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]`
                : "bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Panel Content */}
      <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-6 shadow-neobrutalist min-h-[25rem] text-black dark:text-white">
        {/* 1. Lead Judge Synthesis & SWOT */}
        {activeTab === "lead" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-3">
                Executive Summary
              </h3>
              <p className="text-xs font-bold leading-relaxed text-black/80 dark:text-zinc-200 whitespace-pre-wrap">
                {report.executiveSummary || "Synthesizing executive summary..."}
              </p>
            </div>

            {/* SWOT Grid */}
            <div>
              <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">
                SWOT Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neo-mint/20 dark:bg-neo-mint/10 border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-green-950 dark:text-green-300 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.swotAnalysis?.strengths?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
                <div className="bg-neo-yellow/20 dark:bg-neo-yellow/10 border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-amber-950 dark:text-amber-300 mb-2">Weaknesses</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.swotAnalysis?.weaknesses?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
                <div className="bg-neo-cyan/20 dark:bg-neo-cyan/10 border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-blue-950 dark:text-blue-300 mb-2">Opportunities</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.swotAnalysis?.opportunities?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
                <div className="bg-neo-pink/20 dark:bg-neo-pink/10 border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-red-950 dark:text-red-300 mb-2">Threats</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.swotAnalysis?.threats?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            {report.prosAndCons && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Pros</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.prosAndCons.pros?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
                <div className="border-2 border-black p-4">
                  <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Cons</h4>
                  <ul className="list-disc list-inside text-xxs font-bold text-black/85 dark:text-zinc-200 space-y-1">
                    {report.prosAndCons.cons?.map((item, i) => <li key={i}>{item}</li>) || (
                      <li>Analyzing...</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Actionable Recommendations */}
            <div>
              <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-3">
                Actionable Next Steps
              </h3>
              <ol className="list-decimal list-inside text-xs font-bold text-black/85 dark:text-zinc-200 space-y-2">
                {report.actionableRecommendations?.map((rec, i) => (
                  <li key={i} className="pl-1 leading-relaxed">
                    {rec}
                  </li>
                )) || <li>Synthesizing next steps...</li>}
              </ol>
            </div>
          </div>
        )}

        {/* 2. Technical Feasibility */}
        {activeTab === "tech" && (
          <div className="space-y-6">
            {report.technicalFeasibility?.score && (
              <div className="bg-neo-cyan border-2 border-black p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase text-sm text-black">Feasibility Rating</h4>
                  <p className="text-xxs font-bold text-black/70">Estimated complexity and MVP feasibility</p>
                </div>
                <span className="text-4xl font-black text-black">{report.technicalFeasibility.score}/10</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                Feasibility Summary
              </h3>
              <p className="text-xs font-bold leading-relaxed text-black/80 dark:text-zinc-200">
                {report.technicalFeasibility?.summary || "Analyzing technology constraints..."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Recommended Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {report.technicalFeasibility?.recommendedStack?.map((item, i) => (
                    <span key={i} className="border-2 border-black bg-white dark:bg-zinc-800 px-2 py-1 text-xxs font-bold">
                      {item}
                    </span>
                  )) || <span className="text-xxs font-bold">Analyzing...</span>}
                </div>
              </div>

              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Time To MVP</h4>
                <span className="border-2 border-black bg-neo-yellow text-black px-3 py-1.5 text-xs font-black uppercase inline-block">
                  ⏳ {report.technicalFeasibility?.timeToMVP || "Estimating MVP timeline..."}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                Key Engineering Challenges
              </h3>
              <ul className="list-disc list-inside text-xs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                {report.technicalFeasibility?.challenges?.map((challenge, i) => (
                  <li key={i}>{challenge}</li>
                )) || <li>Analyzing challenges...</li>}
              </ul>
            </div>

            {report.technicalFeasibility?.packageRecommendations &&
              report.technicalFeasibility.packageRecommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                    Recommended Libraries / APIs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.technicalFeasibility.packageRecommendations.map((pkg, i) => (
                      <div key={i} className="border-2 border-black p-3 bg-amber-50/20 dark:bg-zinc-800/20">
                        <h5 className="font-black text-xxs uppercase text-black dark:text-white">{pkg.name}</h5>
                        <p className="text-10px font-bold text-black/70 dark:text-zinc-400 mt-1">{pkg.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* 3. Market Viability */}
        {activeTab === "market" && (
          <div className="space-y-6">
            {report.marketViability?.score && (
              <div className="bg-neo-pink border-2 border-black p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase text-sm text-black">Viability Score</h4>
                  <p className="text-xxs font-bold text-black/70">Market size, pain point, and financial readiness</p>
                </div>
                <span className="text-4xl font-black text-black">{report.marketViability.score}/10</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                Market Demand Summary
              </h3>
              <p className="text-xs font-bold leading-relaxed text-black/80 dark:text-zinc-200">
                {report.marketViability?.summary || "Analyzing market economics..."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Suggested Monetization Models</h4>
                <ul className="list-disc list-inside text-xs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                  {report.marketViability?.monetizationModels?.map((model, i) => <li key={i}>{model}</li>) || (
                    <li>Analyzing models...</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Target Customer Audience</h4>
                <ul className="list-disc list-inside text-xs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                  {report.marketViability?.targetAudience?.map((audience, i) => <li key={i}>{audience}</li>) || (
                    <li>Analyzing segments...</li>
                  )}
                </ul>
              </div>
            </div>

            {report.marketViability?.financialProjections && (
              <div className="bg-neo-yellow/20 dark:bg-neo-yellow/10 border-2 border-black p-4 space-y-3">
                <h4 className="font-black text-xs uppercase border-b border-black pb-1">
                  Financial Estimates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-black uppercase text-black/60 dark:text-zinc-400">
                      Estimated Funding Needs
                    </span>
                    <span className="font-black text-sm uppercase text-black dark:text-white">
                      💰 {report.marketViability.financialProjections.fundingNeeds}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-black/60 dark:text-zinc-400">
                      Time to Break-Even
                    </span>
                    <span className="font-black text-sm uppercase text-black dark:text-white">
                      ⏳ {report.marketViability.financialProjections.breakEvenTime}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                Market & Growth Opportunities
              </h3>
              <ul className="list-disc list-inside text-xs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                {report.marketViability?.opportunities?.map((opp, i) => <li key={i}>{opp}</li>) || (
                  <li>Analyzing opportunities...</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* 4. Risk Assessment & Competitors */}
        {activeTab === "risk" && (
          <div className="space-y-6">
            {report.riskAssessment?.score && (
              <div className="bg-neo-mint border-2 border-black p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase text-sm text-black">Risk Score (Safety)</h4>
                  <p className="text-xxs font-bold text-black/70">Higher is safer, lower means higher barrier/risk</p>
                </div>
                <span className="text-4xl font-black text-black">{report.riskAssessment.score}/10</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-2">
                Risk Breakdown
              </h3>
              <p className="text-xs font-bold leading-relaxed text-black/80 dark:text-zinc-200">
                {report.riskAssessment?.summary || "Analyzing threats and entry barriers..."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-3">
                Competitor Landscape
              </h3>
              {report.riskAssessment?.competitorList && report.riskAssessment.competitorList.length > 0 ? (
                <div className="space-y-3">
                  {report.riskAssessment.competitorList.map((comp, i) => (
                    <div key={i} className="border-2 border-black p-3 bg-amber-50/20 dark:bg-zinc-800/20">
                      <div className="flex justify-between items-center">
                        <h5 className="font-black text-xs uppercase text-black dark:text-white">{comp.name}</h5>
                        {comp.url && (
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black dark:text-white hover:text-neo-pink inline-flex items-center gap-1 text-[9px] font-bold"
                          >
                            Visit site <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-xxs font-bold text-black/70 dark:text-zinc-300 mt-1">
                        <strong className="uppercase text-[9px] text-black dark:text-white block">Their advantage:</strong>
                        {comp.moat}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-black/60 dark:text-zinc-400">Analyzing competitors online...</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">Mitigation Strategies</h4>
                <ul className="list-disc list-inside text-xxs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                  {report.riskAssessment?.mitigationStrategies?.map((item, i) => <li key={i}>{item}</li>) || (
                    <li>Analyzing...</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-xs uppercase text-black dark:text-white mb-2">
                  Regulatory & Compliance Hurdles
                </h4>
                <ul className="list-disc list-inside text-xxs font-bold text-black/80 dark:text-zinc-200 space-y-1">
                  {report.riskAssessment?.regulatoryConcerns?.map((item, i) => <li key={i}>{item}</li>) || (
                    <li>Analyzing...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
