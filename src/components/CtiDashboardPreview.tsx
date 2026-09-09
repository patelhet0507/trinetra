import React, { useState } from 'react';
import {
  ShieldAlert,
  Database,
  Radio,
  FileJson,
  Download,
  Check,
  Copy,
  Terminal,
  Filter,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { INITIAL_CAPTURED_INCIDENTS, MITRE_TACTICS } from '../data/cyberData';
import { CapturedIncident } from '../types';

export const CtiDashboardPreview: React.FC = () => {
  const [incidents] = useState<CapturedIncident[]>(INITIAL_CAPTURED_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<CapturedIncident>(INITIAL_CAPTURED_INCIDENTS[0]);
  const [activeTab, setActiveTab] = useState<'incidents' | 'mitre' | 'stix'>('incidents');
  const [copiedStix, setCopiedStix] = useState<boolean>(false);

  const sampleStixJson = JSON.stringify(
    {
      type: 'bundle',
      id: 'bundle--8d7f2a1b-3c4e-4f5a-6b7c-8d9e0f1a2b3c',
      spec_version: '2.1',
      objects: [
        {
          type: 'threat-actor',
          spec_version: '2.1',
          id: 'threat-actor--789abcde-1234-5678-90ab-cdef12345678',
          name: 'TRINETRA-TRAPPED-ADVERSARY-185.220.101.42',
          aliases: ['Tor-Exit-Spray-Actor'],
          threat_actor_types: ['hacker', 'exploit-probing'],
          sophistication: 'intermediate',
        },
        {
          type: 'indicator',
          spec_version: '2.1',
          id: 'indicator--99998888-7777-6666-5555-444433332222',
          indicator_types: ['malicious-activity'],
          pattern: "[ipv4-addr:value = '185.220.101.42']",
          pattern_type: 'stix',
          valid_from: '2026-09-09T14:22:01Z',
          confidence: 100,
          description: 'Attacker captured in TRINETRA X Decoy Pod 42. Tripped AWS IAM canary token.',
          external_references: [
            { source_name: 'mitre-attack', external_id: 'T1059.004' },
            { source_name: 'mitre-attack', external_id: 'T1552.001' },
          ],
        },
      ],
    },
    null,
    2
  );

  return (
    <section
      id="cti-dashboard"
      className="py-20 md:py-28 relative bg-[#07090E] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0A1018] border border-emerald-500/30 text-xs font-mono text-[#05DF85] mb-4">
            <Database className="w-3.5 h-3.5" />
            <span className="font-bold tracking-widest uppercase text-[10px]">CYBER THREAT INTELLIGENCE (CTI)</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
            AUTOMATED THREAT INTEL &amp;{' '}
            <span className="text-[#05DF85] block mt-1 text-glow-emerald">
              MITRE ATT&amp;CK MAPPING
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Every adversary action in TRINETRA X decoys generates rich, high-fidelity STIX 2.1 intelligence, real-time keylogs, and automated SIEM IOC packages.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-md bg-[#05080E] border border-white/10">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === 'incidents'
                  ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Captured Incidents
            </button>
            <button
              onClick={() => setActiveTab('mitre')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === 'mitre'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MITRE ATT&amp;CK Matrix
            </button>
            <button
              onClick={() => setActiveTab('stix')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === 'stix'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              STIX 2.1 Feed (JSON)
            </button>
          </div>
        </div>

        {/* Tab 1: Live Captured Incidents */}
        {activeTab === 'incidents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List of Incidents */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono text-slate-400 px-1 uppercase tracking-wider font-bold">
                Live Containment Queue ({incidents.length})
              </div>
              {incidents.map((inc) => {
                const isSelected = selectedIncident.id === inc.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`w-full text-left p-4.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'glass-card border-[#05DF85] shadow-[0_0_20px_rgba(5,223,133,0.2)]'
                        : 'bg-slate-950/60 border-white/[0.08] hover:border-white/20 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                        <span>{inc.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            inc.status === 'Trapped & Active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{inc.timestamp}</span>
                    </div>

                    <div className="text-xs font-mono text-emerald-300 font-semibold">{inc.attackerIp}</div>
                    <div className="text-xs text-slate-400 mt-1">{inc.country}</div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.08]">
                      <span>Assigned Decoy:</span>
                      <span className="text-white truncate font-medium">{inc.decoyAssigned}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Incident Detail Inspector */}
            <div className="lg:col-span-7 rounded-2xl glass-card border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#05DF85] uppercase tracking-wider font-bold">
                    Forensic Incident Dossier
                  </div>
                  <h3 className="text-xl font-bold text-white font-mono mt-0.5">
                    {selectedIncident.id} — {selectedIncident.attackerIp}
                  </h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-950 text-[#05DF85] border border-emerald-500/40 font-bold">
                  {selectedIncident.mitreCode}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">GEO LOCATION</div>
                  <div className="text-white font-semibold mt-1 truncate">
                    {selectedIncident.country}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">TARGET PORT</div>
                  <div className="text-white font-semibold mt-1">
                    Port {selectedIncident.targetPort}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">CONFIDENCE</div>
                  <div className="text-emerald-400 font-bold mt-1">100% Signal</div>
                </div>
              </div>

              {/* Canary Token Alert */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono">
                <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Honeytoken / Canary Tripped:
                </div>
                <div className="text-amber-200">{selectedIncident.canaryTriggered}</div>
              </div>

              {/* Recorded Shell Commands */}
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  Live Keylogger Logged Sequences:
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs space-y-1.5">
                  {selectedIncident.keystrokes.map((cmd, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-[#05DF85] select-none font-bold">#</span>
                      <span className="text-emerald-300 font-mono">{cmd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Hash */}
              <div className="text-xs font-mono text-slate-400">
                <span className="font-bold">Forensic Memory SHA-256: </span>
                <span className="text-[#05DF85] break-all">{selectedIncident.sha256}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MITRE ATT&CK Matrix */}
        {activeTab === 'mitre' && (
          <div className="rounded-2xl glass-card border border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white font-mono">
                  Enterprise MITRE ATT&amp;CK Matrix Heatmap
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Autonomous correlation engine tagging adversarial techniques captured inside TRINETRA X decoy pods.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                6 Active Techniques Mapped
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MITRE_TACTICS.map((tactic) => (
                <div
                  key={tactic.id}
                  className="p-4.5 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {tactic.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        tactic.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {tactic.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{tactic.name}</h4>
                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Captured Intruders:</span>
                    <span className="text-[#05DF85] font-bold">{tactic.capturedCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: STIX 2.1 Exporter */}
        {activeTab === 'stix' && (
          <div className="rounded-2xl glass-card border border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-emerald-400" />
                  <span>STIX 2.1 Automated Threat Indicator Export</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ready for direct ingestion into Splunk, Microsoft Sentinel, Cortex XSOAR, and TAXII 2.1 servers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sampleStixJson);
                    setCopiedStix(true);
                    setTimeout(() => setCopiedStix(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(5,223,133,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedStix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStix ? 'Copied STIX JSON' : 'Copy STIX Package'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[380px] leading-relaxed border border-white/10">
              <code>{sampleStixJson}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
