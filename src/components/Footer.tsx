import React from 'react';
import {
  Shield,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  onOpenDocs: (tab?: 'whitepaper' | 'api' | 'compliance') => void;
  onRequestDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onRequestDemo }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer-section"
      className="bg-[#0B0F19] border-t border-white/[0.08] text-slate-400 py-12"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight">
                TRINETRA <span className="text-emerald-400 font-bold">X</span>
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous active cyber deception platform.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              Simulator
            </a>
            <a href="#comparison" className="hover:text-white transition-colors">
              Comparison
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Safety
            </a>
            <button
              onClick={() => onOpenDocs('whitepaper')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Technical Docs
            </button>
            <button
              onClick={onRequestDemo}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TRINETRA X Security. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
