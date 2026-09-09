import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Radio,
  Terminal,
  ShieldCheck,
  Check,
  Copy,
  ChevronRight,
  Code2,
  Lock,
  Zap,
  Sparkles,
} from 'lucide-react';
import { ARCHITECTURE_LAYERS } from '../data/cyberData';
import { ArchitectureLayer } from '../types';

export const ArchitectureLayers: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<ArchitectureLayer>(ARCHITECTURE_LAYERS[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="architecture"
      className="py-20 md:py-28 relative bg-[#07090E] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0A1018] border border-emerald-500/30 text-xs font-mono text-[#05DF85] mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-bold tracking-widest uppercase text-[10px]">CORE SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
            THE 4-LAYER AUTONOMOUS{' '}
            <span className="text-[#05DF85] block mt-1 text-glow-emerald">
              DECEPTION STACK
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From in-kernel eBPF socket splicing to high-interaction ephemeral decoy sandboxes and automated MITRE ATT&amp;CK CTI extraction.
          </p>
        </div>

        {/* 4 Layers Tabs / Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isSelected = activeLayer.id === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer)}
                className={`text-left p-4.5 rounded-lg border transition-all duration-150 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'tactical-panel-active border-[#05DF85]'
                    : 'bg-[#0A0E17] border-white/[0.08] hover:border-white/20 hover:bg-[#0E1420]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#05DF85]" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-[#05DF85] text-slate-950'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    LAYER 0{layer.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">0{layer.number} / 04</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white group-hover:text-[#05DF85] transition-colors uppercase tracking-wide">
                  {layer.shortTitle}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {layer.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Layer Deep Dive Box */}
        <div className="rounded-lg tactical-panel corner-bracket p-6 sm:p-8 lg:p-10 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Explanations & Key Specs */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#05DF85] mb-2 uppercase tracking-wider font-bold">
                  <span>Architecture Deep Dive</span>
                  <span>•</span>
                  <span>Layer {activeLayer.number} of 4</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                  {activeLayer.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400 font-mono mt-1 uppercase tracking-wider">
                  {activeLayer.subtitle}
                </p>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {activeLayer.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {activeLayer.keySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-white/10"
                  >
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                      {spec.metric}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* Technologies Included */}
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2.5 uppercase tracking-wider font-semibold">
                  Underlying Technology Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeLayer.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guardrail Callout */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-emerald-300 font-bold block font-mono mb-0.5">
                    Security Guardrail Guarantee:
                  </strong>
                  {activeLayer.guardrail}
                </div>
              </div>
            </div>

            {/* Right Col: Code / Telemetry Inspector */}
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl">
                {/* Code Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono text-slate-300 ml-2 font-bold">
                      trinetra_{activeLayer.id.replace('-', '_')}.{activeLayer.codeLanguage}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(activeLayer.codeSnippet)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Syntax Highlight Block */}
                <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-950 max-h-[420px] overflow-y-auto">
                  <code>{activeLayer.codeSnippet}</code>
                </pre>

                {/* Sub-bar telemetry status */}
                <div className="px-4 py-2.5 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-[#05DF85] font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>In-Kernel Runtime Verified (0 Overhead)</span>
                  </span>
                  <span className="text-slate-500">UTF-8 / Strict Typing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
