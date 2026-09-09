import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Server,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'provisioning' | 'ready'>('form');
  const [formData, setFormData] = useState({
    name: 'Alex Vance',
    email: 'alex.vance@enterprise-defense.com',
    company: 'Apex Cyber Infrastructure',
    role: 'CISO / Head of SecOps',
    environment: 'AWS EKS & Hybrid Linux',
  });

  const [provisionProgress, setProvisionProgress] = useState<number>(0);
  const [provisionLog, setProvisionLog] = useState<string>('Initializing eBPF socket listener...');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('provisioning');
    setProvisionProgress(15);
    setProvisionLog('Allocating ephemeral decoy sandbox namespace...');

    setTimeout(() => {
      setProvisionProgress(45);
      setProvisionLog('Deploying Linux SSH Bastion Decoy on Port 2222...');
    }, 800);

    setTimeout(() => {
      setProvisionProgress(75);
      setProvisionLog('Seeding canary honeyfiles (/var/data/AWS_SECRET_KEYS.env)...');
    }, 1600);

    setTimeout(() => {
      setProvisionProgress(100);
      setProvisionLog('Deception mesh armed! Sandbox ready.');
      setStep('ready');
    }, 2400);
  };

  const handleReset = () => {
    setStep('form');
    setProvisionProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#0B0F17] border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(5,223,133,0.3)]">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-[#05DF85] border border-emerald-500/40 shadow-[0_0_15px_rgba(5,223,133,0.3)]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono">
              Request Live Sandbox Demo
            </h3>
            <p className="text-xs text-emerald-300 font-mono">
              Phase 1 Interactive Cyber Deception Pod
            </p>
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#05DF85]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Corporate Work Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#05DF85]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Company / Org
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#05DF85]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#05DF85]"
                >
                  <option>CISO / Head of SecOps</option>
                  <option>Lead SOC Analyst</option>
                  <option>Red Team / Adversary Emulation</option>
                  <option>DevSecOps / Platform Engineer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Target Cloud Environment
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#05DF85]"
              >
                <option>AWS EKS &amp; Hybrid Linux</option>
                <option>Google Cloud Platform (GKE / Compute Engine)</option>
                <option>Microsoft Azure (AKS / Virtual Machines)</option>
                <option>On-Premises Bare-Metal Datacenter</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 font-bold font-mono text-sm transition-all shadow-[0_0_20px_rgba(5,223,133,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deploy My Sandbox Pod</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-mono">
              Zero credit card required. 100% ephemeral isolation guaranteed.
            </p>
          </form>
        )}

        {step === 'provisioning' && (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#05DF85] animate-pulse">
              <Terminal className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-mono">
                Spinning Up Isolated Decoy Sandbox...
              </h4>
              <p className="text-xs text-emerald-400 font-mono mt-1">{provisionLog}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#05DF85] h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_#05DF85]"
                style={{ width: `${provisionProgress}%` }}
              />
            </div>
          </div>
        )}

        {step === 'ready' && (
          <div className="py-4 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#05DF85]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white font-mono">
                Decoy Sandbox Provisioned!
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Your dedicated high-interaction pod is online with canary honeytokens deployed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Assigned Decoy Pod:</span>
                <span className="text-[#05DF85] font-bold">trx-pod-42.demo.internal</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inbound Proxy Port:</span>
                <span className="text-white font-bold">9000 (Python Gateway)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SSH Decoy Port:</span>
                <span className="text-white font-bold">2222 (Sandboxed)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Canary File:</span>
                <span className="text-amber-300 font-bold">/var/data/AWS_SECRET_KEYS.env</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 font-bold font-mono text-sm transition-all cursor-pointer"
            >
              Access PoC Telemetry Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
