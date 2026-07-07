import { z } from "zod";

export const analystInputSchema = z.object({
    prompt: z.string().describe("The business idea prompt to evaluate")
});

export const analystOutputSchema = z.object({
    response: z.string().describe("The analyst's generated report/evaluation")
});

export const EvaluationReportSchema = z.object({
    businessName: z.string().describe("The name or concept of the business"),
    tagline: z.string().describe("A catchy, concise one-sentence description of the venture"),
    executiveSummary: z.string().describe("A high-level synthesis of the business idea, its potential, and overall assessment in markdown format"),
    innovationRating: z.object({
        score: z.number().min(1).max(10).describe("Innovation and uniqueness score out of 10"),
        rationale: z.string().describe("Explanation of the novelty, unique value proposition, or competitive moat")
    }),
    technicalFeasibility: z.object({
        score: z.number().min(1).max(10).describe("Feasibility score out of 10"),
        summary: z.string().describe("Detailed summary of product and technical feasibility, implementation complexity, and architecture considerations"),
        challenges: z.array(z.string()).describe("List of key technical bottlenecks or implementation challenges"),
        recommendedStack: z.array(z.string()).describe("Recommended programming languages, frameworks, services, and databases"),
        timeToMVP: z.string().describe("Estimated time to develop a Minimum Viable Product (e.g., '1-2 months', '3-6 months')"),
        searchQueriesPerformed: z.array(z.string()).describe("A list of search queries executed to gather technical feasibility evidence"),
        packageRecommendations: z.array(z.object({
            name: z.string().describe("Package, library, or API name"),
            purpose: z.string().describe("Why this package/API is recommended")
        })).describe("Specific npm packages, open-source libraries, or external APIs recommended")
    }),
    marketViability: z.object({
        score: z.number().min(1).max(10).describe("Market viability score out of 10"),
        summary: z.string().describe("Detailed summary of market demand, customer pain points, and unit economics"),
        opportunities: z.array(z.string()).describe("Key growth opportunities or market expansion angles"),
        targetAudience: z.array(z.string()).describe("Key customer segments or target user demographics"),
        monetizationModels: z.array(z.string()).describe("Suggested revenue generation models (e.g., SaaS, transaction fees, advertising)"),
        financialProjections: z.object({
            fundingNeeds: z.string().describe("Estimated initial funding required to bootstrap/launch (e.g., '$10k-$50k')"),
            breakEvenTime: z.string().describe("Estimated timeline to break-even or self-sustainability")
        }),
        searchQueriesPerformed: z.array(z.string()).describe("A list of search queries executed to gather market viability evidence"),
        marketTrends: z.array(z.string()).describe("Key industry trends discovered via web research")
    }),
    riskAssessment: z.object({
        score: z.number().min(1).max(10).describe("Risk assessment score out of 10 (higher means lower risk/safer)"),
        summary: z.string().describe("Detailed breakdown of risks, competitive landscape, barriers to entry, and compliance hurdles"),
        mitigationStrategies: z.array(z.string()).describe("List of concrete mitigation strategies for each identified risk"),
        competitorAnalysis: z.array(z.string()).describe("Main direct/indirect competitors or industry benchmarks"),
        regulatoryConcerns: z.array(z.string()).describe("Applicable compliance and legal frameworks (e.g. GDPR, HIPAA, PCI-DSS)"),
        searchQueriesPerformed: z.array(z.string()).describe("A list of search queries executed to gather risk and competitive intelligence"),
        competitorList: z.array(z.object({
            name: z.string().describe("Competitor name"),
            url: z.string().optional().describe("Competitor website URL"),
            moat: z.string().describe("Their competitive advantage or differentiator")
        })).describe("Detailed breakdown of key competitors found online")
    }),
    swotAnalysis: z.object({
        strengths: z.array(z.string()).describe("Key internal strengths and advantages of the venture"),
        weaknesses: z.array(z.string()).describe("Key internal weaknesses and vulnerabilities of the venture"),
        opportunities: z.array(z.string()).describe("Key external opportunities and growth trends"),
        threats: z.array(z.string()).describe("Key external threats, competitive moves, or market shifts")
    }),
    prosAndCons: z.object({
        pros: z.array(z.string()).describe("Top reasons to pursue this venture (advantages, upsides, accelerators)"),
        cons: z.array(z.string()).describe("Top reasons to be cautious (disadvantages, downsides, friction points)")
    }),
    finalVerdict: z.enum(["APPROVED", "NEEDS_REVISION", "REJECTED"]).describe("The overall recommendation verdict based on findings"),
    confidenceScore: z.number().min(1).max(10).describe("The AI evaluator's confidence score in this analysis out of 10"),
    actionableRecommendations: z.array(z.string()).describe("Step-by-step roadmap and actionable next steps for the founder(s)")
});

export const chatRequestSchema = z.object({
    body: z.object({
        messages: z.array(
            z.union([
                z.string(),
                z.object({
                    id: z.string().optional(),
                    role: z.enum(["user", "assistant", "system", "tool"]),
                    content: z.any().optional(),
                    parts: z.array(z.any()).optional()
                })
            ])
        ).min(1, "At least one message is required")
    })
});
