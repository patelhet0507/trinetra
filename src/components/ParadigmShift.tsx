import React from 'react';
import {
  XCircle,
  CheckCircle2,
  Shield,
  Zap,
  Eye,
  Server,
} from 'lucide-react';

export const ParadigmShift: React.FC = () => {
  return (
    <section
      id="comparison"
      className="py-12 sm:py-20 md:py-24 border-t border-white/[0.06] bg-[#0B0F19]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-3">
            <span>Why Traditional Defenses Fail</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            The difference between blocking and active deception
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            When you block an attacker, they learn what tripped your alarm and try again with a new IP. When you deceive them, you gain total visibility.
          </p>
        </div>

        {/* Direct Comparison: Switches to a clean vertical stack on mobile, 2 columns on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* Column 1: Traditional Firewalls */}
          <div className="bg-[#111726] rounded-2xl p-5 sm:p-7 md:p-8 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 sm:mb-6 border-b border-white/[0.08]">
                <div>
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    Traditional Defense
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Firewalls &amp; WAFs
                  </h3>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Alerts the adversary immediately</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed break-words">
                      Dropping the connection or sending TCP resets signals to the attacker that their signature was caught.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Attacker rotates IP in seconds</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed break-words">
                      Adversaries simply spin up a new proxy or residential IP and continue probing unnoticed.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">You learn zero tactical intelligence</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed break-words">
                      All your security team gets is a generic &ldquo;IP blocked&rdquo; log with no insight into their tools or payloads.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Constant alert fatigue</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed break-words">
                      Security teams drown in tens of thousands of low-context firewall notifications daily.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
              <span>Outcome:</span>
              <span className="text-rose-300 font-medium">Perpetual whack-a-mole</span>
            </div>
          </div>

          {/* Column 2: TRINETRA X Active Deception */}
          <div className="bg-[#111c2a] rounded-2xl p-5 sm:p-7 md:p-8 border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 mb-5 sm:mb-6 border-b border-emerald-500/20">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Active Deception
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    TRINETRA X
                  </h3>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Silent redirection (Zero alarm)</div>
                    <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                      Attackers are redirected without connection breaks. They believe they have found an unpatched server.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Attacker burns their zero-day tools</div>
                    <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                      Thinking they broke in, adversaries deploy their private scripts, payloads, and toolsets in our sandbox.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">Ground-truth intelligence extraction</div>
                    <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                      Every command, downloaded malware, and keylog is captured and converted into instant defense rules.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white break-words">100% Real production protection</div>
                    <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                      Production databases and servers remain completely invisible and isolated from the attacker.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between">
              <span>Outcome:</span>
              <span className="text-emerald-300 font-semibold">Attacker neutralized &amp; studied</span>
            </div>
          </div>
        </div>

        {/* How It Works in 3 Clear Steps: Vertical stack on mobile, 3 cols on md */}
        <div id="how-it-works" className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How TRINETRA X Works in 3 Steps
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Automated, seamless, and completely transparent to legitimate users.
            </p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#111726] rounded-xl p-4 sm:p-5 border border-white/[0.08]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
                1
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                Silent Intercept
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-kernel socket splicing identifies malicious attempts in &lt;0.4ms and transfers the connection without resetting TCP state.
              </p>
            </div>

            <div className="bg-[#111726] rounded-xl p-4 sm:p-5 border border-white/[0.08]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
                2
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                Isolated Decoy
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The attacker interacts with an ephemeral decoy container stocked with synthetic honeyfiles, keeping them engaged safely.
              </p>
            </div>

            <div className="bg-[#111726] rounded-xl p-4 sm:p-5 border border-white/[0.08]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
                3
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                Instant Threat Intel
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All attacker commands, binaries, and C2 servers are compiled into actionable indicators of compromise (IOCs) for your SOC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
