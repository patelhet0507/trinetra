import React, { useState } from 'react';
import {
  X,
  FileText,
  Code2,
  ShieldAlert,
  Download,
  Check,
  Copy,
  ExternalLink,
  Cpu,
  Layers,
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'whitepaper' | 'api' | 'compliance';
}

export const DocsModal: React.FC<DocsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'whitepaper',
}) => {
  const [activeTab, setActiveTab] = useState<'whitepaper' | 'api' | 'compliance'>(initialTab);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const sampleApiCurl = `curl -X POST https://api.trinetra.io/v1/decoys/provision \\
  -H "Authorization: Bearer TRX_API_KEY_SEC_99" \\
  -H "Content-Type: application/json" \\
  -d '{
    "decoy_type": "linux_bastion_ssh",
    "inbound_proxy_port": 9000,
    "decoy_port": 2222,
    "canary_honeyfiles": ["aws_sts", "pg_env", "k8s_token"],
    "ephemeral_ttl_seconds": 3600
  }'`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#0B0F17] border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(5,223,133,0.25)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close documentation dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-[#05DF85] border border-emerald-500/40">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono">
              TRINETRA X Technical Documentation
            </h3>
            <p className="text-xs text-slate-400">
              Architecture Whitepaper, REST APIs, and Enterprise Compliance Specifications
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('whitepaper')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'whitepaper'
                ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Technical Whitepaper
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            REST API &amp; SDK
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Enterprise Compliance
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'whitepaper' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white font-mono text-base mb-1">
                Executive Abstract: Active Deception vs. Passive Defense
              </h4>
              <p className="text-slate-400">
                Modern enterprise security operations face an asymmetric disadvantage: perimeter firewalls and endpoint detection (EDR) systems operate reactively. When an intrusion detection rule trips, connections are dropped with TCP RST flags. This immediate defensive feedback allows advanced persistent threats (APTs) to mutate exploit payloads and test alternative ingress channels.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-[#05DF85] font-mono text-sm uppercase">
                Core Innovations in TRINETRA X
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="font-bold font-mono text-white text-xs">
                    1. eBPF Zero-Drop Socket Splicing
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Kernel-level socket migration with sub-millisecond latency (&lt;0.4ms) without TCP teardown.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="font-bold font-mono text-white text-xs">
                    2. Ephemeral Pod Isolation
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Zero lateral movement risk through strictly enclosed network namespaces with eBPF egress jails.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="font-bold font-mono text-white text-xs">
                    3. Canary Honeytokens
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Synthetic AWS IAM, database connection strings, and canary private keys that alert on exfiltration.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="font-bold font-mono text-white text-xs">
                    4. Automated MITRE CTI
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Live session keylogging and real-time STIX 2.1 taxonomy formatting for instant SIEM ingestion.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#05DF85]">
                POST /v1/decoys/provision
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleApiCurl);
                  setCopiedCurl(true);
                  setTimeout(() => setCopiedCurl(false), 2000);
                }}
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedCurl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{sampleApiCurl}</code>
            </pre>

            <div className="text-xs text-slate-400 space-y-1">
              <p>Supported webhook integrations: Splunk HEC, Microsoft Sentinel, Cortex XSOAR, AWS Security Hub.</p>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold font-mono text-sm">
                  SOC 2 Type II Certified
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Full security, confidentiality, and availability audit controls rigorously verified.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold font-mono text-sm">
                  ISO / IEC 27001
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Information security management framework compliant across global telemetry regions.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-white font-bold font-mono text-sm">FedRAMP Ready</div>
                <div className="text-xs text-slate-400 mt-1">
                  Isolated air-gapped deployment blueprints for federal and defense enterprise clouds.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-white font-bold font-mono text-sm">HIPAA Compliant</div>
                <div className="text-xs text-slate-400 mt-1">
                  Decoy environments contain zero patient or production PII data; 100% synthetic files.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
