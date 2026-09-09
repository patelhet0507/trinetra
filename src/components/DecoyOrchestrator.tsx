import React, { useState } from 'react';
import {
  Layers,
  Server,
  Code2,
  Sliders,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Terminal,
  Database,
  Cloud,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CANARY_PRESETS, CanaryPreset } from '../data/deceptionSuiteData';

export const DecoyOrchestrator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CANARY_PRESETS[0].id);
  const [latencyMs, setLatencyMs] = useState<number>(24);
  const [injectHoneyTokens, setInjectHoneyTokens] = useState<boolean>(true);
  const [memoryLimitMb, setMemoryLimitMb] = useState<number>(64);
  const [activeCodeTab, setActiveCodeTab] = useState<'bpf' | 'docker'>('bpf');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [deployState, setDeployState] = useState<'idle' | 'deploying' | 'deployed'>('idle');

  const selectedPreset: CanaryPreset =
    CANARY_PRESETS.find((p) => p.id === selectedPresetId) || CANARY_PRESETS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDeploySimulation = () => {
    setDeployState('deploying');
    setTimeout(() => {
      setDeployState('deployed');
      setTimeout(() => {
        setDeployState('idle');
      }, 3500);
    }, 1200);
  };

  return (
    <section id="decoy-orchestrator" className="py-12 sm:py-16 md:py-20 bg-[#080d16] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-2">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Autonomous Canary Provisioning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Decoy Fleet Orchestrator &amp; Canary Builder
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Generate instant high-fidelity decoys and honeypots. Select a target service to generate the exact in-kernel eBPF socket redirect rule and hardened ephemeral container manifest.
          </p>
        </div>

        {/* 2-Column Grid: Config Controls vs Code Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Preset Selection & Sliders (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Presets List */}
            <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                1. Select Canary Service Archetype
              </h3>

              <div className="space-y-2">
                {CANARY_PRESETS.map((preset) => {
                  const isSelected = preset.id === selectedPreset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setDeployState('idle');
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm'
                          : 'bg-[#0a0f19] border-white/[0.06] text-slate-300 hover:border-white/[0.15] hover:bg-[#0d1422]'
                      }`}
                    >
                      <div className={`p-2 rounded-md shrink-0 ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-slate-400'}`}>
                        {preset.category === 'Databases' && <Database className="w-4 h-4" />}
                        {preset.category === 'Cloud APIs' && <Cloud className="w-4 h-4" />}
                        {preset.category === 'Shell & Bastion' && <Terminal className="w-4 h-4" />}
                        {preset.category === 'Web Frameworks' && <Server className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-white truncate">{preset.name}</span>
                          <span className="font-mono text-[10px] text-emerald-400 font-medium">:{preset.defaultPort}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Sliders */}
            <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-4 sm:p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Deceptive Realism Tuning
              </h3>

              {/* Artificial Latency Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Simulated Network Latency:</span>
                  <span className="font-mono text-emerald-400 font-bold">{latencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="120"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-slate-500">
                  Mimics slow legacy servers so attackers spend longer waiting for responses.
                </p>
              </div>

              {/* Memory Limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Sandbox Memory Limit (tmpfs):</span>
                  <span className="font-mono text-cyan-400 font-bold">{memoryLimitMb} MB</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="256"
                  step="32"
                  value={memoryLimitMb}
                  onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Honey-token toggle */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Inject Tracked Honey-Tokens</span>
                  <span className="text-[10px] text-slate-400 block">Canary API keys alert if leaked onto GitHub or paste sites</span>
                </div>
                <button
                  onClick={() => setInjectHoneyTokens(!injectHoneyTokens)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    injectHoneyTokens ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      injectHoneyTokens ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Code Generator & Deployment Simulator (7 cols) */}
          <div className="lg:col-span-7 bg-[#070b12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono">
            
            {/* Tab Bar */}
            <div className="bg-[#0d131f] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCodeTab('bpf')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeCodeTab === 'bpf'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  eBPF Splicing Hook (.c)
                </button>
                <button
                  onClick={() => setActiveCodeTab('docker')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeCodeTab === 'docker'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ephemeral Manifest (.yaml)
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopy(activeCodeTab === 'bpf' ? selectedPreset.bpfSnippet : selectedPreset.dockerSnippet)
                }
                className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-[#05080f] text-xs overflow-x-auto min-h-[300px] leading-relaxed text-slate-300">
              <pre className="font-mono">
                <code>
                  {activeCodeTab === 'bpf' ? selectedPreset.bpfSnippet : selectedPreset.dockerSnippet}
                </code>
              </pre>
            </div>

            {/* Deployment Action Bar */}
            <div className="bg-[#0c121e] px-4 py-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero downtime &bull; In-kernel hook activated without service restarts</span>
              </div>

              <button
                onClick={handleDeploySimulation}
                disabled={deployState !== 'idle'}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-80 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {deployState === 'deploying' && (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling eBPF bytecode...</span>
                  </>
                )}
                {deployState === 'deployed' && (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-950" />
                    <span>Decoy Live on Port :{selectedPreset.defaultPort}!</span>
                  </>
                )}
                {deployState === 'idle' && (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulate 1-Click Kernel Deploy</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
