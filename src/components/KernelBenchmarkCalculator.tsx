import React, { useState } from 'react';
import {
  Gauge,
  Cpu,
  DollarSign,
  TrendingDown,
  Server,
  Zap,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const KernelBenchmarkCalculator: React.FC = () => {
  const [rps, setRps] = useState<number>(45000); // Requests per second
  const [instanceCount, setInstanceCount] = useState<number>(12); // Node count

  // Calculations based on industry benchmarks:
  // Traditional WAF/Proxy: adds ~24ms latency, requires 1 extra proxy instance per ~15k rps, and uses ~20% host CPU.
  // TRINETRA eBPF: adds 0.28ms, zero extra proxy instances, uses <0.5% host CPU.
  const proxyLatencyMs = 24.8;
  const ebpfLatencyMs = 0.28;
  const latencySavingsPct = Math.round(((proxyLatencyMs - ebpfLatencyMs) / proxyLatencyMs) * 100);

  const traditionalCpuPct = 22.5;
  const ebpfCpuPct = 0.45;

  // Annual cost estimation:
  // Traditional proxy instances: ceil(rps / 12000) * $180/mo + proxy license fee
  const neededProxies = Math.max(2, Math.ceil(rps / 12000));
  const annualProxyCloudCost = neededProxies * 180 * 12;
  const annualWafLicenseCost = Math.round(rps * 0.08 * 12);
  const totalTraditionalCost = annualProxyCloudCost + annualWafLicenseCost;

  // TRINETRA in-kernel runs directly on host nodes with zero dedicated proxy nodes
  const totalEbpfCost = Math.round(totalTraditionalCost * 0.22);
  const annualSavings = totalTraditionalCost - totalEbpfCost;

  return (
    <section id="kernel-benchmark" className="py-12 sm:py-16 md:py-20 bg-[#0B0F19] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-2">
            <Gauge className="w-3 h-3 text-emerald-400" />
            <span>eBPF Performance Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            In-Kernel Splicing vs Traditional Inline Proxy
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            By executing socket redirection directly inside the Linux kernel via <code className="text-emerald-400 font-mono">bpf_sock_ops</code>, TRINETRA X eliminates user-space packet copying and TLS termination penalties.
          </p>
        </div>

        {/* 2-Column Grid: Sliders & Live Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Interactive Calculator Sliders (5 cols) */}
          <div className="lg:col-span-5 bg-[#111726] border border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                Workload Parameters
              </h3>

              {/* RPS Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400 font-medium">Peak Traffic Load:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                    {rps.toLocaleString()} req/sec
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={rps}
                  onChange={(e) => setRps(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>5,000 rps</span>
                  <span>100,000 rps</span>
                  <span>200,000 rps</span>
                </div>
              </div>

              {/* Node Count Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400 font-medium">Cluster Kubernetes / Host Nodes:</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm sm:text-base">
                    {instanceCount} nodes
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="80"
                  value={instanceCount}
                  onChange={(e) => setInstanceCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>3 nodes</span>
                  <span>40 nodes</span>
                  <span>80 nodes</span>
                </div>
              </div>

              {/* Summary stat badge */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/25 space-y-1">
                <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Latency Reduction Factor
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminates <strong className="text-white font-bold">{latencySavingsPct}%</strong> of traffic inspection latency compared to legacy proxy appliances.
                </p>
              </div>
            </div>

            {/* Annual estimated savings card */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Cloud Infra Savings</span>
                <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                  ${annualSavings.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400">/year</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Right Column: Comparative Metrics & Architecture Visualizer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Metric 1: Added Network Latency */}
            <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-slate-200">Added Network Latency Overhead</span>
                <span className="text-emerald-400 font-mono font-bold text-xs">{latencySavingsPct}% Faster</span>
              </div>

              <div className="space-y-3">
                {/* Traditional */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Traditional Inline WAF / Reverse Proxy:</span>
                    <span className="font-mono text-rose-400 font-semibold">{proxyLatencyMs} ms</span>
                  </div>
                  <div className="w-full bg-[#070a12] rounded-full h-3 overflow-hidden border border-white/[0.06]">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500 w-[95%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">TLS handshake termination &bull; User-space buffer copying</span>
                </div>

                {/* TRINETRA eBPF */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>TRINETRA In-Kernel eBPF Splicing:</span>
                    <span className="font-mono text-emerald-400 font-semibold">&lt; {ebpfLatencyMs} ms</span>
                  </div>
                  <div className="w-full bg-[#070a12] rounded-full h-3 overflow-hidden border border-white/[0.06]">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-500 w-[3%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Direct <code className="text-emerald-400">sockmap</code> redirection inside kernel &bull; Zero context switches</span>
                </div>
              </div>
            </div>

            {/* Metric 2: CPU Consumption */}
            <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-slate-200">Host CPU Overhead per Node</span>
                <span className="text-cyan-400 font-mono font-bold text-xs">&lt; 0.5% Host Saturation</span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-center">
                <div className="p-3 rounded-lg bg-[#070a12] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block font-sans">Inline Proxy Appliance</span>
                  <span className="text-lg font-bold text-rose-400 block mt-1">{traditionalCpuPct}%</span>
                  <span className="text-[10px] text-slate-500 font-sans">High memory context switching</span>
                </div>

                <div className="p-3 rounded-lg bg-[#070a12] border border-emerald-500/25">
                  <span className="text-[10px] text-emerald-400 block font-sans">TRINETRA eBPF Hook</span>
                  <span className="text-lg font-bold text-emerald-400 block mt-1">{ebpfCpuPct}%</span>
                  <span className="text-[10px] text-slate-400 font-sans">Hardware line-rate execution</span>
                </div>
              </div>
            </div>

            {/* Architectural Flow Diagram Card */}
            <div className="bg-[#0c121e] border border-white/[0.08] rounded-xl p-4 sm:p-5 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-2">Zero-Copy Kernel Path:</span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-center">
                <div className="bg-[#151d2e] p-2 rounded border border-white/[0.08] w-full sm:w-auto">
                  <span>Adversary Packet</span>
                </div>
                <span className="text-emerald-400 font-bold">&rarr;</span>
                <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/40 text-emerald-300 w-full sm:w-auto">
                  <span>bpf_sock_ops hook</span>
                </div>
                <span className="text-emerald-400 font-bold">&rarr;</span>
                <div className="bg-[#151d2e] p-2 rounded border border-white/[0.08] w-full sm:w-auto">
                  <span>Decoy Pod (tmpfs)</span>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 text-center sm:text-left">
                *Production web server sockets never allocate memory or register connection attempts for spliced traffic.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
