import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="bg-amber-50 dark:bg-zinc-950 min-h-full py-12 px-6 text-black dark:text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="bg-neo-yellow border-neobrutalist p-8 shadow-neobrutalist relative overflow-hidden text-black">
          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-widest">
            v1.0.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black uppercase mb-4 leading-none">
            Is Your Startup <br />
            <span className="bg-black text-neo-pink px-2 py-1 inline-block rotate-[-1deg] my-1">
              Actually Viable?
            </span>
          </h1>
          <p className="text-lg md:text-xl font-bold text-black border-l-4 border-black pl-4 mb-6 max-w-2xl">
            Get instant, brutally honest evaluations of your business concept from our coordinated AI Analyst panel. We check tech feasibility, market viability, and risk parameters.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <button className="bg-black text-white dark:bg-white dark:text-black hover:bg-neo-pink dark:hover:bg-neo-pink hover:text-black font-black text-lg px-6 py-3 border-2 border-black shadow-neobrutalist hover-neobrutalist cursor-pointer flex items-center gap-2 rounded-none">
                Start Free Evaluation
                <ArrowRight className="size-5" />
              </button>
            </Link>
            <a href="#features">
              <button className="bg-white text-black dark:bg-zinc-900 dark:text-white font-black text-lg px-6 py-3 border-neobrutalist shadow-neobrutalist hover-neobrutalist cursor-pointer rounded-none">
                How It Works
              </button>
            </a>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
          <div className="bg-neo-cyan border-neobrutalist p-6 shadow-neobrutalist hover-neobrutalist">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black mb-4">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">AI Tech Analysts</h3>
            <p className="font-bold text-xs leading-relaxed text-black/80">
              Evaluates implementation complexity, architecture feasibility, recommended tech stack, packages, and timeline to MVP.
            </p>
          </div>

          <div className="bg-neo-pink border-neobrutalist p-6 shadow-neobrutalist hover-neobrutalist">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black mb-4">
              <TrendingUp className="size-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Market Viability</h3>
            <p className="font-bold text-xs leading-relaxed text-black/80">
              Assesses target audience segments, growth opportunities, monetization models, initial funding needs, and break-even timelines.
            </p>
          </div>

          <div className="bg-neo-mint border-neobrutalist p-6 shadow-neobrutalist hover-neobrutalist">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black mb-4">
              <ShieldAlert className="size-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Competitor Moats</h3>
            <p className="font-bold text-xs leading-relaxed text-black/80">
              Performs real-time web research to map competitors, detail their value props, identify regulatory/legal hurdles, and define mitigation steps.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white dark:bg-zinc-900 border-neobrutalist p-8 shadow-neobrutalist text-black dark:text-white">
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
            The Coordinated Panel Workflow
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-neo-pink text-black border-2 border-black font-black text-lg size-8 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-black text-lg uppercase">Submit Concept</h4>
                <p className="font-bold text-xs text-black/70 dark:text-zinc-300">
                  Describe your idea, target customer, or core differentiator in our prompt console. No form-filling fatigue.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-neo-yellow text-black border-2 border-black font-black text-lg size-8 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-black text-lg uppercase">Parallel Web Research & Analysis</h4>
                <p className="font-bold text-xs text-black/70 dark:text-zinc-300">
                  Multiple distinct AI agents fire concurrently. They perform live search queries to verify market assumptions, competitor presence, and engineering challenges.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-neo-cyan text-black border-2 border-black font-black text-lg size-8 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-black text-lg uppercase">Lead Judge Synthesis</h4>
                <p className="font-bold text-xs text-black/70 dark:text-zinc-300">
                  A Lead Judge synthesizes all findings, scoring each aspect and providing a final verdict, SWOT analysis, and actionable next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
