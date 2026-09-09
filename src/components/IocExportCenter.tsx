import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  Terminal,
  ExternalLink,
  Filter,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LIVE_IOC_FEED, IocEntry } from '../data/deceptionSuiteData';

export const IocExportCenter: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'stix' | 'splunk' | 'kql' | 'suricata' | 'csv'>('stix');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredIocs = typeFilter === 'All'
    ? LIVE_IOC_FEED
    : LIVE_IOC_FEED.filter((i) => i.type === typeFilter);

  // Generate format outputs dynamically
  const generateExportText = (): string => {
    switch (selectedFormat) {
      case 'stix':
        return JSON.stringify(
          {
            type: 'bundle',
            id: `bundle--${Date.now()}`,
            spec_version: '2.1',
            objects: filteredIocs.map((ioc) => ({
              type: 'indicator',
              id: `indicator--${ioc.id}`,
              name: `Decoy Intercept: ${ioc.threatActor}`,
              pattern: `[ipv4-addr:value = '${ioc.indicator}']`,
              pattern_type: 'stix',
              valid_from: new Date().toISOString(),
              labels: ['honeypot-derived', 'trinetra-x', ioc.mitreRef],
              confidence: 95,
            })),
          },
          null,
          2
        );

      case 'splunk':
        const ips = filteredIocs.filter((i) => i.type === 'IPv4').map((i) => `"${i.indicator}"`).join(', ');
        return `index=firewall OR index=network (src_ip IN (${ips}) OR query IN ("c2.botnet-mesh.cc"))\n| stats count, earliest(_time) as first_seen, latest(_time) as last_seen by src_ip, dest_port\n| eval threat="TRINETRA_DECOY_IOC"\n| sort -count`;

      case 'kql':
        const kqlIps = filteredIocs.filter((i) => i.type === 'IPv4').map((i) => `"${i.indicator}"`).join(' or ');
        return `source.ip: (${kqlIps}) or destination.domain: ("c2.botnet-mesh.cc") and event.outcome: "failure"`;

      case 'suricata':
        return filteredIocs
          .filter((i) => i.type === 'IPv4')
          .map(
            (ioc, idx) =>
              `alert ip any any -> [${ioc.indicator}] any (msg:"TRINETRA-X Ground-Truth Decoy IOC - ${ioc.threatActor}"; reference:url,mitre.org/techniques/${ioc.mitreRef}; sid:900000${idx + 1}; rev:1;)`
          )
          .join('\n');

      case 'csv':
        const header = 'id,indicator_type,indicator_value,severity,threat_actor,mitre_reference,matched_decoy\n';
        const rows = filteredIocs
          .map(
            (i) =>
              `${i.id},${i.type},"${i.indicator}",${i.severity},"${i.threatActor}",${i.mitreRef},${i.matchedDecoy}`
          )
          .join('\n');
        return header + rows;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateExportText();
    const extension = selectedFormat === 'csv' ? 'csv' : selectedFormat === 'stix' ? 'json' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trinetra-ioc-feed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="ioc-export" className="py-12 sm:py-16 md:py-20 bg-[#080d16] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium mb-2">
            <Share2 className="w-3 h-3 text-cyan-400" />
            <span>Automated Threat Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ground-Truth IOC Feed &amp; SIEM Exporter
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every trapped honeypot interaction generates verified, zero-false-positive Indicators of Compromise (IOCs). Export feeds directly into Splunk, Elastic, CrowdStrike, or Suricata.
          </p>
        </div>

        {/* 2-Column Grid: Live IOC Table vs SIEM Code Export */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Live Verified IOC Table (6 cols) */}
          <div className="lg:col-span-6 bg-[#111726] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Live Trapped IOC Stream ({filteredIocs.length})
                </h3>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['All', 'IPv4', 'SHA-256', 'Domain'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                      typeFilter === f
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white bg-white/[0.04]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable IOC items */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredIocs.map((ioc) => (
                <div
                  key={ioc.id}
                  className="p-2.5 rounded-lg bg-[#070b12] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] font-mono text-slate-300">
                        {ioc.type}
                      </span>
                      <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.2 rounded">
                        {ioc.severity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Seen: {ioc.firstSeen}</span>
                  </div>

                  <div className="font-mono text-[11px] text-emerald-300 break-all select-all font-semibold">
                    {ioc.indicator}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/[0.04]">
                    <span>{ioc.threatActor}</span>
                    <span className="text-purple-300 font-mono">{ioc.mitreRef}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Zero False Positives
              </span>
              <span>Honeypot Decoy Origin</span>
            </div>
          </div>

          {/* Right Column: SIEM / Format Code Generator (6 cols) */}
          <div className="lg:col-span-6 bg-[#070b12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono">
            
            {/* Format Selector Bar */}
            <div className="bg-[#0d131f] px-3 sm:px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 shrink-0">
                {[
                  { id: 'stix', label: 'STIX 2.1' },
                  { id: 'splunk', label: 'Splunk SPL' },
                  { id: 'kql', label: 'Elastic KQL' },
                  { id: 'suricata', label: 'Suricata Rules' },
                  { id: 'csv', label: 'CSV' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedFormat === fmt.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs text-slate-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy export content"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Download feed"
                >
                  <Download className="w-3 h-3" />
                  <span className="text-[10px]">Download</span>
                </button>
              </div>
            </div>

            {/* Code Output Window */}
            <div className="p-4 bg-[#05080f] text-xs overflow-x-auto min-h-[340px] max-h-[380px] leading-relaxed text-slate-300">
              <pre className="font-mono text-[11px]">
                <code>{generateExportText()}</code>
              </pre>
            </div>

            {/* Bottom Integration Status Bar */}
            <div className="bg-[#0b101b] px-4 py-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-sans text-slate-400">
              <span>Ready for automated ingest via REST webhook or TAXII client</span>
              <span className="text-emerald-400 font-mono font-semibold">Feed: /api/v1/taxii/poll</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
