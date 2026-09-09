import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Boxes,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const EnterpriseSecurity: React.FC = () => {
  const guardrails = [
    {
      id: 'ephemeral-segmentation',
      title: 'Complete Network Air-Gap',
      icon: Boxes,
      description:
        'Every decoy sandbox executes in a dedicated, isolated Linux network namespace. All egress connections to your production VPC or internal subnets are blocked at line rate.',
      bullets: [
        'Zero lateral movement to real servers',
        'Automatic sandbox destruction post-session',
        'Air-gapped memory space',
      ],
      badge: 'Zero Lateral Risk',
    },
    {
      id: 'ebpf-kernel-safety',
      title: 'Crash-Proof Kernel Safety',
      icon: Cpu,
      description:
        'Unlike legacy security agents that install risky monolithic kernel drivers, TRINETRA X runs lightweight, verified eBPF bytecode that is statically verified by the OS before running.',
      bullets: [
        'Zero risk of kernel panics or blue screens',
        'Sub-millisecond packet inspection',
        'No invasive background system hooks',
      ],
      badge: '100% Stable',
    },
    {
      id: 'synthetic-realism',
      title: 'High-Fidelity Realism',
      icon: Lock,
      description:
        'Decoys that look artificial are quickly spotted. TRINETRA X presents realistic command prompts, honeyfiles, and simulated services to keep attackers typing while you study their methods.',
      bullets: [
        'Realistic synthetic file systems & databases',
        'Keeps adversaries occupied away from real targets',
        'High-confidence intelligence with 0 false alarms',
      ],
      badge: 'High Engagement',
    },
  ];

  return (
    <section
      id="security"
      className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#0B0F19]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety &amp; Isolation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for unconditional containment
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Active deception requires absolute safety. TRINETRA X guarantees that trapped attackers cannot pivot or affect your real production environment.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guardrails.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#111726] rounded-2xl p-6 sm:p-7 border border-white/[0.08] hover:border-white/20 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  {item.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
