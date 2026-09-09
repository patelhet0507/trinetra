import React, { useState } from 'react';
import {
  Grid,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { MITRE_TECHNIQUES, MitreTechnique } from '../data/deceptionSuiteData';

export const MitreDeceptionMatrix: React.FC = () => {
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string>(MITRE_TECHNIQUES[1].id);
  const [activeTacticFilter, setActiveTacticFilter] = useState<string>('All');

  const tactics = ['All', 'Reconnaissance', 'Initial Access', 'Execution', 'Persistence', 'Lateral Movement', 'Exfiltration'];

  const filteredTechniques = activeTacticFilter === 'All'
    ? MITRE_TECHNIQUES
    : MITRE_TECHNIQUES.filter((t) => t.tactic === activeTacticFilter);

  const selectedTechnique: MitreTechnique =
    MITRE_TECHNIQUES.find((t) => t.id === selectedTechniqueId) || MITRE_TECHNIQUES[0];

  return (
    <section id="mitre-matrix" className="py-12 sm:py-16 md:py-20 bg-[#0B0F19] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-medium mb-2">
            <Grid className="w-3 h-3 text-purple-400" />
            <span>Adversary Kill Chain Coverage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            MITRE ATT&amp;CK&reg; Active Deception Matrix
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Rather than simply dropping suspicious packets and alerting adversaries to switch techniques, TRINETRA X satisfies their exploit requests with synthetic payloads across every stage of the cyber kill chain.
          </p>
        </div>

        {/* Tactic Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {tactics.map((tac) => (
            <button
              key={tac}
              onClick={() => setActiveTacticFilter(tac)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTacticFilter === tac
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                  : 'bg-[#111726] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tac}
            </button>
          ))}
        </div>

        {/* Matrix Grid & Technique Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Technique Cards Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTechniques.map((tech) => {
              const isSelected = tech.id === selectedTechnique.id;
              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechniqueId(tech.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#151c2e] border-purple-400/80 shadow-lg shadow-purple-500/10'
                      : 'bg-[#111726] border-white/[0.08] hover:border-white/[0.2] hover:bg-[#131b2c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                        {tech.techniqueId}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{tech.tactic}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-1.5 line-clamp-1">
                      {tech.name}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {tech.status}
                    </span>
                    <span className="text-purple-300 font-medium flex items-center gap-0.5 hover:translate-x-0.5 transition-transform">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Deception Blueprint Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#111726] border border-white/[0.1] rounded-2xl p-5 sm:p-6 shadow-xl sticky top-24 space-y-4">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-mono text-purple-400 tracking-wider">
                  Tactical Deception Blueprint
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedTechnique.name}</span>
                  <span className="font-mono text-xs text-purple-300 font-normal">({selectedTechnique.techniqueId})</span>
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium shrink-0">
                Active Decoy
              </span>
            </div>

            {/* Technique Description */}
            <div className="text-xs text-slate-300 bg-[#090e18] p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              <span className="text-slate-400 block font-semibold mb-0.5">Adversary Tactic:</span>
              {selectedTechnique.description}
            </div>

            {/* Deception Method */}
            <div className="space-y-1.5 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Active Deception Response
              </span>
              <p className="text-slate-300 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl leading-relaxed">
                {selectedTechnique.deceptionMethod}
              </p>
            </div>

            {/* Kernel Hook Specification */}
            <div className="space-y-1.5 text-xs font-mono">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                eBPF In-Kernel Redirect Point
              </span>
              <div className="bg-[#070a12] p-2.5 rounded-lg border border-white/[0.08] text-cyan-300 text-[11px] break-all">
                {selectedTechnique.kernelHook}
              </div>
            </div>

            {/* What Attacker Sees */}
            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-semibold">Adversary Perception:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed italic bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                &ldquo;{selectedTechnique.attackerPerception}&rdquo;
              </p>
            </div>

            {/* Ground Truth Metric */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
              <span>Threat Dwell Time Gained:</span>
              <span className="text-emerald-400 font-semibold font-mono">Avg +14.2 minutes</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
