import React from 'react';
import {
  Shield,
  ArrowRight,
  Lock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { InteractiveSchematic } from './InteractiveSchematic';

interface HeroProps {
  onBookDemo: () => void;
  onViewArchitecture: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookDemo }) => {
  const scrollToDemo = () => {
    const el = document.getElementById('demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className="relative pt-16 sm:pt-24 pb-16 overflow-hidden bg-[#0B0F19]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Subtle category badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Autonomous Active Cyber Deception</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-5">
            Don&apos;t just block attackers.{' '}
            <span className="text-emerald-400 block mt-1">
              Trap and study them.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            When hackers strike, traditional firewalls just drop the connection—leaving you blind. TRINETRA X silently misdirects attacks into isolated decoy sandboxes, letting you observe zero-day exploits in safety while your real servers stay untouched.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={scrollToDemo}
              id="hero-primary-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBookDemo}
              id="hero-secondary-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-colors cursor-pointer"
            >
              <span>Request Sandbox Access</span>
            </button>
          </div>

          {/* 3 Core Value Chips */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero risk to production infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Adversaries never suspect redirection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Actionable zero-day intelligence</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Simulator */}
        <div className="mt-4">
          <InteractiveSchematic />
        </div>
      </div>
    </section>
  );
};
