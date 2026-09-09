import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Rocket,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ROADMAP_DATA } from '../data/cyberData';

interface RoadmapProps {
  onRequestDemo: () => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({ onRequestDemo }) => {
  return (
    <section
      id="roadmap"
      className="py-20 md:py-28 relative bg-[#07090E] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0A1018] border border-emerald-500/30 text-xs font-mono text-[#05DF85] mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span className="font-bold tracking-widest uppercase text-[10px]">PLATFORM EVOLUTION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
            PRODUCT ARCHITECTURE{' '}
            <span className="text-[#05DF85] block mt-1 text-glow-emerald">
              ROADMAP TIMELINE
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From our validated Phase 1 Python &amp; Streamlit PoC to kernel-level eBPF socket redirection and autonomous enterprise deception mesh.
          </p>
        </div>

        {/* 3-Phase Roadmap Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {ROADMAP_DATA.map((phase, idx) => {
            const isCurrent = phase.status === 'Current PoC';
            const isInProgress = phase.status === 'In Progress';

            return (
              <div
                key={idx}
                className={`rounded-lg p-6 sm:p-7 flex flex-col justify-between border relative overflow-hidden transition-all duration-200 ${
                  isCurrent
                    ? 'tactical-panel corner-bracket border-[#05DF85] shadow-xl'
                    : isInProgress
                    ? 'tactical-panel corner-bracket border-amber-500/40'
                    : 'tactical-panel corner-bracket border-white/[0.08]'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-[#05DF85] text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider rounded-bl">
                    OPERATIONAL POC
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#05DF85] font-bold uppercase tracking-wider">
                      {phase.phase}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-xs font-mono text-slate-400">{phase.timeline}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-1 uppercase tracking-wide">{phase.title}</h3>
                  <p className="text-xs text-emerald-300 font-mono mb-6 uppercase tracking-wider">{phase.tagline}</p>

                  {/* Milestones List */}
                  <div className="space-y-3 mb-8">
                    {phase.milestones.map((ms, midx) => (
                      <div key={midx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        {isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-[#05DF85] shrink-0 mt-0.5" />
                        ) : isInProgress ? (
                          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <Rocket className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{ms}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer status */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40'
                        : isInProgress
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {phase.status}
                  </span>

                  {isCurrent && (
                    <button
                      onClick={onRequestDemo}
                      className="text-xs font-mono text-[#05DF85] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <span>Test Phase 1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-lg tactical-panel corner-bracket border border-white/10 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
              READY TO DEPLOY TRINETRA X ACROSS YOUR PERIMETER?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Join enterprise security teams transforming blind alerts into high-fidelity cyber threat intelligence.
            </p>
            <div className="pt-3">
              <button
                onClick={onRequestDemo}
                className="px-8 py-3.5 bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 font-mono font-bold text-sm uppercase tracking-wider rounded-md transition-all active:translate-y-0.5 cursor-pointer shadow-lg"
              >
                Request Live Sandbox Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
